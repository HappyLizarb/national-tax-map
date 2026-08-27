(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Maine",
  "code": "me",
  "fiscalYear": 2024,
  "sourceTotal": 13626469000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $1,631,332,347.94 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 11995136652.06
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 2299065000,
      "sourceAmount": 2299065000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-me/census-state-me-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-me/archive-state-source/state-me-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://opencheckbook.maine.gov/entity_profile.html?id=2"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 11114988000,
      "sourceAmount": 11114988000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-me/census-state-me-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-me/archive-state-source/state-me-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://opencheckbook.maine.gov/entity_profile.html?id=2"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 35464000,
      "sourceAmount": 35464000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-me/census-state-me-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-me/archive-state-source/state-me-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://opencheckbook.maine.gov/entity_profile.html?id=2"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 176952000,
      "sourceAmount": 176952000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-me/census-state-me-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-me/archive-state-source/state-me-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://opencheckbook.maine.gov/entity_profile.html?id=2"
        ]
      ]
    }
  ],
  "itemizedTotal": 13626469000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://opencheckbook.maine.gov/entity_profile.html?id=2",
    "total": 1631332347.94,
    "difference": 11995136652.06
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
      "https://opencheckbook.maine.gov/entity_profile.html?id=2"
    ]
  ]
};
});
