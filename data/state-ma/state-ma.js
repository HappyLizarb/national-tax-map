(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Massachusetts",
  "code": "ma",
  "fiscalYear": 2024,
  "sourceTotal": 86065220000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $93,697,656,881.25 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -7632436881.25
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 14876860000,
      "sourceAmount": 14876860000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ma/census-state-ma-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ma/archive-state-source/state-ma-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 67272658000,
      "sourceAmount": 67272658000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ma/census-state-ma-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ma/archive-state-source/state-ma-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 3915702000,
      "sourceAmount": 3915702000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ma/census-state-ma-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ma/archive-state-source/state-ma-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 0,
      "sourceAmount": 0,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-ma/census-state-ma-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ma/archive-state-source/state-ma-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000"
        ]
      ]
    }
  ],
  "itemizedTotal": 86065220000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000",
    "total": 93697656881.25,
    "difference": -7632436881.25
  },
  "coverageStatus": "census-complete-function-basis",
  "relatedSources": [
    [
      "Census FY2024 summary table",
      "https://data.census.gov/table/GOVSSTATEFINTIMESERIES.GS00STATEFIN01"
    ],
    [
      "Census technical documentation",
      "https://www.census.gov/programs-surveys/state/technical-documentation/complete-technical-documentation/2024.html"
    ],
    [
      "Prior official state itemized layer (non-additive)",
      "https://cthru.data.socrata.com/resource/pegc-naaa.json?$select=department%2Cobject_class%2Csum%28amount%29%20as%20amount%2Ccount%28%2A%29%20as%20source_rows%2Ccount%28distinct%20vendor%29%20as%20vendors%2Ccount%28distinct%20payment_id%29%20as%20payments&$where=budget_fiscal_year%3D2024&$group=department%2Cobject_class&$order=amount%20desc&$limit=50000"
    ]
  ]
};
});
