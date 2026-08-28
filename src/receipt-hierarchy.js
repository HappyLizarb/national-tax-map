function receiptAccountHtml(account, formatMoney, escapeHtml) {
  const audit = account.largeAccountAudited ? " · Audited ≥$10B account" : "";
  const metadata = "TAS " + account.tas + " · " + account.flowType + " · " + account.sourceFloor + audit;
  return '<div class="agency-row receipt-account"><span><strong>' + escapeHtml(account.title)
    + '</strong><small>' + escapeHtml(metadata) + '</small></span><b>'
    + formatMoney(account.amount) + '</b></div>';
}

function receiptGroupHtml(group, accounts, formatMoney, escapeHtml) {
  const rows = accounts.filter((account) => account.group === group.name)
    .map((account) => receiptAccountHtml(account, formatMoney, escapeHtml)).join("");
  return '<details class="receipt-group" open><summary><span><strong>' + escapeHtml(group.name)
    + '</strong><small>' + escapeHtml(group.accountCount + " accounts · " + group.explanation)
    + '</small></span><b>' + formatMoney(group.amount) + '</b></summary><div>' + rows + '</div></details>';
}

function receiptClassHtml(category, groups, accounts, formatMoney, escapeHtml) {
  const groupHtml = category.groupNames.map((name) => groups.find((group) => group.name === name))
    .map((group) => receiptGroupHtml(group, accounts, formatMoney, escapeHtml)).join("");
  return '<details class="receipt-class" open><summary><span><strong>' + escapeHtml(category.name)
    + '</strong><small>' + escapeHtml(category.accountCount + " accounts · " + category.explanation)
    + '</small></span><b>' + formatMoney(category.amount) + '</b></summary><div>' + groupHtml + '</div></details>';
}

function renderReceiptHierarchy(detail, formatMoney, escapeHtml) {
  const classes = detail.accountingClasses || [], groups = detail.accountingGroups || [];
  if (!classes.length) return "";
  const floor = detail.sourceFloor, bridge = detail.rows.find((row) => row[0] === "MTS control bridge");
  const overview = classes.length + " source classes · " + groups.length + " Treasury flows · "
    + floor.accountCount + " source-native receipt accounts · " + floor.largeAccountCount + " audited ≥$10B accounts";
  const sections = classes.map((category) =>
    receiptClassHtml(category, groups, detail.accountRows, formatMoney, escapeHtml)).join("");
  return '<div class="receipt-hierarchy"><p class="receipt-hierarchy-note">' + escapeHtml(overview + ". " + floor.note)
    + '</p>' + sections + '<div class="agency-row receipt-control"><span><strong>MTS rounded-control bridge</strong><small>'
    + escapeHtml(bridge[1]) + '</small></span><b>' + formatMoney(bridge[2]) + '</b></div></div>';
}

if (typeof module !== "undefined") module.exports = renderReceiptHierarchy;
