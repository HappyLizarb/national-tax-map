# FY2024 legislative-budget actuals pilot

Research completed 2026-08-24. This note applies the agreed rule: use each state's recorded fiscal-year actual expenditures on its official legislative budget basis; do not substitute appropriations; retain officially reported transfers but disclose them; and publish a documented lower bound when public sources do not establish a complete total.

## Recommended pilot controls

| State | FY2024 control | Status | Important qualification |
| --- | ---: | --- | --- |
| California | **$295,909,349,000** | Official complete for the published governmental-cost-funds budget universe | The existing expenditure-workbook import totals $295,909,342,678, which is $6,322,000 below the report total and is not reconciled. |
| Pennsylvania | **$116,815,965,000** | Official complete for the Commonwealth operating program | “Actual” includes encumbrances and certain balances retained for commitments; it is not cash disbursements alone. |
| Texas | **≥ $171,533,710,000*** | Documented budget-basis actual subtotal | Sum of the ACFR's legally adopted budget schedules; no public statewide LBB/ABEST actual total was established, and the schedules do not cover the full reporting entity. |
| Washington | **≥ $71,260,282,662*** | Documented budget-basis actual subtotal | Sum of 13 governmental-fund groups in the official Budget-to-Actual Detail Report; proprietary and nonappropriated activity is outside the report. |

These four numbers are not comparable across states. “Complete” above means complete only for the issuing state's named budget universe, not for every entity in its GAAP reporting entity.

## California

### Selected control

