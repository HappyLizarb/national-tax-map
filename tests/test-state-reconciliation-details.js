const assert = require("node:assert/strict");
const fs = require("node:fs");
const model = require("../src/model.js");
const index = require("../data/department-index.js");
const detailCache = new Map();

// Convert dollars to integer cents for exact reconciliation assertions.
const cents = (value) => Math.round(Number(value) * 100);

const californiaCensus = JSON.parse(fs.readFileSync(
  "data/state-ca/census-state-ca-fy2024-direct-general.json", "utf8"));
const californiaSigned = model.expandReconciliationSource({
  label: "Census · Direct general expenditure", direction: -1
}, californiaCensus);
const californiaPanel = californiaSigned.itemBreakdowns[0];
assert.deepEqual(californiaPanel.parent.slice(0, 3), [
  "Census · Direct general expenditure › Direct general expenditure · Census function",
  californiaCensus.itemBreakdowns[0].parent[1], -californiaCensus.itemBreakdowns[0].parent[2]
]);
assert.deepEqual(californiaPanel.rows.map((row) => row[2]),
  californiaCensus.itemBreakdowns[0].rows.map((row) => -row[2]));
assert.deepEqual(californiaPanel.rows.map((row) => row[3]),
  californiaCensus.itemBreakdowns[0].rows.map((row) => -(row[3] ?? row[2])));

const alaskaGaap = JSON.parse(fs.readFileSync(
  "data/state-ak/archive-state-source/state-ak-acfr-function-context.json", "utf8"));
const alaskaSigned = model.expandReconciliationSource({ label: "GAAP", direction: 1 }, alaskaGaap);
assert.equal(alaskaSigned.rows.reduce((sum, row) => sum + row[2], 0), alaskaGaap.sourceTotal);
const arizonaGaap = JSON.parse(fs.readFileSync(
  "data/state-az/archive-state-source/state-az-acfr-function-context.json", "utf8"));
const arizonaSigned = model.expandReconciliationSource({ label: "GAAP", direction: 1 }, arizonaGaap);
assert.ok(arizonaSigned.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => row[1].endsWith("official publication ceiling")));

// Reconstruct browser-visible rows, including its zero-row filter.
function expandedRows(source) {
  if (!source.detailUrl) return [source.fallbackRow];
  if (!detailCache.has(source.detailUrl))
    detailCache.set(source.detailUrl, JSON.parse(fs.readFileSync(source.detailUrl, "utf8")));
  return model.expandReconciliationSource(source, detailCache.get(source.detailUrl)).rows
    .filter((row) => Number(row[2]) !== 0)
}

for (const [scope, summaryPath] of Object.entries(index)) {
  if (scope === "United States") continue;
  const census = require("../" + summaryPath);
  const archiveUrl = census.departments[0].relatedSources.find(([label, url]) =>
    label === "Prior state layer snapshot" && url.startsWith("data/"))[1];
  const archive = JSON.parse(fs.readFileSync(archiveUrl, "utf8"));
  const reconciled = model.reconcileStateArchive(scope, archive, census);
  const [censusBridge, gaapBridge] = reconciled.departments.slice(-2);

  const censusRows = censusBridge.detailSources.flatMap((source) =>
    source.label.startsWith("Official archive · ") ? [source.fallbackRow] : expandedRows(source));
  const gaapRows = gaapBridge.detailSources.flatMap(expandedRows);
  assert.equal(censusBridge.detailSources.length, census.departments.length + archive.departments.length, scope);
  assert.equal(gaapBridge.detailSources.length, census.departments.length + 1, scope);
  assert.ok(censusRows.length >= censusBridge.detailSources.length, scope + " expands source accounts");
  assert.equal(censusRows.reduce((sum, row) => sum + cents(row[2]), 0), cents(censusBridge.amount), scope);
  assert.equal(gaapRows.reduce((sum, row) => sum + cents(row[2]), 0), cents(gaapBridge.amount), scope);
  assert.ok(censusRows.some((row) => row[0].startsWith("Census · ")), scope);
  assert.ok(censusRows.some((row) => row[0].startsWith("Official archive · ")), scope);
  assert.ok(gaapRows.some((row) => row[0].startsWith("GAAP · ")), scope);
  assert.ok([...censusRows, ...gaapRows]
    .every((row) => cents(row[2]) === cents(row[3])), scope + " source-preserving rows");
}

console.log("State Census and GAAP control-account schedules reconcile for all 50 states.");
