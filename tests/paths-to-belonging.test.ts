import test from "node:test";
import assert from "node:assert/strict";
import { chapters } from "../src/features/paths-to-belonging/chapters.ts";
import { assertBoard, createBoardEvaluator, evaluateBoard, isMovable, quarterTurn, rotatePorts, rotateTile, tilePorts, validateChapter } from "../src/features/paths-to-belonging/engine.ts";
import { createJourneyState, journeyReducer } from "../src/features/paths-to-belonging/reducer.ts";
import type { JourneyState } from "../src/features/paths-to-belonging/reducer.ts";
import { solveChapter } from "../src/features/paths-to-belonging/solver.ts";
import type { Board, Chapter } from "../src/features/paths-to-belonging/types.ts";
import { endingRoutes, gardenRoutes, neighbourhoodRoutes } from "./fixtures/paths-to-belonging.ts";
import { chooseHint } from "../src/features/paths-to-belonging/hints.ts";

function deepFreeze(value: object): void {
  Object.freeze(value);
  for (const item of Object.values(value)) if (item && typeof item === "object" && !Object.isFrozen(item)) deepFreeze(item);
}
deepFreeze(chapters);

test("one-step hints guide every curated start to a solution without modifying choices", () => {
  for (const chapter of chapters) {
    for (const arrangement of chapter.arrangements) {
      let board = arrangement.board;
      const original = { ...board };
      const revealed: string[] = [];
      for (let moves = 0; !evaluateBoard(chapter, board).complete; moves++) {
        assert.ok(moves < 24, "hints converge even after arbitrary clockwise turns");
        const hint = chooseHint(chapter, board, revealed)!;
        assert.ok(hint?.text.startsWith("Try turning"));
        assert.equal(isMovable(chapter.tiles.find(({ id }) => id === hint.tileId)!), true);
        assert.deepEqual(arrangement.board, original, "a hint never changes the seed");
        revealed.push(hint.tileId);
        board = rotateTile(chapter, board, hint.tileId);
      }
      assert.equal(chooseHint(chapter, board, revealed), null);
    }
  }
});

test("asking for another hint rotates its target and preserves board/history", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  const first = chooseHint(chapters[0], state.board, [])!;
  state = journeyReducer(state, { type: "hint", tileId: first.tileId });
  const next = chooseHint(chapters[0], state.board, state.hintsRevealed)!;
  assert.notEqual(next.tileId, first.tileId);
  state = journeyReducer(state, { type: "hint", tileId: next.tileId });
  state = journeyReducer(state, { type: "hint", tileId: first.tileId });
  assert.equal(state.hintsRevealed.at(-1), first.tileId);
  assert.equal(state.history.length, 0);
  assert.deepEqual(state.board, chapters[0].arrangements[0].board);
});

function turnTo(state: JourneyState, target: Board): JourneyState {
  for (const [tileId, orientation] of Object.entries(target)) {
    for (let turns = 0; state.board[tileId] !== orientation; turns++) {
      assert.ok(turns < 4, `Unable to turn ${tileId}`);
      state = journeyReducer(state, { type: "rotate", tileId });
    }
  }
  return state;
}

