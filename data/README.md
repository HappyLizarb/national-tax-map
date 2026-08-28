# Data layout

Each jurisdiction directory has one `.js` Census summary module and only the JSON files referenced by that module or by a canonical budget record's `itemizationUrl`. Detail JSON uses the shared row schema:

`[subAgency, program, amount, sourceAmount, sourceRows]`

Each pie uses the raw amount from one official itemized source layer. `itemizedTotal` is the exact sum of the summary rows; `comparison` links to a separate source layer without allocating a difference to an invented receiver. All 50 state pies use the Census FY2024 function/category file; former state-specific layers are archived under `archive-state-source/`. The federal pie uses Treasury FY2024 MTS budget functions; the former USAspending agency layer is archived under `data/federal/archive-agency-source/`. The chart normalizes positive slices to 100%; signed negative adjustments remain listed in the source layer. A canonical budget record names newly validated partial coverage with `itemizedAmount` and `itemizationUrl`. Archived state-source layers may be loaded only as nested itemization evidence when a canonical budget record names a validated `itemizedAmount`; they never replace or add to the canonical headline.

`state-financial-results.js` is the separate 50-state government-wide GAAP
control: resources, expenses, annual change, and fiscal-year-end net position
from one primary-government boundary per state. It is not mixed with Census or
itemized source rows.

## Research commentary

The former root-level research notes are preserved losslessly as structured records under `data/research/`. Every record names its original file and related datasets, retains the full Markdown commentary, extracts its evidence links, and includes a SHA-256 checksum of the commentary.

- `source-audits.json`: federal and state source discovery, access, and import decisions.
- `accounting-controls.json`: federal reconciliations, state audited controls, tax-receipt controls, and Census-versus-ledger scope notes.
- `federal-methods.json`: USAspending endpoint, measure, object-class, and reconciliation methods.
- `tax-policy.json`: 2026 brackets and jurisdiction tax-rate evidence.
- `household-estimate.json`: household percentile and simplified tax-estimate methodology.

These files are commentary/evidence datasets, not numerical inputs loaded into the map. `relatedDatasets` records where each note applies; the applicable numerical datasets also expose a `researchCommentary` path where doing so does not change their jurisdiction-key schema.

Imported source-native panels live only in their jurisdiction detail JSON. Intermediate context files and dated research notes are removed once their rows, source links, and accounting-basis notes are embedded there.
