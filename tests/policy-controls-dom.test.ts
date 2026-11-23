import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";

test("actual policy controls expand, collapse, reveal fragments and restore print state", async () => {
  const loader = registerTsx();
  const dom = new JSDOM('<!doctype html><body><div id="root"></div><a id="jump" href="#source-second">Jump</a><details class="policy-disclosure" open><summary><h2 id="source-first">First</h2></summary><p>Original first text</p></details><details class="policy-disclosure"><summary><h2 id="source-second">Second</h2></summary><p>Original second text</p></details></body>', { url: "https://connecting-dys.example/privacy#source-second" });
  const doc = dom.window.document;
  const globals = { window: dom.window, document: doc, location: dom.window.location, IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { PolicyControls } = await import("../src/components/policy-controls.tsx");
  const root = createRoot(doc.getElementById("root")!);
  try {
    await act(async () => root.render(React.createElement(PolicyControls)));
    const [expand, collapse] = [...doc.querySelectorAll("button")];
    assert.equal(doc.querySelectorAll("details[open]").length, 2, "a direct fragment opens its section");
    await act(async () => collapse.click());
    assert.equal(doc.querySelectorAll("details[open]").length, 0);
    await act(async () => expand.click());
    assert.equal(doc.querySelectorAll("details[open]").length, 2);
    await act(async () => collapse.click());
    doc.getElementById("jump")!.addEventListener("click", event => event.preventDefault());
    await act(async () => doc.getElementById("jump")!.click());
    assert.equal(doc.querySelectorAll("details[open]").length, 1);
    dom.window.dispatchEvent(new dom.window.Event("beforeprint"));
    assert.equal(doc.querySelectorAll("details[open]").length, 2);
    dom.window.dispatchEvent(new dom.window.Event("afterprint"));
    assert.equal(doc.querySelectorAll("details[open]").length, 1);
    assert.match(doc.body.textContent!, /Original first text/);
  } finally {
    await act(async () => root.unmount()); dom.window.close(); loader.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
