(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Mississippi",
  "code": "ms",
  "fiscalYear": 2024,
  "sourceTotal": 27503386000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $27,730,006,642.65 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -226620642.65000153
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 8557478000,
      "sourceAmount": 8557478000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ms/census-state-ms-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ms/archive-state-source/state-ms-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 18435887000,
      "sourceAmount": 18435887000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ms/census-state-ms-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ms/archive-state-source/state-ms-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso"
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
      "detailUrl": "data/state-ms/census-state-ms-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ms/archive-state-source/state-ms-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 510021000,
      "sourceAmount": 510021000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-ms/census-state-ms-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ms/archive-state-source/state-ms-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso"
        ]
      ]
    }
  ],
  "itemizedTotal": 27503386000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso",
    "total": 27730006642.65,
    "difference": -226620642.65000153
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
      "https://boe.magic.ms.gov/Transparency/AfGxfnvZ2z5Iui5E0q5kOso"
    ]
  ]
};
});
