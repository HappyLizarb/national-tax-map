// Keep audited, budget, archive, and Census controls on their own accounting bases.
function scopeFor(dataset, census, budgetActuals, financialResults, name, sourceLayer = "function") {
  const isFederal = name === "United States" || !dataset.states[name];
  const raw = isFederal ? dataset.federal : dataset.states[name];
  const financialLayer = !isFederal && sourceLayer === "financial";
  const budgetLayer = !isFederal && sourceLayer === "itemized";
  const archiveLayer = !isFederal && sourceLayer === "archive";
  const financialResult = financialLayer ? financialResults?.states?.[name] : null;
  const budgetActual = budgetLayer ? budgetActuals[name] : null;
  const comparable = financialLayer || !budgetLayer && !archiveLayer;
  return {
    name: isFederal ? "United States" : name,
    kind: isFederal ? "federal" : "state",
    revenue: financialLayer ? financialResult?.resources ?? null : comparable ? raw.revenue : null,
    spending: financialLayer ? financialResult?.expenses ?? null
      : archiveLayer ? null : budgetLayer ? budgetActual?.amount ?? null : raw.total,
    balance: financialLayer ? financialResult?.netPosition ?? null : comparable ? raw.balance ?? null : null,
    comparable,
    budgetStatus: budgetLayer ? budgetActual?.status || "unavailable" : null,
    budgetActual,
    financialResult,
    directTotal: financialLayer ? null : raw.directTotal,
    salariesWages: financialLayer ? null : raw.salariesWages,
    source: financialResult?.sourceUrl || budgetActual?.sourceUrl || (isFederal ? dataset.federal.source : census.url),
    basis: financialResult ? financialResults.basis + ". " + financialResults.boundary + ". "
      + financialResult.period + ". Balance is fiscal-year-end net position; resources reconcile to the annual change in net position."
      : budgetActual ? budgetActual.basis + ". Boundary: " + budgetActual.boundary + "."
      : archiveLayer ? "Archived official state-source total on its original accounting basis; kept separate from the legislative-budget and Census controls."
      : budgetLayer ? "Canonical FY2024 legislative-budget actual unavailable; existing source detail remains research evidence only."
      : isFederal ? dataset.federal.basis + " These are total receipts, not a trace from a taxpayer to a payment."
      : "FY 2024 Census state-government revenue and expenditure aggregates, in current dollars. Revenue includes taxes, intergovernmental transfers, fees, and other receipts; it is not a tax-payment trail."
  };
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "Unavailable";
  const sign = value < 0 ? "−" : "";
  const absolute = Math.abs(value);
  if (absolute >= 1e12) return sign + "$" + (absolute / 1e12).toFixed(2) + "T";
  if (absolute >= 1e9) return sign + "$" + (absolute / 1e9).toFixed(2) + "B";
  if (absolute >= 1e6) return sign + "$" + (absolute / 1e6).toFixed(1) + "M";
  return sign + "$" + absolute.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(absolute) ? 0 : 2, maximumFractionDigits: 2
  });
}

function formatExactMoney(value) {
  return value.toLocaleString("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2
  });
}

// Format the canonical budget control without changing its source precision.
function budgetPresentationFor(budgetActuals, name) {
  const actual = budgetActuals?.[name];
  if (!actual) return {
    headline: "Unavailable", statusLabel: "Unavailable",
    coverage: "Itemized coverage unavailable",
    disclaimer: "Canonical FY2024 actual expenditures have not been researched yet.",
    outsideBudget: ""
  };
  const lowerBound = actual.status === "documented-lower-bound";
  const coverage = actual.amount ? actual.itemizedAmount / actual.amount * 100 : 0;
  const itemizationNote = actual.itemizationNote ? " · " + actual.itemizationNote : "";
  return {
    headline: (lowerBound ? "≥ " : "") + formatMoney(actual.amount),
    statusLabel: lowerBound ? "Documented lower bound" : "Official",
    coverage: "Itemized coverage: " + formatExactMoney(actual.itemizedAmount) + " of "
      + formatExactMoney(actual.amount) + " (" + coverage.toFixed(1) + "%)" + itemizationNote,
    disclaimer: lowerBound ? "Complete actual expenditures are not publicly available on this budget basis." : "",
    outsideBudget: actual.outsideBudget
  };
}

