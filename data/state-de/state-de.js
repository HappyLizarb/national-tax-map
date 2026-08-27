(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Delaware",
  "code": "de",
  "fiscalYear": 2024,
  "sourceTotal": 13794957000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $15,486,501,947.44 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -1691544947.4400005
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 2557365000,
      "sourceAmount": 2557365000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-de/census-state-de-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-de/archive-state-source/state-de-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 11059933000,
      "sourceAmount": 11059933000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-de/census-state-de-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-de/archive-state-source/state-de-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 177659000,
      "sourceAmount": 177659000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-de/census-state-de-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-de/archive-state-source/state-de-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category"
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
      "detailUrl": "data/state-de/census-state-de-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-de/archive-state-source/state-de-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category"
        ]
      ]
    }
  ],
  "itemizedTotal": 13794957000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category",
    "total": 15486501947.44,
    "difference": -1691544947.4400005
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
      "https://data.delaware.gov/resource/5s6n-7hpx.json?$select=department,category,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,category"
    ]
  ]
};
});
