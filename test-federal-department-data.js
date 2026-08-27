const assert = require("node:assert/strict");
const fs = require("node:fs");

const cents = (value) => Math.round(value * 100);
const federal = require("./data/federal/federal.js");
assert.equal(federal.coverageStatus, "treasury-complete-agency-program-basis");
assert.equal(federal.departments.reduce((sum, row) => sum + row.amount, 0), 6751552000000);
assert.ok(federal.departments.some((row) => row.id === "mts-agency-department-of-defense-military-programs"));
assert.ok(federal.departments.some((row) => row.id === "mts-agency-undistributed-offsetting-receipts" && row.amount < 0));
const federalDetails = federal.departments.filter((row) => row.detailUrl)
  .map((row) => JSON.parse(fs.readFileSync(row.detailUrl, "utf8")));
const accountResearch = federalDetails.filter((detail) => detail.accountResearch);
assert.equal(accountResearch.length, 29);
assert.equal(accountResearch.reduce((sum, detail) => sum + detail.accountResearch.accountCount, 0), 2190);
assert.equal(accountResearch.reduce((sum, detail) => sum + detail.largeAccountRows.length, 0), 326);
assert.ok(accountResearch.every((detail) => detail.largeAccountRows.every((row) => Math.abs(row[2]) >= 1e9)));
assert.ok(accountResearch.every((detail) => /^https:\/\/.+\.(?:xlsx|pdf)$/.test(detail.accountResearch.sourceUrl)));
const socialSecurity = accountResearch.find((detail) => detail.department === "Social Security Administration");
assert.ok(socialSecurity.largeAccountRows.some((row) => row[0] === "028-8006-000" && row[2] > 1e12));
const itemBreakdowns = federalDetails.flatMap((detail) => detail.itemBreakdowns || []);
assert.equal(itemBreakdowns.length, 18);
assert.equal(itemBreakdowns.reduce((sum, item) => sum + item.accountCount, 0), 322);
for (const item of itemBreakdowns) {
  assert.match(item.sourceUrl, /^https:\/\/.+(?:\.xlsx|interest_expense)/);
  assert.equal(item.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(item.parent[2]));
  assert.ok(item.rows.slice(0, -1).every((row, index, rows) => !index || Math.abs(rows[index - 1][2]) >= Math.abs(row[2])));
}
const supplementalBreakdowns = federalDetails.flatMap((detail) => detail.supplementalBreakdowns || []);
assert.equal(supplementalBreakdowns.length, 25);
for (const detail of federalDetails) {
  for (const item of detail.supplementalBreakdowns || []) {
    assert.ok(detail.rows.some((row) => row[0] === item.parent[0] && row[1] === item.parent[1]
      && cents(row[2]) === cents(item.parent[2])));
    assert.match(item.sourceUrl, /^https:\/\//);
    assert.ok(item.rows.every((row, index, rows) => !index || Math.abs(rows[index - 1][2]) >= Math.abs(row[2])));
  }
}
const sourceView = (title) => federalDetails.flatMap((detail) => [...(detail.sourceBreakdowns || []), ...(detail.supplementalBreakdowns || [])]).find((item) => item.title === title);
const arms = sourceView("FY2024 implemented arms transfers by destination and funding channel").rows;
assert.deepEqual([arms.length, arms.reduce((sum, row) => sum + row[2], 0), arms.filter((row) => Math.abs(row[2]) >= 1e10).length], [162, 108674657675, 2]);
const polandFms = sourceView("Poland 2024 signed FMS agreements with published package values").rows;
assert.deepEqual([polandFms.length, polandFms.reduce((sum, row) => sum + row[2], 0)], [4, 14225000000]);
assert.match(polandFms[0][1], /rounded public package ceiling/);
const apacheNotification = sourceView("Poland Apache notification estimate by statutory value class").rows;
assert.deepEqual([apacheNotification.length, apacheNotification.reduce((sum, row) => sum + row[2], 0)], [2, 12000000000]);
assert.ok(apacheNotification.every((row) => Math.abs(row[2]) < 1e10));
const israelF15 = sourceView("Israel F-15 notification estimate by statutory value class").rows;
assert.deepEqual([israelF15.length, israelF15.reduce((sum, row) => sum + row[2], 0)], [2, 18820000000]);
assert.ok(israelF15.every((row) => Math.abs(row[2]) < 1e10));
const turkiyeF16 = sourceView("Türkiye F-16 notification estimate by statutory value class").rows;
assert.deepEqual([turkiyeF16.length, turkiyeF16.reduce((sum, row) => sum + row[2], 0)], [2, 23000000000]);
assert.equal(turkiyeF16.filter((row) => Math.abs(row[2]) > 1e10).length, 1);
assert.match(turkiyeF16[0][1], /public disclosure ceiling/);
const currentTurkiyeF16 = sourceView("Türkiye current F-16 package estimate after scope reduction").rows;
assert.deepEqual([currentTurkiyeF16.length, currentTurkiyeF16[0][2]], [1, 7000000000]);
assert.match(currentTurkiyeF16[0][1], /\$1\.4B initial payment disclosed/);
const marketplaceAptc = sourceView("CMS February 2024 Marketplace advance premium tax credit by state");
assert.deepEqual([marketplaceAptc.rows.length, marketplaceAptc.rows.reduce((sum, row) => sum + row[2], 0)], [51, 10346293507]);
assert.ok(marketplaceAptc.rows.every((row) => Math.abs(row[2]) < 1e10));
const eitcByState = sourceView("IRS tax-year 2023 net EITC by state");
assert.deepEqual([eitcByState.rows.length, eitcByState.rows.reduce((sum, row) => sum + row[2], 0)], [52, 63677000000]);
assert.ok(eitcByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const refundableCtcByAgi = sourceView("IRS tax-year 2023 refundable child tax credit by adjusted gross income");
assert.deepEqual([refundableCtcByAgi.rows.length, refundableCtcByAgi.rows.reduce((sum, row) => sum + row[2], 0)], [14, 32064279000]);
assert.ok(refundableCtcByAgi.rows.every((row) => Math.abs(row[2]) < 1e10));
const specialEducationByState = sourceView("ED FY2024 special-education formula allocations by state and area");
assert.deepEqual([specialEducationByState.rows.length, specialEducationByState.rows.reduce((sum, row) => sum + row[2], 0)], [59, 15153704000]);
assert.ok(specialEducationByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const pellByState = sourceView("ED FY2024 estimated Pell Grants by state and area");
assert.deepEqual([pellByState.rows.length, pellByState.rows.reduce((sum, row) => sum + row[2], 0)], [57, 35498000000]);
assert.ok(pellByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const localEducationGrants = sourceView("ED FY2024 Grants to Local Educational Agencies by state and area");
assert.deepEqual([localEducationGrants.rows.length, localEducationGrants.rows.reduce((sum, row) => sum + row[2], 0)], [59, 18406802000]);
assert.ok(localEducationGrants.rows.every((row) => Math.abs(row[2]) < 1e10));
const vouchersByState = sourceView("HUD 2024 Housing Choice Voucher renewal eligibility by state and territory");
assert.deepEqual([vouchersByState.rows.length, vouchersByState.rows.reduce((sum, row) => sum + row[2], 0)], [55, 26625444529]);
assert.ok(vouchersByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const disasterReliefByMonth = sourceView("FEMA FY2024 DRF obligations by month");
assert.deepEqual([disasterReliefByMonth.rows.length, disasterReliefByMonth.rows.reduce((sum, row) => sum + row[2], 0)], [12, 39066000000]);
assert.ok(disasterReliefByMonth.rows.every((row) => Math.abs(row[2]) < 1e10));
const catastrophicDisasters = sourceView("FEMA FY2024 catastrophic DRF obligations by declaration and geography");
assert.deepEqual([catastrophicDisasters.rows.length, catastrophicDisasters.rows.reduce((sum, row) => sum + row[2], 0)], [112, 33234000000]);
assert.ok(catastrophicDisasters.rows.every((row) => Math.abs(row[2]) < 1e10));
const transitByState = sourceView("FTA FY2024 full-year formula apportionments by state and territory");
assert.deepEqual([transitByState.rows.length, transitByState.rows.reduce((sum, row) => sum + row[2], 0)], [56, 14000572837]);
assert.ok(transitByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const ccdfByRecipient = sourceView("ACF grant-year 2024 CCDF federal allocations by recipient and support use");
assert.deepEqual([ccdfByRecipient.rows.length, ccdfByRecipient.rows.reduce((sum, row) => sum + row[2], 0)], [62, 12208923130]);
assert.ok(ccdfByRecipient.rows.every((row) => Math.abs(row[2]) < 1e10));
const tanfByState = sourceView("ACF FY2024 federal TANF expenditures by state");
assert.equal(tanfByState.rows.length, 51);
assert.ok(Math.abs(tanfByState.rows.reduce((sum, row) => sum + row[2], 0) - 14432059408.98) < 0.01);
assert.ok(tanfByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const chipByState = sourceView("CMS FY2024 federal CHIP share by state and territory");
assert.deepEqual([chipByState.rows.length, chipByState.rows.reduce((sum, row) => sum + row[2], 0)], [56, 20018974226]);
assert.ok(chipByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const hrsaByProgram = sourceView("HRSA FY2024 awarded grants by program");
assert.deepEqual([hrsaByProgram.rows.length, hrsaByProgram.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [235, cents(11295901925.2)]);
assert.ok(hrsaByProgram.rows.every((row) => Math.abs(row[2]) < 1e10));
const cdcByProgram = sourceView("CDC FY2024 final program funding by operating-plan program");
assert.deepEqual([cdcByProgram.rows.length, cdcByProgram.rows.reduce((sum, row) => sum + row[2], 0)], [14, 9217495000]);
assert.ok(cdcByProgram.rows.every((row) => Math.abs(row[2]) < 1e10));
const fbiByObjectClass = sourceView("FBI FY2024 actual obligations by object class");
assert.deepEqual([fbiByObjectClass.rows.length, fbiByObjectClass.rows.reduce((sum, row) => sum + row[2], 0)], [24, 10833388000]);
assert.ok(fbiByObjectClass.rows.every((row) => Math.abs(row[2]) < 1e10));
const uiBenefitsByState = sourceView("DOL ETA FY2024 state unemployment benefits paid by jurisdiction");
assert.deepEqual([uiBenefitsByState.rows.length, uiBenefitsByState.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [53, cents(36689746284.69)]);
assert.ok(uiBenefitsByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const pbgcSfaByPlan = sourceView("PBGC FY2024 Special Financial Assistance payments by pension plan");
assert.deepEqual([pbgcSfaByPlan.rows.length, pbgcSfaByPlan.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [27, cents(14638485324.16)]);
assert.ok(pbgcSfaByPlan.rows.every((row) => Math.abs(row[2]) < 1e10));
const netPtc = sourceView("IRS tax-year 2023 net premium tax credit by adjusted gross income");
assert.deepEqual([netPtc.rows.length, netPtc.rows.reduce((sum, row) => sum + row[2], 0)], [13, 2648231000]);
assert.ok(netPtc.rows.every((row) => Math.abs(row[2]) < 1e10));
const highways = sourceView("FHWA FY2024 federal-fund obligations by geography").rows;
assert.deepEqual([highways.length, highways.reduce((sum, row) => sum + row[2], 0)], [56, 64455978000]);
assert.ok(highways.every((row) => Math.abs(row[2]) < 1e10));
const highwayExpenditures = sourceView("FHWA FY2024 Federal-Aid Account expenditures by state").rows;
assert.deepEqual([highwayExpenditures.length, highwayExpenditures.reduce((sum, row) => sum + row[2], 0)], [51, 44150336000]);
assert.ok(highwayExpenditures.every((row) => Math.abs(row[2]) < 1e10));
for (const check of [["Army 2020A FY2024 O&M obligations by budget line", 60, 63912381000, 0], ["Navy 1804N FY2024 O&M obligations by budget line", 81, 74666505000, 0], ["Marine Corps 1106N FY2024 O&M obligations by budget line", 30, 10264362000, 0], ["Air Force 3400F FY2024 O&M obligations by budget line", 58, 62834029000, 0], ["Army FY2024 procurement actuals by P-1 budget activity", 17, 40057534000, 0], ["Navy and Marine Corps FY2024 procurement actuals by P-1 budget activity", 51, 84046939000, 0], ["Air Force and Space Force FY2024 procurement actuals by P-1 budget activity", 36, 66444991000, 1], ["Defense-Wide FY2024 procurement actuals by P-1 budget activity", 6, 14047824000, 0]]) {
  const rows = sourceView(check[0]).rows; assert.deepEqual([rows.length, rows.reduce((sum, row) => sum + row[2], 0), rows.filter((row) => Math.abs(row[2]) >= 1e10).length], check.slice(1));
}
assert.equal(sourceView("FY2024 FMF disbursements by recipient").rows.reduce((sum, row) => sum + row[2], 0), 11908012983);
const snap = sourceView("FNS-reported FY2024 SNAP benefits by geography and month");
assert.equal(snap.rows.reduce((sum, row) => sum + row[2], 0), 93475887992);
assert.ok(snap.rows.every((row) => Math.abs(row[2]) < 1e10));
const childNutrition = sourceView("FNS FY2024 Child Nutrition costs by program and geography");
assert.equal(childNutrition.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(28391968503.44));
assert.ok(childNutrition.rows.every((row) => Math.abs(row[2]) < 1e10));
const medicaid = sourceView("CMS-64 FY2024 federal Medicaid share by state and service");
assert.equal(medicaid.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(612391730046));
assert.equal(medicaid.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 13);
assert.ok(medicaid.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public annual disclosure ceiling/.test(row[1])));
const caDrugQuarters = sourceView("California CY2024 Medicaid drug reimbursements by quarter").rows;
assert.equal(cents(caDrugQuarters.reduce((sum, row) => sum + row[2], 0)), cents(15506717427.98));
assert.ok(caDrugQuarters.every((row) => Math.abs(row[2]) < 1e10));
assert.equal(cents(sourceView("California CY2024 largest disclosed Medicaid drug products").rows
  .reduce((sum, row) => sum + row[2], 0)), cents(2618545457.50));
assert.equal(sourceView("OASI benefits by beneficiary type").rows.reduce((sum, row) => sum + row[2], 0), 1316424000000);
assert.equal(sourceView("DI benefits by beneficiary type").rows.reduce((sum, row) => sum + row[2], 0), 154983000000);
assert.deepEqual(sourceView("Direct Consolidation Loan FY2024 gross-disbursement ceiling").rows,
  [["Consolidation", "Gross consolidation flow · public national disclosure ceiling", 62156000000]]);
const directLoanStates = sourceView("Direct Loan FY2024 COD new-loan disbursements by institution state and loan type");
assert.deepEqual([directLoanStates.rows.length, directLoanStates.rows.reduce((sum, row) => sum + row[2], 0)], [274, 85964314733]);
assert.ok(directLoanStates.rows.every((row) => Math.abs(row[2]) < 1e10));
const educationRelief = sourceView("Education Stabilization Fund FY2024 gross outlays by program and ESSER prime-recipient state");
assert.equal(educationRelief.rows.length, 60);
assert.equal(cents(educationRelief.rows.reduce((sum, row) => sum + row[2], 0)), cents(55516156490.37));
assert.ok(educationRelief.rows.every((row) => Math.abs(row[2]) < 1e10));
const medicareGeography = sourceView("Original Medicare FY2024 claim payments by geography");
assert.deepEqual([medicareGeography.rows.length, medicareGeography.rows.reduce((sum, row) => sum + row[2], 0)], [164, 377094873261]);
assert.ok(medicareGeography.rows.every((row) => Math.abs(row[2]) < 1e10));
assert.ok(sourceView("Selected FY2024 major-arms notifications").rows
  .every((row) => row[2] >= 1e9 && /^https:\/\//.test(row[3])));
assert.equal(cents(sourceView("House FY2024 disbursements by expense category").rows
  .reduce((sum, row) => sum + row[2], 0)), cents(1889796892.35));
assert.equal(cents(sourceView("Senate FY2024 expenditures by appropriation").rows
  .reduce((sum, row) => sum + row[2], 0)), cents(1227661445.97));
const judicialPbd = sourceView("OMB FY2024 Judicial Branch outlays by account");
assert.equal(cents(judicialPbd.rows.reduce((sum, row) => sum + row[2], 0)), cents(9480000000));
assert.ok(judicialPbd.rows.every((row) => Math.abs(row[2]) < 1e10));
const negativeBreakdowns = itemBreakdowns.filter((item) => item.parent[2] < 0);
assert.equal(negativeBreakdowns.length, 11);
assert.equal(negativeBreakdowns.reduce((sum, item) => sum + item.accountCount, 0), 202);
assert.ok(negativeBreakdowns.every((item) => item.sourceUrl.endsWith("/tbb.xlsx")
  && /negative offsets/.test(item.basis)));
const education = federalDetails.find((detail) => detail.department === "Department of Education");
assert.ok(education.itemBreakdowns[0].rows.some((row) => row[0] === "091-0251-000" && row[2] > 55e9));
const treasuryInterest = itemBreakdowns.filter((item) => /Interest on Treasury Debt Securities/.test(item.parent[0]));
assert.equal(treasuryInterest.length, 2);
assert.ok(treasuryInterest.every((item) => /Fiscal Data/.test(item.rowPrefix)));
const judiciary = federalDetails.find((detail) => detail.department === "Judicial Branch");
assert.equal(judiciary.itemBreakdowns[0].accountCount, 8);
assert.ok(judiciary.itemBreakdowns[0].rows.every((row) => Math.abs(row[2]) < 1e10));
const hhs = federalDetails.find((detail) => detail.department === "Department of Health and Human Services");
assert.ok(hhs.rows.some((row) => row[0] === "Centers for Medicare and Medicaid Services" && row[1] === "Other" && row[2] === 12389000000));
assert.ok(hhs.itemBreakdowns.some((item) =>
  item.rows.some((row) => row[0] === "075-0849-000" && row[2] > 7e9)));
assert.ok(hhs.itemBreakdowns.some((item) => item.parent[2] === -478323000000
  && item.rows.some((row) => row[0] === "075-X-8004-001" && row[2] < -375e9)));
const agriculture = federalDetails.find((detail) => detail.department === "Department of Agriculture");
assert.ok(agriculture.rows.some((row) => row[0] === "Department of Agriculture" && row[1] === "Other" && row[2] === 10403000000));
const state = federalDetails.find((detail) => detail.department === "Department of State");
assert.ok(state.rows.some((row) => row[0] === "Department of State" && row[1] === "International Organizations and Conferences"));
const otherDefense = federalDetails.find((detail) => detail.department === "Other Defense Civil Programs");
assert.ok(otherDefense.rows.some((row) => row[0] === "Other Defense Civil Programs"
  && row[1] === "Intrabudgetary Transactions" && row[2] === -179813000000));
assert.ok(otherDefense.itemBreakdowns[0].rows.some((row) => row[0] === "097-X-8097-003"
  && row[2] === -151521000000));
const health = accountResearch.find((detail) => detail.department === "Department of Health and Human Services");
assert.ok(health.rows.some((row) => row[0] === health.department && row[1] === "Proprietary Receipts from the Public"));
assert.ok(health.rows.some((row) => row[0].startsWith("Intrabudgetary Transactions › ")));
const congress = JSON.parse(fs.readFileSync("data/federal/archive-agency-source/federal-congress.json", "utf8"));
assert.equal(congress.session, "118th Congress, second session");
assert.ok(congress.rows.some((row) => /PERSONNEL COMPENSATION/.test(row[1])));
const courts = JSON.parse(fs.readFileSync("data/federal/archive-agency-source/federal-federal-courts.json", "utf8"));
assert.equal(courts.sourceTotal, 10543466479.98);
assert.ok(courts.rows.some((row) => /Fees of jurors/.test(row[1])));
const indiana = require("./data/state-in/state-in.js");
assert.equal(indiana.sourceTotal, 57569279000);
assert.equal(indiana.itemizedTotal, 57569279000);
const archivedIndiana = require("./data/state-in/archive-state-source/state-in-official-source-summary.json");
assert.equal(archivedIndiana.reconciliation.sourceRows, 37980);
assert.equal(archivedIndiana.reconciliation.sourceGroups, 37976);
assert.equal(archivedIndiana.sourceTotal, 59513417253.4);
assert.equal(archivedIndiana.reconciliation.normalized, false);

const html = fs.readFileSync("index.html", "utf8");
assert.match(html, /data\/department-index\.js/);
assert.match(html, /department-loader\.js/);
assert.match(html, /data\/state-ledger-totals\.js/);
assert.doesNotMatch(html, /data\/(?:federal|state-[a-z]{2})\/(?:federal|state-[a-z]{2})\.js/);
assert.doesNotMatch(html, /data\/state-(?:al|ar|ca|ks|me|ne|nv|sc|vt)\.js/);
assert.doesNotMatch(html, /data\/federal-(?:agencies|object-classes|expansion|programs|usda)\.js/);
assert.match(html, /data-allocation-source="itemized"/);
assert.match(html, /data-allocation-source="function"/);
assert.match(html, /data-allocation-source="archive"/);

const app = fs.readFileSync("app.js", "utf8") + fs.readFileSync("fiscal-panel.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8") + fs.readFileSync("details.css", "utf8");
const browserModel = fs.readFileSync("model.js", "utf8");
assert.match(browserModel, /FederalSourceResearch/);
assert.match(app, /allocationSource: "itemized"/, "federal viewer defaults to reconciled agencies");
assert.match(app, /state\.allocationSource = state\.layer === "federal" \? "itemized" : "financial"/,
  "scope changes restore the matching federal or state view");
assert.match(app, /async function allocationSummary/);
assert.match(app, /Prior state layer snapshot/);
assert.match(app, /federal-official-source-summary\.json/);
assert.match(app, /federalResearchCatalog/);
assert.match(app, /mapMetric\(name, "stateGovernment", "balance", "financial"\)/);
assert.match(app, /department\.program/);
assert.match(app, /comparisonLabel/);
assert.match(app, /Math\.max\(row\.amount, 0\)/);
assert.match(app, /shareLabel\(department\)/);
const federalPresentationProblems = [];
if (!/\)\)\.sort\(\(a, b\) => b\.chartAmount - a\.chartAmount/.test(app)) {
  federalPresentationProblems.push("federal categories are not ranked");
}
if (!/\.agency-row\s*>\s*b\s*\{[^}]*text-align:\s*right[^}]*font-variant-numeric:\s*tabular-nums/s.test(styles)) {
  federalPresentationProblems.push("itemized amounts do not share a right-aligned tabular column");
}
assert.deepEqual(federalPresentationProblems, []);
const georgia = require("./data/state-ga/state-ga.js");
assert.equal(georgia.coverageStatus, "census-complete-function-basis");
const archivedGeorgiaSalary = JSON.parse(fs.readFileSync("data/state-ga/archive-state-source/state-ga-salary-travel.json", "utf8"));
assert.equal(archivedGeorgiaSalary.sourceCheck.combinedTotal, 23664401260.99);
assert.match(app, /department\.relatedSources/);
assert.match(app, /relatedSources\.map\(\(\[label, link\]\)/);
const illinois = require("./data/state-il/state-il.js");
assert.ok(illinois.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-il/archive-state-source/state-il-official-source-summary.json")));
const illinoisObjects = JSON.parse(fs.readFileSync("data/state-il/archive-state-source/state-il-object-categories.json", "utf8"));
assert.equal(illinoisObjects.rows.length, 156);
assert.equal(illinoisObjects.sourceTotal, 270835812095.37);
assert.equal(illinoisObjects.nonAdditive, true);
const alabama = require("./data/state-al/state-al.js");
assert.ok(alabama.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-al/archive-state-source/state-al-official-source-summary.json")));
const alabamaCategories = JSON.parse(fs.readFileSync("data/state-al/archive-state-source/state-al-category-context.json", "utf8"));
assert.equal(alabamaCategories.rows.length, 16);
assert.equal(alabamaCategories.sourceTotal, 47530291944.47);
assert.equal(alabamaCategories.nonAdditive, true);
const minnesota = require("./data/state-mn/state-mn.js");
assert.ok(minnesota.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-mn/archive-state-source/state-mn-official-source-summary.json")));
const minnesotaPayroll = JSON.parse(fs.readFileSync("data/state-mn/archive-state-source/state-mn-payroll.json", "utf8"));
assert.equal(minnesotaPayroll.sourceTotal, 4589764963.19);
assert.equal(minnesotaPayroll.sourceCheck.componentDifference, 0);
assert.equal(minnesotaPayroll.nonAdditive, true);
const tennessee = require("./data/state-tn/state-tn.js");
assert.equal(tennessee.coverageStatus, "census-complete-function-basis");
const oregon = require("./data/state-or/state-or.js");
assert.equal(oregon.departments.length, 4);
assert.equal(oregon.sourceTotal, 53634034000);
assert.equal(require("./data/state-or/archive-state-source/state-or-official-source-summary.json").sourceTotal, 31836364350.07);
const newYork = require("./data/state-ny/state-ny.js");
assert.equal(newYork.departments.length, 4);
assert.equal(newYork.sourceTotal, 266597110000);
assert.equal(require("./data/state-ny/archive-state-source/state-ny-official-source-summary.json").sourceTotal, 147994518447.47);
const newJersey = require("./data/state-nj/state-nj.js");
assert.equal(newJersey.departments.length, 4);
assert.equal(newJersey.sourceTotal, 97187747000);
assert.equal(require("./data/state-nj/archive-state-source/state-nj-official-source-summary.json").sourceTotal, 92104245771.78);
const archivedTennesseeFunctions = JSON.parse(fs.readFileSync("data/state-tn/archive-state-source/state-tn-acfr-functions.json", "utf8"));
assert.equal(archivedTennesseeFunctions.sourceTotal, 47759686000);
assert.equal(archivedTennesseeFunctions.sourceCheck.difference, 0);
