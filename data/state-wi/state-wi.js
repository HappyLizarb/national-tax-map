(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Wisconsin",
  "code": "wi",
  "fiscalYear": 2024,
  "sourceTotal": 53816480000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $66,254,598,697.17 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -12438118697.169998
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 14631136000,
      "sourceAmount": 14631136000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-wi/census-state-wi-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-wi/archive-state-source/state-wi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 39160778000,
      "sourceAmount": 39160778000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-wi/census-state-wi-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-wi/archive-state-source/state-wi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 24566000,
      "sourceAmount": 24566000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-wi/census-state-wi-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-wi/archive-state-source/state-wi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf"
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
      "detailUrl": "data/state-wi/census-state-wi-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-wi/archive-state-source/state-wi-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf"
        ]
      ]
    }
  ],
  "itemizedTotal": 53816480000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf",
    "total": 66254598697.17,
    "difference": -12438118697.169998
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
      "https://doa.wi.gov/budget/SCO/2024%20WI%20AFR%20Appendix.pdf"
    ]
  ]
};
});