test("quarter turns snap clockwise, wrap, invert and reject fractional rotations", () => {
  assert.deepEqual(rotatePorts(["north", "east"], 1), ["east", "south"]);
  assert.deepEqual(rotatePorts(["north", "east"], -1), ["north", "west"]);
  assert.deepEqual(rotatePorts(["north", "east"], 4), ["north", "east"]);
  assert.equal(quarterTurn(-5), 3);
  for (const bad of [0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => quarterTurn(bad));
});

test("curves, straight bridges and junctions expose the specified ports", () => {
  const first = chapters[0];
  const bridge = first.tiles.find(({ id }) => id === "garden-bridge")!;
  assert.deepEqual(tilePorts(bridge, {}), ["east", "west"]);
  const curve = first.tiles.find(({ id }) => id === "willow-bend")!;
  assert.deepEqual(tilePorts(curve, { "willow-bend": 2 }), ["south", "west"]);
  const junction = chapters[1].tiles.find(({ id }) => id === "courtyard")!;
  assert.deepEqual(tilePorts(junction, { courtyard: 3 }), ["north", "south", "west"]);
  assert.throws(() => tilePorts(curve, {}));
});

const tinyChapter: Chapter = {
  id: "test", name: "Test", objective: "Join the places", completion: "Connected",
  tiles: [
    { id: "home", name: "Home", kind: "landmark", motif: "home", ports: ["east"], x: 0, y: 0 },
    { id: "bend", name: "Junction", kind: "path", shape: "junction", rotatable: true, x: 1, y: 0 },
    { id: "garden", name: "Garden", kind: "landmark", motif: "garden", ports: ["west"], x: 2, y: 0 },
  ],
  requiredLandmarks: ["home", "garden"],
  arrangements: [{ id: "start", name: "Start", board: { bend: 1 } }], endings: [],
};

test("connectivity needs adjacent, reciprocal ports and ignores dangling exits", () => {
  assert.equal(evaluateBoard(tinyChapter, { bend: 0 }).complete, true, "north branch may dangle");
  const broken = evaluateBoard(tinyChapter, { bend: 1 });
  assert.equal(broken.complete, false, "garden's facing port alone does not connect home");
  assert.deepEqual(broken.connectedLandmarks, ["home"]);
  assert.deepEqual(broken.reachable, ["home"]);
  const distant = { ...tinyChapter, tiles: tinyChapter.tiles.map((tile) => tile.id === "garden" ? { ...tile, x: 3 } : tile) };
  const diagonal = { ...tinyChapter, tiles: tinyChapter.tiles.map((tile) => tile.id === "garden" ? { ...tile, y: 1 } : tile) };
  assert.equal(evaluateBoard(distant, { bend: 0 }).complete, false, "no jumping over empty positions");
  assert.equal(evaluateBoard(diagonal, { bend: 0 }).complete, false, "no diagonal matching");
});

test("an unrelated matched cycle cannot satisfy required landmarks; traversal is undirected", () => {
  const isolatedCycle: Chapter = { ...chapters[0], tiles: [
    ...chapters[0].tiles,
    ...[ [4, 0, 1], [5, 0, 2], [4, 1, 0], [5, 1, 3] ].map(([x, y, orientation], i) => ({ id: `loop-${i}`, name: `Loop ${i}`, kind: "path" as const, shape: "curve" as const, rotatable: false as const, x, y, orientation: quarterTurn(orientation) })),
  ] };
  assert.equal(evaluateBoard(isolatedCycle, chapters[0].arrangements[0].board).complete, false);
  assert.equal(evaluateBoard(isolatedCycle, gardenRoutes.upper).complete, true, "optional disconnected pieces are allowed");
  const forward = evaluateBoard(chapters[0], gardenRoutes.upper);
  const reversed = evaluateBoard({ ...chapters[0], tiles: [...chapters[0].tiles].reverse(), requiredLandmarks: ["garden", "home"] }, gardenRoutes.upper);
  assert.deepEqual(new Set(reversed.reachable), new Set(forward.reachable));
});

test("only places joined to another place light up, including pairs outside the home network", () => {
  assert.deepEqual(evaluateBoard(tinyChapter, { bend: 0 }).pairedLandmarks, ["home", "garden"]);
  assert.deepEqual(evaluateBoard(tinyChapter, { bend: 1 }).pairedLandmarks, [], "an isolated starting home does not light up");
  const remotePair: Chapter = { ...tinyChapter, tiles: [
    ...tinyChapter.tiles,
    { id: "neighbour", name: "Neighbour", kind: "landmark", motif: "home", ports: ["east"], x: 5, y: 0 },
    { id: "remote-path", name: "Remote path", kind: "path", shape: "straight", rotatable: true, x: 6, y: 0 },
    { id: "heart", name: "Heart", kind: "landmark", motif: "heart", ports: ["west"], x: 7, y: 0 },
  ], arrangements: [{ id: "start", name: "Start", board: { bend: 1, "remote-path": 1 } }] };
  const result = evaluateBoard(remotePair, remotePair.arrangements[0].board);
  assert.deepEqual(result.pairedLandmarks, ["neighbour", "heart"]);
  assert.deepEqual(result.connectedLandmarks, ["home"], "lighting another pair cannot complete the home objective");
  assert.equal(result.complete, false);
  assert.deepEqual(evaluateBoard(remotePair, { bend: 1, "remote-path": 0 }).pairedLandmarks, [], "breaking the path switches both places off");
});

test("rotation changes only movable pieces and board/history snapshots stay immutable", () => {
  const chapter = chapters[0];
  const board = chapter.arrangements[0].board;
  assert.strictEqual(rotateTile(chapter, board, "home"), board);
  assert.strictEqual(rotateTile(chapter, board, "garden-bridge"), board);
  assert.strictEqual(rotateTile(chapter, board, "unknown"), board);
  let rotated = board;
  for (let i = 0; i < 4; i++) rotated = rotateTile(chapter, rotated, "willow-bend");
  assert.deepEqual(rotated, board);
  assert.notStrictEqual(rotated, board);
  assert.throws(() => assertBoard(chapter, {}));
  assert.throws(() => assertBoard(chapter, { ...board, home: 0 }));
  assert.throws(() => assertBoard(chapter, { ...board, "willow-bend": 4 } as unknown as Board));
});

test("authoring validation rejects overlapping tiles, bad landmarks, seeds and ending rules", () => {
  validateChapter(tinyChapter);
  assert.throws(() => validateChapter({ ...tinyChapter, tiles: [...tinyChapter.tiles, tinyChapter.tiles[0]] }));
  assert.throws(() => validateChapter({ ...tinyChapter, requiredLandmarks: ["home", "bend"] }));
  assert.throws(() => validateChapter({ ...tinyChapter, requiredLandmarks: ["home", "home"] }));
  assert.throws(() => validateChapter({ ...tinyChapter, arrangements: [] }));
  assert.throws(() => validateChapter({ ...tinyChapter, arrangements: [{ id: "bad", name: "Bad", board: {} }] }));
  assert.throws(() => validateChapter({ ...tinyChapter, endings: [{ id: "bad", name: "Bad", motif: "heart", connections: [["home", "garden"]] }] }));
  assert.throws(() => validateChapter({ ...tinyChapter, endings: [{ id: "no-fallback", name: "Missing fallback", motif: "home", connections: [["home", "bend"]] }] }));
});

test("authored example solutions use distinct routes and all ending patterns", () => {
  for (const board of Object.values(gardenRoutes)) assert.equal(evaluateBoard(chapters[0], board).complete, true);
  assert.notDeepEqual(evaluateBoard(chapters[0], gardenRoutes.upper).connections, evaluateBoard(chapters[0], gardenRoutes.lower).connections);
  for (const board of Object.values(neighbourhoodRoutes)) assert.equal(evaluateBoard(chapters[1], board).complete, true);
  for (const [endingId, board] of Object.entries(endingRoutes)) {
    const result = evaluateBoard(chapters[2], board);
    assert.equal(result.complete, true);
    assert.equal(result.endingId, endingId);
    assert.equal(evaluateBoard(chapters[2], { ...board, "heart-junction": 0 }).endingId, null);
  }
  assert.equal(evaluateBoard(chapters[1], { ...neighbourhoodRoutes.perimeter, "meadow-bridge": 0 }).complete, false, "one unreachable home prevents completion");
});

test("chapters expand the same world in spatial reading order, with distinct piece names", () => {
  for (const chapter of chapters) {
    validateChapter(chapter);
    assert.equal(new Set(chapter.tiles.map(({ name }) => name)).size, chapter.tiles.length);
    assert.deepEqual(chapter.tiles, [...chapter.tiles].sort((a, b) => a.y - b.y || a.x - b.x));
    for (const seed of chapter.arrangements) assert.equal(evaluateBoard(chapter, seed.board).complete, false);
  }
  for (let i = 1; i < chapters.length; i++) {
    for (const previous of chapters[i - 1].tiles) {
      const current = chapters[i].tiles.find(({ id }) => id === previous.id)!;
      assert.deepEqual([current.x, current.y], [previous.x, previous.y]);
    }
  }
});

for (const [index, chapter] of chapters.entries()) {
  test(`${chapter.name}: exhaustive solutions and no trapped authored configuration`, () => {
    const result = solveChapter(chapter);
    assert.equal(result.exhaustive, true, "never mistake a bounded search for proof");
    assert.equal(result.evaluated, [256, 16_384, 65_536][index]);
    assert.ok(result.solutions.length >= 2);
    const evaluate = createBoardEvaluator(chapter);
    const pieces = chapter.tiles.filter(isMovable);
    const encode = (board: Board) => pieces.reduce((value, piece, position) => value + board[piece.id] * 4 ** position, 0);

    // Reverse search from ALL solutions over the actual one-click transition graph.
    // Every predecessor must reach a solution; this tests arbitrary rotations, not just seeds.
    const recoverable = new Set(result.solutions.map(encode));
    const queue = [...recoverable];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const state = queue[cursor];
      for (let position = 0; position < pieces.length; position++) {
        const place = 4 ** position;
        const turn = Math.floor(state / place) % 4;
        const predecessor = state + (turn === 0 ? 3 : -1) * place;
        if (!recoverable.has(predecessor)) { recoverable.add(predecessor); queue.push(predecessor); }
      }
    }
    assert.equal(recoverable.size, result.totalConfigurations, "every possible board has a route to completion");
    const edgePatterns = new Set<string>();
    const endingIds = new Set<string | null>();
    for (const solution of result.solutions) {
      const outcome = evaluate(solution);
      assert.equal(outcome.complete, true);
      edgePatterns.add(JSON.stringify(outcome.connections));
      endingIds.add(outcome.endingId);
    }
    assert.ok(edgePatterns.size > 1, "variation changes matched line-work, not only unused tiles");
    if (index === 2) assert.deepEqual(endingIds, new Set(chapter.endings.map(({ id }) => id)));
    for (const [arrangementIndex, arrangement] of chapter.arrangements.entries()) {
      assert.ok(recoverable.has(encode(arrangement.board)));
      const shortest = Math.min(...result.solutions.map((board) => pieces.reduce((moves, piece) => moves + quarterTurn(board[piece.id] - arrangement.board[piece.id]), 0)));
      assert.equal(shortest, [[2, 2], [3, 4], [6, 6]][index][arrangementIndex], "curated starts have a verified, short route to completion");
    }
    console.info(`${chapter.id}: ${result.evaluated} configurations; ${result.solutions.length} solutions; all recoverable`);
  });
}

