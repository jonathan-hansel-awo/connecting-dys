import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import axe from "axe-core";
import { registerTsx } from "./helpers/register-tsx.mjs";
import { chapters } from "../src/features/paths-to-belonging/chapters.ts";
import { gardenRoutes, neighbourhoodRoutes, endingRoutes } from "./fixtures/paths-to-belonging.ts";
import type { Board } from "../src/features/paths-to-belonging/types.ts";

test("actual optional journey components: DOM interaction and focus", async (suite) => {
  const loader = registerTsx();
  const dom = new JSDOM("<!doctype html><html lang='en-GB'><title>Game test</title><body><main id='root'></main><footer id='site-footer' tabindex='-1'>Contact</footer></body></html>", { url: "https://connecting-dys.example", runScripts: "outside-only" });
  const globals = { window: dom.window, self: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
  const original = new Map(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { PathsToBelongingSection, JourneyBoundary } = await import("../src/features/paths-to-belonging/section.tsx");
  const { default: PathsJourney } = await import("../src/features/paths-to-belonging/journey.tsx");
  const { EndingComposition, worldBounds } = await import("../src/features/paths-to-belonging/paper-world.tsx");
  const doc = dom.window.document;
  let root = createRoot(doc.getElementById("root")!);
  const button = (name: string) => {
    const found = [...doc.querySelectorAll<HTMLButtonElement>("button")].find((el) => el.textContent === name && !el.hidden);
    assert.ok(found, `Missing button: ${name}`);
    return found;
  };
  async function click(el: HTMLElement) {
    el.focus();
    await act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true })); });
  }
  async function waitForGame() {
    for (let tick = 0; !doc.querySelector("[data-paths-game]"); tick++) {
      assert.ok(tick < 100, "lazy game should mount");
      await act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });
    }
  }
  async function mount() { await reset(); await act(async () => root.render(React.createElement(PathsToBelongingSection))); await waitForGame(); }
  async function reset() {
    await act(async () => root.unmount());
    root = createRoot(doc.getElementById("root")!);
  }
  async function solve(index: number, target: Board) {
    for (const [id, orientation] of Object.entries(target)) {
      const piece = doc.getElementById(`paths-piece-${id}`)!;
      for (let turns = 0; turns < (orientation - chapters[index].arrangements[0].board[id] + 4) % 4; turns++) {
        await click(piece);
        assert.strictEqual(doc.activeElement, piece, "a move retains focus on its piece");
      }
    }
  }
  try {
    await suite.test("inline board does not steal focus; actual tile actions, three chapters, ending and replay", async () => {
      await mount();
      assert.ok(doc.querySelector("[data-paths-game]"));
      assert.strictEqual(doc.activeElement, doc.body, "an inline game must not steal page focus on mount");
      assert.equal(button("Undo").disabled, true);
      const targets = [gardenRoutes.upper, neighbourhoodRoutes.perimeter, endingRoutes["home-arch"]];
      for (let index = 0; index < 3; index++) {
        const landscape = doc.querySelector("[data-paper-landscape]")!;
        assert.equal(landscape.getAttribute("viewBox"), worldBounds(chapters[index]).viewBox);
        assert.equal(landscape.getAttribute("aria-hidden"), "true");
        assert.equal(landscape.querySelectorAll("button,a,[tabindex]").length, 0, "scenery has no controls or focus targets");
        await solve(index, targets[index]);
        assert.equal(doc.querySelector(".paths-world")?.getAttribute("data-complete"), "true");
        assert.ok(doc.querySelector("h3")?.textContent === chapters[index].name);
        dom.window.eval(axe.source);
        const audit = await (dom.window as unknown as { axe: typeof axe }).axe.run(doc, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] }, rules: { "color-contrast": { enabled: false } } });
        assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations));
        await click(button("Continue"));
        assert.equal(doc.activeElement?.textContent, index === 2 ? "There's more than one way to belong." : chapters[index + 1].name);
      }
      assert.match(doc.querySelector('[role="status"]')!.textContent!, /An arch above a home/);
      assert.equal(doc.querySelector("[data-ending]")?.getAttribute("data-ending"), "home-arch");
      assert.equal(doc.querySelector(".paths-actions a")?.getAttribute("href"), "/membership");
      assert.match(doc.querySelector(".paths-actions a")!.textContent!, /Register your interest/);
      await click(button("Replay journey"));
      assert.equal(doc.activeElement?.textContent, "Find a Way");
      assert.equal(doc.querySelector("[data-ending]"), null, "replay removes the previous ending");
      assert.match(doc.getElementById("paths-piece-willow-bend")!.getAttribute("aria-label")!, /south and west/);
      await reset();
    });
    await suite.test("hint, undo, restart, skip and preference changes preserve the inline game", async () => {
      await mount();
      const piece = doc.getElementById("paths-piece-willow-bend")!;
      const initial = piece.getAttribute("aria-label");
      await click(button("Hint"));
      assert.match(doc.getElementById("paths-hint")!.textContent!, /Try turning/);
      assert.equal(piece.getAttribute("aria-label"), initial);
      const hint = doc.querySelector(".is-hint")!.id;
      await click(button("Hint"));
      assert.notEqual(doc.querySelector(".is-hint")!.id, hint);
      await click(piece);
      const changed = piece.getAttribute("aria-label");
      doc.documentElement.dataset.theme = "dark";
      doc.documentElement.dataset.spacious = "true";
      dom.window.dispatchEvent(new dom.window.Event("connecting-dys:preferences"));
      assert.equal(piece.getAttribute("aria-label"), changed);
      await click(button("Undo"));
      assert.equal(piece.getAttribute("aria-label"), initial);
      await click(button("Restart chapter"));
      assert.equal(doc.activeElement?.textContent, "Find a Way");
      assert.equal(button("Undo").disabled, true);
      for (const chapter of chapters) {
        await click(button("Skip chapter"));
        assert.equal(doc.activeElement?.textContent, chapter.name);
        assert.match(doc.querySelector('[role="status"]')!.textContent!, /Chapter skipped/);
        await click(button("Continue"));
      }
      assert.equal(doc.activeElement?.textContent, "Thank you for exploring.");
      assert.equal(doc.querySelector("[data-ending]"), null, "skipping never invents an ending picture");
      assert.equal(doc.querySelector(".paths-actions a")?.getAttribute("href"), "/membership", "an optional signup remains available after skipping");
      await reset();
    });
    await suite.test("ending art preserves the actual graph and offers three distinct compositions", () => {
      const pictures = new Set<string>();
      const frames = new Set<string>();
      for (const [endingId, board] of Object.entries(endingRoutes)) {
        const snapshot: Board = board;
        const markup = renderToStaticMarkup(React.createElement(EndingComposition, { chapter: chapters[2], board, endingId }));
        const picture = new JSDOM(markup).window.document;
        assert.equal(picture.querySelector("figure")?.getAttribute("data-ending"), endingId);
        assert.equal(picture.querySelectorAll("[data-ending-piece]").length, chapters[2].tiles.length);
        assert.equal(picture.querySelectorAll("button,a,[tabindex]").length, 0);
        assert.equal(picture.querySelector("svg")?.getAttribute("aria-hidden"), "true");
        assert.match(picture.querySelector("figcaption")!.textContent!, /connections you made/);
        for (const tile of chapters[2].tiles) {
          const piece = picture.querySelector(`[data-ending-piece='${tile.id}']`)!;
          assert.equal(piece.getAttribute("transform"), `translate(${tile.x * 100} ${tile.y * 100})`);
          if (tile.kind === "path" && tile.rotatable) assert.equal(piece.querySelector(".paths-pathwork")?.getAttribute("transform"), `rotate(${snapshot[tile.id] * 90} 50 50)`);
        }
        frames.add(picture.querySelector(".paths-ending-frame")!.getAttribute("d")!);
        pictures.add(markup);
      }
      assert.equal(frames.size, 3);
      assert.equal(pictures.size, 3);
      assert.equal(renderToStaticMarkup(React.createElement(EndingComposition, { chapter: chapters[2], board: chapters[2].arrangements[0].board, endingId: "heart-loop" })), "");
      assert.equal(renderToStaticMarkup(React.createElement(EndingComposition, { chapter: chapters[2], board: endingRoutes["heart-loop"], endingId: "home-arch" })), "");
    });
    await suite.test("decorative completion is reversible without losing the focused tile", async () => {
      await mount();
      assert.equal(doc.querySelectorAll(".paths-piece.is-joined").length, 0);
      await solve(0, gardenRoutes.upper);
      assert.equal(doc.querySelectorAll('.paths-piece[role="img"].is-joined .paths-landmark-halo').length, 2);
      assert.match(doc.querySelector('.paths-piece[role="img"].is-joined')!.getAttribute("aria-label")!, /Connected to another place/);
      const world = doc.querySelector(".paths-world")!;
      assert.equal(world.getAttribute("data-complete"), "true");
      const piece = doc.getElementById("paths-piece-willow-bend")!;
      await click(piece);
      assert.strictEqual(doc.activeElement, piece);
      assert.equal(world.getAttribute("data-complete"), "false");
      assert.equal(doc.querySelectorAll(".paths-piece.is-joined").length, 0);
      assert.equal(doc.querySelector(".paths-landscape-layers")?.getAttribute("data-complete"), "false");
      await click(button("Undo"));
      assert.equal(world.getAttribute("data-complete"), "true");
      assert.equal(doc.querySelectorAll(".paths-piece.is-joined").length, 2);
      await click(button("Restart chapter"));
      assert.equal(world.getAttribute("data-complete"), "false");
      assert.equal(doc.querySelectorAll(".paths-piece.is-joined").length, 0);
      await reset();
    });
    await suite.test("first board is server-rendered with inert controls and no launch gate", () => {
      const html = renderToStaticMarkup(React.createElement(PathsJourney));
      const staticDoc = new JSDOM(html).window.document;
      assert.ok(staticDoc.querySelector(".paths-world"));
      assert.equal(staticDoc.querySelectorAll(".paths-board > li").length, chapters[0].tiles.length);
      assert.ok([...staticDoc.querySelectorAll("button")].every((el) => el.disabled));
      assert.equal(staticDoc.querySelector("h3")?.textContent, "Find a Way");
    });
    await suite.test("a render failure stays within the section without taking outside focus", async () => {
      const previousError = console.error;
      function BrokenJourney(): never { throw new Error("Expected test failure"); }
      console.error = () => {};
      try {
        doc.getElementById("site-footer")!.focus();
        await act(async () => root.render(React.createElement(JourneyBoundary, {}, React.createElement(BrokenJourney))));
        assert.strictEqual(doc.activeElement, doc.getElementById("site-footer"));
        assert.match(doc.querySelector('[role="alert"]')!.textContent!, /isn.t available/);
        const escape = [...doc.querySelectorAll("a")].find((el) => el.textContent === "Continue exploring");
        assert.equal(escape?.getAttribute("href"), "#site-footer");
        assert.ok(doc.getElementById("site-footer"));
      } finally { console.error = previousError; }
    });
  } finally {
    await act(async () => root.unmount());
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else Reflect.deleteProperty(globalThis, key);
    }
    dom.window.close();
    loader.deregister();
  }
});
