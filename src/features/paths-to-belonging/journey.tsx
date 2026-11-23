"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { Heart, House, Sprout, UsersRound, RotateCw } from "lucide-react";
import { chapters } from "./chapters.ts";
import { evaluateBoard, isMovable, tilePorts } from "./engine.ts";
import { EndingComposition, PaperLandscape, PaperPiece, worldBounds } from "./paper-world.tsx";
import { chooseHint } from "./hints.ts";
import type { Hint } from "./hints.ts";
import { createJourneyState, journeyReducer } from "./reducer.ts";
import type { JourneyAction } from "./reducer.ts";
const chapterProgress = ["First", "Second", "Third"];
const motifIcons = { home: House, garden: Sprout, meeting: UsersRound, heart: Heart };
const worldCaptions = ["A small home. A welcoming garden.", "The same paths, a wider neighbourhood.", "Your neighbourhood, with room to create."];

const subscribe = () => () => {};

export default function PathsJourney() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => journeyReducer(createJourneyState(), { type: "start" }));
  const [focusVersion, requestFocus] = useReducer((version: number) => version + 1, 0);
  const [hint, setHint] = useState<Hint | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const chapterIndex = chapters.findIndex(({ id }) => id === state.chapterId);
  const chapter = chapters[chapterIndex];
  const result = evaluateBoard(chapter, state.board);
  const finished = state.status === "finished";
  const skipped = state.status === "skipped";
  const { minX, minY, columns } = worldBounds(chapter);
  // Only an explicit chapter/restart/replay action moves focus. Mounting this
  // inline section must never jump a visitor away from the rest of the page.
  useEffect(() => { if (focusVersion > 0) heading.current?.focus(); }, [focusVersion]);

  function act(action: JourneyAction, focus = false) {
    setHint(null);
    dispatch(action);
    if (focus) requestFocus();
  }
  function revealHint() {
    const next = chooseHint(chapter, state.board, state.hintsRevealed);
    if (!next) return;
    setHint(next);
    dispatch({ type: "hint", tileId: next.tileId });
  }

  if (finished) return <div className="paths-game paths-message" data-paths-game>
    <p className="eyebrow">At your pace</p>
    <h3 ref={heading} tabIndex={-1}>{state.endingId ? "There's more than one way to belong." : "Thank you for exploring."}</h3>
    <p role="status">{state.endingId ? `Your connected composition: ${chapter.endings.find(({ id }) => id === state.endingId)!.name}.` : "You can try another arrangement or keep scrolling whenever you like."}</p>
    {state.endingId && <EndingComposition chapter={chapter} board={state.board} endingId={state.endingId} />}
    <p className="paths-invitation">There’s a place for you beyond the puzzle, too. Help shape the community we’re building.</p>
    <div className="paths-actions">
      <Link href="/membership" className="button">Register your interest</Link>
      <button type="button" className="button" disabled={!ready} onClick={() => act({ type: "replay" }, true)}>Replay journey</button>
    </div>
  </div>;

  const joinedNames = chapter.tiles.filter(({ id }) => result.pairedLandmarks.includes(id)).map(({ name }) => name).join(", ");
  const status = skipped ? "Chapter skipped. Continue whenever you're ready, or restart this chapter." : result.complete ? chapter.completion : `${result.connectedLandmarks.length} of ${chapter.requiredLandmarks.length} places linked to the little home.${joinedNames ? ` Joined places: ${joinedNames}.` : ""}`;
  return <div className="paths-game" data-paths-game>
    <ol className="paths-progress" aria-label="Journey chapters">
      {chapters.map(({ id, name }) => <li key={id} aria-current={id === state.chapterId ? "step" : undefined}>{name}</li>)}
    </ol>
    <div className="paths-chapter-heading">
      <div>
        <p className="small">{chapterProgress[chapterIndex]} of three chapters</p>
        <h3 ref={heading} tabIndex={-1}>{chapter.name}</h3>
      </div>
    </div>
    <p id="paths-objective">{chapter.objective}</p>
    <p id="paths-instructions">Tap or click a curved path or junction to turn it clockwise. With a keyboard, use Tab to choose a path and Enter or Space to turn it.</p>
    <details className="paths-help">
      <summary>How to play</summary>
      <p>Join the openings on neighbouring pieces. Lines must meet edge to edge. A solid line and double outline mark the network linked to the little home; other paths are dashed. The place list below describes the connections in words.</p>
      <p>When a path joins two places, both glow amber. Breaking that connection removes the glow.</p>
      <p>Unused branches are fine. Hint points to one useful piece without moving it. You can undo any turn, restart, skip or leave. Each chapter waits for you to choose Continue.</p>
    </details>
    <div className="paths-play-layout">
      <div className="paths-board-region" role="group" aria-label={`${chapter.name} path board`} aria-describedby="paths-objective paths-instructions">
        <div className="paths-world surface-inset" data-chapter={chapter.id} data-complete={result.complete && !skipped}>
          <div className="paths-canvas">
            <PaperLandscape key={chapter.id} chapter={chapter} complete={result.complete && !skipped} />
            <ul className="paths-board" role="list" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {chapter.tiles.map((tile) => {
            const connected = result.reachable.includes(tile.id);
            const paired = result.pairedLandmarks.includes(tile.id);
            const ports = tilePorts(tile, state.board).join(" and ");
            const movable = isMovable(tile);
            const label = `${tile.name}, opening ${ports}. ${connected ? "Linked to the little home." : "Not yet linked to the little home."}${paired ? " Connected to another place." : ""}${movable ? " Activate to turn clockwise." : " Fixed place or bridge."}`;
            const classes = `paths-piece ${connected ? "is-linked" : ""} ${paired ? "is-joined" : ""} ${hint?.tileId === tile.id ? "is-hint" : ""}`;
            const position: CSSProperties = { gridColumn: tile.x - minX + 1, gridRow: tile.y - minY + 1 };
            return <li key={tile.id} style={position}>
              {movable
                ? <button id={`paths-piece-${tile.id}`} type="button" className={classes} aria-label={label} disabled={!ready || skipped} onClick={() => act({ type: "rotate", tileId: tile.id })}><PaperPiece tile={tile} board={state.board} /><RotateCw className="paths-turn-mark" size={14} aria-hidden="true" /></button>
                : <span className={classes} role="img" aria-label={label}><PaperPiece tile={tile} board={state.board} /></span>}
            </li>;
          })}
            </ul>
          </div>
        </div>
        <p className="paths-world-caption">{worldCaptions[chapterIndex]}</p>
      </div>
      <div className="paths-place-list">
        <h4>Places in this chapter</h4>
        <ul>
          {chapter.requiredLandmarks.map((id) => {
            const tile = chapter.tiles.find((tile) => tile.id === id)!;
            if (tile.kind !== "landmark") return null;
            const Icon = motifIcons[tile.motif];
            const paired = result.pairedLandmarks.includes(id);
            let connection = "Not yet connected";
            if (paired) connection = result.connectedLandmarks.includes(id) ? "Connected" : "Connected to another place";
            if (id === "home") connection = paired ? "Starting place · Connected" : "Starting place";
            return <li key={id}><Icon aria-hidden="true" size={22} /><span>{tile.name}<br /><strong>{connection}</strong></span></li>;
          })}
        </ul>
      </div>
    </div>
    <div className="paths-feedback">
      <p role="status" aria-atomic="true">{status}</p>
      {result.complete && !skipped && <h4>{chapterIndex === 2 ? "A connected composition, made by you." : "Ready whenever you are."}</h4>}
      <p id="paths-hint" role="status" aria-atomic="true">{hint?.text ?? ""}</p>
    </div>
    <div className="paths-controls" role="group" aria-label="Chapter controls">
      <button type="button" className="paths-control" disabled={!ready || state.status !== "playing"} onClick={revealHint}>Hint</button>
      <button type="button" className="paths-control" disabled={!ready || !state.history.length || skipped} onClick={() => act({ type: "undo" })}>Undo</button>
      <button type="button" className="paths-control" disabled={!ready} onClick={() => act({ type: "restart" }, true)}>Restart chapter</button>
      <button type="button" className="paths-control" disabled={!ready || state.status !== "playing"} onClick={() => act({ type: "skip" }, true)}>Skip chapter</button>
    </div>
    {(state.status === "complete" || skipped) && <div className="paths-forward"><button type="button" className="button" disabled={!ready} onClick={() => act({ type: "continue" }, true)}>Continue</button></div>}
  </div>;
}
