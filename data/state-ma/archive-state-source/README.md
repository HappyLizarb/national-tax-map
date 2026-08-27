# Archived Massachusetts source layer

The prior FY2024 state-specific itemized layer is retained here for provenance. It was not added to the Census layer because its accounting scope is not proven disjoint. The active pie uses the Census FY2024 function/category layer so it reconciles to the map ledger.

Original source: https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000
Original source total: $93,697,656,881.25
