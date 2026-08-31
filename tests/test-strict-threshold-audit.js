const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const model = require("../src/model.js");
const threshold = 1_000_000_000;
const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
const cents = (value) => Math.round(value * 100);
const key = (row) => JSON.stringify([row[0], String(row[1]).replace(/ · [^·]*ceiling(?: ·.*)?$/i, ""), row[2]]);
const privacyPattern = /individual recipient omitted|recipient omitted|privacy|redacted|suppressed|identity protected|protected payment/i;
const stats = { files: 0, largeRows: 0, privacyRows: 0, thresholdPanels: 0 };

function jsonFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const item = path.join(directory, entry.name);
    return entry.isDirectory() ? jsonFiles(item) : entry.name.endsWith(".json") ? [item] : [];
  });
}

function exactPanelFor(panels, row) {
  const matches = panels.filter((panel) => {
    const parent = panel.displayParent || panel.parent || panel.covers?.[0];
    return parent && key(parent) === key(row)
      && panel.rows.reduce((sum, child) => sum + cents(child[2]), 0) === cents(row[2]);
  });
  return matches.find((panel) => panel.thresholdSubdivision) || matches[0];
}

function auditDetail(detail, file) {
  const prepared = model.withThresholdBreakdowns(detail);
  const panels = sections.flatMap((name) => prepared[name] || []);
  const rows = [...prepared.rows, ...(prepared.supplementalRows || []),
    ...(prepared.largeAccountRows || []), ...panels.flatMap((panel) => panel.rows)];
  const occurrences = new Map();
  for (const row of rows) if (Number.isFinite(row[2]) && Math.abs(row[2]) >= threshold)
    occurrences.set(key(row), (occurrences.get(key(row)) || 0) + 1);
  for (const row of rows.filter((item) => Number.isFinite(item[2]) && Math.abs(item[2]) >= threshold)) {
    stats.largeRows += 1;
    const panel = exactPanelFor(panels, row);
    assert.ok(panel, file + " standalone row: " + row[0] + " · " + row[1]);
    if (occurrences.get(key(row)) > 1) assert.ok(panel.thresholdSubdivision, file + " repeated large row");
    if (privacyPattern.test(row.slice(0, 2).join(" "))) {
      stats.privacyRows += 1;
      const privacyEvidence = [panel.title, panel.basis,
        ...panel.rows.flatMap((child) => child.slice(0, 2))].join(" ");
      assert.match(privacyEvidence, /privacy-safe|privacy-preserving|recipient omitted|redacted|suppressed/i, file);
      if (panel.thresholdSubdivision) assert.ok(panel.rows.every((child) =>
        /Privacy-preserving/.test(child[1]) && /identities remain suppressed/.test(child[1])), file);
    }
  }
  for (const panel of panels.filter((item) => item.thresholdSubdivision)) {
    stats.thresholdPanels += 1;
    assert.equal(panel.rows.reduce((sum, row) => sum + cents(row[2]), 0), cents(panel.sourceTotal), file);
    assert.ok(panel.rows.every((row) => Math.abs(row[2]) < threshold), file);
  }
}

for (const file of jsonFiles("data")) {
  const detail = JSON.parse(fs.readFileSync(file, "utf8"));
  const rows = detail.rows || (detail.departments?.every(Array.isArray) ? detail.departments : null);
  if (!rows?.every(Array.isArray)) continue;
  stats.files += 1;
  auditDetail({ ...detail, rows }, file);
}

assert.ok(stats.files > 3_500, JSON.stringify(stats));
assert.ok(stats.largeRows > 4_000, JSON.stringify(stats));
assert.ok(stats.privacyRows > 10, JSON.stringify(stats));
assert.ok(stats.thresholdPanels > 2_000, JSON.stringify(stats));
console.log("Strict repository audit passed: no array-backed account is standalone at $1 billion or more.", stats);
