(function (root, factory) {
  const data = factory();
  if (typeof module === "object" && module.exports) module.exports = data;
  else root.StateLedgerTotals = data;
})(typeof globalThis === "object" ? globalThis : window, function () {
  return {
    "Alabama": 47530291944.47, "Alaska": 11829200000, "Arizona": 37497268015,
    "Arkansas": 19953493994.3, "California": 295909342678, "Colorado": 39210596217.87,
    "Connecticut": 36131360457.04, "Delaware": 15486501947.44, "Florida": 128747111750.18,
    "Georgia": 66956454894.81, "Hawaii": 17898170000, "Idaho": 15073867000,
    "Illinois": 270835812095.37, "Indiana": 59513417253.4, "Iowa": 39088247997.48,
    "Kansas": 31261239621.45, "Kentucky": 49421121460.56, "Louisiana": 43394706192.68,
    "Maine": 1631332347.94, "Maryland": 40390013646.72, "Massachusetts": 93697656881.25,
    "Michigan": 72708027060.6, "Minnesota": 64339974325, "Mississippi": 27730006642.65,
    "Missouri": 36251434414.02, "Montana": 9107646553.54, "Nebraska": 8824754417.13,
    "Nevada": 23980496026.03, "New Hampshire": 10029340000, "New Jersey": 92104245771.78,
    "New Mexico": 13830759212.08, "New York": 147994518447.47, "North Carolina": 73513647447.2,
    "North Dakota": 6721046790.93, "Ohio": 99702813633.36, "Oklahoma": 35864460747.76,
    "Oregon": 31836364350.07, "Pennsylvania": 4265171224.59, "Rhode Island": 6717216542.22,
    "South Carolina": 36704047552.46, "South Dakota": 6315971000, "Tennessee": 33097780967.41,
    "Texas": 377841427258.09, "Utah": 38356170590.45, "Vermont": 7445364768.85,
    "Virginia": 83966509424.97, "Washington": 34960860261.78, "West Virginia": 3915581065,
    "Wisconsin": 66254598697.17, "Wyoming": 6548654149.67
  };
});
