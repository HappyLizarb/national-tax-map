// Keep audited, budget, archive, and Census controls on their own accounting bases.
function scopeFor(dataset, census, budgetActuals, ledgerTotals, financialResults, name, sourceLayer = "function") {
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
      : archiveLayer ? ledgerTotals[name] ?? null : budgetLayer ? budgetActual?.amount ?? null : raw.total,
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

const basisExplanations = {
  payments: "The state-source total measures checks, ACH, vendor payments, or transaction spending when recorded by the payment system.",
  budget: "The state-source total uses a budgetary, statutory, or administrative-fund measure rather than a consolidated economic-resources statement.",
  fund: "The state-source total uses the governmental-fund/current-financial-resources measurement focus rather than full-accrual primary-government expense.",
  administrative: "The state-source total is an agency or accounting-system aggregation, not a consolidated government-wide Statement of Activities.",
  purchase: "The state-source total measures purchase orders or contracts, which are commitments rather than audited expense when incurred.",
  cash: "The state-source total uses cash reporting, recognizing activity when money moves within the covered treasury funds."
};

function comparisonReferences(basis, financial, censusUrl) {
  const censusReferences = [
    ["Census FY2024 table", censusUrl],
    ["Census methodology", "https://www.census.gov/programs-surveys/state/technical-documentation/methodology.html"]
  ];
  return basis ? [
    ["Official state-source data", basis.ledgerUrl],
    ["FY2024 audited ACFR", basis.acfrUrl],
    ...censusReferences,
    ["Census classification manual", "https://www2.census.gov/govs/class/classfull.pdf"]
  ] : [["FY2024 audited ACFR", financial.sourceUrl], ...censusReferences];
}

// Compare Census with the canonical non-Census control available for each state.
function accountingComparisonFor(dataset, census, ledgerTotals, accountingBases, budgetActuals, financialResults, name) {
  const raw = dataset.states[name], actual = budgetActuals?.[name], basis = accountingBases?.[name];
  const financial = financialResults?.states?.[name];
  if (!raw) return null;
  const censusUrl = census.url + "?g=040XX00US" + raw.fips + "&time=2024";
  if (actual) return {
    kind: "budget-standard", censusTotal: raw.total,
    stateTotal: actual.amount, difference: null,
    itemizedTotal: actual.itemizedAmount,
    coveragePercent: actual.itemizedAmount / actual.amount * 100,
    status: actual.status, label: actual.basis,
    provenance: actual.issuer + ". " + actual.document + ", " + actual.location + ". Period: "
      + actual.period + ". Exact amount: " + formatExactMoney(actual.amount) + " " + actual.unit
      + ". Source precision: " + formatExactMoney(actual.precision) + ". Revision: " + actual.revisionDate
      + ". Published: " + actual.publicationDate + ". Audit status: " + actual.auditStatus + ".",
    statement: "Entity boundary: " + actual.boundary + ". Transfer treatment: " + actual.transfers
      + ". Known exclusions: " + actual.exclusions + ".",
    references: [["Official budget-basis source", actual.sourceUrl],
      ["Pilot source audit", "data/research/pilot-legislative-budget-actuals.md"], ["Census comparison", censusUrl]]
  };
  if (!basis && !financial) return null;
  const stateTotal = basis ? ledgerTotals[name] : financial.expenses;
  return {
    kind: basis ? "legacy-comparison" : "gaap-comparison",
    censusTotal: raw.total,
    stateTotal,
    difference: raw.total - stateTotal,
    label: basis?.label || "Audited primary-government GAAP expenses",
    statement: basis ? basisExplanations[basis.kind] + " " + basis.detail
      : financialResults.basis + ". " + financialResults.boundary + ".",
    references: comparisonReferences(basis, financial, censusUrl)
  };
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
    const propertyTax = Math.round(income * 10 * rate);
    return { label, income, federalIncomeTax, stateIncomeTax, propertyTax,
      tax: federalIncomeTax + stateIncomeTax + propertyTax };
  });
  return { asOf: profile.asOfByJurisdiction?.[name] || profile.asOf,
    assumptions: profile.assumptions, note: profile.note, levels,
    incomeSource: profile.incomeSource[0], incomeUrl: profile.incomeSource[1],
    methodSource: sources.method[0], methodUrl: sources.method[1],
    federalSource: sources.federal[0], federalUrl: sources.federal[1],
    propertySource: sources.property[0], propertyUrl: sources.property[1] };
}

