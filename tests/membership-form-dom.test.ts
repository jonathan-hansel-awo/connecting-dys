import test from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { JSDOM, VirtualConsole } from "jsdom";
import { registerTsx } from "./helpers/register-tsx.mjs";

test("actual membership forms validate age-specific details and prepare email handoffs", async suite => {
  const loader = registerTsx();
  const errors: string[] = [];
  const console = new VirtualConsole();
  console.on("jsdomError", error => {
    // jsdom cannot launch an external mail app; inspect the same encoded draft
    // offered by the component's fallback link after the attempted handoff.
    if (!error.message.includes("Not implemented: navigation")) errors.push(error.message);
  });
  const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", { url: "https://connecting-dys.example/membership", virtualConsole: console });
  const globals = { window: dom.window, document: dom.window.document, FormData: dom.window.FormData, HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true };
  const saved = new Map(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { configurable: true, value });
  const { MembershipInterestForm } = await import("../src/components/membership-interest-form.tsx");
  const doc = dom.window.document;
  let root = createRoot(doc.getElementById("root")!);
  const form = () => doc.querySelector("form")!;
  const input = (name: string) => form().elements.namedItem(name) as HTMLInputElement;
  async function mount(kind: "young-people" | "young-adults") {
    await act(async () => root.unmount()); root = createRoot(doc.getElementById("root")!);
    await act(async () => root.render(React.createElement(MembershipInterestForm, { kind })));
  }
  async function chooseAge(age: string) {
    const select = form().elements.namedItem("age") as HTMLSelectElement;
    await act(async () => { select.value = age; select.dispatchEvent(new dom.window.Event("change", { bubbles: true })); });
  }
  async function submit() {
    await act(async () => { form().dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true })); });
  }
  function fillGuardian() {
    input("guardianName").value = "Alex & Jordan";
    input("relationship").value = "Parent";
    input("guardianEmail").value = "parent+family@example.com";
    input("guardianPhone").value = "+44 7000 000000";
  }
  function preference(value: string) {
    (form().querySelector(`input[name="informationPreference"][value="${value}"]`) as HTMLInputElement).checked = true;
  }
  function draft() {
    const href = form().querySelector<HTMLAnchorElement>("details a")?.href;
    assert.ok(href, "fallback offers the same email draft");
    const url = new URL(href);
    assert.equal(url.protocol, "mailto:");
    assert.equal(url.pathname, "connectingdys@gmail.com");
    assert.deepEqual([...url.searchParams.keys()], ["subject", "body"], "answers cannot inject email headers");
    return url;
  }
  try {
    await suite.test("ages 13–15 require guardian details and prepare the requested information pack", async () => {
      await mount("young-people");
      assert.equal(doc.querySelector<HTMLButtonElement>("button")!.disabled, false);
      await submit();
      assert.equal(doc.querySelector("textarea"), null, "invalid form cannot prepare a message");
      input("fullName").value = "Sam & Co + É";
      input("preferredName").value = "Sam";
      await chooseAge("13"); fillGuardian(); preference("By email");
      assert.equal(input("email"), null, "younger visitors use guardian contact");
      await submit();
      assert.equal(doc.querySelector("textarea"), null, "interest acknowledgement is required");
      input("acknowledgement").checked = true;
      await submit();
      const message = draft();
      assert.match(message.searchParams.get("body")!, /Full name: Sam & Co \+ É/);
      assert.match(message.searchParams.get("body")!, /Email: parent\+family@example.com/);
      assert.match(message.searchParams.get("body")!, /Main contact: Parent \/ guardian/);
      assert.match(message.searchParams.get("body")!, /Information pack preference: By email/);
      assert.match(doc.querySelector('[role="status"]')!.textContent!, /press Send in your email app/);
      assert.equal(dom.window.location.pathname, "/membership");
      assert.equal(dom.window.location.search, "", "form data never enters the page URL");
    });
    await suite.test("ages 16–17 require the young person's email as well as guardian details", async () => {
      await mount("young-people"); await chooseAge("16");
      input("fullName").value = "Jamie"; fillGuardian(); preference("I would like someone to contact me first"); input("acknowledgement").checked = true;
      assert.equal(input("email").required, true);
      await submit(); assert.equal(doc.querySelector("textarea"), null);
      input("email").value = "not-an-email";
      await submit(); assert.equal(doc.querySelector("textarea"), null);
      input("email").value = "jamie@example.com";
      await submit();
      assert.match(draft().searchParams.get("body")!, /Email: jamie@example.com/);
      assert.match(draft().searchParams.get("body")!, /Parent \/ guardian details/);
      assert.match(draft().searchParams.get("body")!, /Phone \(optional\): Not provided/);
      await chooseAge("15");
      assert.equal(doc.querySelector("textarea"), null, "editing removes the stale prepared draft");
      await submit();
      assert.doesNotMatch(draft().searchParams.get("body")!, /jamie@example.com/);
    });
    await suite.test("adult age bands have independent contact fields and correctly encoded email bodies", async () => {
      for (const age of ["18–20", "21–24"]) {
        await mount("young-adults"); await chooseAge(age);
        input("fullName").value = "Taylor & Morgan? #1";
        input("email").value = "taylor+info@example.com";
        input("phone").value = "+44 7000 000001";
        input("acknowledgement").checked = true;
        assert.equal(input("guardianEmail"), null);
        await submit(); assert.equal(doc.querySelector("textarea"), null, "a pack preference is required");
        preference("By email"); await submit();
        const message = draft();
        assert.match(message.searchParams.get("subject")!, /ages 18–24/);
        assert.ok(message.searchParams.get("body")!.includes(`Age band: ${age}`));
        assert.match(message.searchParams.get("body")!, /Taylor & Morgan\? #1/);
        assert.match(message.searchParams.get("body")!, /taylor\+info@example.com/);
        assert.doesNotMatch(message.searchParams.get("body")!, /guardian/i);
        assert.equal(doc.querySelector<HTMLTextAreaElement>("textarea")!.value, message.searchParams.get("body")!.replace(/\r\n/g, "\n"));
      }
      assert.deepEqual(errors, []);
    });
  } finally {
    await act(async () => root.unmount()); dom.window.close(); loader.deregister();
    for (const [key, descriptor] of saved) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else Reflect.deleteProperty(globalThis, key); }
  }
});
