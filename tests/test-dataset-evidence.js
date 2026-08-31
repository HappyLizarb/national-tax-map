const assert = require("node:assert/strict");
const fs = require("node:fs");
const jurisdictions = require("../data/jurisdictions.js");
const taxRates = require("../data/tax/tax-rates.js");
const incomeTiers = require("../data/tax/income-tiers.js");
const estimates = require("../data/tax/household-tax-estimates.js");

assert.equal(fs.existsSync("data/fiscal"), false);
assert.equal(fs.existsSync("data/research"), false);
assert.deepEqual(Object.keys(jurisdictions.metadata.methodology),
  ["federal", "states", "exactBreakdowns", "publicationCeilings", "privacy"]);
assert.ok(Object.values(jurisdictions.metadata.methodology).every(Boolean));
assert.ok(jurisdictions.metadata.sources.every((source) => source.id && source.label && /^https:\/\//.test(source.url)));
assert.equal(jurisdictions.federal.sourceCatalog.length, 16);
assert.ok(jurisdictions.federal.sourceCatalog.every((source) => source.label && source.status
  && source.decision && source.links.every((link) => /^https:\/\//.test(link.url))));

for (const [name, row] of Object.entries(jurisdictions.states)) {
  assert.ok(row.summaryPath && fs.existsSync(row.summaryPath), name);
  assert.ok(row.financial.document && row.financial.location && /^https:\/\//.test(row.financial.sourceUrl), name);
  assert.ok(row.sources.length && row.sources.every((source) => source.label && /^https:\/\//.test(source.url)), name);
}
assert.equal(Object.hasOwn(taxRates, "researchCommentary"), false);
assert.equal(Object.hasOwn(incomeTiers, "researchCommentary"), false);
assert.equal(Object.hasOwn(estimates, "researchCommentary"), false);
assert.equal(estimates.methodSource[1], "data/tax/household-tax-estimates.js");

const generatedViews = ["agriculture", "health-and-human-services", "defense-military-programs", "education",
  "homeland-security", "housing-and-urban-development", "justice", "labor", "state", "veterans-affairs"]
  .flatMap((name) => require(`../data/federal/federal-mts-agency-department-of-${name}.json`).sourceBreakdowns || []);
assert.equal(generatedViews.filter((view) => !view.combinedStatementAvailability).length, 204);
assert.equal(generatedViews.filter((view) => view.combinedStatementAvailability).length, 173);
const gdxViews = generatedViews.filter((view) =>
  /VA FY2024 (?:Compensation and Pension|Medical Care|Education and Veteran Readiness)/.test(view.title));
assert.equal(gdxViews.length, 3);
assert.equal(gdxViews.reduce((sum, view) => sum + view.rows.length, 0), 935);
const largeGdxRows = gdxViews.flatMap((view) => view.rows).filter((row) => Math.abs(row[2]) >= 1e9);
assert.equal(largeGdxRows.length, 12);
const districtGdxRows = gdxViews.filter((view) => /congressional district/.test(view.title))
  .flatMap((view) => view.rows).filter((row) => Math.abs(row[2]) >= 1e9);
assert.equal(districtGdxRows.length, 9);
assert.ok(districtGdxRows.every((row) => /ceiling/i.test(row[1])));
const transportationViews = require("../data/federal/federal-mts-agency-department-of-transportation.json").sourceBreakdowns;
assert.equal(transportationViews.filter((view) => !view.combinedStatementAvailability).length, 6);
assert.equal(transportationViews.filter((view) => view.combinedStatementAvailability).length, 8);
assert.equal(["veterans-affairs", "transportation", "the-treasury"].flatMap((name) =>
  require(`../data/federal/federal-mts-agency-department-of-${name}.json`).supplementalBreakdowns || []).length, 6);

const supersededResearch = /^(?:HOUSEHOLD_TAX_ESTIMATE_RESEARCH|SOURCE_RESEARCH_.+|TAX_BRACKETS_2026_A_I|TAX_RATE_RESEARCH_.+)\.md$/;
assert.deepEqual(fs.readdirSync(".").filter((file) => supersededResearch.test(file)), []);
assert.deepEqual(fs.readdirSync("data").filter((file) => /\.(?:js|json|md)$/.test(file)).sort(),
  ["README.md", "ipeds-public-institution-universe-fy2024.json", "jurisdictions.js"]);

console.log("Methodology and source evidence live with their owning datasets.");
