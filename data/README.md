# Data layout

Each jurisdiction directory has one `.js` Census summary module and only the JSON files referenced by that module or by a canonical budget record's `itemizationUrl`. Detail JSON uses the shared row schema:

`[subAgency, program, amount, sourceAmount, sourceRows]`

Each state pie loads its official itemized research archive, adds a signed `Census adjustments` row to reach the FY2024 Census expenditure control, then adds a signed `GAAP adjustments` row to reach audited primary-government expenses. Each adjustment carries `detailSources` that load every available source-native Census function row and official archive account/program row; sources without a detail file remain as named fallback controls. The GAAP bridge adds the audited expense control and reverses the detailed Census rows. These signed rows reproduce each residual exactly but do not invent causal account matches across unlike classifications. The federal pie uses Treasury FY2024 MTS budget functions. Charts normalize positive slices to 100%, while signed negative adjustments remain visible in the list.

`fiscal/state-financial-results.js` supplies the 50-state government-wide GAAP control:
resources, expenses, annual change, and fiscal-year-end net position from one
primary-government boundary per state. Only its expense control is used as the
final signed allocation checkpoint.

Shared datasets are grouped by purpose: `fiscal/` contains spending controls and
source catalogs, `tax/` contains rates and estimates, and `research/` contains
supporting evidence. `department-index.js` remains at the root as the jurisdiction
manifest.

## Research commentary

The former root-level research notes are preserved losslessly as domain-owned evidence datasets beside the numerical data. Every record names its original file and related datasets, retains the full Markdown commentary, extracts its evidence links, and includes a SHA-256 checksum of the commentary.

- `research/spending-source-audits.json`: federal and state source discovery, access, and import decisions.
- `research/spending-accounting-controls.json`: federal reconciliations, state audited controls, tax-receipt controls, and Census-versus-ledger scope notes.
- `research/federal-methods.json`: USAspending endpoint, measure, object-class, and reconciliation methods.
- `research/legislative-budget-actuals-evidence.md`: budget-basis controls, calculations, sources, and qualifications for the pilot states.
- `research/state-reconciliation-large-row-decomposition.md`: the ≥$10 billion reconciliation inventory, exact splits, and publication ceilings.
- `research/tax-policy-evidence.json`: 2026 brackets and jurisdiction tax-rate evidence.
- `research/household-tax-estimate-evidence.json`: household percentile and simplified tax-estimate methodology.

The evidence files are commentary datasets, not numerical inputs loaded into the map. `relatedDatasets` records where each note applies; the applicable numerical datasets expose their domain-owned paths through `researchCommentary` without changing jurisdiction-key schemas.

Imported source-native panels live only in their jurisdiction detail JSON. Intermediate context files and dated research notes are removed once their rows, source links, and accounting-basis notes are embedded there.
