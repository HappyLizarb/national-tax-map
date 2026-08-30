# Data layout

Each jurisdiction directory has one `.js` Census summary module and only the JSON files referenced by that module or by a canonical budget record's `itemizationUrl`. Detail JSON uses the shared row schema:

`[subAgency, program, amount, sourceAmount, sourceRows]`

Each state pie loads its official itemized research archive, adds a signed `Census adjustments` row to reach the FY2024 Census expenditure control, then adds a signed `GAAP adjustments` row to reach audited primary-government expenses. Each adjustment carries `detailSources` that load every available source-native Census function row and official archive account/program row; sources without a detail file remain as named fallback controls. The GAAP bridge adds the audited expense control and reverses the detailed Census rows. These signed rows reproduce each residual exactly but do not invent causal account matches across unlike classifications. The federal pie uses Treasury FY2024 MTS budget functions. Charts normalize positive slices to 100%, while signed negative adjustments remain visible in the list.

`jurisdictions.js` supplies the 50-state government-wide GAAP controls and the
federal ledger, plus the manifest used to lazy-load each jurisdiction summary.
Every state record keeps its source catalogue, accounting qualification, audit
status, and optional legislative-budget actual next to its map values.

`tax/` owns tax rates, income tiers, consumer costs, and household estimate
assumptions. Source-native panels and their exact reconciliation metadata live
only in the federal or state detail JSON they explain. Cross-dataset rules—basis
matching, integer-cent reconciliation, publication ceilings, and privacy—live in
`jurisdictions.js`; dated research transcripts and import logs are not retained.
