import { test, expect, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
}

test("native fast touch swipes progress the story without Lenis or delayed artwork", async ({ page }, info) => {
  test.skip(!info.project.use.hasTouch, "Native touch gestures run in touch viewport projects.");
  await ready(page);
  const session = await page.context().newCDPSession(page);
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  const measurements = [];
  for (const [selector, path] of [[".difference-row", ".discovery-path"], [".connection-chapter", ".chapter-path"], [".invitation", ".finale-path"]]) {
    const beat = page.locator(selector).first();
    const geometry = await beat.evaluate(el => {
      const main = document.querySelector<HTMLElement>("main[data-home-story]")!;
      const stack = main.dataset.sectionStack;
      delete main.dataset.sectionStack;
      const value = { top: el.getBoundingClientRect().top + scrollY, vh: innerHeight };
      if (stack) main.dataset.sectionStack = stack;
      return value;
    });
    await page.evaluate(y => scrollTo(0,y), Math.max(0,geometry.top - geometry.vh * .82));
    await page.waitForTimeout(250);
    const before = await beat.locator(path).first().evaluate(el => parseFloat(getComputedStyle(el).strokeDashoffset));
    const early = await page.evaluate(() => scrollY);
    for (let n = 0; n < 2; n++) {
      const x = Math.floor(page.viewportSize()!.width / 2);
      const startY = Math.floor(geometry.vh * .85);
      const distance = Math.floor(Math.min(450,geometry.vh*.6));
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: startY }] });
      for (let step=1; step<=12; step++) {
        await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: startY-distance*step/12 }] });
        await page.waitForTimeout(16);
      }
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await page.waitForTimeout(120);
    }
    await page.waitForTimeout(100);
    const after = await beat.locator(path).first().evaluate(el => parseFloat(getComputedStyle(el).strokeDashoffset));
    const late = await page.evaluate(() => scrollY);
    expect(late-early).toBeGreaterThan(80);
    if (geometry.vh >= 520) expect(before-after, selector).toBeGreaterThan(.5);
    await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath(`touch-${selector.slice(1)}.png`) });
    measurements.push({ selector, before, after, early, late });
  }
  await info.attach("native-touch-progress", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
});

test("mid-scene reading changes and cached routes clean up and restore the scene", async ({ page }) => {
  await ready(page);
  const initialPins = await page.locator("#community .pin-spacer").count();
  for (let cycle=0; cycle<2; cycle++) {
    await page.locator("#community").scrollIntoViewIfNeeded();
    await page.getByRole("button", { name: "Reading settings", exact: true }).click();
    const reduce=page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true });
    await reduce.check();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(cycle ? "Open Sans" : "Arial");
    await page.getByRole("combobox", { name: "Texture style", exact: true }).selectOption(cycle ? "plaster" : "linen");
    await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(!cycle);
    await reduce.uncheck();
    await page.keyboard.press("Escape");
    await expect(page.locator("#community .pin-spacer")).toHaveCount(initialPins);
    await page.locator(".community-note a").focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveTitle("What we do | Connecting Dys");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.goBack();
    await expect(page).toHaveTitle("Connecting Dys | A home for every DYS mind.");
    await expect(page.locator("#community .pin-spacer")).toHaveCount(initialPins);
    await page.goForward();
    await expect(page).toHaveTitle("What we do | Connecting Dys");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.goBack();
    await expect(page).toHaveTitle("Connecting Dys | A home for every DYS mind.");
    await expect(page.locator("#community .pin-spacer")).toHaveCount(initialPins);
  }
});

test("every reading font and background reflows at maximum spacing in both themes", async ({ page }) => {
  await ready(page);
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const [index,font] of ["Open Sans","Arial","Verdana","Atkinson Hyperlegible","OpenDyslexic"].entries()) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    for (const dark of [false,true]) {
      await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(dark);
      for (const [i,background] of (dark ? ["Warm navy","Deep navy","Slate blue","Warm charcoal"] : ["Cream","White","Soft blue","Soft peach"]).entries()) {
        await page.getByRole("button", { name: background, exact: true }).click();
        await page.getByRole("checkbox", { name: "Background texture", exact: true }).check();
        await page.getByRole("combobox", { name: "Texture style", exact: true }).selectOption(["paper","linen","plaster"][(index+i)%3]);
        await page.getByRole("checkbox", { name: "Background texture", exact: true }).setChecked((index+i)%2===0);
        await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).setChecked(i%2===0);
        expect(await page.locator("dialog").evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
        expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      }
    }
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Reading settings", exact: true })).toBeFocused();
  await expect(page.getByRole("button", { name: "Dark mode", exact: true })).toHaveCount(0);
});
