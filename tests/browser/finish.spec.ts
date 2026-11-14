import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
}
async function scroll(page: Page, top: number) {
  await page.evaluate((y) => scrollTo(0, y), top);
  await page.waitForTimeout(500);
}
const home = "main[data-home-story]";

test("Phase 05 surfaces arrive and finale paths converge without animating reading targets", async ({ page }, info) => {
  test.skip((page.viewportSize()?.height || 0) < 520, "Short screens retain the complete static finish.");
  await ready(page);
  const samples = [];
  for (const [target, trigger] of [[".support-surface", ".support-links"], [".about-frame-edge", ".about-logo-frame"]]) {
    const top = await page.locator(trigger).evaluate((el) => el.getBoundingClientRect().top + scrollY);
    await scroll(page, top - page.viewportSize()!.height * .88);
    const before = await page.locator(target).evaluate((el) => Number(getComputedStyle(el).opacity));
    await scroll(page, top - page.viewportSize()!.height * .53);
    const after = await page.locator(target).evaluate((el) => Number(getComputedStyle(el).opacity));
    expect(after - before).toBeGreaterThan(.5);
    samples.push({ target, before, after });
  }
  const geometry = await page.locator(".invitation").evaluate((el) => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height, vh: innerHeight }));
  const sample = async (fraction: number) => {
    await scroll(page, geometry.top - geometry.vh * .9 + (geometry.height - geometry.vh * .05) * fraction);
    return page.evaluate(() => ({
      paths: [...document.querySelectorAll(".finale-path")].map((el) => Number.parseFloat(getComputedStyle(el).strokeDashoffset)),
      targets: [...document.querySelectorAll(".support-links a,.about-copy,.approved-logo-image,.invitation h2,.invitation .button")].map((el) => ({ y: el.getBoundingClientRect().top + scrollY, transform: getComputedStyle(el).transform, opacity: getComputedStyle(el).opacity })),
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    }));
  };
  const early = await sample(.04);
  const late = await sample(.96);
  for (let i = 0; i < early.paths.length; i++) expect(early.paths[i] - late.paths[i]).toBeGreaterThan(.7);
  for (let i = 0; i < early.targets.length; i++) {
    expect(Math.abs(early.targets[i].y - late.targets[i].y)).toBeLessThan(1);
    expect(late.targets[i].transform).toBe("none");
    expect(late.targets[i].opacity).toBe("1");
  }
  expect(late.overflow).toBeLessThanOrEqual(1);
  for (const selector of [".support", ".about-home", ".invitation"]) {
    await page.locator(selector).scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath(`${selector.slice(1)}.png`) });
  }
  await info.attach("finish-geometry", { body: JSON.stringify({ samples, geometry, early, late }, null, 2), contentType: "application/json" });
});

test("Phase 05 every practical and closing CTA works with unobscured keyboard focus", async ({ page }) => {
  await ready(page);
  for (const [selector, destination, title] of [
    [".support-links a:nth-of-type(1)", "/support", "Information & support"],
    [".support-links a:nth-of-type(2)", "/get-involved", "Help shape what comes next"],
    [".support-links a:nth-of-type(3)", "/contact", "A hello is a good place to start."],
    [".about-copy .text-link", "/about", "Our story"],
    [".invitation .button", "/contact", "A hello is a good place to start."],
  ]) {
    const link = page.locator(`${home} ${selector}`);
    await link.focus();
    const visible = await link.evaluate((el) => {
      const r = el.getBoundingClientRect();
      const x = r.x + r.width / 2;
      const y = Math.max(document.querySelector(".site-header")!.getBoundingClientRect().bottom + 5, Math.min(innerHeight - 5, r.y + r.height / 2));
      return { front: el.contains(document.elementFromPoint(x, y)), height: r.height };
    });
    expect(visible.front, selector).toBe(true);
    expect(visible.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${destination}$`));
    await expect(page.getByRole("heading", { name: title, level: 1, exact: true })).toBeVisible();
    await expect(page).toHaveTitle(`${title} | Connecting Dys`);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await expect(page).toHaveTitle("Connecting Dys | A home for every DYS mind.");
  }
  await page.locator(`${home} .back-top`).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(home)).toBeFocused();
  const anchor = await page.locator(home).evaluate((el) => ({ top: el.getBoundingClientRect().top, header: document.querySelector(".site-header")!.getBoundingClientRect().bottom, padding: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) }));
  expect(anchor.top).toBeGreaterThanOrEqual(anchor.header);
  expect(anchor.top).toBeLessThanOrEqual(anchor.padding + 1);
});

test("Phase 05 finish keeps reading colours, textures and static accessible alternatives", async ({ page }, info) => {
  await ready(page);
  const trigger = page.getByRole("button", { name: "Reading settings", exact: true });
  await trigger.click();
  await page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true }).check();
  await expect(page.locator(".finale-path").first()).toHaveCSS("stroke-dasharray", "none");
  for (const texture of ["paper", "linen", "plaster"]) {
    await page.getByRole("combobox", { name: "Texture style", exact: true }).selectOption(texture);
    for (const background of ["Cream", "White", "Soft blue", "Soft peach"]) {
      await page.getByRole("button", { name: background, exact: true }).click();
      const state = await page.evaluate(() => ({
        colours: [...document.querySelectorAll("body,.support-surface,.invitation")].map((el) => getComputedStyle(el).backgroundColor),
        grain: getComputedStyle(document.querySelector(".support-surface")!).backgroundImage,
        path: getComputedStyle(document.querySelector(".finale-path")!).strokeDasharray,
      }));
      expect(new Set(state.colours).size).toBe(1);
      expect(state.grain).toContain(texture === "paper" ? "fine-paper.svg" : `${texture}.svg`);
      expect(state.path).toBe("none");
    }
  }
  await page.getByRole("checkbox", { name: "Background texture", exact: true }).uncheck();
  for (const selector of [".support-surface", ".about-frame-edge"]) await expect(page.locator(selector)).toHaveCSS("box-shadow", "none");
  await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption("OpenDyslexic");
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await page.keyboard.press("Escape");
  await expect(page.locator(".invitation-decoration")).toBeHidden();
  await expect(page.locator(home)).not.toHaveAttribute("data-section-stack");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator(".invitation").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("finish-spacious.png") });
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
});
