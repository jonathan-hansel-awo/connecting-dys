import { createBoardEvaluator, isMovable, rotatePorts, tilePorts, validateChapter } from "./engine.ts";
import type { Board, Chapter, QuarterTurn } from "./types.ts";

export type SolverResult = {
  readonly solutions: readonly Board[];
  readonly evaluated: number;
  readonly totalConfigurations: number;
  readonly exhaustive: boolean;
};

// Offline authoring/test tool: no imports from the runtime reducer or homepage.
// Distinct port orientations collapse the two identical halves of a straight.
export function solveChapter(chapter: Chapter, maxConfigurations = 100_000): SolverResult {
  validateChapter(chapter);
  if (!Number.isSafeInteger(maxConfigurations) || maxConfigurations < 1) throw new Error("A positive solver budget is required.");
  const pieces = chapter.tiles.filter(isMovable);
  const choices = pieces.map((tile) => {
    const base = tilePorts(tile, chapter.arrangements[0].board);
    const seen = new Set<string>();
    return ([0, 1, 2, 3] as const).filter((turn) => {
      // Use canonical orientation zero, regardless of the starting arrangement.
      const key = rotatePorts(base, turn - chapter.arrangements[0].board[tile.id]).join(",");
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
  const totalConfigurations = choices.reduce((total, options) => total * options.length, 1);
  const evaluate = createBoardEvaluator(chapter);
  const solutions: Board[] = [];
  const working: Record<string, QuarterTurn> = {};
  let evaluated = 0;
  function visit(index: number): void {
    if (evaluated >= maxConfigurations) return;
    if (index === pieces.length) {
      evaluated++;
      if (evaluate(working).complete) solutions.push({ ...working });
      return;
    }
    for (const turn of choices[index]) {
      working[pieces[index].id] = turn;
      visit(index + 1);
    }
  }
  visit(0);
  return { solutions, evaluated, totalConfigurations, exhaustive: evaluated === totalConfigurations };
}
