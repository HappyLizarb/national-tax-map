const assert = require("node:assert/strict");
const fs = require("node:fs");

const cents = (value) => Math.round(value * 100);
const federal = require("./data/federal/federal.js");
const federalDetails = federal.departments.filter((row) => row.detailUrl)
  .map((row) => JSON.parse(fs.readFileSync(row.detailUrl, "utf8")));
const accountResearch = federalDetails.filter((detail) => detail.accountResearch);
const itemBreakdowns = federalDetails.flatMap((detail) => detail.itemBreakdowns || []);
const sourceViews = federalDetails.flatMap((detail) => [...(detail.sourceBreakdowns || []),
  ...(detail.supplementalBreakdowns || [])]);
const sourceView = (title) => sourceViews.find((item) => item.title === title);

const judicialPbd = sourceView("OMB FY2024 Judicial Branch outlays by account");
assert.equal(cents(judicialPbd.rows.reduce((sum, row) => sum + row[2], 0)), cents(9480000000));
assert.ok(judicialPbd.rows.every((row) => Math.abs(row[2]) < 1e10));
const negativeBreakdowns = itemBreakdowns.filter((item) => item.parent[2] < 0);
assert.equal(negativeBreakdowns.length, 11);
assert.equal(negativeBreakdowns.reduce((sum, item) => sum + item.accountCount, 0), 202);
assert.ok(negativeBreakdowns.every((item) => item.sourceUrl.endsWith("/tbb.xlsx")
  && /negative offsets/.test(item.basis)));
const education = federalDetails.find((detail) => detail.department === "Department of Education");
assert.ok(education.itemBreakdowns[0].rows.some((row) => row[0] === "091-0251-000" && row[2] > 55e9));
const treasuryInterest = itemBreakdowns.filter((item) => /Interest on Treasury Debt Securities/.test(item.parent[0]));
assert.equal(treasuryInterest.length, 2);
assert.ok(treasuryInterest.every((item) => /Fiscal Data/.test(item.rowPrefix)));
assert.equal(treasuryInterest.flatMap((item) => item.rows).filter((row) => /public monthly disclosure ceiling/.test(row[1])).length, 5);
const judiciary = federalDetails.find((detail) => detail.department === "Judicial Branch");
assert.equal(judiciary.itemBreakdowns[0].accountCount, 8);
assert.ok(judiciary.itemBreakdowns[0].rows.every((row) => Math.abs(row[2]) < 1e10));
const hhs = federalDetails.find((detail) => detail.department === "Department of Health and Human Services");
assert.ok(hhs.rows.some((row) => row[0] === "Centers for Medicare and Medicaid Services" && row[1] === "Other" && row[2] === 12389000000));
assert.ok(hhs.itemBreakdowns.some((item) =>
  item.rows.some((row) => row[0] === "075-0849-000" && row[2] > 7e9)));
assert.ok(hhs.itemBreakdowns.some((item) => item.parent[2] === -478323000000
  && item.rows.some((row) => row[0] === "075-X-8004-001" && row[2] < -375e9)));
const agriculture = federalDetails.find((detail) => detail.department === "Department of Agriculture");
assert.ok(agriculture.rows.some((row) => row[0] === "Department of Agriculture" && row[1] === "Other" && row[2] === 10403000000));
const state = federalDetails.find((detail) => detail.department === "Department of State");
assert.ok(state.rows.some((row) => row[0] === "Department of State" && row[1] === "International Organizations and Conferences"));
const otherDefense = federalDetails.find((detail) => detail.department === "Other Defense Civil Programs");
assert.ok(otherDefense.rows.some((row) => row[0] === "Other Defense Civil Programs"
  && row[1] === "Intrabudgetary Transactions" && row[2] === -179813000000));
assert.ok(otherDefense.itemBreakdowns[0].rows.some((row) => row[0] === "097-X-8097-003"
  && row[2] === -151521000000));
