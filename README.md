# Public Ledger

A source-linked map of FY2024 U.S. federal and state spending, 2026 tax rates,
and household income/property-tax estimates.

## Run

```sh
python3 -m http.server 4173
```

Open <http://localhost:4173>, or run `node test.js` to validate the data.

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

- `data/spending.js` is the small ledger shell loaded with the map.
- `data/state-financial-results.js` holds the 50 audited state government-wide
  controls and preserves each report's precision and audit caveat.
- `data/department-index.js` maps each jurisdiction to its lazy summary.
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
  residual row is inserted into a pie.
- State allocation pies start with the official research archive, add a signed
  `Census adjustments` control, then add a signed `GAAP adjustments` control.
  The two rows reconcile published totals without assigning an unsupported
  difference to a receiver, agency, or program.
- The default state map uses FY2024 full-accrual GAAP total-primary-government
  resources, expenses, and fiscal-year-end net position for all 50 states. Component
  units and fiduciary funds are excluded; qualified audit scopes are disclosed.
- California, Pennsylvania, Texas, and Washington retain legislative-budget
  actual pilots as supporting research; they do not replace the signed
  archive-to-GAAP allocation.
- Official totals remain the headline. Documented lower bounds use `≥` and a
  star; unreconciled off-budget entities are disclosed without inventing an
  expanded total. State-specific budget and archive maps remain neutral because
  their standards are not comparable.
- Department rows retain their research-archive amounts. Signed reconciliation
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

Historical failed probes and their recovered, bounded, or replacement layers
are recorded in `data/source-failures.json`. Unavailable detail is qualified;
it is never inferred or silently promoted into a pie.

## Research

Research is stored with the datasets as lossless structured commentary. Each
record retains the original Markdown, evidence links, applicable dataset paths,
and a SHA-256 checksum:

- [Federal and state source audits](data/research/source-audits.json)
- [Accounting reconciliations and audited controls](data/research/accounting-controls.json)
- [USAspending methods and object classes](data/research/federal-methods.json)
- [2026 brackets and tax-rate evidence](data/research/tax-policy.json)
- [Household estimate method](data/research/household-estimate.json)
- [State GAAP controls](data/state-financial-results.js)

See [the data layout](data/README.md) for the commentary schema and its relation
to numerical inputs.

## Caveats

Spending sources use different scopes and accounting bases. Federal transfers
can reappear in state receipts. Congress currently includes House calendar-2024
disbursements; Senate reports are linked but kept non-additive.

Tax cards are estimates, not tax advice. Family cards assume married filing
jointly with two qualifying children; individual cards assume a single filer
age 18–64 with no dependents. Both use wage income, standard deductions, and
an owner-occupied home worth about 10× income. They exclude payroll and local
income taxes, mortgage effects, refundable credits, and individualized
deductions.
