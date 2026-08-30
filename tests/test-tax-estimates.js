const assert = require("node:assert/strict");
const fs = require("node:fs");
const renderTaxEstimates = require("../src/tax-estimates.js");
const { renderEverydayCosts } = renderTaxEstimates;
const consumerCosts = require("../data/tax/consumer-costs.js");
for (const [name, state] of Object.entries(consumerCosts.jurisdictions)) {
  assert.equal(typeof consumerCosts.minimumWages[state.code], "number", name + " minimum wage");
  for (const values of [state.goods.areas, state.rent.places, state.electricity.areas]) {
    assert.equal(values.length, 7, name + " percentile count");
    assert.deepEqual(values, [...values].sort((a, b) => a - b), name + " sorted percentiles");
  }
}

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const profile = (incomeUrl) => ({
  asOf: "Estimated 2026", assumptions: "<strong>Illustrative</strong>", incomeUrl,
  incomeSource: "ACS profile", federalUrl: "https://example.com/federal", federalSource: "IRS",
  methodUrl: "https://example.com/method", methodSource: "Method",
  propertyUrl: "https://example.com/property", propertySource: "Property",
  levels: Array.from({ length: 4 }, (_, index) => ({ label: "Level " + index,
    income: 50000, tax: 9000, federalIncomeTax: 5000, stateIncomeTax: 1500, propertyTax: 2500 }))
});
const tax = { incomeUrl: "https://example.com/state", incomeSource: "State schedule",
  costs: { ...consumerCosts, jurisdiction: "California" },
  household: profile("https://example.com/household"),
  individual: profile("https://example.com/individual") };
tax.individual.levels = tax.individual.levels.map((row) => ({ ...row, tax: 6500, propertyTax: null }));
const html = renderTaxEstimates(tax, escapeHtml);
const costsHtml = renderEverydayCosts(tax.costs, escapeHtml);

assert.equal((html.match(/class="tax-estimate-window"/g) || []).length, 1);
assert.doesNotMatch(html, /consumer-costs/);
assert.equal((html.match(/class="tax-estimate-profile"/g) || []).length, 2);
assert.equal((html.match(/class="tax-estimate-level"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-income"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-breakdown"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-net"/g) || []).length, 8);
assert.equal((html.match(/ property<\/span>/g) || []).length, 4);
assert.match(html, /Post-tax income<\/small><strong>\$41,000 <span>· \$3,417\/mo<\/span><\/strong><small>18\.0% effective tax rate/);
assert.match(html, /Post-tax income<\/small><strong>\$43,500 <span>· \$3,625\/mo<\/span><\/strong><small>13\.0% effective tax rate/);
for (const source of ["federal", "method", "property"])
  assert.equal((html.match(new RegExp('href="https://example.com/' + source + '"', "g")) || []).length, 1);
assert.equal((html.match(/Estimated 2026/g) || []).length, 1);
assert.match(html, /Household of four/);
assert.match(html, /Working individual/);
assert.match(costsHtml, /^<details class="household-tax-detail consumer-costs detail-disclosure"><summary><h3><span>Everyday costs<\/span>/);
assert.equal((costsHtml.match(/class="consumer-cost-row"/g) || []).length, 9);
assert.match(costsHtml, /ACS median gross rent across places; equal place weight/);
assert.match(costsHtml, /BLS price adjusted with BEA goods parity; equal area weight/);
assert.match(costsHtml, /Statewide standard rate; local and worker-specific rates excluded/);
assert.doesNotMatch(costsHtml, /Product ranges are estimates:/);
assert.match(costsHtml, /Combined average 8\.99%/);
assert.match(costsHtml, /Minimum wage · hour/);
assert.match(costsHtml, /State standard \$16\.90\/hr/);
assert.equal((costsHtml.match(/class="consumer-cost-marker is-state"/g) || []).length, 9);
assert.doesNotMatch(html, /Not tax advice/);
assert.doesNotMatch(html, /<strong>Illustrative<\/strong>/);
assert.match(html, /&lt;strong&gt;Illustrative&lt;\/strong&gt;/);
assert.equal(renderTaxEstimates({ household: null }, escapeHtml), "");
const national = renderEverydayCosts({ ...consumerCosts, jurisdiction: "United States" }, escapeHtml);
assert.match(national, /^<details class="household-tax-detail consumer-costs detail-disclosure"><summary>/);
assert.equal((national.match(/class="consumer-cost-row"/g) || []).length, 9);
assert.match(national, /P25 · [A-Z]{2}/);
assert.doesNotMatch(national, /consumer-cost-marker is-state/);
assert.doesNotMatch(national, /tax-estimate-profile/);
assert.match(fs.readFileSync("styles/details.css", "utf8"), /\.household-estimate-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
