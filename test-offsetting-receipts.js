const assert = require("node:assert/strict");
const fs = require("node:fs");
const renderReceiptHierarchy = require("./receipt-hierarchy.js");

const detail = JSON.parse(fs.readFileSync(
  "data/federal/federal-mts-agency-undistributed-offsetting-receipts.json", "utf8"));
const cents = (value) => Math.round(value * 100);
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const render = (value) => renderReceiptHierarchy(value, (amount) => "$" + amount, escapeHtml);

assert.deepEqual([detail.accountingClasses.length, detail.accountingGroups.length,
  detail.sourceFloor.accountCount, detail.sourceFloor.largeAccountCount], [2, 4, 107, 8]);
assert.equal(detail.accountingClasses.reduce((sum, row) => sum + cents(row.amount), 0), cents(-330571737028.44));
assert.equal(detail.accountingGroups.reduce((sum, row) => sum + cents(row.amount), 0), cents(-330571737028.44));
assert.equal(detail.accountingGroups.filter((row) => row.flowType.startsWith("Internal"))
  .reduce((sum, row) => sum + cents(row.amount), 0), cents(-323550439310.80));
assert.equal(detail.accountRows.length, 107);
assert.ok(detail.accountRows.every((row) => row.sourceFloor === "No public additive children"
  && /^\d{3}-(?:[XF]-)?\d{4}-\d{3}$/.test(row.tas)));
assert.equal(detail.accountRows.filter((row) => row.largeAccountAudited).length, 8);
assert.equal(detail.sourceCheck.mtsRoundingAdjustment, -262971.56);
assert.equal(detail.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(-330572000000));

const html = render(detail);
assert.equal((html.match(/class="receipt-class"/g) || []).length, 2);
assert.equal((html.match(/class="receipt-group"/g) || []).length, 4);
assert.equal((html.match(/class="agency-row receipt-account"/g) || []).length, 107);
assert.equal((html.match(/MTS rounded-control bridge/g) || []).length, 1);
assert.match(html, /107 source-native receipt accounts · 8 audited ≥\$10B accounts/);
assert.match(html, /TAS 097-X-5472-001 · Internal employer contribution · No public additive children/);

const unsafe = structuredClone(detail);
unsafe.accountRows[0].title = "<script>alert('unsafe')</script>";
assert.doesNotMatch(render(unsafe), /<script>/);
assert.match(render(unsafe), /&lt;script&gt;alert\(&#39;unsafe&#39;\)&lt;\/script&gt;/);
