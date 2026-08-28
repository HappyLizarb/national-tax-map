const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const index = require("./data/department-index.js");
const threshold = 10_000_000_000;
const key = (row) => JSON.stringify(row.slice(0, 3));
const panels = (detail) => ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"]
  .flatMap((section) => detail[section] || []);
const baseExempt = (scope, department, row) => {
  const text = [department, row[0], row[1]].join(" ").toLowerCase();
  if (scope !== "United States" && text.includes("intergovernmental expenditure")) return true;
  if (text.includes("military personnel")) return true;
  if (/benefit payments|supplemental security income|civil service retirement and disability fund|annuitants, employees health and life insurance benefits|military retirement fund|retiree health care/.test(text)) return true;
  if (/payments? to .*trust funds?|payment to .*retirement fund/.test(text)) return true;
  return row[2] < 0 && /proprietary receipts|offsetting receipts|intrabudgetary|employer share|interest received by trust funds|general fund contributions|off-budget1/.test(text);
};
const leafExempt = (row) => /ceiling|benefit|premium tax credit|premiums collected|payments from states|payments to health care trust funds|transfer from general fund|interest received|retirement|federal contribution|earnings on investments|offset|expanded in companion|intrafederal|miscellaneous federal payments/i
  .test(`${row[0]} ${row[1]}`);

const baseCounts = {large: 0, direct: 0, sourced: 0, exempt: 0};
const unresolvedBase = [];
const unresolvedLeaves = [];
let largeLeaves = 0;

for (const [scope, summaryPath] of Object.entries(index)) {
  const summary = require(`./${summaryPath}`);
  for (const department of summary.departments.filter((row) => row.detailUrl)) {
    const detail = JSON.parse(fs.readFileSync(path.join(__dirname, department.detailUrl), "utf8"));
    const direct = new Set([...(detail.itemBreakdowns || []), ...(detail.supplementalBreakdowns || [])].map((panel) => key(panel.parent)));
    const sourced = new Set((detail.sourceBreakdowns || []).flatMap((panel) => panel.covers || []).map(key));
    const covered = new Set(panels(detail).flatMap((panel) => panel.covers || []).map(key));
    for (const row of detail.rows || []) {
      if (Math.abs(row[2]) < threshold) continue;
      baseCounts.large += 1;
      if (direct.has(key(row))) baseCounts.direct += 1;
      else if (sourced.has(key(row))) baseCounts.sourced += 1;
      else if (baseExempt(scope, detail.department, row)) baseCounts.exempt += 1;
      else unresolvedBase.push([scope, detail.department, ...row.slice(0, 3)]);
    }
    for (const panel of panels(detail)) for (const row of panel.rows) {
      if (Math.abs(row[2]) < threshold) continue;
      largeLeaves += 1;
      if (!covered.has(key(row)) && !leafExempt(row)) unresolvedLeaves.push([scope, panel.title, ...row.slice(0, 3)]);
    }
  }
}

assert.deepEqual(baseCounts, {large: 157, direct: 69, sourced: 46, exempt: 42});
assert.deepEqual(unresolvedBase, []);
assert.equal(largeLeaves, 134);
assert.deepEqual(unresolvedLeaves, []);
