const model = window.TaxModel;
const state = { layer: "federal", scope: "United States", features: [], request: 0, detailRequest: 0 };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const themePreference = matchMedia("(prefers-color-scheme: dark)");
const palette = ["#5e7f70", "#88a681", "#c1a55d", "#bf7256", "#7095a4", "#a2828c", "#b5926b"];
async function initialize() {
  bindControls(); updatePanel();
  try {
    const topology = await d3.json("vendor/us-atlas-3-states-10m.json");
    state.features = topojson.feature(topology, topology.objects.states).features
      .filter((feature) => Number(feature.id) < 60 && model.states[feature.properties.name]);
    drawMap();
  } catch {
    d3.select("#usMap").html('<text class="map-error" x="450" y="230" text-anchor="middle">Map unavailable</text>');
  }
}
function bindControls() {
  $("#themeToggle").addEventListener("click", toggleTheme);
  themePreference.addEventListener("change", followSystemTheme);
  setTheme(document.documentElement.dataset.theme);
  addEventListener("resize", () => state.features.length && drawMap());
}
function setScope(scope) {
  state.scope = scope === state.scope && scope !== "United States" ? "United States" : scope;
  state.layer = state.scope === "United States" ? "federal" : "stateGovernment";
  $(".detail-panel").scrollTop = 0;
  drawMap(); updatePanel();
}
function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
}
function followSystemTheme(event) {
  let saved;
  try { saved = localStorage.getItem("public-ledger-theme"); } catch {}
  if (!["light", "dark"].includes(saved)) setTheme(event.matches ? "dark" : "light");
}
function setTheme(theme, persist = false) {
  const value = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = value;
  if (persist) try { localStorage.setItem("public-ledger-theme", value); } catch {}
  $("#themeToggle").setAttribute("aria-pressed", value === "dark");
  $("#themeToggle").setAttribute("aria-label", "Switch to " + (value === "dark" ? "light" : "dark") + " theme");
  if (state.features.length) drawMap();
}
function drawMap() {
  if (!state.features.length) return;
  const svg = d3.select("#usMap");
  const previousTransform = svg.select(".map-layer").node()?.getAttribute("transform");
  // Center the contiguous states optically; Aleutian outliers otherwise pull the visible map right.
  const projection = d3.geoAlbersUsa().fitExtent([[18, 14], [882, 462]], { type: "FeatureCollection", features: state.features });
  const path = d3.geoPath(projection);
  const values = state.features.map((feature) => mapValue(feature.properties.name));
  const color = createColorScale(values);
  svg.selectAll("*").remove();
  const layer = svg.append("g").attr("class", "map-layer").attr("transform", previousTransform);
  layer.selectAll("path").data(state.features).join("path")
    .attr("class", (feature) => "state-shape" + (feature.properties.name === state.scope ? " selected" : ""))
    .attr("d", path).attr("fill", (feature) => color(mapValue(feature.properties.name)))
    .attr("aria-label", (feature) => feature.properties.name + ", net position (GAAP)")
    .on("pointerenter pointermove", showTooltip).on("pointerleave", () => $("#mapTooltip").hidden = true)
    .on("click", (_, feature) => setScope(feature.properties.name));
  const selected = state.features.find((feature) => feature.properties.name === state.scope);
  let targetTransform = "translate(0 0) scale(1)";
  if (selected) {
    const [[x0, y0], [x1, y1]] = path.bounds(selected);
    targetTransform = "translate(450 238) scale(1.75) translate(" + -(x0 + x1) / 2 + " " + -(y0 + y1) / 2 + ")";
  }
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : state.scope === "United States" ? 800 : 650;
  layer.transition().duration(duration)
    .ease(d3.easeCubicInOut).attr("transform", targetTransform);
  updateLegend(values);
}
function mapValue(name) { return model.mapMetric(name, "stateGovernment", "balance", "financial"); }
function createColorScale(values) {
  const styles = getComputedStyle(document.documentElement);
  const color = (name) => styles.getPropertyValue(name).trim();
  const sorted = values.filter(Number.isFinite).sort(d3.ascending);
  if (!sorted.length) return () => color("--map-neutral");
  const [minimum, maximum] = [d3.quantileSorted(sorted, .08), d3.quantileSorted(sorted, .92)];
  const limit = Math.max(Math.abs(minimum), Math.abs(maximum));
  return d3.scaleDiverging([-limit, 0, limit], d3.interpolateRgbBasis([
    color("--map-negative"), color("--map-neutral"), color("--map-positive")
  ])).clamp(true);
}
function showTooltip(event, feature) {
  const tooltip = $("#mapTooltip");
  const stateName = escapeHtml(feature.properties.name);
  tooltip.innerHTML = "<strong>" + stateName + "</strong><span>Net position (GAAP) · FY 2024</span><b>"
    + model.formatMoney(mapValue(feature.properties.name)) + "</b>";
  tooltip.hidden = false;
  const stage = $(".map-stage").getBoundingClientRect();
  tooltip.style.transform = "translate(" + Math.min(event.clientX - stage.left + 14, stage.width - 190) + "px," + Math.max(event.clientY - stage.top - 74, 12) + "px)";
}
function updateLegend(values) {
  if (!values.length) return;
  const [minimum, maximum] = d3.extent(values);
  setText("#legendLow", model.formatMoney(minimum)); setText("#legendHigh", model.formatMoney(maximum));
}

