import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";
import { NOTICE_KEY, NOTICE_VERSION, NOTICE_DURATION } from "../src/lib/privacy-notice.ts";

test("actual privacy notice: acknowledgement, focus, expiry and unavailable storage", async suite => {
  const tsx = registerTsx();
  const dom = new JSDOM("<!doctype html><html lang='en-GB'><head><title>Privacy notice</title></head><body><div id='root'></div></body></html>", { url: "https://connecting-dys.example", pretendToBeVisual: true });
  const globals = { window: dom.window, self: dom.window, Event: dom.window.Event, document: dom.window.document, localStorage: dom.window.localStorage, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { CookieNotice, CookieInformation } = await import("../src/components/cookie-notice.tsx");
  const doc = dom.window.document;
  let root = createRoot(doc.getElementById("root")!);
  async function mount() {
    await reset();
    await act(async () => root.render(React.createElement(React.Fragment, null,
      React.createElement(CookieNotice),
      React.createElement("main", { id: "main-content", tabIndex: -1 }, React.createElement("h1", null, "Our community")),
      React.createElement("footer", null, React.createElement(CookieInformation)),
    )));
    await act(async () => { await new Promise(resolve => setTimeout(resolve, 35)); });
  }
  async function reset() { await act(async () => root.unmount()); root = createRoot(doc.getElementById("root")!); }
  async function click(el: Element) { await act(async () => { el.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, cancelable: true })); await new Promise(resolve => setTimeout(resolve, 35)); }); }
  const notice = () => doc.getElementById("cookie-notice") as HTMLElement;
  try {
    await suite.test("no implied consent or focus theft; acknowledgement persists and footer reopens", async () => {
      await mount();
      assert.equal(notice().hidden, false);
      assert.equal(doc.activeElement, doc.body);
      assert.equal(localStorage.getItem(NOTICE_KEY), null);
      await click(notice().querySelector("button")!);
      assert.equal(notice().hidden, true);
      assert.equal(doc.activeElement?.id, "main-content");
      assert.equal(JSON.parse(localStorage.getItem(NOTICE_KEY)!).version, NOTICE_VERSION);
      await reset(); await mount();
      assert.equal(notice().hidden, true);
      await click(doc.getElementById("cookie-information")!);
      assert.equal(notice().hidden, false);
      assert.equal(doc.activeElement?.id, "cookie-title");
      await click(notice().querySelector("button")!);
      assert.equal(doc.activeElement?.id, "cookie-information");
      await reset();
    });
    await suite.test("expired, malformed and superseded acknowledgements show the notice", async () => {
      for (const value of ["bad-json", JSON.stringify({ version: 0, acknowledgedAt: Date.now() }), JSON.stringify({ version: NOTICE_VERSION, acknowledgedAt: Date.now() - NOTICE_DURATION - 1 })]) {
        localStorage.setItem(NOTICE_KEY, value); await mount();
        assert.equal(notice().hidden, false);
        assert.equal(localStorage.getItem(NOTICE_KEY), value, "reading the notice does not write acknowledgement");
        await reset();
      }
    });
    await suite.test("blocked storage still allows dismissal for the visit", async () => {
      Object.defineProperty(globalThis, "localStorage", { configurable: true, get() { throw new Error("Blocked"); } });
      await mount();
      assert.equal(notice().hidden, false);
      await click(notice().querySelector("button")!);
      assert.equal(notice().hidden, true);
    });
  } finally {
    await act(async () => root.unmount());
    dom.window.close(); tsx.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
