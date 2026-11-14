import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Isolated lab run: never compete with the parallel functional browser matrix.
export default defineConfig({
  ...base,
  testDir: "./tests/performance",
  outputDir: "test-results/performance",
  workers: 1,
  timeout: 180_000,
  reporter: [["list"]],
  projects: [{ name: "chromium-lab", use: { viewport: { width: 1440, height: 900 } } }],
});
