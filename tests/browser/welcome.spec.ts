import { test, expect, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}
async function sample(page: Page, y: number) {
  await page.evaluate((scroll) => window.scrollTo(0, scroll), y);
  // Desktop scrub is at most 0.35s. Test settled compositions, not frame timing.
  await page.waitForTimeout(650);
  return page.evaluate(() => {
    const box = (selector: string) => {
      const el = document.querySelector(selector)!;
      const r = el.getBoundingClientRect();
      return { top: r.top + scrollY, bottom: r.bottom + scrollY, transform: getComputedStyle(el).transform };
    };
    return {
      plane: box("[data-hero-plane]"), sheet: box("[data-recognition-sheet]"),
      copy: box(".hero-copy"), cta: box(".hero-actions"), lastLink: box(".hero-bottom a"),
      recognition: box(".recognition-copy"), caption: box(".recognition-figure figcaption"),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

test("hero depth and paint-sheet progress without decorative lines crossing the artwork", async ({ page }, info) => {
  test.skip((page.viewportSize()?.height || 0) < 520, "Short screens deliberately use the settled scene.");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  const geometry = await page.evaluate(() => {
    const hero = document.querySelector<HTMLElement>("[data-welcome-scene]")!;
    const recognition = document.querySelector<HTMLElement>("#recognition")!;
    return { top: hero.offsetTop, height: hero.offsetHeight, recognitionTop: recognition.offsetTop, viewport: innerHeight };
  });
  const before = await sample(page, geometry.top + geometry.height * 0.08);
  await page.screenshot({ path: info.outputPath("welcome-early.png") });
  const after = await sample(page, geometry.top + geometry.height * 0.6);
  await page.screenshot({ path: info.outputPath("welcome-late.png") });
  await expect(page.locator(".hero-orbit, .hero-path-art, .hero-path-nodes, .hero .status-dot")).toHaveCount(0);
  expect(before.plane.transform).not.toBe(after.plane.transform);
  for (const key of ["copy", "cta", "lastLink", "recognition", "caption"] as const) {
    expect(Math.abs(before[key].top - after[key].top), `${key} remains in document flow`).toBeLessThan(1);
    expect(after[key].transform).toBe("none");
  }
  const sheetEarly = await sample(page, geometry.recognitionTop - geometry.viewport * 0.92);
  const sheetLate = await sample(page, geometry.recognitionTop - geometry.viewport * 0.4);
  expect(sheetEarly.sheet.top - sheetLate.sheet.top).toBeGreaterThan(12);
  expect(sheetLate.sheet.top).toBeGreaterThan(sheetLate.lastLink.bottom + 8);
  expect(sheetLate.overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath("recognition-settled.png") });
  await info.attach("welcome-measurements", { body: JSON.stringify({ geometry, before, after, sheetEarly, sheetLate }, null, 2), contentType: "application/json" });
  expect(errors).toEqual([]);
});

test("Phase 02 recognition anchor, reduced motion and reading choices stay usable", async ({ page }, info) => {
  await ready(page);
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
  for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    for (const background of ["Cream", "White", "Soft blue", "Soft peach"]) {
      await page.getByRole("button", { name: background, exact: true }).click();
      await page.waitForTimeout(200);
      await expect(page.locator("[data-recognition-sheet]")).toHaveCSS("transform", "none");
      await expect(page.locator(".hero-copy")).toHaveCSS("transform", "none");
      await expect(page.locator(".recognition-copy")).toHaveCSS("transform", "none");
    }
  }
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await page.getByRole("checkbox", { name: "Background texture", exact: true }).uncheck();
  await page.keyboard.press("Escape");
  await page.getByRole("link", { name: "Find your own way through", exact: true }).click();
  await page.waitForTimeout(250);
  await expect(page).toHaveURL(/#recognition$/);
  await expect(page.locator("[data-recognition-sheet]")).toBeHidden();
  const reading = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    header: document.querySelector(".site-header")!.getBoundingClientRect().bottom,
    anchor: document.querySelector("#recognition")!.getBoundingClientRect().top,
    gap: document.querySelector(".recognition-copy")!.getBoundingClientRect().top - document.querySelector(".recognition-art")!.getBoundingClientRect().bottom,
  }));
  expect(reading.anchor).toBeGreaterThanOrEqual(reading.header - 1);
  expect(reading.gap).toBeGreaterThan(0);
  expect(reading.overflow).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath("recognition-spacious-flat.png") });
});

test("Phase 02 OS/short-screen and no-JS fallback keep a complete static scene", async ({ page, browser }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("[data-hero-path]")).toHaveCount(0);
  await expect(page.locator("[data-recognition-sheet]")).toHaveCSS("transform", "none");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(250);
  if ((page.viewportSize()?.height || 0) < 520) {
    await expect(page.locator("[data-hero-path]")).toHaveCount(0);
    await expect(page.locator("[data-recognition-sheet]")).toHaveCSS("transform", "none");
  }
  await page.emulateMedia({ forcedColors: "active" });
  await page.waitForTimeout(250);
  await expect(page.locator(".hero-path-art")).toHaveCount(0);
  await expect(page.locator("[data-recognition-sheet]")).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const native = await context.newPage();
    await native.goto("/");
    await expect(native.locator("[data-hero-path]")).toHaveCount(0);
    await expect(native.locator(".hero-copy")).toHaveCSS("transform", "none");
    await native.getByRole("link", { name: "Find your own way through", exact: true }).click();
    await expect(native).toHaveURL(/#recognition$/);
    await expect(native.locator(".recognition-figure figcaption")).toBeVisible();
  } finally { await context.close(); }
});
