const assert = require("node:assert/strict");
const fs = require("node:fs");
const model = require("../src/model.js");
const jurisdictions = require("../data/jurisdictions.js");
const { hasAuditCaveat, kpiDisclosureFor } = require("../src/kpi-disclosure.js");

const html = fs.readFileSync("index.html", "utf8");
const panel = fs.readFileSync("src/fiscal-panel.js", "utf8");
const details = fs.readFileSync("styles/details.css", "utf8");

assert.doesNotMatch(html, /kpi-grid|data-kpi-disclosure|budgetDisclosure|outsideBudgetDisclosure/);
assert.doesNotMatch(panel, /kpiDisclosureFor|aria-describedby|function updateKpis/);
assert.doesNotMatch(details, /kpi-disclosure-mark|budget-disclaimer|outside-budget-disclaimer/);
assert.match(html, /id="gapPercentText"[\s\S]*id="auditCaveatMark"[\s\S]*id="auditCaveat"[\s\S]*id="auditCaveatText"/);
assert.match(panel, /hasAuditCaveat\(financial\) \? financial\.auditNote[\s\S]*#auditCaveatMark[\s\S]*#auditCaveatText/);
assert.match(panel, /function updateNetPosition/);
assert.deepEqual(kpiDisclosureFor(model.budgetPresentationFor("Texas"), null).targets, ["spending"]);
assert.deepEqual(kpiDisclosureFor(null, jurisdictions.states.California.financial).targets,
  ["revenue", "spending", "balance"]);
assert.equal(hasAuditCaveat(jurisdictions.states["Rhode Island"].financial), false);
assert.deepEqual(kpiDisclosureFor(null, jurisdictions.states["Rhode Island"].financial), { text: "", targets: [] });
