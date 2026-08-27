(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Virginia",
  "code": "va",
  "fiscalYear": 2024,
  "sourceTotal": 82040028000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $83,966,509,424.97 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -1926481424.9700012
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 19781191000,
      "sourceAmount": 19781191000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-va/census-state-va-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-va/archive-state-source/state-va-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 61060895000,
      "sourceAmount": 61060895000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-va/census-state-va-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-va/archive-state-source/state-va-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 211869000,
      "sourceAmount": 211869000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-va/census-state-va-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-va/archive-state-source/state-va-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 986073000,
      "sourceAmount": 986073000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-va/census-state-va-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-va/archive-state-source/state-va-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures"
        ]
      ]
    }
  ],
  "itemizedTotal": 82040028000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures",
    "total": 83966509424.97,
    "difference": -1926481424.9700012
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
      "https://www.datapoint.apa.virginia.gov/dashboard.php?Page=Expenditures"
    ]
  ]
};
});