function sourceLink(url, comparisonUrl, comparisonLabel, relatedSources = []) {
  const links = [[url, "Open official source"], [comparisonUrl, comparisonLabel || "Open comparator"], ...relatedSources.map(([label, link]) => [link, label])]
    .filter(([link], index, all) => link && all.findIndex(([candidate]) => candidate === link) === index);
  return links.map(([link, label]) => '<a href="' + escapeHtml(link) + '" target="_blank" rel="noopener noreferrer">' + label + ' ↗</a>').join("");
}

// Show original-source dollars when the pie uses a normalized presentation amount.
function sourceBasisNote(department) {
  if (department.reconciliationTarget) return "<small>Signed bridge to "
    + escapeHtml(department.reconciliationTarget) + " total: " + model.formatMoney(department.targetTotal) + "</small>";
  if (Number.isFinite(department.grossOutlays)) {
    const parts = [["Treasury gross", department.grossOutlays], ["applicable receipts", department.applicableReceipts]]
      .filter(([, value]) => Number(value)).map(([label, value]) => label + ": " + model.formatMoney(value));
    return parts.length ? "<small>" + parts.join(" · ") + " · net shown</small>" : "";
  }
  if (department.sourceAmount == null) return "";
  const sourceCents = Math.round(Number(department.sourceAmount) * 100);
  const displayCents = Math.round(Number(department.amount) * 100);
  return sourceCents === displayCents ? "" : '<small>Source basis: ' + model.formatMoney(department.sourceAmount) + '</small>';
}

function detailAmount(row, schema = []) {
  const amount = model.formatMoney(row[2]);
  const sourceCents = Math.round(Number(row[3]) * 100);
  const amountCents = Math.round(Number(row[2]) * 100);
  const sourceNote = sourceCents === amountCents ? "" : '<small>source ' + model.formatMoney(row[3]) + '</small>';
  const obligationIndex = schema.indexOf("obligations");
  const grossIndex = schema.indexOf("grossOutlays");
  const receiptsIndex = schema.indexOf("applicableReceipts");
  const obligationNote = obligationIndex >= 0 && row[obligationIndex]
    ? '<small>obligations ' + model.formatMoney(row[obligationIndex]) + '</small>' : "";
  const netParts = [["gross", row[grossIndex]], ["receipts", row[receiptsIndex]]]
    .filter(([, value]) => grossIndex >= 0 && Number(value))
    .map(([label, value]) => label + " " + model.formatMoney(value));
  const netNote = netParts.length ? "<small>" + netParts.join(" · ") + "</small>" : "";
  return amount + sourceNote + obligationNote + netNote;
}