const health = accountResearch.find((detail) => detail.department === "Department of Health and Human Services");
assert.ok(health.rows.some((row) => row[0] === health.department && row[1] === "Proprietary Receipts from the Public"));
assert.ok(health.rows.some((row) => row[0].startsWith("Intrabudgetary Transactions › ")));
const congress = JSON.parse(fs.readFileSync("data/federal/archive-agency-source/federal-congress.json", "utf8"));
assert.equal(congress.session, "118th Congress, second session");
assert.ok(congress.rows.some((row) => /PERSONNEL COMPENSATION/.test(row[1])));
const courts = JSON.parse(fs.readFileSync("data/federal/archive-agency-source/federal-federal-courts.json", "utf8"));
assert.equal(courts.sourceTotal, 10543466479.98);
assert.ok(courts.rows.some((row) => /Fees of jurors/.test(row[1])));
const archivedEducation = JSON.parse(fs.readFileSync("data/federal/archive-agency-source/federal-department-of-education.json", "utf8"));
assert.deepEqual([archivedEducation.rows.length, cents(archivedEducation.rows.reduce((sum, row) => sum + row[2], 0))],
  [121, cents(273868344692.55)]);
assert.match(archivedEducation.sourceUrl, /program_activity/);
const federalArchiveDir = "data/federal/archive-agency-source";
const federalProgramActivityDetails = fs.readdirSync(federalArchiveDir).filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(fs.readFileSync(`${federalArchiveDir}/${file}`, "utf8")))
  .filter((detail) => /\/program_activity\//.test(detail.sourceUrl || ""));
assert.equal(federalProgramActivityDetails.length, 65);
const indiana = require("./data/state-in/state-in.js");
assert.equal(indiana.sourceTotal, 57569279000);
assert.equal(indiana.itemizedTotal, 57569279000);
const archivedIndiana = require("./data/state-in/archive-state-source/state-in-official-source-summary.json");
assert.equal(archivedIndiana.reconciliation.sourceRows, 37980);
assert.equal(archivedIndiana.reconciliation.sourceGroups, 37976);
assert.equal(archivedIndiana.sourceTotal, 59513417253.4);
assert.equal(archivedIndiana.reconciliation.normalized, false);

const html = fs.readFileSync("index.html", "utf8");
assert.match(html, /data\/department-index\.js/);
assert.match(html, /department-loader\.js/);
assert.match(html, /data\/state-ledger-totals\.js/);
assert.doesNotMatch(html, /data\/(?:federal|state-[a-z]{2})\/(?:federal|state-[a-z]{2})\.js/);
assert.doesNotMatch(html, /data\/state-(?:al|ar|ca|ks|me|ne|nv|sc|vt)\.js/);
assert.doesNotMatch(html, /data\/federal-(?:agencies|object-classes|expansion|programs|usda)\.js/);
assert.doesNotMatch(html, /data-allocation-source|allocation-source-switch/);

const app = fs.readFileSync("app.js", "utf8") + fs.readFileSync("fiscal-panel.js", "utf8");
const styles = fs.readFileSync("styles.css", "utf8") + fs.readFileSync("details.css", "utf8");
const browserModel = fs.readFileSync("model.js", "utf8");
assert.match(browserModel, /FederalSourceResearch/);
assert.doesNotMatch(app, /allocationSource/, "the viewer has one reconciled allocation path");
assert.doesNotMatch(app, /setAllocationSource|updateAllocationSourceControls/,
  "the spending source is fixed instead of exposed as a tab switcher");
assert.match(app, /async function allocationSummary/);
assert.match(app, /Prior state layer snapshot/);
assert.match(app, /reconcileStateArchive/);
assert.match(fs.readFileSync("data/federal/federal.js", "utf8"),
  /International Assistance Programs.+federal-department-of-state\.json/,
  "archive State agency exposes the official arms-transfer research panels");
assert.match(app, /federalResearchCatalog/);
assert.match(app, /mapMetric\(name, "stateGovernment", "balance", "financial"\)/);
assert.match(app, /department\.program/);
assert.match(app, /comparisonLabel/);
assert.match(app, /Math\.max\(row\.amount, 0\)/);
assert.match(app, /shareLabel\(department\)/);
const federalPresentationProblems = [];
if (!/b\.chartAmount - a\.chartAmount/.test(app)) {
  federalPresentationProblems.push("federal categories are not ranked");
}
if (!/\.agency-row\s*>\s*b\s*\{[^}]*text-align:\s*right[^}]*font-variant-numeric:\s*tabular-nums/s.test(styles)) {
  federalPresentationProblems.push("itemized amounts do not share a right-aligned tabular column");
}
assert.deepEqual(federalPresentationProblems, []);
const georgia = require("./data/state-ga/state-ga.js");
assert.equal(georgia.coverageStatus, "census-complete-function-basis");
const archivedGeorgiaSalary = JSON.parse(fs.readFileSync("data/state-ga/archive-state-source/state-ga-salary-travel.json", "utf8"));
assert.equal(archivedGeorgiaSalary.sourceCheck.combinedTotal, 23664401260.99);
assert.match(app, /department\.relatedSources/);
assert.match(app, /relatedSources\.map\(\(\[label, link\]\)/);
const illinois = require("./data/state-il/state-il.js");
assert.ok(illinois.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-il/archive-state-source/state-il-official-source-summary.json")));
const illinoisObjects = JSON.parse(fs.readFileSync("data/state-il/archive-state-source/state-il-object-categories.json", "utf8"));
assert.equal(illinoisObjects.rows.length, 156);
assert.equal(illinoisObjects.sourceTotal, 270835812095.37);
assert.equal(illinoisObjects.nonAdditive, true);
const alabama = require("./data/state-al/state-al.js");
assert.ok(alabama.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-al/archive-state-source/state-al-official-source-summary.json")));
const alabamaCategories = JSON.parse(fs.readFileSync("data/state-al/archive-state-source/state-al-category-context.json", "utf8"));
assert.equal(alabamaCategories.rows.length, 16);
assert.equal(alabamaCategories.sourceTotal, 47530291944.47);
assert.equal(alabamaCategories.nonAdditive, true);
const minnesota = require("./data/state-mn/state-mn.js");
assert.ok(minnesota.departments.every((row) => row.relatedSources?.some(([, url]) => url === "data/state-mn/archive-state-source/state-mn-official-source-summary.json")));
const minnesotaPayroll = JSON.parse(fs.readFileSync("data/state-mn/archive-state-source/state-mn-payroll.json", "utf8"));
assert.equal(minnesotaPayroll.sourceTotal, 4589764963.19);
assert.equal(minnesotaPayroll.sourceCheck.componentDifference, 0);
assert.equal(minnesotaPayroll.nonAdditive, true);
const tennessee = require("./data/state-tn/state-tn.js");
assert.equal(tennessee.coverageStatus, "census-complete-function-basis");
const oregon = require("./data/state-or/state-or.js");
assert.equal(oregon.departments.length, 4);
assert.equal(oregon.sourceTotal, 53634034000);
assert.equal(require("./data/state-or/archive-state-source/state-or-official-source-summary.json").sourceTotal, 31836364350.07);
const newYork = require("./data/state-ny/state-ny.js");
assert.equal(newYork.departments.length, 4);
assert.equal(newYork.sourceTotal, 266597110000);
assert.equal(require("./data/state-ny/archive-state-source/state-ny-official-source-summary.json").sourceTotal, 147994518447.47);
const newJersey = require("./data/state-nj/state-nj.js");
assert.equal(newJersey.departments.length, 4);
assert.equal(newJersey.sourceTotal, 97187747000);
assert.equal(require("./data/state-nj/archive-state-source/state-nj-official-source-summary.json").sourceTotal, 92104245771.78);
const archivedTennesseeFunctions = JSON.parse(fs.readFileSync("data/state-tn/archive-state-source/state-tn-acfr-functions.json", "utf8"));
assert.equal(archivedTennesseeFunctions.sourceTotal, 47759686000);
assert.equal(archivedTennesseeFunctions.sourceCheck.difference, 0);

