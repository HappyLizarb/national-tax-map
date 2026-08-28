function updatePanel() {
  const canonical = model.scopeData(state.scope, state.layer === "federal" ? "itemized" : "financial");
  const allocation = model.scopeData(state.scope, "itemized");
  const financial = canonical.financialResult;
  const status = canonical.kind === "federal" ? "Source-backed"
    : financial ? (hasAuditCaveat(financial) ? "Official GAAP · audit caveat" : "Audited GAAP")
      : canonical.comparable ? "Census comparison" : "Separate source basis";
  animatePanelChange();
  setText("#scopeTitle", canonical.name);
  setText("#scopeContext", (canonical.kind === "federal" ? "Federal outlays" : status) + " · FY 2024");
  setText("#budgetStatus", status);
  updateSources(canonical); updateKpis(canonical, null); updateAccountingComparison(canonical.name); updateTaxRates(canonical.name);
  updateComparison(canonical); updateAllocation(allocation); updateSecondary(canonical);
  setText("#dataBasis", canonical.basis);
}
// Briefly soften state changes while respecting reduced-motion preferences.
function animatePanelChange() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  [$(".detail-panel"), $(".fiscal-detail")].forEach((element) => element.animate(
    [{ opacity: .65, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }],
    { duration: 320, easing: "ease-in-out" }
  ));
}
function updateSources(data) {
  const name = data.name;
  const feature = state.features.find((item) => item.properties.name === name);
  const sources = model.sourceLinks(name, state.layer, feature?.id);
  const budget = data.budgetActual;
  const financial = data.financialResult;
  const primary = financial?.sourceUrl || budget?.sourceUrl || sources.primary;
  const references = (budget ? [{ label: budget.document, url: budget.sourceUrl }, ...sources.references]
    : financial ? [{ label: financial.document, url: financial.sourceUrl }, ...sources.references] : sources.references)
    .filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index);
  $("#scopeLink").href = primary;
  $$('[data-source-link]').forEach((link) => link.href = primary);
  $("#sourceList").innerHTML = "Sources: " + references.map((source) =>
    '<a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.label) + "</a>").join(" · ");
}
function updateKpis(data, budget) {
  const financial = data.financialResult;
  setText("#revenueLabel", financial ? "GAAP resources" : "Receipts / revenue");
  setText("#spendingLabel", financial ? "GAAP expenses" : "Spending");
  setText("#balanceLabel", financial ? "Net position" : "Balance");
  setText("#spendingValue", budget?.headline || model.formatMoney(data.spending));
  const disclosure = kpiDisclosureFor(budget, financial);
  $$('[data-kpi-disclosure]').forEach((mark) => {
    const applies = disclosure.targets.includes(mark.dataset.kpiDisclosure);
    mark.hidden = !applies;
    if (applies) mark.previousElementSibling.setAttribute("aria-describedby", "budgetDisclosure");
    else mark.previousElementSibling.removeAttribute("aria-describedby");
  });
  setText("#budgetDisclosure", disclosure.text);
  $("#budgetDisclosure").hidden = !disclosure.text;
  setText("#outsideBudgetText", budget?.outsideBudget || "");
  $("#outsideBudgetDisclosure").hidden = !budget?.outsideBudget;
  if (!data.comparable) {
    setText("#revenueValue", "Not comparable"); setText("#balanceValue", "Not comparable");
    $(".balance-kpi").classList.remove("surplus");
    return;
  }
  setText("#revenueValue", model.formatMoney(data.revenue)); setText("#balanceValue", model.formatMoney(data.balance));
  $(".balance-kpi").classList.toggle("surplus", data.balance != null && data.balance >= 0);
}
// Describe the canonical budget standard without treating Census as additive.
function updateAccountingComparison(name) {
  const section = $("#accountingComparison");
  const comparison = model.accountingComparisonFor(name);
  section.hidden = !comparison;
  if (!comparison) return;
  const budgetStandard = comparison.kind === "budget-standard";
  const gaapComparison = comparison.kind === "gaap-comparison";
  setText("#accountingComparisonTitle", budgetStandard ? "Official legislative-budget standard"
    : gaapComparison ? "Census and audited GAAP comparison" : "Two reported totals, different measurement boundaries");
  setText("#accountingComparisonAsOf", budgetStandard ? "FY 2024 · state-specific basis" : "FY 2024 · not additive");
  setText("#censusReportedLabel", budgetStandard ? "Standardized Census comparison" : "Census statistical total");
  setText("#censusReportedBasis", "Standardized functions and Census-defined state-government coverage");
  setText("#censusReportedTotal", model.formatExactMoney(comparison.censusTotal));
  setText("#stateReportedTotal", model.formatExactMoney(comparison.stateTotal));
  setText("#stateReportedLabel", budgetStandard ? model.budgetPresentationFor(name).statusLabel
    : gaapComparison ? "Audited GAAP expenses" : "Official state-source total");
  setText("#stateReportedBasis", comparison.label);
  const difference = budgetStandard ? model.formatExactMoney(comparison.itemizedTotal) : model.formatExactMoney(comparison.difference);
  setText("#accountingThirdLabel", budgetStandard ? "Itemized coverage"
    : gaapComparison ? "Census minus GAAP" : "Census minus state source");
  setText("#accountingDifference", budgetStandard || comparison.difference <= 0 ? difference : "+" + difference);
  setText("#accountingThirdBasis", budgetStandard ? comparison.coveragePercent.toFixed(1) + "% of the canonical control" : "Diagnostic difference—not missing or excess spending");
  setText("#accountingStatement", (comparison.provenance ? comparison.provenance + " " : "") + comparison.statement);
  $("#accountingEvidence").innerHTML = "Evidence: " + comparison.references
    .map(([label, url]) => sourceAnchor(url, label)).join(" · ");
}
function updateTaxRates(name) {
  const tax = model.taxOverviewFor(name);
  const tiers = tax.incomeTiers.split(/ · |; |: (?=[+]?\d)/).filter(Boolean);
  setText("#taxRateAsOf", tax.asOf); setText("#taxRateNote", tax.note);
  setText("#incomeTaxTiersAsOf", tax.asOf); $("#incomeTaxTiersRows").innerHTML = tiers.map((tier) => {
    const rate = tier.match(/[+]?\d+(?:\.\d+)?%/);
    const threshold = rate && (tier.slice(0, rate.index) + tier.slice(rate.index + rate[0].length))
      .trim().replace(/^>\s*/, "Above ").replace(/^flat\s*>\s*/i, "Above ");
    return rate ? "<tr><td>" + escapeHtml(threshold || "All taxable income") + "</td><td>" + rate[0] + "</td></tr>"
      : '<tr class="tier-note"><td colspan="2">' + escapeHtml(tier) + "</td></tr>";
  }).join("");
  $("#incomeTaxTiersSource").href = tax.incomeUrl;
  setText("#incomeTaxTiersSource", tax.incomeSource + " ↗");
  $("#taxEstimateSection").hidden = !tax.household;
  $("#householdTaxRows").innerHTML = renderTaxEstimates(tax, escapeHtml);
  $("#taxRateRows").innerHTML = tax.rows.map((row) => '<article class="tax-rate-card"><span>' + row.label + '</span><strong>' + row.value + '</strong><small>' + row.note + '</small><a href="' + row.url + '" target="_blank" rel="noopener noreferrer">' + row.source + ' ↗</a></article>').join("");
}
function updateComparison(data) {
  const financial = data.financialResult;
  setText("#gapTitle a", financial ? "GAAP resources and expenses" : "Revenue–spending gap");
  setText("#revenueBarLabel", financial ? "GAAP resources" : "Receipts / revenue");
  setText("#spendingBarLabel", financial ? "GAAP expenses" : "Spending");
  if (!data.comparable) {
    $("#revenueBar").style.width = "0%"; $("#spendingBar").style.width = "100%";
    setText("#revenueBarValue", "Not comparable"); setText("#spendingBarValue", model.formatMoney(data.spending));
    setText("#gapPercent", "Select comparable function ledger for a revenue comparison");
    return;
  }
  const maximum = Math.max(data.revenue, data.spending);
  $("#revenueBar").style.width = data.revenue / maximum * 100 + "%"; $("#spendingBar").style.width = data.spending / maximum * 100 + "%";
  setText("#revenueBarValue", model.formatMoney(data.revenue)); setText("#spendingBarValue", model.formatMoney(data.spending));
  setText("#gapPercent", financial ? model.formatMoney(financial.changeInNetPosition) + " annual change in net position"
    : data.balance == null ? "No official same-basis result reported" : model.formatMoney(data.balance) + " officially reported");
}
async function updateAllocation(data) {
  const request = ++state.request;
  state.detailRequest++;
  setText("#allocationTotal", "Loading departments…");
  $("#categoryList").innerHTML = ""; $("#breakdownDetails").textContent = "Choose a department after it loads.";
  $("#agencyRows").innerHTML = ""; setText("#sourceExplorerNote", "Itemized rows load only after a department is selected.");
  try {
    const primary = await DepartmentData.loadSummary(data.name);
    const summary = await allocationSummary(data.name, primary);
    if (request !== state.request) return;
    renderAllocation(summary, data);
  } catch (error) {
    if (request === state.request) setText("#allocationTotal", error.message);
  }
}
// Use the preserved itemized ledger only when it is a distinct, locally validated layer.
async function allocationSummary(scope, primary) {
  if (state.allocationSource === "function") return primary;
  if (state.allocationSource === "financial") {
    const result = model.financialResultFor(scope);
    const note = "Statement control only; no same-basis agency itemization is claimed.";
    return { sourceUrl: result.sourceUrl, coverageStatus: "financial-statement-control", note,
      departments: [{ name: "Government-wide expenses", amount: result.expenses,
        sourceUrl: result.sourceUrl, note }] };
  }
  const archiveUrl = scope === "United States"
    ? "data/federal/archive-agency-source/federal-official-source-summary.json"
    : primary.departments.flatMap((row) => row.relatedSources || []).find(([label, url]) =>
      label === "Prior state layer snapshot" && url.startsWith("data/"))?.[1];
  if (state.allocationSource === "archive") {
    if (!archiveUrl) throw new Error("No archived source ledger for " + scope);
    const archive = await DepartmentData.loadDetail(archiveUrl);
    if (scope !== "United States") return archive;
    const researchByArchive = new Map(primary.departments.flatMap((department) =>
      (department.relatedSources || []).filter(([, url]) => url !== archiveUrl)
        .map(([, url]) => [url, department.detailUrl])));
    return { ...archive, departments: archive.departments.map((department) => ({
      ...department, researchDetailUrl: researchByArchive.get(department.detailUrl)
    })) };
  }
  if (scope === "United States") return primary;
  const budget = model.budgetActualFor(scope);
  if (budget?.itemizationUrl) return DepartmentData.loadDetail(budget.itemizationUrl);
  if (budget && !budget.itemizedAmount) return {
    ...primary, departments: [], coverageStatus: "canonical-budget-unitemized",
    sourceUrl: budget.sourceUrl,
    note: "Archived source rows have not been matched to this canonical budget control."
  };
  return archiveUrl ? DepartmentData.loadDetail(archiveUrl) : primary;
}
function renderAllocation(summary, scopeData) {
  const positiveTotal = summary.departments.reduce((sum, row) => sum + Math.max(row.amount, 0), 0);
  const sourceTotal = summary.itemizedTotal ?? summary.departments.reduce((sum, row) => sum + row.amount, 0);
  const budget = scopeData.budgetActual;
  const coverage = budget ? budget.itemizedAmount / budget.amount * 100 : 100;
  const departments = summary.departments.map((row) => ({
    ...row,
    chartAmount: Math.max(row.amount, 0),
    share: positiveTotal ? Math.max(row.amount, 0) / positiveTotal * 100 : 0,
    comparisonUrl: summary.comparison?.url,
    comparisonLabel: summary.comparison?.label
  })).sort((a, b) => b.chartAmount - a.chartAmount || Math.abs(b.amount) - Math.abs(a.amount));
  const hasAdjustments = departments.some((row) => row.amount < 0);
  setText("#allocationTotal", allocationLabel(summary, sourceTotal, scopeData));
  $("#categoryList").innerHTML = departments.map((row, index) => '<button class="category-row" type="button" data-category="' + index + '"><span><i style="background:' + palette[index % palette.length] + '"></i>' + escapeHtml(row.name) + '</span><b>' + shareLabel(row) + '</b></button>').join("");
  $("#categoryList").querySelectorAll('[data-category]').forEach((button) =>
    button.addEventListener("click", () => showBreakdown(departments[Number(button.dataset.category)])));
  const coverageNote = state.allocationSource === "financial" ? "statement control"
    : state.allocationSource === "archive" ? "archived source basis"
    : budget ? "of canonical total" : "itemized allocations";
  drawDonut(departments, coverage.toFixed(1) + "%", coverageNote);
  setText("#coverageShare", budget ? coverage.toFixed(1) + "%" : hasAdjustments ? "100% of positive allocations" : "100%");
  setText("#sourceExplorerNote", summary.note || "Itemized rows load only after a department is selected.");
  if (scopeData.kind === "federal") $("#agencyRows").innerHTML = federalResearchCatalog();
  $("#allocationTitle a").href = summary.departments[0]?.sourceUrl || summary.sourceUrl;
}
function allocationLabel(summary, total, scopeData) {
  if (state.allocationSource === "financial") return model.formatMoney(total) + " government-wide expenses";
  if (state.allocationSource === "archive") return model.formatMoney(total) + " archived source basis";
  if (scopeData.kind === "federal") return model.formatMoney(total) + " net agency/program outlays";
  if (scopeData.budgetActual) return scopeData.budgetActual.itemizedAmount
    ? model.formatMoney(scopeData.budgetActual.itemizedAmount) + " validated itemization"
    : "No validated itemization yet";
  const label = summary.coverageStatus === "official-itemized-source-basis"
    ? "official itemized allocations" : "function allocations";
  return model.formatMoney(total) + " " + label;
}
function federalResearchCatalog() {
  return model.federalSourceRows().map((source) => '<details class="source-catalog"><summary><strong>'
    + escapeHtml(source.label) + '</strong><small>' + escapeHtml(source.status + " · " + source.decision)
    + '</small></summary><div>' + source.links.map((link) => sourceAnchor(link.url, link.label + " ↗")).join("")
    + "</div></details>").join("");
}
function sourceAnchor(url, label) {
  return '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + "</a>";
}

