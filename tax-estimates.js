function estimateLevelsHtml(profile, escapeHtml) {
  return profile.levels.map((row) => '<span class="tax-estimate-level"><b>' + escapeHtml(row.label)
    + '</b><em>$' + row.tax.toLocaleString("en-US") + ' total</em><small class="tax-estimate-income">$'
    + row.income.toLocaleString("en-US") + ' income</small><small class="tax-estimate-breakdown"><span>$'
    + row.federalIncomeTax.toLocaleString("en-US") + ' federal</span><span>$'
    + row.stateIncomeTax.toLocaleString("en-US") + ' state</span><span>$'
    + row.propertyTax.toLocaleString("en-US") + ' property</span></small></span>').join("");
}

function estimateProfileHtml(title, profile, sharedAsOf, escapeHtml) {
  const asOf = sharedAsOf ? "" : '<span>' + escapeHtml(profile.asOf) + '</span>';
  return '<section class="tax-estimate-profile"><header><h4>' + escapeHtml(title)
    + '</h4>' + asOf + '</header><small>'
    + escapeHtml(profile.assumptions) + '</small><div class="household-estimate-grid">'
    + estimateLevelsHtml(profile, escapeHtml) + '</div></section>';
}

function estimateSourceLinks(tax, escapeHtml) {
  const profiles = [tax.household, tax.individual];
  const sources = [[tax.incomeUrl, tax.incomeSource],
    ...profiles.map((profile) => [profile.incomeUrl, profile.incomeSource]),
    ...["federal", "method", "property"].map((kind) =>
      [tax.household[kind + "Url"], tax.household[kind + "Source"]])];
  return sources.filter(([url], index) => url && sources.findIndex(([item]) => item === url) === index)
    .map(([url, label]) => '<a href="' + escapeHtml(url)
      + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>').join("");
}

function renderTaxEstimates(tax, escapeHtml) {
  if (!tax.household || !tax.individual) return "";
  const sharedAsOf = tax.household.asOf === tax.individual.asOf ? tax.household.asOf : "";
  const profiles = estimateProfileHtml("Household of four", tax.household, sharedAsOf, escapeHtml)
    + estimateProfileHtml("Working individual", tax.individual, sharedAsOf, escapeHtml);
  const note = "Weighted 2024 ACS percentile benchmarks · simplified 2026 federal and state income tax + estimated property tax. Excludes payroll, local income, itemized deductions, refundable credits, and situation-specific items.";
  const asOf = sharedAsOf ? '<p class="tax-estimate-as-of">' + escapeHtml(sharedAsOf) + '</p>' : "";
  return '<article class="tax-estimate-window">' + asOf + '<div class="tax-estimate-profiles">' + profiles
    + '</div><footer class="tax-estimate-footer"><small>' + note
    + '</small><div class="tax-estimate-sources">' + estimateSourceLinks(tax, escapeHtml) + '</div></footer></article>';
}

if (typeof module !== "undefined") module.exports = renderTaxEstimates;
