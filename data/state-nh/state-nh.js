(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else (root.DepartmentSpendingData ||= {})[data.scope] = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
  "scope": "New Hampshire",
  "code": "nh",
  "fiscalYear": 2024,
  "sourceTotal": 10706467000,
  "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
  "dimension": "Census expenditure function/category",
  "note": "The primary pie uses the Census FY2024 Annual Survey of State Government Finances because its mutually exclusive expenditure function/category rows sum exactly to the map total. Census reports amounts in $1,000 and includes state-government entities defined by its methodology. The prior state-specific layer is retained as a non-additive comparison; its $10,029,340,000.00 total is not assigned to a Census category. Census categories are functions, not payee transactions.",
  "reconciliation": {
    "itemizedDifference": 0,
    "normalized": false,
    "scale": 1,
    "comparisonDifference": 677127000
  },
  "departments": [
    {
      "id": "census-intergovernmental",
      "name": "Intergovernmental expenditure",
      "amount": 2404368000,
      "sourceAmount": 2404368000,
      "program": "Intergovernmental expenditure · Census FY2024 function/category",
      "sourceRows": 31,
      "detailUrl": "data/state-nh/census-state-nh-fy2024-intergovernmental.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-nh/archive-state-source/state-nh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf"
        ]
      ]
    },
    {
      "id": "census-direct-general",
      "name": "Direct general expenditure",
      "amount": 7692260000,
      "sourceAmount": 7692260000,
      "program": "Direct general expenditure · Census FY2024 function/category",
      "sourceRows": 36,
      "detailUrl": "data/state-nh/census-state-nh-fy2024-direct-general.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-nh/archive-state-source/state-nh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf"
        ]
      ]
    },
    {
      "id": "census-utility",
      "name": "Utility expenditure",
      "amount": 15143000,
      "sourceAmount": 15143000,
      "program": "Utility expenditure · Census FY2024 function/category",
      "sourceRows": 4,
      "detailUrl": "data/state-nh/census-state-nh-fy2024-utility.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-nh/archive-state-source/state-nh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf"
        ]
      ]
    },
    {
      "id": "census-liquor-stores",
      "name": "Liquor stores expenditure",
      "amount": 594696000,
      "sourceAmount": 594696000,
      "program": "Liquor stores expenditure · Census FY2024 function/category",
      "sourceRows": 1,
      "detailUrl": "data/state-nh/census-state-nh-fy2024-liquor-stores.json",
      "sourceUrl": "https://www2.census.gov/programs-surveys/state/data/GS00STATEFIN01.zip",
      "relatedSources": [
        [
          "Prior state layer snapshot",
          "data/state-nh/archive-state-source/state-nh-official-source-summary.json"
        ],
        [
          "Prior official state itemized source",
          "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf"
        ]
      ]
    }
  ],
  "itemizedTotal": 10706467000,
  "comparison": {
    "label": "Prior official state itemized layer (non-additive)",
    "url": "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf",
    "total": 10029340000,
    "difference": 677127000
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
      "https://www.gc.nh.gov/lba/Budget/FiscalItems/2026-04-17_Agenda_Items/Single_Audit_2025.pdf"
    ]
  ]
};
});
