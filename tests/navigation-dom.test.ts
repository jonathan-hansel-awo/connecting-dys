import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";

test("actual dropdown navigation closes siblings, restores Escape focus and dismisses outside", async () => {
  const loader = registerTsx({ pathname: "/our-story" });
  const dom = new JSDOM('<!doctype html><body><div id="root"></div><button id="outside">Outside</button></body>', { url: "https://connecting-dys.example/our-story", pretendToBeVisual: true });
  const doc = dom.window.document;
  const globals = { window: dom.window, document: doc, self: dom.window, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { SiteNavigation } = await import("../src/components/site-navigation.tsx");
  const root = createRoot(doc.getElementById("root")!);
  const flush = async (action: () => void) => act(async () => { action(); await new Promise(resolve => setTimeout(resolve, 30)); });
  try {
    await act(async () => root.render(React.createElement(SiteNavigation)));
    for (const nav of doc.querySelectorAll("nav")) {
      const [about, dys] = [...nav.querySelectorAll<HTMLDetailsElement>(".nav-group")];
      assert.equal(nav.querySelector('a[href="/our-story"]')?.getAttribute("aria-current"), "page");
      await flush(() => { about.open = true; });
      assert.equal(about.open, true);
      await flush(() => { dys.open = true; });
      assert.equal(about.open, false, "opening a group dismisses its sibling");
      assert.equal(dys.open, true);
      const link = dys.querySelector<HTMLAnchorElement>('a[href="/dysgraphia"]')!;
      link.focus();
      await flush(() => link.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
      assert.equal(dys.open, false);
      assert.equal(doc.activeElement, dys.querySelector("summary"));
      await flush(() => { about.open = true; });
      await flush(() => doc.getElementById("outside")!.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })));
      assert.equal(about.open, false);
      await flush(() => { about.open = true; });
      await flush(() => doc.getElementById("outside")!.focus());
      assert.equal(about.open, false);
    }
    const shell = doc.querySelector<HTMLDetailsElement>(".nav-shell")!;
    const group = shell.querySelector<HTMLDetailsElement>(".nav-group")!;
    await flush(() => { shell.open = true; group.open = true; });
    const link = group.querySelector<HTMLAnchorElement>("a")!;
    link.addEventListener("click", event => event.preventDefault());
    await flush(() => link.click());
    assert.equal(doc.querySelectorAll(".site-navigation details[open]").length, 0, "following a route closes the whole mobile menu");
    await act(async () => root.unmount());
    assert.doesNotThrow(() => doc.getElementById("outside")!.dispatchEvent(new dom.window.Event("pointerdown", { bubbles: true })));
  } finally {
    await act(async () => root.unmount()); dom.window.close(); loader.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