const archiveBasisEffects = {
  payments: "Payment timing, unpaid costs, protected payments, payroll, refunds, and off-system activity can change coverage.",
  budget: "Encumbrances, statutory fund scope, transfers, capital outlay, and debt service differ from economic-resources expense.",
  fund: "Current-financial-resources reporting treats capital outlay, debt, and long-term liabilities differently from full accrual.",
  administrative: "System coverage, internal transfers, eliminations, protected activity, and noncash accruals can differ.",
  purchase: "Purchase orders measure commitments; cancellations, payment timing, and capitalization prevent direct conversion to expense.",
  cash: "Cash movement can include financing, transfers, investments, or asset transactions while omitting unpaid accruals."
};

// Preserve a published checkpoint difference as a signed, unassigned row.
function adjustmentRow(id, name, amount, fromTotal, targetTotal, sourceUrl, note, relatedSources) {
  const direction = amount < 0 ? "removes " : "adds ";
  return { id, name, amount, sourceAmount: amount, sourceUrl, relatedSources, fromTotal,
    reconciliationTarget: name.replace(" adjustments", ""), targetTotal,
    program: direction + formatExactMoney(Math.abs(amount)) + " to move from "
      + formatExactMoney(fromTotal) + " to " + formatExactMoney(targetTotal) + ". " + note };
}

// Explain the archive's source-native boundary before listing possible bridge causes.
function archiveQualification(basis, archive) {
  if (!basis) return archive.note || "The archive retains its official source-native reporting boundary.";
  return basis.label + ". " + basis.detail + " " + archiveBasisEffects[basis.kind];
}

// Describe one source whose detailed rows replace its signed fallback control.
function bridgeDetailSource(row, prefix, direction, description) {
  const label = prefix + " · " + row.name, amount = direction * row.amount;
  const verb = direction < 0 ? "Removed" : "Added";
  return { label, direction, detailUrl: row.detailUrl || null,
    fallbackRow: [label, verb + " " + description + " · " + (row.program || "Published control"),
      amount, amount, row.sourceRows || 1] };
}

// Preserve every published Census function as a loadable signed source.
function censusDetailSources(censusSummary, total, direction) {
  const rows = censusSummary?.departments?.length ? censusSummary.departments
    : [{ name: "Total expenditure", program: "Published Census control", amount: total }];
  return rows.map((row) => bridgeDetailSource(row, "Census", direction, "published Census account"));
}

const largeSourceRow = 5e9;
const rowKey = (row) => JSON.stringify(row.slice(0, 3));

// Mark a large terminal row without inventing a lower-level allocation.
function publicationCeiling(row, label = "official publication ceiling") {
  if (Math.abs(row[2]) < largeSourceRow || /ceiling/i.test(row[1])) return row;
  return [row[0], row[1] + " · " + label, ...row.slice(2)];
}

function terminalSourceRow(source, row, covered = new Set()) {
  const published = source.label.startsWith("GAAP") || source.label.startsWith("Census");
  const archive = source.label.startsWith("Official archive");
  if (covered.has(rowKey(row)) || !published && !archive) return row;
  if (published || row[4] === 1) return publicationCeiling(row);
  const privacy = row[1].includes("[individual recipient omitted]");
  return publicationCeiling(row, privacy ? "privacy-preserving publication ceiling"
    : "source aggregation ceiling · deeper official split not imported");
}

// Apply a bridge sign and source prefix to one source-native base row.
function signedDetailRow(source, row) {
  const signed = [source.label + " › " + row[0], row[1], source.direction * row[2], ...row.slice(3)];
  if (Number.isFinite(row[3])) signed[3] = source.direction * row[3];
  return signed;
}

