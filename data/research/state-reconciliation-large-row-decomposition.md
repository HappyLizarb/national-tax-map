# FY2024 state reconciliation rows at or above $10 billion

Research date: **2026-08-28**. Scope: every source-native row of at least **$10,000,000,000** that is currently loaded when a user expands the state Census and GAAP reconciliation schedules. Amounts below are unsigned source values; the Census schedule adds Census rows and reverses archive rows, while the GAAP schedule adds the GAAP control and reverses Census rows.

## Result

The expanded schedules contain **209 oversized row occurrences representing 149 unique published rows**:

| Source side | Unique rows ≥$10B | Schedule occurrences | Existing exact breakdown | Existing supplemental-only view | No attached breakdown |
| --- | ---: | ---: | ---: | ---: | ---: |
| GAAP primary-government expense control | 46 | 46 | 11 transcribed locally; all 46 have an official Statement of Activities path | 0 | 35 not yet transcribed locally |
| Census expenditure functions | 60 | 120 | 41 | 3 | 16 |
| Official research archive | 43 | 43 | 0 attached | 0 | 43 |
| **Total** | **149** | **209** | **52** | **3** | **94** |

The Census rows occur twice because the Census bridge adds them and the GAAP bridge reverses them. The archive rows occur only in the Census bridge, and the GAAP controls occur only in the GAAP bridge.

The main product finding was that much of the requested research existed but was not visible in the adjustment view. The reconciliation loader now carries through each detail file's `itemBreakdowns`, `supplementalBreakdowns`, and `sourceBreakdowns`, surfacing the 44 researched Census panels described below.

## What can be broken down exactly

### GAAP controls

Every GAAP control comes from the state's government-wide Statement of Activities (SOA), whose expense column is already organized by governmental function and business-type program. Transcribing those source-native rows is an exact first split of the GAAP control, not an allocation of the Census-to-GAAP difference. The repository now has exact, locally stored SOA schedules for Alaska, Arizona, California, Colorado, Florida, Mississippi, New York, Pennsylvania, Tennessee, Texas, and Utah. Alaska's 15 rows and Utah's 20 rows are all below $10B; the other nine schedules still contain one or more official function ceilings above $10B.

The remaining 35 SOA schedules are feasible official imports from the linked reports in Appendix A. Their function rows must sum to the existing GAAP control at the report's stated precision. A function that remains over $10B after that split is marked as an **official publication ceiling** unless the same ACFR contains an additive subordinate schedule on the same primary-government GAAP basis.

### Census controls

The official Census file already supplies an exact current-operations/capital-outlay split for **41 of the 60** oversized Census functions. Those panels are present in the state detail JSON and reconcile exactly to their parents. Only three parent functions are reduced entirely below $10B by that split: California regular highways, Michigan other higher education, and Pennsylvania other higher education. The other 38 exact panels end in at least one published child that is itself at least $10B.

That is a source ceiling, not missing arithmetic. The Census public-use format publishes one government ID, one item code, and one amount per record; the state-finance product merges like financial items into uniform categories. Census also warns that its state-government boundary and classifications can differ from the issuing state's and that allocations can be developed when source detail is insufficient. Therefore, a state checkbook, Medicaid report, university audit, or school-system recipient file can be shown only as a separately labeled supplemental view unless it exactly matches the Census item. [Census FY2024 technical documentation](https://www2.census.gov/programs-surveys/state/technical-documentation/complete-technical-documentation/statetechdoc2024.pdf) · [Census state-finance methodology](https://www.census.gov/programs-surveys/state/technical-documentation/methodology.html) · [Census state-finance product description](https://www.census.gov/programs-surveys/state/about.html) · [official FY2024 data file](https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip)

### Archive controls

Seventeen archive rows are aggregates of **1,613,710 underlying official source records** recorded by the repository. Reimporting those records and grouping them one level deeper is an exact, same-source path, subject to reproducing the FY2024 query and total. They are the two Florida rows, three Georgia rows, Kentucky Medicaid, Massachusetts health and human services, two Michigan rows, Missouri social services, New Jersey human services, New York education, two North Carolina rows, Ohio Medicaid Federal, Virginia Medicaid, and Washington Health Care Authority.

