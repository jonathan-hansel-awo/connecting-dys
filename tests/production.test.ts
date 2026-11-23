import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createHash } from "node:crypto";
import { JSDOM } from "jsdom";
import axe from "axe-core";

const root = process.cwd();
const built = path.join(root, ".next/server/app");
const routes = [
  "",
  "about",
  "our-story",
  "founders-message",
  "paths-to-belonging",
  "what-we-do",
  "our-approach",
  "values",
  "support",
  "contact",
  "get-involved",
  "accessibility",
  "dyslexia",
  "dyspraxia",
  "dyscalculia",
  "dysgraphia",
  "membership", "policies", "privacy", "cookies", "safeguarding", "complaints",
  "equality", "confidentiality", "disclaimer", "data-retention",
];
function page(route = "") {
  return new JSDOM(
    fs.readFileSync(path.join(built, `${route || "index"}.html`), "utf8"),
    {
      url: `https://connecting-dys.example/${route}`,
      runScripts: "outside-only",
    },
  );
}

test("previous logo sources remain intact and the selected word-heart identity is used consistently", () => {
  const hash = createHash("sha256")
    .update(fs.readFileSync("public/brand/connecting_dys_logo.png"))
    .digest("hex");
  assert.equal(
    hash,
    "bb68edef8faee420c861661d3b1f19e06db8c12dc17060d01a3deb4caba1112b",
  );
  assert.equal(
    createHash("sha256")
      .update(fs.readFileSync("public/brand/connecting-dys-embrace.png"))
      .digest("hex"),
    "a0126d9aa517efc994eb72af77d2eea45d580e1ba85fb2d8d0fdcc7d64875e6f",
    "approved header/hero symbol adaptation is unchanged",
  );
  const dom = page();
  const doc = dom.window.document;
  const logo = doc.querySelector(".brand-link img")!;
  const hero = doc.querySelector(".hero-dys-embrace img")!;
  assert.equal(new URL(logo.getAttribute("src")!, "https://example.com").searchParams.get("url"), "/images/dys-embrace-transparent.png");
  assert.equal(new URL(hero.getAttribute("src")!, "https://example.com").searchParams.get("url"), "/images/dys-embrace-transparent.png");
  assert.ok(doc.querySelector('link[rel="icon"]')?.getAttribute("href")?.includes("word-heart-favicon"));
  dom.window.close();

});

test("inline journey exposes its first board before hydration and keeps the footer available", () => {
  const dom = page();
  const section = dom.window.document.querySelector("[data-paths-section]")!;
  assert.ok(section.textContent?.includes("Three short chapters"));
  assert.ok(section.querySelector("noscript")?.textContent?.includes("need JavaScript"));
  assert.ok(section.querySelector("[data-paths-game]"));
  assert.ok(section.querySelector(".paths-world"));
  assert.ok([...section.querySelectorAll("button")].every((button) => button.disabled));
  assert.ok(dom.window.document.getElementById("site-footer"));
  dom.window.close();
});

test("homepage stays brief, illustrated and free of detailed topic/story duplication", () => {
  const dom = page(); const doc = dom.window.document;
  assert.deepEqual([...doc.querySelectorAll("main > section")].map(s => s.getAttribute("aria-labelledby")),
    ["hero-title", "paths-title", "stand-title", "recognition-title", "support-title", "approach-title", "invitation-title"]);
  assert.equal(doc.querySelectorAll("main .difference-row, main [data-source-id], main .about-home").length, 0);
  assert.equal(doc.querySelectorAll(".hero-copy .copy-panel").length, 0, "the welcome is an open banner");
  assert.equal(doc.querySelectorAll(".hero-actions a").length, 4);
  assert.equal(doc.querySelectorAll(".hero-dys-embrace img, .recognition-photo, .home-approach .bridge-artwork").length, 3);
  assert.equal(doc.querySelectorAll(".principle-list li").length, 4);
  assert.equal(doc.querySelectorAll("main > [data-paths-section]").length, 1);
  const copy = doc.querySelector("main")!.cloneNode(true) as Element;
  copy.querySelector("[data-paths-section]")!.remove();
  const words = copy.textContent!.trim().split(/\s+/).length;
  assert.ok(words < 400, `homepage has ${words} words`);
  assert.ok(doc.querySelector(".recognition-figure figcaption")?.textContent?.includes("Background edited for privacy"));
  assert.equal(doc.querySelectorAll("header .settings-trigger").length, 0);
  assert.equal(doc.querySelectorAll('.reading-toolbar .settings-trigger[aria-haspopup="dialog"]').length, 1);
  assert.equal(doc.querySelectorAll('dialog input[type="checkbox"]').length, 3);
  assert.equal(doc.querySelectorAll(".hero-recess-shape").length, 2);
  dom.window.close();
});

