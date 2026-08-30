# State rendered terminal rows above $10 billion

Research date: 2026-08-29  
Scope: browser-rendered state reconciliation rows only; strict test `abs(value) > $10,000,000,000`

## Result

The current UI renders **230 above-threshold occurrences**, representing **158 unique terminal financial rows** after the Census rows shown with opposite signs in both reconciliation bridges are deduplicated:

| Layer | Unique terminals | Rendered occurrences | Result of deeper-source review |
|---|---:|---:|---|
| Census/CMS/supplemental | 72 | 144 | No lower exact schedule is published in the cited annual source; F-33 and Medi-Cal views remain supplemental where periods or entity boundaries differ. |
| State GAAP functions | 53 | 53 | No accepted same-statement, same-basis child schedule remains. Budget and checkbook schedules cannot be attached without an explicit GAAP crosswalk. |
| State archive/portal | 33 | 33 | 28 are one published line or the lowest public drill row; 5 are multi-record, unavailable, restated, or privacy-limited aggregates. |
| **Total** | **158** | **230** | **No additional exact, non-overlapping child panel is safe to promote from the sources reviewed here.** |

“Tax expenditure” normally means forgone revenue from deductions, credits, exclusions, or preferential rates. These nodes instead measure cash expenditures, intergovernmental payments, Medicaid federal share, or GAAP expense. They should be described in the product as **government expenditures/expenses**, not tax expenditures, unless a separate official tax-expenditure dataset is added.

## Acceptance rule

A child schedule is promotable only when its fiscal period, reporting entity, accounting basis, measure, sign, and source precision match the parent and its children reproduce the parent in integer cents (or through an explicit published rounding bridge). Census, CMS-64, budget, checkbook, and GAAP schedules are not interchangeable. This is the same conservative rule used by the current rendered-row audit.

