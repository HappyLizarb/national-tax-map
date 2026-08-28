const caveatAuditStatuses = new Set(["qualified", "qualified/disclaimed", "not independently confirmed"]);

function hasAuditCaveat(financial) {
  return Boolean(financial && caveatAuditStatuses.has(financial.auditStatus));
}

function kpiDisclosureFor(budget, financial) {
  const budgetText = budget?.disclaimer || "";
  const auditText = !budgetText && hasAuditCaveat(financial) ? financial.auditNote || "" : "";
  const targets = auditText ? ["revenue", "spending", "balance"] : budgetText ? ["spending"] : [];
  return { text: budgetText || auditText, targets };
}

if (typeof module !== "undefined") module.exports = { hasAuditCaveat, kpiDisclosureFor };
