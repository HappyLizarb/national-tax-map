const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// Verify the deployed copy preserves every application asset and every data value.
let bytes = 0;
for (const root of ["index.html", "src", "styles", "data", "vendor"]) {
  const files = fs.statSync(root).isDirectory()
    ? fs.readdirSync(root, { recursive: true }).map((file) => path.join(root, file)) : [root];
  for (const file of files) {
    if (!fs.statSync(file).isFile()) continue;
    const source = fs.readFileSync(file);
    const deployed = fs.readFileSync(path.join("dist", file));
    bytes += deployed.length;
    if (file.endsWith(".json")) assert.deepEqual(JSON.parse(deployed), JSON.parse(source), file);
    else assert.deepEqual(deployed, source, file);
  }
}
assert.ok(bytes < 256 * 1024 * 1024, "Expanded assets must fit the Sites archive limit");
console.log(`Static assets verified: ${(bytes / 1024 / 1024).toFixed(2)} MiB`);
