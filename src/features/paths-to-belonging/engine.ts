import { directions } from "./types.ts";
import type { Board, Chapter, Connectivity, Direction, PathShape, QuarterTurn, Tile } from "./types.ts";

const shapePorts: Record<PathShape, readonly Direction[]> = {
  curve: ["north", "east"],
  straight: ["north", "south"],
  junction: ["north", "east", "west"],
};
const offsets = [[0, -1], [1, 0], [0, 1], [-1, 0]] as const;

export function quarterTurn(turns: number): QuarterTurn {
  if (!Number.isSafeInteger(turns)) throw new Error("Rotations must be whole quarter turns.");
  return ((turns % 4 + 4) % 4) as QuarterTurn;
}

export function rotatePorts(ports: readonly Direction[], turns: number): Direction[] {
  const rotation = quarterTurn(turns);
  const turned = new Set(ports.map((port) => directions[(directions.indexOf(port) + rotation) % 4]));
  return directions.filter((port) => turned.has(port));
}

export function isMovable(tile: Tile): boolean {
  return tile.kind === "path" && tile.rotatable;
}

export function tilePorts(tile: Tile, board: Board): readonly Direction[] {
  if (tile.kind === "landmark") return tile.ports;
  const rotation = tile.rotatable ? board[tile.id] : tile.orientation;
  if (rotation === undefined) throw new Error(`Missing rotation for ${tile.id}.`);
  return rotatePorts(shapePorts[tile.shape], rotation);
}

export function assertBoard(chapter: Chapter, board: Board): void {
  const movable = chapter.tiles.filter(isMovable);
  if (Object.keys(board).length !== movable.length) throw new Error("Board must contain exactly the movable paths.");
  for (const tile of movable) {
    if (!Object.hasOwn(board, tile.id) || ![0, 1, 2, 3].includes(board[tile.id])) {
      throw new Error(`Invalid rotation for ${tile.id}.`);
    }
  }
}

export function rotateTile(chapter: Chapter, board: Board, tileId: string): Board {
  assertBoard(chapter, board);
  const tile = chapter.tiles.find((item) => item.id === tileId);
  if (!tile || !isMovable(tile)) return board;
  return { ...board, [tileId]: quarterTurn(board[tileId] + 1) };
}

// Check authoring mistakes separately from solving; the exhaustive solver is test tooling.
export function validateChapter(chapter: Chapter): void {
  const ids = new Set<string>();
  const positions = new Set<string>();
  for (const tile of chapter.tiles) {
    const position = `${tile.x},${tile.y}`;
    if (!tile.id || !tile.name || ids.has(tile.id) || positions.has(position) ||
        !Number.isSafeInteger(tile.x) || !Number.isSafeInteger(tile.y)) {
      throw new Error(`Invalid or duplicate tile: ${tile.id}.`);
    }
    ids.add(tile.id);
    positions.add(position);
    if (tile.kind === "landmark") {
      if (!tile.ports.length || new Set(tile.ports).size !== tile.ports.length ||
          tile.ports.some((port) => !directions.includes(port))) throw new Error(`Invalid ports for ${tile.id}.`);
    } else if (!Object.hasOwn(shapePorts, tile.shape) || (!tile.rotatable && quarterTurn(tile.orientation) !== tile.orientation)) {
      throw new Error(`Invalid path: ${tile.id}.`);
    }
  }
  if (chapter.requiredLandmarks.length < 2 || new Set(chapter.requiredLandmarks).size !== chapter.requiredLandmarks.length ||
      chapter.requiredLandmarks.some((id) => !chapter.tiles.some((tile) => tile.id === id && tile.kind === "landmark"))) {
    throw new Error("Required places must be distinct landmarks.");
  }
  if (!chapter.arrangements.length || new Set(chapter.arrangements.map(({ id }) => id)).size !== chapter.arrangements.length) {
    throw new Error("Starting arrangements must be present and distinct.");
  }
  for (const arrangement of chapter.arrangements) assertBoard(chapter, arrangement.board);
  const endingIds = new Set<string>();
  for (const ending of chapter.endings) {
    if (endingIds.has(ending.id)) throw new Error("Ending IDs must be distinct.");
    endingIds.add(ending.id);
    for (const [from, to] of ending.connections) {
      const a = chapter.tiles.find(({ id }) => id === from);
      const b = chapter.tiles.find(({ id }) => id === to);
      if (!a || !b || Math.abs(a.x - b.x) + Math.abs(a.y - b.y) !== 1) throw new Error("Ending edges must join adjacent tiles.");
    }
  }
  if (chapter.endings.length && (chapter.endings.at(-1)!.connections.length ||
      chapter.endings.slice(0, -1).some((ending) => !ending.connections.length))) {
    throw new Error("Only the final ending rule may be the fallback.");
  }
}

// Cache only static topology in this closure. Each evaluation returns fresh data.
export function createBoardEvaluator(chapter: Chapter): (board: Board) => Connectivity {
  const { tiles, requiredLandmarks } = chapter;
  const positions = new Map(tiles.map((tile, index) => [`${tile.x},${tile.y}`, index]));
  const neighbours = tiles.map((tile) => offsets.map(([dx, dy]) => positions.get(`${tile.x + dx},${tile.y + dy}`)));
  const portMasks = tiles.map((tile) => [0, 1, 2, 3].map((rotation) => {
    const ports = tile.kind === "landmark" ? tile.ports : rotatePorts(shapePorts[tile.shape], tile.rotatable ? rotation : tile.orientation);
    return ports.reduce((mask, port) => mask | (1 << directions.indexOf(port)), 0);
  }));
  const source = tiles.findIndex(({ id }) => id === requiredLandmarks[0]);
  if (source < 0) throw new Error("The source landmark is missing.");

  return (board) => {
    assertBoard(chapter, board);
    const masks = tiles.map((tile, index) => portMasks[index][isMovable(tile) ? board[tile.id] : 0]);
    const adjacency = tiles.map(() => [] as number[]);
    const connections: [string, string][] = [];
    tiles.forEach((tile, index) => {
      // East and south consider each physical edge exactly once.
      for (const direction of [1, 2]) {
        const next = neighbours[index][direction];
        if (next === undefined || !(masks[index] & (1 << direction)) || !(masks[next] & (1 << ((direction + 2) % 4)))) continue;
        adjacency[index].push(next);
        adjacency[next].push(index);
        connections.push([tile.id, tiles[next].id]);
      }
    });
    const visited = new Set([source]);
    const queue = [source];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      for (const next of adjacency[queue[cursor]]) {
        if (!visited.has(next)) { visited.add(next); queue.push(next); }
      }
    }
    const reachable = tiles.filter((_, index) => visited.has(index)).map(({ id }) => id);
    const connectedLandmarks = requiredLandmarks.filter((id) => reachable.includes(id));
    const complete = connectedLandmarks.length === requiredLandmarks.length;
    const endingId = complete ? chapter.endings.find((ending) => ending.connections.every(([a, b]) =>
      reachable.includes(a) && connections.some(([from, to]) => (from === a && to === b) || (from === b && to === a)),
    ))?.id ?? null : null;
    return { connections, reachable, connectedLandmarks, complete, endingId };
  };
}

export function evaluateBoard(chapter: Chapter, board: Board): Connectivity {
  return createBoardEvaluator(chapter)(board);
}
