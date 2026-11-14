import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
}
const toggle = (page: Page) => page.getByRole("button", { name: "Dark mode", exact: true });
const audit = (page: Page) => new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();

test("dark toggle and settings stay in sync, persist across routes/reload and restore light colours", async ({ page }, info) => {
  const errors: string[] = [];
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  await page.emulateMedia({ colorScheme: "dark" });
  await ready(page);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator("html")).toHaveCSS("color-scheme", "light only");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("button", { name: "Soft blue", exact: true }).click();
  await page.keyboard.press("Escape");
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Dark mode", exact: true })).toBeChecked();
  await expect(page.getByRole("button", { name: "Slate blue", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Escape");
  await page.screenshot({ path: info.outputPath("dark-home.png") });
  await page.locator(".hero-actions .button").click();
  await expect(page).toHaveURL(/\/support$/);
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="color-scheme"]')).toHaveCount(1);
  await expect(page.locator("html")).toHaveCSS("color-scheme", "dark only");
  await toggle(page).click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(235, 244, 250)");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Dark mode", exact: true })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "Dark mode", exact: true }).check();
  await page.getByRole("button", { name: "Reset preferences", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Dark mode", exact: true })).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  expect(errors).toEqual([]);
});

test("dark materials retain contrast across four backgrounds, textures and spacious reading", async ({ page }, info) => {
  await ready(page);
  await toggle(page).click();
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  for (const texture of ["paper", "linen", "plaster"]) {
    await page.getByRole("combobox", { name: "Texture style", exact: true }).selectOption(texture);
    for (const background of ["Warm navy", "Deep navy", "Slate blue", "Warm charcoal"]) {
      await page.getByRole("button", { name: background, exact: true }).click();
      expect((await audit(page)).violations).toEqual([]);
    }
  }
  await page.keyboard.press("Escape");
  for (const selector of [".hero", "#recognition", "#explore", "#community", ".support", ".about-home", ".invitation"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    expect((await audit(page)).violations, selector).toEqual([]);
    await page.screenshot({ path: info.outputPath(`dark-${selector.replace(/[^a-z0-9-]/gi, "")}.png`) });
  }
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("checkbox", { name: "Background texture", exact: true }).uncheck();
  await expect(page.locator(".support-surface")).toHaveCSS("box-shadow", "none");
  for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator("dialog").evaluate(el=>el.scrollWidth-el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await page.keyboard.press("Escape");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect((await audit(page)).violations).toEqual([]);
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("button", { name: "Reset preferences", exact: true }).click();
  await page.keyboard.press("Escape");
  await toggle(page).click();
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator("body")).toHaveCSS("background-image", "none");
  await expect(page.locator(".hero-actions .button")).toHaveCSS("box-shadow", "none");
});

test("theme controls remain usable with Chromium forced darkening, blocked storage and no JavaScript", async ({ page, browser }, info) => {
  await ready(page);
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setAutoDarkModeOverride", { enabled: true });
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(252, 247, 237)");
  await toggle(page).click();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(22, 41, 56)");
  await page.screenshot({ path: info.outputPath("dark-auto-darkening.png") });
  await toggle(page).click();
  await page.screenshot({ path: info.outputPath("light-auto-darkening.png") });
  const native = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL, colorScheme: "dark" });
  try {
    const tab = await native.newPage();
    await tab.goto("/");
    await expect(toggle(tab)).toBeHidden();
    await expect(tab.locator("html")).toHaveCSS("color-scheme", "light only");
    await tab.locator(".invitation .button").click();
    await expect(tab).toHaveURL(/\/contact$/);
  } finally { await native.close(); }
  await cdp.send("Emulation.setAutoDarkModeOverride", { enabled: false });
  await page.addInitScript(() => Object.defineProperty(window,"localStorage",{get(){throw new Error("Storage denied");}}));
  await page.reload();
  await toggle(page).click();
  await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Browser storage is unavailable");
});

test("all ten dark public routes pass rendered accessibility", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "Shared routes audited once; homepage/preferences covered in every viewport.");
  await ready(page);
  await toggle(page).click();
  for (const route of ["/", "/about", "/support", "/contact", "/get-involved", "/accessibility", "/dyslexia", "/dyspraxia", "/dyscalculia", "/dysgraphia"]) {
    await page.goto(route);
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
    expect((await audit(page)).violations, route).toEqual([]);
  }
});
