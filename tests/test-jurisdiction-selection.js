const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const model = require("../src/model.js");

// Exercise the native control and the map's shared selection handler without loading map assets.
const select = { value: "United States", options: [{ value: "United States" }],
  add(option) { this.options.push(option); },
  addEventListener(event, handler) { this[event] = handler; }
};
const panel = { scrollTop: 100 };
const theme = { addEventListener() {}, setAttribute() {} };
let renders = 0;
const browser = {
  window: { TaxModel: model },
  document: { documentElement: { dataset: { theme: "light" } },
    querySelector: (selector) => ({ "#scopeSelect": select, ".detail-panel": panel, "#themeToggle": theme })[selector]
  },
  Option: function Option(text, value) { this.text = text; this.value = value; },
  matchMedia: () => ({ addEventListener() {} }),
  addEventListener() {},
  updatePanel() { renders++; },
  d3: { json: async () => ({ objects: { states: {} } }) },
  topojson: { feature: () => ({ features: [] }) }
};
vm.runInNewContext(fs.readFileSync("src/app.js", "utf8"), browser);

assert.equal(select.options.length, 51, "Federal and all 50 states are selectable");
assert.equal(new Set(select.options.map((option) => option.value)).size, 51);
assert.equal(select.options[1].value, "Alabama");
assert.equal(select.options.at(-1).value, "Wyoming");
assert.equal(renders, 1);

select.value = "California";
select.change();
assert.equal(select.value, "California");
assert.equal(panel.scrollTop, 0);
assert.equal(renders, 2, "Keyboard selection refreshes the fiscal panel");
select.change();
assert.equal(renders, 2, "An unchanged selection does not toggle back to federal");

browser.setScope("Texas");
assert.equal(select.value, "Texas", "Map selection updates the native control");
browser.setScope("Texas");
assert.equal(select.value, "United States", "Clicking the selected state preserves federal reset");
select.value = "Alabama";
select.change();
select.value = "United States";
select.change();
assert.equal(select.value, "United States");
assert.equal(renders, 6, "Both map and native selection refresh the same panel");
