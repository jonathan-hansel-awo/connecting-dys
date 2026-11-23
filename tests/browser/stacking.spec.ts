import { test, expect, type Page } from "@playwright/test";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  // Pointer scrolling restores the visual journey after keyboard interaction.
  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(300);
}
async function scroll(page: Page, top: number) {
  await page.evaluate((y) => scrollTo(0, y), top);
  await page.waitForTimeout(500);
}

test("whole sections pause while the next opaque sheet rises over them", async ({ page }, info) => {
  test.skip((page.viewportSize()?.height || 0) < 650, "Short screens retain natural flow.");
  await ready(page);
  await expect(page.locator("main[data-home-story]")).toHaveAttribute("data-section-stack", "on");
  const results = [];
  for (const selector of [".hero", ".home-building", ".home-approach"]) {
    const geometry = await page.locator(selector).evaluate((sheet) => {
      // Measure with stickiness paused, just as ScrollTrigger refresh does.
      const main = sheet.parentElement!;
      delete main.dataset.sectionStack;
      const next = sheet.nextElementSibling!;
      const r = sheet.getBoundingClientRect();
      const result = { start: r.top + scrollY - parseFloat(getComputedStyle(sheet).getPropertyValue("--sheet-top")), next: next.getBoundingClientRect().top + scrollY, vh: innerHeight };
      main.dataset.sectionStack = "on";
      return result;
    });
    const sample = async (fraction: number) => {
      await scroll(page, geometry.start + geometry.vh * fraction);
      return page.locator(selector).evaluate((sheet) => {
        const next = sheet.nextElementSibling!;
        const r = sheet.getBoundingClientRect();
        const n = next.getBoundingClientRect();
        const x = document.documentElement.clientWidth / 2;
        const y = Math.min(innerHeight - 10, n.top + 25);
        return { top: r.top, next: n.top, nextWins: next.contains(document.elementFromPoint(x, y)), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, position: getComputedStyle(sheet).position, stickyTop: getComputedStyle(sheet).top, scroll: scrollY, stack: sheet.parentElement!.dataset.sectionStack };
      });
    };
    const early = await sample(.08);
    const late = await sample(.48);
    await info.attach(`${selector}-geometry`, { body: JSON.stringify({ geometry, early, late }, null, 2), contentType: "application/json" });
    expect(Math.abs(early.top - late.top), `${selector} pauses`).toBeLessThan(2);
    expect(early.next - late.next, `${selector}'s next sheet advances`).toBeGreaterThan(100);
    expect(late.nextWins, "incoming sheet paints in front").toBe(true);
    expect(late.overflow).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath(`${selector.slice(1)}-stacked.png`) });
    results.push({ selector, geometry, early, late });
  }
  // The invitation keeps its paint order over About, then scrolls naturally
  // into the optional journey so neither ending can cover the other's links.
  await expect(page.locator(".invitation")).toHaveCSS("position", "relative");
  await expect(page.locator("[data-paths-section]")).toHaveCSS("position", "relative");
  await info.attach("section-stacking", { body: JSON.stringify(results, null, 2), contentType: "application/json" });
});

test("stacking releases for keyboard focus, anchors, find and reading preferences", async ({ page }) => {
  test.skip((page.viewportSize()?.height || 0) < 650, "Short screens retain natural flow.");
  await ready(page);
  await expect(page.locator("main[data-home-story]")).toHaveAttribute("data-section-stack", "on");
  await page.locator(".home-building > a").first().focus();
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ ...viewport, height: viewport.height - 10 });
  await page.waitForTimeout(300);
  await page.setViewportSize(viewport);
  await page.waitForTimeout(300);
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  const visible = await page.locator(".home-building > a").first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + 20, Math.max(r.top + 10, 150)));
  });
  expect(visible).toBe(true);
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/what-we-do$/);
  await page.goBack();
  await expect(page).toHaveTitle("Connecting Dys | A home for every DYS mind.");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
  await page.keyboard.press("Escape");
  await page.mouse.wheel(0, 1);
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  await expect(page.locator(".home-building")).toHaveCSS("position", "relative");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.getByRole("button", { name: "Reset preferences", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, 1);
  await expect(page.locator("main[data-home-story]")).toHaveAttribute("data-section-stack", "on");
  await page.keyboard.press("Control+f");
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
});

test("stacking has static alternatives for short screens, OS motion and no JavaScript", async ({ page, browser }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await ready(page);
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  await expect(page.locator(".hero")).toHaveCSS("position", "relative");
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "active" });
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  await page.emulateMedia({ forcedColors: "none" });
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("main[data-home-story]")).not.toHaveAttribute("data-section-stack");
  const native = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const tab = await native.newPage();
    await tab.goto("/");
    await expect(tab.locator(".hero")).toHaveCSS("position", "relative");
    await tab.locator(".invitation .button").click();
    await expect(tab).toHaveURL(/\/membership$/);
  } finally { await native.close(); }
});