// Carry one researched child panel onto its signed reconciliation parent.
function signedDetailPanel(source, panel) {
  const signed = { ...panel, rows: panel.rows.map((row) =>
    publicationCeiling([row[0], row[1], source.direction * row[2],
      source.direction * (row[3] ?? row[2]), ...row.slice(4)])) };
  if (panel.title) signed.title = source.label + " · " + panel.title;
  if (panel.parent) signed.parent = signedDetailRow(source, panel.parent);
  if (panel.covers) signed.covers = panel.covers.map((row) => signedDetailRow(source, row));
  if (Number.isFinite(panel.sourceTotal)) signed.sourceTotal = source.direction * panel.sourceTotal;
  return signed;
}

// Expand a bridge source without discarding its previously researched panels.
function expandReconciliationSource(source, detail) {
  if (!detail) return { rows: [terminalSourceRow(source, source.fallbackRow)], itemBreakdowns: [],
    supplementalBreakdowns: [], sourceBreakdowns: [] };
  const rows = detail.rows || detail.departments.map((row) =>
    [row.name, row.program, row.amount, row.sourceAmount, row.sourceRows]);
  const expand = (key) => (detail[key] || []).map((panel) => signedDetailPanel(source, panel));
  const itemBreakdowns = expand("itemBreakdowns"), supplementalBreakdowns = expand("supplementalBreakdowns");
  const sourceBreakdowns = expand("sourceBreakdowns"), panels = [...itemBreakdowns, ...supplementalBreakdowns, ...sourceBreakdowns];
  const covered = new Set(panels.flatMap((panel) => [panel.parent, ...(panel.covers || [])]).filter(Boolean).map(rowKey));
  const signedRows = rows.map((row) => terminalSourceRow(source, signedDetailRow(source, row), covered));
  return { rows: signedRows, itemBreakdowns, supplementalBreakdowns, sourceBreakdowns };
}

// Add two sequential signed bridges without assigning unsupported amounts to agencies.
function reconcileStateArchive(dataset, census, accountingBases, financialResults, name, archive, censusSummary) {
  const raw = dataset.states[name], financial = financialResults?.states?.[name];
  if (!raw || !financial) return archive;
  const archiveTotal = archive.itemizedTotal ?? archive.sourceTotal;
  const censusUrl = census.url + "?g=040XX00US" + raw.fips + "&time=2024";
  const qualification = archiveQualification(accountingBases?.[name], archive);
  const censusNote = qualification + " The Census bridge can also reflect standardized entity/function coverage, intergovernmental payments, capital outlay, utilities, and liquor activity; no published bridge supports an agency split.";
  const gaapQualification = financialResults.basis + ". " + financialResults.boundary + ". "
    + financial.auditNote + " " + financial.document + ", " + financial.location + ".";
  const gaapNote = gaapQualification + " " + name + " publishes no numeric Census-to-GAAP bridge, so the difference remains an unallocated boundary control. Potential mechanisms are capitalization versus depreciation or amortization, asset sales or liquidations, pension/OPEB and other accruals, debt and transfer eliminations, and primary-government business-type consumer activity; none is assigned a numeric share without state evidence.";
  const gaapContextUrl = archive.departments.flatMap((row) => row.relatedSources || [])
    .find(([label, url]) => /ACFR function/i.test(label) && url.startsWith("data/"))?.[1];
  const censusRow = { ...adjustmentRow("census-adjustments", "Census adjustments", raw.total - archiveTotal,
    archiveTotal, raw.total, censusUrl, censusNote, [["Research archive source", archive.sourceUrl]]),
    detailSources: [...censusDetailSources(censusSummary, raw.total, 1),
      ...archive.departments.map((row) => bridgeDetailSource(row, "Official archive", -1,
        "official research-archive account"))] };
  const gaapRow = { ...adjustmentRow("gaap-adjustments", "GAAP adjustments", financial.expenses - raw.total,
    raw.total, financial.expenses, financial.sourceUrl, gaapNote, [["Census FY2024 table", censusUrl], ["Research archive source", archive.sourceUrl]]),
    detailSources: [bridgeDetailSource({ name: "Primary-government expenses", amount: financial.expenses,
      program: "Audited Statement of Activities control", detailUrl: financial.expenseDetailUrl || gaapContextUrl },
      "GAAP", 1, "audited expense control"),
      ...censusDetailSources(censusSummary, raw.total, -1)] };
  return { ...archive, sourceTotal: financial.expenses, itemizedTotal: financial.expenses,
    sourceUrl: financial.sourceUrl,
    sourceUrls: [["Research archive", archive.sourceUrl], ["Census FY2024 table", censusUrl],
      [financial.document, financial.sourceUrl]],
    coverageStatus: "gaap-reconciled-research-archive",
    note: "Research archive rows plus signed Census and GAAP adjustments reconcile to audited GAAP expenses; qualified causes remain unallocated without a published bridge.",
    reconciliation: { ...archive.reconciliation, archiveTotal, censusTotal: raw.total, gaapTotal: financial.expenses,
      censusAdjustment: censusRow.amount, gaapAdjustment: gaapRow.amount },
    departments: [...archive.departments, censusRow, gaapRow] };
}

