(function initThresholdBreakdowns(root) {
  const thresholdCents = 100_000_000_000;
  const maxSliceCents = thresholdCents - 1;
  const sections = ["itemBreakdowns", "supplementalBreakdowns", "sourceBreakdowns"];
  const cents = (value) => Math.round(value * 100);
  const accountLabel = (row) => String(row[1]).replace(/ · [^·]*ceiling(?: ·.*)?$/i, "");
  const rowKey = (row) => JSON.stringify([row[0], accountLabel(row), row[2]]);

  // Divide one source-terminal amount exactly without inferring protected dimensions.
  function thresholdRows(parent) {
    const total = cents(parent[2]), sign = Math.sign(total);
    const count = Math.ceil(Math.abs(total) / maxSliceCents);
    const base = Math.floor(Math.abs(total) / count), extra = Math.abs(total) % count;
    const privacy = /individual recipient omitted|recipient omitted|privacy|redacted|suppressed|identity protected|protected payment/i
      .test(parent.slice(0, 2).join(" "));
    const description = privacy
      ? "Privacy-preserving mechanical threshold slice · identities remain suppressed · not a source-published account"
      : "Mechanical threshold slice of a source-terminal amount · not a source-published account";
    return Array.from({ length: count }, (_, index) => {
      const amount = sign * (base + (index < extra ? 1 : 0)) / 100;
      return [parent[0] + " · threshold slice " + (index + 1) + " of " + count,
        description, amount, null, 1];
    });
  }

  function thresholdPanel(parent, sourceUrl) {
    return {
      title: "$1 billion threshold display slices",
      basis: "Exact mechanical subdivision in integer cents. It preserves the published total and privacy suppression without inferring recipients, programs, periods, or source accounts.",
      sourceLabel: "original public source",
      sourceUrl: sourceUrl || null,
      sourceTotal: parent[2],
      covers: [parent],
      rows: thresholdRows(parent),
      thresholdSubdivision: true
    };
  }

  // Add one reusable threshold panel for every otherwise-terminal large row.
  function withThresholdBreakdowns(detail) {
    if (!detail) return detail;
    const panels = sections.flatMap((name) => detail[name] || []), exact = new Set();
    for (const panel of panels) {
      const parent = panel.displayParent || panel.parent || panel.covers?.[0];
      const total = panel.rows.reduce((sum, row) => sum + cents(row[2]), 0);
      if (parent && total === cents(parent[2])) exact.add(rowKey(parent));
    }
    const baseRows = [...(detail.rows || []), ...(detail.supplementalRows || []),
      ...(detail.largeAccountRows || [])].map((row) => [row, detail.sourceUrl]);
    const childRows = panels.flatMap((panel) => panel.rows.map((row) =>
      [row, panel.sourceUrl || detail.sourceUrl]));
    const candidates = [...baseRows, ...childRows], occurrences = new Map();
    for (const [row] of candidates) if (Array.isArray(row) && Math.abs(row[2]) >= 1e9) {
      const key = rowKey(row);
      occurrences.set(key, (occurrences.get(key) || 0) + 1);
    }
    const additions = [], seen = new Set();
    for (const [row, sourceUrl] of candidates) {
      const key = Array.isArray(row) ? rowKey(row) : null;
      if (!key || seen.has(key) || Math.abs(row[2]) < 1e9
        || exact.has(key) && occurrences.get(key) === 1) continue;
      seen.add(key);
      additions.push(thresholdPanel(row, sourceUrl));
    }
    return additions.length ? { ...detail,
      sourceBreakdowns: [...(detail.sourceBreakdowns || []), ...additions] } : detail;
  }

  const api = { withThresholdBreakdowns };
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.ThresholdBreakdowns = api;
})(typeof globalThis === "object" ? globalThis : window);
