(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Arkansas",
  "code": "ar",
  "fiscalYear": 2024,
  "sourceTotal": 26260980000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $19,953,493,994.30 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 6307486005.700001
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 7565747000,
      "sourceAmount": 7565747000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ar/census-state-ar-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ar/archive-state-source/state-ar-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 18695233000,
      "sourceAmount": 18695233000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ar/census-state-ar-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ar/archive-state-source/state-ar-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 0,
      "sourceAmount": 0,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ar/census-state-ar-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ar/archive-state-source/state-ar-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview"
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
      "detailUrl": "data/state-ar/census-state-ar-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ar/archive-state-source/state-ar-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview"
        ]
      ]
    }
  ],
  "itemizedTotal": 26260980000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview",
    "total": 19953493994.3,
    "difference": 6307486005.700001
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
      "https://www.ark.org/dfa/transparency_2024/expenditures.php?do:expenditures&tab=overview"
    ]
  ]
};
});
