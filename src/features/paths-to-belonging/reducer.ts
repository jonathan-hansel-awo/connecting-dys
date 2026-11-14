import { chapters } from "./chapters.ts";
import { evaluateBoard, isMovable, rotateTile } from "./engine.ts";
import type { Board, Chapter } from "./types.ts";

export type JourneyStatus = "idle" | "playing" | "complete" | "skipped" | "finished";
export type JourneyState = {
  readonly status: JourneyStatus;
  readonly chapterId: string;
  readonly arrangementIndex: number;
  readonly board: Board;
  readonly history: readonly Board[];
  readonly hintsRevealed: readonly string[];
  readonly endingId: string | null;
};
export type JourneyAction =
  | { readonly type: "start" | "undo" | "restart" | "skip" | "continue" | "exit" | "replay" }
  | { readonly type: "rotate"; readonly tileId: string }
  | { readonly type: "hint"; readonly tileId: string };

function enterChapter(chapter: Chapter, arrangementIndex: number, status: JourneyStatus = "playing"): JourneyState {
  const board = { ...chapter.arrangements[arrangementIndex % chapter.arrangements.length].board };
  return { status, chapterId: chapter.id, arrangementIndex, board, history: [], hintsRevealed: [], endingId: null };
}

export function createJourneyState(): JourneyState {
  return enterChapter(chapters[0], 0, "idle");
}

// No DOM, timers, randomness, storage or reading-preference dependency.
// Presentation will own focus and announcements when it consumes this reducer.
export function journeyReducer(state: JourneyState, action: JourneyAction): JourneyState {
  const chapterIndex = chapters.findIndex(({ id }) => id === state.chapterId);
  const chapter = chapters[chapterIndex];
  const active = state.status === "playing" || state.status === "complete";
  switch (action.type) {
    case "start":
      return state.status === "idle" ? enterChapter(chapters[0], state.arrangementIndex) : state;
    case "exit":
      return state.status === "idle" ? state : enterChapter(chapters[0], state.arrangementIndex, "idle");
    case "replay":
      return state.status === "finished" ? enterChapter(chapters[0], state.arrangementIndex + 1) : state;
    case "rotate": {
      if (!active) return state;
      const board = rotateTile(chapter, state.board, action.tileId);
      if (board === state.board) return state;
      const result = evaluateBoard(chapter, board);
      return { ...state, board, history: [...state.history, state.board], status: result.complete ? "complete" : "playing", endingId: result.endingId };
    }
    case "undo": {
      if (!active || !state.history.length) return state;
      const board = state.history[state.history.length - 1];
      const result = evaluateBoard(chapter, board);
      return { ...state, board, history: state.history.slice(0, -1), status: result.complete ? "complete" : "playing", endingId: result.endingId };
    }
    case "restart":
      return active || state.status === "skipped" ? enterChapter(chapter, state.arrangementIndex) : state;
    case "hint":
      // A hint only records a useful piece supplied by the hint selector; it never moves it.
      return state.status === "playing" && chapter.tiles.some((tile) => tile.id === action.tileId && isMovable(tile)) && !state.hintsRevealed.includes(action.tileId)
        ? { ...state, hintsRevealed: [...state.hintsRevealed, action.tileId] } : state;
    case "skip":
      return state.status === "playing" ? { ...state, status: "skipped", endingId: null } : state;
    case "continue":
      if (state.status !== "complete" && state.status !== "skipped") return state;
      return chapterIndex === chapters.length - 1
        ? { ...state, status: "finished" }
        : enterChapter(chapters[chapterIndex + 1], state.arrangementIndex);
  }
}
