const assert = require("node:assert/strict");
const fs = require("node:fs");

const jurisdictions = require("../data/jurisdictions.js");
const index = Object.fromEntries(Object.entries(jurisdictions.states)
  .map(([name, row]) => [name, row.summaryPath]));
const model = require("../src/model.js");
const threshold = 1_000_000_000;
const cents = (value) => Math.round(value * 100);
const key = (row) => JSON.stringify([row[0], String(row[1]).replace(/ · [^·]*ceiling(?: ·.*)?$/i, ""), row[2]]);
const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
const counts = { large: 0, breakdowns: 0, ceilings: 0 };

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function exactPanelFor(panels, row) {
  return panels.find((panel) => {
    const parent = panel.displayParent || panel.parent || panel.covers?.[0];
    return parent && key(parent) === key(row)
      && panel.rows.reduce((sum, child) => sum + cents(child[2]), 0) === cents(row[2]);
  });
}

function auditRows(rows, panels, context) {
  for (const row of rows.filter((item) => Number.isFinite(item[2]) && Math.abs(item[2]) >= threshold)) {
    counts.large += 1;
    const panel = exactPanelFor(panels, row);
    if (panel) counts.breakdowns += 1;
    else {
      assert.match(row[1], /ceiling/i, context + " unlabeled terminal: " + row[0] + " · " + row[1]);
      counts.ceilings += 1;
    }
  }
}

