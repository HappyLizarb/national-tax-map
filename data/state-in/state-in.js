(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Indiana",
  "code": "in",
  "fiscalYear": 2024,
  "sourceTotal": 57569279000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $59,513,417,253.40 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -1944138253.4000015
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 14755960000,
      "sourceAmount": 14755960000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-in/census-state-in-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-in/archive-state-source/state-in-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 42813319000,
      "sourceAmount": 42813319000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-in/census-state-in-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-in/archive-state-source/state-in-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf"
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
      "detailUrl": "data/state-in/census-state-in-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-in/archive-state-source/state-in-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf"
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
      "detailUrl": "data/state-in/census-state-in-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-in/archive-state-source/state-in-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf"
        ]
      ]
    }
  ],
  "itemizedTotal": 57569279000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf",
    "total": 59513417253.4,
    "difference": -1944138253.4000015
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
      "https://www.in.gov/comptroller/files/FY2024-Annual-Financial-Report-Volume-II.pdf"
    ]
  ]
};
});
