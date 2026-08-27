(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Florida",
  "code": "fl",
  "fiscalYear": 2024,
  "sourceTotal": 129884186000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $128,747,111,750.18 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 1137074249.8200073
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 26293628000,
      "sourceAmount": 26293628000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-fl/census-state-fl-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-fl/archive-state-source/state-fl-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://myfloridacfo.com/transparency/vendorpayments"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 103232325000,
      "sourceAmount": 103232325000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-fl/census-state-fl-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-fl/archive-state-source/state-fl-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://myfloridacfo.com/transparency/vendorpayments"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 358233000,
      "sourceAmount": 358233000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-fl/census-state-fl-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-fl/archive-state-source/state-fl-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://myfloridacfo.com/transparency/vendorpayments"
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
      "detailUrl": "data/state-fl/census-state-fl-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-fl/archive-state-source/state-fl-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://myfloridacfo.com/transparency/vendorpayments"
        ]
      ]
    }
  ],
  "itemizedTotal": 129884186000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://myfloridacfo.com/transparency/vendorpayments",
    "total": 128747111750.18,
    "difference": 1137074249.8200073
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
      "https://myfloridacfo.com/transparency/vendorpayments"
    ]
  ]
};
});
