const assert = require("node:assert/strict");
const fs = require("node:fs");
const model = require("../src/model.js");
const financialResults = require("../data/fiscal/state-financial-results.js");
const { hasAuditCaveat, kpiDisclosureFor } = require("../src/kpi-disclosure.js");

const html = fs.readFileSync("index.html", "utf8");
const panel = fs.readFileSync("src/fiscal-panel.js", "utf8");
const details = fs.readFileSync("styles/details.css", "utf8");

assert.equal((html.match(/data-kpi-disclosure=/g) || []).length, 3);
assert.ok(html.indexOf('id="budgetDisclosure"') > html.indexOf('id="balanceValue"'));
assert.match(panel, /kpiDisclosureFor/);
assert.match(panel, /aria-describedby/);
assert.match(details, /\.kpi-disclosure-mark/);
assert.equal((details.match(/\.kpi-disclosure-mark\s*\{/g) || []).length, 1);
assert.deepEqual(kpiDisclosureFor(model.budgetPresentationFor("Texas"), null).targets, ["spending"]);
assert.deepEqual(kpiDisclosureFor(null, financialResults.states.California).targets,
  ["revenue", "spending", "balance"]);
assert.equal(hasAuditCaveat(financialResults.states["Rhode Island"]), false);
assert.deepEqual(kpiDisclosureFor(null, financialResults.states["Rhode Island"]), { text: "", targets: [] });
