import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const scenes = [".hero", "#recognition", "#explore", "#community", ".support", ".about-home", ".invitation", ".site-footer"];
const fonts = ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"];
const backgrounds = ["Cream", "White", "Soft blue", "Soft peach"];
const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];

async function settled(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  // Existing preference rebuild is debounced by 120ms; allow it and two frames.
  await page.waitForTimeout(200);
}
async function noPageOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )).toBeLessThanOrEqual(1);
}
async function staticArtwork(page: Page) {
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await expect(page.locator(".recognition-photo")).toHaveCSS("transform", "none");
  const words = page.locator(".word-drift").first();
  await expect(words).toHaveCSS("animation-name", "none");
  const before = await words.evaluate((el) => getComputedStyle(el).transform);
  await page.evaluate(() => window.scrollTo(0, document.querySelector("#community")!.getBoundingClientRect().top + scrollY));
  await settled(page);
  await expect(words).toHaveCSS("transform", before);
}

test("chapter screenshots, overflow, console and rendered accessibility", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  // Wait for actual hydration before using controls.
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  for (const [index, selector] of scenes.entries()) {
    const scene = page.locator(selector);
    await scene.scrollIntoViewIfNeeded();
    for (const img of await scene.locator("img").all()) {
      await expect.poll(() => img.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0)).toBe(true);
    }
    await settled(page);
    await noPageOverflow(page);
    await page.screenshot({ path: info.outputPath(`${index}-${selector.replace(/[^a-z0-9-]/gi, "")}.png`) });
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await settled(page);
  await page.screenshot({ path: info.outputPath("homepage-full.png"), fullPage: true });
  const audit = await new AxeBuilder({ page }).withTags(tags).analyze();
  await info.attach("axe-home", { body: JSON.stringify(audit, null, 2), contentType: "application/json" });
  expect(audit.violations).toEqual([]);
  expect(errors).toEqual([]);
});

test("all fonts/backgrounds, maximum spacing, persistence, reset and modal focus", async ({ page }, info) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Reading settings", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Reading settings" });
  await expect(page.getByRole("button", { name: "Close reading settings" })).toBeFocused();
  for (const font of fonts) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    for (const background of backgrounds) {
      await page.getByRole("button", { name: background, exact: true }).click();
      await settled(page);
      await noPageOverflow(page);
      await expect.poll(() => dialog.evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      if ((page.viewportSize()?.width || 0) <= 1000) {
        const gap = await page.evaluate(() => document.querySelector(".recognition-copy")!.getBoundingClientRect().top - document.querySelector(".recognition-art")!.getBoundingClientRect().bottom);
        expect(gap).toBeGreaterThan(0);
      }
    }
  }
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await settled(page);
  await page.screenshot({ path: info.outputPath("reading-settings-maximum.png") });
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.reload();
  await settled(page);
  await expect(page.locator("html")).toHaveAttribute("data-spacious", "true");
  await expect(page.locator("html")).toHaveCSS("font-size", "26px");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  // Maximum reading settings must reflow without clipping or overflow.
  await noPageOverflow(page);
  await trigger.click();
  await page.getByRole("button", { name: "Reset preferences" }).click();
  await page.keyboard.press("Escape");
  await settled(page);
  await expect(page.locator("html")).toHaveCSS("font-size", "18px");
  await expect(page.locator("html")).toHaveAttribute("data-spacious", "false");
});

