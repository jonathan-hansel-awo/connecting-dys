export type DoodleRect = { x: number; y: number; width: number; height: number };
export type DoodleSize = { width: number; height: number; angle: number };
export type DoodlePlacement = DoodleRect & { index: number; centerX: number; centerY: number };

export function rotatedDoodleSize({ width, height, angle }: DoodleSize) {
  const radians = angle * Math.PI / 180;
  return {
    width: Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians)),
    height: Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians)),
  };
}

export function doodleIntersects(a: DoodleRect, b: DoodleRect, gap = 0) {
  return a.x < b.x + b.width + gap && a.x + a.width + gap > b.x &&
    a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
}

// A stable seed gives a scattered composition without hydration differences or
// jumping decorations. A crowded page gets fewer doodles, never less clearance.
export function placeDoodles(width: number, height: number, obstacles: DoodleRect[], words: DoodleSize[], seed: number, clearance = 8): DoodlePlacement[] {
  if (width <= 0 || height <= 0) return [];
  let state = seed >>> 0;
  const random = () => { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; return state / 4294967296; };
  const placed: DoodlePlacement[] = [];
  for (let index = 0; index < words.length; index++) {
    const size = rotatedDoodleSize(words[index]);
    const edge = 6;
    if (size.width + edge * 2 > width || size.height + edge * 2 > height) continue;
    for (let attempt = 0; attempt < 180; attempt++) {
      const x = edge + random() * (width - size.width - edge * 2);
      const y = edge + random() * (height - size.height - edge * 2);
      const candidate = { x, y, ...size };
      if (obstacles.some(rect => doodleIntersects(candidate, rect, clearance))) continue;
      if (placed.some(rect => doodleIntersects(candidate, rect, 22))) continue;
      placed.push({ ...candidate, index, centerX: x + size.width / 2, centerY: y + size.height / 2 });
      break;
    }
  }
  return placed;
}
