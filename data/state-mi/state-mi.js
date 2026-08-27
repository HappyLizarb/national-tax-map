(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Michigan",
  "code": "mi",
  "fiscalYear": 2024,
  "sourceTotal": 97942776000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $72,708,027,060.60 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 25234748939.399994
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 33474642000,
      "sourceAmount": 33474642000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-mi/census-state-mi-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mi/archive-state-source/state-mi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 63207497000,
      "sourceAmount": 63207497000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-mi/census-state-mi-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mi/archive-state-source/state-mi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 114000,
      "sourceAmount": 114000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-mi/census-state-mi-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mi/archive-state-source/state-mi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 1260523000,
      "sourceAmount": 1260523000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-mi/census-state-mi-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mi/archive-state-source/state-mi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload"
        ]
      ]
    }
  ],
  "itemizedTotal": 97942776000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload",
    "total": 72708027060.6,
    "difference": 25234748939.399994
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
      "https://sigmai.michigan.gov/EI360TransparencyApp/jsp/bulkCheckbookDownload"
    ]
  ]
};
});
