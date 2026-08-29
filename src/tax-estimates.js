function estimateLevelsHtml(profile, escapeHtml) {
  return profile.levels.map((row) => {
    const effectiveRate = (row.tax / row.income * 100).toFixed(1);
    const netIncome = row.income - row.tax;
    const propertyTax = row.propertyTax == null ? "" : '<span>$'
      + row.propertyTax.toLocaleString("en-US") + ' property</span>';
    return '<span class="tax-estimate-level"><b>' + escapeHtml(row.label)
      + '</b><em>$' + row.tax.toLocaleString("en-US") + ' total</em><small class="tax-estimate-income">$'
      + row.income.toLocaleString("en-US") + ' income</small><small class="tax-estimate-breakdown"><span>$'
      + row.federalIncomeTax.toLocaleString("en-US") + ' federal</span><span>$'
      + row.stateIncomeTax.toLocaleString("en-US") + ' state</span>' + propertyTax
      + '</small><span class="tax-estimate-net"><small>Post-tax income</small><strong>$'
      + netIncome.toLocaleString("en-US") + ' <span>· $'
      + Math.round(netIncome / 12).toLocaleString("en-US") + '/mo</span></strong><small>'
      + effectiveRate + '% effective tax rate</small></span></span>';
  }).join("");
}

function estimateProfileHtml(title, profile, sharedAsOf, escapeHtml) {
  const asOf = sharedAsOf ? "" : '<span>' + escapeHtml(profile.asOf) + '</span>';
  return '<section class="tax-estimate-profile"><header><h4>' + escapeHtml(title)
    + '</h4>' + asOf + '</header><small>'
    + escapeHtml(profile.assumptions) + '</small><div class="household-estimate-grid">'
    + estimateLevelsHtml(profile, escapeHtml) + '</div></section>';
}

