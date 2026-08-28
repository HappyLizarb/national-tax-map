const assert = require("node:assert/strict");
const fs = require("node:fs");
const crypto = require("node:crypto");
const vm = require("node:vm");
const model = require("../src/model.js");
const departmentIndex = require("../data/department-index.js");
const accountingBases = require("../data/fiscal/state-accounting-bases.js");
const financialResults = require("../data/fiscal/state-financial-results.js");
const taxRates = require("../data/tax/tax-rates.js");
const incomeTiers = require("../data/tax/income-tiers.js");
const estimates = require("../data/tax/household-tax-estimates.js");

// Load the sole authoritative archived summary for a state.
function archiveFor(name) {
  const summary = require("../" + departmentIndex[name]);
  const snapshot = summary.departments.flatMap((row) => row.relatedSources || [])
    .find(([label, url]) => label === "Prior state layer snapshot" && url.startsWith("data/"));
  assert.ok(snapshot, name + " archive snapshot");
  return JSON.parse(fs.readFileSync(snapshot[1], "utf8"));
}
require("./test-department-data.js");
require("./test-federal-department-data.js");
require("./test-federal-presentation-data.js");
require("./test-state-reconciliation-details.js");
require("./test-large-row-coverage.js");
require("./test-offsetting-receipts.js");
require("./test-tax-estimates.js");
require("./test-kpi-disclosures.js");
require("./test-source-explorer-layout.js");
require("./test-data-structure.js");
require("./test-research-data.js");
const national = model.scopeData("United States");
assert.deepEqual(model.metadata.researchCommentary, [
  "data/research/spending-source-audits.json",
  "data/research/spending-accounting-controls.json",
  "data/research/federal-methods.json",
  "data/research/legislative-budget-actuals-evidence.md",
  "data/research/state-reconciliation-large-row-decomposition.md"
]);
assert.equal(taxRates.researchCommentary, "data/research/tax-policy-evidence.json");
assert.equal(incomeTiers.researchCommentary, "data/research/tax-policy-evidence.json");
assert.equal(estimates.researchCommentary, "data/research/household-tax-estimate-evidence.json");
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
assert.equal(Object.keys(financialResults.states).length, 50);
assert.deepEqual(Object.keys(financialResults.states).sort(), Object.keys(model.states).sort());
for (const [name, result] of Object.entries(financialResults.states)) {
  assert.equal(result.resources - result.expenses, result.changeInNetPosition, name + " GAAP reconciliation");
  assert.ok(Number.isFinite(result.netPosition), name + " fiscal-year-end GAAP net position");
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
for (const name of Object.keys(model.states)) {
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
  assert.equal(model.scopeData(name, "archive").spending, null, name + " archive total loads with its summary");
  assert.equal(model.scopeData(name, "archive").comparable, false, name + " archive basis remains separate");
}

const sameAcfrBasis = ["Alaska", "Arizona", "Colorado", "Idaho", "Montana", "Mississippi", "New Hampshire", "South Dakota", "Utah", "Wyoming"];
assert.equal(Object.keys(accountingBases).length, 40);
assert.deepEqual(Object.keys(model.states).filter((name) => !accountingBases[name]).sort(), sameAcfrBasis.sort());
for (const name of Object.keys(model.states)) {
  const archive = archiveFor(name);
  const archiveTotal = archive.itemizedTotal ?? archive.sourceTotal;
  const reconciled = model.reconcileStateArchive(name, archive);
  const [censusRow, gaapRow] = reconciled.departments.slice(-2);
  assert.deepEqual([censusRow.name, gaapRow.name], ["Census adjustments", "GAAP adjustments"], name);
  assert.equal(censusRow.amount, model.states[name].total - archiveTotal, name + " Census bridge");
  assert.equal(gaapRow.amount, model.financialResultFor(name).expenses - model.states[name].total, name + " GAAP bridge");
  assert.equal(Math.round(reconciled.departments.reduce((sum, row) => sum + row.amount, 0) * 100),
    Math.round(reconciled.itemizedTotal * 100), name);
  assert.equal(reconciled.itemizedTotal, model.financialResultFor(name).expenses, name + " GAAP control");
  assert.match(censusRow.program, /no published bridge supports an agency split/, name);
  assert.match(gaapRow.program, new RegExp(name + " publishes no numeric Census-to-GAAP bridge"), name);
  assert.match(gaapRow.program, /capitalization.+asset sales or liquidations.+business-type consumer activity/, name);
  assert.match(gaapRow.program, new RegExp(model.financialResultFor(name).location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), name);
  assert.match(gaapRow.program, new RegExp(model.financialResultFor(name).auditNote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), name);
  if (accountingBases[name]) assert.match(censusRow.program, new RegExp(accountingBases[name].label), name);
}
const wyomingCensus = require("../data/state-wy/state-wy.js");
const wyomingReconciliation = model.reconcileStateArchive("Wyoming", { sourceTotal: 6548654149.67,
  sourceUrl: "https://www.wyopen.gov/search", note: "WyOpen payments.", reconciliation: {},
  departments: [{ name: "Archive", program: "Published ledger line", amount: 6548654149.67 }] }, wyomingCensus);
assert.deepEqual(wyomingReconciliation.departments.slice(-2).map((row) => row.amount), [-2212149.6700000763, -1143540063]);
const [wyomingCensusBridge, wyomingGaapBridge] = wyomingReconciliation.departments.slice(-2);
assert.equal(wyomingCensusBridge.detailSources.length, 5);
assert.equal(wyomingCensusBridge.detailSources.reduce((sum, source) => sum + source.fallbackRow[2], 0), wyomingCensusBridge.amount);
assert.equal(wyomingCensusBridge.detailSources[0].label, "Census · Intergovernmental expenditure");
assert.equal(wyomingCensusBridge.detailSources.at(-1).label, "Official archive · Archive");
assert.equal(wyomingGaapBridge.detailSources.length, 5);
assert.equal(wyomingGaapBridge.detailSources.reduce((sum, source) => sum + source.fallbackRow[2], 0), wyomingGaapBridge.amount);
assert.equal(wyomingGaapBridge.detailSources[0].label, "GAAP · Primary-government expenses");
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
const pennsylvaniaItemization = require("../data/state-pa/budget-actual-fy2024.json");
assert.equal(pennsylvaniaBudget.amount, 116815965000);
assert.equal(pennsylvaniaBudget.status, "official");
assert.equal(pennsylvaniaBudget.precision, 1000);
assert.equal(pennsylvaniaBudget.itemizedAmount, 48930674451.45);
assert.equal(pennsylvaniaBudget.itemizationUrl, "data/state-pa/budget-actual-fy2024.json");
assert.equal(Math.round(pennsylvaniaItemization.departments.reduce((sum, row) => sum + row.amount, 0) * 100), 4893067445145);
const washingtonBudget = model.budgetActualFor("Washington");
const washingtonItemization = require("../data/state-wa/budget-actual-fy2024.json");
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
  assert.ok(tax.individual.levels.every((row) => row.federalIncomeTax > 0
    && row.propertyTax === null && row.tax === row.federalIncomeTax + row.stateIncomeTax), name);
  assert.equal(tax.individual.propertyUrl, null, name);
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
const styles = fs.readFileSync("styles/styles.css", "utf8");
const details = fs.readFileSync("styles/details.css", "utf8");
const app = ["src/app.js", "src/fiscal-panel.js", "src/receipt-hierarchy.js", "src/tax-estimates.js"]
  .map((file) => fs.readFileSync(file, "utf8")).join("\n");
const detailPanelStart = html.indexOf('<aside class="detail-panel"');
const detailPanelEnd = html.indexOf("</aside>", detailPanelStart);
const fiscalDetailStart = html.indexOf('<section class="fiscal-detail"');
assert.ok(fs.existsSync("vendor/us-atlas-3-states-10m.json"));
assert.ok(fs.existsSync("vendor/topojson-client-3.1.0.min.js"));
const mapTopology = require("../vendor/us-atlas-3-states-10m.json");
const mapFeatures = require("../vendor/topojson-client-3.1.0.min.js")
  .feature(mapTopology, mapTopology.objects.states).features;
assert.equal(mapFeatures.find((feature) => feature.properties.name === "California").id, "06");
for (const pattern of [/id="themeToggle"/, /id="taxRateRows"/, /id="budgetStatus"/, /id="budgetDisclosure"/, /id="outsideBudgetDisclosure"/, /data\/fiscal\/state-accounting-bases\.js/, /data\/fiscal\/state-budget-actuals\.js/, /data\/fiscal\/state-financial-results\.js/, /data\/tax\/tax-rates\.js/, /data\/tax\/income-tiers\.js/, /data\/tax\/household-tax-estimates\.js/, /data\/department-index\.js/, /department-loader\.js/, /fiscal-panel\.js/]) assert.match(html, pattern);
assert.doesNotMatch(html + app + details, /accountingComparison|accounting-comparison|accounting-total-grid/);
assert.doesNotMatch(html + app, /data-layer|scopeSelect|setLayer|populateScopeSelect/);
assert.doesNotMatch(html + app + styles, /data-metric|map-metric-switch|setMetric|updateMetricControls|state\.metric/);
assert.doesNotMatch(html, /allocation-source-switch|data-allocation-source|Audited state GAAP|Standardized Census comparison|USAspending gross research/);
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
assert.match(html, /class="methodology-disclaimer"[\s\S]*State pies begin with researched official archives[\s\S]*signed Census bridge[\s\S]*signed GAAP bridge/);
for (const pattern of [/\.budget-disclaimer/, /\.outside-budget-disclaimer/]) assert.match(details, pattern);
for (const pattern of [/DepartmentData\.loadSummary/, /DepartmentData\.loadDetail/, /reconcileStateArchive/, /updateKpis\(canonical, null\)/, /const canonical = model\.scopeData\(state\.scope, state\.layer === "federal" \? "itemized" : "financial"\)/, /const allocation = model\.scopeData\(state\.scope, state\.layer === "federal" \? "itemized" : "archive"\)/, /scope === state\.scope && scope !== "United States"/, /element\.animate/, /themePreference\.addEventListener\("change", followSystemTheme\)/, /color\("--map-neutral"\)/, /prefers-reduced-motion: reduce/, /easeCubicInOut/, /Working individual/]) assert.match(app, pattern);
assert.match(app, /reconciliationTarget === "Census"[\s\S]*reconciliationTarget === "GAAP"/);
assert.match(app, /model\.formatMoney\(department\.amount\) \+ " adjustment"/);
assert.match(app, /circle\.reconciliation-ring/);
assert.match(app, /department\.detailSources/);
assert.match(app, /loadReconciliationDetail/);
assert.match(app, /model\.expandReconciliationSource/);
assert.match(app, /showAll/);
assert.doesNotMatch(app, /model\.scopeData\(state\.scope, state\.allocationSource\)/);
assert.doesNotMatch(app, /function setAllocationSource|updateAllocationSourceControls/);
assert.match(html, /receipt-hierarchy\.js/);
assert.match(app, /renderReceiptHierarchy/);
assert.match(app, /mapMetric\(name, "stateGovernment", "balance", "financial"\)/);
assert.match(app, /targetTransform = "translate\(0 0\) scale\(1\)"/);
assert.match(app, /fitExtent\(\[\[30, 28\], \[814, 455\]\]/);
assert.match(app, /GAAP-reconciled total/);
assert.doesNotMatch(app, /state spending map use a state-specific official ledger/);
assert.match(app, /Net position \(GAAP\)/);
assert.match(app, /financial\.changeInNetPosition\) \+ " annual change in net position"/);
assert.doesNotMatch(app, /data\.balance \/ data\.spending/);
assert.doesNotMatch(app, /2019|0\.72|stateLocal|No researched multi-year actual series/);

const loaderScope = { DepartmentSpendingData: { Audit: {
  departments: [{ amount: 0 }, { amount: -1 }],
  sourceBreakdowns: [{ rows: [["zero", "source", 0], ["kept", "source", 2]] }]
} } };
vm.runInNewContext(fs.readFileSync("src/department-loader.js", "utf8"), loaderScope);
loaderScope.DepartmentData.loadSummary("Audit").then((report) => {
  assert.equal(report.departments.length, 1);
  assert.equal(report.departments[0].amount, -1);
  assert.equal(report.sourceBreakdowns[0].rows.length, 1);
});

console.log("Fiscal model, lazy department data, tax, theme, and map checks passed.");
