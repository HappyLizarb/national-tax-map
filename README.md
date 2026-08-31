# Public Ledger

A source-linked map of FY2024 U.S. federal and state spending, 2026 tax rates,
and household income/property-tax estimates.

## Run

```sh
python3 -m http.server 4173
```

Open <http://localhost:4173>, or run `node tests/test.js` to validate the data.

## Repository layout

- `src/` contains the browser application and fiscal model.
- `styles/` contains the page stylesheets.
- `tests/` contains the dependency-free Node validation suite.
- `data/` contains the source-linked fiscal and tax datasets.
- `vendor/` contains the pinned map assets and their licenses.

## What it shows

- Federal reported receipts, outlays, and deficit; all-state FY2024 GAAP
  resources, expenses, and fiscal-year-end net position.
- A standardized Census state-finance view with FY2024 revenue and expenditure
  for all 50 states; no calculated state surplus or deficit.
- Tax rates for income, business, sales, property, estates, retirement,
  investments, vehicles, fuel/environment, and special goods.
- Estimated federal and state income plus property tax for four-person
  married-joint households and single working adults at the 25th, 50th, 75th,
  and 90th income percentiles.
- Lazy department → sub-agency → program/payment drill-downs with source links.

## Data layout

- `data/jurisdictions.js` is the startup manifest and fiscal dataset. Each
  jurisdiction owns its map totals, lazy summary path, audited GAAP control,
  optional budget actual, accounting qualification, and source catalogue.
- `data/federal/federal.js` and `data/state-xx/state-xx.js` contain only the
  peer entities used by the pie. Departments, independent agencies, Congress,
  courts, and state legislatures remain peers where reported.
- Files such as `data/federal/federal-department-of-agriculture.json` and
  `data/state-ca/state-ca-department-of-education.json` load only after their
  entity is selected. Single-row entities stay in the summary `.js`; JSON is
  reserved for real breakdowns or supplemental data. Detail rows use
  `subAgency`, `program`, `amount`, `sourceAmount`, and `sourceRows`;
  direct-managed programs repeat the parent name in `subAgency`.
- Summary and detail amounts reconcile in cents to one official itemized source
  layer per jurisdiction. No synthetic `Others`, `coverage-gap`, or unnamed
  residual row is inserted into a pie. Large rows are never divided into
  mechanical threshold slices: they either open an exact same-basis schedule
  or remain visibly labeled as the current public-source ceiling.
- State allocation pies start with the official source archive, add a signed
  `Census adjustments` control, then add a signed `GAAP adjustments` control.
  The two rows reconcile published totals without assigning an unsupported
  difference to a receiver, agency, or program. Selecting either adjustment
  opens its full signed schedule: source-native Census function rows versus
  official archive account/program rows, then audited GAAP expenses versus the
  Census function rows. A source without deeper detail stays as its named control.
- The default state map uses FY2024 full-accrual GAAP total-primary-government
  resources, expenses, and fiscal-year-end net position for all 50 states. Component
  units and fiduciary funds are excluded; qualified audit scopes are disclosed.
- California, Pennsylvania, Texas, and Washington retain legislative-budget
  actual pilots as supporting evidence; they do not replace the signed
  archive-to-GAAP allocation.
- Every state's Census code-18 higher-education row lazy-loads an NCES/IPEDS
  FY2024 overlay. Its 790 official reporting records cover 824 of 826 active
  public four-year institutions; 34 child campuses remain inside nine parent
  records and two federally operated schools have no Finance expense record.
  The $438.231B institutional GAAP view also shows $170.575B of recognized
  federal, state, local, and level-unassigned capital public support. These are
  actual revenues received—not adopted budgets or an additive component of the
  Census state-government total.
- Large IPEDS functional rows add 58 exact same-record expense-composition
  schedules: published salaries and wages plus the reconciled non-salary
  residual. Thirty-four schedules finish below $1 billion; remaining large
  natural-class children stay labeled IPEDS publication ceilings.
- A second nationwide overlay uses SHEEO Grapevine's revised FY2024 state
  appropriations. It identifies $60.156B of public four-year operating support
  within $123.616B of total state higher-education support, including $114.228B
  of tax appropriations. This is a state budget-support ceiling, not an
  institution-by-institution all-funds operating budget.
- Every state view also links its verified official FY2024 budget publications
  with their exact scope and publication ceiling. Only 10 states have complete
  statewide all-funds operating-budget coverage; 9 are partial, 3 publish
  narrower adopted budgets, and 28 fall back to appropriation ceilings.
- Healthcare views preserve all Census health, hospital, public-welfare, and
  veterans components and add six FY2024 CMS-64/CHIP service panels per state:
  total computable spending, federal share, and non-federal financing for each
  program. The three financing views are alternatives, not additive totals.
- The federal HHS view expands 50 repository-created CMS federal-share
  aggregates back to 3,822 already-published FY2024 service and administration
  rows. Large source categories such as annual Medicaid MCO remain public CMS
  category ceilings because the public release has no deeper same-basis tier.
- State defense views surface 92 explicitly named military, National Guard,
  adjutant-general, and veterans agency totals from 41 official state ledgers.
  They remain separate from Census because no uniform state-defense function
  exists; absent agency detail is not reported as zero, and legal public-defense
  offices and military schools are excluded.
- Official totals remain the headline. Documented lower bounds use `≥` and a
  star; unreconciled off-budget entities are disclosed without inventing an
  expanded total. State-specific budget and archive maps remain neutral because
  their standards are not comparable.
- Department rows retain their official archive amounts. Signed reconciliation
  rows establish the Census and GAAP checkpoints; qualified causes remain
  unallocated when no official line-item bridge exists.
- The federal allocation uses the precise FY2024 Treasury MTS net-outlay
  function total. USAspending agency/account and award-recipient data remain
  separately labeled drill-down layers because they use a different scope.
- A chart's 100% is the positive allocation total within its selected official
  layer. It is not a claim that every source-excluded payment exists in that
  layer; exclusions, blocked exports, and corrupted sources stay documented.

State and executive-agency person-level payroll is excluded. Where an official
source includes named payroll rows, the detail file keeps only an
organization/category aggregate and source-record count; that count is not
presented as a unique employee count. Public congressional office names may
appear in the House disbursement data; staff names are not imported.

Source URLs, accounting qualifications, audit status, and reconciliation rules
live beside the values they explain. Import logs and dated research transcripts
are intentionally omitted; unavailable detail is qualified in the owning row
and is never inferred or silently promoted into a pie.

## Caveats

Spending sources use different scopes and accounting bases. Federal transfers
can reappear in state receipts. Congress currently includes House calendar-2024
disbursements; Senate reports are linked but kept non-additive.

Tax cards are estimates, not tax advice. Family cards assume married filing
jointly with two qualifying children and an owner-occupied home worth about
10× income; individual cards assume a single filer age 18–64 with no
dependents and exclude property tax. Both use wage income and standard
deductions. They exclude payroll and local income taxes, refundable credits,
and individualized deductions.
