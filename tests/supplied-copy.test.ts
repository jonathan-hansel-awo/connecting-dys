import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import { backgrounds } from "../src/lib/preferences.ts";

const fingerprints: Record<string, string> = JSON.parse(fs.readFileSync("tests/fixtures/supplied-copy-sha256.json", "utf8"));
const policySources = JSON.parse(fs.readFileSync("src/content/policy-source-keys.json", "utf8"));
const routeSources: Record<string, string[]> = {
  index: ["home-intro", "home-stand", "home-conditions", "home-approach", "home-work", "home-who"],
  about: ["about-intro", "why", "mission", "vision", "goal", "about-work", "how", "different", "commitment", "who-join", "purpose"],
  "our-story": ["story", "founder"],
  "what-we-do": ["work-intro", ...Array.from({ length: 8 }, (_, i) => `work-${i + 1}`), "goal-young"],
  "our-approach": ["approach-intro", "approach-community", "approach-design", "approach-grow", "approach-social", "approach-awareness", "approach-infrastructure", "approach-gets", "approach-goals", "approach-intend"],
  values: ["values-summary", ...[..."BRIDGE"].map(letter => `value-${letter}`)],
  support: ["support-peer", "support-family", "support-workshops", "support-forums"],
  accessibility: ["accessibility"], confidentiality: ["confidentiality"],
  cookies: ["cookies-original"], disclaimer: ["disclaimer"], "data-retention": ["data-retention"],
  safeguarding: policySources.safeguarding, complaints: policySources.complaints, equality: policySources.equality,
  privacy: ["privacy-notice", ...policySources["privacy-policy"]],
};
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

test("all supplied editorial sections are reproduced completely on the intended pages", () => {
  const seen = new Set<string>();
  for (const [route, sources] of Object.entries(routeSources)) {
    const dom = new JSDOM(fs.readFileSync(`.next/server/app/${route}.html`, "utf8"));
    const doc = dom.window.document;
    for (const source of sources) {
      const panel = doc.querySelector(`[data-source-id="${source}"]`);
      assert.ok(panel, `${route}: missing ${source}`);
      const text = normalize([...panel.querySelectorAll("h1,h2,h3,h4,h5,h6,p,li,th,td")].map(node => node.textContent).join(" "));
      assert.equal(createHash("sha256").update(text).digest("hex"), fingerprints[source], `${route}: original wording changed or omitted in ${source}`);
      assert.equal(panel.querySelectorAll("details").length, 0, "original wording is fully visible");
      for (const box of panel.querySelectorAll(".copy-panel")) {
        assert.ok(box.querySelectorAll(":scope > p").length <= 1, `${route}/${source}: paragraphs must use separate boxes`);
      }
      seen.add(source);
    }
    assert.ok(doc.querySelector("main .copy-panel"), `${route}: missing reading panels`);
    if (route === "index") {
      assert.match(normalize([...doc.querySelectorAll(".invitation h2, .invitation p")].map(node => node.textContent).join(" ")), /Join us in creating something meaningful\. We are developing a lasting community built on trust, collaborative design, and collective ownership\./);
      assert.ok(doc.querySelector("footer")!.textContent!.includes("Connecting DYS A community where every DYS mind feels at home."));
    }
    dom.window.close();
  }
  // These two source labels are editorial placement instructions; their body wording is checked above.
  assert.deepEqual(Object.keys(fingerprints).filter(key => !seen.has(key)), ["home-invitation", "home-footer"]);
});

function declarations(body: string) {
  return Object.fromEntries([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
}
function rgb(hex: string) { return [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16)); }
function luminance(channels: number[]) {
  return channels.map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
}
function contrast(a: number[], b: number[]) { const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (high + .05) / (low + .05); }

test("panel text and links meet AA contrast across every reading background and theme", () => {
  const css = fs.readFileSync("src/styles/content-panels.css", "utf8");
  const light = declarations(css.match(/:root\s*\{([^}]+)\}/)![1]);
  const dark = declarations(css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/)![1]);
  for (const mode of ["light", "dark"]) {
    const tokens = mode === "dark" ? { ...light, ...dark } : light;
    for (const tone of ["blue", "teal", "amber", "coral", "cream"]) {
      const rules = [...css.matchAll(new RegExp(`(?:html\\[data-theme="dark"\\] )?\\.panel-${tone} \\{([^}]+)\\}`, "g"))];
      let mix = tokens["--panel-mix"];
      for (const rule of rules) {
        if (mode === "light" && rule[0].startsWith("html")) continue;
        mix = declarations(rule[1])["--panel-mix"] || mix;
      }
      const fraction = parseFloat(mix) / 100;
      for (const background of backgrounds) {
        const base = rgb(mode === "dark" ? background.darkValue : background.value);
        const tint = rgb(tokens[`--panel-${tone}`]);
        const fill = base.map((channel, i) => channel * (1 - fraction) + tint[i] * fraction);
        for (const kind of ["ink", "accent", "muted"]) {
          const ratio = contrast(rgb(tokens[`--panel-${kind}`]), fill);
          assert.ok(ratio >= 4.5, `${mode}/${background.label}/${tone}/${kind}: ${ratio.toFixed(2)}:1`);
        }
      }
    }
  }
});
