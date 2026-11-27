import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";
import path from "node:path";
import { chapters } from "../../src/features/paths-to-belonging/chapters";
import { gardenRoutes, neighbourhoodRoutes, endingRoutes } from "../fixtures/paths-to-belonging";
import type { Board } from "../../src/features/paths-to-belonging/types";

const tags = ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"];
const gameChunks = fs.readdirSync(".next/static/chunks").filter((name) => name.endsWith(".js") && fs.readFileSync(path.join(".next/static/chunks", name), "utf8").includes("paths-piece-"));
const gameChunk = (url: string) => gameChunks.some((chunk) => new URL(url).pathname.endsWith(`/${chunk}`));
const control = (page: Page, name: string) => page.getByRole("button", { name, exact: true });
async function play(page: Page) {
  await page.goto("/paths-to-belonging");
  await expect(control(page, "Restart chapter")).toBeEnabled();
  await page.locator("[data-paths-game]").scrollIntoViewIfNeeded();
}
async function solve(page: Page, index: number, target: Board) {
  const initial = chapters[index].arrangements[0].board;
  for (const [id, turn] of Object.entries(target)) {
    const piece = page.locator(`#paths-piece-${id}`);
    for (let times = 0; times < (turn - initial[id] + 4) % 4; times++) {
      await piece.focus();
      await piece.press(times % 2 === 0 ? "Enter" : "Space");
      await expect(piece).toBeFocused();
    }
  }
  await expect(control(page, "Continue")).toBeVisible();
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  expect(await page.locator("[data-paths-game]").evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
}

async function headingHasClearOutline(page: Page) {
  const geometry = await page.locator("[data-paths-game] h3").evaluate((heading) => {
    const label = heading.previousElementSibling!;
    const style = getComputedStyle(heading);
    return {
      gap: heading.getBoundingClientRect().top - label.getBoundingClientRect().bottom,
      outset: parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset),
    };
  });
  expect(geometry.gap).toBeGreaterThanOrEqual(geometry.outset + 1);
}

test("inline game keeps initial page position; keyboard completes all chapters and replays", async ({ page }, info) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("request", (request) => { if (gameChunk(request.url())) requests.push(request.url()); });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/paths-to-belonging");
  await expect(control(page, "Restart chapter")).toBeEnabled();
  expect(await page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
  await expect(page.getByRole("heading", { name: "Find a Way", exact: true })).not.toBeFocused();
  expect(gameChunks.length).toBeGreaterThan(0);
  expect(requests.length).toBeGreaterThan(0);
  await page.locator("[data-paths-game]").scrollIntoViewIfNeeded();
  await expect(control(page, "Undo")).toBeDisabled();
  await expect(control(page, "Continue")).toHaveCount(0);
  const targets = [gardenRoutes.upper, neighbourhoodRoutes.perimeter, endingRoutes["home-arch"]];
  for (let index = 0; index < chapters.length; index++) {
    await expect(page.locator("[data-paper-landscape]")).toHaveAttribute("viewBox", ["0 0 300 300", "0 -100 300 500", "0 -100 400 500"][index]);
    await solve(page, index, targets[index]);
    await expect(page.locator(".paths-world")).toHaveAttribute("data-complete", "true");
    await expect(page.getByRole("heading", { name: chapters[index].name, exact: true })).toBeVisible();
    await noOverflow(page);
    expect(["relative", "static"]).toContain(await page.locator("[data-paths-section]").evaluate((el) => getComputedStyle(el).position));
    const audit = await new AxeBuilder({ page }).withTags(tags).analyze();
    expect(audit.violations).toEqual([]);
    await page.locator(".paths-board").screenshot({ path: info.outputPath(`chapter-${index}.png`) });
    await control(page, "Continue").click();
    if (index < 2) await expect(page.getByRole("heading", { name: chapters[index + 1].name, exact: true })).toBeFocused();
    await headingHasClearOutline(page);
  }
  await expect(page.getByRole("heading", { name: "There's more than one way to belong.", exact: true })).toBeFocused();
  await expect(page.getByRole("status")).toContainText("An arch above a home");
  await expect(page.locator('[data-ending="home-arch"]')).toBeVisible();
  await expect(page.locator(".paths-message").getByRole("link", { name: "Register your interest", exact: true })).toHaveAttribute("href", "/get-involved#register-interest");
  await page.locator(".paths-ending").screenshot({ path: info.outputPath("home-arch-ending.png") });
  const endingHeading = page.getByRole("heading", { name: "There's more than one way to belong.", exact: true });
  for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
    await control(page, "Reading settings").click();
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    await control(page, "Soft blue").click();
    if (font === "OpenDyslexic") {
      await page.getByRole("slider").press("End");
      await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
      await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
    }
    await page.keyboard.press("Escape");
    await page.evaluate(() => document.fonts.ready);
    await endingHeading.focus();
    await headingHasClearOutline(page);
    await noOverflow(page);
  }
  await page.locator(".paths-message").screenshot({ path: info.outputPath("completion-focus-large.png") });
  await control(page, "Reading settings").click();
  await control(page, "Reset preferences").click();
  await page.keyboard.press("Escape");
  await endingHeading.focus();
  await page.locator(".paths-message").screenshot({ path: info.outputPath("completion-focus-default.png") });
  await control(page, "Replay journey").click();
  await expect(page.getByRole("heading", { name: "Find a Way", exact: true })).toBeFocused();
  await expect(page.locator("#paths-piece-willow-bend")).toHaveAttribute("aria-label", /opening south and west/);
  expect(errors).toEqual([]);
});

