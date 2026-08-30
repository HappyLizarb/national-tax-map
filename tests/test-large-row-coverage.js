const assert = require("node:assert/strict");
const fs = require("node:fs");

const index = require("../data/department-index.js");
const model = require("../src/model.js");
const threshold = 5_000_000_000;
const key = (row) => JSON.stringify(row.slice(0, 3));
const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
const counts = { large: 0, breakdowns: 0, ceilings: 0 };

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function auditSource(scope, source) {
  const detail = source.detailUrl ? readJson(source.detailUrl) : null;
  const expanded = model.expandReconciliationSource(source, detail);
  const panels = sections.flatMap((name) => expanded[name]);
  const covered = new Set(panels.flatMap((panel) =>
    [panel.parent, ...(panel.covers || [])]).filter(Boolean).map(key));

  for (const row of expanded.rows.filter((row) => Math.abs(row[2]) >= threshold)) {
    counts.large += 1;
    if (covered.has(key(row))) counts.breakdowns += 1;
    else {
      counts.ceilings += 1;
      assert.match(row[1], /ceiling/i, scope + " terminal base row");
    }
  }
  for (const panel of panels) for (const row of panel.rows) {
    if (Math.abs(row[2]) >= threshold)
      assert.match(row[1], /ceiling/i, scope + " terminal breakdown row");
  }
}

for (const [scope, summaryPath] of Object.entries(index)) {
  if (scope === "United States") continue;
  const census = require("../" + summaryPath);
  const archiveUrl = census.departments[0].relatedSources.find(([label, url]) =>
    label === "Prior state layer snapshot" && url.startsWith("data/"))[1];
  const reconciled = model.reconcileStateArchive(scope, readJson(archiveUrl), census);
  for (const bridge of reconciled.departments.slice(-2))
    for (const source of bridge.detailSources) auditSource(scope, source);
}

assert.deepEqual(counts, { large: 483, breakdowns: 117, ceilings: 366 });
console.log("All browser-visible $5 billion rows are exact breakdowns or labeled source ceilings.");