function drawDonut(departments, coverageLabel, coverageNote) {
  const host = d3.select("#allocationDonut"); host.selectAll("*").remove();
  const svg = host.append("svg").attr("viewBox", "0 0 116 116").attr("role", "img");
  const arc = d3.arc().innerRadius(34).outerRadius(54);
  const chartDepartments = departments.filter((row) => row.chartAmount > 0);
  svg.selectAll("path").data(d3.pie().sort(null).value((row) => row.chartAmount)(chartDepartments)).join("path")
    .attr("class", "donut-segment").attr("d", arc).attr("transform", "translate(58 58)")
    .attr("fill", (_, index) => palette[index % palette.length]).attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", (part) => part.data.name + ", " + shareLabel(part.data))
    .on("click", (_, part) => showBreakdown(part.data))
    .on("keydown", (event, part) => event.key === "Enter" && showBreakdown(part.data));
  const note = departments.some((row) => row.amount < 0) ? "positive itemized allocations" : coverageNote;
  host.append("div").attr("class", "donut-center").html('<strong>' + coverageLabel + '</strong><span>' + note + '</span>');
}

async function showBreakdown(department) {
  const request = ++state.detailRequest;
  const details = $("#breakdownDetails");
  details.innerHTML = '<strong>' + escapeHtml(department.name) + '</strong><span>' + model.formatMoney(department.amount) + ' · ' + shareLabel(department) + '</span>' + sourceBasisNote(department) + sourceLink(department.sourceUrl, department.comparisonUrl, department.comparisonLabel, department.relatedSources);
  if (department.detailUrl) {
    setText("#sourceExplorerNote", "Loading itemized rows for " + department.name + "…");
    try {
      const [detail, research] = await Promise.all([
        DepartmentData.loadDetail(department.detailUrl),
        department.researchDetailUrl ? DepartmentData.loadDetail(department.researchDetailUrl) : null
      ]);
      if (request === state.detailRequest) renderDetail(research ? {
        ...detail,
        sourceBreakdowns: [...(detail.sourceBreakdowns || []), ...(research.sourceBreakdowns || []),
          ...(research.supplementalBreakdowns || [])]
      } : detail);
    } catch (error) {
      if (request === state.detailRequest) setText("#sourceExplorerNote", error.message);
    }
    return;
  }
  if (department.program) {
    renderDetail({
      department: department.name,
      rows: [[department.name, department.program, department.amount, department.sourceAmount, department.sourceRows]],
      sourceUrl: department.sourceUrl,
      note: department.note
    });
    return;
  }
  setText("#sourceExplorerNote", department.note || "No additional itemized rows are available for this source group.");
  $("#agencyRows").innerHTML = "";
}
function renderDetail(detail) {
  const limit = 500, rows = detail.rows.slice(0, limit);
  const hierarchy = renderReceiptHierarchy(detail, model.formatMoney, escapeHtml);
  const note = detail.note ? " · " + detail.note : "";
  const rowCount = hierarchy ? detail.sourceFloor.accountCount + " Treasury receipt accounts · 1 MTS rounding bridge"
    : detail.rows.length.toLocaleString() + " itemized rows";
  setText("#sourceExplorerNote", detail.department + " · " + rowCount + (detail.rows.length > limit ? " · first 500 shown" : "") + note);
  $("#agencyRows").innerHTML = detailSourceLinks(detail) + sourceBreakdowns(detail) + hierarchy + (hierarchy ? "" : rows.map((row) => {
    const subAgency = row[0], program = row[1], amount = row[2];
    return '<div class="agency-row"><span><strong>' + escapeHtml(subAgency) + '</strong><small>' + escapeHtml(program) + '</small></span><b>' + detailAmount(row, detail.rowSchema) + '</b></div>' + itemBreakdown(detail, row) + supplementalBreakdown(detail, row);
  }).join("")) + (detail.supplementalRows || []).slice(0, limit).map((row) => '<a class="agency-row" href="' + escapeHtml(row[4]) + '" target="_blank" rel="noopener noreferrer"><span><strong>' + escapeHtml(row[0]) + '</strong><small>' + escapeHtml(row[1]) + ' · ' + escapeHtml(row[3]) + '</small></span><b>' + model.formatMoney(row[2]) + '</b></a>').join("");
}
function detailSourceLinks(detail) {
  const sources = [...(detail.sourceUrls || [["Official source", detail.sourceUrl]]), ...(detail.relatedSources || [])];
  return '<div class="source-catalog"><strong>Sources</strong><div>' + sources.map(([label, url]) =>
    '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>').join("") + '</div></div>' + largeAccountCatalog(detail);
}

function updateSecondary(data) {
  setText("#interestShare", data.salariesWages ? model.formatMoney(data.salariesWages) : "Not reported");
  setText("#transferShare", data.financialResult ? "Included as reported" : "See department files"); setText("#coverageShare", "Loading");
}