function largeAccountCatalog(detail, rendered) {
  const research = detail.accountResearch, rows = detail.largeAccountRows || [];
  if (!research) return "";
  const summary = rows.length + " of " + research.accountCount.toLocaleString()
    + " Treasury accounts are at least " + model.formatMoney(research.threshold);
  return '<details class="source-catalog"><summary><strong>Treasury account cross-checks</strong><small>'
    + escapeHtml(summary + " · the same spending regrouped; reference only, not a subtotal")
    + '</small></summary><div>' + rows.map((row) => '<small><b>' + model.formatMoney(row[2])
      + '</b> · TAS ' + escapeHtml(row[0]) + ' · ' + escapeHtml(model.displayAccountDescription(detail, row)) + ' · '
      + row[3].toLocaleString() + (row[3] === 1 ? ' availability row' : ' availability rows') + '</small>'
      + nestedSourceBreakdowns(detail, row, rendered)).join("")
    + '<a href="' + escapeHtml(research.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Open official Treasury account table ↗</a></div></details>';
}

function itemBreakdown(detail, parent, rendered) {
  const match = (detail.itemBreakdowns || []).find((item) => item.parent[0] === parent[0]
    && item.parent[1] === parent[1] && Math.round(item.parent[2] * 100) === Math.round(parent[2] * 100));
  if (!match) return "";
  if (match.rows.length === 1) {
    const row = match.rows[0];
    return '<a class="agency-row" href="' + escapeHtml(match.sourceUrl) + '" target="_blank" rel="noopener noreferrer"><span><strong>'
      + escapeHtml(model.displayAccountDescription(detail, row)) + '</strong><small>' + escapeHtml((match.rowPrefix || "TAS") + " " + row[0]
        + " · leaf account · " + (match.title || "Reconciled account"))
      + '</small></span><b>' + model.formatMoney(row[2]) + '</b></a>'
      + nestedSourceBreakdowns(detail, row, rendered);
  }
  return '<details class="item-breakdown"><summary>' + escapeHtml(match.title || "Show reconciled account breakdown") + ' · '
    + match.accountCount.toLocaleString() + ' accounts</summary><small class="item-breakdown-note">'
    + escapeHtml(match.basis || detail.itemBreakdownBasis) + '</small>' + match.rows.map((row) =>
      '<div class="agency-row"><span><strong>' + escapeHtml(model.displayAccountDescription(detail, row)) + '</strong><small>'
      + escapeHtml((match.rowPrefix || "TAS") + " " + row[0]) + '</small></span><b>' + model.formatMoney(row[2])
      + '</b></div>' + nestedSourceBreakdowns(detail, row, rendered)).join("")
    + '<a href="' + escapeHtml(match.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Open '
    + escapeHtml(match.sourceLabel || "official Treasury account table") + ' ↗</a></details>';
}

function supplementalBreakdown(detail, parent, rendered) {
  const matches = (detail.supplementalBreakdowns || []).filter((item) => item.parent[0] === parent[0]
    && item.parent[1] === parent[1] && Math.round(item.parent[2] * 100) === Math.round(parent[2] * 100)
    && !(item.covers || []).some((row) => exactSourceBreakdown(item, row)));
  return renderSourceBreakdowns(matches, detail, rendered);
}

function sameAccount(left, right) {
  const label = (row) => String(row[1]).replace(/ · [^·]*ceiling(?: ·.*)?$/i, "");
  return left[0] === right[0] && label(left) === label(right)
    && Math.round(left[2] * 100) === Math.round(right[2] * 100);
}

// Place each source panel once beneath its explicit display parent.
function sourceBreakdownParent(item) {
  return item.displayParent || item.covers?.[0];
}

function sourceBreakdownMatches(item, parent) {
  return sameAccount(sourceBreakdownParent(item), parent);
}

function exactSourceBreakdown(item, parent) {
  const rows = item.rows.reduce((sum, row) => sum + Math.round(row[2] * 100), 0);
  const covers = (item.covers || []).reduce((sum, row) => sum + Math.round(row[2] * 100), 0);
  return rows === covers && (item.covers || []).some((row) => sameAccount(row, parent));
}

function renderSourceBreakdowns(items, detail, rendered) {
  return items.filter((item) => !rendered.has(item)).map((item) => {
    rendered.add(item);
    return renderSourceBreakdown(item, detail, rendered);
  }).join("");
}

function nestedSourceBreakdowns(detail, parent, rendered) {
  const matches = [...(detail.sourceBreakdowns || []).filter((item) =>
    sourceBreakdownMatches(item, parent)),
  ...(detail.supplementalBreakdowns || []).filter((item) => exactSourceBreakdown(item, parent))];
  return renderSourceBreakdowns(matches, detail, rendered);
}

function rowHasExactBreakdown(detail, parent) {
  return (detail.itemBreakdowns || []).some((item) => sameAccount(item.parent, parent))
    || (detail.sourceBreakdowns || []).some((item) => sourceBreakdownMatches(item, parent))
    || (detail.supplementalBreakdowns || []).some((item) => sameAccount(item.parent, parent)
      || exactSourceBreakdown(item, parent));
}

function renderSourceBreakdown(match, detail, rendered) {
  const count = /\brows$/.test(match.title) ? "" : ' · ' + match.rows.length.toLocaleString() + ' rows';
  if (match.rows.length === 1) {
    const row = match.rows[0];
    return '<a class="agency-row" href="' + escapeHtml(row[3] || match.sourceUrl)
      + '" target="_blank" rel="noopener noreferrer"><span><strong>' + escapeHtml(row[0])
      + '</strong><small>' + escapeHtml(model.displayAccountDescription(detail, row) + " · leaf account · " + match.title)
      + '</small></span><b>' + model.formatMoney(row[2]) + '</b></a>'
      + nestedSourceBreakdowns(detail, row, rendered);
  }
  return '<details class="item-breakdown"><summary>' + escapeHtml(match.title)
    + count + '</summary><small class="item-breakdown-note">'
    + escapeHtml(match.basis) + '</small>' + match.rows.map((row) => {
      const content = '<span><strong>' + escapeHtml(row[0]) + '</strong><small>' + escapeHtml(model.displayAccountDescription(detail, row))
        + '</small></span><b>' + model.formatMoney(row[2]) + '</b>';
      const rowHtml = row[3] ? '<a class="agency-row" href="' + escapeHtml(row[3])
        + '" target="_blank" rel="noopener noreferrer">' + content + '</a>' : '<div class="agency-row">' + content + '</div>';
      return rowHtml + nestedSourceBreakdowns(detail, row, rendered);
    }).join("") + '<a href="' + escapeHtml(match.sourceUrl) + '" target="_blank" rel="noopener noreferrer">Open '
    + escapeHtml(match.sourceLabel) + ' ↗</a></details>';
}

function shareLabel(department) {
  return department.reconciliationTarget ? (department.amount > 0 ? "+" : "")
    + model.formatMoney(department.amount) + " adjustment"
    : department.amount < 0 ? "accounting adjustment" : formatShare(department.share);
}

function formatShare(value) { return value > 0 && value < 0.1 ? "<0.1%" : value.toFixed(1) + "%"; }

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
}

function setText(selector, value) { $(selector).textContent = value; }
initialize();
