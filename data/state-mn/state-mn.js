(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Minnesota",
  "code": "mn",
  "fiscalYear": 2024,
  "sourceTotal": 61249905000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $64,339,974,325.00 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -3090069325
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 19525716000,
      "sourceAmount": 19525716000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-mn/census-state-mn-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mn/archive-state-source/state-mn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 41213087000,
      "sourceAmount": 41213087000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-mn/census-state-mn-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mn/archive-state-source/state-mn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 511102000,
      "sourceAmount": 511102000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-mn/census-state-mn-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mn/archive-state-source/state-mn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv"
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
      "detailUrl": "data/state-mn/census-state-mn-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-mn/archive-state-source/state-mn-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv"
        ]
      ]
    }
  ],
  "itemizedTotal": 61249905000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv",
    "total": 64339974325,
    "difference": -3090069325
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
      "https://transparency.systems.state.mn.us/analytics/saw.dll?Go&ViewID=d%3adashboard%7ep%3a0lpu8102g8pch6om%7er%3a4rcek211kjk0hpfb&Action=Download&SearchID=1b0b8oo4pgtonh800tnv7d8iaa&Style=MNIT&ViewState=6e023hfv8pu2gn62ug63e79ac2&ItemName=Payments%205.0%20-%20by%20Agency&path=%2fshared%2fCitizens%20Portal%2fPayments%2fPayments%205.0%20-%20by%20Agency&Format=csv&Extension=.csv"
    ]
  ]
};
});