Twenty-three archive rows are already one row at the published source schema: six California appropriation lines, four Illinois object lines, Indiana Medicaid assistance, Louisiana medical-vendor payments, two Ohio fund/cabinet lines, Tennessee's branch control, and eight Texas cash-report account/object lines. A different official report may provide useful program context, but it cannot replace these rows as an exact split without a numeric crosswalk back to the parent.

Three rows are unresolved fallbacks rather than local detail files: Minnesota Department of Human Services (**$26,254,884,052**), Minnesota Education Department (**$13,065,648,811**), and Utah's blank rank-1 vendor (**$35,119,490,979.37**). Minnesota's official payment report is the proper route for a reproducible deeper export. Utah's published top-100 source omits the vendor name for rank 1, so no defensible entity allocation can be inferred from that publication.

## California worked example

### Audited GAAP control: exact SOA split

California's **$478,596,393,000** primary-government expense control is not itself an unexplained adjustment. It is the sum of the following audited SOA expense rows, reported in thousands and converted to dollars. The rows reconcile exactly to the control. [California FY2024 ACFR, Statement of Activities, pp. 40–41](https://www.sco.ca.gov/Files-ARD/ACFR/acfr24web.pdf)

| Activity | Function/program | FY2024 expense |
| --- | --- | ---: |
| Governmental | General government | $30,364,857,000 |
| Governmental | Education | $104,989,072,000 |
| Governmental | Health and human services | $239,312,614,000 |
| Governmental | Natural resources and environmental protection | $15,843,903,000 |
| Governmental | Business, consumer services, and housing | $4,587,805,000 |
| Governmental | Transportation | $22,096,992,000 |
| Governmental | Corrections and rehabilitation | $16,282,066,000 |
| Governmental | Interest on long-term debt | $3,780,126,000 |
| Business-type | Water Resources | $1,623,577,000 |
| Business-type | State Lottery | $9,361,888,000 |
| Business-type | Unemployment Programs | $18,212,170,000 |
| Business-type | California State University | $11,867,582,000 |
| Business-type | State Water Pollution Control Revolving | $62,530,000 |
| Business-type | Safe Drinking Water State Revolving | $34,364,000 |
| Business-type | Housing Loan | $52,440,000 |
| Business-type | Other enterprise programs | $124,407,000 |
| **Total** | **Primary government** | **$478,596,393,000** |

Six governmental functions and two business-type programs remain above $10B. The SOA does not publish an additive agency/account hierarchy beneath those rows. Fund statements and the Controller's budgetary/legal workbook use different bases and boundaries, so they are supplemental context rather than exact child rows.

### Census rows: exact and supplemental splits already present

California has eight Census function rows over the limit. Five direct-general functions have exact Census splits:

| Census parent | Exact published children | Parent total | Largest remaining child |
| --- | --- | ---: | ---: |
| Correctional institutions | Current operations + capital outlay | $12,611,414,000 | $12,095,765,000 |
| Other higher education | Current operations + capital outlay | $44,681,890,000 | $40,685,043,000 |
| Hospitals | Current operations + capital outlay | $25,154,977,000 | $22,084,612,000 |
| Regular highways | Current operations + capital outlay | $12,048,193,000 | $6,272,147,000 |
| Public welfare | Other current operations + institutions + two capital rows | $156,706,211,000 | $156,146,784,000 |

The three intergovernmental rows have no exact deeper Census hierarchy. Existing official supplemental views are:

- **Public welfare—other, $67,826,267,000:** California's Controller workbook identifies **$13,645,375,933** of welfare and health realignment local assistance across nine subaccounts. It is an exact subset of the Controller basis, not an exact split of the Census parent. [Controller FY2024 expenditure workbook](https://www.sco.ca.gov/Files-ARD/BudLeg/Expenditures_Supplement_23_24.xlsx)
- **Other and unallocable, $11,491,579,000:** the same workbook identifies **$4,083,059,799** across nine tax-relief, shared-revenue, and related local-assistance programs. It remains a supplemental subset.
- **Independent-school-district elementary/secondary education, $68,145,588,000:** Census's recipient-side F-33 school-finance file reports **$73,990,871,000** of state-source revenue across California public school systems. The repository already groups the 31 displayed recipient rows below $9.5B, but the $5,845,283,000 difference in boundaries and timing prevents substitution for the state-government expenditure parent. [Census FY2024 individual school-system finance table](https://www2.census.gov/programs-surveys/school-finances/tables/2024/secondary-education-finance/elsec24t.xlsx)