The Census State Government Finances file reports `AMOUNT` in thousands of current dollars; the app converts it to dollars. State fiscal-year ends vary, including Alabama and Michigan (September 30), New York (March 31), Texas (August 31), and most other states (June 30). The FY2024 technical documentation also confirms that, beginning with 2022, older welfare vendor-payment codes were consolidated into broader welfare current operations, so `SF0358` is now the lowest comparable annual ASFIN row rather than a parent with a suppressed legacy split. [Census FY2024 data](https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip) · [Census FY2024 technical documentation](https://www2.census.gov/programs-surveys/state/technical-documentation/complete-technical-documentation/statetechdoc2024.pdf)

CMS-64 rows are final **federal fiscal year 2024 federal-share** service totals. CMS describes Form CMS-64 as a quarterly state submission and permits prior-period adjustments; the public FY2024 Financial Management Report is the annual service-category summary, not a public child schedule of four reconciled quarters. [CMS expenditure-report page](https://www.medicaid.gov/medicaid/financial-management/state-budget-expenditure-reporting-for-medicaid-and-chip/expenditure-reports-mbes/cbes) · [FY2024 Financial Management Report ZIP](https://www.medicaid.gov/medicaid/financial-management/downloads/financial-management-report-fy2024.zip)

## Source findings and candidate-child decisions

No candidate below passed the acceptance rule. The table records the exact source-native evidence so a future pass does not repeat the same dead ends.

| Priority | Affected terminal(s) | Exact source evidence / candidate rows | Reconciliation decision |
|---|---|---|---|
| P0 complete | Texas Annual Cash Report: eight rows listed in the archive inventory below | The official FY2024 fund workbooks reproduce the retained values as single rows: Fund 0001 `Public Assistance Payments` $58,117,598,747.49; object 7969 `Operating Transfer Out from General Revenue (Agency 902)` $29,763,401,145.35; Fund 0001 `Employee Benefits` $13,937,733,591.67; object 7911 `Allocation from Fund 0001 to GR Account – Foundation School 0193 (Dedicated Receipts)` $13,098,267,765.78; Fund 0006 `Highway Construction` $11,956,321,126.03; Fund 0001 `Salaries and Wages` $11,188,409,706.35; GR Account 0193 `Intergovernmental Payments` $27,118,433,134.41; Fund 0960 object 7083 `Retirement Payments - Teacher Retirement System` $15,096,187,629.15. | These are the lowest rows in the published cash-report workbooks, not eight hidden parent schedules. Keep source-ceiling labels. Seek an official transaction/agency export only if it explicitly reconciles to these cash-basis fund/object controls. [Texas cash-report methodology and downloads](https://comptroller.texas.gov/transparency/reports/cash-report/) · [FY2024 data ZIP](https://comptroller.texas.gov/transparency/reports/cash-report/2024/data/data.zip) |
| P1 | Kentucky object E466, $14,320,770,793.16 | The official API reproduces the amount exactly for Executive Branch / Cabinet 53 / Department 748 / Class 460 / Object E466, `Other Benefits - 1099 reportable`. Both VendorView and ItemLevel return `totalVendorRecordCount: 0`, an empty vendor-detail array, and only the object record. | No public vendor child exists at this API path. Keep the atomic source ceiling. [Kentucky exact API query](https://secure2.kentucky.gov/TransparencyWebApi/v1/SpendingAndVendorDetail?dataGroupingView=VendorView&requestYear=2024&branchCode=EXEC&cabinetCode=53&departmentCode=748&classCode=460&objectCode=E466&vendorName=&beginDate=&endDate=&maxReturnRows=100&startingIndex=) |
| P1 | New Jersey Human Services / Federal funding child, $11,425,089,288.80 | The current privacy-safe panel already reconciles its $18,670,126,290.78 parent into Federal $11,425,089,288.80; Grant in Aid $6,116,371,320.32; Dedicated $1,121,598,977.78; and Direct State Services—Non-Salary $7,066,703.88. The Federal child comprises 252 source rows and contains one $11.522 billion privacy-sensitive record plus offsets. | No truthful lower non-personal dimension is available in the public data. Keep `privacy-preserving publication ceiling`; do not surface payee-level personal data. [NJ Agency Expenditures](https://data.nj.gov/Government-Finance/YourMoney-Agency-Expenditures/apet-rp2i) · [official dataset metadata API](https://data.nj.gov/api/views/apet-rp2i) |
| P1 | North Carolina HHS aid $31,204,021,286.92 (1,017 rows); Public Instruction aid $15,336,437,487.00 (128 rows) | The official FY2024 49 MB download route retained in the repository now returns 404, although the state still advertises Open Budget. | Do not manufacture groupings from the stale archive. First obtain a replacement official FY2024 bulk file, then group by a non-personal published dimension and require cent-exact reconciliation. [North Carolina Open Budget](https://www.nc.gov/government/open-budget) · [retained FY2024 download route](https://www.nc.gov/nc-budget-data-fy2024-49-mb/download?attachment=) |
| P1 | Virginia Medicaid Program Services / Contractual Services, $20,825,541,115.81 (4,161 rows) | The live Data Point result has been restated since the retained archive was imported and no longer equals the archived control. | Re-import the parent and children together from one live snapshot, or keep the archive ceiling. Never attach current children to the older total. [Virginia Data Point](https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures) |
| P1 | Louisiana Health medical-vendor payments, $17,795,248,921.13 | The retained category is exact, but its underlying live row set was unavailable in this pass. | Reacquire the FY2024 category export from the official portal and reconcile before grouping. [Louisiana Checkbook](https://checkbook.la.gov/expenditures2.cfm) |
| P1 | Ohio Gainwell Technologies $28,371,392,987.52; Interest and Coding Adjustments **−$13,588,630,690.15** | These are already the final payee/adjustment rows on the exact live Medicaid drill path. Ohio's separate large bulk ZIP does not reconcile to that live-ledger basis. | Keep `public transaction-detail ceiling`; do not splice the bulk export beneath the live controls. [Ohio Checkbook](https://checkbook.ohio.gov/State/Expenses/Agency.aspx?fiscalyear=2024) · [DataOhio bulk archive](https://data.ohio.gov/wps/portal/gov/data/view/ohio-checkbook) |
| P1 | Missouri Social Services / Medical Assist Services / generic recipient, $10,144,355,975.64 | The live detail is already at the public recipient/category boundary and the retained name is generic rather than an undisclosed allocation. | Keep the source ceiling until the portal publishes a lower, reconciling accounting dimension. [Missouri Social Services detail](https://mapyourtaxes.mo.gov/Map/Expenditures/Agencies/Detail.aspx?agcy=886&cat=800&year=2024) |
| P2 | California Los Angeles Two-Plan estimate, $15,876,174,000 | The official November 2024 estimate reports FY2024-25 Los Angeles Two-Plan member months 46,123,499 and total dollars in thousands of $15,876,174. It does not allocate the total between the two plans. | This is a FY2024-25 county estimate, not FY2024 expenditure. Keep it supplemental and period-labelled; do not infer plan shares. [California Medi-Cal November 2024 estimate](https://www.dhcs.ca.gov/dataandstats/reports/mcestimates/Documents/2024_November_Estimate/N24-Medi-Cal-Local-Assistance-Estimate.pdf) |
| P2 | Census intergovernmental school payments and New York City F-33 formula assistance $10,076,459,000 | F-33 supplies recipient-side local-school schedules, but their coverage totals do not equal the state-government Census intergovernmental controls. The NYC formula-assistance row is itself the lowest published F-33 item retained. | Preserve F-33 panels as supplemental; never replace a Census parent with a non-reconciling recipient-side total. [Census FY2024 F-33 workbook](https://www2.census.gov/programs-surveys/school-finances/tables/2024/secondary-education-finance/elsec24t.xlsx) |
| P3 | All 53 GAAP functions in the inventory | ACFR Statement-of-Activities columns for charges for services and operating/capital grants explain net expense; they are not child expenses. Budgetary supplements and checkbooks use different bases. | Search only audited notes, combining schedules, or ACFR supplements that explicitly reconcile program expense to the government-wide function. Otherwise retain the broad GAAP function ceiling. |

## Complete unique terminal inventory

Values below are the current rendered leaf/ceiling values, not higher parents that already expand. Census rows occur twice in the browser with opposite signs; each is listed once here.

### Census, CMS-64, and supplemental terminals (72)

Source keys: `Census` = [FY2024 ASFIN download](https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip); `CMS` = [FY2024 federal-share report](https://www.medicaid.gov/medicaid/financial-management/downloads/financial-management-report-fy2024.zip); `F-33` = [FY2024 secondary-school finance workbook](https://www2.census.gov/programs-surveys/school-finances/tables/2024/secondary-education-finance/elsec24t.xlsx); `DHCS` = [California FY2024-25 estimate](https://www.dhcs.ca.gov/dataandstats/reports/mcestimates/Documents/2024_November_Estimate/N24-Medi-Cal-Local-Assistance-Estimate.pdf).

| State | Current terminal rows above $10B |
|---|---|
| Arizona | Census SF0358 public-welfare other current operations — $25,964,191,000; CMS Medicaid MCO federal share — $13,182,911,329 |
| California | Census intergovernmental public-welfare other — $67,826,267,000; Census intergovernmental other/unallocable — $11,491,579,000; Census intergovernmental elementary/secondary education to school districts — $68,145,588,000; Census SF0193 correctional-institutions current operations — $12,095,765,000; SF0217 other higher-education current operations — $40,685,043,000; SF0276 hospitals current operations — $22,084,612,000; SF0358 public-welfare other current operations — $156,146,784,000; CMS Medicaid MCO — $44,352,196,702; CMS prescribed drugs — $10,452,526,840; DHCS Los Angeles Two-Plan FY2024-25 estimate — $15,876,174,000 |
| Colorado | Census SF0358 — $13,538,104,000 |
| Florida | Census intergovernmental elementary/secondary education to school districts — $19,494,941,000; SF0217 — $10,742,558,000; SF0358 — $39,966,463,000; CMS Medicaid MCO — $13,327,895,435 |
| Georgia | Census intergovernmental elementary/secondary education to school districts — $14,315,719,000; SF0358 — $18,965,578,000 |
| Illinois | Census intergovernmental elementary/secondary education to school districts — $14,962,916,000; SF0358 — $40,997,264,000; CMS Medicaid MCO — $15,206,728,793 |
| Indiana | Census intergovernmental elementary/secondary education to school districts — $11,387,810,000; SF0358 — $22,903,621,000 |
| Iowa | Census SF0358 — $10,191,610,000 |
| Kentucky | Census SF0358 — $20,540,942,000; CMS Medicaid MCO — $11,238,749,458 |
| Louisiana | Census SF0358 — $18,627,063,000; CMS Medicaid MCO — $10,739,429,486 |
| Maryland | Census SF0358 — $21,567,487,000 |
| Massachusetts | Census SF0358 — $34,039,831,000 |
| Michigan | Census intergovernmental elementary/secondary education to school districts — $20,333,102,000; SF0358 — $24,334,356,000; CMS Medicaid MCO — $10,261,150,302 |
| Minnesota | Census intergovernmental elementary/secondary education to school districts — $12,817,144,000; SF0358 — $23,212,411,000 |
| Missouri | Census SF0358 — $15,556,090,000 |
| New Jersey | Census intergovernmental elementary/secondary education to school districts — $12,425,700,000; SF0358 — $27,963,647,000 |
| New Mexico | Census SF0358 — $10,717,801,000 |
| New York | Census intergovernmental elementary/secondary education generic — $21,169,717,000; intergovernmental public-welfare other — $15,268,377,000; intergovernmental elementary/secondary education to school districts — $24,064,721,000; F-33 New York City formula assistance — $10,076,459,000; Census SF0217 — $11,119,980,000; SF0358 — $97,239,497,000; SF0395 other/unallocable current operations — $12,395,924,000; CMS Medicaid MCO — $29,414,964,024 |
| North Carolina | Census intergovernmental elementary/secondary education generic — $14,018,179,000; SF0358 — $30,590,465,000; CMS Medicaid MCO — $12,974,263,336 |
| Ohio | Census intergovernmental elementary/secondary education to school districts — $16,558,146,000; SF0358 — $39,718,949,000; CMS Medicaid MCO — $13,314,216,047 |
| Oklahoma | Census SF0358 — $14,411,279,000 |
| Oregon | Census SF0358 — $20,324,796,000 |
| Pennsylvania | Census intergovernmental elementary/secondary education to school districts — $19,551,946,000; SF0358 — $39,090,442,000; CMS Medicaid MCO — $19,689,287,400 |
| South Carolina | Census SF0358 — $12,839,422,000 |
| Tennessee | Census SF0358 — $16,420,189,000 |
| Texas | Census intergovernmental elementary/secondary education to school districts — $41,892,316,000; SF0217 — $31,605,596,000; SF0276 — $14,245,106,000; SF0283 regular-highway capital outlay — $14,189,175,000; SF0358 — $57,172,398,000; CMS Medicaid MCO — $16,747,257,557 |
| Virginia | Census intergovernmental elementary/secondary education generic — $12,487,057,000; SF0358 — $23,636,058,000 |
| Washington | Census intergovernmental elementary/secondary education to school districts — $17,324,608,000; SF0358 — $19,504,812,000 |
| Wisconsin | Census SF0358 — $16,132,865,000 |

### GAAP Statement-of-Activities terminals (53)

All values are FY2024 primary-government expenses in dollars. The state code links to the official ACFR used by the active data.

| State/source | Current terminal functions above $10B |
|---|---|
| [Alabama](https://comptroller.alabama.gov/wp-content/uploads/2025/04/ACFR-2024.Alabama.pdf) | Education and Cultural Resources — $12,806,084,000 |
| [Arizona](https://www.azauditor.gov/sites/default/files/2026-04/StateOfArizonaJune30_2024FinancialReport_1.pdf) | Health and welfare — $27,630,378,000; Education — $12,101,996,000 |
| [California](https://www.sco.ca.gov/Files-ARD/ACFR/acfr24web.pdf) | General government — $30,364,857,000; Education — $104,989,072,000; Health and human services — $239,312,614,000; Natural resources and environmental protection — $15,843,903,000; Transportation — $22,096,992,000; Corrections and rehabilitation — $16,282,066,000; business-type Unemployment Programs — $18,212,170,000 |
| [Colorado](https://content.leg.colorado.gov/sites/default/files/fy2024_acfr_final.pdf) | Social Assistance — $13,849,567,000 |
| [Florida](https://myfloridacfo.com/docs-sf/default-source/transparency-docs/cafr/fye-2024-state-of-florida-annual-comprehensive-financial-report.pdf?sfvrsn=1b01575_4) | Education — $32,211,608,000; Human services — $55,653,172,000 |
| [Georgia](https://gsfic.georgia.gov/document/document/fy2024-annual-comprehensive-financial-report/download) | Education — $19,703,715,000; Health and Welfare — $25,531,417,000 |
| [Illinois](https://illinoiscomptroller.gov/financial-reports-data/find-a-report/comprehensive-reporting/annual-comprehensive-financial-report/fiscal-year-2024) | Health and social services — $50,520,055,000; Education — $24,153,476,000; Intergovernmental-revenue sharing — $10,046,259,000 |
| [Indiana](https://www.in.gov/comptroller/files/2024-ACFR.pdf) | Welfare — $25,350,296,000; Education — $14,255,468,000 |
| [Kentucky](https://finance.ky.gov/office-of-the-controller/office-of-statewide-accounting-services/financial-reporting-branch/ACFR/2024%20Kentucky%20Annual%20Comprehensive%20Financial%20Report.pdf) | Human Resources — $21,618,042,000 |
| [Louisiana](https://www.doa.la.gov/media/db0f1bsl/fy2024-acfr-final.pdf) | Health and Welfare — $22,686,815,000 |
| [Maryland](https://www.marylandcomptroller.gov/content/dam/mdcomp/md/reports/financial/acfr2024.pdf) | Health and mental hygiene — $19,686,902,000 |
| [Massachusetts](https://www.macomptroller.org/wp-content/uploads/acfr_fy-2024.pdf) | Medicaid — $23,600,996,000 |
| [Michigan](https://audgen.michigan.gov/wp-content/uploads/2025/05/SOMACFR-FY2024.pdf) | Education — $25,555,123,000; Health and human services — $35,570,625,000 |
| [Minnesota](https://mn.gov/mmb/assets/2024%20-%20Final%20ACFR%20with%20Cover%202024%20-%20accessible_tcm1059-661432.pdf) | General Education — $13,402,311,000; Health and Human Services — $26,811,914,000 |
| [Mississippi](https://www.dfa.ms.gov/sites/default/files/Financial%20Reporting%20Home/Publications/ACFR/FY24%20%20ACFR%20Final.pdf) | Health and social services — $10,623,182,000 |
| [Missouri](https://acct.oa.mo.gov/sites/g/files/zuston241/files/2025-04/2024%20ACFR%20-%20Final%20for%20Internet.pdf) | Human Services — $22,069,877,000 |
| [New Jersey](https://www.nj.gov/treasury/omb/publications/24fr/NJFRFY2024Complete.pdf) | Physical and mental health — $23,197,180,512; Educational, cultural, and intellectual development — $27,954,454,329 |
| [New York](https://www.osc.ny.gov/files/reports/finance/pdf/annual-comprehensive-financial-report-2024.pdf) | Education — $48,561,000,000; Public health — $121,815,000,000; Public welfare — $22,221,000,000; Transportation — $14,464,000,000; General government — $26,618,000,000 |
| [North Carolina](https://www.ncosc.gov/sites/default/files/2024-12/2024%20North%20Carolina%20Annual%20Comprehensive%20Financial%20Report.pdf) | Primary and secondary education — $16,203,270,000; Health and human services — $34,623,699,000 |
| [Ohio](https://archives.obm.ohio.gov/Files/State_Accounting/Financial_Reporting/Comprehensive_Annual_Financial_Report/2024/ACFR_2024.pdf) | Primary, Secondary and Other Education — $18,261,598,000; Public Assistance and Medicaid — $44,163,398,000 |
| [Oregon](https://www.oregon.gov/das/Financial/Acctng/Documents/2024_ACFR.pdf) | Human Services — $23,403,214,000 |
| [Pennsylvania](https://www.pa.gov/content/dam/copapwp-pagov/en/budget/documents/publications-and-reports/annualfinancialreport/june-30-2024%20acfr.pdf) | Public education — $24,140,385,000; Health and human services — $56,748,489,000 |
| [Tennessee](https://www.tn.gov/content/dam/tn/finance/acfr/ACFR_FY24.pdf) | Education — $12,872,973,000; Health and social services — $22,856,581,000 |
| [Texas](https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2024/basic.pdf) | Education — $47,365,189,000; Health and Human Services — $75,193,982,000 |
| [Virginia](https://www.doa.virginia.gov/reports/ACFReport/2024/F_Government_Wide.pdf) | Education — $17,873,724,000; Individual and Family Services — $30,790,097,000 |
| [Washington](https://ofm.wa.gov/sites/default/files/public/accounting/report/CAFR/2024/ACFR24.pdf) | K-12 education — $17,398,119,000; Human services — $31,829,072,000 |
| [Wisconsin](https://doa.wi.gov/DEBFCapitalFinance/2024/FY_2024_ACFR_Final.pdf) | Human Relations and Resources — $20,821,341,000 |

### Official archive/portal terminals (33)

| State/source | Current terminal rows above $10B | Publication status |
|---|---|---|
| [California FY2023-24 expenditure supplement](https://www.sco.ca.gov/Files-ARD/BudLeg/Expenditures_Supplement_23_24.xlsx) | State School Fund local assistance / Education — $52,630,700,480; General Fund local assistance / Education Prop. 98 — $46,880,170,575; State School Fund `Less Funding Provided by General Fund` — **−$52,630,700,480**; General Fund DHCS item 4260-101-0001 — $34,932,412,007; General Fund DSS item 5180-111-0001 — $11,380,879,479; Public School System Stabilization Account local assistance — $10,480,542,000 | Six atomic workbook lines; the positive/negative school-fund lines must not be treated as independent program spending. |
| [Illinois Comptroller](https://illinoiscomptroller.gov/financial-reports-data/expenditures-state-spending/statewide?GroupBy=Agcy&FY=24&Type=B&submitted=Submit) | Comptroller object 1984 Payroll Consolidation Distribution — $101,499,815,635.02; Healthcare and Family Services object 4900 Awards & Grants — $24,672,058,195.87; Revenue object 4491 Shared Revenue Payments — $14,291,072,101.62; State Board of Education object 4900 Awards & Grants — $11,223,244,231.97 | Atomic official query rows. |
| [Indiana AFR Volume II](https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf) | FSSA / Medicaid Policy & Plan / Medicaid Assistance / Welfare Disbursing Agent — $14,319,001,347.39 | Atomic published row. |
| [Kentucky Transparency](https://transparency.ky.gov/search/Pages/spendingsearch.aspx) | Object E466 Other Benefits - 1099 reportable — $14,320,770,793.16 | Atomic API row; vendor detail empty. |
| [Louisiana Checkbook](https://checkbook.la.gov/expenditures2.cfm) | Health medical-vendor payments — $17,795,248,921.13 | Multi-record source aggregation; row set unavailable. |
| [Minnesota Transparency](https://transparency.systems.state.mn.us/) | Human Services annual payments — $26,254,884,052; Education annual payments — $13,065,648,811 | Atomic agency-total rows in the official export. |
| [Missouri Social Services detail](https://mapyourtaxes.mo.gov/Map/Expenditures/Agencies/Detail.aspx?agcy=886&cat=800&year=2024) | Medical Assist Services / generic recipient — $10,144,355,975.64 | Final public recipient/category row. |
| [New Jersey Agency Expenditures](https://data.nj.gov/Government-Finance/YourMoney-Agency-Expenditures/apet-rp2i) | Human Services / Federal funding category — $11,425,089,288.80 | Privacy-preserving aggregate of 252 source rows. |
| [North Carolina Open Budget](https://www.nc.gov/government/open-budget) | HHS Aid and Public Assistance — $31,204,021,286.92; Public Instruction Aid and Public Assistance — $15,336,437,487.00 | Multi-record aggregates (1,017 and 128 rows); official FY2024 file route is currently broken. |
| [Ohio Checkbook](https://checkbook.ohio.gov/State/Expenses/Agency.aspx?fiscalyear=2024) | Gainwell Technologies LLC — $28,371,392,987.52; Interest and Coding Adjustments — **−$13,588,630,690.15**; Education and Workforce / General Revenue cabinet — $10,702,713,393.08 | First two are final live-ledger transaction-detail ceilings; third is an atomic official row. |
| [Tennessee Checkbook](https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no) | Executive Branch annual payments — $32,296,038,413.26 | Atomic official export row. |
| [Texas Annual Cash Report](https://comptroller.texas.gov/transparency/reports/cash-report/) | Fund 0001 Public Assistance Payments — $58,117,598,747.49; Fund 0001 object 7969 Operating Transfer Out — $29,763,401,145.35; GR Account 0193 Intergovernmental Payments — $27,118,433,134.41; Fund 0960 object 7083 TRS retirement payments — $15,096,187,629.15; Fund 0001 Employee Benefits — $13,937,733,591.67; Fund 0001 object 7911 Foundation School allocation — $13,098,267,765.78; Fund 0006 Highway Construction — $11,956,321,126.03; Fund 0001 Salaries and Wages — $11,188,409,706.35 | Eight atomic fund/object workbook rows, verified above. |
| [Utah Transparency](https://transparent.utah.gov/entities/highest-paid-vendors) | blank vendor rank 1 — $35,119,490,979.37 | Atomic published portal result; missing label is source-native and should not be guessed. |
| [Virginia Data Point](https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures) | Department of Medical Assistance Services / Medicaid Program Services / Contractual Services — $20,825,541,115.81 | Multi-record aggregate of 4,161 rows; live total restated after archive capture. |

## Prioritized next-source queue

1. **Recover exact multi-record archive schedules first:** North Carolina's replacement FY2024 bulk file, a frozen Virginia FY2024 Data Point export, and Louisiana's FY2024 medical-vendor category export. These are the only opportunities already known to contain many public source rows above $10 billion.
2. **Request documented same-basis drilldowns:** Texas fund/object transaction or agency crosswalks; Illinois object-level detail for awards, shared revenue, and the payroll consolidation distribution; Tennessee agency/object detail; California appropriation-item detail. Accept only totals that reproduce the active controls.
3. **Resolve privacy and anomalous labels without disclosure:** ask New Jersey for a non-personal organizational/program dimension under the Federal funding child and Utah for an official accounting label for the blank vendor row.
4. **Search audited GAAP notes narrowly:** prioritize California HHS ($239.313B), New York Public Health ($121.815B), California Education ($104.989B), Texas HHS ($75.194B), and Pennsylvania HHS ($56.748B). Require an audited expense crosswalk; do not attach budgetary/checkbook schedules merely because their topics match.
5. **Treat Census/CMS annual leaves as source floors:** do not spend additional implementation time on `SF0358` or CMS service rows unless Census or CMS publishes a new lower annual table. Keep F-33 and California Medi-Cal panels explicitly supplemental.

## Safe implementation recommendation

No production data change is justified by this pass. Preserve the current distinction between an exact additive breakdown and a publication ceiling. If a future source clears the acceptance rule, import its children as a source-native panel, retain an explicit remainder only when mathematically necessary and fully labelled, record source row count and period/basis, and add a browser-visible test that the children reproduce the parent exactly. Keep privacy-sensitive recipient data aggregated.

The count can be rechecked with:

```sh
node tests/test-large-row-coverage.js
```

That test currently audits the stricter `$5B` threshold; this report's `$10B` inventory was reconstructed through the same state archive → Census → GAAP rendering model and then deduplicated by state, source, path, and absolute value.
