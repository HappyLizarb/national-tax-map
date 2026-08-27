const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const vm = require("node:vm");
const model = require("./model.js");
const ledgerTotals = require("./data/state-ledger-totals.js");
const accountingBases = require("./data/state-accounting-bases.js");
const financialResults = require("./data/state-financial-results.js");
const financialResearch = Object.assign({}, ...["a", "b", "c"]
  .map((cohort) => require("./data/research/state-balance-cohort-" + cohort + ".json")),
  require("./data/research/state-balance-pilot-states.json"));
const taxRates = require("./data/tax-rates.js");
const incomeTiers = require("./data/income-tiers.js");
const estimates = require("./data/household-tax-estimates.js");
require("./test-department-data.js");
require("./test-federal-department-data.js");
require("./test-offsetting-receipts.js");
require("./test-tax-estimates.js");
require("./test-kpi-disclosures.js");
require("./test-data-structure.js");
require("./test-research-data.js");

const national = model.scopeData("United States");
assert.deepEqual(model.metadata.researchCommentary, [
  "data/research/source-audits.json",
  "data/research/accounting-controls.json",
  "data/research/federal-methods.json"
]);
assert.equal(taxRates.researchCommentary, "data/research/tax-policy.json");
assert.equal(incomeTiers.researchCommentary, "data/research/tax-policy.json");
assert.equal(estimates.researchCommentary, "data/research/household-estimate.json");
assert.equal(estimates.methodSource[1], estimates.researchCommentary);
for (const target of [...model.metadata.researchCommentary, taxRates.researchCommentary, estimates.researchCommentary]) assert.ok(fs.existsSync(target), target);
assert.equal(national.revenue, 4918736000000);
assert.equal(national.spending, 6751552000000);
assert.equal(national.balance, -1832816000000);
assert.equal(national.source, "https://fiscal.treasury.gov/system/files/files/reports-statements/mts/mts0924.pdf");
assert.ok(Math.abs(national.revenue - national.spending - national.balance) < 1);
assert.equal(model.scopeData("California", "function").balance, null);
assert.equal(model.mapMetric("California", "stateGovernment", "balance", "function"), null);
assert.deepEqual(model.metadata.reconciliations.find((item) => item.id === "federal-mts-receipts-outlays"), {
  id: "federal-mts-receipts-outlays", receipts: 4918736000000, netOutlays: 6751552000000,
  deficit: 1832816000000, result: "pass: final FY2024 MTS Table 1/2 controls reconcile exactly as net outlays less receipts"
});
assert.equal(Object.keys(model.states).length, 50);
assert.equal(Object.keys(ledgerTotals).length, 50);
assert.equal(Object.keys(financialResults.states).length, 50);
assert.deepEqual(Object.keys(financialResults.states).sort(), Object.keys(model.states).sort());
assert.deepEqual(Object.keys(financialResearch).sort(), Object.keys(model.states).sort());
for (const [name, result] of Object.entries(financialResults.states)) {
  assert.equal(result.resources - result.expenses, result.changeInNetPosition, name + " GAAP reconciliation");
  assert.ok(Number.isFinite(result.netPosition), name + " fiscal-year-end GAAP net position");
  assert.equal(result.netPosition, financialResearch[name].netPosition, name + " researched net-position control");
  assert.equal(result.location, financialResearch[name].location, name + " researched statement location");
  assert.ok(Number.isFinite(result.precision) && result.precision >= 1, name + " source precision");
  assert.match(result.sourceUrl, /^https:\/\//, name + " official financial source");
  const financial = model.scopeData(name, "financial");
  assert.equal(financial.revenue, result.resources, name + " GAAP resources");
  assert.equal(financial.spending, result.expenses, name + " GAAP expenses");
  assert.equal(financial.balance, result.netPosition, name + " reported net position");
  assert.equal(financial.comparable, true, name + " same-statement controls");
  assert.equal(financial.salariesWages, null, name + " Census details stay separate");
  assert.equal(financial.source, result.sourceUrl, name + " primary source");
  assert.equal(model.financialResultFor(name), result, name + " financial lookup");
  for (const metric of ["revenue", "spending", "balance"])
    assert.ok(Number.isFinite(model.mapMetric(name, "stateGovernment", metric, "financial")), name + " " + metric + " map metric");
}
const pilotControls = {
  "California": [295909349000, "official"],
  "Pennsylvania": [116815965000, "official"],
  "Texas": [171533710000, "documented-lower-bound"],
  "Washington": [71260282662, "documented-lower-bound"]
};
for (const name of Object.keys(ledgerTotals)) {
  const itemized = model.scopeData(name, "itemized");
  const expected = pilotControls[name];
  assert.equal(itemized.spending, expected?.[0] ?? null, name + " canonical budget actual");
  assert.equal(itemized.budgetStatus, expected?.[1] ?? "unavailable", name + " migration status");
  assert.equal(itemized.comparable, false, name + " state-specific budget scope");
  assert.equal(model.mapMetric(name, "stateGovernment", "spending", "itemized"), expected?.[0] ?? null, name + " map budget actual");
  assert.ok(Number.isNaN(model.mapMetric(name, "stateGovernment", "balance", "itemized")), name + " no synthetic balance");
  assert.equal(model.scopeData(name, "function").spending, model.states[name].total, name + " Census comparison retained");
  assert.equal(model.scopeData(name, "function").revenue, model.states[name].revenue, name + " Census revenue retained");
  assert.ok(Number.isFinite(model.mapMetric(name, "stateGovernment", "spending", "function")), name + " Census map spending");
  assert.ok(Number.isFinite(model.mapMetric(name, "stateGovernment", "revenue", "function")), name + " Census map revenue");
  assert.equal(model.scopeData(name, "archive").spending, ledgerTotals[name], name + " archive total retained");
  assert.equal(model.scopeData(name, "archive").comparable, false, name + " archive basis remains separate");
}

const sameAcfrBasis = ["Alaska", "Arizona", "Colorado", "Idaho", "Montana", "Mississippi", "New Hampshire", "South Dakota", "Utah", "Wyoming"];
assert.equal(Object.keys(accountingBases).length, 40);
assert.deepEqual(Object.keys(model.states).filter((name) => !accountingBases[name]).sort(), sameAcfrBasis.sort());
for (const [name, basis] of Object.entries(accountingBases)) {
  const comparison = model.accountingComparisonFor(name);
  if (pilotControls[name]) continue;
  assert.equal(comparison.censusTotal, model.states[name].total, name);
  assert.equal(comparison.stateTotal, ledgerTotals[name], name);
  assert.equal(comparison.difference, comparison.censusTotal - comparison.stateTotal, name);
  assert.equal(comparison.references.length, 5, name);
  assert.ok(comparison.references.every(([, url]) => /^https:\/\//.test(url)), name);
  assert.ok(comparison.label === basis.label && comparison.statement.includes(basis.detail), name);
}
for (const [name, [amount, status]] of Object.entries(pilotControls)) {
  const comparison = model.accountingComparisonFor(name);
  assert.equal(comparison.kind, "budget-standard", name);
  assert.equal(comparison.stateTotal, amount, name);
  assert.equal(comparison.status, status, name);
  assert.equal(comparison.difference, null, name + " no invented difference");
  assert.equal(comparison.itemizedTotal, model.budgetActualFor(name).itemizedAmount, name);
  assert.match(comparison.statement, /Transfer treatment:/, name);
  assert.match(comparison.provenance, /Exact amount: .* Source precision: .* Revision:/, name);
}
for (const name of sameAcfrBasis) assert.equal(model.accountingComparisonFor(name), null, name);
assert.equal(model.formatExactMoney(520734957000), "$520,734,957,000");
assert.equal(model.formatExactMoney(36131360457.04), "$36,131,360,457.04");
assert.equal(model.formatMoney(null), "Unavailable");
assert.equal(model.formatMoney(0.54), "$0.54");
assert.equal(model.formatMoney(-0.01), "−$0.01");
assert.equal(model.formatMoney(9967115943.91), "$9.97B");

const california = model.scopeData("California");
assert.equal(california.name, "California");
assert.ok(california.salariesWages > 0);
assert.deepEqual(california, model.scopeData("California"));
const californiaBudget = model.budgetActualFor("California");
assert.equal(californiaBudget.amount, 295909349000);
assert.equal(californiaBudget.status, "official");
assert.equal(californiaBudget.precision, 1000);
assert.equal(californiaBudget.itemizedAmount, 295909342678);
assert.equal(californiaBudget.amount - californiaBudget.itemizedAmount, 6322);
for (const field of ["issuer", "document", "location", "period", "publicationDate", "revisionDate", "auditStatus", "unit", "basis", "boundary", "transfers", "exclusions", "sourceUrl"]) {
  assert.ok(californiaBudget[field], "California budget provenance: " + field);
}
for (const [name, amount, status, precision] of [
  ["Texas", 171533710000, "documented-lower-bound", 1000]
]) {
  const budget = model.budgetActualFor(name);
  assert.equal(budget.amount, amount, name + " budget actual");
  assert.equal(budget.status, status, name + " migration status");
  assert.equal(budget.precision, precision, name + " source precision");
  assert.equal(budget.itemizedAmount, 0, name + " unmatched archives excluded from coverage");
  assert.match(budget.sourceUrl, /^https:\/\//, name + " primary source");
}
const pennsylvaniaBudget = model.budgetActualFor("Pennsylvania");
const pennsylvaniaItemization = require("./data/state-pa/budget-actual-fy2024.json");
assert.equal(pennsylvaniaBudget.amount, 116815965000);
assert.equal(pennsylvaniaBudget.status, "official");
assert.equal(pennsylvaniaBudget.precision, 1000);
assert.equal(pennsylvaniaBudget.itemizedAmount, 48930674451.45);
assert.equal(pennsylvaniaBudget.itemizationUrl, "data/state-pa/budget-actual-fy2024.json");
assert.equal(Math.round(pennsylvaniaItemization.departments.reduce((sum, row) => sum + row.amount, 0) * 100), 4893067445145);
const washingtonBudget = model.budgetActualFor("Washington");
const washingtonItemization = require("./data/state-wa/budget-actual-fy2024.json");
assert.equal(washingtonBudget.amount, 71260282662);
assert.equal(washingtonBudget.status, "documented-lower-bound");
assert.equal(washingtonBudget.precision, 1);
assert.equal(washingtonBudget.itemizedAmount, 71260282659);
assert.equal(washingtonBudget.itemizationUrl, "data/state-wa/budget-actual-fy2024.json");
assert.equal(washingtonItemization.departments.reduce((sum, row) => sum + row.amount, 0), 71260282659);
assert.equal(model.budgetPresentationFor("Washington").coverage,
  "Itemized coverage: $71,260,282,659 of $71,260,282,662 (100.0%) · $3 source-summary difference remains unassigned.");
assert.deepEqual(model.budgetPresentationFor("Texas"), {
  headline: "≥ $171.53B",
  statusLabel: "Documented lower bound",
  coverage: "Itemized coverage: $0 of $171,533,710,000 (0.0%)",
  disclaimer: "Complete actual expenditures are not publicly available on this budget basis.",
  outsideBudget: model.budgetActualFor("Texas").outsideBudget
});
assert.equal(model.budgetPresentationFor("California").headline, "$295.91B");
assert.equal(model.budgetPresentationFor("California").statusLabel, "Official");
assert.equal(model.budgetPresentationFor("Alabama").statusLabel, "Unavailable");

const federalSource = model.sourceLinks("United States");
assert.equal(federalSource.primary, "https://fiscal.treasury.gov/system/files/files/reports-statements/mts/mts0924.pdf");
const localSource = model.sourceLinks("California", "stateGovernment", "06");
assert.match(localSource.primary, /040XX00US06/);
assert.ok(localSource.references.length >= 2);
assert.ok(model.federalSourceRows().length >= 15);

const taxLabels = ["Individual income", "Corporate / business", "Sales / use", "Property", "Estate / inheritance", "Pension / retirement", "Investment gains", "Automobiles", "Fuel / environment", "Special goods"];
for (const name of ["United States", "District of Columbia", ...Object.keys(model.states)]) {
  assert.ok(taxRates.jurisdictions[name], name);
  const tax = model.taxOverviewFor(name);
  const expectedLabels = name === "United States" ? taxLabels.filter((label) => !["Sales / use", "Property"].includes(label)) : taxLabels;
  assert.deepEqual(tax.rows.map((row) => row.label), expectedLabels, name);
  assert.ok(tax.rows.every((row) => row.value && row.note && /^https:\/\//.test(row.url) && row.source), name);
  assert.ok(incomeTiers.jurisdictions[name] && tax.incomeTiers && /^https:\/\//.test(tax.incomeUrl), name);
  if (name === "United States") {
    assert.doesNotMatch(tax.asOf, /property/i);
    assert.equal(tax.household, null);
    assert.equal(tax.individual, null);
    continue;
  }
  assert.deepEqual(tax.household.levels.map((row) => row.label), ["25th percentile", "50th percentile · median", "75th percentile", "90th percentile"], name);
  assert.deepEqual(tax.household.levels.map((row) => row.income), estimates.jurisdictions[name].incomes, name);
  assert.deepEqual(tax.household.levels.map((row) => row.stateIncomeTax), estimates.jurisdictions[name].taxes, name);
  assert.ok(tax.household.levels.every((row) => row.tax === row.federalIncomeTax + row.stateIncomeTax + row.propertyTax), name);
  assert.match(tax.household.propertyUrl, /^https:\/\//, name);
  assert.deepEqual(tax.individual.levels.map((row) => row.income), estimates.individual.jurisdictions[name].incomes, name);
  assert.deepEqual(tax.individual.levels.map((row) => row.stateIncomeTax), estimates.individual.jurisdictions[name].taxes, name);
  assert.ok(tax.individual.levels.every((row) => row.federalIncomeTax > 0 && row.tax === row.federalIncomeTax + row.stateIncomeTax + row.propertyTax), name);
}

assert.equal(Object.keys(estimates.jurisdictions).length, 52);
assert.equal(Object.keys(estimates.individual.jurisdictions).length, 52);
assert.equal(crypto.createHash("sha256").update(JSON.stringify(estimates.jurisdictions)).digest("hex"), "f0f135251b76a06124d02fe1e95e0978bd2bb87585a84771ed1703b41bf70c1d");
assert.equal(crypto.createHash("sha256").update(JSON.stringify(estimates.individual.jurisdictions)).digest("hex"), "1e46e76385b0a39fa6ef14dc29aeab29515492b9e1967f1b9702fc88398eb9a5");
assert.deepEqual(estimates.jurisdictions["United States"], { incomes: [88733, 141221, 216248, 345185], taxes: [4358, 11307, 25602, 55912] });
assert.deepEqual(model.taxOverviewFor("Alaska").individual.levels.map((row) => row.federalIncomeTax), [1304, 3912, 9709, 18461]);
for (const name of ["Alaska", "Florida", "Nevada", "New Hampshire", "South Dakota", "Tennessee", "Texas", "Washington", "Wyoming"]) {
  assert.deepEqual(model.taxOverviewFor(name).household.levels.map((row) => row.stateIncomeTax), [0, 0, 0, 0]);
  assert.deepEqual(model.taxOverviewFor(name).individual.levels.map((row) => row.stateIncomeTax), [0, 0, 0, 0]);
}

for (const name of Object.keys(model.states)) {
  const links = model.sourceLinks(name).references;
  assert.ok(links.length >= 2, name);
  assert.ok(links.every((source) => /^https:\/\//.test(source.url)), name);
}

const html = fs.readFileSync("index.html", "utf8");
const styles = fs.readFileSync("styles.css", "utf8");
const details = fs.readFileSync("details.css", "utf8");
const app = ["app.js", "fiscal-panel.js", "receipt-hierarchy.js", "tax-estimates.js"]
  .map((file) => fs.readFileSync(file, "utf8")).join("\n");
const detailPanelStart = html.indexOf('<aside class="detail-panel"');
const detailPanelEnd = html.indexOf("</aside>", detailPanelStart);
const fiscalDetailStart = html.indexOf('<section class="fiscal-detail"');
assert.ok(fs.existsSync("vendor/us-atlas-3-states-10m.json"));
assert.ok(fs.existsSync("vendor/topojson-client-3.1.0.min.js"));
const mapTopology = require("./vendor/us-atlas-3-states-10m.json");
const mapFeatures = require("./vendor/topojson-client-3.1.0.min.js")
  .feature(mapTopology, mapTopology.objects.states).features;
assert.equal(mapFeatures.find((feature) => feature.properties.name === "California").id, "06");
for (const pattern of [/id="themeToggle"/, /id="taxRateRows"/, /id="accountingComparison"/, /id="budgetStatus"/, /id="budgetDisclosure"/, /id="outsideBudgetDisclosure"/, /data\/state-accounting-bases\.js/, /data\/state-budget-actuals\.js/, /data\/state-financial-results\.js/, /data\/tax-rates\.js/, /data\/income-tiers\.js/, /data\/household-tax-estimates\.js/, /data\/department-index\.js/, /department-loader\.js/, /fiscal-panel\.js/]) assert.match(html, pattern);
assert.doesNotMatch(html + app, /data-layer|scopeSelect|setLayer|populateScopeSelect/);
assert.doesNotMatch(html + app + styles, /data-metric|map-metric-switch|setMetric|updateMetricControls|state\.metric/);
assert.match(html, />Audited state GAAP</);
assert.match(html, />Treasury agencies &amp; programs</);
assert.match(html, />Standardized Census comparison</);
assert.ok(html.indexOf('class="kpi-grid"') > detailPanelStart && html.indexOf('class="kpi-grid"') < detailPanelEnd);
assert.ok(html.indexOf('aria-labelledby="gapTitle"') > detailPanelStart && html.indexOf('aria-labelledby="gapTitle"') < detailPanelEnd);
assert.ok(html.indexOf('id="incomeTaxTiersTitle"') > detailPanelStart && html.indexOf('id="incomeTaxTiersTitle"') < detailPanelEnd);
assert.doesNotMatch(html + app, /revenuePerCapita|spendingPerCapita|balancePerCapita|Exact single-filer tiers|<details class="tax-tiers"/);
assert.ok(html.indexOf('class="tax-rate-detail"') > html.indexOf('id="taxEstimateSection"') && html.indexOf('class="tax-rate-detail"') > fiscalDetailStart);
assert.match(html, /src="vendor\/topojson-client-3\.1\.0\.min\.js"/);
assert.match(app, /d3\.json\("vendor\/us-atlas-3-states-10m\.json"\)/);
assert.doesNotMatch(html + app, /cdn\.jsdelivr\.net\/npm\/(?:topojson-client|us-atlas)/);
assert.doesNotMatch(html, /trendChart|stateLocal|Official itemized ledger|Comparable function ledger/);
assert.doesNotMatch(html, /All levels|data-layer="consolidated"/);
for (const pattern of [/:root\[data-theme="dark"\]/, /\.tax-tiers/, /\.tax-estimate-window/]) assert.match(styles, pattern);
assert.match(html, /tax-estimates\.js/);
for (const pattern of [/\.accounting-total-grid/, /\.budget-disclaimer/, /\.outside-budget-disclaimer/]) assert.match(details, pattern);
for (const pattern of [/DepartmentData\.loadSummary/, /DepartmentData\.loadDetail/, /budgetPresentationFor/, /financialResultFor/, /comparison\.kind === "budget-standard"/, /updateAccountingComparison\(canonical\.name\)/, /updateKpis\(canonical, budget\)/, /const canonical = view/, /const federal = state\.layer === "federal"/, /state\.allocationSource = state\.layer === "federal" \? "itemized" : "financial"/, /scope === state\.scope && scope !== "United States"/, /element\.animate/, /themePreference\.addEventListener\("change", followSystemTheme\)/, /color\("--map-neutral"\)/, /prefers-reduced-motion: reduce/, /easeCubicInOut/, /Working individual/]) assert.match(app, pattern);
assert.match(html, /receipt-hierarchy\.js/);
assert.match(app, /renderReceiptHierarchy/);
assert.match(app, /mapMetric\(name, "stateGovernment", "balance", "financial"\)/);
assert.match(app, /targetTransform = "translate\(0 0\) scale\(1\)"/);
assert.match(app, /fitExtent\(\[\[30, 28\], \[814, 455\]\]/);
assert.match(app, /No validated itemization yet/);
assert.match(app, /budget\.itemizedAmount \/ budget\.amount/);
assert.match(app, /nested evidence against the canonical control/);
assert.doesNotMatch(app, /state spending map use a state-specific official ledger/);
assert.match(app, /Net position \(GAAP\)/);
assert.match(app, /financial\.changeInNetPosition\) \+ " annual change in net position"/);
assert.match(app, /financial-statement-control/);
assert.doesNotMatch(app, /data\.balance \/ data\.spending/);
assert.doesNotMatch(app, /2019|0\.72|stateLocal|No researched multi-year actual series/);

const loaderScope = { DepartmentSpendingData: { Audit: {
  departments: [{ amount: 0 }, { amount: -1 }],
  sourceBreakdowns: [{ rows: [["zero", "source", 0], ["kept", "source", 2]] }]
} } };
vm.runInNewContext(fs.readFileSync("department-loader.js", "utf8"), loaderScope);
loaderScope.DepartmentData.loadSummary("Audit").then((report) => {
  assert.equal(report.departments.length, 1);
  assert.equal(report.departments[0].amount, -1);
  assert.equal(report.sourceBreakdowns[0].rows.length, 1);
});

console.log("Fiscal model, lazy department data, tax, theme, and map checks passed.");
