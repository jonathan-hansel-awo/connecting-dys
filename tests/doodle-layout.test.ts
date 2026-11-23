import test from "node:test";
import assert from "node:assert/strict";
import { doodleIntersects, placeDoodles, rotatedDoodleSize } from "../src/lib/doodle-layout.ts";

test("scattered word bounds include rotation rather than just unrotated text", () => {
  assert.deepEqual(rotatedDoodleSize({ width: 120, height: 20, angle: 0 }), { width: 120, height: 20 });
  const diagonal = rotatedDoodleSize({ width: 120, height: 20, angle: 45 });
  assert.ok(diagonal.height > 98 && diagonal.height < 100);
  assert.ok(Math.abs(diagonal.height - diagonal.width) < 1e-10);
});

test("decorations stay outside cards, artwork and each other across responsive layouts", () => {
  for (const width of [320, 360, 430, 768, 1440]) {
    const height = 2800;
    const margin = width < 600 ? 18 : 130;
    const obstacles = [
      { x: margin, y: 100, width: width - margin * 2, height: 480 },
      { x: margin, y: 730, width: width - margin * 2, height: 700 },
      { x: margin, y: 1620, width: width - margin * 2, height: 450 },
      { x: margin, y: 2200, width: width - margin * 2, height: 400 },
      { x: width / 2 - 80, y: 600, width: 160, height: 60 },
    ];
    const words = Array.from({ length: 30 }, (_, i) => ({ width: width < 600 ? 80 : 125, height: 20, angle: [0, 20, -30, 45][i % 4] }));
    const placements = placeDoodles(width, height, obstacles, words, 451, 12);
    assert.ok(placements.length >= 3, `${width}: words appear in available background space`);
    assert.deepEqual(placeDoodles(width, height, obstacles, words, 451, 12), placements, "the composition is stable on repeat layout");
    for (const placement of placements) {
      assert.ok(placement.x >= 6 && placement.y >= 6);
      assert.ok(placement.x + placement.width <= width - 6);
      assert.ok(placement.y + placement.height <= height - 6);
      assert.ok(obstacles.every(rect => !doodleIntersects(placement, rect, 12)), `${width}: foreground overlap`);
      assert.ok(placements.every(other => other === placement || !doodleIntersects(placement, other, 22)), `${width}: doodles overlap each other`);
    }
  }
});

test("crowded and enlarged reading layouts omit decorations rather than covering content", () => {
  const word = { width: 160, height: 32, angle: 40 };
  assert.deepEqual(placeDoodles(320, 800, [{ x: 0, y: 0, width: 320, height: 800 }], [word], 7), []);
  assert.deepEqual(placeDoodles(100, 30, [], [word], 7), []);
  assert.deepEqual(placeDoodles(0, 800, [], [word], 7), []);
});
