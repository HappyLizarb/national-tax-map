# Source-backed research: large education and healthcare accounts

Checked 2026-08-31. This note asks one narrow question: can a remaining
$1 billion-$10 billion education- or healthcare-related row be replaced by
official children that preserve the same fiscal period, reporting entity,
measure, accounting boundary, and sign?

## Finding

There is no national source that can honestly break every remaining row below
$1 billion. The useful source-backed work falls into three classes:

1. Expand source categories that the repository currently rolls into a large
   residual even though the official children are already public.
2. Add one exact, same-record salary/non-salary split to large IPEDS functional
   expense rows.
3. Treat every other large terminal line as a publication ceiling unless an
   official state schedule reconciles to it in cents on the same basis.

Mechanical slices are not accounts and do not cure a source-publication
ceiling. Supplemental views are useful context but must not be promoted to
children of a non-comparable parent.

## National sources

| Source | Exact additive depth | What remains a ceiling | Repository consequence |
| --- | --- | --- | --- |
| CMS FY2024 Financial Management Report | State, program, service/administration category, and financing measure within the FY2024 CMS control | A large annual category such as Medicaid MCO; CMS does not publicly release the full category by quarter, plan, provider, or beneficiary | Expand repository-made `Other services and administration` and whole-state residuals back to their published category rows; do not invent children for a large MCO line |
| Census FY2024 State Government Finances | Published item codes, including current operation plus capital for direct functions and recipient-government type for intergovernmental expenditure | Any remaining large E/F/M/Q item code; the individual-unit file does not add agency, program, vendor, district, or provider detail | Keep current/capital and recipient-type children where present; label the terminal item code as the Census publication ceiling |
| NCES/IPEDS FY2024 Finance | Institution-record functional expenses; each GASB function also publishes salaries and wages | Benefits, O&M, depreciation, interest, and other natural classes are institution-wide, not function-specific; full parent/system reports remain combined | Add salary/wages plus an exact non-salary residual to large functional rows; retain IPEDS as supplemental to Census higher education |
| NCES NPEFS and Census F-33 | Function/object detail for the all-school-system universe and district-level recipient-side finance | These do not preserve the state-government entity or expenditure measure | Keep as supplemental education views, never as children of a Census state-government row without an exact bridge |
| OMB Public Budget Database, Treasury Combined Statement, USAspending | Federal account/subfunction/availability or DATA Act Treasury-account detail within the source's own control | They do not deepen state accounts; DATA Act program activity/object class does not generally preserve an OMB account/subfunction net-outlay row | Use only for federal rows and only after exact source-control reconciliation |

### CMS-64 and CHIP