test("paper effects respond live to OS/site motion, texture and forced-colour preferences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "none" });
  await play(page);
  const scenery = page.locator("[data-paper-landscape]");
  await expect(scenery).toHaveCSS("animation-name", "paths-world-arrive");
  const piece = page.locator("#paths-piece-willow-bend");
  await piece.click();
  const before = await piece.getAttribute("aria-label");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(scenery).toHaveCSS("animation-name", "none");
  await expect(page.locator(".paths-garden-bloom").first()).toHaveCSS("transition-duration", "0s");
  await expect(piece).toHaveAttribute("aria-label", before!);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await control(page, "Reading settings").click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
  await page.getByRole("checkbox", { name: "Background texture", exact: true }).uncheck();
  await page.keyboard.press("Escape");
  await expect(scenery).toHaveCSS("animation-name", "none");
  expect(await page.locator(".paths-world").evaluate((el) => getComputedStyle(el, "::before").display)).toBe("none");
  await expect(page.locator(".paths-paper-cut").first()).toHaveCSS("filter", "none");
  await expect(piece).toHaveAttribute("aria-label", before!);
  await page.emulateMedia({ forcedColors: "active" });
  await expect(scenery).toHaveCSS("display", "none");
  await expect(piece).toBeVisible();
  await piece.press("Enter");
  await expect(piece).toBeFocused();
  await expect(piece).not.toHaveAttribute("aria-label", before!);
  await noOverflow(page);
});

