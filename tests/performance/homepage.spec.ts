import { test, expect } from "@playwright/test";
import fs from "node:fs/promises";

test("isolated cold-load LCP, CLS and transfer measurements", async ({ browser }, info) => {
  const profiles = [
    { name: "desktop", viewport: { width: 1440, height: 900 }, touch: false, cpu: 1, latency: 0, download: -1, upload: -1 },
    { name: "mobile-throttled", viewport: { width: 390, height: 844 }, touch: true, cpu: 4, latency: 70, download: 200_000, upload: 93_750 },
  ];
  const results = [];
  for (const profile of profiles) {
    for (let run = 1; run <= 3; run++) {
      const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.touch, hasTouch: profile.touch, baseURL: info.project.use.baseURL });
      try {
        const page = await context.newPage();
        await page.addInitScript(() => {
          const metrics = { lcp: 0, cls: 0, longTasks: [] as number[] };
          Object.assign(window, { __phase06Metrics: metrics });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries()) metrics.lcp = entry.startTime;
          }).observe({ type: "largest-contentful-paint", buffered: true });
          new PerformanceObserver(list => {
            for (const entry of list.getEntries() as (PerformanceEntry & { hadRecentInput: boolean; value: number })[]) {
              if (!entry.hadRecentInput) metrics.cls += entry.value;
            }
          }).observe({ type: "layout-shift", buffered: true });
          new PerformanceObserver(list => { metrics.longTasks.push(...list.getEntries().map(e => e.duration)); }).observe({ type: "longtask", buffered: true });
        });
        const session = await context.newCDPSession(page);
        await session.send("Network.enable");
        await session.send("Network.setCacheDisabled", { cacheDisabled: true });
        await session.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
        await session.send("Network.emulateNetworkConditions", { offline: false, latency: profile.latency, downloadThroughput: profile.download, uploadThroughput: profile.upload });
        await page.goto("/", { waitUntil: "networkidle" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(700);
        const metrics = await page.evaluate(() => {
          const m = (window as unknown as { __phase06Metrics: { lcp: number; cls: number; longTasks: number[] } }).__phase06Metrics;
          const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
          return { ...m, resources: resources.length, transferBytes: resources.reduce((n,r)=>n+r.transferSize,0), jsBytes: resources.filter(r=>r.initiatorType === "script").reduce((n,r)=>n+r.encodedBodySize,0), cssBytes: resources.filter(r=>r.name.endsWith(".css")).reduce((n,r)=>n+r.encodedBodySize,0), largestResources: [...resources].sort((a,b)=>b.transferSize-a.transferSize).slice(0,8).map(r=>({ path: new URL(r.name).pathname+new URL(r.name).search, bytes: r.transferSize, initiator: r.initiatorType })), lenis: document.documentElement.classList.contains("lenis") };
        });
        expect(metrics.lcp).toBeGreaterThan(0);
        expect(metrics.cls).toBeLessThanOrEqual(.1);
        if (profile.touch) expect(metrics.lenis).toBe(false);
        results.push({ profile: profile.name, run, ...metrics });
      } finally { await context.close(); }
    }
  }
  const report = { conditions: profiles, browser: browser.version(), note: "Local Chromium lab samples, cold browser cache (warm production image optimiser). Mobile: 4x CPU, 70ms latency, 200000 bytes/s download, 93750 bytes/s upload. CLS is conservatively summed; LCP is the last buffered candidate before interaction. These are not field Core Web Vitals or INP measurements.", samples: results };
  await fs.mkdir(info.outputPath(), { recursive: true });
  await fs.writeFile(info.outputPath("metrics.json"), JSON.stringify(report, null, 2));
  await info.attach("lab-metrics", { body: JSON.stringify(report, null, 2), contentType: "application/json" });
});
