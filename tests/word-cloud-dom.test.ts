import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";

test("word cloud starts static before hydration and has an accessible reversible pause control", async () => {
  const loader = registerTsx();
  const dom = new JSDOM("<!doctype html><body><div id='root'></div></body>", { url: "https://connecting-dys.example/" });
  const globals = { window: dom.window, document: dom.window.document, IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { AnimatedDysWords } = await import("../src/components/animated-dys-words.tsx");
  const html = renderToStaticMarkup(React.createElement(AnimatedDysWords));
  const staticPage = new JSDOM(html);
  assert.equal(staticPage.window.document.querySelector(".word-cloud")?.getAttribute("data-paused"), "true");
  assert.equal(staticPage.window.document.querySelector<HTMLButtonElement>("button")?.disabled, true);
  staticPage.window.close();
  const doc = dom.window.document;
  const root = createRoot(doc.getElementById("root")!);
  try {
    await act(async () => root.render(React.createElement(AnimatedDysWords)));
    const button = doc.querySelector("button")!;
    const cloud = doc.querySelector(".word-cloud")!;
    assert.equal(button.disabled, false);
    assert.equal(button.closest('[aria-hidden="true"]'), null, "pause stays outside decorative art");
    assert.equal(doc.querySelectorAll(".word-drift").length, 12);
    assert.equal(doc.activeElement, doc.body, "animation never steals focus");
    assert.equal(cloud.getAttribute("data-paused"), "false");
    button.focus();
    await act(async () => button.click());
    assert.equal(cloud.getAttribute("data-paused"), "true");
    assert.equal(button.getAttribute("aria-pressed"), "true");
    assert.equal(button.textContent, "Resume word movement");
    assert.equal(doc.activeElement, button);
    doc.documentElement.dataset.reduceMotion = "true";
    dom.window.dispatchEvent(new dom.window.Event("connecting-dys:preferences"));
    assert.equal(cloud.getAttribute("data-paused"), "true", "preference changes do not erase a manual pause");
    await act(async () => button.click());
    assert.equal(cloud.getAttribute("data-paused"), "false");
    assert.equal(button.getAttribute("aria-pressed"), "false");
  } finally {
    await act(async () => root.unmount()); dom.window.close(); loader.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