test("bounded solver reports incomplete searches and deduplicates straight orientations", () => {
  const bounded = solveChapter(chapters[0], 3);
  assert.equal(bounded.exhaustive, false);
  assert.equal(bounded.evaluated, 3);
  assert.throws(() => solveChapter(chapters[0], 0));
  const straight: Chapter = { ...tinyChapter, tiles: tinyChapter.tiles.map((tile) => tile.id === "bend" ? { ...tile, kind: "path", shape: "straight", rotatable: true } : tile) };
  const solved = solveChapter(straight);
  assert.equal(solved.totalConfigurations, 2);
  assert.equal(solved.exhaustive, true);
  assert.deepEqual(solved.solutions, [{ bend: 1 }]);
});

test("idle/playing guards prevent premature progression or unintended tile moves", () => {
  const idle = createJourneyState();
  for (const action of [{ type: "continue" }, { type: "undo" }, { type: "skip" }, { type: "restart" }, { type: "replay" }, { type: "rotate", tileId: "willow-bend" }] as const) {
    assert.strictEqual(journeyReducer(idle, action), idle);
  }
  const playing = journeyReducer(idle, { type: "start" });
  assert.equal(playing.status, "playing");
  assert.strictEqual(journeyReducer(playing, { type: "continue" }), playing);
  assert.strictEqual(journeyReducer(playing, { type: "start" }), playing);
  assert.strictEqual(journeyReducer(playing, { type: "undo" }), playing);
  assert.strictEqual(journeyReducer(playing, { type: "rotate", tileId: "home" }), playing);
});

