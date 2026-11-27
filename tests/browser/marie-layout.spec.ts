import { test, expect } from "@playwright/test";

test("interest forms open independently with keyboard and retain entered answers", async ({ page }, info) => {
  await page.goto("/get-involved");
  const young = page.locator("#young-people"), adult = page.locator("#young-adults");
  for (const disclosure of [young, adult]) {
    await expect(disclosure).not.toHaveAttribute("open");
    await expect(disclosure.locator("form")).toBeHidden();
  }
  await young.locator(":scope > summary").focus();
  await page.keyboard.press("Enter");
  await expect(young.locator("form")).toBeVisible();
  await young.locator('input[name="fullName"]').fill("Example visitor");
  await young.locator(":scope > summary").click();
  await expect(young.locator("form")).toBeHidden();
  await adult.locator(":scope > summary").press("Space");
  await expect(adult.locator("form")).toBeVisible();
  await expect(young).not.toHaveAttribute("open");
  await young.locator(":scope > summary").click();
  await expect(young.locator('input[name="fullName"]')).toHaveValue("Example visitor");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await young.locator(":scope > summary").click();
  await adult.locator(":scope > summary").click();
  await page.screenshot({ path: info.outputPath("interest-collapsed.png"), fullPage: true });
});

test("native interest disclosures also open without JavaScript", async ({ browser }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL: info.project.use.baseURL, viewport: info.project.use.viewport });
  try {
    const page = await context.newPage();
    await page.goto("/get-involved");
    const disclosure = page.locator("#young-adults");
    await expect(disclosure.locator("form")).toBeHidden();
    await disclosure.locator(":scope > summary").click();
    await expect(disclosure.locator("form")).toBeVisible();
  } finally { await context.close(); }
});

test("reference grids and the new story photo reflow in both themes", async ({ page }, info) => {
  for (const dark of [false, true]) {
    await page.goto("/");
    await page.getByRole("button", { name: "Reading settings", exact: true }).click();
    await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(dark);
    await page.keyboard.press("Escape");
    for (const selector of [".hero", ".home-building", ".home-approach"]) {
      await page.locator(selector).scrollIntoViewIfNeeded();
      await page.locator(selector).screenshot({ path: info.outputPath(selector.slice(1) + (dark ? "-dark.png" : "-light.png")) });
    }
    await page.goto("/dyspraxia");
    await expect(page.getByRole("heading", { name: "Everyday Impact", exact: true })).toBeVisible();
    await expect(page.locator(".condition-impact-list article")).toHaveCount(3);
    await expect(page.locator(".condition-comparison section")).toHaveCount(2);
    await page.screenshot({ path: info.outputPath(dark ? "condition-dark.png" : "condition-light.png"), fullPage: true });
    await page.goto("/our-story");
    await expect(page.locator(".community-photo img")).toHaveAttribute("src", /shared-reading-cutout/);
    await expect(page.locator(".editorial-interlude .community-scene img")).toHaveAttribute("src", /community-library/);
    await expect(page.locator('img[src*="exploring-books"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    await page.screenshot({ path: info.outputPath(dark ? "story-dark.png" : "story-light.png"), fullPage: true });
  }
});
