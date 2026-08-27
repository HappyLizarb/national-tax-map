(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "Connecticut",
  "code": "ct",
  "fiscalYear": 2024,
  "sourceTotal": 33908102000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $36,131,360,457.04 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": -2223258457.040001
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 8176982000,
      "sourceAmount": 8176982000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-ct/census-state-ct-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ct/archive-state-source/state-ct-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 24943432000,
      "sourceAmount": 24943432000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-ct/census-state-ct-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ct/archive-state-source/state-ct-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 787688000,
      "sourceAmount": 787688000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-ct/census-state-ct-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ct/archive-state-source/state-ct-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program"
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
      "detailUrl": "data/state-ct/census-state-ct-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-ct/archive-state-source/state-ct-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program"
        ]
      ]
    }
  ],
  "itemizedTotal": 33908102000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program",
    "total": 36131360457.04,
    "difference": -2223258457.040001
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
      "https://data.ct.gov/resource/ajdm-rvz7.json?$select=department,program,sum(amount)%20as%20amount,count(*)%20as%20records&$where=fiscal_year=2024&$group=department,program"
    ]
  ]
};
});
