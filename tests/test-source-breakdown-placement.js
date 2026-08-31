const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const model = require("../src/model.js");

function* jsonFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* jsonFiles(file);
    else if (entry.name.endsWith(".json")) yield file;
  }
}

const cents = (value) => Math.round(Number(value) * 100);
const rowKey = (row) => JSON.stringify([row[0], row[1], cents(row[2])]);
const sameRow = (left, right) => rowKey(left) === rowKey(right);
const exactCovers = (panel) => (panel.covers || []).length
  && panel.rows.reduce((sum, row) => sum + cents(row[2]), 0)
    === panel.covers.reduce((sum, row) => sum + cents(row[2]), 0);
const exactMatch = (panel, parent) => exactCovers(panel)
  && panel.covers.some((row) => sameRow(row, parent));

// Mirror the renderer's depth-first placement order and one-use guard.
function placementCounts(detail) {
  const sources = detail.sourceBreakdowns || [], supplements = detail.supplementalBreakdowns || [];
  const counts = new Map(sources.map((panel) => [panel, 0])), rendered = new Set();
  const renderPanels = (panels) => panels.filter((panel) => !rendered.has(panel)).forEach((panel) => {
    rendered.add(panel);
    if (counts.has(panel)) counts.set(panel, counts.get(panel) + 1);
    panel.rows.forEach(nested);
  });
  function nested(parent) {
    renderPanels([...sources.filter((panel) => sameRow(panel.displayParent || panel.covers?.[0], parent)),
      ...supplements.filter((panel) => exactMatch(panel, parent))]);
  }
  function visit(row) {
    const item = (detail.itemBreakdowns || []).find((panel) => sameRow(panel.parent, row));
    if (item) item.rows.forEach(nested);
    renderPanels(supplements.filter((panel) => sameRow(panel.parent, row) && !exactCovers(panel)));
    nested(row);
  }
  const rows = (detail.rows || []).slice(0, detail.showAll ? undefined : 500);
  const hasBreakdown = rows.length === 1 && ((detail.itemBreakdowns || []).some((panel) => sameRow(panel.parent, rows[0]))
    || sources.some((panel) => sameRow(panel.displayParent || panel.covers?.[0], rows[0]))
    || supplements.some((panel) => sameRow(panel.parent, rows[0]) || exactMatch(panel, rows[0])));
  if (!(detail.accountingClasses || []).length && (rows.length !== 1 || hasBreakdown
    || (detail.supplementalRows || []).length)) rows.forEach(visit);
  if (detail.accountResearch) (detail.largeAccountRows || []).forEach(nested);
  return counts;
}

let panelCount = 0, renderedPanelCount = 0;
const files = [...jsonFiles("data")];
const researchBases = new Map();
for (const file of files) {
  const detail = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const department of detail.departments || []) if (department.researchDetailUrl)
    researchBases.set(path.normalize(department.researchDetailUrl), department.detailUrl);
}

for (const file of files) {
  const research = JSON.parse(fs.readFileSync(file, "utf8"));
  const baseUrl = researchBases.get(path.normalize(file));
  const base = baseUrl ? JSON.parse(fs.readFileSync(baseUrl, "utf8")) : null;
  let detail = base ? { ...base,
    sourceBreakdowns: [...(base.sourceBreakdowns || []), ...(research.sourceBreakdowns || [])],
    supplementalBreakdowns: [...(base.supplementalBreakdowns || []),
      ...(research.supplementalBreakdowns || [])] } : research;
  if (!detail.rows && detail.departments) detail = { ...detail, rows: detail.departments.map((row) =>
    [row.name, row.program, row.amount, row.sourceAmount, row.sourceRows]) };
  const panels = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"]
    .flatMap((name) => detail[name] || []);
  const rows = new Set([
    ...(detail.rows || []),
    ...(detail.largeAccountRows || []),
    ...panels.flatMap((panel) => panel.rows || [])
  ].filter(Boolean).map(rowKey));

  for (const panel of detail.sourceBreakdowns || []) {
    panelCount += 1;
    const parent = panel.displayParent || panel.covers?.[0];
    assert.ok(parent, file + " · " + panel.title + " · missing display parent");
    assert.ok(rows.has(rowKey(parent)), file + " · " + panel.title + " · unknown display parent");
  }

  for (const [panel, count] of placementCounts(detail)) {
    assert.equal(count, 1, file + " · " + panel.title + " · expected one rendered placement");
    renderedPanelCount += count;
  }
}

const app = fs.readFileSync("src/app.js", "utf8");
const fiscalPanel = fs.readFileSync("src/fiscal-panel.js", "utf8");
assert.equal(panelCount, 2281);
assert.equal(renderedPanelCount, panelCount);
assert.match(app, /function sourceBreakdownParent/);
assert.match(app, /return sameAccount\(sourceBreakdownParent\(item\), parent\)/);
assert.match(app, /!rendered\.has\(item\)[\s\S]*rendered\.add\(item\)/);
assert.match(app, /items\.filter\(\(item\) => !rendered\.has\(item\)\)/);
assert.match(fiscalPanel, /const rendered = new Set\(\), rowHtml[\s\S]*detailSourceLinks\(detail, rendered\)/);
assert.doesNotMatch(fiscalPanel, /detailSourceLinks\(detail\) \+ sourceBreakdowns\(detail\)/);

const expanded = model.expandReconciliationSource({ label: "Census", direction: -1 }, {
  rows: [["Parent", "Other account", 6e9, 6e9, 1], ["Parent", "Account", 6e9, 6e9, 1]],
  sourceBreakdowns: [{ title: "Children", displayParent: ["Parent", "Account", 6e9],
    rows: [["Child", "Account", 6e9, "https://example.gov/child"]] }]
});
assert.deepEqual(expanded.sourceBreakdowns[0].displayParent,
  ["Census › Parent", "Account", -6e9]);
assert.deepEqual(expanded.sourceBreakdowns[0].displayParent.slice(0, 3), expanded.rows[1].slice(0, 3));
assert.notDeepEqual(expanded.sourceBreakdowns[0].displayParent.slice(0, 3), expanded.rows[0].slice(0, 3));
assert.deepEqual(expanded.sourceBreakdowns[0].rows[0].slice(0, 4),
  ["Census › Child", "Account · official publication ceiling", -6e9, "https://example.gov/child"]);

console.log("All source breakdowns render beneath a corresponding parent row.");