test("story and founder message stand alone; all four topic pages have local explanations", () => {
  for (const [route, source] of [["our-story", "story"], ["founders-message", "founder"]]) {
    const dom = page(route);
    assert.deepEqual([...dom.window.document.querySelectorAll("main [data-source-id]")].map(s => s.getAttribute("data-source-id")), [source]);
    assert.ok(dom.window.document.querySelector("main .editorial-art img"));
    dom.window.close();
  }
  for (const route of ["dyspraxia", "dyscalculia", "dysgraphia", "dyslexia"]) {
    const dom = page(route); const doc = dom.window.document;
    assert.ok(doc.querySelector(".topic-art svg"));
    assert.ok(doc.querySelector("#difference-about"));
    assert.equal(doc.querySelectorAll(".difference-experiences li").length, 3);
    assert.equal(doc.querySelectorAll('main a[href*="base44"]').length, 0);
    dom.window.close();
  }
});

test("desktop and mobile navigation expose the same grouped destinations without JavaScript", () => {
  const dom = page(); const doc = dom.window.document;
  const desktop = doc.querySelector('nav[aria-label="Main navigation"]')!;
  const mobile = doc.querySelector('nav[aria-label="Mobile navigation"]')!;
  for (const nav of [desktop, mobile]) {
    assert.deepEqual([...nav.querySelectorAll("summary")].map(n => n.textContent), ["About", "Explore DYS", "Information", "Get involved"]);
    assert.ok(nav.querySelector('a[href="/founders-message"]'));
    assert.ok(nav.querySelector('a[href="/our-story"]'));
    assert.equal(nav.querySelectorAll('.nav-group:nth-of-type(2) a').length, 4);
  }
  assert.deepEqual([...desktop.querySelectorAll("a")].map(a => a.getAttribute("href")), [...mobile.querySelectorAll("a")].map(a => a.getAttribute("href")));
  dom.window.close();
});

test("mission and vision retain the latest supplied statements and are directly discoverable", () => {
  const dom = page("about");
  const content = dom.window.document.querySelector("#mission-and-vision")!;
  assert.ok(content);
  assert.ok(content.textContent?.includes("To reduce isolation among DYS individuals and families by building inclusive, community-led spaces rooted in lived experience, connection, and shared understanding."));
  assert.ok(content.textContent?.includes("A society where DYS individuals and families are connected, confident, and supported by communities that understand them not in isolation, but together."));
  assert.equal(content.querySelectorAll("details").length, 0, "the complete statements are visible without opening disclosures");
  assert.equal(content.querySelectorAll(".source-section").length, 3);
  assert.equal(content.querySelectorAll(".copy-panel").length, 6, "each mission, vision and goal paragraph has its own panel");
  dom.window.close();
});

test("production routes have complete semantic content without JavaScript", () => {
  for (const route of routes) {
    const dom = page(route);
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll("main").length, 1, route);
    assert.equal(doc.querySelectorAll("main [data-doodle-anchor]").length, 1, `${route}: decoration must mount inside its own streamed page`);
    assert.equal(doc.querySelectorAll("h1").length, 1, route);
    assert.equal(doc.documentElement.lang, "en-GB", route);
    assert.ok(doc.title.includes("Connecting Dys"), route);
    assert.ok(doc.querySelector('#main-content[tabindex="-1"]'), route);
    assert.ok(
      doc.body.textContent?.includes("A home for every DYS mind."),
      route,
    );
    assert.equal(doc.querySelectorAll("img:not([alt])").length, 0, route);
    // An empty src was the original brand defect; also verify optimized image inputs.
    for (const img of doc.querySelectorAll("img")) {
      const url = new URL(img.src);
      const asset =
        url.pathname === "/_next/image"
          ? url.searchParams.get("url")
          : url.pathname;
      assert.ok(
        asset && fs.existsSync(path.join(root, "public", asset)),
        `${route}: ${asset}`,
      );
    }
    const headings = [...doc.querySelectorAll("h1,h2,h3")].filter(
      (h) => !h.closest("dialog, #cookie-notice"),
    );
    let previous = 0;
    for (const h of headings) {
      const level = Number(h.tagName[1]);
      assert.ok(
        level <= previous + 1,
        `${route}: skipped level at ${h.textContent}`,
      );
      previous = level;
    }
    dom.window.close();
  }
});

