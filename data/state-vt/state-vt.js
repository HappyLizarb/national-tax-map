(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Vermont",
  "code": "vt",
  "fiscalYear": 2024,
  "sourceTotal": 9559023000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $7,445,364,768.85 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 2113658231.1499996
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 2561202000,
      "sourceAmount": 2561202000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-vt/census-state-vt-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-vt/archive-state-source/state-vt-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 6906732000,
      "sourceAmount": 6906732000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-vt/census-state-vt-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-vt/archive-state-source/state-vt-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 8419000,
      "sourceAmount": 8419000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-vt/census-state-vt-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-vt/archive-state-source/state-vt-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 82670000,
      "sourceAmount": 82670000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-vt/census-state-vt-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-vt/archive-state-source/state-vt-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns"
        ]
      ]
    }
  ],
  "itemizedTotal": 9559023000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns",
    "total": 7445364768.85,
    "difference": 2113658231.1499996
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
      "https://data.vermont.gov/Finance/SFY-2024-Vendor-Payments/5t78-kzns"
    ]
  ]
};
});