test("both joined places glow steadily and clear on a broken path, undo or restart", async ({ page }, info) => {
  await play(page);
  await expect(page.locator(".paths-piece.is-joined")).toHaveCount(0);
  await solve(page, 0, gardenRoutes.upper);
  const joined = page.locator('.paths-piece[role="img"].is-joined');
  await expect(joined).toHaveCount(2);
  for (const place of await joined.all()) {
    await expect(place).toHaveAccessibleName(/Connected to another place/);
    await expect(place.locator(".paths-landmark-halo")).toHaveCSS("opacity", "0.5");
    await expect(place.locator(".paths-landmark")).not.toHaveCSS("filter", "none");
  }
  await noOverflow(page);
  await page.locator(".paths-world").screenshot({ path: info.outputPath("connected-places-light.png") });
  await control(page, "Reading settings").click();
  await page.getByRole("checkbox", { name: "Dark mode", exact: true }).check();
  await page.keyboard.press("Escape");
  await expect(joined).toHaveCount(2);
  await page.locator(".paths-world").screenshot({ path: info.outputPath("connected-places-dark.png") });
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([]);
  await page.locator("#paths-piece-willow-bend").click();
  await expect(joined).toHaveCount(0);
  await control(page, "Undo").click();
  await expect(joined).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(joined.first().locator(".paths-landmark-halo")).toHaveCSS("animation-name", "none");
  await expect(joined.first().locator(".paths-landmark-halo")).toHaveCSS("opacity", "0.5");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(joined.first().locator(".paths-landmark-halo")).toHaveCSS("display", "none");
  await expect(joined.first().locator(".paths-landmark")).toHaveCSS("filter", "none");
  await expect(joined.first()).toHaveAccessibleName(/Connected to another place/);
  await control(page, "Restart chapter").click();
  await expect(joined).toHaveCount(0);
});

test("hints, undo, restart and skip preserve feedback and allow scrolling to the footer", async ({ page }) => {
  await play(page);
  const piece = page.locator("#paths-piece-willow-bend");
  const before = await piece.getAttribute("aria-label");
  await control(page, "Hint").click();
  await expect(page.locator("#paths-hint")).toContainText("Try turning");
  await expect(piece).toHaveAttribute("aria-label", before!);
  const firstHint = await page.locator(".is-hint").getAttribute("id");
  await control(page, "Hint").click();
  expect(await page.locator(".is-hint").getAttribute("id")).not.toBe(firstHint);
  await piece.click();
  await expect(piece).toBeFocused();
  await expect(control(page, "Undo")).toBeEnabled();
  await control(page, "Undo").click();
  await expect(piece).toHaveAttribute("aria-label", before!);
  await control(page, "Restart chapter").click();
  await expect(page.getByRole("heading", { name: "Find a Way", exact: true })).toBeFocused();
  await expect(control(page, "Undo")).toBeDisabled();
  await page.getByText("How to play", { exact: true }).click();
  await expect(page.getByText(/Join the openings on neighbouring pieces/)).toBeVisible();
  for (const chapter of chapters) {
    await control(page, "Skip chapter").click();
    await expect(page.getByRole("heading", { name: chapter.name, exact: true })).toBeFocused();
    await expect(page.getByRole("status").first()).toContainText("Chapter skipped");
    await control(page, "Continue").click();
  }
  await expect(page.getByRole("heading", { name: "Thank you for exploring.", exact: true })).toBeFocused();
  await page.locator("#site-footer").scrollIntoViewIfNeeded();
  await expect(page.getByRole("navigation", { name: "Footer navigation", exact: true })).toBeVisible();
});

test("active game retains state across reading preferences and reflows at large type", async ({ page }, info) => {
  await play(page);
  await page.locator("#paths-piece-willow-bend").click();
  const before = await page.locator(".paths-board").innerHTML();
  const settings = control(page, "Reading settings");
  const fonts = ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"];
  const backgrounds = ["Cream", "White", "Soft blue", "Soft peach"];
  for (const [index, font] of fonts.entries()) {
    await settings.click();
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    await control(page, backgrounds[index % backgrounds.length]).click();
    await page.getByRole("checkbox", { name: "Background texture", exact: true }).setChecked(index % 2 === 0);
    await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
    if (font === "OpenDyslexic") {
      await page.getByRole("slider").press("End");
      await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
      await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
      await page.getByRole("checkbox", { name: "Dark mode", exact: true }).check();
    }
    await page.keyboard.press("Escape");
    await expect(settings).toBeFocused();
    expect(await page.locator(".paths-board").innerHTML()).toBe(before);
    await page.locator("[data-paths-game]").scrollIntoViewIfNeeded();
    await noOverflow(page);
  }
  await page.locator("[data-paths-game]").screenshot({ path: info.outputPath("large-reading.png") });
  expect((await new AxeBuilder({ page }).withTags(tags).analyze()).violations).toEqual([]);
  await control(page, "Undo").click();
  await expect(page.locator("#paths-piece-willow-bend")).toHaveAttribute("aria-label", /opening north and east/);
  for (let index = 1; index < chapters.length; index++) {
    await control(page, "Skip chapter").click();
    await control(page, "Continue").click();
    await expect(page.getByRole("heading", { name: chapters[index].name, exact: true })).toBeFocused();
    await noOverflow(page);
    const sizes = await page.locator(".paths-board button").evaluateAll((pieces) => pieces.map((piece) => {
      const { width, height } = piece.getBoundingClientRect();
      return Math.min(width, height);
    }));
    expect(Math.min(...sizes)).toBeGreaterThanOrEqual(44);
  }
});