test("all internal route links and fragments resolve in production HTML", () => {
  for (const route of routes) {
    const dom = page(route);
    for (const link of dom.window.document.querySelectorAll("a[href]")) {
      const url = new URL(link.getAttribute("href")!, dom.window.location.href);
      if (url.origin !== dom.window.location.origin) continue;
      if (url.pathname.startsWith("/documents/")) {
        assert.ok(fs.statSync(path.join(root, "public", url.pathname)).size > 1000, `${route}: missing download ${url.pathname}`);
        continue;
      }
      const destination = decodeURIComponent(url.pathname)
        .replace(/^\//, "")
        .replace(/\/$/, "");
      assert.ok(
        routes.includes(destination),
        `${route}: unknown route ${url.pathname}`,
      );
      if (url.hash) {
        const target = page(destination);
        assert.ok(
          target.window.document.getElementById(
            decodeURIComponent(url.hash.slice(1)),
          ),
          `${route}: missing ${url.hash}`,
        );
        target.window.close();
      }
    }
    dom.window.close();
  }
});

test("new content removes personal attribution and provides on-page membership interest forms", () => {
  for (const route of routes) {
    const dom = page(route);
    assert.doesNotMatch(dom.window.document.body.textContent || "", /\bMarie\b|\bJohnson\b|hello@connectingdys\.org|\[Insert/i, route);
    assert.ok(dom.window.document.querySelector('a[href="/policies"]'), route);
    assert.ok(dom.window.document.querySelector('a[href="/cookies"]'), route);
    dom.window.close();
  }
  const membership = page("membership");
  assert.equal(membership.window.document.querySelectorAll('main a[download]').length, 0);
  assert.equal(membership.window.document.querySelectorAll("main form").length, 2);
  assert.doesNotMatch(membership.window.document.querySelector("main")!.textContent!, /download|nothing is submitted/i);
  for (const form of membership.window.document.querySelectorAll("main form")) {
    assert.equal(form.getAttribute("action"), "mailto:connectingdys@gmail.com");
    assert.equal(form.getAttribute("method"), "post", "no-JS fallback must never put personal data in a page URL");
    assert.ok(form.querySelector('input[name="acknowledgement"][required]'));
    assert.ok(form.querySelector('button[type="submit"][disabled]'), "no-JS users have the direct email link");
  }
  assert.match(membership.window.document.querySelector("main")!.textContent!, /does not enrol you/);
  assert.match(membership.window.document.querySelector("main")!.textContent!, /If you are aged 13–15:/);
  assert.match(membership.window.document.querySelector("main")!.textContent!, /If you are aged 16–17:/);
  membership.window.close();
});

test("pre-paint bootstrap applies all fonts and saved reading choices", () => {
  for (const font of [
    "Open Sans",
    "Arial",
    "Verdana",
    "Atkinson Hyperlegible",
    "OpenDyslexic",
  ]) {
    const dom = page();
    dom.window.localStorage.setItem(
      "connecting-dys-reading-settings",
      JSON.stringify({
        font,
        size: 26,
        lineHeight: 2,
        letterSpacing: 0.12,
        background: "#FFFFFF",
        reduceMotion: true,
      }),
    );
    const bootstrap = [...dom.window.document.scripts].find((s) =>
      s.textContent?.startsWith("try{"),
    );
    assert.ok(bootstrap, "production bootstrap exists");
    vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext());
    const doc = dom.window.document.documentElement;
    assert.ok(
      doc.style
        .getPropertyValue("--reading-font")
        .includes(font === "Open Sans" ? "--font-open-sans" : font),
    );
    assert.equal(doc.style.getPropertyValue("--reading-size"), "26px");
    assert.equal(doc.style.getPropertyValue("--reading-background"), "#FFFFFF");
    assert.equal(doc.dataset.reduceMotion, "true");
    assert.equal(doc.dataset.spacious, "true");
    dom.window.close();
  }
});

test("malformed, hostile and unavailable storage cannot break first paint", () => {
  for (const saved of [
    "broken-json",
    "null",
    "42",
    JSON.stringify({
      font: "__proto__",
      size: 1e99,
      lineHeight: -4,
      letterSpacing: "oops",
      background: "url(javascript:alert(1))",
      reduceMotion: "true",
    }),
  ]) {
    const dom = page();
    dom.window.localStorage.setItem("connecting-dys-reading-settings", saved);
    const bootstrap = [...dom.window.document.scripts].find((s) =>
      s.textContent?.startsWith("try{"),
    )!;
    assert.doesNotThrow(() =>
      vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext()),
    );
    assert.equal(dom.window.document.documentElement.dataset.js, "true");
    assert.notEqual(
      dom.window.document.documentElement.dataset.reduceMotion,
      "true",
    );
    assert.ok(
      !dom.window.document.documentElement.style.cssText.includes("javascript"),
    );
    dom.window.close();
  }
  const dom = page();
  Object.defineProperty(dom.window, "localStorage", {
    get() {
      throw new Error("Storage denied");
    },
  });
  const bootstrap = [...dom.window.document.scripts].find((s) =>
    s.textContent?.startsWith("try{"),
  )!;
  assert.doesNotThrow(() =>
    vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext()),
  );
  assert.equal(dom.window.document.documentElement.dataset.js, "true");
  assert.equal(dom.window.document.documentElement.dataset.texture, "on");
  dom.window.close();
});

