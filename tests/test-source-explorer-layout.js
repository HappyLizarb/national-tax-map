const assert = require("node:assert/strict");
const fs = require("node:fs");

const bundle = ["index.html", "src/fiscal-panel.js", "styles/styles.css", "styles/details.css"]
  .map((file) => fs.readFileSync(file, "utf8")).join("\n");

assert.doesNotMatch(bundle, /secondary-metrics|interestShare|transferShare|coverageShare|updateSecondary/);
assert.match(bundle, /\.fiscal-detail \.agency-rows\s*\{\s*max-height:\s*550px/);