function taxOverviewFor(taxRates, incomeTiers, estimates, name) {
  const values = taxRates.jurisdictions[name] || taxRates.jurisdictions["United States"];
  const tiers = incomeTiers.jurisdictions[name] || incomeTiers.jurisdictions["United States"];
  const rows = taxRates.categories.map(([label, key, defaultNote], index) => {
    const item = Array.isArray(values[index]) ? values[index] : [values[index]];
    const source = index === 0 && tiers.source ? tiers.source : taxRates.sources[item[2] || key];
    return { label, value: item[0], note: item[1] || defaultNote, source: source[0], url: source[1] };
  }).filter((row) => name !== "United States" || !["Sales / use", "Property"].includes(row.label));
  const overview = { asOf: name === "United States" ? "2026 federal rates" : taxRates.asOf,
    note: taxRates.note, rows, incomeTiers: tiers.tiers,
    incomeSource: (tiers.source || incomeTiers.source)[0], incomeUrl: (tiers.source || incomeTiers.source)[1] };
  if (name === "United States") return { ...overview, household: null, individual: null };
  const rate = propertyRateFor(taxRates, name);
  const propertySource = taxRates.sources.property;
  const sources = { method: estimates.methodSource, federal: estimates.federalSource, property: propertySource };
  return { ...overview,
    household: estimateProfile(estimates, name, estimates.levels, rate, estimates.federalSchedules.joint, sources),
    individual: estimateProfile(estimates.individual, name, estimates.levels, rate, estimates.federalSchedules.single, sources) };
}

function createModel(dataset, stateSources, alternates, federalSources, ledgerTotals, accountingBases, budgetActuals, financialResults, taxRates, incomeTiers, estimates) {
  const find = (id) => dataset.metadata.sources.find((source) => source.id === id);
  const sources = [find("census-state-finance"), find("federal-outlays"), find("treasury-mts"), find("usaspending")];
  const scopeData = (name, sourceLayer) => scopeFor(dataset, sources[0], budgetActuals || {}, ledgerTotals || {}, financialResults || {}, name, sourceLayer);
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
    accountingComparisonFor: (name) => accountingComparisonFor(dataset, sources[0], ledgerTotals || {}, accountingBases || {}, budgetActuals || {}, financialResults || {}, name),
    federalSourceRows: () => federalSources || [],
    taxOverviewFor: (name) => taxOverviewFor(taxRates, incomeTiers, estimates, name)
  };
}

(function initModel(root) {
  const load = (file, globalName) => typeof module === "object" && module.exports
    ? require(file) : root[globalName];
  const model = createModel(
    load("./data/spending.js", "TaxSpendingData"),
    load("./data/state-sources.js", "stateSourceData"),
    load("./data/state-source-alternates.js", "stateSourceAlternates"),
    load("./data/federal-sources.js", "FederalSourceResearch"),
    load("./data/state-ledger-totals.js", "StateLedgerTotals"),
    load("./data/state-accounting-bases.js", "StateAccountingBases"),
    load("./data/state-budget-actuals.js", "StateBudgetActuals"),
    load("./data/state-financial-results.js", "StateFinancialResults"),
    load("./data/tax-rates.js", "taxRateData"),
    load("./data/income-tiers.js", "incomeTierData"),
    load("./data/household-tax-estimates.js", "householdTaxEstimateData")
  );
  if (typeof module === "object" && module.exports) module.exports = model;
  else root.TaxModel = model;
})(typeof globalThis === "object" ? globalThis : window);