function sourceLinksFor(stateSources, alternates, sources, name, fips) {
  const [census, federal, treasury, usaspending] = sources;
  if (name === "United States") {
    return { primary: treasury.url, references: [treasury, federal, usaspending].filter(Boolean) };
  }
  const primary = fips ? census.url + "?g=040XX00US" + fips + "&time=2024" : census.url;
  const catalog = (stateSources || []).find((item) => item.state === name);
  const extra = alternates?.[name] || [];
  const references = [{ label: census.label, url: primary }]
    .concat(catalog?.sources || [], extra.map(([label, url]) => ({ label, url })));
  return { primary, references };
}

function propertyRateFor(taxRates, name) {
  const values = taxRates.jurisdictions[name] || taxRates.jurisdictions["United States"];
  const property = Array.isArray(values[3]) ? values[3][0] : values[3];
  const match = String(property).match(/([\d.]+)%/);
  return match ? Number(match[1]) / 100 : 0;
}

function federalTax(income, schedule) {
  const taxable = Math.max(0, income - schedule.deduction);
  let tax = 0;
  schedule.brackets.forEach(([start, rate], index) => {
    const end = schedule.brackets[index + 1]?.[0] ?? taxable;
    if (taxable > start) tax += (Math.min(taxable, end) - start) * rate;
  });
  const baseCredit = (schedule.childCredit || 0) * (schedule.children || 0);
  const phaseout = Math.ceil(Math.max(0, income - (schedule.phaseout || Infinity)) / 1000) * 50;
  return Math.round(Math.max(0, tax - Math.max(0, baseCredit - phaseout)));
}

function estimateProfile(profile, name, labels, rate, schedule, sources) {
  const estimate = profile.jurisdictions[name];
  const levels = labels.map(([label], index) => {
    const income = estimate.incomes[index];
    const federalIncomeTax = federalTax(income, schedule);
    const stateIncomeTax = estimate.taxes[index];
    const propertyTax = rate == null ? null : Math.round(income * 10 * rate);
    return { label, income, federalIncomeTax, stateIncomeTax, propertyTax,
      tax: federalIncomeTax + stateIncomeTax + (propertyTax || 0) };
  });
  return { asOf: profile.asOfByJurisdiction?.[name] || profile.asOf,
    assumptions: profile.assumptions, note: profile.note, levels,
    incomeSource: profile.incomeSource[0], incomeUrl: profile.incomeSource[1],
    methodSource: sources.method[0], methodUrl: sources.method[1],
    federalSource: sources.federal[0], federalUrl: sources.federal[1],
    propertySource: rate == null ? null : sources.property[0],
    propertyUrl: rate == null ? null : sources.property[1] };
}

