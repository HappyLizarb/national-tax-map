const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const index = require("../data/department-index.js");
const budgetActuals = require("../data/fiscal/state-budget-actuals.js");

const root = path.resolve(__dirname, "..");
const cents = (value) => Math.round(Number(value) * 100);
const ambiguous = /^(?:unknown|unassigned|unspecified|unallocated|not provided|n\/a|none|\.)$/i;

// Return every file below a directory so archive layers receive the same checks.
function walkFiles(directory) {
  const files = [];
  for (const name of fs.readdirSync(directory)) {
    const file = path.join(directory, name);
    if (fs.statSync(file).isDirectory()) files.push(...walkFiles(file));
    else files.push(file);
  }
  return files;
}

// Return every directory below a directory so archive manifests cannot disappear.
function walkDirectories(directory) {
  const directories = [];
  for (const name of fs.readdirSync(directory)) {
    const child = path.join(directory, name);
    if (!fs.statSync(child).isDirectory()) continue;
    directories.push(child, ...walkDirectories(child));
  }
  return directories;
}

// Hash JSON bytes to catch duplicate checked-in source layers exactly.
function duplicateGroups(files) {
  const hashes = new Map();
  for (const file of files) {
    const hash = crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
    hashes.set(hash, [...(hashes.get(hash) || []), file]);
  }
  return [...hashes.values()].filter((group) => group.length > 1);
}

// Add only local detail/source links; remote URLs remain source citations.
function addLocalReferences(entries, references) {
  for (const entry of entries || []) {
    const url = Array.isArray(entry) ? entry[1] : entry;
    if (typeof url === "string" && url.startsWith("data/")) references.add(url);
  }
}

const dataRoot = path.join(root, "data");
const allFiles = walkFiles(dataRoot);
const jsonFiles = allFiles.filter((file) => file.endsWith(".json"));
const dataJsFiles = allFiles.filter((file) => file.endsWith(".js"));
const activeReferences = new Set();
const activeDetails = new Set();
for (const [scope, actual] of Object.entries(budgetActuals).filter(([, row]) => row.itemizationUrl)) {
  activeReferences.add(actual.itemizationUrl);
  const summary = require(path.join(root, actual.itemizationUrl));
  const rowTotal = summary.departments.reduce((sum, row) => sum + cents(row.amount), 0);
  assert.equal(summary.scope, scope, `${scope} itemization scope`);
  assert.equal(rowTotal, cents(summary.itemizedTotal), `${scope} itemization rows`);
  assert.equal(cents(summary.sourceTotal), cents(actual.itemizedAmount), `${scope} source total`);
  assert.equal(cents(summary.itemizedTotal), cents(actual.itemizedAmount), `${scope} budget coverage`);
  if (!summary.reconciliation.publishedControl) continue;
  assert.equal(cents(summary.reconciliation.publishedControl), cents(actual.amount), `${scope} published control`);
  assert.equal(cents(summary.reconciliation.publishedControl - summary.itemizedTotal),
    cents(summary.reconciliation.unassignedDifference), `${scope} unassigned difference`);
}

for (const [scope, summaryPath] of Object.entries(index)) {
  const summary = require(path.join(root, summaryPath));
  const summaryText = fs.readFileSync(path.join(root, summaryPath), "utf8");
  assert.ok(summaryText.split(/\r?\n/).length > 2, `${scope} summary is compact`);
  addLocalReferences(summary.relatedSources, activeReferences);
  for (const department of summary.departments) {
    if (department.detailUrl) {
      activeDetails.add(department.detailUrl);
      activeReferences.add(department.detailUrl);
    }
    addLocalReferences(department.relatedSources, activeReferences);
    for (const value of [department.id, department.name, department.program]) {
      assert.ok(!ambiguous.test(String(value || "").trim()), `${scope} ambiguous summary label`);
    }
  }
  const positiveTotal = summary.departments.reduce((sum, row) => sum + Math.max(Number(row.amount), 0), 0);
  const pieShare = summary.departments.reduce((sum, row) => sum + Math.max(Number(row.amount), 0) / positiveTotal, 0);
  assert.ok(positiveTotal > 0, `${scope} has no positive allocations`);
  assert.ok(Math.abs(pieShare - 1) < 1e-12, `${scope} pie does not total 100%`);
  assert.equal(summary.departments.reduce((sum, row) => sum + cents(row.amount), 0), cents(summary.itemizedTotal), `${scope} itemized total`);
}

const jurisdictionDirs = fs.readdirSync(dataRoot).filter((name) => name === "federal" || /^state-[a-z]{2}$/.test(name));
const directJson = jurisdictionDirs.flatMap((directory) => fs.readdirSync(path.join(dataRoot, directory))
  .filter((file) => file.endsWith(".json")).map((file) => `data/${directory}/${file}`));
assert.deepEqual(directJson.filter((file) => !activeReferences.has(file)), [], "unreferenced active JSON");
for (const reference of activeReferences) assert.ok(fs.existsSync(path.join(root, reference)), `missing local source ${reference}`);

for (const file of [...jsonFiles, ...dataJsFiles]) {
  assert.ok(fs.readFileSync(file, "utf8").split(/\r?\n/).length > 2, `${file} is compact`);
}
assert.deepEqual(duplicateGroups(jsonFiles), [], "duplicate JSON source layers");

for (const directory of walkDirectories(dataRoot).filter((directory) => path.basename(directory).startsWith("archive-"))) {
  assert.ok(fs.existsSync(path.join(directory, "README.md")), `archive manifest missing: ${directory}`);
}

for (const detailUrl of activeDetails) {
  assert.doesNotMatch(path.basename(detailUrl), /^(?:state-[a-z]{2}|federal)-(?:sco-)?fy\d{4}-bu-\d+\.json$/i, `opaque detail filename: ${detailUrl}`);
  const detail = JSON.parse(fs.readFileSync(path.join(root, detailUrl), "utf8"));
  for (const row of detail.rows || []) {
    for (const value of [row[0], row[1]]) {
      assert.ok(!ambiguous.test(String(value || "").trim()), `ambiguous detail label: ${detailUrl}`);
    }
  }
}

const failures = JSON.parse(fs.readFileSync(path.join(dataRoot, "research/source-failures.json"), "utf8"));
assert.deepEqual(failures.entries, [], "active source failures remain");
assert.equal(failures.resolutions.length, 25);
assert.ok(failures.resolutions.every((entry) => /^https:\/\//.test(entry.attemptedSourceUrl)
  && entry.status === "number-restored" && entry.replacementUrl && entry.result), "invalid source resolution record");
for (const entry of failures.resolutions.filter((item) => item.replacementUrl.startsWith("data/"))) {
  assert.ok(fs.existsSync(path.join(root, entry.replacementUrl)), `missing source resolution ${entry.scope}`);
  const replacement = JSON.parse(fs.readFileSync(path.join(root, entry.replacementUrl), "utf8"));
  if (entry.scope === "EPA Exchange Network") {
    const awards = replacement.sourceBreakdowns.find((item) => item.title === "EPA FY2024 Exchange Network awards by recipient");
    assert.equal(awards.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(awards.sourceTotal));
  } else {
    assert.ok(replacement.departments.length > 0, `${entry.scope} restored rows`);
    assert.equal(cents(replacement.itemizedTotal), cents(replacement.sourceTotal), `${entry.scope} restored total`);
  }
}

console.log(`Data structure, source deduplication, readable labels, archive manifests, and 100% pie checks passed (${jsonFiles.length} JSON files).`);
