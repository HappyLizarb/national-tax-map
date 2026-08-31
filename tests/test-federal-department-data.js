const assert = require("node:assert/strict");
const fs = require("node:fs");
const model = require("../src/model.js");

const cents = (value) => Math.round(value * 100);
const federal = require("../data/federal/federal.js");
assert.equal(federal.coverageStatus, "treasury-complete-agency-program-basis");
assert.equal(federal.departments.reduce((sum, row) => sum + row.amount, 0), 6751552000000);
assert.ok(federal.departments.some((row) => row.id === "mts-agency-department-of-defense-military-programs"));
assert.ok(federal.departments.some((row) => row.id === "mts-agency-undistributed-offsetting-receipts" && row.amount < 0));
assert.ok(federal.departments.find((row) => row.id === "mts-agency-independent-agencies").relatedSources
  .some(([, url]) => url === "data/federal/archive-agency-source/federal-federal-deposit-insurance-corporation.json"));
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
assert.equal(supplementalBreakdowns.length, 24);
for (const detail of federalDetails) {
  for (const item of detail.supplementalBreakdowns || []) {
    assert.ok(detail.rows.some((row) => row[0] === item.parent[0] && row[1] === item.parent[1]
      && cents(row[2]) === cents(item.parent[2])));
    assert.match(item.sourceUrl, /^https:\/\//);
  }
}
const sourceViews = federalDetails.flatMap((detail) => [...(detail.sourceBreakdowns || []), ...(detail.supplementalBreakdowns || [])]);
const allBreakdowns = federalDetails.flatMap((detail) => [...(detail.itemBreakdowns || []),
  ...(detail.sourceBreakdowns || []), ...(detail.supplementalBreakdowns || [])]);
assert.ok(allBreakdowns.every((item) => item.rows.filter((row) => row[2]).length !== 1));
assert.ok(sourceViews.every((item) => item.rows.every((row, index, rows) => !index || rows[index - 1][2] >= row[2])));
const accountLabel = (row) => String(row[1]).replace(/ · [^·]*ceiling(?: ·.*)?$/i, "");
const sameAccount = (left, right) => left[0] === right[0] && accountLabel(left) === accountLabel(right)
  && cents(left[2]) === cents(right[2]);
const hasExactDisplayBreakdown = (detail, parent) => [
  ...(detail.itemBreakdowns || []), ...(detail.sourceBreakdowns || []), ...(detail.supplementalBreakdowns || [])]
  .some((panel) => {
    const rows = panel.rows.reduce((sum, row) => sum + cents(row[2]), 0);
    const displayParent = panel.displayParent || panel.parent;
    if (displayParent && sameAccount(displayParent, parent)) return rows === cents(parent[2]);
    const covers = (panel.covers || []).reduce((sum, row) => sum + cents(row[2]), 0);
    return panel.covers?.length === 1 && rows === covers && sameAccount(panel.covers[0], parent);
  });
const hasExactSourceBreakdown = (detail, parent) => [...(detail.sourceBreakdowns || []),
  ...(detail.supplementalBreakdowns || [])].some((item) => item.covers?.some((row) => sameAccount(row, parent))
    && item.rows.reduce((sum, row) => sum + cents(row[2]), 0)
      === item.covers.reduce((sum, row) => sum + cents(row[2]), 0));
const tenBillionAccountRows = accountResearch.flatMap((detail) => detail.largeAccountRows
  .filter((row) => Math.abs(row[2]) >= 1e10).map((row) => [detail, row]));
assert.equal(tenBillionAccountRows.length, 85);
assert.ok(tenBillionAccountRows.every(([detail, row]) => hasExactSourceBreakdown(detail, row)));
const billionAccountRows = accountResearch.flatMap((detail) => detail.largeAccountRows.map((row) => [detail, row]));
assert.equal(billionAccountRows.filter(([detail, row]) => hasExactSourceBreakdown(detail, row)).length, 260);
assert.equal(billionAccountRows.filter(([, row]) => /publication ceiling/i.test(row[1])).length, 66);
assert.ok(billionAccountRows.every(([detail, row]) => hasExactSourceBreakdown(detail, row)
  || /publication ceiling/i.test(row[1])));
assert.ok(itemBreakdowns.filter((item) => item.accountCount === 1).every((item) => {
  const detail = federalDetails.find((candidate) => candidate.itemBreakdowns?.includes(item));
  return item.rows.filter((row) => row[0] !== "MTS-rounding")
    .every((row) => hasExactSourceBreakdown(detail, row));
}));
const availabilityBreakdowns = sourceViews.filter((item) => item.combinedStatementAvailability);
assert.equal(availabilityBreakdowns.length, 234);
assert.equal(availabilityBreakdowns.filter((item) => item.rows.every((row) => Math.abs(row[2]) <= 1e10)).length, 194);
for (const item of availabilityBreakdowns) {
  assert.ok(item.rows.filter((row) => row[2]).length > 1);
  assert.equal(item.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(item.sourceTotal));
  assert.equal(item.covers.reduce((sum, row) => sum + cents(row[2]), 0), cents(item.sourceTotal));
}
const billionAvailabilityRows = accountResearch.flatMap((detail) => [
  ...(detail.sourceBreakdowns || []), ...(detail.supplementalBreakdowns || [])]
  .filter((item) => item.combinedStatementAvailability)
  .flatMap((item) => item.rows.filter((row) => Math.abs(row[2]) >= 1e9).map((row) => [detail, row])));
assert.equal(billionAvailabilityRows.length, 327);
assert.equal(billionAvailabilityRows.filter(([detail, row]) => hasExactSourceBreakdown(detail, row)).length, 49);
assert.equal(billionAvailabilityRows.filter(([, row]) => /publication ceiling/i.test(row[1])).length, 278);
assert.ok(billionAvailabilityRows.every(([detail, row]) => hasExactSourceBreakdown(detail, row)
  || /publication ceiling/i.test(row[1])));
const sourceView = (title) => sourceViews.find((item) => item.title === title);
const dodea = sourceView("DoD Dependents Education FY2024 actuals by budget-activity subactivity");
assert.deepEqual([dodea.rows.length, dodea.rows.reduce((sum, row) => sum + row[2], 0)],
  [9, 3535269000]);
assert.equal(dodea.rows.filter((row) => Math.abs(row[2]) >= 1e9).length, 1);
assert.match(dodea.rows.find((row) => Math.abs(row[2]) >= 1e9)[1], /official publication ceiling/);
const hrsaPrograms = sourceView("HRSA FY2024 awarded grants by program");
assert.deepEqual([hrsaPrograms.rows.length, cents(hrsaPrograms.rows.reduce((sum, row) => sum + row[2], 0))],
  [235, cents(11295901925.2)]);
assert.equal(hrsaPrograms.rows.reduce((sum, row) =>
  sum + Number(row[1].match(/across ([\d,]+) awards?/)?.[1].replaceAll(",", "") || 0), 0), 6478);
const hrsaAwardDepth = sourceViews.filter((panel) => panel.dataset === "hrsa-fy2024-award-depth");
assert.deepEqual(hrsaAwardDepth.map((panel) => panel.rows.length), [1360, 59]);
assert.ok(hrsaAwardDepth.flatMap((panel) => panel.rows).every((row) => Math.abs(row[2]) < 1e9));
const browserBillionRows = federalDetails.flatMap((detail) => {
  const panels = ["itemBreakdowns", "sourceBreakdowns", "supplementalBreakdowns"].flatMap((name) => detail[name] || []);
  const rows = [...(detail.rows || []), ...(detail.largeAccountRows || []), ...(detail.supplementalRows || []),
    ...panels.flatMap((panel) => panel.rows)];
  return rows.filter((row) => Math.abs(row[2]) >= 1e9).map((row) => [detail, row]);
});
const exactBrowserRows = browserBillionRows.filter(([detail, row]) => hasExactDisplayBreakdown(detail, row));
const ceilingBrowserRows = browserBillionRows.filter(([detail, row]) =>
  /ceiling/i.test(model.displayAccountDescription(detail, row)));
assert.deepEqual([browserBillionRows.length, exactBrowserRows.length, ceilingBrowserRows.length], [2266, 492, 1774]);
assert.ok(browserBillionRows.every(([detail, row]) => hasExactDisplayBreakdown(detail, row)
  || /ceiling/i.test(model.displayAccountDescription(detail, row))));
const cmsDepth = sourceViews.filter((panel) =>
  panel.dataset === "cms-fy2024-medicaid-federal-share-depth");
assert.deepEqual([cmsDepth.length, cmsDepth.flatMap((panel) => panel.rows).length,
  cmsDepth.filter((panel) => panel.rows.every((row) => Math.abs(row[2]) < 1e9)).length,
  cmsDepth.flatMap((panel) => panel.rows).filter((row) => Math.abs(row[2]) >= 1e9).length],
  [50, 3822, 32, 24]);
assert.ok(cmsDepth.every((panel) => panel.rows.reduce((sum, row) => sum + cents(row[2]), 0)
  === cents(panel.sourceTotal)));
const epaAwards = sourceView("EPA FY2024 Exchange Network awards by recipient");
assert.deepEqual([epaAwards.rows.length, epaAwards.rows.reduce((sum, row) => sum + row[2], 0)], [33, 9214647]);
assert.deepEqual(epaAwards.rows.at(-1), ["Published tribal subtotal adjustment",
  "Unassigned difference between EPA's 13 visible tribal awards and its published tribal subtotal", 45091]);
const implementedArms = sourceView("FY2024 implemented arms transfers by destination and funding channel");
const arms = implementedArms.rows;
assert.deepEqual([arms.length, arms.reduce((sum, row) => sum + row[2], 0), arms.filter((row) => Math.abs(row[2]) >= 1e10).length], [162, 108674657675, 2]);
assert.deepEqual(implementedArms.parent, ["Military Sales Program", "Foreign Military Sales Trust Fund", 48726000000]);
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
const marketplaceAptc = sourceView("CMS February 2024 Marketplace advance premium tax credit by state");
assert.deepEqual([marketplaceAptc.rows.length, marketplaceAptc.rows.reduce((sum, row) => sum + row[2], 0)], [51, 10346293507]);
assert.ok(marketplaceAptc.rows.every((row) => Math.abs(row[2]) < 1e10));
const eitcByState = sourceView("IRS tax-year 2023 net EITC by state");
assert.deepEqual([eitcByState.rows.length, eitcByState.rows.reduce((sum, row) => sum + row[2], 0)], [52, 63677000000]);
assert.ok(eitcByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const refundableCtcByAgi = sourceView("IRS tax-year 2023 refundable child tax credit by adjusted gross income");
assert.deepEqual([refundableCtcByAgi.rows.length, refundableCtcByAgi.rows.reduce((sum, row) => sum + row[2], 0)], [14, 32064279000]);
assert.ok(refundableCtcByAgi.rows.every((row) => Math.abs(row[2]) < 1e10));
const creditInterestPaid = sourceView("Treasury FY2024 interest received from credit-financing accounts by payer");
assert.deepEqual([creditInterestPaid.rows.length,
  creditInterestPaid.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [61, cents(-47714213250.55)]);
assert.deepEqual(creditInterestPaid.covers,
  [["020-1499-000", "Interest Received from Credit Reform Financing Accounts", -47714213250.55]]);
assert.deepEqual(creditInterestPaid.rows.filter((row) => Math.abs(row[2]) >= 1e10).map((row) => row[0]),
  ["FEDERAL DIRECT STUDENT LOAN PROGRAM FINANCING ACCOUNT"]);
assert.match(creditInterestPaid.rows.at(-1)[1], /public OMB\/FSA account-level disclosure ceiling/);
const creditInterest = sourceView("OMB FY2024 credit-financing interest received by financing account");
assert.deepEqual([creditInterest.rows.length, creditInterest.rows.reduce((sum, row) => sum + row[2], 0)], [61, 10245000000]);
assert.deepEqual(creditInterest.rows[0], ["FEDERAL DIRECT STUDENT LOAN PROGRAM FINANCING ACCOUNT",
  "FY2024 actual interest received · OMB account 091-4253-0-3-502", 5436000000]);
assert.ok(creditInterest.rows.every((row) => Math.abs(row[2]) < 1e10));
const specialEducationByState = sourceView("ED FY2024 special-education formula allocations by state and area");
assert.deepEqual([specialEducationByState.rows.length, specialEducationByState.rows.reduce((sum, row) => sum + row[2], 0)], [59, 15173704000]);
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
const hudRenewalBridge = sourceView("HUD Contract Renewals from state eligibility");
assert.deepEqual([hudRenewalBridge.rows.length, hudRenewalBridge.rows.reduce((sum, row) => sum + row[2], 0)],
  [2, 25216200134]);
assert.deepEqual(vouchersByState.covers, [hudRenewalBridge.rows[0]]);
const hudTenantOutlays = sourceView("HUD Tenant-Based Rental Assistance no-year fund resources by program activity");
assert.deepEqual([hudTenantOutlays.rows.length, cents(hudTenantOutlays.rows.reduce((sum, row) => sum + row[2], 0))],
  [12, cents(32741073747.46)]);
assert.equal(hudTenantOutlays.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
const hudProjectOutlays = sourceView("HUD Project-Based Rental Assistance no-year fund resources by program activity");
assert.deepEqual([hudProjectOutlays.rows.length, cents(hudProjectOutlays.rows.reduce((sum, row) => sum + row[2], 0))],
  [8, cents(15574107196.27)]);
const hudProjectRenewals = sourceView("HUD Project-Based Rental Assistance contract renewals by object class");
assert.deepEqual([hudProjectRenewals.rows.length, cents(hudProjectRenewals.rows.reduce((sum, row) => sum + row[2], 0))],
  [2, cents(12928069248.91)]);
assert.deepEqual(hudProjectRenewals.covers[0], hudProjectOutlays.rows[0]);
const hudProjectAwards = sourceView("HUD Project-Based Rental Assistance contract-renewal grants by place of performance");
assert.deepEqual([hudProjectAwards.rows.length, cents(hudProjectAwards.rows.reduce((sum, row) => sum + row[2], 0))],
  [56, cents(12914818968.53)]);
assert.deepEqual(hudProjectAwards.covers, [hudProjectRenewals.rows[0]]);
assert.ok(hudProjectAwards.rows.every((row) => Math.abs(row[2]) < 1e10));
const hudRenewals = sourceView("USAspending FY2024 HUD Contract Renewals gross outlays by Treasury account");
assert.deepEqual([hudRenewals.rows.length, cents(hudRenewals.rows.reduce((sum, row) => sum + row[2], 0))],
  [2, cents(38144269382.91)]);
assert.match(hudRenewals.rows[0][1], /public TAS disclosure ceiling/);
assert.deepEqual(hudProjectRenewals.covers[1], hudRenewals.rows[1].slice(0, 3));
const fhaMmiCashFlows = sourceView("FHA MMI Fund FY2024 business-operations cash flows by quarter and type");
assert.deepEqual([fhaMmiCashFlows.rows.length, fhaMmiCashFlows.rows.reduce((sum, row) => sum + row[2], 0)], [36, 5521000000]);
assert.ok(fhaMmiCashFlows.rows.every((row) => Math.abs(row[2]) < 1e10));
const vaInsuranceCatchall = sourceView("What Treasury's FY2024 VA Insurance Funds: Other catch-all actually contains");
assert.deepEqual([vaInsuranceCatchall.rows.length, vaInsuranceCatchall.rows.reduce((sum, row) => sum + row[2], 0)], [11, 24301000000]);
const vaToxicExposure = sourceView("VA Cost of War Toxic Exposures Fund FY2024 budget authority by operating category");
assert.deepEqual([vaToxicExposure.rows.length, vaToxicExposure.rows.reduce((sum, row) => sum + row[2], 0)], [8, 20268000000]);
assert.ok(vaToxicExposure.rows.every((row) => Math.abs(row[2]) < 1e10));
const vaToxicOutlays = sourceView("VA Toxic Exposures Fund 2024-2028 resources from operating categories");
assert.equal(vaToxicOutlays.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(14974323767.64));
assert.deepEqual(vaToxicExposure.covers, [vaToxicOutlays.rows[0]]);
const vaMedicalSupport = sourceView("VA Medical Support and Compliance FY2024 obligations by program activity");
assert.deepEqual([vaMedicalSupport.rows.length, vaMedicalSupport.rows.reduce((sum, row) => sum + row[2], 0)], [13, 11433540000]);
assert.ok(vaMedicalSupport.rows.every((row) => Math.abs(row[2]) < 1e10));
const vaCommunityCare = sourceView("VA Medical Community Care 2024 fund resources by care program");
assert.deepEqual([vaCommunityCare.rows.length, cents(vaCommunityCare.rows.reduce((sum, row) => sum + row[2], 0))],
  [11, cents(28186323785.97)]);
assert.ok(vaCommunityCare.rows.every((row) => Math.abs(row[2]) < 1e10));
const vaInsuranceCosts = sourceView("VA-administered life insurance FY2024 program costs");
assert.deepEqual([vaInsuranceCosts.rows.length, vaInsuranceCosts.rows.reduce((sum, row) => sum + row[2], 0)], [6, 560000000]);
const vaCompResources = sourceView("VA Compensation and Pensions no-year fund resources by program activity");
const vaCompActualBridge = sourceView("VA Compensation actual outlays from the no-year program schedule");
const vaVeteransBridge = sourceView("VA Veterans program activity from GDX Compensation and Pension expenditures");
const vaSurvivorsBridge = sourceView("VA Survivors program activity from GDX DIC and Survivors Pension expenditures");
const vaCompByState = sourceView("VA FY2024 Compensation and Pension expenditures by 118th congressional district");
const vaMedicalByDistrict = sourceView("VA FY2024 Medical Care expenditures by 118th congressional district");
const vaSurvivorsByState = sourceView("VA FY2024 DIC and Survivors Pension expenditures by state");
assert.deepEqual([vaCompResources.rows.length, vaCompResources.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [13, 2]);
assert.equal(vaCompResources.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(161294617435.7));
assert.equal(vaCompActualBridge.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(158062000000));
assert.deepEqual(vaCompResources.covers[1], vaCompActualBridge.rows[0]);
assert.equal(vaVeteransBridge.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(149893642690.33));
assert.equal(vaSurvivorsBridge.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(11872110538.05));
assert.deepEqual(vaVeteransBridge.covers, [vaCompResources.rows[0]]);
assert.deepEqual(vaSurvivorsBridge.covers, [vaCompResources.rows[1]]);
assert.deepEqual(vaCompByState.covers, [vaVeteransBridge.rows[0]]);
assert.deepEqual([vaCompByState.rows.length, cents(vaCompByState.rows.reduce((sum, row) => sum + row[2], 0))],
  [441, cents(144281399760)]);
assert.equal(vaCompByState.rows.filter((row) => Math.abs(row[2]) >= 1e9).length, 8);
assert.deepEqual([vaMedicalByDistrict.rows.length, cents(vaMedicalByDistrict.rows.reduce((sum, row) => sum + row[2], 0))],
  [439, cents(124687751611.66)]);
assert.equal(vaMedicalByDistrict.rows.filter((row) => Math.abs(row[2]) >= 1e9).length, 1);
assert.ok([...vaCompByState.rows, ...vaMedicalByDistrict.rows]
  .filter((row) => Math.abs(row[2]) >= 1e9).every((row) => /GDX district\/category disclosure ceiling/.test(row[1])));
assert.deepEqual(vaSurvivorsByState.covers, [vaSurvivorsBridge.rows[0]]);
assert.deepEqual([vaSurvivorsByState.rows.length, vaSurvivorsByState.rows.reduce((sum, row) => sum + row[2], 0)], [55, 9569100739]);
assert.ok(vaSurvivorsByState.rows.every((row) => Math.abs(row[2]) < 1e10));
const educationReestimateAccounts = sourceView("USAspending FY2024 Education direct-loan reestimate gross outlays by Treasury account");
assert.deepEqual([educationReestimateAccounts.rows.length, educationReestimateAccounts.rows.reduce((sum, row) => sum + row[2], 0)],
  [5, 115472907854]);
assert.match(educationReestimateAccounts.rows[0][1], /public TAS disclosure ceiling/);
const educationReestimateCohorts = sourceView("OMB FY2025 Credit Supplement · Education FY2024 direct-loan current reestimates by program and cohort");
assert.deepEqual([educationReestimateCohorts.rows.length, educationReestimateCohorts.rows.reduce((sum, row) => sum + row[2], 0)],
  [60, 69111220000]);
assert.equal(educationReestimateCohorts.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
assert.match(educationReestimateCohorts.rows[0][1], /public cohort disclosure ceiling/);
const educationAuditedReestimate = sourceView("Education FY2024 audited Direct Loan net subsidy reestimate by component");
assert.deepEqual([educationAuditedReestimate.rows.length, educationAuditedReestimate.rows.reduce((sum, row) => sum + row[2], 0)],
  [2, 16889000000]);
const sbaReestimateAccounts = sourceView("USAspending FY2024 SBA direct-loan reestimate gross outlays by Treasury account");
assert.deepEqual([sbaReestimateAccounts.rows.length, sbaReestimateAccounts.rows.reduce((sum, row) => sum + row[2], 0)],
  [2, 33680836997]);
assert.match(sbaReestimateAccounts.rows[0][1], /public TAS disclosure ceiling/);
const sbaReestimateCohorts = sourceView("OMB FY2025 Credit Supplement · SBA FY2024 direct-loan current reestimates by program and cohort");
assert.deepEqual([sbaReestimateCohorts.rows.length, sbaReestimateCohorts.rows.reduce((sum, row) => sum + row[2], 0)],
  [70, 33206880000]);
assert.equal(sbaReestimateCohorts.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
const sbaFundBridge = sourceView("SBA 2024 fund resources from OMB current reestimates");
assert.deepEqual([sbaFundBridge.rows.length, sbaFundBridge.rows.reduce((sum, row) => sum + row[2], 0)], [2, 33680448145]);
assert.deepEqual(sbaReestimateCohorts.covers[1], sbaFundBridge.rows[0]);
const sbaAuditedReestimate = sourceView("SBA FY2024 audited Disaster Direct Loan net subsidy reestimate by component");
assert.deepEqual([sbaAuditedReestimate.rows.length, sbaAuditedReestimate.rows.reduce((sum, row) => sum + row[2], 0)],
  [2, -1762543000]);
const nnsaWeapons = sourceView("NNSA FY2024 enacted Weapons Activities by congressional control");
assert.deepEqual([nnsaWeapons.rows.length, nnsaWeapons.rows.reduce((sum, row) => sum + row[2], 0)], [10, 19108000000]);
assert.ok(nnsaWeapons.rows.every((row) => Math.abs(row[2]) < 1e10));
const disasterReliefByMonth = sourceView("FEMA FY2024 DRF obligations by month");
assert.deepEqual([disasterReliefByMonth.rows.length, disasterReliefByMonth.rows.reduce((sum, row) => sum + row[2], 0)], [12, 39066000000]);
assert.ok(disasterReliefByMonth.rows.every((row) => Math.abs(row[2]) < 1e10));
const catastrophicDisasters = sourceView("FEMA FY2024 catastrophic DRF obligations by declaration and geography");
assert.deepEqual([catastrophicDisasters.rows.length, catastrophicDisasters.rows.reduce((sum, row) => sum + row[2], 0)], [112, 33234000000]);
assert.ok(catastrophicDisasters.rows.every((row) => Math.abs(row[2]) < 1e10));
const disasterBasisBridge = sourceView("FEMA base and non-major disasters from declaration-level obligations");
assert.deepEqual([disasterBasisBridge.rows.length, disasterBasisBridge.rows.reduce((sum, row) => sum + row[2], 0)],
  [2, 27653030675.88]);
assert.deepEqual(catastrophicDisasters.covers, [disasterBasisBridge.rows[0]]);
const disasterNoYear = sourceView("FEMA Disaster Relief no-year fund resources by program activity");
assert.deepEqual([disasterNoYear.rows.length, cents(disasterNoYear.rows.reduce((sum, row) => sum + row[2], 0))],
  [3, cents(27455746018.93)]);
const cbpAuthority = sourceView("CBP FY2024 enacted budget authority by appropriation and fee account");
assert.deepEqual([cbpAuthority.rows.length, cbpAuthority.rows.reduce((sum, row) => sum + row[2], 0)], [15, 22863623000]);
const cbpOperations = sourceView("CBP FY2024 Operations and Support enacted authority by PPA");
assert.deepEqual([cbpOperations.rows.length, cbpOperations.rows.reduce((sum, row) => sum + row[2], 0)], [4, 18426870000]);
assert.ok(cbpOperations.rows.every((row) => Math.abs(row[2]) < 1e10));
assert.equal(cbpOperations.covers.length, 1);
const cbpAnnualOutlays = sourceView("CBP 2024 fund resources by program activity");
assert.deepEqual([cbpAnnualOutlays.rows.length, cents(cbpAnnualOutlays.rows.reduce((sum, row) => sum + row[2], 0))],
  [9, cents(14452445623.57)]);
assert.ok(cbpAnnualOutlays.rows.every((row) => Math.abs(row[2]) < 1e10));
const coastGuardAuthority = sourceView("Coast Guard FY2024 enacted budget authority by appropriation and fund");
assert.deepEqual([coastGuardAuthority.rows.length, coastGuardAuthority.rows.reduce((sum, row) => sum + row[2], 0)], [8, 13152645000]);
const coastGuardOperations = sourceView("Coast Guard FY2024 Operations and Support enacted authority by PPA");
assert.deepEqual([coastGuardOperations.rows.length, coastGuardOperations.rows.reduce((sum, row) => sum + row[2], 0)], [3, 10054771000]);
assert.ok(coastGuardOperations.rows.every((row) => Math.abs(row[2]) < 1e10));
assert.equal(coastGuardOperations.covers.length, 1);
const fdicRevenue = sourceView("FDIC Deposit Insurance Fund FY2024 audited revenue by source");
assert.deepEqual([fdicRevenue.rows.length, fdicRevenue.rows.reduce((sum, row) => sum + row[2], 0)], [3, 15688773000]);
const fdicAssessments = sourceView("FDIC Deposit Insurance Fund FY2024 assessment revenue by quarter");
assert.deepEqual([fdicAssessments.rows.length, fdicAssessments.rows.reduce((sum, row) => sum + row[2], 0)], [5, 11643463000]);
assert.ok(fdicAssessments.rows.every((row) => Math.abs(row[2]) < 1e10));
assert.equal(fdicAssessments.covers.length, 1);
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
const tanfResources = sourceView("TANF 2024 fund resources by object class");
const tanfStateBridge = sourceView("TANF State Family Assistance Grant from ACF reported expenditures");
assert.deepEqual([tanfResources.rows.length, tanfResources.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [17, 1]);
assert.equal(tanfResources.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(10664099674.49));
assert.equal(tanfStateBridge.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(10645387092.92));
assert.deepEqual(tanfStateBridge.covers, [tanfResources.rows[0]]);
assert.deepEqual(tanfByState.covers[1], tanfStateBridge.rows[0]);
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
const pbgcAnnualOutlays = sourceView("PBGC 2021-2030 fund resources by program activity and object class");
assert.deepEqual([pbgcAnnualOutlays.rows.length, cents(pbgcAnnualOutlays.rows.reduce((sum, row) => sum + row[2], 0))],
  [4, cents(14658062735.78)]);
assert.equal(pbgcAnnualOutlays.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
assert.deepEqual(pbgcSfaByPlan.covers, [pbgcAnnualOutlays.rows[0]]);
const netPtc = sourceView("IRS tax-year 2023 net premium tax credit by adjusted gross income");
assert.deepEqual([netPtc.rows.length, netPtc.rows.reduce((sum, row) => sum + row[2], 0)], [13, 2648231000]);
assert.ok(netPtc.rows.every((row) => Math.abs(row[2]) < 1e10));
const ptcOutlays = sourceView("IRS FY2024 refundable premium tax-credit outlays by program").rows;
assert.deepEqual([ptcOutlays.length, ptcOutlays.reduce((sum, row) => sum + row[2], 0),
  ptcOutlays.filter((row) => Math.abs(row[2]) >= 1e10).length], [4, 110195000000, 1]);
const highways = sourceView("FHWA FY2024 federal-fund obligations by geography").rows;
assert.deepEqual([highways.length, highways.reduce((sum, row) => sum + row[2], 0)], [56, 64455978000]);
assert.ok(highways.every((row) => Math.abs(row[2]) < 1e10));
const highwayExpenditureView = sourceView("FHWA FY2024 Federal-Aid Account expenditures by state");
const highwayExpenditures = highwayExpenditureView.rows;
assert.deepEqual([highwayExpenditures.length, highwayExpenditures.reduce((sum, row) => sum + row[2], 0)], [51, 44150336000]);
assert.ok(highwayExpenditures.every((row) => Math.abs(row[2]) < 1e10));
const highwayOutlays = sourceView("Federal-Aid Highways no-year fund resources from state expenditures");
assert.equal(highwayOutlays.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(53065227348.22));
assert.equal(highwayOutlays.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
assert.deepEqual(highwayExpenditureView.covers, [highwayOutlays.rows[0]]);
for (const check of [["Army 2020A FY2024 O&M obligations by budget line", 60, 63912381000, 0], ["Navy 1804N FY2024 O&M obligations by budget line", 81, 74666505000, 0], ["Marine Corps 1106N FY2024 O&M obligations by budget line", 30, 10264362000, 0], ["Air Force 3400F FY2024 O&M obligations by budget line", 58, 62834029000, 0], ["Army FY2024 procurement actuals by P-1 line item", 251, 40057534000, 0], ["Navy and Marine Corps FY2024 procurement actuals by P-1 line item", 340, 84046939000, 0], ["Air Force and Space Force FY2024 procurement actuals by P-1 line item", 185, 66444991000, 1], ["Defense-Wide FY2024 procurement actuals by P-1 line item", 69, 14047824000, 0]]) {
  const rows = sourceView(check[0]).rows; assert.deepEqual([rows.length, rows.reduce((sum, row) => sum + row[2], 0), rows.filter((row) => Math.abs(row[2]) >= 1e10).length], check.slice(1));
}
for (const title of ["Air Force and Space Force FY2024 procurement actuals by P-1 line item",
  "Air Force FY2024 RDT&E actuals by R-1 program element"]) {
  assert.match(sourceView(title).rows[0][1], /public classified-program .*disclosure ceiling/);
}
const defenseAgenciesOm = sourceView("DoD FY2024 Defense-Wide O&M authority by agency and health activity");
assert.deepEqual([defenseAgenciesOm.rows.length, defenseAgenciesOm.rows.reduce((sum, row) => sum + row[2], 0)],
  [75, 102066260000]);
assert.equal(defenseAgenciesOm.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 1);
assert.match(defenseAgenciesOm.rows[0][1], /public classified-program disclosure ceiling/);
for (const [title, count, total] of [
  ["Navy O&M 2024 fund resources by object class", 36, 48855554293.77],
  ["Navy O&M 2023 fund resources by object class", 20, 16169324161.55],
  ["Army O&M 2024 fund resources by object class", 26, 37952705878.86],
  ["Army O&M 2023 fund resources by object class", 19, 18075424665.8],
  ["Air Force O&M 2024 fund resources by object class", 25, 38519451490.3],
  ["Air Force O&M 2023 fund resources by object class", 20, 18499664262.31],
  ["Defense-Wide O&M 2024 fund resources by object class", 30, 33358122737.69],
  ["Defense-Wide O&M 2023 fund resources by object class", 20, 13897554249.24],
  ["Air Force RDT&E 2023-2024 fund resources by object class", 33, 16383811403.1],
  ["Defense-Wide RDT&E 2023-2024 fund resources by object class", 27, 15437495001.21],
  ["Defense-Wide RDT&E 2024-2025 fund resources by object class", 27, 14447233680.28],
  ["Navy RDT&E 2024-2025 fund resources by object class", 25, 14088487272.59],
  ["Marine Corps Military Personnel 2024 fund resources by object class", 17, 14411298982.41],
]) {
  const rows = sourceView(title).rows;
  assert.equal(rows.length, count);
  assert.equal(rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(total));
  assert.ok(rows.every((row) => Math.abs(row[2]) < 1e10));
}
const airForceMilitaryPay = sourceView("Air Force Military Personnel 2024 fund resources by object class");
const airForceEnlistedPay = sourceView("Air Force enlisted military-pay object class from basic pay by grade");
assert.deepEqual([airForceMilitaryPay.rows.length, airForceMilitaryPay.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [21, 1]);
assert.equal(airForceMilitaryPay.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(33760661142.85));
assert.equal(airForceEnlistedPay.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(11062367114.57));
assert.deepEqual(airForceEnlistedPay.covers, [airForceMilitaryPay.rows[0]]);
assert.ok(airForceEnlistedPay.rows.every((row) => Math.abs(row[2]) < 1e10));
const navyMilitaryPay = sourceView("Navy Military Personnel 2024 fund resources by object class");
const navyEnlistedActivities = sourceView("Navy enlisted full-time-personnel object class from M-1 activity");
const navyEnlistedGrades = sourceView("Navy enlisted basic pay by grade");
assert.deepEqual([navyMilitaryPay.rows.length, navyMilitaryPay.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [24, 1]);
assert.equal(navyMilitaryPay.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(35195646245.41));
assert.deepEqual([navyEnlistedActivities.rows.length, navyEnlistedActivities.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [10, 1]);
assert.equal(navyEnlistedActivities.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(23156882974.58));
assert.equal(navyEnlistedGrades.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(11667509000));
assert.deepEqual(navyEnlistedActivities.covers, [navyMilitaryPay.rows[0]]);
assert.deepEqual(navyEnlistedGrades.covers, [navyEnlistedActivities.rows[0]]);
assert.ok(navyEnlistedGrades.rows.every((row) => Math.abs(row[2]) < 1e10));
const armyMilitaryPay = sourceView("Army Military Personnel 2024 fund resources by object class");
const armyEnlistedPay = sourceView("Army enlisted military-pay object class from basic pay by grade");
const armyEnlistedBenefits = sourceView("Army enlisted military-benefits object class from published benefit components");
assert.deepEqual([armyMilitaryPay.rows.length, armyMilitaryPay.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [32, 2]);
assert.equal(armyMilitaryPay.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(47941045410.43));
assert.equal(armyEnlistedPay.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(16715189761.72));
assert.equal(armyEnlistedBenefits.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(10272436004.97));
assert.deepEqual(armyEnlistedPay.covers, [armyMilitaryPay.rows[0]]);
assert.deepEqual(armyEnlistedBenefits.covers, [armyMilitaryPay.rows[1]]);
assert.ok([...armyEnlistedPay.rows, ...armyEnlistedBenefits.rows].every((row) => Math.abs(row[2]) < 1e10));
assert.equal(sourceView("FY2024 FMF disbursements by recipient").rows.reduce((sum, row) => sum + row[2], 0), 11908012983);
const defenseHealthResources = sourceView("Defense Health Program 2024 fund resources by program activity and object class");
assert.deepEqual([defenseHealthResources.rows.length,
  defenseHealthResources.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [29, cents(30370992995.86)]);
assert.match(defenseHealthResources.rows[0][1], /public program\/activity-object-class disclosure ceiling/);
const airForceProcurement = sourceView("Air Force Other Procurement 2024-2026 resources by program activity and object class");
assert.deepEqual([airForceProcurement.rows.length,
  airForceProcurement.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [19, cents(24986033551.13)]);
assert.match(airForceProcurement.rows[0][1], /public classified-program cash disclosure ceiling/);
const airForceRdte = sourceView("Air Force RDT&E 2024-2025 resources by program activity and object class");
assert.deepEqual([airForceRdte.rows.length,
  airForceRdte.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [32, cents(23364187645.93)]);
assert.match(airForceRdte.rows[0][1], /public program\/activity-object-class disclosure ceiling/);
const snap = sourceView("FNS-reported FY2024 SNAP benefits by geography and month");
assert.equal(snap.rows.reduce((sum, row) => sum + row[2], 0), 93475887992);
assert.ok(snap.rows.every((row) => Math.abs(row[2]) < 1e10));
const snapOutlays = sourceView("SNAP 2024 fund resources from FNS benefits");
assert.equal(snapOutlays.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(89263314079.06));
assert.deepEqual(snap.covers, [snapOutlays.rows[0]]);
const snapPriorYear = sourceView("SNAP 2023 fund resources by program activity and object class");
assert.deepEqual([snapPriorYear.rows.length,
  snapPriorYear.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [24, cents(15990341846.75)]);
assert.deepEqual(snapPriorYear.covers,
  [["Fund resources · 2023", "Combined Statement FY2024 net outlays · period-of-availability row", 15990341846.75]]);
assert.deepEqual(snapPriorYear.rows.filter((row) => Math.abs(row[2]) >= 1e10).map((row) => row[0]),
  ["Benefits issued · grants, subsidies, and contributions"]);
const snapPriorYearStates = sourceView("SNAP 2023 benefits issued by award place of performance");
assert.deepEqual([snapPriorYearStates.rows.length,
  snapPriorYearStates.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [56, cents(14755405202.32)]);
assert.deepEqual(snapPriorYearStates.covers, [snapPriorYear.rows[0]]);
assert.ok(snapPriorYearStates.rows.every((row) => Math.abs(row[2]) < 1e10));
const cropIndemnities = sourceView("RMA 2024 crop-year indemnities by commodity");
assert.deepEqual([cropIndemnities.rows.length, cropIndemnities.rows.reduce((sum, row) => sum + row[2], 0)], [111, 15168139744]);
assert.ok(cropIndemnities.rows.every((row) => Math.abs(row[2]) < 1e10));
const stateGlobalHealth = sourceView("ForeignAssistance.gov FY2024 State Global Health Programs disbursements by geography");
assert.deepEqual([stateGlobalHealth.rows.length, stateGlobalHealth.rows.reduce((sum, row) => sum + row[2], 0)], [107, 13304436451]);
assert.ok(stateGlobalHealth.rows.every((row) => Math.abs(row[2]) < 1e10));
const stateDiplomaticPrograms = sourceView("State FY2024 estimated Diplomatic Programs by operating category");
assert.deepEqual(stateDiplomaticPrograms.rows, [
  ["Program Operations", "FY2024 estimate · budget authority", 5080827000],
  ["Worldwide Security Protection", "FY2024 estimate · budget authority", 3813707000],
  ["Public Diplomacy", "FY2024 estimate · budget authority", 655679000],
]);
assert.equal(stateDiplomaticPrograms.rows.reduce((sum, row) => sum + row[2], 0), 9550213000);
const fosterCare = sourceView("ACF FY2024 Foster Care and Permanency budget authority by program");
assert.deepEqual([fosterCare.rows.length, fosterCare.rows.reduce((sum, row) => sum + row[2], 0)], [7, 11831467000]);
assert.ok(fosterCare.rows.every((row) => Math.abs(row[2]) < 1e10));
const headStart = sourceView("Head Start FY2024 annual federal operations funding by geography");
assert.deepEqual([headStart.rows.length, headStart.rows.reduce((sum, row) => sum + row[2], 0)], [58, 11753187818]);
assert.ok(headStart.rows.every((row) => Math.abs(row[2]) < 1e10));
const nnsaResources = sourceView("NNSA Weapons Activities no-year fund resources by object class");
const nnsaControls = sourceView("NNSA direct facilities object class from congressional controls");
assert.deepEqual([nnsaResources.rows.length, nnsaResources.rows.filter((row) => Math.abs(row[2]) > 1e10).length], [22, 1]);
assert.equal(nnsaResources.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(17771588585.76));
assert.equal(nnsaControls.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(12827497895.69));
assert.deepEqual(nnsaControls.covers, [nnsaResources.rows[0]]);
assert.ok(nnsaControls.rows.every((row) => Math.abs(row[2]) < 1e10));
const riskAdjustment = sourceView("CMS 2023 benefit-year risk-adjustment payments by state");
assert.deepEqual([riskAdjustment.rows.length, cents(riskAdjustment.rows.reduce((sum, row) => sum + row[2], 0))], [51, cents(11134108331.54)]);
assert.ok(riskAdjustment.rows.every((row) => Math.abs(row[2]) < 1e10));
const phssefOutlays = sourceView("OMB FY2024 PHSSEF net outlays by funding basis and receipt class");
assert.deepEqual([phssefOutlays.rows.length, phssefOutlays.rows.reduce((sum, row) => sum + row[2], 0)], [5, 13957000000]);
assert.ok(phssefOutlays.rows.every((row) => Math.abs(row[2]) < 1e10));
const phssefObjects = sourceView("OMB FY2024 PHSSEF obligations by object class");
assert.deepEqual([phssefObjects.rows.length, phssefObjects.rows.reduce((sum, row) => sum + row[2], 0)], [12, 7398000000]);
assert.ok(phssefObjects.rows.every((row) => Math.abs(row[2]) < 1e10));
const faaOperations = sourceView("FAA FY2024 enacted Operations budget by organization");
assert.deepEqual([faaOperations.rows.length, faaOperations.rows.reduce((sum, row) => sum + row[2], 0)], [7, 12730000000]);
assert.ok(faaOperations.rows.every((row) => Math.abs(row[2]) < 1e10));
const childNutrition = sourceView("FNS FY2024 Child Nutrition costs by program and geography");
assert.equal(childNutrition.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(28391968503.44));
assert.ok(childNutrition.rows.every((row) => Math.abs(row[2]) < 1e10));
const childNutritionOutlays = sourceView("Child Nutrition 2024-2025 fund resources from FNS program costs");
assert.equal(childNutritionOutlays.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(22884098610.26));
assert.deepEqual(childNutrition.covers, [childNutritionOutlays.rows[0]]);
const medicaid = sourceView("CMS-64 FY2024 federal Medicaid share by state and service");
const medicaidNoYearBridge = sourceView("Medicaid no-year fund resources from CMS-64 federal share");
assert.equal(medicaid.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(612391730046));
assert.equal(medicaid.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, 13);
assert.ok(medicaid.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public annual disclosure ceiling/.test(row[1])));
assert.equal(medicaidNoYearBridge.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(610988009345.29));
assert.deepEqual(medicaid.covers, [medicaidNoYearBridge.rows[0]]);
const hiOasdiTax = sourceView("HI taxation-of-OASDI-benefits receipt from the Medicare Trustees control");
assert.equal(hiOasdiTax.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-39794000000));
assert.match(hiOasdiTax.rows.at(-1)[1], /public Medicare Trustees disclosure ceiling/);
const caDrugNdcs = sourceView("California CY2024 Medicaid drug reimbursements by NDC").rows;
assert.equal(caDrugNdcs.length, 24345);
assert.equal(cents(caDrugNdcs.reduce((sum, row) => sum + row[2], 0)), cents(15506717427.98));
assert.ok(caDrugNdcs.every((row) => Math.abs(row[2]) < 1e9));
const ssiByArea = sourceView("SSI no-year fund resources from December congressional-district payments");
assert.deepEqual([ssiByArea.rows.length, ssiByArea.rows.reduce((sum, row) => sum + cents(row[2]), 0)],
  [53, cents(61849449090.25)]);
const californiaSsi = sourceView("California SSI December payments annualized by congressional district");
assert.deepEqual([californiaSsi.rows.length, californiaSsi.rows.reduce((sum, row) => sum + cents(row[2]), 0)],
  [53, cents(11334084000)]);
assert.deepEqual(californiaSsi.covers, [ssiByArea.rows[0]]);
assert.ok(californiaSsi.rows.every((row) => Math.abs(row[2]) < 1e10));
const oasiTransfer = sourceView("OASI transfer-to availability from FY2024 benefit-payment components");
assert.equal(oasiTransfer.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(1293782491652.94));
assert.match(oasiTransfer.rows[0][1], /public fiscal-year payment-component disclosure ceiling/);
const retiredWorkersByArea = sourceView("Retired-worker December 2024 monthly benefits by state or area");
assert.deepEqual([retiredWorkersByArea.rows.length,
  retiredWorkersByArea.rows.reduce((sum, row) => sum + row[2], 0)], [58, 102268471000]);
assert.ok(retiredWorkersByArea.rows.every((row) => Math.abs(row[2]) < 1e10));
const disabledWorkersByArea = sourceView("Disabled-worker December 2024 monthly benefits by state or area");
assert.deepEqual([disabledWorkersByArea.rows.length,
  disabledWorkersByArea.rows.reduce((sum, row) => sum + row[2], 0)], [58, 11430894000]);
assert.ok(disabledWorkersByArea.rows.every((row) => Math.abs(row[2]) < 1e10));
const oasiResources = sourceView("OASI no-year fund resources from FY2024 non-benefit costs");
assert.equal(oasiResources.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(10598557649.12));
assert.ok(oasiResources.rows.every((row) => Math.abs(row[2]) < 1e10));
const diTransfer = sourceView("DI transfer-to availability from FY2024 benefit-payment components");
assert.equal(diTransfer.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(153917545267.93));
assert.match(diTransfer.rows[0][1], /public fiscal-year payment-component disclosure ceiling/);
const ssaTrustPayments = sourceView("SSA Payments to Social Security trust funds no-year by destination");
const oasiTaxChannels = sourceView("OASI FY2024 taxation-of-benefits income by collection channel");
const oasiReceipt = sourceView("OASI miscellaneous federal-payments receipt by tax collection channel");
assert.equal(ssaTrustPayments.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(53759573655.22));
assert.deepEqual(oasiTaxChannels.covers, [ssaTrustPayments.rows[0]]);
assert.equal(oasiTaxChannels.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(53136000000));
assert.match(oasiTaxChannels.rows[0][1], /public fiscal-year collection-channel disclosure ceiling/);
assert.equal(oasiReceipt.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-53143654112.54));
assert.match(oasiReceipt.rows.at(-1)[1], /public fiscal-year collection-channel disclosure ceiling/);
const militaryRetirementPayment = sourceView("FY2024 Military Retirement Fund amortization payment by actuarial source");
const militaryRetirementReceipt = sourceView("Military Retirement Fund federal-contribution receipt by actuarial source");
assert.equal(militaryRetirementPayment.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(151521000000));
assert.equal(militaryRetirementReceipt.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-151521000000));
assert.ok(militaryRetirementPayment.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public payment-basis disclosure ceiling/.test(row[1])));
const merhcfInterest = sourceView("MERHCF investment-earnings receipt from audited interest income");
assert.equal(merhcfInterest.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-18647530042.31));
assert.match(merhcfInterest.rows.at(-1)[1], /public audited interest-revenue disclosure ceiling/);
const opmRetirementPayment = sourceView("OPM FY2024 civil-service retirement payment by statutory source");
const opmRetirementReceipt = sourceView("Civil-service retirement federal-contribution receipt by statutory source");
assert.equal(opmRetirementPayment.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(53255231701));
assert.equal(opmRetirementReceipt.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-53255231701));
assert.ok(opmRetirementPayment.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public payment-account disclosure ceiling/.test(row[1])));
assert.equal(sourceView("OASI benefits by beneficiary type").rows.reduce((sum, row) => sum + row[2], 0), 1316424000000);
assert.equal(sourceView("DI benefits by beneficiary type").rows.reduce((sum, row) => sum + row[2], 0), 154983000000);
const vaMedicalOutlays = sourceView("VA Medical Services FY2024 actual-outlay accounts").rows;
assert.ok(vaMedicalOutlays.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public OMB classification ceiling/.test(row[1])));
const vaMedicalResources = sourceView("VA Medical Services 2024 fund resources by program activity and object class");
assert.deepEqual([vaMedicalResources.rows.length,
  vaMedicalResources.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [44, cents(61068446450.83)]);
assert.ok(vaMedicalResources.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public program\/activity-object-class disclosure ceiling/.test(row[1])));
const directLoanStates = sourceView("Direct Loan FY2024 COD new-loan disbursements by institution, state, and loan type");
assert.deepEqual([directLoanStates.rows.length, directLoanStates.rows.reduce((sum, row) => sum + row[2], 0)], [3844, 85964314733]);
assert.ok(directLoanStates.rows.every((row) => Math.abs(row[2]) < 1e9));
const directLoanResources = sourceView("Direct Loan Program 2024 resources by program activity and object class");
assert.deepEqual([directLoanResources.rows.length,
  directLoanResources.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [2, cents(107980089908)]);
assert.ok(directLoanResources.rows[0][1].includes("disclosure ceiling"));
const pell2324 = sourceView("Student Financial Assistance 2023-2024 resources by program activity and object class");
assert.deepEqual([pell2324.rows.length, pell2324.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [3, cents(13630065819.8)]);
assert.ok(pell2324.rows[0][1].includes("disclosure ceiling"));
const pell2425 = sourceView("Student Financial Assistance 2024-2025 resources by program activity and object class");
assert.deepEqual([pell2425.rows.length, pell2425.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [3, cents(11362696591.95)]);
assert.ok(pell2425.rows[0][1].includes("disclosure ceiling"));
const educationRelief = sourceView("Education Stabilization Fund FY2024 gross outlays by program and ESSER prime-recipient state");
assert.equal(educationRelief.rows.length, 60);
assert.equal(cents(educationRelief.rows.reduce((sum, row) => sum + row[2], 0)), cents(55516156490.37));
assert.ok(educationRelief.rows.every((row) => Math.abs(row[2]) < 1e10));
const educationReliefOutlays = sourceView("Education Stabilization Fund 2021-2023 resources from program/state outlays");
assert.equal(educationReliefOutlays.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(49249109392.89));
assert.deepEqual(educationRelief.covers, [educationReliefOutlays.rows[0]]);
const medicareGeography = sourceView("Original Medicare FY2024 claim payments by county and service · 1,521 rows");
assert.deepEqual([medicareGeography.rows.length, medicareGeography.rows.reduce((sum, row) => sum + row[2], 0)], [1521, 377094873261]);
assert.equal(medicareGeography.rows.filter((row) => Math.abs(row[2]) >= 1e9).length, 9);
assert.ok(medicareGeography.rows.filter((row) => Math.abs(row[2]) >= 1e9)
  .every((row) => /CMS county\/service disclosure ceiling/.test(row[1])));
const trustFundPayments = sourceView("Payments to Health Care Trust Funds 2024 resources by program activity and object class");
assert.deepEqual([trustFundPayments.rows.length,
  trustFundPayments.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [6, cents(485990990428.42)]);
assert.ok(trustFundPayments.rows.filter((row) => Math.abs(row[2]) >= 1e10)
  .every((row) => /public program-activity\/object-class cash disclosure ceiling/.test(row[1])));
const premiumTransfer = sourceView("Premium-assistance transfer to CMS by program activity");
assert.deepEqual([premiumTransfer.rows.length,
  premiumTransfer.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [4, cents(128472512976.9)]);
const premiumCredit = sourceView("Premium Tax Credit FY2024 advances and tax-return reconciliation");
assert.deepEqual([premiumCredit.rows.length,
  premiumCredit.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [2, cents(98746000000)]);
const premiumAdjustment = sourceView("Premium-assistance no-year fund resources from tax-return reconciliation");
assert.deepEqual([premiumAdjustment.rows.length,
  premiumAdjustment.rows.reduce((sum, row) => sum + cents(row[2]), 0)], [2, cents(-18277256948.77)]);
for (const check of [
  ["Treasury Notes FY2024 accrued interest by month", 329708890427.09, 12],
  ["Treasury Bills FY2024 amortized discount by month", 306434224076.92, 12],
  ["Treasury Bonds FY2024 accrued interest by month", 137291916890.28, 12],
  ["Treasury TIPS FY2024 inflation compensation by month", 57060678892.35, 2]
]) {
  const panel = sourceView(check[0]);
  assert.equal(panel.rows.length, 12);
  assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(check[1]));
  assert.equal(panel.rows.filter((row) => Math.abs(row[2]) >= 1e10).length, check[2]);
  assert.ok(panel.rows.every((row) => /public monthly disclosure ceiling/.test(row[1])));
}
for (const title of ["Treasury FRN FY2024 accrued interest by month-end FYTD change",
  "Treasury TIPS FY2024 accrued interest by month-end FYTD change",
  "Treasury Special-Issue inflation compensation by month-end FYTD change",
  "Treasury Special-Issue deferred discount by month-end FYTD change"]) {
  const panel = sourceView(title);
  assert.equal(panel.rows.length, 12);
  assert.equal(cents(panel.rows.reduce((sum, row) => sum + row[2], 0)), cents(panel.sourceTotal));
  assert.ok(panel.rows.every((row) => Math.abs(row[2]) < 1e10));
}
const partDBridge = sourceView("Medicare Part D FY2024 audited gross-to-net expense bridge");
assert.deepEqual([partDBridge.rows.length, partDBridge.rows.reduce((sum, row) => sum + row[2], 0)], [2, 112921000000]);
assert.ok(partDBridge.rows.every((row) => /public same-basis disclosure ceiling/.test(row[1])));
assert.ok(sourceView("Medicare FY2024 service costs (accrual context)").rows.slice(0, 4)
  .every((row) => /public same-basis disclosure ceiling/.test(row[1])));
assert.ok(sourceView("Medicare FY2024 budget-function outlays by signed OMB account").rows
  .filter((row) => [521484000000, 404291000000, 116456000000].includes(row[2]))
  .every((row) => /public OMB classification ceiling/.test(row[1])));
for (const [title, total] of [
  ["SMI transfer-to no-year resources from the OMB cash account", 519967835979.18],
  ["HI transfer-to no-year resources from the OMB cash account", 403423187940.61],
  ["SMI federal-contribution receipt from the OMB cash offset", -375967160931.34],
  ["Part D federal-contribution receipt from the OMB cash offset", -101860622011.88],
  ["Aged SMI premium receipt from the OMB cash offset", -124091613735.77],
  ["State Part D payment receipt from the OMB cash offset", -17757892575],
  ["Disabled SMI premium receipt from the OMB cash offset", -13639973309],
]) {
  const panel = sourceView(title);
  assert.equal(panel.rows.length, 2);
  assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(total));
}
const medicareRevenue = sourceView("Medicare FY2024 earned revenue from audited and OMB premium controls");
assert.deepEqual([medicareRevenue.rows.length, medicareRevenue.rows.reduce((sum, row) => sum + row[2], 0)], [7, -148741000000]);
assert.deepEqual(medicareRevenue.covers, [sourceView("Medicare FY2024 service costs (accrual context)").rows[8]]);
assert.ok(sourceView("Selected FY2024 major-arms notifications").rows
  .every((row) => row[2] >= 1e9 && /^https:\/\//.test(row[3])));
assert.equal(cents(sourceView("House FY2024 disbursements by expense category").rows
  .reduce((sum, row) => sum + row[2], 0)), cents(1889796892.35));
assert.equal(cents(sourceView("Senate FY2024 expenditures by appropriation").rows
  .reduce((sum, row) => sum + row[2], 0)), cents(1227661445.97));