function auditSource(scope, source) {
  const base = source.detailUrl ? readJson(source.detailUrl) : null;
  const research = source.researchDetailUrl ? readJson(source.researchDetailUrl) : null;
  const detail = research ? { ...base,
    sourceBreakdowns: [...(base.sourceBreakdowns || []), ...(research.sourceBreakdowns || [])],
    supplementalBreakdowns: [...(base.supplementalBreakdowns || []),
      ...(research.supplementalBreakdowns || [])] } : base;
  const expanded = model.expandReconciliationSource(source, detail);
  const panels = sections.flatMap((name) => expanded[name]);
  auditRows([...expanded.rows, ...panels.flatMap((panel) => panel.rows)], panels, scope);
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

for (const slug of ["health-and-human-services", "education", "transportation", "treasury",
  "colleges-and-universities"]) {
  const base = readJson(`data/state-mi/archive-state-source/state-mi-${slug}.json`);
  const research = readJson(`data/state-mi/archive-state-source/state-mi-${slug}-transaction-detail.json`);
  for (const panel of research.sourceBreakdowns) {
    const parent = base.rows.find((row) => key(row) === key(panel.covers[0]));
    const publishedRows = panel.rows.reduce((sum, row) => sum
      + Number(row[1].match(/([\d,]+) payment rows/)[1].replaceAll(",", "")), 0);
    assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.equal(panel.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.equal(publishedRows, parent[4]);
    assert.ok(panel.rows.every((row) => Math.abs(row[2]) < threshold));
  }
}

for (const file of [
  "data/state-ms/archive-state-source/state-ms-department-of-education-transaction-detail.json",
  "data/state-ms/archive-state-source/state-ms-ms-dept-of-transportation-1941.json",
  "data/state-ms/archive-state-source/state-ms-office-of-the-state-treasurer-1171.json",
  "data/state-ms/archive-state-source/state-ms-finance-administration-1130.json",
  "data/state-ms/archive-state-source/state-ms-department-of-revenue-1181.json",
  "data/state-mt/archive-state-source/state-mt-department-of-revenue.json",
  "data/state-mt/archive-state-source/state-mt-department-of-public-health-and-human-services.json",
  "data/state-ks/archive-state-source/state-ks-state-treasurer.json",
  "data/state-ks/archive-state-source/state-ks-pooled-money-investment-board.json",
  "data/state-ks/archive-state-source/state-ks-dept-of-health-environment.json",
  "data/state-ks/archive-state-source/state-ks-ks-public-employees-rtrmnt-sys.json",
  "data/state-ny/archive-state-source/state-ny-transportation-department-of.json",
  "data/state-ny/archive-state-source/state-ny-budget-division-of-the.json",
  "data/state-ny/archive-state-source/state-ny-labor-department-of.json",
  "data/state-ny/archive-state-source/state-ny-homeland-security-and-emergency-services-division-of.json"
]) {
  const detail = readJson(file);
  for (const panel of [...(detail.itemBreakdowns || []), ...(detail.sourceBreakdowns || [])]) {
    const target = panel.parent?.[2] ?? panel.sourceTotal;
    assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(target), file);
    assert.ok(panel.rows.every((row) => Math.abs(row[2]) < threshold), file);
  }
}

const ohio = readJson("data/state-oh/archive-state-source/state-oh-department-of-medicaid.json").sourceBreakdowns;
for (const panel of ohio) {
  assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
  assert.equal(panel.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
}
assert.equal(ohio.flatMap((panel) => panel.rows).length, 34);

const newJersey = readJson("data/state-nj/archive-state-source/state-nj-human-services.json").sourceBreakdowns[0];
assert.equal(newJersey.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(newJersey.sourceTotal));
assert.equal(newJersey.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(newJersey.sourceTotal));
assert.equal(newJersey.rows.reduce((sum, row) => sum + Number(row[1].match(/([\d,]+) source rows/)[1].replaceAll(",", "")), 0), 630);

for (const file of [
  "data/state-al/archive-state-source/state-al-acfr-functions.json",
  "data/state-ar/archive-state-source/state-ar-acfr-functions.json",
  "data/state-ca/archive-state-source/state-ca-acfr-functions.json",
  "data/state-ct/archive-state-source/state-ct-acfr-functions.json",
  "data/state-fl/archive-state-source/state-fl-acfr-functions.json",
  "data/state-ga/archive-state-source/state-ga-acfr-functions.json",
  "data/state-ia/archive-state-source/state-ia-acfr-functions.json",
  "data/state-ma/archive-state-source/state-ma-acfr-functions.json",
  "data/state-md/archive-state-source/state-md-acfr-functions.json",
  "data/state-mo/archive-state-source/state-mo-acfr-functions.json",
  "data/state-nm/archive-state-source/state-nm-acfr-functions.json",
  "data/state-nj/archive-state-source/state-nj-acfr-functions.json",
  "data/state-ny/archive-state-source/state-ny-acfr-functions.json",
  "data/state-ok/archive-state-source/state-ok-acfr-functions.json",
  "data/state-sc/archive-state-source/state-sc-acfr-functions.json",
  "data/state-tx/archive-state-source/state-tx-acfr-functions.json",
  "data/state-wa/archive-state-source/state-wa-acfr-functions.json",
  "data/state-wi/archive-state-source/state-wi-acfr-functions.json"
]) {
  for (const panel of readJson(file).sourceBreakdowns) {
    assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.equal(panel.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal));
    assert.ok(panel.rows.every((row) => Math.abs(row[2]) < 1e10));
  }
}

assert.ok(counts.large > 3_000);
assert.equal(counts.breakdowns + counts.ceilings, counts.large);
assert.ok(counts.breakdowns > 1_000 && counts.ceilings > 1_000, JSON.stringify(counts));

const privateRow = model.publicationCeiling(
  ["Protected recipient group", "[individual recipient omitted]", 2e9, 2e9, 1],
  "privacy-preserving publication ceiling");
assert.match(privateRow[1], /individual recipient omitted.+privacy-preserving publication ceiling/);

const virginiaMedicaid = readJson(
  "data/state-va/archive-state-source/state-va-dept-of-med-assistance-svcs.json");
const virginiaMedicaidPanel = virginiaMedicaid.itemBreakdowns[0];
assert.equal(virginiaMedicaidPanel.rows.reduce((sum, row) => sum + cents(row[2]), 0),
  cents(virginiaMedicaidPanel.sourceTotal));
assert.equal(virginiaMedicaidPanel.sourceTotal, virginiaMedicaidPanel.parent[2]);
assert.deepEqual([virginiaMedicaidPanel.rows.length,
  virginiaMedicaidPanel.rows.every((row) => Math.abs(row[2]) < threshold)], [108, true]);
for (const file of [
  "data/state-va/archive-state-source/state-va-direct-aid-to-public-education.json",
  "data/state-va/archive-state-source/state-va-admin-of-health-insurance.json",
  "data/state-va/archive-state-source/state-va-va-dept-of-transportation.json"
]) {
  const panel = readJson(file).itemBreakdowns.at(-1);
  assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.parent[2]));
  assert.equal(panel.rows.length, 12);
  assert.ok(panel.rows.every((row) => Math.abs(row[2]) < threshold));
}
const virginiaTreasury = readJson(
  "data/state-va/archive-state-source/state-va-treasury-board-wbu.json");
assert.equal(virginiaTreasury.rows.reduce((sum, row) => sum + cents(row[2]), 0),
  cents(virginiaTreasury.sourceTotal));
assert.deepEqual([virginiaTreasury.rows.length,
  virginiaTreasury.rows.every((row) => Math.abs(row[2]) < threshold)], [9, true]);

const exactLedgerPanels = ["ct", "de", "ma", "vt"].flatMap((state) =>
  fs.readdirSync(`data/state-${state}/archive-state-source`).filter((file) => file.endsWith(".json"))
    .flatMap((file) => readJson(`data/state-${state}/archive-state-source/${file}`).itemBreakdowns || [])
    .filter((panel) => panel.basis.startsWith("Exact additive official")));