function estimateSourceLinks(tax, escapeHtml) {
  const profiles = [tax.household, tax.individual].filter(Boolean);
  const sources = [[tax.incomeUrl, tax.incomeSource],
    ...profiles.map((profile) => [profile.incomeUrl, profile.incomeSource]),
    ...["federal", "method", "property"].map((kind) =>
      [tax.household?.[kind + "Url"], tax.household?.[kind + "Source"]])];
  return sources.filter(([url], index) => url && sources.findIndex(([item]) => item === url) === index)
    .map(([url, label]) => '<a href="' + escapeHtml(url)
      + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>').join("");
}

function formatCost(value, kind) {
  if (kind === "salesTax") return Number(value.toFixed(2)) + "%";
  if (kind === "electricity") return value.toFixed(2) + "¢";
  if (kind === "minimumWage") return "$" + value.toFixed(2) + "/hr";
  if (kind === "rent") {
    if (value === 99) return "<$100";
    if (value === 3501) return "$3,500+";
    return "$" + Math.round(value).toLocaleString("en-US");
  }
  return "$" + value.toFixed(2);
}

function stateItemValues(item, state) {
  if (item.kind === "goods") return state.goods.areas.map((index) => item.base * index / 100);
  if (item.kind === "rent") return state.rent.places;
  if (item.kind === "electricity") return state.electricity.areas;
  return [state.salesTax.base, state.salesTax.average, state.salesTax.maximum];
}

function stateItemBenchmark(item, state, costs) {
  if (item.kind === "minimumWage") return costs.minimumWages[state.code];
  if (item.kind === "goods") return item.base * state.goods.state / 100;
  if (item.kind === "rent") return state.rent.state;
  if (item.kind === "electricity") return state.electricity.state;
  return state.salesTax.average;
}

function percentileRows(rows) {
  const sorted = [...rows].sort((a, b) => a.value - b.value);
  return [0, .1, .25, .5, .75, .9, 1]
    .map((percentile) => sorted[Math.round((sorted.length - 1) * percentile)]);
}

function nationalMarkers(item, costs) {
  const rows = Object.entries(costs.jurisdictions).map(([name, data]) =>
    ({ name, code: data.code, value: stateItemBenchmark(item, data, costs) }));
  return percentileRows(rows).map((row, index) =>
    ({ label: costs.percentiles[index] + " · " + row.code, title: row.name, value: row.value }));
}

function markersFor(item, costs) {
  const state = costs.jurisdictions[costs.jurisdiction];
  const markers = item.kind === "minimumWage" || !state ? nationalMarkers(item, costs) : (() => {
    const labels = item.kind === "salesTax" ? ["Base", "Average", "Maximum"] : costs.percentiles;
    return labels.map((label, index) => ({ label, value: stateItemValues(item, state)[index] }));
  })();
  if (state) markers.push({ label: state.code, title: costs.jurisdiction,
    value: stateItemBenchmark(item, state, costs), featured: true });
  return markers;
}

function collapseMarkers(markers, kind) {
  return markers.reduce((groups, marker) => {
    const valueLabel = formatCost(marker.value, kind);
    const group = groups.find((item) => item.valueLabel === valueLabel
      && Boolean(item.featured) === Boolean(marker.featured));
    if (group) group.lastLabel = marker.label;
    else groups.push({ ...marker, valueLabel, firstLabel: marker.label, lastLabel: marker.label });
    return groups;
  }, []).map((marker) => ({ ...marker, label: marker.firstLabel === marker.lastLabel
    ? marker.firstLabel : marker.firstLabel + "–" + marker.lastLabel }));
}

function costMarkerHtml(marker, min, max, index, escapeHtml) {
  const position = max === min ? 50 : (marker.value - min) / (max - min) * 100;
  const title = marker.title ? ' title="' + escapeHtml(marker.title) + '"' : "";
  const className = "consumer-cost-marker" + (marker.featured ? " is-state" : "");
  return '<span class="' + className + '" style="left:' + position.toFixed(2)
    + '%;--lane:' + index % 2 + '"' + title + '><b>' + escapeHtml(marker.label)
    + '</b><em>' + escapeHtml(marker.valueLabel) + '</em></span>';
}

function costRowHtml(item, costs, escapeHtml) {
  const state = costs.jurisdictions[costs.jurisdiction];
  const markers = collapseMarkers(markersFor(item, costs), item.kind);
  const values = markers.map((marker) => marker.value);
  const min = Math.min(...values), max = Math.max(...values);
  const scope = item.kind === "rent" ? "Observed across Census places · equal place weight"
    : item.kind === "salesTax" ? "State base · weighted average · published maximum"
      : item.kind === "minimumWage" ? "Across 50 states + DC · general rates"
      : "Estimated across metro and nonmetro areas · equal area weight";
  const benchmark = state ? (item.kind === "salesTax" ? "Combined average "
    : item.kind === "minimumWage" ? "State standard " : "State benchmark ")
    + formatCost(stateItemBenchmark(item, state, costs), item.kind) : formatCost(min, item.kind) + "–" + formatCost(max, item.kind);
  const aria = item.label + ": " + markers.map((marker) => marker.label + " " + marker.valueLabel).join(", ");
  return '<article class="consumer-cost-row"><header><span><b>' + escapeHtml(item.label)
    + '</b><small>' + scope + '</small></span><strong>' + escapeHtml(benchmark)
    + '</strong></header><div class="consumer-cost-chart"><div class="consumer-cost-scale" role="img" aria-label="'
    + escapeHtml(aria) + '"><div class="consumer-cost-markers">'
    + markers.map((marker, index) => costMarkerHtml(marker, min, max, index, escapeHtml)).join("")
    + '</div><div class="consumer-cost-gradient"></div></div></div></article>';
}

function consumerCostsHtml(costs, escapeHtml) {
  if (!costs) return "";
  const national = costs.jurisdiction === "United States";
  const scope = national ? "Across 50 states + DC" : "Across " + costs.jurisdiction;
  const sources = Object.values(costs.sources).map(([label, url]) => '<a href="' + escapeHtml(url)
    + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>').join("");
  return '<section class="consumer-costs"><header><h4>Common household costs</h4><span>' + escapeHtml(scope)
    + '</span></header><p>' + escapeHtml(costs.note) + '</p><div class="consumer-cost-list">'
    + costs.items.map((item) => costRowHtml(item, costs, escapeHtml)).join("")
    + '</div><div class="tax-estimate-sources consumer-cost-sources">' + sources + '</div></section>';
}

function renderTaxEstimates(tax, escapeHtml) {
  if ((!tax.household || !tax.individual) && !tax.costs) return "";
  const sharedAsOf = tax.household?.asOf === tax.individual?.asOf ? tax.household?.asOf : "";
  const profiles = tax.household && tax.individual ? '<div class="tax-estimate-profiles">'
    + estimateProfileHtml("Household of four", tax.household, sharedAsOf, escapeHtml)
    + estimateProfileHtml("Working individual", tax.individual, sharedAsOf, escapeHtml) + "</div>" : "";
  const note = "Weighted 2024 ACS percentile benchmarks · simplified 2026 federal and state income tax; household estimates also include estimated property tax. Excludes payroll, local income, itemized deductions, refundable credits, and situation-specific items.";
  const asOf = sharedAsOf ? '<p class="tax-estimate-as-of">' + escapeHtml(sharedAsOf) + '</p>' : "";
  const footer = profiles ? '<footer class="tax-estimate-footer"><small>' + note
    + '</small><div class="tax-estimate-sources">' + estimateSourceLinks(tax, escapeHtml) + "</div></footer>" : "";
  return '<article class="tax-estimate-window">' + asOf + profiles
    + consumerCostsHtml(tax.costs, escapeHtml) + footer + "</article>";
}

if (typeof module !== "undefined") module.exports = renderTaxEstimates;
