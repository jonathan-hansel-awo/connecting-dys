import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("chapter palettes stay distinct across reading backgrounds and themes", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const reading = page.getByRole("button", { name: "Reading settings", exact: true });
  for (const dark of [false, true]) {
    await reading.click();
    await page.getByRole("checkbox", { name: "Dark mode", exact: true }).setChecked(dark);
    for (const name of dark ? ["Warm navy", "Deep navy", "Slate blue", "Warm charcoal"] : ["Cream", "White", "Soft blue", "Soft peach"]) {
      await page.getByRole("button", { name, exact: true }).click();
      await page.keyboard.press("Escape");
      const colours = await page.evaluate(() => {
        const colour = (selector: string) => getComputedStyle(document.querySelector(selector)!).backgroundColor;
        return {
          reading: colour("body"),
          lightSheets: [".hero", "#explore", ".support", ".invitation"].map(colour),
          scenes: ["#recognition", ".about-home", ".site-footer"].map(colour),
          community: colour("#community"),
          chapter: colour(".connection-chapter"),
          lip: colour(".recognition-sheet"),
        };
      });
      expect(colours.lightSheets.every(c => c === colours.reading)).toBe(true);
      expect(colours.scenes.every(c => c !== colours.reading)).toBe(true);
      expect(colours.community).not.toBe(colours.reading);
      expect(colours.chapter).toBe(colours.community);
      expect(colours.lip).toBe(colours.scenes[0]);
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
      expect(result.violations, `${dark ? "dark" : "light"} ${name}`).toEqual([]);
      if (name === "White" || name === "Warm charcoal") {
        await page.locator("#recognition").scrollIntoViewIfNeeded();
        await page.screenshot({ path: info.outputPath(`${dark ? "dark" : "light"}-recognition.png`) });
      }
      await reading.click();
    }
    await page.keyboard.press("Escape");
  }
});
