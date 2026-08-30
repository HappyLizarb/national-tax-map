const assert = require("node:assert/strict");
const fs = require("node:fs");

const bundle = ["index.html", "src/fiscal-panel.js", "styles/styles.css", "styles/details.css", "styles/polish.css"]
  .map((file) => fs.readFileSync(file, "utf8")).join("\n");

assert.doesNotMatch(bundle, /secondary-metrics|interestShare|transferShare|coverageShare|updateSecondary/);
assert.match(bundle, /\.fiscal-detail \.agency-rows\s*\{\s*max-height:\s*550px/);
assert.match(bundle, /aria-labelledby="allocationTitle"[\s\S]*class="panel-section source-explorer nested-source-explorer"[\s\S]*<\/section>\s*<\/section>/);
assert.match(bundle, /\.map-pane\s*\{[^}]*height:\s*calc\(100dvh - 72px\)[^}]*flex-direction:\s*column[^}]*\}/s);
assert.match(bundle, /@media \(max-width: 1100px\)[\s\S]*\.map-pane\s*\{[^}]*height:\s*auto[^}]*\}/s);
assert.match(bundle, /id="entryDisclaimer"[\s\S]*not legal, financial, tax, investment, accounting, or personal advice[\s\S]*showModal\(\)/);
assert.match(bundle, /id="legalDisclaimerTitle"[\s\S]*general educational and illustrative purposes[\s\S]*does not create an attorney-client/);
assert.match(bundle, /\.entry-disclaimer::backdrop[\s\S]*\.legal-disclaimer/);
assert.match(bundle, /class="skip-link" href="#mainContent"[\s\S]*<main id="mainContent">/);
assert.match(bundle, /styles\/polish\.css\?v=7[\s\S]*@keyframes reveal-up[\s\S]*body:has\(\.entry-disclaimer\[open\]\)[\s\S]*animation-play-state: paused/);
assert.match(bundle, /viewBox="0 0 900 520"[\s\S]*\.detail-panel\s*\{[^}]*height:\s*calc\(100dvh - 72px\)[^}]*overflow-y:\s*auto/s);
assert.match(bundle, /@media \(max-width: 1100px\)[\s\S]*\.detail-panel\s*\{[^}]*height:\s*auto[^}]*overflow-y:\s*visible/s);
assert.match(bundle, /prefers-reduced-motion: reduce/);
assert.doesNotMatch(bundle, /\.state-shape\s*\{\s*animation:/);
assert.match(bundle, /\.fiscal-detail \.section-heading h3\s*\{\s*font-size: clamp\(28px, 3vw, 40px\)/);
