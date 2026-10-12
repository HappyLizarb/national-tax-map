const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const model = require("../src/model.js");
const renderReceiptHierarchy = require("../src/receipt-hierarchy.js");
const { renderDrilldownRow } = require("../src/detail-dialog.js");

const elements = { "#sourceExplorerNote": {}, "#agencyRows": {} };
const browser = { window: { TaxModel: model }, matchMedia: () => ({}),
  document: { querySelector: (selector) => elements[selector] },
  renderDrilldownRow, renderReceiptHierarchy
};
// Run the real renderers without starting network or map initialization.
vm.runInNewContext(fs.readFileSync("src/app.js", "utf8").replace(/\ninitialize\(\);\s*$/, "")
  + "\n" + fs.readFileSync("src/fiscal-panel.js", "utf8"), browser);

// Find an entry's entire inert payload, including templates for its deeper descendants.
function entryContent(html, label) {
  const buttons = html.matchAll(/<button\b[^>]*data-detail-entry[^>]*>([\s\S]*?)<\/button>\s*<template\b[^>]*>/g);
  const entry = [...buttons].find((match) => label.test(match[1]));
  assert.ok(entry, "Expandable parent entry exists");
  const start = entry.index + entry[0].length;
  let depth = 1;
  for (const tag of html.slice(start).matchAll(/<\/?template\b[^>]*>/g)) {
    depth += tag[0].startsWith("</") ? -1 : 1;
    if (depth === 0) return html.slice(start, start + tag.index);
  }
  assert.fail("Entry content template closes");
}

const detail = JSON.parse(fs.readFileSync(
  "data/federal/federal-mts-agency-department-of-veterans-affairs.json", "utf8"));
browser.renderDetail(detail);
const html = elements["#agencyRows"].innerHTML;
const insurance = entryContent(html, /<strong>Insurance Funds<\/strong><small>Other/);
const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const panels = [detail.supplementalBreakdowns.find((panel) => panel.parent[0] === "Insurance Funds"),
  detail.sourceBreakdowns.find((panel) => panel.displayParent?.[0] === "Insurance Funds")];
assert.deepEqual(panels.map((panel) => panel.rows.length), [11, 6]);
for (const panel of panels) {
  assert.ok(insurance.includes(escape(panel.title)), "Both sibling panels belong to the clicked parent");
  assert.ok(insurance.includes(escape(panel.basis)), "Each accounting basis remains visible");
  assert.ok(insurance.includes(escape(panel.sourceUrl)), "Each official source remains reachable");
  for (const row of panel.rows) assert.ok(insurance.includes(escape(row[0])), "Every child row is preserved");
  assert.equal(html.split(escape(panel.title)).length - 1, 1, "Source panel is rendered exactly once");
}
assert.doesNotMatch(html, /<details|<summary|\sid="/);
assert.doesNotMatch(browser.federalSourceCatalog(), /<details|<summary/);
assert.match(browser.federalSourceCatalog(), /data-detail-entry/);

// A pending department request must never expose the previous report's clickable rows.
const dialogBody = { scrollTop: 450 };
elements["#departmentDialog"] = { open: false,
  querySelector: () => dialogBody, showModal() { this.open = true; }
};
for (const selector of ["#breakdownDetails", "#departmentDialogTitle", "#sourceExplorerTitle"])
  elements[selector] = {};
browser.resetEntryDialog = () => {};
browser.DepartmentData = { loadDetail: () => new Promise(() => {}) };
browser.showBreakdown({ name: "Pending department", amount: 1e9, share: 1,
  detailUrl: "pending.json", sourceUrl: "https://example.gov/source" });
assert.equal(elements["#agencyRows"].innerHTML, "");
assert.equal(elements["#departmentDialogTitle"].textContent, "Pending department");
assert.equal(dialogBody.scrollTop, 0);
assert.equal(elements["#departmentDialog"].open, true);
console.log("VA parent entries retain both source panels, basis notes, and every child row.");
