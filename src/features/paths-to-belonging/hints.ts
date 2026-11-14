import { evaluateBoard, quarterTurn } from "./engine.ts";
import { gardenRoutes, neighbourhoodRoutes, endingRoutes } from "./solutions.ts";
import type { Board, Chapter } from "./types.ts";

const witnesses: Record<string, readonly Board[]> = {
  "find-a-way": Object.values(gardenRoutes),
  "make-connections": Object.values(neighbourhoodRoutes),
  "build-belonging": Object.values(endingRoutes),
};
export type Hint = { readonly tileId: string; readonly text: string };

export function chooseHint(chapter: Chapter, board: Board, revealed: readonly string[]): Hint | null {
  if (evaluateBoard(chapter, board).complete) return null;
  const distance = (target: Board) => Object.keys(board).reduce((sum, id) => sum + quarterTurn(target[id] - board[id]), 0);
  const target = witnesses[chapter.id]?.reduce((closest, candidate) => distance(candidate) < distance(closest) ? candidate : closest);
  if (!target) return null;
  const different = chapter.tiles.filter((tile) => target[tile.id] !== undefined && target[tile.id] !== board[tile.id]);
  const useful = different.find((tile) => !revealed.includes(tile.id)) ?? different[(different.findIndex((tile) => tile.id === revealed.at(-1)) + 1) % different.length];
  return useful ? { tileId: useful.id, text: `Try turning the ${useful.name.charAt(0).toLowerCase() + useful.name.slice(1)}.` } : null;
}
