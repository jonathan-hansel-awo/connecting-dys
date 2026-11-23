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
  await page.locator("main h1").click();
  await expect(about).not.toHaveAttribute("open");
  nav = await navFor(page);
  await nav.locator("summary").filter({ hasText: /^About$/ }).click();
  await nav.getByRole("link", { name: "Our story", exact: true }).click();
  await expect(page.locator("main h1")).toHaveText("Our Story");
  await expect(page.locator("main [data-source-id]")).toHaveCount(1);
  await expect(page.locator(".site-navigation details[open]")).toHaveCount(0);
});

test("all four DYS pages are reached from the menu and have their own illustrated content", async ({ page }) => {
  await page.goto("/");
  for (const name of ["Dyspraxia", "Dyscalculia", "Dysgraphia", "Dyslexia"]) {
    const nav = await navFor(page);
    await nav.locator("summary").filter({ hasText: /^Explore DYS$/ }).click();
    await nav.getByRole("link", { name, exact: true }).click();
    await expect(page.locator("main h1")).toHaveText(name);
    await expect(page.locator(".topic-art svg")).toBeVisible();
    await expect(page.locator(".difference-experiences li")).toHaveCount(3);
    await expect(page.locator(".site-navigation details[open]")).toHaveCount(0);
  }
});

test("native dropdowns and topic routes also work without JavaScript", async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: info.project.use.baseURL, viewport: info.project.use.viewport });
  try {
    const page = await context.newPage();
    await page.goto("/");
    const nav = await navFor(page);
    await nav.locator("summary").filter({ hasText: /^Explore DYS$/ }).click();
    await nav.getByRole("link", { name: "Dysgraphia", exact: true }).click();
    await expect(page.locator("main h1")).toHaveText("Dysgraphia");
  } finally { await context.close(); }
});