test("native skip/recognition anchors, menu and route history", async ({ page }) => {
  await page.goto("/");
  await settled(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page.getByRole("link", { name: "Find your own way through" }).click();
  await expect(page).toHaveURL(/#recognition$/);
  await settled(page);
  const visibleAnchor = await page.evaluate(() => document.querySelector("#recognition")!.getBoundingClientRect().top >= document.querySelector(".site-header")!.getBoundingClientRect().bottom - 1);
  expect(visibleAnchor).toBe(true);
  const summary = page.locator(".mobile-nav summary");
  if (await summary.isVisible()) {
    await summary.click();
    await expect(page.locator(".mobile-nav")).toHaveAttribute("open", "");
    await summary.press("Escape");
    await expect(summary).toBeFocused();
    await expect(page.locator(".mobile-nav")).not.toHaveAttribute("open");
  }
  await page.locator('.difference-row[href="/dyslexia"]').click();
  await expect(page).toHaveURL(/\/dyslexia$/);
  await expect(page.getByRole("heading", { name: "Dyslexia", exact: true, level: 1 })).toBeVisible();
  // Wait for the route commit/title, not only streamed/retained headings.
  await expect(page).toHaveTitle("Dyslexia | Connecting Dys");
  await page.goBack();
  await expect(page).toHaveURL(/\/#recognition$/);
  await expect(page.locator("#explore")).toBeVisible();
  await page.goForward();
  await expect(page.getByRole("heading", { name: "Dyslexia", exact: true, level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/#recognition$/);
  await expect(page.locator("#explore")).toBeVisible();
  await page.getByRole("link", { name: "Connecting Dys — home", exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
});

test("site and OS reduced motion tear down animation; no-JS content remains usable", async ({ page, browser }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion" }).check();
  await page.keyboard.press("Escape");
  await settled(page);
  await staticArtwork(page);
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("button", { name: "Reset preferences" }).click();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await settled(page);
  await staticArtwork(page);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const native = await context.newPage();
    await native.goto("/");
    for (const selector of scenes) await expect(native.locator(selector)).toBeVisible();
    await expect(native.locator(".pin-spacer")).toHaveCount(0);
    await native.locator('.difference-row[href="/dysgraphia"]').click();
    await expect(native.locator("h1")).toHaveText("Dysgraphia");
  } finally {
    await context.close();
  }
});

test("all public routes return content and pass rendered axe", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Shared routes audited once at desktop; homepage reflow covered per viewport.");
  for (const route of ["/", "/about", "/what-we-do", "/our-approach", "/values", "/support", "/contact", "/get-involved", "/accessibility", "/dyslexia", "/dyspraxia", "/dyscalculia", "/dysgraphia"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await settled(page);
    const audit = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(audit.violations, route).toEqual([]);
  }
});

test("texture toggles every surface, persists with reading choices and resets", async ({ page }, info) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Reading settings", exact: true });
  await trigger.click();
  const texture = page.getByRole("checkbox", { name: "Background texture", exact: true });
  await expect(texture).toBeChecked();
  const surfaces = "body,.hero,#recognition,#explore,#community,.support,.about-home,.invitation,.site-footer,.reading-dialog,.connection-visual";
  for (const enabled of [true, false]) {
    await texture.setChecked(enabled);
    await settled(page);
    for (const font of fonts) {
      await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
      for (const background of backgrounds) {
        await page.getByRole("button", { name: background, exact: true }).click();
        await settled(page);
        const state = await page.evaluate((selector) => ({
          backgrounds: [...document.querySelectorAll(selector)].map((el) => getComputedStyle(el).backgroundImage),
          body: getComputedStyle(document.body).backgroundColor,
          connection: getComputedStyle(document.querySelector("#community")!).backgroundColor,
          textShadow: getComputedStyle(document.querySelector("h1")!).textShadow,
        }), surfaces);
        for (const [index, image] of state.backgrounds.entries()) expect(image.includes("fine-paper.svg"), `${surfaces.split(",")[index]} grain`).toBe(enabled);
        expect(state.connection).not.toBe(state.body);
        expect(state.textShadow).toBe("none");
      }
    }
    await page.screenshot({ path: info.outputPath(`texture-${enabled ? "on" : "off"}-settings.png`) });
  }
  await page.keyboard.press("Escape");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "off");
  await trigger.click();
  await expect(texture).not.toBeChecked();
  await expect(page.getByRole("combobox", { name: "Font family", exact: true })).toHaveValue("OpenDyslexic");
  await page.getByRole("button", { name: "Reset preferences" }).click();
  await expect(texture).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-texture", "on");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("forced colours flattens texture/relief and tears down motion; no-JS stays flat", async ({ page, browser }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ forcedColors: "active" });
  await settled(page);
  await staticArtwork(page);
  await expect(page.locator("body")).toHaveCSS("background-image", "none");
  await expect(page.locator(".hero-orbit")).toHaveCSS("box-shadow", "none");
  await expect(page.locator(".hero-actions .button")).toHaveCSS("box-shadow", "none");
  await page.emulateMedia({ forcedColors: "none" });
  await expect(page.locator("body")).toHaveCSS("background-image", /fine-paper\.svg/);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const native = await context.newPage();
    await native.goto("/");
    await expect(native.locator("body")).toHaveCSS("background-image", "none");
    await expect(native.locator(".hero-actions .button")).toHaveCSS("box-shadow", "none");
    await expect(native.locator("h1")).toBeVisible();
  } finally { await context.close(); }
});
