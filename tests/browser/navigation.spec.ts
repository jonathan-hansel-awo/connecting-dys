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
  await expect(page.getByRole("link", { name: "Back to home", exact: true })).toHaveCount(0);
  await expect(heading).toBeVisible();
  const gap = await heading.evaluate(el => el.getBoundingClientRect().top) - await page.locator(".about-page").evaluate(el => el.getBoundingClientRect().top);
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

test("Get involved combines the illustration, forms and contact details", async ({ page }, info) => {
  await page.goto("/get-involved");
  await expect(page.locator("main:visible h1")).toHaveText("Get involved");
  await expect(page.locator(".membership-page .community-scene img")).toBeVisible();
  await expect(page.locator("main:visible form")).toHaveCount(2);
  for (const form of await page.locator("main:visible form").all()) {
    await expect(form).toHaveAttribute("action", "mailto:info@conectingdys.org.uk");
  }
  for (const name of ["How to express interest", "This is an expression of interest.", "Join us in creating something meaningful.", "Who Can Join"]) {
    await expect(page.getByRole("heading", { name, exact: true })).toHaveCount(0);
  }
  const contact = page.locator("main:visible #contact");
  await expect(contact.getByRole("link", { name: "info@conectingdys.org.uk", exact: true })).toHaveAttribute("href", "mailto:info@conectingdys.org.uk");
  await expect(contact).toContainText("We are based in Nottingham, but our community is open to every DYS mind nationwide.");
  await expect(contact.locator(":scope > p")).toHaveCount(2);
  const useful = page.getByRole("navigation", { name: "Useful links", exact: true });
  await expect(useful.getByRole("link")).toHaveCount(3);
  for (const path of ["/support", "/accessibility", "/paths-to-belonging"]) {
    await expect(page.locator(`.site-navigation a[href="${path}"]`)).toHaveCount(0);
    await expect(useful.locator(`a[href="${path}"]`)).toHaveCount(1);
  }
  const positions = await page.getByRole("navigation", { name: "Footer navigation", exact: true }).locator("a").evaluateAll(elements => elements.map(el => ({ x: el.getBoundingClientRect().left, y: el.getBoundingClientRect().top })));
  expect(positions).toHaveLength(10);
  expect(positions[5].x).toBeGreaterThan(positions[0].x);
  expect(Math.abs(positions[5].y - positions[0].y)).toBeLessThanOrEqual(1);
  for (let i = 0; i < 5; i++) {
    expect(Math.abs(positions[i].x - positions[0].x)).toBeLessThanOrEqual(1);
    expect(Math.abs(positions[i + 5].x - positions[5].x)).toBeLessThanOrEqual(1);
  }
  for (const [legacy, destination] of [["/contact", "/get-involved#contact"], ["/membership", "/get-involved#register-interest"]]) {
    await page.goto(legacy);
    await expect(page).toHaveURL(new RegExp(destination + "$"));
    await expect(page.locator("main:visible h1")).toHaveText("Get involved");
  }
  for (const route of ["/our-story", "/dysgraphia", "/about"]) {
    await page.goto(route);
    await expect(page.getByRole("link", { name: "Back to home", exact: true })).toHaveCount(0);
    const gap = await page.locator("main:visible h1").evaluate(el => el.getBoundingClientRect().top - document.querySelector("main")!.getBoundingClientRect().top);
    expect(gap).toBeLessThan(100);
  }
  await page.goto("/get-involved");
  await page.screenshot({ path: info.outputPath("get-involved-combined.png"), fullPage: true });
});
