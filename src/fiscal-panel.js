function updatePanel() {
  const canonical = model.scopeData(state.scope, state.layer === "federal" ? "itemized" : "financial");
  const allocation = model.scopeData(state.scope, state.layer === "federal" ? "itemized" : "archive");
  const financial = canonical.financialResult;
  const status = canonical.kind === "federal" ? "Source-backed"
    : financial ? (hasAuditCaveat(financial) ? "Official GAAP · audit caveat" : "Audited GAAP")
      : canonical.comparable ? "Census comparison" : "Separate source basis";
  setText("#scopeTitle", canonical.name);
  setText("#scopeContext", canonical.kind === "federal" ? "Federal outlays" : status);
  updateSources(canonical); updateNetPosition(canonical); updateTaxRates(canonical.name);
  updateComparison(canonical); updateAllocation(allocation);
  setText("#dataBasis", canonical.basis);
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
function updateNetPosition(data) {
  const financial = data.financialResult;
  setText("#netPositionValue", financial ? model.formatMoney(financial.netPosition) : "");
  $("#netPositionSummary").hidden = !financial;
}
function updateTaxRates(name) {
  const tax = model.taxOverviewFor(name);
  const costsOpen = $(".consumer-costs")?.open;
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
  $("#taxEstimateSection").hidden = !tax.household || !tax.individual;
  $("#householdTaxRows").innerHTML = renderTaxEstimates(tax, escapeHtml);
  $("#everydayCostsRows").innerHTML = renderEverydayCosts(tax.costs, escapeHtml);
  if (costsOpen) $(".consumer-costs").open = true;
  $("#taxRateRows").innerHTML = tax.rows.map((row) => '<article class="tax-rate-card"><span>' + row.label + '</span><strong>' + row.value + '</strong><small>' + row.note + '</small><a href="' + row.url + '" target="_blank" rel="noopener noreferrer">' + row.source + ' ↗</a></article>').join("");
}
function updateComparison(data) {
  const financial = data.financialResult;
  const auditNote = financial && hasAuditCaveat(financial) ? financial.auditNote : "";
  setText("#gapTitle a", financial ? "Resources & expenses" : "Revenue–spending gap");
  setText("#revenueBarLabel", "GAAP Resources");
  setText("#spendingBarLabel", "GAAP Spending");
  $("#auditCaveatMark").hidden = !auditNote; $("#auditCaveat").hidden = !auditNote;
  setText("#auditCaveatText", auditNote);
  if (!data.comparable) {
    $("#revenueBar").style.width = "0%"; $("#spendingBar").style.width = "100%";
    setText("#revenueBarValue", "Not comparable"); setText("#spendingBarValue", model.formatMoney(data.spending));
    setText("#gapPercentText", "Select comparable function ledger for a revenue comparison");
    return;
  }
  const maximum = Math.max(data.revenue, data.spending);
  $("#revenueBar").style.width = data.revenue / maximum * 100 + "%"; $("#spendingBar").style.width = data.spending / maximum * 100 + "%";
  setText("#revenueBarValue", model.formatMoney(data.revenue)); setText("#spendingBarValue", model.formatMoney(data.spending));
  setText("#gapPercentText", financial ? model.formatMoney(financial.changeInNetPosition) + " change in net position"
    : data.balance == null ? "No official same-basis result reported" : model.formatMoney(data.balance) + " officially reported");
}
async function updateAllocation(data) {
  const request = ++state.request;
  state.detailRequest++;
  setText("#allocationTotal", "Loading departments…");
  $("#categoryList").innerHTML = ""; $("#breakdownDetails").textContent = "Choose a department after it loads.";
  setText("#sourceExplorerTitle", "Agency source explorer");
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
  if (scope === "United States") return primary;
  const archiveUrl = primary.departments.flatMap((row) => row.relatedSources || [])
    .find(([label, url]) => label === "Prior state layer snapshot" && url.startsWith("data/"))?.[1];
  if (!archiveUrl) throw new Error("No official archive for " + scope);
  return model.reconcileStateArchive(scope, await DepartmentData.loadDetail(archiveUrl), primary);
}
function renderAllocation(summary, scopeData) {
  const positiveTotal = summary.departments.reduce((sum, row) => sum + Math.max(row.amount, 0), 0);
  const sourceTotal = summary.itemizedTotal ?? summary.departments.reduce((sum, row) => sum + row.amount, 0);
  const departments = summary.departments.map((row) => ({
    ...row,
    chartAmount: Math.max(row.amount, 0),
    share: positiveTotal ? Math.max(row.amount, 0) / positiveTotal * 100 : 0,
    comparisonUrl: summary.comparison?.url,
    comparisonLabel: summary.comparison?.label
  // Keep source rows ranked, then show the Census-to-GAAP bridge in sequence.
  })).sort((a, b) => {
    const aOrder = a.reconciliationTarget === "Census" ? 1 : a.reconciliationTarget === "GAAP" ? 2 : 0;
    const bOrder = b.reconciliationTarget === "Census" ? 1 : b.reconciliationTarget === "GAAP" ? 2 : 0;
    return aOrder - bOrder || (aOrder ? 0 : b.chartAmount - a.chartAmount || Math.abs(b.amount) - Math.abs(a.amount));
  }).map((row, index) => ({ ...row, chartColor: row.reconciliationTarget
    ? row.amount < 0 ? palette[3] : palette[0] : palette[index % palette.length] }));
  setText("#allocationTotal", allocationLabel(summary, sourceTotal, scopeData));
  $("#categoryList").innerHTML = departments.map((row, index) => '<button class="category-row" type="button" data-category="' + index + '"><span><i style="background:' + row.chartColor + '"></i>' + escapeHtml(row.name) + '</span><b>' + shareLabel(row) + '</b></button>').join("");
  $("#categoryList").querySelectorAll('[data-category]').forEach((button) =>
    button.addEventListener("click", () => showBreakdown(departments[Number(button.dataset.category)])));
  const reconciled = summary.coverageStatus === "gaap-reconciled-official-archive";
  drawDonut(departments, reconciled ? "GAAP" : "100%", reconciled ? "signed reconciliation" : "itemized allocations");
  setText("#sourceExplorerNote", summary.note || "Itemized rows load only after a department is selected.");
  if (scopeData.kind === "federal") $("#agencyRows").innerHTML = federalSourceCatalog();
  $("#allocationTitle a").href = summary.departments[0]?.sourceUrl || summary.sourceUrl;
}
function allocationLabel(summary, total, scopeData) {
  if (summary.coverageStatus === "gaap-reconciled-official-archive") return model.formatMoney(total) + " GAAP-reconciled total";
  if (scopeData.kind === "federal") return model.formatMoney(total) + " net agency/program outlays";
  const label = summary.coverageStatus === "official-itemized-source-basis"
    ? "official itemized allocations" : "function allocations";
  return model.formatMoney(total) + " " + label;
}
function federalSourceCatalog() {
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
  const svg = host.append("svg").attr("viewBox", "-4 -4 124 124").attr("role", "img");
  const arc = d3.arc().innerRadius(34).outerRadius(54);
  const chartDepartments = departments.filter((row) => row.chartAmount > 0);
  svg.selectAll("path").data(d3.pie().sort(null).value((row) => row.chartAmount)(chartDepartments)).join("path")
    .attr("class", "donut-segment").attr("d", arc).attr("transform", "translate(58 58)")
    .attr("fill", (part) => part.data.chartColor).attr("tabindex", 0).attr("role", "button")
    .attr("aria-label", (part) => part.data.name + ", " + shareLabel(part.data))
    .on("click", (_, part) => showBreakdown(part.data))
    .on("keydown", (event, part) => event.key === "Enter" && showBreakdown(part.data));
  const controls = departments.filter((row) => row.reconciliationTarget);
  const rings = svg.selectAll("circle.reconciliation-ring").data(controls).join("circle")
    .attr("class", "reconciliation-ring").attr("cx", 58).attr("cy", 58)
    .attr("r", (_, index) => 56 + index * 3).attr("fill", "none")
    .attr("stroke", (row) => row.chartColor).attr("stroke-width", 2)
    .attr("stroke-dasharray", (row) => row.amount < 0 ? "2 2" : null)
    .attr("role", "img").attr("aria-label", (row) => row.name + ", " + shareLabel(row));
  rings.append("title").text((row) => row.name + ": " + shareLabel(row));
  const note = coverageLabel === "GAAP" ? "signed bridge controls ringed"
    : departments.some((row) => row.amount < 0) ? "positive itemized allocations" : coverageNote;
  host.append("div").attr("class", "donut-center").html('<strong>' + coverageLabel + '</strong><span>' + note + '</span>');
}

async function showBreakdown(department) {
  const request = ++state.detailRequest;
  const details = $("#breakdownDetails");
  const detailLabel = department.reconciliationTarget ? "signed bridge" : shareLabel(department);
  setText("#sourceExplorerTitle", department.reconciliationTarget ? "Reconciliation account schedule" : "Agency source explorer");
  details.innerHTML = '<strong>' + escapeHtml(department.name) + '</strong><span>' + model.formatMoney(department.amount) + ' · ' + detailLabel + '</span>' + sourceBasisNote(department) + sourceLink(department.sourceUrl, department.comparisonUrl, department.comparisonLabel, department.relatedSources);
  if (department.detailSources) {
    await loadReconciliationDetail(department, request);
    return;
  }
  if (department.detailUrl) {
    await loadDepartmentDetail(department, request);
    return;
  }
  const inlineDetail = department.detailRows ? {
    department: department.name, rows: department.detailRows, sourceUrl: department.sourceUrl,
    sourceUrls: [["Target control", department.sourceUrl], ...(department.relatedSources || [])],
    note: "Signed control rows total " + model.formatMoney(department.amount)
      + " exactly; the schedule compares published accounts without assigning causes across unlike classifications."
  } : department.program ? { department: department.name,
    rows: [[department.name, department.program, department.amount, department.sourceAmount, department.sourceRows]],
    sourceUrl: department.sourceUrl, note: department.note } : null;
  if (inlineDetail) { renderDetail(inlineDetail); return; }
  setText("#sourceExplorerNote", department.note || "No additional itemized rows are available for this source group.");
  $("#agencyRows").innerHTML = "";
}

// Load every leaf row from both published sides of a reconciliation bridge.
async function loadReconciliationDetail(department, request) {
  setText("#sourceExplorerNote", "Loading source-native accounts for " + department.name + "…");
  try {
    const groups = await Promise.all(department.detailSources.map(async (source) => {
      const [detail, research] = await Promise.all([
        source.detailUrl ? DepartmentData.loadDetail(source.detailUrl) : null,
        source.researchDetailUrl ? DepartmentData.loadDetail(source.researchDetailUrl) : null
      ]);
      return model.expandReconciliationSource(source, research ? { ...detail,
        sourceBreakdowns: [...(detail.sourceBreakdowns || []), ...(research.sourceBreakdowns || [])],
        supplementalBreakdowns: [...(detail.supplementalBreakdowns || []),
          ...(research.supplementalBreakdowns || [])] } : detail);
    }));
    if (request !== state.detailRequest) return;
    const expanded = groups.reduce((all, group) => {
      for (const key of ["rows", "itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"])
        all[key].push(...group[key]);
      return all;
    }, { rows: [], itemBreakdowns: [], supplementalBreakdowns: [], sourceBreakdowns: [] });
    renderDetail({ ...expanded, department: department.name, showAll: true, sourceUrl: department.sourceUrl,
      sourceUrls: [["Target control", department.sourceUrl], ...(department.relatedSources || [])],
      note: "Signed source-native rows total " + model.formatMoney(department.amount)
        + " exactly; unlike classifications are not presented as causal account matches." });
  } catch (error) {
    if (request === state.detailRequest) setText("#sourceExplorerNote", error.message);
  }
}

// Load an ordinary department report and merge its optional research panels.
async function loadDepartmentDetail(department, request) {
  setText("#sourceExplorerNote", "Loading itemized rows for " + department.name + "…");
  try {
    const researchUrl = department.id === "census-direct-general"
      ? department.detailUrl.replace(/census-state-[a-z]{2}-fy2024-direct-general\.json$/, "ipeds-public-university-fy2024.json")
      : department.researchDetailUrl;
    const [detail, research] = await Promise.all([
      DepartmentData.loadDetail(department.detailUrl),
      researchUrl ? DepartmentData.loadDetail(researchUrl) : null
    ]);
    if (request !== state.detailRequest) return;
    renderDetail(research ? { ...detail,
      budgetCoverageLabel: research.budgetCoverageLabel,
      budgetSources: research.budgetSources,
      sourceBreakdowns: [...(detail.sourceBreakdowns || []), ...(research.sourceBreakdowns || [])],
      supplementalBreakdowns: [...(detail.supplementalBreakdowns || []),
        ...(research.supplementalBreakdowns || [])] } : detail);
  } catch (error) {
    if (request === state.detailRequest) setText("#sourceExplorerNote", error.message);
  }
}
function renderDetail(detail) {
  detail = model.withThresholdBreakdowns(detail);
  const limit = detail.showAll ? detail.rows.length : 500, rows = detail.rows.slice(0, limit);
  const hierarchy = renderReceiptHierarchy(detail, model.formatMoney, escapeHtml);
  const supplementalCount = (detail.supplementalRows || []).length;
  const flatSingleton = !hierarchy && rows.length === 1 && !rowHasExactBreakdown(detail, rows[0])
    && !supplementalCount;
  const note = detail.note ? " · " + detail.note : "";
  const rowCount = hierarchy ? detail.sourceFloor.accountCount + " Treasury receipt accounts · 1 MTS rounding bridge"
    : flatSingleton ? "leaf account · redundant one-row wrapper removed"
      : detail.rows.length.toLocaleString() + " itemized rows"
        + (supplementalCount ? " · " + supplementalCount.toLocaleString() + " separate topic rows" : "");
  setText("#sourceExplorerNote", detail.department + " · " + rowCount + (detail.rows.length > limit ? " · first 500 shown" : "") + note);
  const rendered = new Set(), rowHtml = hierarchy || flatSingleton ? "" : rows.map((row) => {
    const subAgency = row[0], program = model.displayAccountDescription(detail, row), amount = row[2];
    return '<div class="agency-row"><span><strong>' + escapeHtml(subAgency) + '</strong><small>' + escapeHtml(program) + '</small></span><b>' + detailAmount(row, detail.rowSchema) + '</b></div>' + itemBreakdown(detail, row, rendered) + supplementalBreakdown(detail, row, rendered) + nestedSourceBreakdowns(detail, row, rendered);
  }).join("");
  $("#agencyRows").innerHTML = detailSourceLinks(detail, rendered) + hierarchy + rowHtml
    + (detail.supplementalRows || []).slice(0, limit).map((row) => '<a class="agency-row" href="' + escapeHtml(row[4]) + '" target="_blank" rel="noopener noreferrer"><span><strong>' + escapeHtml(row[0]) + '</strong><small>' + escapeHtml(model.displayAccountDescription(detail, row)) + ' · ' + escapeHtml(row[3]) + '</small></span><b>' + model.formatMoney(row[2]) + '</b></a>'
      + nestedSourceBreakdowns(detail, row, rendered)).join("");
}
function detailSourceLinks(detail, rendered) {
  const sources = [...(detail.sourceUrls || [["Official source", detail.sourceUrl]]), ...(detail.relatedSources || [])];
  return '<div class="source-catalog"><strong>Sources</strong><div>' + sources.map(([label, url]) =>
    '<a href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(label) + ' ↗</a>').join("")
    + '</div></div>' + budgetSourceCatalog(detail) + largeAccountCatalog(detail, rendered);
}
// Distinguish adopted operating plans from legal appropriation ceilings.
function budgetSourceCatalog(detail) {
  if (!detail.budgetSources?.length) return "";
  return '<div class="source-catalog"><strong>Official FY2024 budget coverage · ' + escapeHtml(detail.budgetCoverageLabel)
    + '</strong><div>' + detail.budgetSources.map((source) => '<a href="' + escapeHtml(source.sourceUrl)
      + '" target="_blank" rel="noopener noreferrer"><b>' + escapeHtml(source.scope) + ' ↗</b><small>'
      + escapeHtml(source.status + ' · ' + source.fiscalPeriod + ' · ' + source.budgetScope
        + ' Publication ceiling: ' + source.publicationCeiling) + '</small></a>').join("") + '</div></div>';
}