test("undo reverses exactly one move, including completion, with immutable snapshots", () => {
  const playing = journeyReducer(createJourneyState(), { type: "start" });
  deepFreeze(playing);
  const moved = journeyReducer(playing, { type: "rotate", tileId: "willow-bend" });
  assert.deepEqual(journeyReducer(moved, { type: "undo" }), playing);
  const complete = turnTo(playing, gardenRoutes.upper);
  assert.equal(complete.status, "complete");
  const undone = journeyReducer(complete, { type: "undo" });
  assert.equal(undone.status, "playing");
  assert.deepEqual(undone.board, complete.history.at(-1));
  assert.equal(undone.history.length, complete.history.length - 1);
  assert.equal(complete.status, "complete", "undo cannot mutate previous state");
  const changed = journeyReducer(complete, { type: "rotate", tileId: "willow-bend" });
  assert.equal(changed.status, "playing", "completion does not lock experimentation");
  assert.equal(journeyReducer(changed, { type: "undo" }).status, "complete");
});

test("hints do not move pieces; restart resets the current authored seed and history", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  const board = state.board;
  state = journeyReducer(state, { type: "hint", tileId: "willow-bend" });
  assert.strictEqual(state.board, board);
  assert.deepEqual(state.hintsRevealed, ["willow-bend"]);
  assert.equal(state.history.length, 0);
  assert.strictEqual(journeyReducer(state, { type: "hint", tileId: "willow-bend" }), state);
  assert.strictEqual(journeyReducer(state, { type: "hint", tileId: "home" }), state);
  state = journeyReducer(state, { type: "rotate", tileId: "willow-bend" });
  state = journeyReducer(state, { type: "restart" });
  assert.deepEqual(state.board, chapters[0].arrangements[0].board);
  assert.deepEqual(state.history, []);
  assert.deepEqual(state.hintsRevealed, []);
  assert.equal(state.endingId, null);
});

