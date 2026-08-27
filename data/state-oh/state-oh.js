(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Ohio",
  "code": "oh",
  "fiscalYear": 2024,
  "sourceTotal": 102985597000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $99,702,813,633.36 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 3282783366.6399994
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 26759658000,
      "sourceAmount": 26759658000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-oh/census-state-oh-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-oh/archive-state-source/state-oh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://checkbook.ohio.gov/State/Expenses/Agency.aspx"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 74785156000,
      "sourceAmount": 74785156000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-oh/census-state-oh-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-oh/archive-state-source/state-oh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://checkbook.ohio.gov/State/Expenses/Agency.aspx"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 10000,
      "sourceAmount": 10000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-oh/census-state-oh-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-oh/archive-state-source/state-oh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://checkbook.ohio.gov/State/Expenses/Agency.aspx"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 1440773000,
      "sourceAmount": 1440773000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-oh/census-state-oh-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-oh/archive-state-source/state-oh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://checkbook.ohio.gov/State/Expenses/Agency.aspx"
        ]
      ]
    }
  ],
  "itemizedTotal": 102985597000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://checkbook.ohio.gov/State/Expenses/Agency.aspx",
    "total": 99702813633.36,
    "difference": 3282783366.6399994
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
      "https://checkbook.ohio.gov/State/Expenses/Agency.aspx"
    ]
  ]
};
});
