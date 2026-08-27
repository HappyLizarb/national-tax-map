(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Oregon",
  "code": "or",
  "fiscalYear": 2024,
  "sourceTotal": 53634034000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $31,836,364,350.07 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 21797669649.93
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 9695595000,
      "sourceAmount": 9695595000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-or/census-state-or-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-or/archive-state-source/state-or-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 43328152000,
      "sourceAmount": 43328152000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-or/census-state-or-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-or/archive-state-source/state-or-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 32175000,
      "sourceAmount": 32175000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-or/census-state-or-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-or/archive-state-source/state-or-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 578112000,
      "sourceAmount": 578112000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-or/census-state-or-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-or/archive-state-source/state-or-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000"
        ]
      ]
    }
  ],
  "itemizedTotal": 53634034000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000",
    "total": 31836364350.07,
    "difference": 21797669649.93
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
      "https://data.oregon.gov/resource/y9g9-xsxs.json?$select=agency_1,sum(expense)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=agency_1&$order=amount%20DESC&$limit=5000"
    ]
  ]
};
});