test("texture migrates safely and restores before paint without changing reading choices", () => {
  for (const texture of [undefined, true, false, "off", null, 0]) {
    for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
      for (const background of ["#FCF7ED", "#FFFFFF", "#EBF4FA", "#FFF0E4"]) {
        const dom = page();
        dom.window.localStorage.setItem("connecting-dys-reading-settings", JSON.stringify({
          font, background, texture, size: 26, lineHeight: 2, letterSpacing: 0.12, reduceMotion: true,
        }));
        const bootstrap = [...dom.window.document.scripts].find((s) => s.textContent?.startsWith("try{"))!;
        vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext());
        const html = dom.window.document.documentElement;
        assert.equal(html.dataset.texture, texture === false ? "off" : "on");
        assert.equal(html.dataset.textureStyle, "paper", "legacy settings use paper");
        assert.equal(html.dataset.reduceMotion, "true");
        assert.equal(html.dataset.spacious, "true");
        assert.equal(html.style.getPropertyValue("--reading-background"), background);
        assert.equal(html.style.getPropertyValue("--reading-size"), "26px");
        assert.ok(html.style.getPropertyValue("--reading-font").includes(font === "Open Sans" ? "--font-open-sans" : font));
        dom.window.close();
      }
    }
  }
});

test("texture styles validate before paint, including Off and hostile stored values", () => {
  for (const textureStyle of ["paper", "linen", "plaster", "url(https://example.com)", "__proto__", null, 5]) {
    for (const texture of [true, false]) {
      const dom = page();
      dom.window.localStorage.setItem("connecting-dys-reading-settings", JSON.stringify({ texture, textureStyle, background: "#EBF4FA", font: "Verdana" }));
      const bootstrap = [...dom.window.document.scripts].find((s) => s.textContent?.startsWith("try{"))!;
      vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext());
      const html = dom.window.document.documentElement;
      assert.equal(html.dataset.textureStyle, ["paper", "linen", "plaster"].includes(textureStyle as string) ? textureStyle : "paper");
      assert.equal(html.dataset.texture, texture ? "on" : "off");
      assert.equal(html.style.getPropertyValue("--reading-background"), "#EBF4FA");
      dom.window.close();
    }
  }
});

