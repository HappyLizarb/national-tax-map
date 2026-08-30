const assert = require("node:assert/strict");
const fs = require("node:fs");

const index = require("../data/department-index.js");
const model = require("../src/model.js");
const threshold = 5_000_000_000;
const cents = (value) => Math.round(value * 100);
const key = (row) => JSON.stringify(row.slice(0, 3));
const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
const counts = { large: 0, breakdowns: 0, ceilings: 0 };

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function auditSource(scope, source) {
  const detail = source.detailUrl ? readJson(source.detailUrl) : null;
  const expanded = model.expandReconciliationSource(source, detail);
  const panels = sections.flatMap((name) => expanded[name]);
  const covered = new Set(panels.flatMap((panel) =>
    [panel.parent, ...(panel.covers || [])]).filter(Boolean).map(key));

  for (const row of expanded.rows.filter((row) => Math.abs(row[2]) >= threshold)) {
    counts.large += 1;
    if (covered.has(key(row))) counts.breakdowns += 1;
    else {
      counts.ceilings += 1;
      assert.match(row[1], /ceiling/i, scope + " terminal base row");
    }
  }
  for (const panel of panels) for (const row of panel.rows) {
    if (Math.abs(row[2]) >= threshold)
      assert.match(row[1], /ceiling/i, scope + " terminal breakdown row");
  }
}

for (const [scope, summaryPath] of Object.entries(index)) {
  if (scope === "United States") continue;
  const census = require("../" + summaryPath);
  const archiveUrl = census.departments[0].relatedSources.find(([label, url]) =>
    label === "Prior state layer snapshot" && url.startsWith("data/"))[1];
  const reconciled = model.reconcileStateArchive(scope, readJson(archiveUrl), census);
  for (const bridge of reconciled.departments.slice(-2))
    for (const source of bridge.detailSources) auditSource(scope, source);
}

for (const file of [
  "data/state-mi/archive-state-source/state-mi-health-and-human-services.json",
  "data/state-mi/archive-state-source/state-mi-education.json"
]) {
  const detail = readJson(file), panel = detail.sourceBreakdowns[0], parent = detail.rows.find((row) => key(row) === key(panel.covers[0]));
  const publishedRows = panel.rows.reduce((sum, row) => sum + Number(row[1].match(/([\d,]+) payment rows/)[1].replaceAll(",", "")), 0);
  assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
  assert.equal(panel.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
  assert.equal(publishedRows, parent[4]);
  assert.ok(panel.rows.every((row) => Math.abs(row[2]) < 1e10));
}

const ohio = readJson("data/state-oh/archive-state-source/state-oh-department-of-medicaid.json").sourceBreakdowns[0];
assert.equal(ohio.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(ohio.sourceTotal));
assert.equal(ohio.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(ohio.sourceTotal));
assert.equal(ohio.rows.length, 34);

const newJersey = readJson("data/state-nj/archive-state-source/state-nj-human-services.json").sourceBreakdowns[0];
assert.equal(newJersey.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(newJersey.sourceTotal));
assert.equal(newJersey.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(newJersey.sourceTotal));
assert.equal(newJersey.rows.reduce((sum, row) => sum + Number(row[1].match(/([\d,]+) source rows/)[1].replaceAll(",", "")), 0), 630);

for (const file of [
  "data/state-al/archive-state-source/state-al-acfr-functions.json",
  "data/state-ar/archive-state-source/state-ar-acfr-functions.json",
  "data/state-ca/archive-state-source/state-ca-acfr-functions.json",
  "data/state-ct/archive-state-source/state-ct-acfr-functions.json",
  "data/state-fl/archive-state-source/state-fl-acfr-functions.json",
  "data/state-ga/archive-state-source/state-ga-acfr-functions.json",
  "data/state-ia/archive-state-source/state-ia-acfr-functions.json",
  "data/state-ma/archive-state-source/state-ma-acfr-functions.json",
  "data/state-md/archive-state-source/state-md-acfr-functions.json",
  "data/state-mo/archive-state-source/state-mo-acfr-functions.json",
  "data/state-nm/archive-state-source/state-nm-acfr-functions.json",
  "data/state-nj/archive-state-source/state-nj-acfr-functions.json",
  "data/state-ny/archive-state-source/state-ny-acfr-functions.json",
  "data/state-ok/archive-state-source/state-ok-acfr-functions.json",
  "data/state-sc/archive-state-source/state-sc-acfr-functions.json",
  "data/state-tx/archive-state-source/state-tx-acfr-functions.json",
  "data/state-wa/archive-state-source/state-wa-acfr-functions.json",
  "data/state-wi/archive-state-source/state-wi-acfr-functions.json"
]) {
  for (const panel of readJson(file).sourceBreakdowns) {
    assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.equal(panel.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.ok(panel.rows.every((row) => Math.abs(row[2]) < 1e10));
  }
}

assert.deepEqual(counts, { large: 483, breakdowns: 141, ceilings: 342 });
console.log("All browser-visible $5 billion rows are exact breakdowns or labeled source ceilings.");
