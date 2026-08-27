(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Idaho",
  "code": "id",
  "fiscalYear": 2024,
  "sourceTotal": 14699129000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $15,073,867,000.00 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -374738000
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 4685589000,
      "sourceAmount": 4685589000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-id/census-state-id-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-id/archive-state-source/state-id-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 9810505000,
      "sourceAmount": 9810505000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-id/census-state-id-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-id/archive-state-source/state-id-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf"
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
      "detailUrl": "data/state-id/census-state-id-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-id/archive-state-source/state-id-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 203035000,
      "sourceAmount": 203035000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-id/census-state-id-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-id/archive-state-source/state-id-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf"
        ]
      ]
    }
  ],
  "itemizedTotal": 14699129000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf",
    "total": 15073867000,
    "difference": -374738000
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
      "https://transparencyresources.idaho.gov/CAFRDocuments/2024%20Annual%20Comprehensive%20Financial%20Report.pdf"
    ]
  ]
};
});
