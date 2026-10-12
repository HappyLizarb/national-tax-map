const entryDialogHistory = [];
let entryDialogOpener;

// Keep source URLs safe when a rendered row becomes a dialog trigger.
function dialogAttribute(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[character]));
}

// Expandable rows retain all child panels in an inert template, outside the visible list.
function renderDrilldownRow(content, children = "", sourceUrl = "", className = "") {
  const classes = "agency-row " + className;
  const link = sourceUrl ? 'href="' + dialogAttribute(sourceUrl)
    + '" target="_blank" rel="noopener noreferrer"' : "";
  if (!children) return link ? '<a class="' + classes + '" ' + link + '>' + content + '</a>'
    : '<div class="' + classes + '">' + content + '</div>';
  const source = link ? '<a class="entry-source" ' + link + '>Open official source ↗</a>' : "";
  return '<button class="' + classes + ' detail-entry" type="button" data-detail-entry aria-haspopup="dialog">'
    + content + '</button><template data-detail-content>' + source + children + '</template>';
}

// Open a row's own content, preserving previous dialog nodes for Back navigation.
function openEntryDialog(button) {
  const template = button.nextElementSibling;
  if (!template?.matches("template[data-detail-content]")) return;
  const dialog = document.getElementById("entryDialog");
  const body = document.getElementById("entryDialogBody");
  const title = document.getElementById("entryDialogTitle");
  if (dialog.open) entryDialogHistory.push({ title: title.textContent,
    nodes: [...body.childNodes], focus: button, scroll: body.scrollTop });
  else entryDialogOpener = button;
  title.textContent = button.querySelector("strong")?.textContent || button.textContent.trim();
  const summary = document.createElement("div");
  summary.className = "agency-row entry-summary";
  summary.innerHTML = button.innerHTML;
  body.replaceChildren(summary, template.content.cloneNode(true));
  document.getElementById("entryDialogBack").hidden = !entryDialogHistory.length;
  if (!dialog.open) dialog.showModal();
  body.scrollTop = 0;
  title.focus({ preventScroll: true });
}

// Returning to a parent restores the precise row and scroll position the reader left.
function backEntryDialog() {
  const previous = entryDialogHistory.pop();
  if (!previous) return;
  const body = document.getElementById("entryDialogBody");
  document.getElementById("entryDialogTitle").textContent = previous.title;
  body.replaceChildren(...previous.nodes);
  document.getElementById("entryDialogBack").hidden = !entryDialogHistory.length;
  body.scrollTop = previous.scroll;
  previous.focus.focus({ preventScroll: true });
}

// Clear detached content and return keyboard focus to the original entry.
function resetEntryDialog() {
  const dialog = document.getElementById("entryDialog");
  if (dialog.open) dialog.close();
  entryDialogHistory.length = 0;
  document.getElementById("entryDialogBody").replaceChildren();
  entryDialogOpener?.focus({ preventScroll: true });
  entryDialogOpener = null;
}

// Delegate row clicks so lazy-loaded and nested entries share the same dialog behavior.
function bindDetailDialogs() {
  document.addEventListener("click", (event) => {
    const entry = event.target.closest("[data-detail-entry]");
    if (entry) openEntryDialog(entry);
  });
  document.querySelectorAll("[data-dialog-close]").forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()));
  document.getElementById("entryDialogBack").addEventListener("click", backEntryDialog);
  document.getElementById("entryDialog").addEventListener("close", resetEntryDialog);
  document.getElementById("departmentDialog").addEventListener("close", resetEntryDialog);
}

if (typeof module !== "undefined") module.exports = { renderDrilldownRow };
else bindDetailDialogs();
