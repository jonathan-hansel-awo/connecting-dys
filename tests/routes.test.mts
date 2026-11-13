import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { resolve } from "node:path";

const routes = [
  "/",
  "/about",
  "/support",
  "/community",
  "/contact",
  "/understand/dyslexia",
  "/understand/dyspraxia",
  "/understand/dyscalculia",
  "/understand/dysgraphia",
];
const documents = new Map<string, string>();
for (const route of routes)
  documents.set(
    route,
    await readFile(
      resolve(
        ".next/server/app",
        route === "/" ? "index.html" : route.slice(1) + ".html",
      ),
      "utf8",
    ),
  );
test("all nine routes contain complete, semantic HTML without JavaScript", () => {
  for (const [route, html] of documents) {
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${route}: one H1`);
    assert.equal(
      (html.match(/<main\b/g) || []).length,
      1,
      `${route}: one main`,
    );
    assert.ok(html.includes('id="main-content"'));
    assert.ok(html.includes("Connecting Dys"));
    assert.ok(!/registered charity/i.test(html));
  }
  const home = documents.get("/")!;
  assert.ok(home.includes("A home for"));
  assert.ok(home.includes("DYS mind."));
  for (const heading of [
    "Start with listening.",
    "Make space for understanding.",
    "Build it together.",
  ])
    assert.ok(home.includes(heading));
});
test("every internal content link and fragment has a generated destination", () => {
  for (const [route, html] of documents) {
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(href, `https://example.test${route}`);
      const dest = documents.get(url.pathname);
      assert.ok(dest, `${route}: missing ${href}`);
      if (url.hash)
        assert.ok(
          dest.includes(`id="${url.hash.slice(1)}"`),
          `${route}: missing anchor ${href}`,
        );
    }
  }
});
test("approved logo is available at the exact path used by the application", async () => {
  await access("public/brand/connecting_dys_logo.png");
  assert.ok(documents.get("/")!.includes("connecting_dys_logo.png"));
  assert.ok(!documents.get("/")!.includes("connecting-dys-logo.png"));
});