test("forced colours, OS reduced motion and touch keep the journey usable", async ({ page }, info) => {
  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await play(page);
  const piece = page.locator("#paths-piece-willow-bend");
  const before = await piece.getAttribute("aria-label");
  if (info.project.use.hasTouch) await piece.tap();
  else await piece.click();
  await expect(piece).not.toHaveAttribute("aria-label", before!);
  await control(page, "Hint").click();
  await expect(page.locator(".is-hint")).toHaveCount(1);
  await noOverflow(page);
  await page.locator(".paths-board").screenshot({ path: info.outputPath("forced-colours.png") });
});

test("no JavaScript leaves explanation, footer and contact routes available", async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const page = await context.newPage();
    await page.goto("/paths-to-belonging");
    await expect(page.getByRole("heading", { name: "Paths to Belonging", exact: true })).toBeVisible();
    await expect(page.getByText(/The puzzle controls need JavaScript/)).toBeVisible();
    await expect(page.locator(".paths-world")).toBeVisible();
    await expect(control(page, "Restart chapter")).toBeDisabled();
    await expect(page.locator("#paths-piece-willow-bend")).toBeDisabled();
    await page.locator("#site-footer").scrollIntoViewIfNeeded();
    await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Contact", exact: true }).click();
    await expect(page.locator("main:visible h1")).toBeVisible();
    await expect(page).toHaveURL(/\/get-involved#contact$/);
  } finally { await context.close(); }
});

test("failed game script leaves the section fallback and footer navigation usable", async ({ page }) => {
  await page.route("**/_next/static/chunks/*.js", (route) => gameChunk(route.request().url()) ? route.abort() : route.continue());
  await page.goto("/paths-to-belonging");
  await expect(page.getByRole("heading", { name: "The little journey isn't available right now", exact: true })).toBeVisible();
  expect(await page.evaluate(() => scrollY)).toBeLessThanOrEqual(1);
  await page.getByRole("link", { name: "Continue exploring", exact: true }).click();
  await expect(page.locator("#site-footer")).toBeFocused();
  await page.getByRole("navigation", { name: "Footer navigation", exact: true }).getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/get-involved#contact$/);
});

test("a slow game script preserves the visible board and does not steal focus or scroll", async ({ page }) => {
  let release: () => void = () => {};
  const held = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    if (gameChunk(route.request().url())) await held;
    await route.continue();
  });
  await page.goto("/paths-to-belonging", { waitUntil: "domcontentloaded" });
  try {
    await expect(page.locator(".paths-world")).toBeVisible();
    await expect(page.locator("#paths-piece-willow-bend")).toBeDisabled();
    await page.evaluate(() => document.fonts.ready);
    await page.locator("#site-footer").scrollIntoViewIfNeeded();
    await page.locator("#site-footer").focus();
    const before = await page.evaluate(() => scrollY);
    release();
    await expect(control(page, "Restart chapter")).toBeEnabled();
    await expect(page.locator("#site-footer")).toBeFocused();
    expect(Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(1);
    await expect(page.locator("[data-paths-game]")).toHaveCount(1);
  } finally { release(); }
});
