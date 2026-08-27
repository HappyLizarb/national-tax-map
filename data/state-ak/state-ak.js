(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Alaska",
  "code": "ak",
  "fiscalYear": 2024,
  "sourceTotal": 12493184000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $11,829,200,000.00 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 663984000
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 2250151000,
      "sourceAmount": 2250151000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ak/census-state-ak-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ak/archive-state-source/state-ak-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 10120559000,
      "sourceAmount": 10120559000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ak/census-state-ak-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ak/archive-state-source/state-ak-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 122474000,
      "sourceAmount": 122474000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ak/census-state-ak-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ak/archive-state-source/state-ak-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf"
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
      "detailUrl": "data/state-ak/census-state-ak-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ak/archive-state-source/state-ak-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf"
        ]
      ]
    }
  ],
  "itemizedTotal": 12493184000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf",
    "total": 11829200000,
    "difference": 663984000
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
      "https://doa.alaska.gov/dof/reports/resource/2024acfr.pdf"
    ]
  ]
};
});