assert.deepEqual([exactLedgerPanels.length, exactLedgerPanels.flatMap((panel) => panel.rows).length], [12, 3570]);
assert.ok(exactLedgerPanels.every((panel) => panel.rows.reduce((sum, row) => sum + cents(row[2]), 0) === cents(panel.sourceTotal)
  && panel.rows.every((row) => Math.abs(row[2]) < threshold)));

const healthFunctions = /Total (Health|Hospitals|Public Welfare|Federal and State Veterans' Services)$/;
const healthCoverage = { states: 0, parents: 0, children: 0, functionTotal: 0, cmsPanels: 0, cmsRows: 0 };
const defenseCoverage = { states: 0, rows: 0, cents: 0 };
const cmsControls = {};
for (const directory of fs.readdirSync("data").filter((name) => /^state-[a-z]{2}$/.test(name))) {
  const detail = readJson(`data/${directory}/census-${directory}-fy2024-direct-general.json`);
  for (const row of detail.rows.filter((item) => item[2] && healthFunctions.test(item[1]))) {
    const panel = detail.itemBreakdowns.find((item) => key(item.parent) === key(row));
    assert.ok(panel, directory + " healthcare/veterans function breakdown");
    assert.equal(panel.rows.reduce((sum, item) => sum + item[2], 0), row[2]);
    healthCoverage.parents += 1;
    healthCoverage.children += panel.rows.length;
    healthCoverage.functionTotal += row[2];
  }
  const cms = detail.supplementalBreakdowns.filter((item) => item.dataset?.startsWith("cms-fy2024-"));
  assert.equal(cms.length, 6, directory + " Medicaid/CHIP financing panels");
  for (const panel of cms) {
    assert.equal(panel.rows.reduce((sum, item) => sum + item[2], 0), panel.sourceTotal);
    cmsControls[panel.dataset] = (cmsControls[panel.dataset] || 0) + panel.sourceTotal;
    healthCoverage.cmsRows += panel.rows.length;
  }
  healthCoverage.states += 1;
  healthCoverage.cmsPanels += cms.length;
  const defenseRows = detail.supplementalRows || [];
  if (defenseRows.length) defenseCoverage.states += 1;
  defenseCoverage.rows += defenseRows.length;
  defenseCoverage.cents += defenseRows.reduce((sum, row) => sum + cents(row[2]), 0);
  assert.ok(defenseRows.every((row) => /Official state-ledger defense topic view/.test(row[1])
    && /separate, non-additive/.test(row[3]) && /^https:\/\//.test(row[4])));
  assert.ok(defenseRows.every((row) => !/indigent defense|public defender|military academy|military institute/i.test(row[0])));
}
assert.deepEqual(healthCoverage, { states: 50, parents: 196, children: 466,
  functionTotal: 1242647928000, cmsPanels: 300, cmsRows: 17213 });
assert.deepEqual(defenseCoverage, { states: 41, rows: 92, cents: 722282887865 });
assert.deepEqual(cmsControls, {
  "cms-fy2024-medicaid-total-computable": 939446973929.1,
  "cms-fy2024-medicaid-federal-share": 604736585664,
  "cms-fy2024-medicaid-nonfederal-share": 334710388265.1,
  "cms-fy2024-chip-total-computable": 27969514721,
  "cms-fy2024-chip-federal-share": 19806035303,
  "cms-fy2024-chip-nonfederal-share": 8163479418
});
const federalFunctionControls = {
  "national-defense": [211, 873523000000, 874041000000, ["051", "053", "054"]],
  health: [124, 911290000000, 911684000000, ["551", "552", "554"]],
  medicare: [31, 874133000000, 874134000000, ["571"]],
  "veterans-benefits-and-services": [84, 325645000000, 325363000000, ["701", "702", "703", "704", "705"]]
};
for (const [name, [publishedRows, publishedTotal, treasuryTotal, subfunctions]] of Object.entries(federalFunctionControls)) {
  const detail = readJson(`data/federal/archive-function-source/federal-treasury-function-${name}.json`);
  const panel = detail.sourceBreakdowns.find((item) => item.dataset === "omb-public-budget-database-fy2024");
  assert.equal(panel.rows.length, publishedRows + 1, name);
  assert.equal(panel.publishedSourceTotal, publishedTotal, name);
  assert.equal(panel.rows.reduce((sum, item) => sum + item[2], 0), treasuryTotal, name);
  assert.deepEqual([...new Set(panel.rows.map((row) => row[0].match(/^\d{3}/)?.[0]).filter(Boolean))].sort(),
    subfunctions, name);
}
console.log("Browser-visible audit passed: every large state row has an exact schedule or a visible source ceiling.", counts);
