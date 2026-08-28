(function(root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.stateSourceAlternates = factory();
})(typeof globalThis === "object" ? globalThis : window, function() {
  return {
    Alaska: [
      ["Checkbook Alaska FY2026 CSV (FY2024 unavailable)", "https://stateofalaska.data.socrata.com/resource/qdjq-crxc.csv"],
      ["Prior Year Explorer", "https://stateofalaska.data.socrata.com/stories/s/95fy-2e62"]
    ],
    Arizona: [
      ["OpenBooks expenditures", "https://openbooks.az.gov/expenditures"],
      ["OpenBooks FAQ", "https://openbooks.az.gov/frequently-asked-question"],
      ["OpenBooks disclaimer", "https://openbooks.az.gov/content-and-financial-data-disclaimers"]
    ],
    Colorado: [
      ["TOPS expenses story", "https://data.colorado.gov/stories/s/TOPS-Expenses/pqw4-6m8r/"],
      ["TOPS CSV export (current period)", "https://tableau.state.co.us/t/DPA_TOPS/views/TOPSExpenses/TOPSExpenses.csv?:showVizHome=no"]
    ],
    Idaho: [
      ["Transparent Idaho vendor payments", "https://transparent.idaho.gov/vendor-payments"],
      ["STARS vendor-payment documentation", "https://transparencyresources.idaho.gov/Pages/STARS-Vendor-Payment-Reports.aspx"],
      ["Payment Services CSV documentation", "https://transparencyresources.idaho.gov/Pages/Payment-Services-Reports.aspx"]
    ],
    Mississippi: [
      ["Transparency Mississippi checkbook", "https://www.transparency.ms.gov/checkbook/checkbook.aspx"],
      ["Statewide expenditures download", "https://boe.magic.ms.gov/BOE/OpenDocument/opendoc/openDocument.jsp?iDocID=AVXFJs06_thHjAH84iLYV7g"]
    ],
    Montana: [["SABHRS accounts-payable datasets", "https://data.mt.gov/Datasets?category=Government"]],
    "South Dakota": [
      ["Open SD vendor payments", "https://open.sd.gov/vendor.aspx"],
      ["Prior-year checkbook detail (wrong period)", "https://bfm.sd.gov/ledger/CheckbookDetailPriorYear2.csv"]
    ],
    Utah: [
      ["Transparent Utah vendor search", "https://transparent.utah.gov/entities/vendor-payments-search"],
      ["Utah Open Data expenditure mirror (stale)", "https://opendata.utah.gov/Government-and-Taxes/State-of-Utah-Expenditures-Transparency-/dqdf-hweu"]
    ],
    "West Virginia": [
      ["FY2024 State Dollar Report", "https://www.wvlegislature.gov/legisdocs/reports/agency/A06_FY_2024_26612.pdf"],
      ["FY2024 Checkbook vendor page", "https://stories.opengov.com/westvirginia/published/1Y5McMyl2"],
      ["FY2024 filtered vendor view", "https://westvirginia.opengov.com/data/#/52532/query=77FB31E3CB4F8C6D86B8EE13966C4B5B&embed=n"]
    ],
    Wyoming: [
      ["WyOpen FY2024 dashboard", "https://www.wyopen.gov/main/year/2024"],
      ["WyOpen transaction search", "https://www.wyopen.gov/search"],
      ["WyOpen CSV endpoint", "https://www.wyopen.gov/search/csv"]
    ]
  };
});
