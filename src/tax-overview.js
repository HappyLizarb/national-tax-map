(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory;
  else root.createTaxOverview = factory;
})(typeof globalThis === "object" ? globalThis : window, function createTaxOverview(
  taxRates, incomeTiers, estimates, consumerCosts, name
) {
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
  const sources = { method: estimates.methodSource, federal: estimates.federalSource,
    property: taxRates.sources.property };
  return { ...overview,
    household: estimateProfile(estimates, name, estimates.levels, rate, estimates.federalSchedules.joint, sources),
    individual: estimateProfile(estimates.individual, name, estimates.levels, null,
      estimates.federalSchedules.single, sources) };
});

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
