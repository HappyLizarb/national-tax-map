const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");

const bundleCounts = {
  "data/research/spending-accounting-controls.json": 13,
  "data/research/federal-methods.json": 2,
  "data/research/household-tax-estimate-evidence.json": 1,
  "data/research/spending-source-audits.json": 10,
  "data/research/tax-policy-evidence.json": 4,
};

const records = [];
for (const [file, expectedCount] of Object.entries(bundleCounts)) {
  const bundle = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.equal(bundle.length, expectedCount, file);
  records.push(...bundle);
}

assert.equal(records.length, 30);
assert.equal(new Set(records.map((record) => record.originalFile)).size, 30);
const urls = new Set();
for (const record of records) {
  const checksum = crypto.createHash("sha256").update(record.commentary).digest("hex");
  assert.equal(record.sha256, checksum, record.originalFile);
  assert.ok(record.commentary.includes(`# ${record.title}`), record.originalFile);
  assert.equal(record.sourceCount, record.sourceLinks.length, record.originalFile);
  assert.ok(record.relatedDatasets.length > 0, record.originalFile);
  assert.ok(record.relatedDatasets.every((target) => fs.existsSync(target)), record.originalFile);
  for (const source of record.sourceLinks) {
    assert.match(source.url, /^https?:\/\//, record.originalFile);
    assert.ok(source.label, record.originalFile);
    urls.add(source.url);
  }
}

assert.equal(urls.size, 1139);
const generatedViews = ["agriculture", "health-and-human-services", "defense-military-programs", "education", "homeland-security", "housing-and-urban-development", "justice", "labor", "state", "veterans-affairs"].flatMap((name) =>
  require(`../data/federal/federal-mts-agency-department-of-${name}.json`).sourceBreakdowns || []);
assert.equal(generatedViews.filter((view) => !view.combinedStatementAvailability).length, 137);
assert.equal(generatedViews.filter((view) => view.combinedStatementAvailability).length, 50);
const gdxViews = generatedViews.filter((view) => /VA FY2024 (?:Compensation and Pension|Medical Care|Education and Veteran Readiness)/.test(view.title));
assert.equal(gdxViews.length, 9);
assert.equal(gdxViews.reduce((sum, view) => sum + view.rows.length, 0), 1673);
assert.equal(gdxViews.flatMap((view) => view.rows).filter((row) => Math.abs(row[2]) >= 1e10).length, 0);
const transportationViews = require("../data/federal/federal-mts-agency-department-of-transportation.json").sourceBreakdowns;
assert.equal(transportationViews.filter((view) => !view.combinedStatementAvailability).length, 6);
assert.equal(transportationViews.filter((view) => view.combinedStatementAvailability).length, 1);
assert.equal(["veterans-affairs", "transportation", "the-treasury"].flatMap((name) =>
  require(`../data/federal/federal-mts-agency-department-of-${name}.json`).supplementalBreakdowns || []).length, 6);
const supersededResearch = /^(?:HOUSEHOLD_TAX_ESTIMATE_RESEARCH|SOURCE_RESEARCH_.+|TAX_BRACKETS_2026_A_I|TAX_RATE_RESEARCH_.+)\.md$/;
assert.deepEqual(fs.readdirSync(".").filter((file) => supersededResearch.test(file)), []);
const embeddedResearch = /_DETAIL_2026-08-27\.md$|^(?:federal-interest-fy2024|federal-program-context.*|state-(?:balance-cohort-[abc]|balance-pilot-states|branch-context.*|function-context.*|medicaid-context.*|school-finance-context))\.json$/;
assert.deepEqual(fs.readdirSync("data").filter((file) => embeddedResearch.test(file)), []);
assert.ok(fs.existsSync("data/research/legislative-budget-actuals-evidence.md"));
assert.ok(fs.existsSync("data/research/state-reconciliation-large-row-decomposition.md"));
assert.deepEqual(fs.readdirSync("data").filter((file) => /\.(?:js|json|md)$/.test(file)).sort(),
  ["README.md", "department-index.js"]);

console.log("Structured research commentary checks passed.");
