import { test, expect, type Page } from "@playwright/test";

const topics = ["Dyslexia", "Dyspraxia", "Dyscalculia", "Dysgraphia"];
const slugs = topics.map((topic) => topic.toLowerCase());
async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(250);
}
async function sample(page: Page, index: number, y: number) {
  await page.evaluate((top) => window.scrollTo(0, top), y);
  await page.waitForTimeout(500);
  return page.locator(".difference-row").nth(index).evaluate((row) => {
    const rect = (el: Element) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top + scrollY, right: r.right, bottom: r.bottom + scrollY, transform: getComputedStyle(el).transform };
    };
    return {
      path: parseFloat(getComputedStyle(row.querySelector(".discovery-path")!).strokeDashoffset),
      wash: parseFloat(getComputedStyle(row.querySelector(".discovery-wash")!).opacity),
      art: rect(row.querySelector(".difference-art-drift")!), frame: rect(row.querySelector(".difference-art")!),
      fixed: [row, row.querySelector("h3")!, row.querySelector("p")!, row.querySelector(".round-arrow")!].map(rect),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
}

test("Phase 03 four linked beats draw and drift while text and hit targets stay still", async ({ page }, info) => {
  test.skip((page.viewportSize()?.height || 0) < 520, "Short landscape deliberately uses a complete static passage.");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  await page.locator(".hero-composition").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: info.outputPath("hero-recesses.png") });
  const measurements = [];
  for (let i = 0; i < 4; i++) {
    const row = page.locator(".difference-row").nth(i);
    const box = await row.evaluate((el) => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height, vh: innerHeight }));
    const start = box.top - box.vh * 0.85;
    const distance = box.height + box.vh * 0.6;
    const early = await sample(page, i, start + distance * 0.05);
    const middle = await sample(page, i, start + distance * 0.5);
    if (i === 0 || i === 3) await page.screenshot({ path: info.outputPath(`discovery-${i === 0 ? "first" : "final"}.png`) });
    const late = await sample(page, i, start + distance * 0.95);
    expect(early.path - late.path).toBeGreaterThan(0.7);
    expect(middle.wash).toBeGreaterThan(0.6);
    expect(early.art.transform).not.toBe(late.art.transform);
    for (let target = 0; target < early.fixed.length; target++) {
      expect(Math.abs(early.fixed[target].top - late.fixed[target].top)).toBeLessThan(1);
      expect(early.fixed[target].left).toBe(late.fixed[target].left);
      expect(late.fixed[target].transform).toBe("none");
    }
    expect(late.art.left).toBeGreaterThanOrEqual(late.frame.left);
    expect(late.art.right).toBeLessThanOrEqual(late.frame.right);
    expect(late.overflow).toBeLessThanOrEqual(1);
    measurements.push({ topic: topics[i], early, middle, late });
  }
  await expect(page.locator("#explore .pin-spacer")).toHaveCount(0);
  await info.attach("discovery-measurements", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
  expect(errors).toEqual([]);
});

test("Phase 03 every topic supports keyboard navigation and restores its reading position", async ({ page }) => {
  await ready(page);
  await page.getByRole("link", { name: "Start with understanding", exact: true }).click();
  await expect(page).toHaveURL(/#explore$/);
  for (let i = 0; i < 4; i++) {
    const link = page.locator(`.difference-row[href="/${slugs[i]}"]`);
    await link.scrollIntoViewIfNeeded();
    await link.focus();
    await expect(link).toBeFocused();
    const before = await page.evaluate(() => scrollY);
    const height = await link.evaluate((el) => el.getBoundingClientRect().height);
    expect(height).toBeGreaterThanOrEqual(44);
    await link.press("Enter");
    await expect(page.getByRole("heading", { name: topics[i], level: 1, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(`${topics[i]} | Connecting Dys`);
    await page.goBack();
    await expect(page).toHaveURL(/\/#explore$/);
    await expect(page.locator("#explore")).toBeVisible();
    await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(3);
    await page.goForward();
    await expect(page.getByRole("heading", { name: topics[i], level: 1, exact: true })).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL(/\/#explore$/);
    await expect(page.locator("#explore")).toBeVisible();
    await expect.poll(async () => Math.abs(await page.evaluate(() => scrollY) - before)).toBeLessThanOrEqual(3);
  }
});

test("Phase 03 preferences, short screens, forced colours and no-JS keep a readable passage", async ({ page, browser }, info) => {
  await ready(page);
  const trigger = page.getByRole("button", { name: "Reading settings", exact: true });
  await trigger.click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
  for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    for (const background of ["Cream", "White", "Soft blue", "Soft peach"]) {
      await page.getByRole("button", { name: background, exact: true }).click();
      await page.waitForTimeout(160);
      for (const path of await page.locator(".discovery-path").all()) await expect(path).toHaveCSS("stroke-dasharray", "none");
      const fills = await page.evaluate(() => ({ body: getComputedStyle(document.body).backgroundColor, motifs: [...document.querySelectorAll(".hero-recess-shape")].map((el) => getComputedStyle(el).fill) }));
      expect(fills.motifs).toEqual([fills.body, fills.body]);
    }
  }
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await page.getByRole("checkbox", { name: "Background texture", exact: true }).uncheck();
  await page.keyboard.press("Escape");
  await page.locator("#explore").scrollIntoViewIfNeeded();
  await expect(page.locator(".discovery-waypoint").first()).toBeHidden();
  await expect(page.locator(".hero-recess-shape").first()).toHaveCSS("filter", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: info.outputPath("discovery-spacious-flat.png") });
  await trigger.click();
  await page.getByRole("button", { name: "Reset preferences", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(250);
  for (const art of await page.locator(".difference-art-drift").all()) await expect(art).toHaveCSS("transform", /^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(250);
  if ((page.viewportSize()?.height || 0) < 520) await expect(page.locator(".discovery-path").first()).toHaveCSS("stroke-dasharray", "none");
  await page.emulateMedia({ forcedColors: "active" });
  await expect(page.locator(".discovery-waypoint").first()).toBeHidden();
  await expect(page.locator(".hero-recess").first()).toBeHidden();
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: info.project.use.viewport, baseURL: info.project.use.baseURL });
  try {
    const native = await context.newPage();
    await native.goto("/#explore");
    await expect(native.locator(".discovery-path").first()).toHaveCSS("stroke-dasharray", "none");
    for (let i = 0; i < 4; i++) {
      const link = native.locator(`.difference-row[href="/${slugs[i]}"]`);
      await expect(link).toBeVisible();
      await expect(link.getByRole("heading", { name: topics[i], exact: true })).toBeVisible();
    }
    await native.locator('.difference-row[href="/dysgraphia"]').click();
    await expect(native.getByRole("heading", { name: "Dysgraphia", level: 1, exact: true })).toBeVisible();
  } finally { await context.close(); }
  // Real 200% Chrome zoom exposed a 2px closing-decoration overflow at this
  // intermediate width; cover both zoom-equivalent reflows after media reset.
  if (info.project.name === "desktop") {
    await page.emulateMedia({ forcedColors: "none" });
    for (const viewport of [{ width: 674, height: 468 }, { width: 337, height: 234 }]) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(250);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      for (const topic of topics) await expect(page.locator("#explore").getByRole("heading", { name: topic, exact: true })).toBeVisible();
    }
  }
});
