const assert = require("node:assert/strict");
const fs = require("node:fs");

const jurisdictions = require("../data/jurisdictions.js");
const threshold = 1_000_000_000;
const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
const education = /educat|school|univers|college|student|instruction|academic|pell/i;
const healthcare = /health|hospital|medicaid|medicare|medical|welfare|human services|public assistance|nutrition|\bmental\b|pharma|prescription drug|\bnurs/i;
const rejectedCeiling = /current imported-detail ceiling|source aggregation ceiling|deeper official split not imported/i;
const explicitCeiling = /(?:official|public|published|source-native|privacy-preserving|period-of-availability)[^·]*ceiling/i;
const cents = (value) => Math.round(value * 100);
const cleanLabel = (value) => String(value).replace(/ · [^·]*ceiling(?: ·.*)?$/i, "");
const key = (row) => JSON.stringify([row[0], cleanLabel(row[1]), cents(row[2])]);
const stats = { files: 0, largeRows: 0, exactBreakdowns: 0, supportedCeilings: 0,
  unsupportedEducation: 0, unsupportedHealthcare: 0 };
const unsupported = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function localJsonUrls(value) {
  if (typeof value === "string") return /^data\/.+\.json$/.test(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(localJsonUrls);
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(localJsonUrls);
}

// Follow only JSON reports reachable from the browser's primary or related-source views.
function activeFiles() {
  const queue = [], seen = new Set();
  const federal = require("../data/federal/federal.js");
  queue.push(...federal.departments.map((row) => row.detailUrl));
  for (const state of Object.values(jurisdictions.states)) {
    const summary = require("../" + state.summaryPath);
    queue.push(...localJsonUrls(summary), state.financial.expenseDetailUrl);
    const direct = summary.departments.find((row) => row.id === "census-direct-general");
    queue.push(direct.detailUrl.replace(/census-state-[a-z]{2}-fy2024-direct-general\.json$/,
      "ipeds-public-university-fy2024.json"));
  }
  while (queue.length) {
    const file = queue.shift();
    if (!file || seen.has(file) || !fs.existsSync(file)
      || /data\/federal\/archive-(?:agency|function)-source\//.test(file)) continue;
    seen.add(file);
    queue.push(...localJsonUrls(readJson(file)));
  }
  return [...seen];
}

function exactPanelFor(panels, row) {
  return panels.find((panel) => {
    const covered = panel.covers?.length === 1 ? panel.covers[0] : null;
    const parents = [panel.displayParent, panel.parent, covered].filter(Boolean);
    const total = (panel.rows || []).reduce((sum, child) => sum + cents(child[2]), 0);
    return parents.some((parent) => key(parent) === key(row)) && total === cents(row[2]);
  });
}

function linkedBreakdown(row) {
  if (!row.detailUrl || !fs.existsSync(row.detailUrl)) return false;
  const detail = readJson(row.detailUrl);
  const total = (detail.rows || []).reduce((sum, child) => sum + cents(child[2]), 0);
  return total === cents(row.amount) && (detail.rows || []).length > 1;
}

function hasCeiling(detail, panel, row, metadata) {
  const evidence = [metadata?.publicationCeiling, panel?.publicationCeiling,
    detail.publicationCeiling, row[1]].filter(Boolean).join(" ");
  if (rejectedCeiling.test(evidence)) return false;
  return metadata?.sourceRows === 1 || row[4] === 1
    || Boolean(metadata?.publicationCeiling || panel?.publicationCeiling || detail.publicationCeiling)
    || explicitCeiling.test(row[1]);
}

function auditRow(detail, panels, row, file, panel = null, metadata = null) {
  if (!Number.isFinite(row?.[2]) || Math.abs(row[2]) < threshold) return;
  stats.largeRows += 1;
  if (exactPanelFor(panels, row) || metadata && linkedBreakdown(metadata)) {
    stats.exactBreakdowns += 1;
    return;
  }
  if (hasCeiling(detail, panel, row, metadata)) {
    stats.supportedCeilings += 1;
    return;
  }
  const panelTitle = /agency and health activity/i.test(panel?.title || "") ? "" : panel?.title;
  const context = [file, detail.scope, detail.department, detail.agency, panelTitle,
    panel?.basis, row[0], row[1]].filter(Boolean).join(" ");
  const isEducation = education.test(context), isHealthcare = healthcare.test(context);
  if (isEducation) stats.unsupportedEducation += 1;
  if (isHealthcare) stats.unsupportedHealthcare += 1;
  if ((isEducation || isHealthcare) && unsupported.length < 400)
    unsupported.push({ file, panel: panel?.title, account: row[0], description: row[1], amount: row[2] });
}

function auditDetail(detail, file) {
  const panels = sections.flatMap((name) => detail[name] || []);
  assert.ok(panels.every((panel) => !panel.thresholdSubdivision
    && !/mechanical threshold slice/i.test(panel.basis || "")), file);
  for (const row of [...(detail.rows || []), ...(detail.supplementalRows || []),
    ...(detail.largeAccountRows || [])]) auditRow(detail, panels, row, file);
  for (const panel of panels)
    for (const row of panel.rows || []) auditRow(detail, panels, row, file, panel);
  for (const row of detail.departments || []) if (!Array.isArray(row))
    auditRow(detail, panels, [row.name, row.program, row.amount, row.sourceAmount, row.sourceRows],
      file, null, row);
}

for (const file of activeFiles()) {
  const detail = readJson(file);
  if (!detail.rows && !detail.departments) continue;
  stats.files += 1;
  auditDetail(detail, file);
}

assert.equal(fs.existsSync("src/threshold-breakdowns.js"), false);
assert.ok(stats.files > 3_000 && stats.largeRows > 3_000, JSON.stringify(stats));
assert.ok(stats.exactBreakdowns > 700 && stats.supportedCeilings > 1_000, JSON.stringify(stats));
const groups = Object.entries(unsupported.reduce((all, row) => {
  const name = [row.file, row.panel].filter(Boolean).join(" :: ");
  all[name] = (all[name] || 0) + 1;
  return all;
}, {})).sort((left, right) => right[1] - left[1]);
console.log("Strict active-report threshold audit:", stats, { unsupportedGroups: groups });
assert.equal(stats.unsupportedEducation, 0, "Unsupported education accounts: "
  + JSON.stringify(unsupported.filter((row) => education.test(JSON.stringify(row))).slice(0, 30)));
assert.equal(stats.unsupportedHealthcare, 0, "Unsupported healthcare accounts: "
  + JSON.stringify(unsupported.filter((row) => healthcare.test(JSON.stringify(row))).slice(0, 30)));
