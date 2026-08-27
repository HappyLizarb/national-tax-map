(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Oklahoma",
  "code": "ok",
  "fiscalYear": 2024,
  "sourceTotal": 35270025000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $35,864,460,747.76 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -594435747.7600021
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 6605242000,
      "sourceAmount": 6605242000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ok/census-state-ok-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ok/archive-state-source/state-ok-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 27797405000,
      "sourceAmount": 27797405000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ok/census-state-ok-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ok/archive-state-source/state-ok-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 867378000,
      "sourceAmount": 867378000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ok/census-state-ok-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ok/archive-state-source/state-ok-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b"
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
      "detailUrl": "data/state-ok/census-state-ok-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ok/archive-state-source/state-ok-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b"
        ]
      ]
    }
  ],
  "itemizedTotal": 35270025000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b",
    "total": 35864460747.76,
    "difference": -594435747.7600021
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
      "https://data.ok.gov/api/3/action/package_show?id=3a481186-0cb2-4651-85af-34b4afb3712b"
    ]
  ]
};
});
