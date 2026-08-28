const assert = require("node:assert/strict");
const fs = require("node:fs");
const renderTaxEstimates = require("./tax-estimates.js");

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
  household: profile("https://example.com/household"),
  individual: profile("https://example.com/individual") };
const html = renderTaxEstimates(tax, escapeHtml);

assert.equal((html.match(/class="tax-estimate-window"/g) || []).length, 1);
assert.equal((html.match(/class="tax-estimate-profile"/g) || []).length, 2);
assert.equal((html.match(/class="tax-estimate-level"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-income"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-breakdown"/g) || []).length, 8);
assert.equal((html.match(/class="tax-estimate-net"/g) || []).length, 8);
assert.match(html, /Post-tax income<\/small><strong>\$41,000<\/strong><small>18\.0% effective tax rate/);
for (const source of ["federal", "method", "property"])
  assert.equal((html.match(new RegExp('href="https://example.com/' + source + '"', "g")) || []).length, 1);
assert.equal((html.match(/Estimated 2026/g) || []).length, 1);
assert.match(html, /Household of four/);
assert.match(html, /Working individual/);
assert.doesNotMatch(html, /Not tax advice/);
assert.doesNotMatch(html, /<strong>Illustrative<\/strong>/);
assert.match(html, /&lt;strong&gt;Illustrative&lt;\/strong&gt;/);
assert.equal(renderTaxEstimates({ household: null }, escapeHtml), "");
assert.match(fs.readFileSync("details.css", "utf8"), /\.household-estimate-grid\s*\{[^}]*grid-template-columns:\s*1fr/);
