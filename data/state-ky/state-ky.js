(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Kentucky",
  "code": "ky",
  "fiscalYear": 2024,
  "sourceTotal": 47697571000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $49,421,121,460.56 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -1723550460.5599976
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 6773177000,
      "sourceAmount": 6773177000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ky/census-state-ky-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ky/archive-state-source/state-ky-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.ky.gov/search/Pages/spendingsearch.aspx"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 40859017000,
      "sourceAmount": 40859017000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ky/census-state-ky-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ky/archive-state-source/state-ky-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.ky.gov/search/Pages/spendingsearch.aspx"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 65377000,
      "sourceAmount": 65377000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ky/census-state-ky-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ky/archive-state-source/state-ky-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.ky.gov/search/Pages/spendingsearch.aspx"
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
      "detailUrl": "data/state-ky/census-state-ky-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ky/archive-state-source/state-ky-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.ky.gov/search/Pages/spendingsearch.aspx"
        ]
      ]
    }
  ],
  "itemizedTotal": 47697571000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://transparency.ky.gov/search/Pages/spendingsearch.aspx",
    "total": 49421121460.56,
    "difference": -1723550460.5599976
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
      "https://transparency.ky.gov/search/Pages/spendingsearch.aspx"
    ]
  ]
};
});
