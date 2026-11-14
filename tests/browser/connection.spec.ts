import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

async function ready(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Reading settings", exact: true }).click();
  await page.keyboard.press("Escape");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
}
async function scroll(page: Page, y: number) {
  await page.evaluate((top) => scrollTo(0, top), y);
  await page.waitForTimeout(550);
}
async function sampleBeat(page: Page, i: number) {
  return page.locator(".connection-chapter").nth(i).evaluate((el) => ({
    path: parseFloat(getComputedStyle(el.querySelector(".chapter-path")!).strokeDashoffset),
    node: getComputedStyle(el.querySelector(".chapter-node")!).transform,
    text: [...el.querySelectorAll("h3,p")].map((p) => ({ y: p.getBoundingClientRect().top + scrollY, transform: getComputedStyle(p).transform })),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
}

test("Phase 04 three chapter paths visibly develop with stationary reading content", async ({ page }, info) => {
  test.skip((page.viewportSize()?.height || 0) < 520, "Short screens get a complete static tableau.");
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await ready(page);
  const measurements = [];
  for (let i = 0; i < 3; i++) {
    const beat = page.locator(".connection-chapter").nth(i);
    const box = await beat.evaluate((el) => ({ top: el.getBoundingClientRect().top + scrollY, height: el.getBoundingClientRect().height, vh: innerHeight }));
    const start = box.top - box.vh * .85;
    const distance = box.height + box.vh * .45;
    await scroll(page, start + distance * .04);
    const early = await sampleBeat(page, i);
    await scroll(page, start + distance * .96);
    const late = await sampleBeat(page, i);
    expect(early.path - late.path).toBeGreaterThan(.75);
    expect(early.node).not.toBe(late.node);
    for (let n = 0; n < early.text.length; n++) {
      expect(Math.abs(early.text[n].y - late.text[n].y)).toBeLessThan(1);
      expect(late.text[n].transform).toBe("none");
    }
    expect(late.overflow).toBeLessThanOrEqual(1);
    await scroll(page, box.top - 150);
    await page.screenshot({ path: info.outputPath(`connection-beat-${i + 1}.png`) });
    measurements.push({ early, late });
  }
  await expect(page.locator(".pin-spacer .connection-chapter")).toHaveCount(0);
  await expect(page.locator(".pin-spacer a,.pin-spacer button")).toHaveCount(0);
  await info.attach("connection-measurements", { body: JSON.stringify(measurements, null, 2), contentType: "application/json" });
  expect(errors).toEqual([]);
});

test("Phase 04 artwork pauses while the first portrait chapter overlaps in front", async ({ page }, info) => {
  const { width, height } = page.viewportSize()!;
  test.skip(width > 699 || height < 650, "The stacking reveal is portrait-only; desktop has a separate artwork pin.");
  await ready(page);
  await expect(page.locator("#community .pin-spacer")).toHaveCount(1);
  const geometry = await page.evaluate(() => {
    const art = document.querySelector(".connection-visual")!.getBoundingClientRect();
    const chapter = document.querySelector(".connection-chapter")!.getBoundingClientRect();
    const inset = document.querySelector(".site-header")!.getBoundingClientRect().height + 16;
    return { start: art.top + scrollY - inset, end: chapter.top + scrollY - inset, inset };
  });
  const sample = async (fraction: number) => {
    await scroll(page, geometry.start + (geometry.end - geometry.start) * fraction);
    return page.evaluate(() => ({
      art: document.querySelector(".connection-visual")!.getBoundingClientRect().top,
      chapter: document.querySelector(".connection-chapter")!.getBoundingClientRect().top,
    }));
  };
  const early = await sample(.15);
  await page.screenshot({ path: info.outputPath("overlap-early.png") });
  const late = await sample(.75);
  expect(Math.abs(early.art - late.art)).toBeLessThan(1);
  expect(Math.abs(late.art - geometry.inset)).toBeLessThan(2);
  expect(early.chapter - late.chapter).toBeGreaterThan(50);
  const front = await page.locator(".connection-chapter h3").first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
  });
  expect(front).toBe(true);
  await page.screenshot({ path: info.outputPath("overlap-late.png") });
  await page.getByRole("link", { name: "Help shape what’s next", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/get-involved$/);
  await page.goBack();
  await expect(page.locator("#community .pin-spacer")).toHaveCount(1);
  await info.attach("overlap-geometry", { body: JSON.stringify({ geometry, early, late }), contentType: "application/json" });
});

test("Phase 04 textures retain colour, persist across routes and flatten accessibly", async ({ page }, info) => {
  await ready(page);
  const trigger = page.getByRole("button", { name: "Reading settings", exact: true });
  await trigger.click();
  const style = page.getByRole("combobox", { name: "Texture style", exact: true });
  const enabled = page.getByRole("checkbox", { name: "Background texture", exact: true });
  for (const texture of ["paper", "linen", "plaster"]) {
    await style.selectOption(texture);
    const asset = texture === "paper" ? "fine-paper.svg" : `${texture}.svg`;
    for (const background of ["Cream", "White", "Soft blue", "Soft peach"]) {
      await page.getByRole("button", { name: background, exact: true }).click();
      const state = await page.evaluate(() => ({
        images: [...document.querySelectorAll("body,#community,.connection-chapter,.reading-dialog,.texture-preview")].map((el) => getComputedStyle(el).backgroundImage),
        body: getComputedStyle(document.body).backgroundColor,
        chapter: getComputedStyle(document.querySelector(".connection-chapter")!).backgroundColor,
      }));
      expect(state.images.every((image) => image.includes(asset))).toBe(true);
      expect(state.chapter).toBe(state.body);
    }
    await page.screenshot({ path: info.outputPath(`texture-${texture}.png`) });
  }
  await enabled.uncheck();
  await expect(style).toBeDisabled();
  await expect(page.locator("body")).toHaveCSS("background-image", "none");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-texture-style", "plaster");
  await expect(page.locator("html")).toHaveAttribute("data-texture", "off");
  await trigger.click();
  await enabled.check();
  await expect(style).toHaveValue("plaster");
  for (const font of ["Open Sans", "Arial", "Verdana", "Atkinson Hyperlegible", "OpenDyslexic"]) {
    await page.getByRole("combobox", { name: "Font family", exact: true }).selectOption(font);
    await page.evaluate(() => document.fonts.ready);
    expect(await page.locator("dialog").evaluate((el) => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
  }
  await page.getByRole("slider").press("End");
  await page.getByRole("combobox", { name: "Line spacing", exact: true }).selectOption("2");
  await page.getByRole("combobox", { name: "Letter spacing", exact: true }).selectOption("0.12");
  await page.keyboard.press("Escape");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  await page.locator("#community").scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("connection-spacious.png") });
  const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(audit.violations).toEqual([]);
  await page.getByRole("link", { name: "Help shape what’s next", exact: true }).click();
  await expect(page).toHaveURL(/\/get-involved$/);
  await expect(page.locator("html")).toHaveAttribute("data-texture-style", "plaster");
  await page.goBack();
  await trigger.click();
  await page.getByRole("button", { name: "Reset preferences", exact: true }).click();
  await expect(style).toHaveValue("paper");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".chapter-path").first()).toHaveCSS("stroke-dasharray", "none");
  await page.emulateMedia({ reducedMotion: "no-preference", forcedColors: "active" });
  await expect(page.locator("body")).toHaveCSS("background-image", "none");
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("Phase 04 scene rebuilds mid-passage without duplicate pins or a short-screen trap", async ({ page }) => {
  await ready(page);
  const viewport = page.viewportSize()!;
  await page.locator("#community").scrollIntoViewIfNeeded();
  const count = await page.locator("#community .pin-spacer").count();
  for (let n = 0; n < 2; n++) {
    await page.getByRole("button", { name: "Reading settings", exact: true }).click();
    const reduced = page.getByRole("checkbox", { name: "Reduce decorative motion", exact: true });
    await reduced.check();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await reduced.uncheck();
    await page.keyboard.press("Escape");
    await expect(page.locator("#community .pin-spacer")).toHaveCount(count);
  }
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(page.locator("#community .pin-spacer")).toHaveCount(0);
  await expect(page.locator(".chapter-path").first()).toHaveCSS("stroke-dasharray", "none");
  await page.setViewportSize(viewport);
  await expect(page.locator("#community .pin-spacer")).toHaveCount(count);
  await page.locator(".community-note a").focus();
  await expect(page.locator(".community-note a")).toBeFocused();
  const visible = await page.locator(".community-note a").evaluate((el) => {
    const r = el.getBoundingClientRect();
    return r.top >= document.querySelector(".site-header")!.getBoundingClientRect().bottom && r.bottom <= innerHeight;
  });
  expect(visible).toBe(true);
});
