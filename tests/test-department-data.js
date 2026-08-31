const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const jurisdictions = require("../data/jurisdictions.js");
const index = { ...Object.fromEntries(Object.entries(jurisdictions.states)
  .map(([name, row]) => [name, row.summaryPath])), "United States": jurisdictions.federal.summaryPath };

const root = path.resolve(__dirname, "..");
const cents = (value) => Math.round(value * 100);
const privatePayroll = /^(?:\*?due to employees|net pay|personal vehicle mileage(?: exp(?:en|ense)?|[- ]tryln)?|non-wage employee settlement)(?: \(aggregate\))?$/i;
const sourceDefinedOtherRows = new Set([
  "United States:mts-agency-other-defense-civil-programs",
  "California:sco-bu-9380", "Connecticut:auditors-of-public-accounts", "Connecticut:comm-on-womenchilsenequityopty",
  "Connecticut:lieutenant-governor-s-office", "Delaware:other-elective-offices", "Georgia:financing-and-investment-commission-georgia-state-other",
  "Indiana:bu-00322", "Iowa:ag-soybean-promotion", "Iowa:ag-cattle-promotion-board", "Iowa:ag-egg-council",
  "Iowa:ag-turkey-marketing-council", "Louisiana:other-requirements", "Ohio:employee-benefits-funds",
  "Ohio:ohio-housing-finance-agency", "Ohio:veterans-organizations", "Oklahoma:bu-92200-oklahoma-housing-finance-agency",
  "Pennsylvania:other-specialized-se", "Pennsylvania:other-supplies", "Pennsylvania:rentals-other", "Pennsylvania:other-heating-fuel",
  "South Carolina:j200-dept-of-alcohol-other-drug-abu", "Texas:other-uses"
]);
const otherLabel = (row) => [row.id, row.name, row.program, row.note].filter(Boolean).join(" ").match(/\bother(s)?\b/i);
const censusFunctionRow = (row) => row.id.startsWith("census-");
const stateItemBreakdowns = [];
const stateBranchBreakdowns = [];
const stateSourceBreakdowns = [];
const stateBranchCoverage = { judiciary: new Set(), legislature: new Set() };

