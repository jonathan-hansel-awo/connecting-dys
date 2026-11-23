import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";
import { doodleIntersects, rotatedDoodleSize } from "../src/lib/doodle-layout.ts";

test("actual background decoration protects foreground, responds to preferences and cleans up", async () => {
  const loader = registerTsx({ pathname: "/about" });
  const dom = new JSDOM('<!doctype html><body><div id="root"></div><main class="reading-page"><section class="copy-panel"><h1>Original content</h1><p>A readable paragraph.</p><button>Get in touch</button></section><figure><img alt="Approved artwork"></figure></main></body>', { url: "https://connecting-dys.example/about" });
  const doc = dom.window.document;
  const frames = new Map<number, FrameRequestCallback>();
  let nextFrame = 0;
  let resizeCallback: () => void = () => {};
  let disconnected = false;
  let crowded = false;
  let width = 1000;
  const globals = {
    window: dom.window, document: doc, IS_REACT_ACT_ENVIRONMENT: true,
    MutationObserver: dom.window.MutationObserver,
    ResizeObserver: class { constructor(callback: () => void) { resizeCallback = callback; } observe() {} disconnect() { disconnected = true; } },
    requestAnimationFrame: (callback: FrameRequestCallback) => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: (id: number) => frames.delete(id),
  };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  Object.defineProperty(doc.documentElement, "clientWidth", { configurable: true, get: () => width });
  function rect(x: number, y: number, w: number, h: number) { return { x, y, left: x, top: y, right: x + w, bottom: y + h, width: w, height: h, toJSON() {} } as DOMRect; }
  const prototype = dom.window.HTMLElement.prototype;
  prototype.getBoundingClientRect = function () {
    if (this.matches("main")) return rect(100, 120, 800, 2000);
    if (this.matches(".background-doodles")) return rect(0, 120, width, 2000);
    if (this.closest(".copy-panel")) return crowded ? rect(0, 120, width, 2000) : rect(100, 220, 800, 400);
    if (this.closest("figure")) return rect(280, 920, 440, 500);
    return rect(0, 0, 0, 0);
  };
  Object.defineProperty(prototype, "offsetHeight", { configurable: true, get() { return this.matches(".background-doodle") ? parseFloat(this.style.fontSize) * 1.2 : this.matches("main") ? 2000 : 0; } });
  Object.defineProperty(prototype, "offsetWidth", { configurable: true, get() { return this.matches(".background-doodle") ? this.textContent.length * parseFloat(this.style.fontSize) * .5 : width; } });
  const { BackgroundDoodles } = await import("../src/components/background-doodles.tsx");
  const root = createRoot(doc.getElementById("root")!);
  async function flush() { await act(async () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(0)); }); }
  const preference = async () => { dom.window.dispatchEvent(new dom.window.Event("connecting-dys:preferences")); await flush(); };
  try {
    assert.equal(renderToStaticMarkup(React.createElement(BackgroundDoodles)), "", "no-JS/first paint has no unmeasured words");
    await act(async () => root.render(React.createElement(BackgroundDoodles)));
    await flush();
    const layer = doc.querySelector<HTMLElement>(".background-doodles")!;
    assert.ok(layer);
    assert.equal(layer.getAttribute("aria-hidden"), "true");
    assert.equal(layer.inert, true);
    assert.equal(layer.querySelectorAll("a,button,input,select,[tabindex]").length, 0);
    assert.ok(layer.querySelectorAll("span:not([hidden])").length > 0);
    assert.equal(layer.style.visibility, "visible");
    const foreground = [{ x: 100, y: 100, width: 800, height: 400 }, { x: 280, y: 800, width: 440, height: 500 }];
    for (const word of layer.querySelectorAll<HTMLElement>("span:not([hidden])")) {
      const size = rotatedDoodleSize({ width: word.offsetWidth, height: word.offsetHeight, angle: parseFloat(word.style.getPropertyValue("--doodle-angle")) });
      const box = { x: parseFloat(word.style.left) - size.width / 2, y: parseFloat(word.style.top) - size.height / 2, ...size };
      assert.ok(foreground.every(obstacle => !doodleIntersects(box, obstacle, 12)));
    }
    let clicks = 0;
    const button = doc.querySelector("button")!;
    button.addEventListener("click", () => clicks++); button.focus(); button.click();
    assert.equal(clicks, 1); assert.equal(doc.activeElement, button);
    doc.documentElement.dataset.spacious = "true"; await preference();
    assert.equal(layer.style.visibility, "hidden", "simplified reading hides the decoration");
    doc.documentElement.dataset.spacious = "false";
    doc.documentElement.dataset.texture = "off"; await preference();
    assert.equal(layer.style.visibility, "hidden");
    doc.documentElement.dataset.texture = "on"; await preference();
    assert.equal(layer.style.visibility, "visible");
    crowded = true; width = 360; resizeCallback();
    assert.equal(layer.style.visibility, "hidden", "old positions hide immediately on resize");
    await flush();
    assert.equal(layer.querySelectorAll("span:not([hidden])").length, 0, "a full foreground omits every doodle");
    assert.equal(doc.querySelector("main h1")!.textContent, "Original content");
    await act(async () => root.unmount());
    assert.equal(doc.querySelector(".background-doodles"), null);
    assert.equal(doc.querySelector("[data-doodle-surface]"), null);
    assert.equal(disconnected, true);
    await preference(); assert.equal(frames.size, 0, "unmount removes global listeners");
  } finally {
    await act(async () => root.unmount()); dom.window.close(); loader.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
