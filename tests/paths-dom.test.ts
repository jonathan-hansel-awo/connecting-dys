import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import axe from "axe-core";
import { registerTsx } from "./helpers/register-tsx.mjs";
import { chapters } from "../src/features/paths-to-belonging/chapters.ts";
import { gardenRoutes, neighbourhoodRoutes, endingRoutes } from "./fixtures/paths-to-belonging.ts";
import type { Board } from "../src/features/paths-to-belonging/types.ts";

test("actual optional journey components: DOM interaction and focus", async (suite) => {
  const loader = registerTsx();
  const dom = new JSDOM("<!doctype html><html lang='en-GB'><title>Game test</title><body><main id='root'></main><footer id='site-footer' tabindex='-1'>Contact</footer></body></html>", { url: "https://connecting-dys.example", runScripts: "outside-only" });
  const globals = { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
  const original = new Map(Object.keys(globals).map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { PathsToBelongingSection, JourneyBoundary } = await import("../src/features/paths-to-belonging/section.tsx");
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
  async function mount() { await reset(); await act(async () => root.render(React.createElement(PathsToBelongingSection))); }
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
    await suite.test("opt-in, actual tile actions, three chapters, ending and replay", async () => {
      await mount();
      assert.equal(doc.querySelector("[data-paths-game]"), null);
      await click(button("Play the little journey"));
      await waitForGame();
      assert.equal(doc.activeElement?.textContent, "Find a Way");
      assert.equal(button("Undo").disabled, true);
      const targets = [gardenRoutes.upper, neighbourhoodRoutes.perimeter, endingRoutes["home-arch"]];
      for (let index = 0; index < 3; index++) {
        await solve(index, targets[index]);
        assert.ok(doc.querySelector("h3")?.textContent === chapters[index].name);
        dom.window.eval(axe.source);
        const audit = await (dom.window as unknown as { axe: typeof axe }).axe.run(doc, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"] }, rules: { "color-contrast": { enabled: false } } });
        assert.equal(audit.violations.length, 0, JSON.stringify(audit.violations));
        await click(button("Continue"));
        assert.equal(doc.activeElement?.textContent, index === 2 ? "There's more than one way to belong." : chapters[index + 1].name);
      }
      assert.match(doc.querySelector('[role="status"]')!.textContent!, /An arch above a home/);
      await click(button("Replay journey"));
      assert.equal(doc.activeElement?.textContent, "Find a Way");
      assert.match(doc.getElementById("paths-piece-willow-bend")!.getAttribute("aria-label")!, /south and west/);
      await click(button("Exit game"));
      assert.strictEqual(doc.activeElement, button("Play the little journey"));
      await reset();
    });
    await suite.test("hint, undo, restart, skip, preference changes and exit", async () => {
      await mount();
      await click(button("Play the little journey"));
      await waitForGame();
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
      await click(button("Return to page"));
      assert.strictEqual(doc.activeElement, button("Play the little journey"));
      await reset();
    });
    await suite.test("a render failure is contained and focuses an unobstructed fallback", async () => {
      const previousError = console.error;
      function BrokenJourney(): never { throw new Error("Expected test failure"); }
      console.error = () => {};
      try {
        await act(async () => root.render(React.createElement(JourneyBoundary, { onExit: () => {} }, React.createElement(BrokenJourney))));
        assert.equal(doc.activeElement?.textContent, "The little journey isn't available right now");
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
