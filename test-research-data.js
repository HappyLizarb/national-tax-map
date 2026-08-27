const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const bundleCounts = {
  "accounting-controls.json": 13,
  "federal-methods.json": 2,
  "household-estimate.json": 1,
  "source-audits.json": 10,
  "tax-policy.json": 4,
};

const records = [];
for (const [file, expectedCount] of Object.entries(bundleCounts)) {
  const bundle = JSON.parse(fs.readFileSync(path.join("data/research", file), "utf8"));
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
const newViews = ["federal-program-context-medicare-defense.json", "federal-program-context-defense-om-components.json"]
  .flatMap((file) => Object.values(require(`./data/research/${file}`)).flat());
assert.equal(newViews.length, 6);
assert.equal(newViews[0].rows.reduce((sum, row) => sum + row[2], 0), 874134000000);
assert.ok(newViews.every((view) => /^https:\/\//.test(view.sourceUrl)
  && view.rows.every((row, index, rows) => !index || Math.abs(rows[index - 1][2]) >= Math.abs(row[2]))));
const generatedViews = ["health-and-human-services", "defense-military-programs", "education", "homeland-security", "housing-and-urban-development", "justice", "labor", "veterans-affairs"].flatMap((name) =>
  require(`./data/federal/federal-mts-agency-department-of-${name}.json`).sourceBreakdowns || []);
assert.equal(generatedViews.length, 44);
const gdxViews = generatedViews.filter((view) => /VA FY2024 (?:Compensation and Pension|Medical Care|Education and Veteran Readiness)/.test(view.title));
assert.equal(gdxViews.length, 9);
assert.equal(gdxViews.reduce((sum, view) => sum + view.rows.length, 0), 1673);
assert.equal(gdxViews.flatMap((view) => view.rows).filter((row) => Math.abs(row[2]) >= 1e10).length, 0);
const focusedContexts = require("./data/research/federal-program-context-va-highways-tax.json");
const focusedViews = Object.values(focusedContexts).flat();
assert.equal(focusedViews.length, 5);
assert.equal(focusedViews.flatMap((view) => view.rows).length, 66);
assert.ok(focusedViews.every((view) => view.rows.reduce((sum, row) => sum + row[2], 0)
  === (view.parent?.[2] || view.sourceTotal)));
assert.equal(require("./data/federal/federal-mts-agency-department-of-transportation.json").sourceBreakdowns.length, 2);
assert.equal(["veterans-affairs", "transportation", "the-treasury"].flatMap((name) =>
  require(`./data/federal/federal-mts-agency-department-of-${name}.json`).supplementalBreakdowns || []).length, 5);
const schoolContexts = require("./data/research/state-school-finance-context.json");
const schoolViews = Object.values(schoolContexts).flat();
assert.equal(schoolViews.length, 16);
assert.equal(schoolViews.flatMap((view) => view.rows).length, 425);
assert.equal(schoolViews.flatMap((view) => view.rows).filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
assert.ok(schoolViews.every((view) => Math.abs(view.rows.reduce((sum, row) => sum + row[2], 0) - view.sourceTotal) <= 0.01));
assert.equal(Object.keys(schoolContexts).flatMap((code) => JSON.parse(fs.readFileSync(`data/state-${code}/census-state-${code}-fy2024-intergovernmental.json`)).sourceBreakdowns || []).length, 16);
const supersededResearch = /^(?:HOUSEHOLD_TAX_ESTIMATE_RESEARCH|SOURCE_RESEARCH_.+|TAX_BRACKETS_2026_A_I|TAX_RATE_RESEARCH_.+)\.md$/;
assert.deepEqual(fs.readdirSync(".").filter((file) => supersededResearch.test(file)), []);

console.log("Structured research commentary checks passed.");
