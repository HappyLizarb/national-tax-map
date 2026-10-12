import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Publish only the browser application; keep tests and repository files out of the site.
const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
rmSync(output, { recursive: true, force: true });
mkdirSync(output);
for (const entry of ["index.html", "src", "styles", "data", "vendor"]) {
  cpSync(path.join(root, entry), path.join(output, entry), { recursive: true });
}
// Compact deployment JSON without changing the source datasets or parsed values.
for (const entry of readdirSync(output, { recursive: true })) {
  if (!entry.endsWith(".json")) continue;
  const file = path.join(output, entry);
  writeFileSync(file, JSON.stringify(JSON.parse(readFileSync(file, "utf8"))));
}
console.log("Static site prepared in dist/");
