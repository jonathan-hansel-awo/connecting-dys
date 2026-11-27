import { test, expect } from "@playwright/test";

test("illustrated principles retain their wording and fit the reading layout", async ({ page }, info) => {
  await page.goto("/");
  const cards = page.locator(".principle-card");
  await expect(cards).toHaveCount(4);
  await expect(cards.locator("h3")).toHaveText(["Community over isolation", "Lived experience over assumptions", "Inclusion over exclusion", "Strengths over stigma"]);
  await expect(cards.locator(".principle-art img")).toHaveCount(4);
  await expect(cards.locator("svg")).toHaveCount(0);
  await page.locator(".home-principles").scrollIntoViewIfNeeded();
  await expect.poll(() => cards.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator(".home-principles").screenshot({ path: info.outputPath("illustrated-principles.png") });
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true })).toBeChecked();
  await page.keyboard.press("Escape");
});

test("desktop puzzle is centred on the homepage and dedicated page", async ({ page }) => {
  test.skip((page.viewportSize()?.width || 0) <= 760, "Mobile keeps its existing compact flow.");
  for (const route of ["/", "/paths-to-belonging"]) {
    await page.goto(route);
    const board = page.locator(".paths-world");
    await expect(board).toBeVisible();
    const bounds = await board.boundingBox();
    expect(bounds).not.toBeNull();
    const width = await page.evaluate(() => document.documentElement.clientWidth);
    expect(Math.abs(bounds!.x + bounds!.width / 2 - width / 2)).toBeLessThan(3);
  }
});