test("every chapter restores its own seed, and clicking every piece is not a success condition", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  for (const chapter of chapters) {
    const original = state;
    for (const tile of chapter.tiles.filter(isMovable)) {
      for (let turn = 0; turn < 4; turn++) state = journeyReducer(state, { type: "rotate", tileId: tile.id });
    }
    assert.deepEqual(state.board, original.board);
    assert.equal(state.status, "playing", "only graph reachability can complete a chapter");
    state = journeyReducer(state, { type: "restart" });
    assert.deepEqual(state, original, "restart never goes to a different chapter");
    state = journeyReducer(journeyReducer(state, { type: "skip" }), { type: "continue" });
  }
});

test("undo and restart clear a final ending when its connected graph is lost", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  for (let index = 0; index < 2; index++) state = journeyReducer(journeyReducer(state, { type: "skip" }), { type: "continue" });
  state = turnTo(state, endingRoutes["heart-loop"]);
  assert.equal(state.status, "complete");
  assert.equal(state.endingId, "heart-loop");
  const changed = journeyReducer(state, { type: "rotate", tileId: "heart-junction" });
  assert.equal(changed.status, "playing");
  assert.equal(changed.endingId, null);
  assert.equal(journeyReducer(changed, { type: "undo" }).endingId, "heart-loop");
  const restarted = journeyReducer(state, { type: "restart" });
  assert.equal(restarted.chapterId, chapters[2].id);
  assert.equal(restarted.status, "playing");
  assert.equal(restarted.endingId, null);
  assert.deepEqual(restarted.board, chapters[2].arrangements[0].board);
});

test("completion waits for Continue and the whole journey finishes with the graph's ending", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  const solutions = [gardenRoutes.upper, neighbourhoodRoutes.perimeter, endingRoutes["home-arch"]];
  for (let i = 0; i < chapters.length; i++) {
    state = turnTo(state, solutions[i]);
    assert.equal(state.status, "complete");
    assert.equal(state.chapterId, chapters[i].id, "never auto-advance");
    state = journeyReducer(state, { type: "continue" });
    if (i < chapters.length - 1) {
      assert.equal(state.status, "playing");
      assert.equal(state.chapterId, chapters[i + 1].id);
      assert.deepEqual(state.history, []);
      assert.deepEqual(state.hintsRevealed, []);
    }
  }
  assert.equal(state.status, "finished");
  assert.equal(state.endingId, "home-arch");
  assert.strictEqual(journeyReducer(state, { type: "continue" }), state);
  assert.strictEqual(journeyReducer(state, { type: "rotate", tileId: "heart-junction" }), state);
});

test("skip/restart/exit are recoverable and replay cycles through curated arrangements", () => {
  let state = journeyReducer(createJourneyState(), { type: "start" });
  for (const chapter of chapters) {
    state = journeyReducer(state, { type: "skip" });
    assert.equal(state.status, "skipped");
    assert.equal(state.chapterId, chapter.id);
    assert.equal(state.endingId, null);
    assert.strictEqual(journeyReducer(state, { type: "undo" }), state);
    assert.equal(journeyReducer(state, { type: "restart" }).status, "playing");
    state = journeyReducer(state, { type: "continue" });
  }
  assert.equal(state.status, "finished");
  assert.equal(state.endingId, null, "skipping never invents a completed composition");
  state = journeyReducer(state, { type: "replay" });
  assert.equal(state.arrangementIndex, 1);
  assert.equal(state.status, "playing");
  assert.deepEqual(state.board, chapters[0].arrangements[1].board);
  const moved = journeyReducer(state, { type: "rotate", tileId: "willow-bend" });
  assert.deepEqual(journeyReducer(moved, { type: "restart" }).board, state.board);
  for (const chapter of chapters) {
    assert.deepEqual(state.board, chapter.arrangements[1].board);
    state = journeyReducer(journeyReducer(state, { type: "skip" }), { type: "continue" });
  }
  state = journeyReducer(state, { type: "replay" });
  assert.deepEqual(state.board, chapters[0].arrangements[0].board);
  for (const status of ["playing", "complete", "skipped", "finished"] as const) {
    const exited = journeyReducer({ ...state, status, hintsRevealed: ["willow-bend"] }, { type: "exit" });
    assert.equal(exited.status, "idle");
    assert.deepEqual(exited.history, []);
    assert.deepEqual(exited.hintsRevealed, []);
    assert.equal(journeyReducer(exited, { type: "start" }).status, "playing");
  }
});
