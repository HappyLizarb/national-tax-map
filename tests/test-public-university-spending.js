const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const states = fs.readdirSync(path.join(root, "data")).filter((name) => /^state-[a-z]{2}$/.test(name));
const files = states.map((directory) => path.join(root, "data", directory, "ipeds-public-university-fy2024.json"));
const totals = { institutions: 0, reporters: 0, covered: 0, missing: 0, expenses: 0,
  publicSupport: 0, breakdowns: 0 };
const supportByLevel = { federal: 0, state: 0, local: 0, capitalUnassigned: 0 };
const grapevine = { stateSupport: 0, fourYearPublicOperating: 0, taxAppropriations: 0,
  nonTaxSupport: 0, otherStateSupport: 0, returnsAndMultiyear: 0, roundingRows: 0, roundingNet: 0 };
const budgetCoverage = { sources: 0, adopted: 0, appropriations: 0, schedules: 0 };
const statesByTier = new Map();
let fasb = 0, reportedFederal = 0;

assert.equal(files.length, 50);
const fiscalPanel = fs.readFileSync(path.join(root, "src/fiscal-panel.js"), "utf8");
assert.match(fiscalPanel, /department\.id === "census-direct-general"[\s\S]*ipeds-public-university-fy2024\.json/);
assert.match(fiscalPanel, /supplementalBreakdowns: \[\.\.\.\(detail\.supplementalBreakdowns/);
assert.match(fiscalPanel, /budgetSources: research\.budgetSources/);
for (const file of files) {
  assert.ok(fs.existsSync(file), file);
  const detail = JSON.parse(fs.readFileSync(file, "utf8"));
  assert.ok(detail.budgetCoverageLabel && detail.budgetSources.length >= 1, detail.scope);
  statesByTier.set(detail.budgetCoverageTier, (statesByTier.get(detail.budgetCoverageTier) || 0) + 1);
  for (const source of detail.budgetSources) {
    assert.match(source.sourceUrl, /^https:\/\//, source.scope);
    assert.equal(source.verificationStatus, "verified_primary", source.scope);
    assert.ok(source.publicationCeiling && source.budgetScope, source.scope);
    if (source.sourceKind === "appropriation_ceiling") assert.match(source.status, /not university spending/);
    budgetCoverage.sources += 1;
    if (source.sourceKind === "adopted_operating_budget") budgetCoverage.adopted += 1;
    else if (source.sourceKind === "appropriation_ceiling") budgetCoverage.appropriations += 1;
    else if (source.sourceKind === "official_budget_schedule") budgetCoverage.schedules += 1;
    else assert.fail(`Unexpected budget source kind: ${source.sourceKind}`);
  }
  const [panel] = detail.supplementalBreakdowns;
  const uses = detail.supplementalBreakdowns.find((item) => item.dataset === "sheeo-grapevine-fy2024-uses");
  const sources = detail.supplementalBreakdowns.find((item) => item.dataset === "sheeo-grapevine-fy2024-sources");
  assert.equal(detail.supplementalBreakdowns.length, 3, detail.scope);
  assert.ok(uses && sources, detail.scope);
  assert.equal(uses.rows.reduce((sum, row) => sum + row[2], 0), uses.sourceTotal, detail.scope);
  assert.equal(sources.rows.reduce((sum, row) => sum + row[2], 0), sources.sourceTotal, detail.scope);
  assert.equal(uses.sourceTotal, sources.sourceTotal, detail.scope);
  assert.match(uses.basis, /budget-support ceiling—not each institution's all-funds adopted budget/);
  assert.match(sources.basis, /not additive to the use panel/);
  assert.equal(uses.rows[0][0], "Public four-year operating appropriations", detail.scope);
  grapevine.stateSupport += uses.sourceTotal;
  grapevine.fourYearPublicOperating += uses.fourYearPublicOperating;
  for (const row of uses.rows.filter((row) => row[0] === "Published use-table rounding difference")) {
    grapevine.roundingRows += 1;
    grapevine.roundingNet += row[2];
  }
  for (const row of sources.rows) {
    if (row[0] === "State tax appropriations") grapevine.taxAppropriations += row[2];
    else if (row[0] === "Non-tax state support") grapevine.nonTaxSupport += row[2];
    else if (row[0] === "Other state support") grapevine.otherStateSupport += row[2];
    else grapevine.returnsAndMultiyear -= row[2];
  }
  assert.equal(panel.title, "IPEDS FY2024 public-university GAAP expenses by reporting institution");
  assert.match(panel.basis, /Supplemental—not additive to Census code 18/);
  assert.match(panel.sourceUrl, /^https:\/\/nces\.ed\.gov\/ipeds\//);
  assert.ok(panel.institutionCount >= 1 && panel.reportingRecordCount >= 1, detail.scope);
  assert.equal(panel.rows.length, panel.reportingRecordCount, detail.scope);
  assert.equal(detail.sourceBreakdowns.length, panel.reportingRecordCount * 2, detail.scope);
  assert.equal(panel.rows.reduce((sum, row) => sum + row[2], 0), panel.sourceTotal, detail.scope);
  assert.ok(panel.rows.every((row, index) => !index || panel.rows[index - 1][2] >= row[2]), detail.scope);
  const parents = new Map(panel.rows.map((row) => [JSON.stringify(row), row[2]]));
  const viewsByParent = new Map();
  for (const breakdown of detail.sourceBreakdowns) {
    const parentKey = JSON.stringify(breakdown.displayParent);
    assert.ok(parents.has(parentKey), breakdown.title);
    assert.equal(breakdown.rows.reduce((sum, row) => sum + row[2], 0), breakdown.sourceTotal, breakdown.title);
    assert.ok(breakdown.rows.every((row, index, rows) => !index
      || Math.abs(rows[index - 1][2]) >= Math.abs(row[2])), breakdown.title);
    viewsByParent.set(parentKey, [...(viewsByParent.get(parentKey) || []), breakdown.view]);
    if (breakdown.view === "functional-expenses") {
      assert.equal(breakdown.sourceTotal, parents.get(parentKey), breakdown.title);
      assert.match(breakdown.basis, /reconcile exactly/);
    } else {
      assert.equal(breakdown.view, "public-support-revenue");
      assert.match(breakdown.basis, /not an enacted or adopted budget/);
      totals.publicSupport += breakdown.sourceTotal;
      for (const row of breakdown.rows) {
        const level = row[0].startsWith("Federal") ? "federal" : row[0].startsWith("State") ? "state"
          : row[0].startsWith("Local") ? "local" : "capitalUnassigned";
        supportByLevel[level] += row[2];
      }
    }
  }
  assert.ok([...viewsByParent.values()].every((views) => views.sort().join("|")
    === "functional-expenses|public-support-revenue"), detail.scope);
  fasb += panel.rows.filter((row) => /FASB actual expenses/.test(row[1])).length;
  reportedFederal += panel.rows.filter((row) => /federally operated institution/.test(row[1])).length;
  totals.institutions += panel.institutionCount;
  totals.reporters += panel.reportingRecordCount;
  totals.covered += panel.coveredInstitutionCount;
  totals.missing += panel.unreportedInstitutions.length;
  totals.expenses += panel.sourceTotal;
  totals.breakdowns += detail.sourceBreakdowns.length;
}

assert.deepEqual(totals, { institutions: 826, reporters: 790, covered: 824, missing: 2,
  expenses: 438230886773, publicSupport: 170574559732, breakdowns: 1580 });
assert.deepEqual(supportByLevel, { federal: 61955307815, state: 92964789771,
  local: 8353032748, capitalUnassigned: 7301429398 });
assert.deepEqual(grapevine, { stateSupport: 123616420870, fourYearPublicOperating: 60155985040,
  taxAppropriations: 114227520808, nonTaxSupport: 5753189355,
  otherStateSupport: 3736219303, returnsAndMultiyear: 100508596,
  roundingRows: 10, roundingNet: -6 });
assert.deepEqual(budgetCoverage, { sources: 61, adopted: 25, appropriations: 35, schedules: 1 });
assert.deepEqual(Object.fromEntries([...statesByTier].sort()), {
  "appropriation-only": 28, "narrower-adopted": 3, "partial-all-funds": 9, "statewide-all-funds": 10
});
assert.equal(totals.covered - totals.reporters, 34, "campuses consolidated into official parent records");
assert.equal(fasb, 12);
assert.equal(reportedFederal, 5);
const unavailable = files.flatMap((file) => JSON.parse(fs.readFileSync(file, "utf8"))
  .supplementalBreakdowns[0].unreportedInstitutions);
assert.deepEqual(unavailable.sort(), [
  "Air Force Institute of Technology-Graduate School of Engineering & Management (UNITID 200697; federally operated)",
  "Naval Postgraduate School (UNITID 119678; federally operated)"
]);

console.log("IPEDS FY2024 expenses cover 824 of 826 public four-year institutions across all 50 states without allocating parent totals to child campuses.");