CMS says states submit actual Medicaid expenses on Form CMS-64 each quarter,
but the public FY2024 Financial Management Report is the finalized four-quarter
state aggregate by service and administration category. The report separates
Medicaid medical assistance, administration, and CHIP workbooks; total
computable, federal share, and non-federal share are alternative measures, not
children of one another. See the official [MBES/CBES expenditure-report page](https://www.medicaid.gov/medicaid/financial-management/state-budget-expenditure-reporting-for-medicaid-and-chip/expenditure-reports-mbes/cbes),
[FY2024 archive](https://www.medicaid.gov/medicaid/financial-management/downloads/financial-management-report-fy2024.zip),
and [CMS-64.9 service definitions](https://www.medicaid.gov/medicaid/downloads/cms-649-base-category-of-services-definition.pdf).

This produces one immediate exact opportunity. The federal HHS panel currently
contains large rows named `Other services and administration` and several
whole-state rows. Those are repository aggregates, not CMS terminal accounts.
The same FY2024 archive already publishes their service and administration
children, and the state CMS panels already carry the complete nonzero category
schedule. Those children can replace the aggregate rows exactly while
preserving state, federal fiscal year, financing measure, and sign.

The opportunity stops at a large source category. CMS's methodology comparison
says the public CMS-64 release covers four fiscal-year quarters, while a user
seeking a specific full CMS-64 quarter must have MBES access, which is limited
to CMS staff and contractors, or request an extract. It also warns that TAF can
be more granular but cannot reliably reproduce CMS-64 categories: service
codes are incomplete or inconsistent, non-claim transactions can be absent,
and the two systems use structurally different classifications. See the
official [TAF/CMS-64 methodology brief](https://www.medicaid.gov/dq-atlas/downloads/supplemental/9020-TAF-CMS-64-Comparison.pdf).

Therefore:

- A FY2024 CMS row such as New Jersey Medicaid MCO federal share is a public
  annual category ceiling.
- A state MCO annual statement, capitation report, encounter extract, drug
  utilization file, or actuarial report is supplemental unless its signed
  children reproduce the CMS-64 category and financing measure exactly.
- CMS total computable, federal share, and non-federal share must remain three
  alternative panels.

### Census State Government Finances

The FY2024 Census files preserve a real but shallow hierarchy. The official
technical documentation identifies current-operation and capital pairs such as
E12/F12 for elementary and secondary education, E18/F18 for other higher
education, E32/F32 for health, and E36/F36 for own hospitals. It separately
identifies intergovernmental lines such as M12 and Q12 by recipient-government
type. See the [FY2024 dataset page](https://www.census.gov/data/datasets/2024/econ/state/historical-datasets.html),
[FY2024 technical documentation](https://www2.census.gov/programs-surveys/state/technical-documentation/complete-technical-documentation/statetechdoc2024.pdf),
and [individual-unit data archive](https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN03.zip).

The individual-unit product does not reveal a hidden agency/program/vendor
tier. For state governments it repeats the state unit's published finance item
codes and labels. Once a current-operation, capital, or recipient-type line is
still at least $1 billion, the uniform national Census publication has ended.

NPEFS and F-33 go deeper for schools, but on a different boundary. NPEFS covers
state-level public elementary/secondary systems and F-33 reports local school
system finances and recipient-side revenues; neither is an exact child schedule
of a state government's Census intergovernmental-expenditure item. See NCES's
[NPEFS scope](https://nces.ed.gov/ccd/stfisinfo.asp), the official
[FY2024 NPEFS release](https://nces.ed.gov/use-work/resource-library/report/first-look-ed-tab/revenues-and-expenditures-public-elementary-and-secondary-education-school-year-2023-24-fiscal-year),
and Census's [FY2024 F-33 tables](https://www.census.gov/data/tables/2024/econ/school-finances/secondary-education-finance.html).

### IPEDS Finance

IPEDS is exact within an institution or a permitted parent/system Finance
record, not within a Census state-government code-18 parent. The Finance period
is the institution's most recent 12-month fiscal year ending before October 1,
2024, and NCES permits partial or full parent/child reporting where institutions
share financial statements. See the official [FY2024 GASB Finance form](https://nces.ed.gov/ipeds/use-the-data/download-survey-material/2024/finance/package_5_68.pdf),
[2024 complete-data listing](https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx?gotoReportId=7&rtid=1&year=2024),
and [parent/child reporting rules](https://nces.ed.gov/ipeds/report-your-data/data-tip-sheet-reporting-finance-data-multiple-institutions).

The repository now carries the complete 50-state HD2024 universe in
`data/ipeds-public-institution-universe-fy2024.json`: all 1,589 active,
degree-granting public institutions selected by `CONTROL=1`, `DEGGRANT=1`, and
`SECTOR` 1 or 4. That is 826 public four-year and 763 public two-year
institutions. The GASB and FASB Finance files publish 1,546 separate records;
43 institutions have no separate Finance row and receive no inferred amount.
All 97 published records at or above $1 billion map to exact repository
functional panels. No public two-year record reaches the threshold; Ivy Tech
Community College is the largest at $643,478,551.

The source exposes one unused exact child dimension. The repository's linked
aggregate ZIP contains member `IPEDS202425.accdb`; use its table `F2324_F1A`,
keyed by `UNITID`. Part C-1 publishes current-year total expense in column 1
and salaries and wages in column 2 for each function:

| Function | Total | Salaries and wages |
| --- | --- | --- |
| Instruction | `F1C011` | `F1C012` |
| Research | `F1C021` | `F1C022` |
| Public service | `F1C031` | `F1C032` |
| Academic support | `F1C051` | `F1C052` |
| Student services | `F1C061` | `F1C062` |
| Institutional support | `F1C071` | `F1C072` |
| Auxiliary enterprises | `F1C111` | `F1C112` |
| Hospital services | `F1C121` | `F1C122` |
| Independent operations | `F1C131` | `F1C132` |
| Other functional expenses | `F1C141` | `F1C142` |
| Total expenses | `F1C191` | `F1C192` |

The same exact split covers public institutions using FASB in table
`F2324_F2`: Instruction `F2E011`/`F2E012`, Research `F2E021`/`F2E022`,
Public service `F2E031`/`F2E032`, Academic support `F2E041`/`F2E042`,
Student services `F2E051`/`F2E052`, Institutional support
`F2E061`/`F2E062`, Other functional expense `F2E121`/`F2E122`, and total
expense `F2E131`/`F2E132`. The net-grant-aid line has no salary child. The
official [FY2024 FASB Finance form](https://nces.ed.gov/ipeds/use-the-data/download-survey-material/2024/finance/package_5_86.pdf)
defines the same total/salary columns.

For each large functional row, two exact children are available:

```text
salary/wages = published function salary field
non-salary expense = published function total - published function salary field
```

The split must use integer dollars, validate `0 <= salary <= total`, reconcile
to the function in cents, preserve `UNITID`, and retain the reporting record's
`FYBEG`/`FYEND` and parent/child status. The scholarship/fellowship function
does not publish a salary child and should remain terminal.

Part C-2 publishes benefits, operation and maintenance, depreciation, interest,
and other natural expenses only for the institution total. Those rows are an
alternative classification and cannot be allocated across instruction,
research, hospitals, or another function. A salary/non-salary residual may
still exceed $1 billion at the largest university hospitals; that residual is
then the IPEDS function's public ceiling.

### Institution-source reconciliation checks

The largest hospital residuals were also checked against institution-issued
FY2024 financial reports. These reports contain useful natural-class schedules,
but their medical-center or consolidated boundaries do not reproduce the IPEDS
hospital-function parent. None of the following candidates can therefore be
promoted as an exact child schedule:

| Institution/source | Repository IPEDS hospital row | Institution-issued FY2024 comparator | Result |
| --- | ---: | ---: | --- |
| University of Michigan [audited report](https://finance.umich.edu/sites/default/files/2024-10/2024%20Consolidated%20UM%20Financial%20Report.pdf) | $7,759,117,000 | $7,779,000,000 patient care; $8,039,349,000 auxiliary enterprises | Neither functional control reconciles |
| UC Davis [medical-centers report](https://www.ucop.edu/uc-controller/financial-reports/systemwide-reports/medical-center-reports/23-24/medical-center-report-2024.pdf) | $3,329,631,178 | $3,784,176,000 medical-center operating expenses | Different medical-center boundary |
| UC Irvine, same report | $2,092,793,661 | $2,515,886,000 | Different medical-center boundary |
| UCLA, same report | $3,368,735,767 | $3,706,033,000 | Different medical-center boundary |
| UC San Diego, same report | $3,114,909,749 | $3,524,397,000 | Different medical-center boundary |
| UC San Francisco, same report | $6,540,601,905 | $7,136,423,000 | Different medical-center boundary |
| University of Kentucky [audited report](https://www.uky.edu/trustees/file/4211/download?token=CCmo9bBJ) | $3,763,806,956 | $3,708,908,000 hospital and clinics | Does not reconcile |
| University of Iowa [health-care report](https://www.healthcare.uiowa.edu/marcom/uihealthcare/annual_reports/2024_annual_report.pdf) | $3,187,585,000 | $3,621,049,646 health-care enterprise expenses | Different enterprise boundary |
| University of Virginia [audited report](https://uvafinance.virginia.edu/sites/uvafinance/files/2024-12/2024.12_FY24_UVA_AnnFinRpt_bvo_8.pdf) | $3,115,523,649 | $3,158,220,000 Medical Center operating expenses | Does not reconcile |

The differences are not rounding residuals: they reflect component units,
clinical operations, depreciation, affiliated hospitals, and other survey
mapping decisions. Using the comparator categories as IPEDS children would
change the reporting entity or function even though both sources cover FY2024.

### Federal OMB, Treasury, and USAspending

The OMB Public Budget Database outlay file is organized by agency, bureau,
account, subfunction, BEA category, grant/non-grant, and on/off-budget status.
The Combined Statement can add period-of-availability detail. Those are valid
federal children in their own controls; see OMB's [supplemental materials](https://www.whitehouse.gov/omb/information-resources/budget/supplemental-materials/),
[Public Budget Database guide](https://www.whitehouse.gov/wp-content/uploads/2023/03/db_guide_fy2024.pdf),
and Treasury's [FY2024 Combined Statement](https://fiscal.treasury.gov/accounting/combined-statement-of-receipts/files/cs2024).

USAspending File B publishes outlays by Treasury Account Symbol, budget
function, program activity, object class, and disaster code, but it is not an
automatic child schedule for an OMB account/subfunction net-outlay row. It must
first reproduce the exact OMB parent, including subfunction and sign. The
official [USAspending download guide](https://www.usaspending.gov/data/about-the-data-download.pdf)
describes the File A/B/C boundaries. Object-class obligations and award-only
data are not substitutes for actual net outlays.

## Representative state-source checks

These checks target the largest reported gaps. They show where further work is
worth attempting and where a seemingly detailed source changes the measure.

### Education

- **Maryland Census elementary/secondary intergovernmental expenditure
  ($9.995 billion).** Maryland's official FY2008-FY2024 payment dataset exposes
  agency, vendor, date, fiscal period, category, and amount. It is a promising
  recipient schedule, but it is a cash-payment system rather than an automatic
  Census Q12/M12 child. It may be promoted only if FY2024 education payments,
  reversals, and covered local governments reproduce the Census parent exactly.
  Otherwise it remains supplemental. See the official
  [Maryland payments dataset](https://opendata.maryland.gov/Budget/State-of-Maryland-Payments-Data-FY2008-to-FY2024/7syw-q4cy).

- **Arizona school-district intergovernmental expenditure ($9.001 billion).**
  Arizona OpenBooks includes state and participating local transactions, but
  mixing state payments with school-district books changes the entity. Use only
  the state ledger and require an exact signed bridge to the Census item. See
  [Arizona OpenBooks](https://openbooks.az.gov/).

- **Texas Foundation School transfer ($8.961 billion).** The Cash Report line is
  one transfer into the Foundation School account. Later grants or payee
  transactions may explain the destination, but they are not children of the
  transfer unless the Comptroller's own FY2024 data link them and reconcile in
  cents. Texas's dashboard can drill by appropriation, object, and payee; its
  scope is described on the official [state revenue and spending page](https://comptroller.texas.gov/transparency/revenue/).

- **Large Census higher-education rows.** IPEDS institution expenses and
  enacted state budgets use different entity, accounting, or
  measure boundaries. Preserve them as overlays. The Census E18/F18 line is
  terminal nationally after current/capital detail.

### Healthcare

- **New Jersey CMS-64 Medicaid MCO federal share ($9.988 billion).** New Jersey
  insurer annual statements can split plan revenue or premiums, not the federal
  share reported on CMS-64. They are supplemental unless an official state
  schedule explicitly allocates and reconciles the FY2024 CMS-64 claim by plan.

- **Tennessee FY2024 managed-care program expenditure ($9.512 billion).** The
  TennCare annual report publishes the state-fiscal program category. MCO
  financial statements, actuarial reports, and legislative quarterly estimates
  use plan, rate-setting, statutory-accounting, or cash-estimate measures. They
  are not exact children of the annual program expense without a signed bridge.
  See TennCare's official [annual-report archive](https://www.tn.gov/tenncare/information-statistics/annual-reports.html),
  [actuarial-report archive](https://www.tn.gov/tenncare/information-statistics/actuarial-report.html),
  and [MCO financial reports](https://www.tn.gov/commerce/tenncare-oversight/reports/managed-care-organization-financial-reports.html).

- **Wisconsin Medicaid-services appropriation lines.** The FY2024 AFR appendix
  is already at agency/program/appropriation/fund depth. A remaining large PRF
  or GPR line is the published AFR ceiling; claims, provider payments, or CMS-64
  financing are different measures unless the state accounting system supplies
  a reconciled child schedule. See Wisconsin's official
  [FY2024 AFR appendix](https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf).

- **Ohio Medicaid payee adjustments.** Ohio Checkbook is an exact source for
  its own FY2024 agency/fund/appropriation/expense/payee path. Where the public
  portal stops at `Interest and Coding Adjustments`, the resulting $9.723
  billion federal-side row is a source publication ceiling, not permission to
  assign the adjustment to programs or providers. See
  [Ohio Checkbook](https://checkbook.ohio.gov/State/Expenses/Agency.aspx?fiscalyear=2024).

- **State drug, encounter, and plan files.** These may offer valuable calendar-
  year product, beneficiary, provider, or plan detail. CMS specifically warns
  that TAF/T-MSIS detail does not reliably map to CMS-64 categories. Keep such
  panels supplemental unless they exactly reproduce the parent period,
  financing measure, and signed amount.

## Promotion rule and next pass

Promote a candidate schedule to an account breakdown only when all checks pass:

1. The official source names the same parent or supplies an explicit crosswalk.
2. Fiscal dates match; calendar, state fiscal, federal fiscal, and institution
   fiscal years are not silently exchanged.
3. Reporting entity and consolidation boundary match.
4. Measure and accounting basis match: expenditure versus revenue, actual
   versus budget, cash versus accrual, gross versus net, and federal versus
   total computable share.
5. Signed children reconcile to the parent in integer cents with no invented
   `Other` or prorated residual.
6. Every promoted child below $1 billion is source-published or a transparent
   exact residual of published components; identity suppression is preserved.

The shortest defensible next pass is therefore:

1. Expand every CMS `Other services and administration` and whole-state row
   from the already-ingested FY2024 category schedule.
2. Add the IPEDS salary/non-salary split for every large GASB functional row.
3. Run state-ledger reconciliation only for the largest Census/ACFR ceilings,
   beginning with Maryland education, Arizona education, New Jersey Medicaid,
   Tennessee managed care, Wisconsin Medicaid, and Ohio adjustments.
4. Leave any failed or unavailable bridge explicitly labeled as a public
   source ceiling rather than replacing it with mechanical account names.