test("axe finds no detectable WCAG A/AA structural violations in rendered routes", async () => {
  for (const route of routes) {
    const dom = page(route);
    vm.runInContext(axe.source, dom.getInternalVMContext());
    // jsdom has no layout/rendering engine. Contrast and visual reflow require browser QA.
    const result = await (dom.window as unknown as { axe: typeof axe }).axe.run(
      dom.window.document,
      {
        runOnly: {
          type: "tag",
          values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
        },
        rules: { "color-contrast": { enabled: false } },
      },
    );
    assert.equal(
      result.violations.length,
      0,
      `${route}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    );
    dom.window.close();
  }
});

test("brand reading text combinations meet AA contrast on every background preset", () => {
  const luminance = (hex: string) => {
    const rgb = hex
      .replace("#", "")
      .match(/../g)!
      .map((v) => parseInt(v, 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const ratio = (a: string, b: string) => {
    const x = luminance(a),
      y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  };
  const css = fs.readFileSync("src/app/globals.css", "utf8");
  const token = (name: string) =>
    css.match(new RegExp(`--brand-${name}:\\s*(#[a-fA-F0-9]{6})`))![1];
  for (const background of [
    token("cream"),
    "#FFFFFF",
    "#EBF4FA",
    "#FFF0E4",
    "#e9efea",
    "#f0e5d5",
  ]) {
    for (const foreground of [token("navy"), token("teal")])
      assert.ok(
        ratio(foreground, background) >= 4.5,
        `${foreground} on ${background}`,
      );
  }
  assert.ok(ratio("#FFFFFF", token("teal")) >= 4.5);
  assert.ok(ratio(token("amber"), token("navy")) >= 4.5);
});

test("material grain and button highlight retain conservative AA text contrast", () => {
  const rgb = (hex: string) => hex.replace("#", "").match(/../g)!.map((v) => parseInt(v, 16) / 255);
  const mix = (base: number[], overlay: number[], alpha: number) => base.map((v, i) => v * (1 - alpha) + overlay[i] * alpha);
  const luminance = (c: number[]) => c.map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const ratio = (a: number[], b: number[]) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
  // Bound all three tiles by 0.08 alpha at entirely black/white. Paper is .08;
  // linen uses .06 white / at most .055 dark and plaster is at most .042. Button sheen adds at most 0.04 white. No layout/axe claim.
  const darkest = (c: number[]) => mix(c, [0, 0, 0], 0.08);
  const lightest = (c: number[]) => mix(c, [1, 1, 1], 0.08);
  for (const paper of ["#FCF7ED", "#FFFFFF", "#EBF4FA", "#FFF0E4"]) {
    for (const ink of ["#20354D", "#146C78", "#4E5E6E"])
      assert.ok(ratio(rgb(ink), darkest(rgb(paper))) >= 4.5, `${ink} on textured ${paper}`);
  }
  assert.ok(ratio(rgb("#FFFFFF"), lightest(mix(rgb("#146C78"), [1, 1, 1], 0.04))) >= 4.5);
  for (const scene of ["#20354D", "#063F51", "#146C78", "#294D5B", "#284B54"])
    assert.ok(ratio(rgb("#FCF7ED"), lightest(rgb(scene))) >= 4.5, `cream on textured ${scene}`);
  for (const scene of ["#294D5B", "#284B54"])
    assert.ok(ratio(rgb("#F5D49D"), lightest(rgb(scene))) >= 4.5, `amber on textured ${scene}`);
});

test("optional fonts are real local assets and are not eagerly preloaded", () => {
  const dom = page();
  for (const href of [
    "public/fonts/OpenDyslexic-Regular.woff2",
    "public/fonts/OpenDyslexic-Bold.woff2",
    "public/fonts/atkinson-hyperlegible-regular.woff2",
    "public/fonts/atkinson-hyperlegible-bold.woff2",
  ]) {
    assert.ok(fs.statSync(href).size > 1000, href);
  }
  for (const preload of dom.window.document.querySelectorAll(
    'link[rel="preload"][as="font"]',
  )) {
    assert.ok(
      !/OpenDyslexic|atkinson/i.test(preload.getAttribute("href") || ""),
    );
  }
  dom.window.close();
});

test("dark mode restores before paint, validates old storage and preserves the light reading choice", () => {
  for (const darkMode of [true, false, undefined, "true", null]) {
    for (const [background, dark] of [["#FCF7ED", "#162938"], ["#FFFFFF", "#122330"], ["#EBF4FA", "#1B3044"], ["#FFF0E4", "#2B292B"]]) {
      const dom = page();
      const saved = { darkMode, background, texture: false, font: "Verdana", size: 26, lineHeight: 2, letterSpacing: .12 };
      dom.window.localStorage.setItem("connecting-dys-reading-settings", JSON.stringify(saved));
      const bootstrap = [...dom.window.document.scripts].find((s) => s.textContent?.startsWith("try{"))!;
      vm.runInContext(bootstrap.textContent!, dom.getInternalVMContext());
      const html = dom.window.document.documentElement;
      assert.equal(html.dataset.theme, darkMode === true ? "dark" : "light");
      assert.equal(html.style.colorScheme, darkMode === true ? "dark only" : "light only");
      assert.equal(dom.window.document.querySelector('meta[name="color-scheme"]')?.getAttribute("content"), "only light", "SSR hint stays stable through hydration; live scheme is CSS-owned");
      assert.equal(html.style.getPropertyValue("--reading-background"), darkMode === true ? dark : background);
      assert.equal(html.dataset.texture, "off");
      assert.equal(html.dataset.spacious, "true");
      assert.deepEqual(JSON.parse(dom.window.localStorage.getItem("connecting-dys-reading-settings")!), JSON.parse(JSON.stringify(saved)), "pre-paint restore never rewrites saved choices");
      dom.window.close();
    }
  }
});


test("About Us contains only the five requested content sections", () => {
  const dom = page("about");
  const main = dom.window.document.querySelector("main")!;
  assert.deepEqual([...main.querySelectorAll("[data-source-id]")].map(section => section.getAttribute("data-source-id")), ["why", "mission", "vision", "goal", "about-work"]);
  assert.equal(main.querySelector("h1")!.textContent, "About Us");
  dom.window.close();
});

test("dyslexia follows the other conditions in website prose, lists, menus and descriptions", () => {
  const group = /\b(?:Dyslexia|Dyspraxia|Dyscalculia|Dysgraphia)\b(?:(?:,\s*(?:(?:and|or)\s+)?|\s+(?:and|or)\s+)(?:Dyslexia|Dyspraxia|Dyscalculia|Dysgraphia)\b){1,3}/gi;
  const name = /\b(?:Dyslexia|Dyspraxia|Dyscalculia|Dysgraphia)\b/gi;
  for (const route of routes) {
    const dom = page(route); const doc = dom.window.document;
    for (const node of doc.querySelectorAll("main p,main li,img[alt],meta[name='description']")) {
      const text = node.getAttribute("alt") || node.getAttribute("content") || node.textContent || "";
      for (const match of text.matchAll(group)) {
        const names = match[0].match(name)!.map(value => value.toLowerCase());
        if (names.includes("dyslexia")) assert.equal(names.at(-1), "dyslexia", `${route}: ${match[0]}`);
      }
    }
    const links = [...doc.querySelectorAll('nav[aria-label="Learning differences"] a')];
    assert.equal(links.at(-1)!.getAttribute("href"), "/dyslexia", route);
    for (const list of doc.querySelectorAll("main ul")) {
      const entries = [...list.children].filter(node => /^(?:Dyslexia|Dyspraxia|Dyscalculia|Dysgraphia)\b/.test(node.textContent || ""));
      if (entries.length > 1 && entries.some(node => /^Dyslexia\b/.test(node.textContent || ""))) assert.match(entries.at(-1)!.textContent || "", /^Dyslexia\b/, route);
    }
    dom.window.close();
  }
});


test("editorial hierarchy, photo variety and native policy disclosures are preserved in the output", () => {
  const story = page("our-story");
  const doc = story.window.document;
  assert.equal(doc.querySelector("h2.editorial-question")!.textContent, "What happens next?");
  assert.ok(doc.querySelectorAll(".editorial-statement").length >= 3);
  const photos = [...doc.querySelectorAll(".community-photo img")].map(img => new URL(img.getAttribute("src")!, "https://example.com").searchParams.get("url"));
  assert.deepEqual(photos, ["/images/shared-reading.webp", "/images/exploring-books.webp"]);
  story.window.close();
  for (const route of ["privacy", "safeguarding", "complaints", "equality", "cookies", "confidentiality"]) {
    const dom = page(route);
    const panels = [...dom.window.document.querySelectorAll("details.policy-disclosure")];
    assert.ok(panels.length > 0, route);
    assert.ok(panels.every(panel => panel.querySelector(":scope > summary h2")), route);
    assert.ok(panels.every(panel => !panel.hasAttribute("open")), `${route}: compact on first paint`);
    dom.window.close();
  }
});

test("corner illustrations stay decorative, complete and matched to their subject", () => {
  const about = page("about");
  const doc = about.window.document;
  const expected = { why: "connection", mission: "path", vision: "bridge", goal: "growth" };
  for (const [source, motif] of Object.entries(expected)) {
    const doodle = doc.querySelector(`[data-source-id="${source}"] .edge-doodle`)!;
    assert.ok(doodle, source);
    assert.equal(doodle.getAttribute("data-edge-motif"), motif);
    assert.equal(doodle.getAttribute("aria-hidden"), "true");
    assert.equal(doodle.querySelectorAll("a,button,text,title,[tabindex]").length, 0);
    assert.equal(doodle.querySelector("svg")?.getAttribute("focusable"), "false");
    assert.equal(doodle.parentElement?.firstElementChild, doodle, "the dedicated decoration row precedes all prose");
  }
  assert.ok(doc.querySelector(".edge-doodle svg [opacity]"), "duotone illustrations include their secondary colour layer");
  about.window.close();
  for (const route of ["about", "our-story", "founders-message", "our-approach", "what-we-do", "values", "support", "get-involved", "contact", "membership", "accessibility", "dyspraxia", "dyscalculia", "dysgraphia", "dyslexia", "policies", "privacy", "safeguarding", "data-retention"]) {
    const dom = page(route);
    for (const panel of dom.window.document.querySelectorAll("main .copy-panel")) {
      assert.equal(panel.querySelectorAll(":scope > .edge-doodle, :scope > summary > .edge-doodle").length, 1, `${route}: every content box has one corner illustration`);
    }
    for (const doodle of dom.window.document.querySelectorAll(".edge-doodle")) {
      assert.equal(doodle.getAttribute("aria-hidden"), "true", route);
      assert.equal(doodle.querySelectorAll("a,button,text,title,[tabindex]").length, 0, route);
    }
    dom.window.close();
  }
  const home = page("");
  assert.equal(home.window.document.querySelectorAll(".edge-doodle").length, 0, "corner illustrations stay on internal pages");
  home.window.close();
});


test("the Lordicon experiment uses the five verified free doodles with credit and unique references", () => {
  const dom = page("about");
  const doc = dom.window.document;
  const lordicons = [...doc.querySelectorAll('svg[data-icon-provider="lordicon"]')];
  assert.ok(lordicons.length > 0);
  const freeIds = new Set(["20-heart", "63-home", "112-book-bookmark", "1827-growing-plant", "981-avatars-chatting"]);
  for (const svg of lordicons) {
    assert.ok(freeIds.has(svg.getAttribute("data-lordicon-id")!));
    assert.equal(svg.querySelectorAll("script,foreignObject,animate,animateTransform,iframe").length, 0);
    for (const el of svg.querySelectorAll("[clip-path],[mask],[filter],[href]")) {
      for (const attr of ["clip-path", "mask", "filter", "href"]) {
        const ref = el.getAttribute(attr)?.match(/#([^\)]+)/)?.[1];
        if (ref) assert.ok([...svg.querySelectorAll("[id]")].some(target => target.id === ref), `${attr}: reference stays within this icon`);
      }
    }
  }
  const allIds = [...doc.querySelectorAll("[id]")].map(el => el.id);
  assert.equal(new Set(allIds).size, allIds.length, "repeated doodles have isolated masks and clip paths");
  assert.ok(doc.querySelector('footer a[href="https://lordicon.com/"]')?.textContent?.includes("Lordicon"));
  dom.window.close();
});
