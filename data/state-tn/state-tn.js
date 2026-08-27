(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Tennessee",
  "code": "tn",
  "fiscalYear": 2024,
  "sourceTotal": 49518206000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $33,097,780,967.41 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 16420425032.59
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 13790331000,
      "sourceAmount": 13790331000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-tn/census-state-tn-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-tn/archive-state-source/state-tn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 35726728000,
      "sourceAmount": 35726728000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-tn/census-state-tn-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-tn/archive-state-source/state-tn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 1147000,
      "sourceAmount": 1147000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-tn/census-state-tn-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-tn/archive-state-source/state-tn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no"
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
      "detailUrl": "data/state-tn/census-state-tn-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-tn/archive-state-source/state-tn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no"
        ]
      ]
    }
  ],
  "itemizedTotal": 49518206000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no",
    "total": 33097780967.41,
    "difference": 16420425032.59
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
      "https://data.tn.gov/t/Public/views/SearchableCheckbookPublic_17861130451500/Agency.csv?:showVizHome=no"
    ]
  ]
};
});
