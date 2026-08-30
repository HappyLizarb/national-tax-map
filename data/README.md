# Data layout

Each jurisdiction directory has one `.js` Census summary module and only the JSON files referenced by that module, by a canonical budget record's `itemizationUrl`, or by the direct-general university-overlay convention. Detail JSON uses the shared row schema:

`[subAgency, program, amount, sourceAmount, sourceRows]`

Each state pie loads its official itemized source archive, adds a signed `Census adjustments` row to reach the FY2024 Census expenditure control, then adds a signed `GAAP adjustments` row to reach audited primary-government expenses. Each adjustment carries `detailSources` that load every available source-native Census function row and official archive account/program row; sources without a detail file remain as named fallback controls. The GAAP bridge adds the audited expense control and reverses the detailed Census rows. These signed rows reproduce each residual exactly but do not invent causal account matches across unlike classifications. The federal pie uses Treasury FY2024 MTS budget functions. Charts normalize positive slices to 100%, while signed negative adjustments remain visible in the list.

`jurisdictions.js` supplies the 50-state government-wide GAAP controls and the
federal ledger, plus the manifest used to lazy-load each jurisdiction summary.
Every state record keeps its source catalogue, accounting qualification, audit
status, and optional legislative-budget actual next to its map values.

`tax/` owns tax rates, income tiers, consumer costs, and household estimate
assumptions. Source-native panels and their exact reconciliation metadata live
only in the federal or state detail JSON they explain. Cross-dataset rules—basis
matching, integer-cent reconciliation, publication ceilings, and privacy—live in
`jurisdictions.js`; dated research transcripts and import logs are not retained.

Each `state-xx/ipeds-public-university-fy2024.json` is a lazy research overlay
for the state's Census code-18 row. It preserves IPEDS parent/child reporting,
federal-operation and imputation labels, institution fiscal calendars, and an
exact functional-expense reconciliation. A second nested view separates
recognized federal, state, local, and level-unassigned capital public support.
These accrual actuals and revenues are not adopted budgets and are never added
to the Census function total.

The same overlay contains two SHEEO Grapevine panels for revised FY2024 state
higher-education support: one classifies the control by use and highlights
public four-year operating support; the other classifies the same control by
tax, non-tax, other, and returned/multiyear funding. They are alternative views,
not additive totals, and do not claim to be institution all-funds budgets.

Each overlay also carries `budgetSources` from the verified 50-state official
source ledger. The explorer displays each publication's scope, fiscal period,
budget classification, and publication ceiling. `budgetCoverageTier` prevents
appropriation authority from being presented as university spending or as an
all-funds operating budget.

Every direct-general state detail also preserves exact Census current-operations
and capital components for health, hospitals, public welfare, and veterans. Six
separate CMS FY2024 panels classify Medicaid and CHIP actuals by service and
administration under total-computable, federal-share, and non-federal-financing
measures. These are alternative financing views and are not added to Census.

Where the archived official state ledger names a military, National Guard,
adjutant-general, or veterans agency, `supplementalRows` exposes that source-basis
total as a separate defense topic view. These rows may include emergency
management and federal pass-throughs. They are not a uniform Census defense
function, and states without an explicit matching agency are left unquantified.
