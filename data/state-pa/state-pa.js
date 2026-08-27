(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Pennsylvania",
  "code": "pa",
  "fiscalYear": 2024,
  "sourceTotal": 122346288000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $4,265,171,224.59 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 118081116775.41
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 30193284000,
      "sourceAmount": 30193284000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-pa/census-state-pa-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-pa/archive-state-source/state-pa-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.patreasury.gov/openbookpa/checkbook.php"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 89839911000,
      "sourceAmount": 89839911000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-pa/census-state-pa-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-pa/archive-state-source/state-pa-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.patreasury.gov/openbookpa/checkbook.php"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 5370000,
      "sourceAmount": 5370000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-pa/census-state-pa-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-pa/archive-state-source/state-pa-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.patreasury.gov/openbookpa/checkbook.php"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 2307723000,
      "sourceAmount": 2307723000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-pa/census-state-pa-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-pa/archive-state-source/state-pa-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.patreasury.gov/openbookpa/checkbook.php"
        ]
      ]
    }
  ],
  "itemizedTotal": 122346288000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://www.patreasury.gov/openbookpa/checkbook.php",
    "total": 4265171224.59,
    "difference": 118081116775.41
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
      "https://www.patreasury.gov/openbookpa/checkbook.php"
    ]
  ]
};
});
