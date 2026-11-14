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
  "support",
  "contact",
  "get-involved",
  "accessibility",
  "dyslexia",
  "dyspraxia",
  "dyscalculia",
  "dysgraphia",
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

test("approved logo is byte-for-byte unchanged", () => {
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
});

test("homepage scene contracts preserve order, decorative scope and direct navigation", () => {
  const dom = page();
  const doc = dom.window.document;
  const sections = [...doc.querySelectorAll("main > section")];
  assert.deepEqual(
    sections.map((section) => section.getAttribute("aria-labelledby")),
    ["hero-title", "recognition-title", "explore-title", "community-title", "support-title", "about-title", "invitation-title"],
  );
  for (const selector of [".hero-orbit", ".recognition-media .recognition-photo", ".connection-visual .art-landscape", ".connection-chapters", ".connection-progress span"]) {
    assert.equal(doc.querySelectorAll(selector).length, 1, selector);
  }
  const artwork = doc.querySelector('.connection-visual[aria-hidden="true"]');
  assert.ok(artwork, "only decorative artwork may pin");
  assert.equal(artwork.querySelectorAll("a,button,input,select,[tabindex]").length, 0);
  assert.equal(artwork.querySelector(".journey-path")?.getAttribute("pathLength"), "1");
  assert.equal(doc.querySelectorAll(".connection-chapters > article").length, 3);
  assert.deepEqual(
    [...doc.querySelectorAll(".difference-row")].map((a) => a.getAttribute("href")),
    ["/dyslexia", "/dyspraxia", "/dyscalculia", "/dysgraphia"],
  );
  assert.ok(doc.querySelector(".recognition-figure figcaption")?.textContent?.includes("Not Connecting Dys members"));
  assert.equal(doc.querySelectorAll("header .settings-trigger").length, 0);
  assert.equal(doc.querySelectorAll(".reading-toolbar .settings-trigger").length, 1);
  dom.window.close();
});

test("production routes have complete semantic content without JavaScript", () => {
  for (const route of routes) {
    const dom = page(route);
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll("main").length, 1, route);
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
      (h) => !h.closest("dialog"),
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
  // Bound the SVG's 0.08 alpha at entirely black/white, stronger than its real
  // fine fibres. Button sheen adds at most 0.04 white. No layout/axe claim.
  const darkest = (c: number[]) => mix(c, [0, 0, 0], 0.08);
  const lightest = (c: number[]) => mix(c, [1, 1, 1], 0.08);
  for (const paper of ["#FCF7ED", "#FFFFFF", "#EBF4FA", "#FFF0E4"]) {
    for (const ink of ["#20354D", "#146C78", "#4E5E6E"])
      assert.ok(ratio(rgb(ink), darkest(rgb(paper))) >= 4.5, `${ink} on textured ${paper}`);
  }
  assert.ok(ratio(rgb("#FFFFFF"), lightest(mix(rgb("#146C78"), [1, 1, 1], 0.04))) >= 4.5);
  for (const scene of ["#20354D", "#063F51", "#146C78"])
    assert.ok(ratio(rgb("#FCF7ED"), lightest(rgb(scene))) >= 4.5, `cream on textured ${scene}`);
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