- **Issuing authority:** California State Controller's Office (SCO).
- **Source:** *Budgetary/Legal Basis Annual Report FY 2023-24*, Comparative Statements — All Governmental Cost Funds, pp. 13–15, and Detailed Statement of Expenditures by Function and Character, pp. 457–469. The SCO also publishes the supporting FY2024 expenditure workbook. [Annual report (PDF)](https://www.sco.ca.gov/Files-ARD/BudLeg/blbar2324.pdf) · [official report archive](https://www.sco.ca.gov/ard_state_annual_budgetary.html) · [official supplement archive](https://www.sco.ca.gov/ard_state_annual_budgetary_sppl.html) · [FY2024 expenditure workbook](https://www.sco.ca.gov/Files-ARD/BudLeg/Expenditures_Supplement_23_24.xlsx)
- **Fiscal period:** July 1, 2023–June 30, 2024.
- **Publication/revision date:** the report does not print a publication date; the official PDF metadata is dated June 19, 2025. No later FY2024 restatement was found on the SCO archive as of the research date.
- **Audit status:** **unaudited**. Note 1 says departments certify the source data and the SCO has not audited it (report p. 17).
- **Exact published total and precision:** **$295,909,349 thousand**, or **$295,909,349,000**, on report pp. 14 and 452/469. The app should display `$295.9B` but preserve the source's $1,000 precision.
- **Accounting basis:** flow of current financial resources; governmental cost funds generally use modified accrual unless law provides otherwise. Expenditures include obligations incurred but unpaid at June 30 and incomplete interfund settlements. Three Caltrans shared funds use cash-basis reporting under cited statutes (report pp. 18–19).
- **Fund/entity boundary:** “All Governmental Cost Funds,” classified as General Fund and Special Fund types. The report covers financial activities subject to direct or indirect fiscal control and State Treasury funds, but the selected total is not a total of every nongovernmental cost fund.
- **Transfers:** transfers from governmental cost funds to nongovernmental cost funds are recorded as governmental-cost-fund expenditures even if the recipient fund spends later. The published total is therefore retained without an app-created elimination, with this treatment disclosed.
- **Encumbrances:** year-end purchase orders, contracts, and salary commitments are excluded from liabilities and expenditures and reserved against fund balance (report p. 18).
- **Known exclusions:** Bond Funds, public-service enterprise funds, working-capital/revolving funds, retirement funds, and trust/agency funds are nongovernmental cost funds and are outside this headline. Only University of California transactions tied to legislative support and capital-outlay appropriations are included; fairs likewise appear only for state appropriations (report pp. 17–18).
- **Public universities/component units:** UC's full operations are outside the budget control. The report includes only legislative appropriations and their expenditure. A same-period expanded total cannot be published until UC and other qualifying ACFR-unit spending is reconciled against state support and other inter-entity flows.
- **Official same-basis revenue/balance:** the report explicitly publishes **$272,580,980 thousand** of FY2024 governmental-cost-fund revenue. Do not infer a deficit by subtracting expenditures; use only the report's statements of changes in fund balance if a balance is later displayed.
- **Status:** **official complete for the published governmental-cost-funds universe**. The state is not migration-complete because itemization does not reconcile at source precision.

### Reconciliation issue

The repository's existing import of the official expenditure workbook totals **$295,909,342,678**. The PDF's control is **$295,909,349,000**, leaving **$6,322,000 unitemized**. This exceeds the PDF's $1,000 rounding interval. Preserve the PDF control, show itemized coverage, and investigate the excluded or differently classified workbook rows before marking California migrated.

## Pennsylvania

### Selected control

- **Issuing authority:** Commonwealth of Pennsylvania, Governor's Office of the Budget. The Office prepares the budget used by the General Assembly and administers enacted appropriations. [Office budget responsibilities](https://www.pa.gov/agencies/budget/programs-and-services/for-commonwealth-agencies-and-employees/for-agencies/budget)
- **Source:** *Governor's Executive Budget 2025-2026*, “Summary of Revenues and Expenditures for the Operating Program,” p. B3 (physical PDF p. 66); accounting rules appear on Reader's Guide pp. 12 and 16. [Official FY2025-26 budget book (PDF)](https://www.pa.gov/content/dam/copapwp-pagov/en/budget/documents/publications-and-reports/commonwealthbudget/past-budgets-to-2021-22/2025-26-budget-documents/2025-26%20budget%20book.webversion.pdf) · [official budget archive](https://www.pa.gov/agencies/budget/publications-and-reports/commonwealth-budget)
- **Fiscal period:** July 1, 2023–June 30, 2024.
- **Publication/revision date:** released with the Governor's budget on **February 4, 2025**. [Official release](https://www.pa.gov/governor/newsroom/2025-press-releases/governor-shapiro-unveils-2025-26-budget-proposal) The archived PDF metadata was modified March 21, 2025; no announced FY2024 restatement was identified.
- **Audit status:** **unaudited budget document**. Pennsylvania separately publishes an audited GAAP ACFR, but that is not the basis of this control. [FY2024 ACFR archive and audit description](https://www.pa.gov/agencies/budget/publications-and-reports/annual-financial-report)
- **Exact published total and precision:** FY2023-24 **Total Operating Expenditures = $116,815,965 thousand**, or **$116,815,965,000**, on p. B3. The app should display `$116.8B` and preserve $1,000 source precision.
- **Accounting basis:** modified cash budget basis. Receipts are recognized when posted; expenditures are recorded when requisitions and invoices are posted. The budget explicitly defines an “Actual Year” to include expenditures and encumbrances chargeable through June 30, balances retained for certain commitments, and later supplemental appropriations. Continuing-appropriation actuals also include available balances (Reader's Guide pp. 12, 16).
- **Fund/entity boundary:** the “all funds” operating program includes General Fund, Motor License Fund, Lottery Fund, Federal Funds, and more than 150 Other Funds contributing to the operating program (guide p. B2). The control is an **operating-program** total, not a GAAP government-wide expense total.
- **Transfers:** p. B2 says total operating program expenditures are adjusted for lapses and fund transfers; p. B3 subtracts General, Motor License, and Lottery Fund lapses and reports the Budget Stabilization Reserve transfer separately. Department schedules also identify transfers omitted to avoid double counting. A statewide transfer-elimination schedule was not found, so the published total must be used as issued.
- **Encumbrances:** included in the state's “actual” budget amount, including certain future-delivery commitments. This must be disclosed because the number is broader than paid cash.
- **Known exclusions:** the budget basis does not include all funds and entities in the GAAP reporting entity. The budget book itself says GAAP reporting includes agencies and authorities usually considered independent of the Commonwealth for budgetary purposes (Reader's Guide p. 12). Large capital projects are authorized through a separate capital-budget process; the selected source labels its control “Operating Expenditures,” so it does not establish a universal total of capital-project cash disbursements.
- **Public universities/component units:** legislative support to public/state-related universities can appear as budget expenditures, but their full operations are not proved to be inside the operating-program total. Their own expenses cannot be added without matching and removing Commonwealth support and other transfers.
- **Official same-basis revenue/balance:** p. B3 reports FY2023-24 **Total Revenues = $116,238,097 thousand** and separate General, Motor License, and Lottery ending balances. Do not calculate a new surplus/deficit.
- **Status:** **official complete for the stated Commonwealth operating-program universe**. Add a scope disclaimer for capital projects and independent reporting-entity units.

### Expanded total

Unavailable. The FY2024 ACFR is audited and covers the broader reporting entity, but it uses GAAP and includes component units. No official schedule was found that aligns every component unit to the budget fiscal period and eliminates budget support and other inter-entity flows. [FY2024 Pennsylvania ACFR (PDF)](https://www.pa.gov/content/dam/copapwp-pagov/en/budget/documents/publications-and-reports/annualfinancialreport/june-30-2024%20acfr.pdf)

## Texas

### Selected documented subtotal

- **Issuing authority:** Texas Comptroller of Public Accounts; the schedules compare actuals with the legally adopted state budget. The Legislative Budget Board (LBB) remains the authority for the appropriation structure. [LBB budget portal](https://www.lbb.texas.gov/budget.aspx) · [Comptroller FY2024 ACFR page](https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2024/)
- **Source:** *State of Texas 2024 Annual Comprehensive Financial Report*, Budgetary Comparison Schedules, report pp. 232–234 and 266–268. [Full FY2024 ACFR (PDF)](https://comptroller.texas.gov/transparency/reports/comprehensive-annual-financial/2024/96-471.pdf)
- **Fiscal period:** September 1, 2023–August 31, 2024.
- **Publication/revision date:** **February 28, 2025**, per the ACFR transmittal letter (report p. 3).
- **Audit status:** the ACFR basic financial statements were audited by the State Auditor's Office, but the budgetary comparison schedules are required supplementary information; they are not a separately audited statewide budget-total opinion.
- **Exact subtotal and precision:** **$171,533,710 thousand**, or **$171,533,710,000**, calculated from the published actual-expenditure columns: General Fund $150,662,883,000; State Highway Fund $18,308,218,000; Texas Motor Vehicles Fund $188,074,000; Water Development Fund $51,273,000; Judicial Fund $70,111,000; Available School Fund $2,108,964,000; Other Nonmajor Special Revenue Funds $144,187,000; Property Tax Relief Fund $0. The source precision is $1,000.
- **Accounting basis:** the note to the schedules says the state's budget is prepared on a **cash basis** and the actual columns are budgetary-basis cash amounts. This conflicts at the detail level with LBB operating-budget instructions that tell agencies to report prior-year actual expenditures with accruals and encumbrances. Until a public LBB/ABEST statewide aggregate is found, this value must remain starred.
- **Fund/entity boundary:** only the General Fund, State Highway Fund, and the nonmajor special-revenue funds shown in the legally adopted budget schedules. The ACFR notes that certain debt service and Federal Medical Assistance activity is not budgeted by the Legislature and is excluded from the budgetary schedules (report p. 234). It is not the whole Texas reporting entity.
- **Transfers:** transfers in/out are shown as Other Financing Sources (Uses), not expenditures, in these schedules and are not included in the $171.534B subtotal. This avoids adding the explicit transfer rows but does not prove elimination of every interagency purchase embedded in expenditures.
- **Encumbrances:** cash-basis actual expenditures exclude unpaid encumbrances. This is one reason not to equate the subtotal with ABEST agency actuals without an official reconciliation.
- **Known exclusions:** unbudgeted activity identified above, funds outside the displayed schedules, and institutional or agency funds outside the General Appropriations Act bill pattern. The total cannot be labeled official complete.
- **Public universities/component units:** the ACFR reporting entity includes state universities and other units, but the displayed budget schedules do not demonstrate that their full operations are included. Legislative appropriations to universities are evidence for nesting, not permission to add university expenses.
- **Official same-basis revenue/balance:** no single statewide cash-budget revenue or balance total is explicitly reported across these schedules; do not synthesize one for the app.
- **Status:** **documented lower bound / official actual subtotal**, not an official complete statewide total.

### Why the current cash-report total is not the control

The Comptroller's FY2024 Annual Cash Report is a valid treasury-wide cash source, but it answers a different question. It reports **Net Expenditures = $189,929,537,407.68** and **Other Uses = $187,911,889,850.41**. “Other Uses” includes state grants, interagency purchases, interfund transfers, debt principal, and investments. Adding the two—as the current archived app source does to produce $377,841,427,258.09—mixes spending, financing, transfers, and investments and creates major duplication risk. [FY2024 Annual Cash Report (PDF), pp. 1–2](https://comptroller.texas.gov/transparency/reports/cash-report/2024/96-368.pdf) · [official cash-report archive](https://comptroller.texas.gov/transparency/reports/cash-report/)

### Expanded total

Unavailable. A component-unit or university expansion cannot be aligned to the legislative cash budget and stripped of legislative support, interagency contracts, and transfers from the published statewide schedules.

## Washington

### Selected documented subtotal

- **Issuing authority:** Washington State Office of Financial Management (OFM), using legally adopted appropriations; the separate detail report is the ACFR's official legal-budget-compliance support. Legislative budget materials are published jointly through fiscal.wa.gov. [OFM FY2024 ACFR (PDF)](https://ofm.wa.gov/sites/default/files/public/accounting/report/CAFR/2024/ACFR24.pdf) · [legislative agency/spending portal](https://www.fiscal.wa.gov/statebudgets/AgencyInfo)
- **Source:** *State of Washington Budget-to-Actual Detail Report, 2023-2025 Biennium Budgetary Basis, For the Fiscal Year Ended June 30, 2024*. [Official detail report (PDF)](https://ofm.wa.gov/sites/default/files/public/accounting/report/CAFR/2024/Washington_State_Budget-to-Actual_Detail_Report.pdf)
- **Fiscal period:** July 1, 2023–June 30, 2024, the first year of the 2023–25 biennium. The “Actual 2023-2025 Biennium” columns are cumulative through June 30, 2024.
- **Publication/revision date:** **December 2024**; the detail-report PDF metadata was modified December 10, 2024 and the ACFR is dated December 2024.
- **Audit status:** the ACFR basic statements are audited; its budgetary comparisons are required supplementary information, and the 2,437-page detail report is an official unaudited compliance schedule.
- **Exact subtotal and precision:** **$71,260,282,662**, the exact sum of “Total Charges to Appropriations” for the report's 13 top-level governmental fund groups:

| Fund group | FY2024 actual charges |
| --- | ---: |
| General Fund | $54,618,673,184 |
| Motor Vehicle Fund | $5,220,475,309 |
| Multimodal Transportation Fund | $1,261,036,999 |
| Central Administrative and Regulatory Fund | $1,111,465,439 |
| Human Services Fund | $2,073,314,686 |
| Wildlife and Natural Resources Fund | $2,136,784,527 |
| Higher Education Special Revenue Fund | $1,970,491,697 |
| Local Construction and Loan Fund | $203,946,469 |
| General Obligation Bond Fund | $41,797,274 |
| Transportation General Obligation Bond Fund | $747,385,812 |
| Transportation Revenue Bond Fund | $185,821,241 |
| State Facilities Fund | $1,515,834,252 |
| Higher Education Facilities Fund | $173,255,773 |

- **Accounting basis:** governmental funds are budgeted materially in conformity with GAAP, but the budget schedules include only appropriated activity and classify spending by operating versus capital appropriation. Operating appropriations are classified by function; capital appropriations are capital outlays (ACFR pp. 184–185).
- **Fund/entity boundary:** appropriated governmental funds/accounts in the detail report. Proprietary activity and nonappropriated activity are not part of this subtotal. The ACFR explicitly says nonappropriated portions of funds and wholly nonappropriated funds are excluded from the budget schedules (p. 185).
- **Transfers:** “Total Charges to Appropriations” retains **$6,269,821,832** explicitly labeled “Transfers to other funds” across the 13 top-level groups. Some appropriated operating transfers may also be classified within functional charges before GAAP reclassification. Per the agreed product rule, retain the official total and disclose that it is not transfer-eliminated.
- **Encumbrances:** operating encumbrances lapse with the appropriation; capital encumbrances lapse at the end of the biennium unless reappropriated. Outstanding encumbrances against continuing appropriations are reported in restricted, committed, or assigned fund balance rather than as current charges (ACFR p. 184).
- **Known exclusions:** proprietary funds/accounts can incur expenses outside the allotment process; nonappropriated activities are excluded; noncash benefits and resources collected for other governments are also outside budgetary schedules. Therefore, this is not a proven “all budgeted funds” or whole-reporting-entity total.
- **Public universities/component units:** appropriated higher-education activity is present in the Higher Education Special Revenue and Facilities groups, but nonappropriated higher-education activity is explicitly excluded. Full university/component-unit spending cannot be added without matching state appropriations and other transfers.
- **Official same-basis revenue/balance:** the 13 groups report resources and fund balances separately; no combined statewide same-basis revenue or balance is explicitly published, so the app should not create one.
- **Status:** **documented lower bound / official actual subtotal**, not official complete.

### Expanded total

Unavailable. OFM's ACFR provides broader GAAP activity, but no official reconciliation was found that converts all off-budget units to the FY2024 appropriation basis while eliminating state support and inter-entity transfers.

## Migration consequences

1. California can use the official headline immediately, but its department workbook must show **$295,909,342,678 of $295,909,349,000** until the $6.322M gap is resolved.
2. Pennsylvania can use the official operating-program headline with starred disclosures for encumbrances, capital scope, and independent entities.
3. Texas must not use the current $377.841B cash-report sum. Use the starred $171.534B documented subtotal unless a complete public LBB/ABEST FY2024 aggregate is obtained.
4. Washington must use the starred $71.260B governmental appropriations subtotal and explicitly disclose the $6.270B of labeled transfers retained in it.
5. No pilot state currently has evidence sufficient for a parenthetical expanded-government total without double counting.
