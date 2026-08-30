# Archived Utah source layer

The FY2024 state-specific payee-field ranking layer is retained here for provenance. It was not added to the Census layer because it is a bounded raw-ledger slice rather than an all-vendor or government-wide accrual denominator.

Official source: https://transparent.utah.gov/entities/highest-paid-vendors
Published top-100 total: $38,356,170,590.45

The official query returns 99 named groups and one $35.119 billion aggregate for non-Education expenditure transactions whose `vendor_name` field is empty. That aggregate is not one vendor; its underlying rows require gated state BigQuery access and remain a public data-quality ceiling. The former 20-row ACFR function/activity layer remains linked as non-additive accounting context.
