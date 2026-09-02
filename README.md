# Public Ledger

A source-linked map of FY2024 U.S. federal and state spending, 2026 tax rates,
and household income and property-tax estimates.

**[Open the production site](https://public-ledger.babelloni.chatgpt.site)**

> Public Ledger is a transparency tool, not an accounting standard or tax
> calculator. Source scope and accounting basis vary; the interface keeps those
> differences visible instead of forcing unlike figures into one total.

## What it covers

| Area | Coverage |
| --- | --- |
| Federal spending | FY2024 Treasury receipts, net outlays, deficit, and source-linked agency/account drill-downs |
| State finances | All 50 states, with Census function data and audited primary-government GAAP controls |
| Education | Federal and state programs plus all 1,589 public degree-granting colleges and universities in the 50 states |
| Healthcare | Census health functions, state ledgers, and FY2024 CMS Medicaid/CHIP service and financing views |
| Taxes | 2026 income, business, sales, property, estate, retirement, investment, vehicle, fuel, and special-goods rates |
| Household estimates | Federal and state income tax plus property tax at four income percentiles for two household profiles |

Select a jurisdiction, switch the fiscal view, and open any allocation row to
follow its source-native breakdown and supporting links.

## Data integrity

The repository preserves each source's own accounting basis and reconciles
additive schedules in integer cents.

- State views move through three explicit layers: the official state archive,
  signed Census adjustments, and signed GAAP adjustments. Differences remain
  named controls unless an official line-item bridge exists.
- Every active education- or healthcare-related row of at least $1 billion must
  have an exact same-basis breakdown or an explicit public-source publication
  ceiling. The audit currently reports zero unsupported rows in either domain.
- The IPEDS universe contains 826 public four-year and 763 public two-year
  institutions. All 97 Finance records with at least $1 billion in expenses have
  exact functional-expense panels; no two-year record reaches that threshold.
- Large rows are never split into mechanical threshold slices. Pies contain no
  synthetic `Others`, `coverage-gap`, or unnamed residual recipients.
- Alternative measures—such as total-computable, federal-share, and non-federal
  Medicaid views—are labeled as alternatives and are never added together.

See [the data guide](data/README.md) for schemas, reconciliation rules, IPEDS,
SHEEO Grapevine, CMS, state-defense coverage, and publication-ceiling policy.

## Run locally

No dependency installation or build step is required.

```sh
python3 -m http.server 4173
```

Open <http://localhost:4173>.

Run the complete validation suite with:

```sh
node tests/test.js
```

The suite validates data shape, source placement, cent-level reconciliation,
all 50 state controls, browser-visible large-row coverage, and the complete
public-institution universe.

## Repository map

| Path | Purpose |
| --- | --- |
| `index.html` | Application shell |
| `src/` | Browser application, fiscal model, and lazy data loading |
| `styles/` | Responsive presentation styles |
| `data/` | Fiscal, tax, source, and reconciliation datasets |
| `tests/` | Dependency-free Node audit and regression suite |
| `vendor/` | Pinned map assets and licenses |
| `.openai/hosting.json` | Production Sites project binding |

`data/jurisdictions.js` is the startup manifest. Federal and state summaries
contain the peer entities shown in each allocation view; JSON detail files load
only after an entity is selected.

## Scope and limitations

- Spending sources use different scopes and accounting bases. Federal transfers
  may reappear in state receipts, so national and state figures are not additive.
- Official totals remain the headline. Lower bounds use `≥`; off-budget or
  unavailable detail is disclosed without inventing an expanded total.
- Congress currently includes House calendar-2024 disbursements. Senate reports
  are linked but remain non-additive.
- State and executive-agency person-level payroll is excluded. Public
  congressional office names may appear; staff names are not imported.
- Household estimates are illustrative, not tax advice. They use wage income,
  standard deductions, and fixed household assumptions; they exclude payroll
  and local income taxes, refundable credits, and individualized deductions.

Source URLs, audit qualifications, fiscal periods, and disclosure ceilings live
beside the values they explain. Unavailable detail is never inferred. Third-party
map assets and their terms are listed in [the vendor licenses](vendor/LICENSES.md).
