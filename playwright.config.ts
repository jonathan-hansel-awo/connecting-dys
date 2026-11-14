import { defineConfig } from "@playwright/test";

// Uses the existing Playwright/axe dependencies; no new browser or motion stack.
// Build first. The runner owns its local production server and never deploys.
const baseURL = "http://127.0.0.1:3100";
export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 10_000 },
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL,
    browserName: "chromium",
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH }
      : {},
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "mobile-narrow", use: { viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true } },
    { name: "mobile-wide", use: { viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 }, hasTouch: true } },
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "phone-landscape", use: { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
    { name: "reflow-320", use: { viewport: { width: 320, height: 800 }, hasTouch: true } },
  ],
  webServer: {
    command: "npm start -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