assert.equal(Object.keys(index).length, 51);
for (const [scope, summaryPath] of Object.entries(index)) {
  const summary = require(path.join(root, summaryPath));
  const directory = path.join(root, path.dirname(summaryPath));
  assert.deepEqual(fs.readdirSync(directory).filter((file) => file.endsWith(".js")), [path.basename(summaryPath)], scope);
  assert.equal(summary.scope, scope);
  if (scope !== "United States") assert.equal(summary.coverageStatus, "census-complete-function-basis", scope + " · canonical layer");
  assert.ok(summary.departments.every((row) => !/\bothers\b/i.test(JSON.stringify(row))), scope);
  const otherRows = summary.departments.filter(otherLabel);
  assert.ok(otherRows.every((row) => censusFunctionRow(row) || sourceDefinedOtherRows.has(scope + ":" + row.id)), scope + " · unresolved Other label");
  assert.ok(otherRows.every((row) => row.detailUrl || row.program || row.note), scope + " · unitemized Other label");
  assert.equal(Object.hasOwn(summary.reconciliation, "others"), false, scope);
  assert.equal(Object.hasOwn(summary, "ledgerTotal"), false, scope + " · stale ledger field");
  assert.equal(cents(summary.itemizedTotal), cents(summary.sourceTotal), scope + " · itemized total");
  assert.equal(summary.reconciliation.itemizedDifference, 0, scope + " · itemized reconciliation");
  assert.equal(Object.hasOwn(summary.reconciliation, "coverageGap"), false, scope + " · synthetic coverage gap");
  assert.equal(summary.departments.filter((row) => row.id === "coverage-gap").length, 0, scope + " · synthetic coverage row");
  assert.equal(summary.departments.reduce((sum, row) => sum + cents(row.amount), 0), cents(summary.itemizedTotal), scope);
  assert.match(summary.comparison.url, /^https:\/\//, scope + " · comparator link");
  assert.equal(cents(summary.comparison.difference), cents(summary.sourceTotal) - cents(summary.comparison.total), scope + " · comparator difference");
  for (const department of summary.departments) {
    assert.match(department.sourceUrl, /^https:\/\//, scope + " · " + department.name);
    assert.equal(cents(department.amount), cents(department.sourceAmount), scope + " · " + department.name + " · source basis");
    if (!department.detailUrl) {
      assert.equal(typeof department.program, "string", scope + " · " + department.name);
      assert.ok(Object.hasOwn(department, "sourceRows"), scope + " · " + department.name);
      continue;
    }
    assert.match(department.detailUrl, new RegExp("^data/" + (scope === "United States" ? "federal/federal-" : "state-[a-z]{2}/(?:state-[a-z]{2}-|census-state-[a-z]{2}-)") + ".+\\.json$"));
    const detail = JSON.parse(fs.readFileSync(path.join(root, department.detailUrl), "utf8"));
    assert.match(detail.sourceUrl, /^https:\/\//, scope + " · " + department.name);
    const baseSchema = ["subAgency", "program", "amount", "sourceAmount", "sourceRows"];
    const allowedSchemas = [baseSchema, [...baseSchema, "obligations"],
      [...baseSchema, "grossOutlays", "applicableReceipts"]];
    assert.ok(allowedSchemas.some((schema) => detail.rowSchema.join("|") === schema.join("|")));
    assert.equal(detail.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(department.amount), scope + " · " + department.name);
    assert.ok(detail.rows.every((row) => Number.isInteger(cents(row[2]))), scope + " · " + department.name + " · cents");
    if (detail.sourceCheck) {
      const checkedGroups = detail.sourceCheck.objectClassRows ?? detail.sourceCheck.groupRows;
      assert.equal(detail.rows.length, checkedGroups, scope + " · " + department.name + " · source rows");
      assert.equal(detail.rows.reduce((sum, row) => sum + cents(row[3]), 0), cents(detail.sourceTotal), scope + " · " + department.name + " · source total");
      assert.equal(detail.sourceCheck.difference, 0, scope + " · " + department.name + " · source check");
      assert.ok(detail.sourceUrls.every(([, url]) => /^https:\/\//.test(url)), scope + " · " + department.name + " · source links");
    }
    assert.ok(detail.rows.every((row) => row[0] && row[1]), scope + " · " + department.name);
    assert.equal(detail.rows.filter((row) => row.some((value) => privatePayroll.test(String(value))) && !row.includes("[privacy-safe aggregate]")).length, 0, scope + " · " + department.name + " · privacy");
    if (detail.supplementalRows?.length) {
      assert.deepEqual(detail.supplementalSchema, ["subAgency", "program", "amount", "measure", "source"]);
      assert.ok(detail.supplementalRows.every((row) => row[0] && row[1] && /^https:\/\//.test(row[4])));
    }
    if (scope !== "United States") {
      stateItemBreakdowns.push(...(detail.itemBreakdowns || []));
      stateSourceBreakdowns.push(...(detail.sourceBreakdowns || []));
      const panels = detail.supplementalBreakdowns || [];
      stateBranchBreakdowns.push(...panels);
      if (panels.some((item) => /judici|court/i.test(item.title))) stateBranchCoverage.judiciary.add(scope);
      if (panels.some((item) => /legislat|general assembly/i.test(item.title))) stateBranchCoverage.legislature.add(scope);
    }
    assert.ok(detail.rows.length !== 1 || detail.supplementalRows?.length || detail.sourceCheck, scope + " · redundant one-row JSON");
  }
}

assert.equal(stateItemBreakdowns.length, 380);
assert.ok(stateItemBreakdowns.every((item) => item.rowPrefix === "Census" && item.rows.reduce((sum, row) => sum + cents(row[2]), 0) === cents(item.parent[2])));
const stateCensusLargeRows = stateItemBreakdowns.flatMap((item) => item.rows)
  .filter((row) => Math.abs(row[2]) >= 1e9);
assert.equal(stateCensusLargeRows.length, 290);
const stateCensusCeilings = stateCensusLargeRows.filter((row) => /ceiling/i.test(row[1]));
assert.equal(stateCensusCeilings.length, 57);
assert.ok(stateCensusCeilings.every((row) => /Census annual disclosure ceiling/.test(row[1])));
assert.deepEqual([stateSourceBreakdowns.length, stateSourceBreakdowns.reduce((sum, item) => sum + item.rows.length, 0)], [43, 1389]);
assert.ok(stateSourceBreakdowns.every((item) => /^https:\/\//.test(item.sourceUrl)
  && /not additive|separate|supplemental/.test(item.basis)
  && item.rows.every((row, index, rows) => !index || Math.abs(rows[index - 1][2]) >= Math.abs(row[2]))
  && cents(item.rows.reduce((sum, row) => sum + row[2], 0)) === cents(item.sourceTotal)));
const nyAid = stateSourceBreakdowns.find((item) => item.title === "NYC 2023-24 state-aid payments by funding stream");
assert.deepEqual([nyAid.rows.length, cents(nyAid.rows.reduce((sum, row) => sum + row[2], 0))], [21, cents(13058457682.74)]);
assert.ok(nyAid.rows.every((row) => Math.abs(row[2]) < 1e10));
const nycFormulaAid = stateSourceBreakdowns.flatMap((item) => item.rows).find((row) => row[2] === 10076459000);
assert.match(nycFormulaAid[1], /C01.*source-native disclosure ceiling/);
const schoolRecipientPanels = stateSourceBreakdowns.filter((item) => item.sourceUrl.includes("elsec24.xlsx"));
assert.equal(schoolRecipientPanels.length, 42);
assert.ok(schoolRecipientPanels.flatMap((item) => item.rows)
  .every((row) => Math.abs(row[2]) < 1e9 || /ceiling/i.test(row[1])));
assert.equal(stateBranchBreakdowns.length, 497);
assert.equal(stateBranchBreakdowns.reduce((sum, item) => sum + item.rows.length, 0), 30404);
const archivedBranchBreakdowns = stateBranchBreakdowns.filter((item) => item.title.startsWith("Archived official"));
assert.equal(archivedBranchBreakdowns.length, 0);
assert.equal(archivedBranchBreakdowns.filter((item) => item.rows.length > 1).length, 0);
assert.ok(archivedBranchBreakdowns.every((item) => item.rows.length <= 21));
const namedBranchBreakdowns = stateBranchBreakdowns.filter((item) => /judici|court|legislat|general assembly/i.test(item.title));
assert.ok(namedBranchBreakdowns.every((item) => item.rows.every((row, index, rows) => !index || rows[index - 1][2] >= row[2])));
assert.equal(namedBranchBreakdowns.flatMap((item) => item.rows)
  .filter((row) => /^(?:All other|Other \d+)/.test(row[0])).length, 0);
assert.deepEqual([stateBranchCoverage.judiciary.size, stateBranchCoverage.legislature.size], [50, 50]);
const georgiaLegislature = stateBranchBreakdowns.find((item) => item.title === "Georgia General Assembly FY2024 payments by expense description");
assert.deepEqual([georgiaLegislature.rows.length, georgiaLegislature.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [127, cents(50234240.29)]);
assert.ok(georgiaLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const kentuckyLegislature = stateBranchBreakdowns.find((item) => item.title === "Kentucky Legislative Branch FY2024 expenditures by department and object code");
assert.deepEqual([kentuckyLegislature.rows.length, kentuckyLegislature.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [168, cents(91304009.55)]);
assert.ok(kentuckyLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const rhodeIslandLegislature = stateBranchBreakdowns.find((item) => item.title === "Rhode Island Legislature FY2024 budgetary actual by program");
assert.deepEqual([rhodeIslandLegislature.rows.length, rhodeIslandLegislature.rows.reduce((sum, row) => sum + row[2], 0)], [6, 50114866]);
assert.ok(rhodeIslandLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const westVirginiaLegislature = stateBranchBreakdowns.find((item) => item.title === "West Virginia Legislature FY2024 actual expenditures by appropriation");
assert.deepEqual([westVirginiaLegislature.rows.length, westVirginiaLegislature.rows.reduce((sum, row) => sum + row[2], 0)], [31, 36949652]);
assert.ok(westVirginiaLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const westVirginiaJudiciary = stateBranchBreakdowns.find((item) => item.title === "West Virginia Judiciary FY2024 expenditures by court division and support function");
assert.deepEqual([westVirginiaJudiciary.rows.length, westVirginiaJudiciary.rows.reduce((sum, row) => sum + row[2], 0)], [7, 156260632]);
assert.ok(westVirginiaJudiciary.rows.every((row) => Math.abs(row[2]) < 1e10));
const iowaLegislature = stateBranchBreakdowns.find((item) => item.title === "Iowa Legislature FY2024 General Fund actuals by appropriation");
assert.deepEqual([iowaLegislature.rows.length, iowaLegislature.rows.reduce((sum, row) => sum + row[2], 0)], [6, 36985580]);
assert.ok(iowaLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const wisconsinLegislature = stateBranchBreakdowns.find((item) => item.title === "Wisconsin Legislature FY2024 expenditures by appropriation");
assert.deepEqual([wisconsinLegislature.rows.length, cents(wisconsinLegislature.rows.reduce((sum, row) => sum + row[2], 0))], [12, cents(91103341.08)]);
assert.ok(wisconsinLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const minnesotaLegislature = stateBranchBreakdowns.find((item) => item.title === "Minnesota Legislature FY2024 General Fund actuals by appropriation");
assert.deepEqual([minnesotaLegislature.rows.length, minnesotaLegislature.rows.reduce((sum, row) => sum + row[2], 0)], [8, 114806000]);
assert.ok(minnesotaLegislature.rows.every((row) => Math.abs(row[2]) < 1e10));
const californiaTwoPlan = stateBranchBreakdowns.find((item) => item.title === "California FY2024-25 Two-Plan capitation estimate by county");
assert.deepEqual([californiaTwoPlan.rows.length, californiaTwoPlan.rows.reduce((sum, row) => sum + row[2], 0)], [15, 34029935000]);
assert.deepEqual(californiaTwoPlan.rows.filter((row) => Math.abs(row[2]) >= 1e10).map((row) => row[0]), ["Los Angeles"]);
const californiaCohs = stateBranchBreakdowns.find((item) => item.title === "California FY2024-25 COHS and Single-Plan capitation estimate by county or plan");
assert.deepEqual([californiaCohs.rows.length, californiaCohs.rows.reduce((sum, row) => sum + row[2], 0)], [31, 17624934000]);
assert.ok(californiaCohs.rows.every((row) => Math.abs(row[2]) < 1e10));
const iowaMedicaidMlr = stateBranchBreakdowns.find((item) => item.title === "Iowa SFY2024 adjusted Medicaid MLR numerator by health plan and component");
assert.deepEqual([iowaMedicaidMlr.rows.length, iowaMedicaidMlr.rows.reduce((sum, row) => sum + row[2], 0)], [6, 7885282613]);
assert.ok(iowaMedicaidMlr.rows.every((row) => Math.abs(row[2]) < 1e10));
assert.equal(namedBranchBreakdowns.flatMap((item) => item.rows).filter((row) => Math.abs(row[2]) >= 1e10).length, 0);
assert.ok(stateBranchBreakdowns.every((item) => /not additive|separate|supplemental|subset|unreconciled/.test(item.basis)
  && item.rows.every((row) => /^https:\/\//.test(row[3]))));
const cmsStateBreakdown = (item) => item.dataset?.startsWith("cms-fy2024-") || item.title.startsWith("CMS-64");
const nonCmsStateCeilings = stateBranchBreakdowns.filter((item) => !cmsStateBreakdown(item))
  .flatMap((item) => item.rows).filter((row) => Math.abs(row[2]) >= 1e10);
assert.deepEqual(nonCmsStateCeilings.map((row) => [row[0], row[1]]),
  [["Los Angeles", "FY2024-25 Two-Plan accrual estimate · public county ceiling"]]);
assert.equal(stateBranchBreakdowns.filter(cmsStateBreakdown).flatMap((item) => item.rows).filter((row) => Math.abs(row[2]) >= 1e10).length, 49);
assert.ok(stateBranchBreakdowns.filter(cmsStateBreakdown).flatMap((item) => item.rows)
  .filter((row) => Math.abs(row[2]) >= 1e10).every((row) => /public annual (?:category )?disclosure ceiling/.test(row[1])));
for (const [title, count, total] of [
  ["New York FY2024 higher-education cash payments by public entity", 5, 8743115816.08],
  ["Florida public universities FY2023-24 actual expenditures by institution and program", 29, 15936265029],
  ["Illinois FY2024 medical-program spending by encounter-allocated provider type", 6, 25705400000],
  ["New York FY2024 General State Charges by centrally paid cost", 11, 10696000000],
  ["New York SFY2023-24 Medicaid behavioral-health expense by managed-care plan", 13, 1853735081],
  ["Michigan FY2023-24 public-university General Fund expenditures by function", 11, 8172698548],
  ["Michigan FY2024 Medicaid health-services actuals by appropriation", 25, 21655704249],
  ["Pennsylvania State System FY2024 operating expenses by function", 9, 1811467000],
  ["North Carolina SFY2024 Medicaid claims expenditures by service category", 32, 27943400000],
  ["Arizona FY2024 AHCCCS Medicaid Services actuals by subprogram", 9, 16590450500],
  ["Ohio SFY2024 Medicaid incurred-cost estimate by program", 11, 29489647795],
  ["Texas FY2024 full-benefit Medicaid expenditures by eligibility group", 4, 22506000000],
  ["Florida audited Medicaid plan revenue · derived SFY2023-24", 17, 22440629706],
  ["Kentucky SFY2024 Medicaid benefits actuals by payment type", 7, 18197104900],
  ["Louisiana SFY2023-24 Medicaid actuals by category of service", 53, 18331693044],
  ["Pennsylvania FY2023-24 Medicaid capitation available by program and payment month", 17, 21631613874],
  ["Massachusetts FY2024 EOHHS 4000-series actual expenditures by line item", 30, 20567829135],
  ["Massachusetts Judiciary FY2024 actual expenditures by appropriation", 35, 1311375344],
  ["Massachusetts Legislature FY2024 actual expenditures by appropriation", 4, 89582952],
  ["Massachusetts Legislature FY2024 CTHRU payments by department and object class", 29, 86836921.29],
  ["Washington HCA FY2024 vendor payments · 80 rows", 80, 13835670424.65],
  ["Oregon OHA and DHS FY2024 cash expense by accounting class · 308 rows", 308, 7619183154.66],
  ["California FY2024 welfare and health realignment local assistance by subaccount", 9, 13645375933],
  ["California FY2024 tax relief and shared-revenue local assistance by program", 9, 4083059799],
  ["New York FY2024 welfare, housing, and employment local-assistance cash by fund", 11, 11621333000],
  ["SUNY FY2024 audited expenses by function", 9, 13820304000],
  ["CUNY FY2024 audited expenses by function", 11, 5521644000],
  ["New Jersey CY2024 Medicaid direct premium by managed-care plan", 5, 15991560638],
  ["Minnesota CY2024 medical-program payments by eligibility group", 8, 21232314171],
  ["Virginia SFY2024 Medicaid actual expenditures by service and managed-care population", 9, 21587032536],
  ["Indiana SFY2024 Medicaid cash expenditures by program and service", 11, 19393340255],
  ["Oklahoma SFY2024 OHCA expenditures by age and non-age-specific status", 4, 10327062611],
  ["South Carolina FY2024 DHHS cash expenditures by accounting category", 15, 11145951518.10],
  ["Tennessee FY2024 TennCare expenditures by program category", 9, 15783559200],
  ["New Jersey FY2024 Judiciary expenditures by organization and vicinage function", 17, 1013418093.05],
  ["New Jersey FY2024 Legislature expenditures by organization", 9, 106577326.59],
  ["California Judiciary FY2024 budgetary/legal expenditures by appropriation and fund", 80, 5049481591],
  ["California Legislature FY2024 budgetary/legal expenditures by appropriation and operating-fund offset", 11, 727446097],
  ["Colorado Legislative Department FY2024 General Fund expenditures by organization and committed fund", 10, 70243468],
  ["Colorado Judiciary FY2024 TOPS payments by expense code · 128 rows", 128, 842952598.60],
  ["Colorado Legislature FY2024 TOPS payments by expense code · 68 rows", 68, 64695765.26],
  ["Connecticut Judiciary FY2024 Open Expenditures by department and program · 70 rows", 70, 322648602.12],
  ["Indiana Judiciary FY2024 State Comptroller expenditures by fund and account · 768 rows", 768, 228584397.66],
  ["Indiana Legislature FY2024 State Comptroller expenditures by fund and account · 297 rows", 297, 64252049.27],
  ["Kansas Judiciary FY2024 KanView payments by agency, expense category, and fund · 301 rows", 301, 15587054.97],
  ["Kansas Legislature FY2024 KanView payments by agency, expense category, and fund · 101 rows", 101, 8611327.96],
  ["New York Judiciary FY2024 Open Book payments by expense category · 589 rows", 589, 1373781777.74],
  ["New York Legislature FY2024 Open Book payments by expense category · 185 rows", 185, 56880498],
  ["Nevada Judiciary FY2024 Open Budget actuals by organization, program, and object · 673 rows", 673, 56114840.85],
  ["Nevada Legislature FY2024 Open Budget actuals by organization, program, and object · 146 rows", 146, 290953731.98],
  ["Montana Judiciary FY2024 accounts payable by expenditure category and account · 96 rows", 96, 13029601.76],
  ["Montana Legislature FY2024 accounts payable by expenditure category and account · 51 rows", 51, 5868201.90],
  ["North Dakota State Courts FY2024 payments by account · 28 rows", 28, 14079833.23],
  ["North Dakota Legislature FY2024 payments by agency and account · 38 rows", 38, 6189421.81],
  ["Texas Judiciary FY2024 cash expenditures by agency, fund, section, and use · 64 rows", 64, 168386924.83],
  ["Wyoming Judiciary FY2024 WyOpen spending by court, category, and description · 487 rows", 487, 7546260.88],
  ["Wyoming Legislature FY2024 WyOpen spending by category and description · 54 rows", 54, 2275566.31],
  ["Arkansas Legislature FY2024 transparency payments by agency and category · 22 rows", 22, 15626737.05],
  ["Arizona Judiciary FY2024 audited expenditure lines · 43 rows", 43, 179814326],
  ["Illinois Legislature FY2024 Comptroller expenditures by agency and object · 25 rows", 25, 141966870.71],
  ["New Mexico Judiciary FY2024 purchases by agency · 36 rows", 36, 50116102.86],
  ["Virginia Judiciary FY2024 expenditures by court, program, and category · 42 rows", 42, 373606042.49],
  ["Nebraska Judiciary FY2024 spending by expense and program · 372 rows", 372, 169908509.60],
  ["Nebraska Legislature FY2024 spending by expense and program · 110 rows", 110, 13307443.90],
  ["Oklahoma Judiciary FY2024 OMES postings by agency, account, and fund · 275 rows", 275, 119606586.44],
  ["Oklahoma Legislature FY2024 OMES postings by agency, account, and fund · 204 rows", 204, 50372178.31],
  ["Oregon Judiciary FY2024 payments by agency, budget class, and expenditure class · 126 rows", 126, 127956350.28],
  ["Oregon Legislature FY2024 payments by agency, budget class, and expenditure class · 239 rows", 239, 165512759.48],
  ["South Carolina Judiciary FY2024 payments by account and fund · 273 rows", 273, 29233492.95],
  ["South Carolina General Assembly FY2024 payments by chamber, account, and fund · 186 rows", 186, 13204714.54],
  ["Vermont Judiciary FY2024 vendor payments by account and fund · 233 rows", 233, 28579196.79],
  ["Vermont Legislature FY2024 vendor payments by agency, account, and fund · 91 rows", 91, 3792681.73],
  ["Washington Judiciary FY2024 vendor payments by agency and object · 119 rows", 119, 77529021.43],
  ["Washington Legislature FY2024 vendor payments by agency and object · 122 rows", 122, 26504088.35],
  ["Tennessee FY2024 Court System actual expenditures by program", 20, 185374100],
  ["North Carolina Judicial Branch FY2024 General Fund expenditures by service group", 6, 775164398.58],
  ["Alabama Legislature FY2024 checkbook payments by agency and category", 39, 88559117.99],
  ["Iowa Judicial Branch FY2024 actual expenditures by class", 32, 205368894],
  ["Kentucky Judicial Branch FY2024 General Fund disbursements by program", 49, 461232548],
  ["Maryland Judiciary FY2024 all-funds actuals by program", 11, 761126756],
  ["Alaska Judiciary FY2024 actual expenditures by budget component", 6, 135433600],
  ["Alaska Legislature FY2024 actual expenditures by budget component", 17, 73715100],
  ["Delaware FY2024 Judicial checkbook payments by expenditure category", 146, 157140897.42],
  ["Delaware FY2024 Legislative Branch checkbook payments by expenditure category", 81, 70464604.29],
  ["Florida State Courts FY2024 vendor payments by expenditure category · 83 rows", 83, 82625538.83],
  ["Maine Judicial Department FY2024 Open Checkbook payments by expenditure object", 102, 30903876.54],
  ["Maine Legislature and Law Library FY2024 Open Checkbook payments by expenditure object", 76, 5058411.17],
  ["Utah State Courts FY2024 General Fund actual expenditures by appropriation line item", 5, 209622000],
  ["Tennessee Legislature FY2024 actual expenditures by object", 19, 64184700],
  ["Louisiana Legislature FY2024 actual expenditures by agency", 6, 127719586],
  ["Louisiana court system 2024 expenses by court level and category", 19, 394353800]
]) {
  const rows = stateBranchBreakdowns.find((item) => item.title === title).rows;
  assert.equal(rows.length, count);
  assert.equal(cents(rows.reduce((sum, row) => sum + row[2], 0)), cents(total));
  assert.ok(rows.every((row) => Math.abs(row[2]) < 1e10));
}

// Every state keeps a restorable official ledger that reconciles to its own source total.
for (const [scope, summaryPath] of Object.entries(index)) {
  if (scope === "United States") continue;
  const summary = require(path.join(root, summaryPath));
  const snapshot = summary.departments[0].relatedSources?.find(([label, url]) =>
    label === "Prior state layer snapshot" && url.startsWith("data/"));
  assert.ok(snapshot, scope + " · official ledger snapshot");
  const restored = JSON.parse(fs.readFileSync(path.join(root, snapshot[1]), "utf8"));
  assert.equal(restored.coverageStatus, "official-itemized-source-basis", scope + " · restored source basis");
  assert.match(restored.sourceUrl, /^https:\/\//, scope + " · restored source link");
  assert.equal(cents(restored.itemizedTotal), cents(restored.sourceTotal), scope + " · restored itemized total");
  assert.equal(restored.reconciliation.itemizedDifference, 0, scope + " · restored reconciliation");
  assert.equal(restored.departments.reduce((sum, row) => sum + cents(row.amount), 0), cents(restored.sourceTotal), scope + " · restored source rows");
}