### California archive rows: publication ceilings

The six California archive rows over $10B are single appropriation lines in the Controller's official workbook. They are already at the source's lowest imported business-unit/fund/character/appropriation level. [Controller FY2024 expenditure workbook](https://www.sco.ca.gov/Files-ARD/BudLeg/Expenditures_Supplement_23_24.xlsx)

| Business unit | Source-native line | Amount |
| --- | --- | ---: |
| Department of Education | State School Fund · Local Assistance · appropriation 0342000 6100 2023 602 | $52,630,700,480 |
| Department of Education | General Fund · Local Assistance · Proposition 98 · 0001000 6100 1980 670 | $46,880,170,575 |
| Department of Education | State School Fund · Less Funding Provided by General Fund · 0342000 6100 1973 698 | −$52,630,700,480 |
| State Department of Health Care Services | General Fund · Local Assistance · 4260-101-0001 | $34,932,412,007 |
| Department of Social Services | General Fund · Local Assistance · 5180-111-0001 | $11,380,879,479 |
| Public School System Stabilization Account | Local Assistance · 1029000 9889 2014 611 | $10,480,542,000 |

Agency budgets, apportionment schedules, and health-program reports can explain subsets, but no official numeric crosswalk was found that decomposes these exact workbook lines while preserving their signed totals. The $52.631B education line and its −$52.631B offset should remain paired; splitting only one side would misstate the workbook's accounting structure.

## Two additional largest GAAP examples

New York's **$275,665,000,000** control splits exactly into **$248,995,000,000 governmental activities** and **$26,670,000,000 business-type activities** in its FY2024 SOA. The statement further lists governmental functions and business-type programs, but several remain over $10B; any deeper fund or agency schedule must remain separate unless it reconciles to those accrual-basis functions. [New York FY2024 ACFR, Statement of Activities, p. 39](https://www.osc.ny.gov/files/reports/finance/pdf/annual-comprehensive-financial-report-2024.pdf)

Texas's **$212,131,483,000** control has an exact 16-row SOA decomposition:

| Activity | Function/program | FY2024 expense |
| --- | --- | ---: |
| Governmental | General government | $121,697,000 |
| Governmental | Education | $47,365,189,000 |
| Governmental | Teacher Retirement State Contributions | $8,895,341,000 |
| Governmental | Health and Human Services | $75,193,982,000 |
| Governmental | Public Safety and Corrections | $9,069,756,000 |
| Governmental | Transportation | $9,386,269,000 |
| Governmental | Natural Resources and Recreation | $4,052,201,000 |
| Governmental | Regulatory Services | $643,101,000 |
| Governmental | Interest on General Long-Term Debt | $168,883,000 |
| Business-type | General government | $353,651,000 |
| Business-type | Education | $46,073,415,000 |
| Business-type | Health and Human Services | $2,996,651,000 |
| Business-type | Public Safety and Corrections | $112,822,000 |
| Business-type | Transportation | $703,674,000 |
| Business-type | Natural Resources and Recreation | $748,943,000 |
| Business-type | Lottery | $6,245,908,000 |
| **Total** | **Primary government** | **$212,131,483,000** |

The rows reconcile exactly, but governmental education, governmental health and human services, and business-type education remain above $10B. [Texas FY2024 ACFR, Statement of Activities](https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2024/basic.pdf)

## Recommended data treatment

1. **Implemented:** surface the 41 existing exact Census item panels and three supplemental Census panels inside reconciliation adjustments.
2. **Implemented for 11 controls:** attach the local SOA schedules to their GAAP controls; 35 official SOA imports remain.
3. **Researched, import pending:** rebuild the 17 multi-record archive aggregates one level deeper from the same FY2024 source, accepting a split only when its children reproduce the parent exactly.
4. **Implemented for attached GAAP schedules:** label remaining ≥$10B functions **official publication ceiling**. Do not create an “other” allocation or mix budget, Census, payment, and GAAP rows to force every displayed value below $10B.

## Appendix A — GAAP controls at or above $10B

Each linked official report is the source of the existing total and the feasible SOA function split.

| State | Expenses | Official source | State | Expenses | Official source |
| --- | ---: | --- | --- | ---: | --- |
| Alabama | $34,823,126,000 | [ACFR](https://comptroller.alabama.gov/wp-content/uploads/2025/04/ACFR-2024.Alabama.pdf) | Alaska | $11,733,030,000 | [ACFR](https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf) |
| Arizona | $62,548,895,000 | [report](https://www.azauditor.gov/sites/default/files/2026-04/StateOfArizonaJune30_2024FinancialReport_1.pdf) | Arkansas | $27,685,315,000 | [ACFR](https://www.dfa.arkansas.gov/wp-content/uploads/cafr2024.pdf) |
| California | $478,596,393,000 | [ACFR](https://www.sco.ca.gov/Files-ARD/ACFR/acfr24web.pdf) | Colorado | $50,760,292,000 | [ACFR](https://content.leg.colorado.gov/sites/default/files/fy2024_acfr_final_1.pdf) |
| Connecticut | $40,842,511,000 | [ACFR](https://osc.ct.gov/wp-content/uploads/2025/03/State-of-Connecticut-ACFR-FY-24-3-26-25.pdf) | Delaware | $12,886,132,000 | [ACFR](https://accountingfiles.delaware.gov/docs/2024acfr.pdf) |
| Florida | $129,071,958,000 | [ACFR](https://myfloridacfo.com/docs-sf/default-source/transparency-docs/cafr/fye-2024-state-of-florida-annual-comprehensive-financial-report.pdf?sfvrsn=1b01575_4) | Georgia | $74,835,829,000 | [ACFR](https://gsfic.georgia.gov/document/document/fy2024-annual-comprehensive-financial-report/download) |
| Hawaii | $17,633,580,000 | [ACFR](https://files.hawaii.gov/auditor/Reports/2024_Audit/ACFR2024.pdf) | Idaho | $15,073,867,000 | [ACFR](https://www.sco.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf) |
| Illinois | $107,613,012,000 | [ACFR](https://illinoiscomptroller.gov/financial-reports-data/find-a-report/comprehensive-reporting/annual-comprehensive-financial-report/fiscal-year-2024) | Indiana | $50,974,009,000 | [ACFR](https://www.in.gov/comptroller/files/2024-ACFR.pdf) |
| Iowa | $29,978,416,000 | [ACFR](https://publications.iowa.gov/51393/1/FY2024%20ACFR.pdf) | Kansas | $22,497,866,000 | [ACFR](https://admin.ks.gov/browse/files/d74a7e638a0947d5bb8369a5d35ebb48/download) |
| Kentucky | $41,918,454,000 | [ACFR](https://finance.ky.gov/office-of-the-controller/office-of-statewide-accounting-services/financial-reporting-branch/ACFR/2024%20Kentucky%20Annual%20Comprehensive%20Financial%20Report.pdf) | Louisiana | $43,970,093,000 | [ACFR](https://www.doa.la.gov/media/db0f1bsl/fy2024-acfr-final.pdf) |
| Maine | $13,060,103,000 | [ACFR](https://www.maine.gov/osc/sites/maine.gov.osc/files/inline-files/acfr2024.pdf) | Maryland | $59,807,313,000 | [ACFR](https://www.marylandcomptroller.gov/content/dam/mdcomp/md/reports/financial/acfr2024.pdf) |
| Massachusetts | $91,075,895,000 | [ACFR](https://www.macomptroller.org/wp-content/uploads/acfr_fy-2024.pdf) | Michigan | $86,364,900,000 | [ACFR](https://audgen.michigan.gov/wp-content/uploads/2025/05/SOMACFR-FY2024.pdf) |
| Minnesota | $61,437,999,000 | [ACFR](https://mn.gov/mmb/assets/2024%20-%20Final%20ACFR%20with%20Cover%202024%20-%20accessible_tcm1059-661432.pdf) | Mississippi | $23,918,437,000 | [ACFR](https://www.dfa.ms.gov/sites/default/files/Financial%20Reporting%20Home/Publications/ACFR/FY24%20%20ACFR%20Final.pdf) |
| Missouri | $39,786,224,000 | [ACFR](https://acct.oa.mo.gov/sites/g/files/zuston241/files/2025-04/2024%20ACFR%20-%20Final%20for%20Internet.pdf) | Nebraska | $14,096,230,000 | [ACFR](https://das.nebraska.gov/accounting/docs/cafr/acfr2024.pdf) |
| Nevada | $21,043,874,000 | [ACFR](https://www.controller.nv.gov/siteassets/content/financialrpts/acfr/fy-2024-acfr.pdf) | New Hampshire | $10,029,340,000 | [statement](https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf) |
| New Jersey | $86,552,284,036 | [report](https://www.nj.gov/treasury/omb/publications/24fr/NJFRFY2024Complete.pdf) | New Mexico | $29,849,540,000 | [ACFR](https://www.nmdfa.state.nm.us/wp-content/uploads/2025/04/FINAL-341a-State-of-New-Mexico-FY24-ACFR.pdf) |
| New York | $275,665,000,000 | [ACFR](https://www.osc.ny.gov/files/reports/finance/pdf/annual-comprehensive-financial-report-2024.pdf) | North Carolina | $77,647,997,000 | [ACFR](https://www.ncosc.gov/sites/default/files/2024-12/2024%20North%20Carolina%20Annual%20Comprehensive%20Financial%20Report.pdf) |
| North Dakota | $10,441,607,000 | [ACFR](https://www.omb.nd.gov/sites/www/files/documents/financial-transparency/cafr/2024-acfr.pdf) | Ohio | $93,621,246,000 | [ACFR](https://archives.obm.ohio.gov/Files/State_Accounting/Financial_Reporting/Comprehensive_Annual_Financial_Report/2024/ACFR_2024.pdf) |
| Oklahoma | $31,451,931,000 | [ACFR](https://oklahoma.gov/content/dam/ok/en/omes/documents/acfr-2024.pdf) | Oregon | $46,686,181,000 | [ACFR](https://www.oregon.gov/das/Financial/Acctng/Documents/2024_ACFR.pdf) |
| Pennsylvania | $111,201,827,000 | [ACFR](https://www.pa.gov/content/dam/copapwp-pagov/en/budget/documents/publications-and-reports/annualfinancialreport/june-30-2024%20acfr.pdf) | Rhode Island | $12,237,099,000 | [ACFR](https://controller.admin.ri.gov/sites/g/files/xkgbur621/files/2025-03/2024%20State%20of%20Rhode%20Island%20ACFR%206.30.24%20-%20Final.pdf) |
| South Carolina | $40,767,100,000 | [ACFR](https://cg.sc.gov/sites/cg/files/Documents/Publications%20and%20Reports/Annual%20Accountability%20Reports/001-316-ACFR-FY2024.pdf) | Tennessee | $47,759,686,000 | [ACFR](https://www.tn.gov/content/dam/tn/finance/acfr/ACFR_FY24.pdf) |
| Texas | $212,131,483,000 | [ACFR](https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2024/basic.pdf) | Utah | $22,117,390,000 | [ACFR](https://finance.utah.gov/wp-content/uploads/FY24-ACFR-Final.pdf) |
| Virginia | $73,209,969,000 | [statements](https://www.doa.virginia.gov/reports/ACFReport/2024/F_Government_Wide.pdf) | Washington | $92,503,827,000 | [ACFR](https://ofm.wa.gov/sites/default/files/public/accounting/report/CAFR/2024/ACFR24.pdf) |
| West Virginia | $17,263,678,000 | [ACFR](https://finance.wv.gov/FARS/ACFR/Documents/ACFR2024.pdf) | Wisconsin | $51,086,900,000 | [ACFR](https://doa.wi.gov/DEBFCapitalFinance/2024/FY_2024_ACFR_Final.pdf) |

## Appendix B — Census rows at or above $10B

All rows come from the [official FY2024 Census state-finance file](https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip). “Exact” means the existing Census child rows add exactly to the parent; “supplemental” means an official subset or adjacent view that must not be added to or substituted for the parent.

| State | Census function | Amount | Existing status |
| --- | --- | ---: | --- |
| Arizona | Total Public Welfare | $26,024,408,000 | Exact Census split |
| California | Intergovernmental Public Welfare—Other | $67,826,267,000 | Supplemental only |
| California | Intergovernmental Other and Unallocable | $11,491,579,000 | Supplemental only |
| California | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $68,145,588,000 | No exact split; recipient-side supplement exists |
| California | Total Correctional Institutions | $12,611,414,000 | Exact Census split |
| California | Total Other Higher Education | $44,681,890,000 | Exact Census split |
| California | Total Hospitals | $25,154,977,000 | Exact Census split |
| California | Total Regular Highways | $12,048,193,000 | Exact Census split |
| California | Total Public Welfare | $156,706,211,000 | Exact Census split |
| Colorado | Total Public Welfare | $13,623,750,000 | Exact Census split |
| Florida | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $19,494,941,000 | No attached split |
| Florida | Total Other Higher Education | $11,574,175,000 | Exact Census split |
| Florida | Total Public Welfare | $40,145,836,000 | Exact Census split |
| Georgia | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $14,315,719,000 | No attached split |
| Georgia | Total Public Welfare | $18,989,100,000 | Exact Census split |
| Illinois | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $14,962,916,000 | No attached split |
| Illinois | Total Public Welfare | $41,230,959,000 | Exact Census split |
| Indiana | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $11,387,810,000 | No attached split |
| Indiana | Total Public Welfare | $22,964,542,000 | Exact Census split |
| Iowa | Total Public Welfare | $10,256,584,000 | Exact Census split |
| Kentucky | Total Public Welfare | $20,541,319,000 | Exact Census split |
| Louisiana | Total Public Welfare | $18,702,378,000 | Exact Census split |
| Maryland | Total Public Welfare | $21,626,636,000 | Exact Census split |
| Massachusetts | Total Public Welfare | $34,288,902,000 | Exact Census split |
| Michigan | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $20,333,102,000 | No attached split |
| Michigan | Total Other Higher Education | $10,930,632,000 | Exact Census split |
| Michigan | Total Public Welfare | $24,405,321,000 | Exact Census split |
| Minnesota | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $12,817,144,000 | No attached split |
| Minnesota | Total Public Welfare | $23,394,803,000 | Exact Census split |
| Missouri | Total Public Welfare | $15,672,901,000 | Exact Census split |
| New Jersey | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $12,425,700,000 | No attached split |
| New Jersey | Total Public Welfare | $28,075,553,000 | Exact Census split |
| New Mexico | Total Public Welfare | $10,720,352,000 | Exact Census split |
| New York | Intergovernmental Elementary and Secondary Education | $21,169,717,000 | No attached split |
| New York | Intergovernmental Public Welfare—Other | $15,268,377,000 | Supplemental only |
| New York | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $24,064,721,000 | No attached split |
| New York | Total Other Higher Education | $12,065,846,000 | Exact Census split |
| New York | Total Public Welfare | $97,361,816,000 | Exact Census split |
| New York | Total Other and Unallocable | $12,608,328,000 | Exact Census split |
| North Carolina | Intergovernmental Elementary and Secondary Education | $14,018,179,000 | No attached split |
| North Carolina | Total Public Welfare | $30,973,330,000 | Exact Census split |
| Ohio | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $16,558,146,000 | No attached split |
| Ohio | Total Public Welfare | $39,777,380,000 | Exact Census split |
| Oklahoma | Total Public Welfare | $14,575,681,000 | Exact Census split |
| Oregon | Total Public Welfare | $20,471,363,000 | Exact Census split |
| Pennsylvania | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $19,551,946,000 | No attached split |
| Pennsylvania | Total Other Higher Education | $10,547,014,000 | Exact Census split |
| Pennsylvania | Total Public Welfare | $39,383,395,000 | Exact Census split |
| South Carolina | Total Public Welfare | $12,847,344,000 | Exact Census split |
| Tennessee | Total Public Welfare | $16,429,120,000 | Exact Census split |
| Texas | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $41,892,316,000 | No attached split |
| Texas | Total Other Higher Education | $35,748,339,000 | Exact Census split |
| Texas | Total Hospitals | $14,736,037,000 | Exact Census split |
| Texas | Total Regular Highways | $18,396,383,000 | Exact Census split |
| Texas | Total Public Welfare | $57,359,816,000 | Exact Census split |
| Virginia | Intergovernmental Elementary and Secondary Education | $12,487,057,000 | No attached split |
| Virginia | Total Public Welfare | $23,677,335,000 | Exact Census split |
| Washington | Intergovernmental to Independent School Districts—Elementary and Secondary Education | $17,324,608,000 | No attached split |
| Washington | Total Public Welfare | $19,623,964,000 | Exact Census split |
| Wisconsin | Total Public Welfare | $16,261,924,000 | Exact Census split |

## Appendix C — archive rows at or above $10B

“Reimportable” means the repository records more than one underlying source row, so a deeper exact grouping is technically possible if the official FY2024 extract can be reproduced. “Atomic” means the imported official schema contains one row at this level; “fallback” means no local detail file exists.

| State | Source-native row | Amount | Disposition |
| --- | --- | ---: | --- |
| California | Department of Education · State School Fund local assistance | $52,630,700,480 | Atomic appropriation line |
| California | Department of Education · General Fund Proposition 98 local assistance | $46,880,170,575 | Atomic appropriation line |
| California | Department of Education · Less Funding Provided by General Fund | −$52,630,700,480 | Atomic offset line |
| California | Health Care Services · General Fund local assistance | $34,932,412,007 | Atomic appropriation line |
| California | Social Services · General Fund local assistance | $11,380,879,479 | Atomic appropriation line |
| California | Public School System Stabilization Account local assistance | $10,480,542,000 | Atomic appropriation line |
| Florida | Agency for Health Care Administration · medical vendor care/subsistence | $37,101,532,427.53 | Reimportable: 2,245 rows |
| Florida | Department of Education · aid to counties—educational | $13,065,057,008.19 | Reimportable: 5,998 rows |
| Georgia | Community Health · Federal | $11,316,417,800.97 | Reimportable: 13,755 rows |
| Georgia | Community Health · State/Other | $10,933,288,196.39 | Reimportable: 14,479 rows |
| Georgia | Education · State/Other | $12,185,926,278 | Reimportable: 3,448 rows |
| Illinois | Comptroller · payroll consolidation distribution | $101,499,815,635.02 | Atomic object line |
| Illinois | Healthcare and Family Services · awards and grants—lump sum | $24,672,058,195.87 | Atomic object line |
| Illinois | Revenue · shared revenue payments | $14,291,072,101.62 | Atomic object line |
| Illinois | State Board of Education · awards and grants—lump sum | $11,223,244,231.97 | Atomic object line |
| Indiana | FSSA Medicaid · Medicaid assistance/welfare disbursing agent | $14,319,001,347.39 | Atomic report line |
| Kentucky | Medicaid Services Benefits | $18,197,104,828.94 | Reimportable: 6 rows |
| Louisiana | DHH Medical Vendor Payments | $17,795,248,921.13 | Published category ceiling; deeper exact row set not retained |
| Massachusetts | Health and Human Services · benefit programs | $22,809,057,452.21 | Reimportable: 1,131,166 rows |
| Michigan | Health and Human Services · external purchased services | $27,445,007,099.46 | Reimportable: 373,872 rows |
| Michigan | Education · payments to local units | $20,051,716,323.86 | Reimportable: 21,406 rows |
| Minnesota | Department of Human Services | $26,254,884,052 | Fallback; rerun official payment export |
| Minnesota | Education Department | $13,065,648,811 | Fallback; rerun official payment export |
| Missouri | Social Services · program distributions | $14,091,239,491.08 | Reimportable: 1,745 rows |
| New Jersey | Human Services · special health services · unnamed individual receiver | $18,670,126,290.78 | Reimportable: 630 rows; privacy labels may remain suppressed |
| New York | Education · local grants/public assistance · New York City School District | $17,625,462,652.79 | Reimportable: 3,375 rows |
| North Carolina | Health and Human Services · aid and public assistance | $31,204,021,286.92 | Reimportable: 1,017 rows |
| North Carolina | Public Instruction · aid and public assistance | $15,336,437,487 | Reimportable: 128 rows |
| Ohio | Medicaid · General Revenue · Cabinet | $18,352,954,629.63 | Atomic fund/cabinet line |
| Ohio | Medicaid · Federal · Cabinet | $11,539,881,914.88 | Reimportable: 4 rows |
| Ohio | Education and Workforce · General Revenue · Cabinet | $10,702,713,393.08 | Atomic fund/cabinet line |
| Tennessee | Executive Branch · FY2024 total annual payments | $32,296,038,413.26 | Atomic branch control in retained file |
| Texas | Comptroller State Fiscal · Net Expenditures · Public Assistance Payments | $58,117,598,747.49 | Atomic account/category line |
| Texas | Comptroller State Fiscal · Net Expenditures · Employee Benefits | $13,937,733,591.67 | Atomic account/category line |
| Texas | Comptroller State Fiscal · Net Expenditures · Salaries and Wages | $11,188,409,706.35 | Atomic account/category line |
| Texas | Comptroller State Fiscal · Other Uses · operating transfer out | $29,763,401,145.35 | Atomic account/object line |
| Texas | Comptroller State Fiscal · Other Uses · Foundation School allocation | $13,098,267,765.78 | Atomic account/object line |
| Texas | Texas Education Agency · Intergovernmental Payments | $27,118,433,134.41 | Atomic account/category line |
| Texas | Teacher Retirement System · retirement payments | $15,096,187,629.15 | Atomic account/object line |
| Texas | Transportation/Motor Vehicles · Highway Construction | $11,956,321,126.03 | Atomic account/category line |
| Utah | Blank rank-1 vendor in state top-100 | $35,119,490,979.37 | Fallback; source withholds the vendor label |
| Virginia | Medical Assistance Services · Medicaid contractual services | $20,825,541,115.81 | Reimportable: 4,161 rows |
| Washington | Health Care Authority · direct payments to providers | $13,123,875,932.70 | Reimportable: 36,275 rows; protected payees may remain unnamed |

The archive values and source-row counts above are reproduced from the repository's preserved official-source summaries and detail files. Official routes: [California Controller workbook](https://www.sco.ca.gov/Files-ARD/BudLeg/Expenditures_Supplement_23_24.xlsx), [Florida vendor payments](https://myfloridacfo.com/transparency/vendorpayments), [Georgia OpenGov](https://www.open.ga.gov/openga/payment/index), [Illinois statewide expenditures](https://illinoiscomptroller.gov/financial-reports-data/expenditures-state-spending/statewide), [Indiana Volume II](https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf), [Kentucky transparency API](https://secure2.kentucky.gov/TransparencyWebApi/v1/SpendingAndVendorDetail), [Louisiana Checkbook](https://checkbook.la.gov/expenditures2.cfm), [Massachusetts CTHRU](https://cthru.data.socrata.com/resource/pegc-naaa.json), [Michigan SIGMA](https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload), [Minnesota Transparency](https://mn.gov/mmb/transparency-mn/), [Missouri Accountability Portal](https://mapyourtaxes.mo.gov/), [New Jersey YourMoney](https://data.nj.gov/Government-Finance/YourMoney-Agency-Expenditures/apet-rp2i), [New York Open Book](https://wwe2.osc.state.ny.us/transparency/checkbook/chkbkMain.cfm), [North Carolina FY2024 data](https://www.nc.gov/nc-budget-data-fy2024-49-mb/download?attachment=), [Ohio Checkbook](https://checkbook.ohio.gov/State/Expenses/Agency.aspx), [Tennessee Checkbook](https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Vendor.csv), [Texas cash report](https://comptroller.texas.gov/transparency/reports/cash-report/), [Utah highest-paid vendors](https://transparent.utah.gov/entities/highest-paid-vendors), [Virginia Data Point](https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures), and [Washington vendor payments](https://fiscal.wa.gov/Spending/VendorPayments2325.xlsx).

## Blockers and guardrails

- **No official crosswalk:** none of the reviewed states publishes a numeric bridge assigning the Census-to-GAAP residual across functions, agencies, or accounts. These breakdowns explain each published control on its own basis; they do not explain causally why the controls differ.
- **Published ceiling:** Census current-operations items, SOA functions, and single appropriation/object rows can legitimately remain above $10B. Splitting them with a differently scoped source would violate the source-native requirement.
- **Recipient versus payer:** school-system state-source revenue and state intergovernmental expenditure are adjacent but not identical universes. Their difference must remain visible.
- **Privacy and suppressed labels:** unnamed Medicaid recipients, provider payments, and Utah's blank vendor may be decomposable numerically without yielding public identities. Do not infer names.
- **Period and precision:** accept a deeper schedule only when its fiscal period, sign convention, entity boundary, and source precision match the parent and its children reproduce the parent exactly.
