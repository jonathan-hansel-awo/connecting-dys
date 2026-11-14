import { test, expect } from "@playwright/test";

for (const input of ["mouse", "touch"]) test(`${input} activation on a held sheet keeps the target still through click dispatch`, async ({ page }, info) => {
  test.skip(input === "touch" && !info.project.use.hasTouch, "Touch input is covered in the touch viewport projects.");
  test.skip((page.viewportSize()?.height || 0) < 650, "Short screens do not hold sheets.");
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.mouse.wheel(0, 1);
  await page.waitForTimeout(300);
  await expect(page.locator("main[data-home-story]")).toHaveAttribute("data-section-stack", "on");
  const top = await page.locator(".hero").evaluate((sheet) => {
    const main = sheet.parentElement!;
    delete main.dataset.sectionStack;
    const start = sheet.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(sheet).getPropertyValue("--sheet-top"));
    main.dataset.sectionStack = "on";
    return start + 50;
  });
  await page.evaluate((y) => scrollTo(0, y), top);
  await page.waitForTimeout(500);
  const link = page.locator(".hero-bottom a");
  const before = await link.boundingBox();
  expect(before).not.toBeNull();
  // Real down/up is intentional: Locator.click can retry after a moving
  // target, masking precisely the failed first click reported by this test.
  const x = before!.x + 20;
  const y = before!.y + before!.height / 2;
  if (input === "touch") {
    await page.touchscreen.tap(x, y);
  } else {
    await page.mouse.move(x, y);
    await page.mouse.down();
    const held = await link.boundingBox();
    expect(Math.abs(held!.y - before!.y)).toBeLessThan(1);
    await page.mouse.up();
  }
  await expect(page).toHaveURL(/#recognition$/);
  const target = await page.locator("#recognition").boundingBox();
  const header = await page.locator(".site-header").boundingBox();
  expect(target!.y).toBeGreaterThanOrEqual(header!.height - 1);
  await page.locator(".back-top").click();
  await expect(page.locator("main[data-home-story]")).toBeFocused();
  await page.mouse.wheel(0, 1);
  await expect(page.locator("main[data-home-story]")).toHaveAttribute("data-section-stack", "on");
});
