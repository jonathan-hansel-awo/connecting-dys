import { test, expect } from "@playwright/test";

async function navFor(page: import("@playwright/test").Page) {
  const menu = page.locator(".nav-shell > summary");
  if (await menu.isVisible()) {
    if ((await page.locator(".nav-shell").getAttribute("open")) === null) await menu.click();
    return page.getByRole("navigation", { name: "Mobile navigation", exact: true });
  }
  return page.getByRole("navigation", { name: "Main navigation", exact: true });
}

test("grouped menu supports keyboard, Escape, outside dismissal and real route selection", async ({ page }) => {
  await page.goto("/");
  let nav = await navFor(page);
  const about = nav.locator(".nav-group").filter({ has: page.locator("summary", { hasText: /^About$/ }) });
  await about.locator("summary").press("Enter");
  await expect(about).toHaveAttribute("open", "");
  await about.getByRole("link", { name: "Founder’s message", exact: true }).focus();
  await page.keyboard.press("Escape");
  await expect(about).not.toHaveAttribute("open");
  await expect(about.locator("summary")).toBeFocused();
  await about.locator("summary").click();
  await page.locator(".site-header").click({ position: { x: 4, y: 4 } });
  await expect(page.locator(".site-navigation details[open]")).toHaveCount(0);
  nav = await navFor(page);
  await nav.locator("summary").filter({ hasText: /^About$/ }).click();
  await nav.getByRole("link", { name: "Our story", exact: true }).click();
  await expect(page.locator("main:visible h1")).toHaveText("Our Story");
  await expect(page.locator("main:visible [data-source-id]")).toHaveCount(1);
  await expect(page.locator(".site-navigation details[open]")).toHaveCount(0);
});

test("all four DYS pages are reached from the menu and have their own illustrated content", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Dyspraxia", "Dyscalculia", "Dysgraphia", "Dyslexia"]) {
    const nav = await navFor(page);
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page.locator("main:visible h1")).toHaveText(name);
    await expect(page.locator("main:visible .topic-art svg")).toBeVisible();
    await expect(page.locator("main:visible .difference-experiences li")).toHaveCount(3);
    await expect(page.locator(".site-navigation details[open]")).toHaveCount(0);
  }
});

test("native dropdowns and topic routes also work without JavaScript", async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: info.project.use.baseURL, viewport: info.project.use.viewport });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const nav = await navFor(page);
    await nav.getByRole("link", { name: "Dysgraphia", exact: true }).click();
    await expect(page.locator("main:visible h1")).toHaveText("Dysgraphia");
  } finally { await context.close(); }
});

test("About starts promptly and the mobile hero shows the logo first", async ({ page }, info) => {
  await page.goto("/about");
  const heading = page.locator(".about-page > .editorial-heading");
  const breadcrumb = page.locator(".about-page > .breadcrumb");
  await expect(heading).toBeVisible();
  const gap = await heading.evaluate(el => el.getBoundingClientRect().top) - await breadcrumb.evaluate(el => el.getBoundingClientRect().bottom);
  expect(gap).toBeLessThan(32);
  await expect(page.locator('[data-source-id="mission"] p')).toHaveCount(1);
  const sections = await page.locator("main:visible [data-source-id]").evaluateAll(elements => elements.map(el => el.getAttribute("data-source-id")));
  expect(sections).toEqual(["why", "mission", "vision", "goal", "purpose"]);
  for (const dark of [false, true]) {
    await page.getByRole("button", { name: "Reading settings", exact: true }).click();
    await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(dark);
    await page.keyboard.press("Escape");
    await expect(page.locator(".brand-link")).toHaveCSS("background-color", "rgb(32, 53, 77)");
    await page.screenshot({ path: info.outputPath(`about-${dark ? "dark" : "light"}.png`), fullPage: true });
  }
  await page.goto("/");
  if ((page.viewportSize()?.width || 0) <= 760) {
    const logo = await page.locator(".hero-dys-embrace").boundingBox();
    const title = await page.locator("#hero-title").boundingBox();
    expect(logo!.y + logo!.height).toBeLessThanOrEqual(title!.y);
  }
  await expect(page.locator(".footer-brand")).toHaveCSS("background-color", "rgb(32, 53, 77)");
});

test("reading panels share the icon band and emphasise standalone thoughts", async ({ page }, info) => {
  await page.goto("/about");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  for (const dark of [false, true]) {
    await page.getByRole("button", { name: "Reading settings", exact: true }).click();
    await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(dark);
    await page.keyboard.press("Escape");
    const panels = await page.locator("main:visible .copy-panel.has-edge-doodle").evaluateAll(elements => elements.flatMap(panel => {
      const icon = panel.querySelector(":scope > .edge-doodle");
      const text = panel.querySelector(":scope > h1, :scope > h2, :scope > h3, :scope > p");
      if (!icon || !text || !icon.getBoundingClientRect().width) return [];
      const image = icon.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(text);
      const collision = [...range.getClientRects()].some(rect =>
        rect.width > 0 && rect.height > 0 &&
        rect.left < image.right && rect.right > image.left &&
        rect.top < image.bottom && rect.bottom > image.top);
      return [{ topGap: text.getBoundingClientRect().top - image.top, collision }];
    }));
    expect(panels.length).toBeGreaterThan(5);
    for (const panel of panels) {
      expect(Math.abs(panel.topGap)).toBeLessThanOrEqual(4);
      expect(panel.collision).toBe(false);
    }
    const emphasis = await page.locator('[data-source-id="why"] .editorial-quote').evaluate(el => ({
      weight: Number(getComputedStyle(el).fontWeight),
      size: parseFloat(getComputedStyle(el).fontSize),
      body: parseFloat(getComputedStyle(document.querySelector('[data-source-id="why"] p')!).fontSize),
    }));
    expect(emphasis.weight).toBeGreaterThanOrEqual(700);
    expect(emphasis.size).toBeGreaterThan(emphasis.body);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath(`compact-about-${dark ? "dark" : "light"}.png`), fullPage: true });
  }
  if ((page.viewportSize()?.width || 0) > 760) {
    const logo = await page.locator(".editorial-brand").boundingBox();
    const heading = await page.locator(".editorial-heading h1").boundingBox();
    expect(logo!.y).toBeLessThan(heading!.y);
  }
});
