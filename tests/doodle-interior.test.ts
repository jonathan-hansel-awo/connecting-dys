import test from "node:test";
import assert from "node:assert/strict";
import { placeDoodles, doodleIntersects } from "../src/lib/doodle-layout.ts";

test("interior decoration prefers central whitespace while retaining full clearance", () => {
  const obstacles = [{ x: 250, y: 200, width: 500, height: 300 }];
  const words = Array.from({ length: 12 }, () => ({ width: 120, height: 24, angle: 6 }));
  const placed = placeDoodles(1000, 900, obstacles, words, 733, 24, true);
  assert.ok(placed.length > 0);
  assert.ok(placed.some(word => word.centerX > 200 && word.centerX < 800));
  assert.ok(placed.every(word => obstacles.every(obstacle => !doodleIntersects(word, obstacle, 24))));
  assert.deepEqual(placed, placeDoodles(1000, 900, obstacles, words, 733, 24, true));
});