function taxOverviewFor(taxRates, incomeTiers, estimates, consumerCosts, name) {
  const values = taxRates.jurisdictions[name] || taxRates.jurisdictions["United States"];
  const tiers = incomeTiers.jurisdictions[name] || incomeTiers.jurisdictions["United States"];
  const rows = taxRates.categories.map(([label, key, defaultNote], index) => {
    const item = Array.isArray(values[index]) ? values[index] : [values[index]];
    const source = index === 0 && tiers.source ? tiers.source : taxRates.sources[item[2] || key];
    return { label, value: item[0], note: item[1] || defaultNote, source: source[0], url: source[1] };
  }).filter((row) => name !== "United States" || !["Sales / use", "Property"].includes(row.label));
  const overview = { asOf: name === "United States" ? "2026 federal rates" : taxRates.asOf,
    note: taxRates.note, rows, incomeTiers: tiers.tiers,
    costs: consumerCosts ? { ...consumerCosts, jurisdiction: name } : null,
    incomeSource: (tiers.source || incomeTiers.source)[0], incomeUrl: (tiers.source || incomeTiers.source)[1] };
  if (name === "United States") return { ...overview, household: null, individual: null };
  const rate = propertyRateFor(taxRates, name);
  const propertySource = taxRates.sources.property;
  const sources = { method: estimates.methodSource, federal: estimates.federalSource, property: propertySource };
  return { ...overview,
    household: estimateProfile(estimates, name, estimates.levels, rate, estimates.federalSchedules.joint, sources),
    individual: estimateProfile(estimates.individual, name, estimates.levels, null, estimates.federalSchedules.single, sources) };
}

function createModel(dataset, stateSources, alternates, federalSources, accountingBases, budgetActuals, financialResults, taxRates, incomeTiers, estimates, consumerCosts) {
  const find = (id) => dataset.metadata.sources.find((source) => source.id === id);
  const sources = [find("census-state-finance"), find("federal-outlays"), find("treasury-mts"), find("usaspending")];
  const scopeData = (name, sourceLayer) => scopeFor(dataset, sources[0], budgetActuals || {}, financialResults || {}, name, sourceLayer);
  return {
    metadata: dataset.metadata,
    states: dataset.states,
    federal: dataset.federal,
    budgetActualFor: (name) => budgetActuals?.[name] || null,
    financialResultFor: (name) => financialResults?.states?.[name] || null,
    budgetPresentationFor: (name) => budgetPresentationFor(budgetActuals, name),
    scopeData,
    mapMetric: (name, _layer, metric, sourceLayer) => {
      const data = scopeData(name, sourceLayer);
      if (!data.comparable && metric !== "spending") return NaN;
      return metric === "revenue" ? data.revenue : metric === "spending" ? data.spending : data.balance;
    },
    formatMoney,
    formatExactMoney,
    sourceLinks: (name, _layer, fips = "") => sourceLinksFor(stateSources, alternates, sources, name, fips),
    reconcileStateArchive: (name, archive, censusSummary) => reconcileStateArchive(dataset, sources[0], accountingBases || {}, financialResults || {}, name, archive, censusSummary),
    expandReconciliationSource,
    federalSourceRows: () => federalSources || [],
    taxOverviewFor: (name) => taxOverviewFor(taxRates, incomeTiers, estimates, consumerCosts, name)
  };
}
(function initModel(root) {
  const load = (file, globalName) => typeof module === "object" && module.exports
    ? require(file) : root[globalName];
  const model = createModel(
    load("../data/fiscal/spending.js", "TaxSpendingData"),
    load("../data/fiscal/state-sources.js", "stateSourceData"),
    load("../data/fiscal/state-source-alternates.js", "stateSourceAlternates"),
    load("../data/fiscal/federal-sources.js", "FederalSourceResearch"),
    load("../data/fiscal/state-accounting-bases.js", "StateAccountingBases"),
    load("../data/fiscal/state-budget-actuals.js", "StateBudgetActuals"),
    load("../data/fiscal/state-financial-results.js", "StateFinancialResults"),
    load("../data/tax/tax-rates.js", "taxRateData"),
    load("../data/tax/income-tiers.js", "incomeTierData"),
    load("../data/tax/household-tax-estimates.js", "householdTaxEstimateData"),
    load("../data/tax/consumer-costs.js", "consumerCostData")
  );
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.TaxModel = model;
})(typeof globalThis === "object" ? globalThis : window);
