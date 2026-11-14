"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { Heart, House, Sprout, UsersRound, RotateCw } from "lucide-react";
import { chapters } from "./chapters.ts";
import { evaluateBoard, isMovable, tilePorts } from "./engine.ts";
import { chooseHint } from "./hints.ts";
import type { Hint } from "./hints.ts";
import { createJourneyState, journeyReducer } from "./reducer.ts";
import type { JourneyAction } from "./reducer.ts";
import type { Board, Direction, Tile } from "./types.ts";

const portEnds: Record<Direction, string> = { north: "50 0", east: "100 50", south: "50 100", west: "0 50" };
const chapterProgress = ["First", "Second", "Third"];
const motifIcons = { home: House, garden: Sprout, meeting: UsersRound, heart: Heart };

function PathSymbol({ tile, board }: { tile: Tile; board: Board }) {
  const ports = tilePorts(tile, board);
  return <>
    <svg className="paths-lines" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false">
      {tile.kind === "path" && tile.shape === "curve"
        ? <path d="M50 0 Q50 50 100 50" transform={`rotate(${board[tile.id] * 90} 50 50)`} />
        : ports.map((port) => <path key={port} d={`M50 50 L${portEnds[port]}`} />)}
    </svg>
    {tile.kind === "landmark" && (() => {
      const Icon = motifIcons[tile.motif];
      return <span className="paths-landmark-mark"><Icon aria-hidden="true" /></span>;
    })()}
    {isMovable(tile) && <RotateCw className="paths-turn-mark" size={14} aria-hidden="true" />}
  </>;
}

export default function PathsJourney({ onExit }: { onExit: () => void }) {
  const [state, dispatch] = useReducer(journeyReducer, undefined, () => journeyReducer(createJourneyState(), { type: "start" }));
  const [focusVersion, requestFocus] = useReducer((version: number) => version + 1, 0);
  const [hint, setHint] = useState<Hint | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const chapterIndex = chapters.findIndex(({ id }) => id === state.chapterId);
  const chapter = chapters[chapterIndex];
  const result = evaluateBoard(chapter, state.board);
  const finished = state.status === "finished";
  const skipped = state.status === "skipped";
  const minX = Math.min(...chapter.tiles.map(({ x }) => x));
  const minY = Math.min(...chapter.tiles.map(({ y }) => y));
  const columns = Math.max(...chapter.tiles.map(({ x }) => x)) - minX + 1;
  useEffect(() => { heading.current?.focus(); }, [state.chapterId, state.arrangementIndex, finished, focusVersion]);

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
    <p role="status">{state.endingId ? `Your connected composition: ${chapter.endings.find(({ id }) => id === state.endingId)!.name}.` : "You can try another arrangement or return to the page whenever you like."}</p>
    <div className="paths-actions">
      <button type="button" className="button" onClick={() => act({ type: "replay" }, true)}>Replay journey</button>
      <button type="button" className="paths-control" onClick={onExit}>Return to page</button>
    </div>
  </div>;

  const status = skipped ? "Chapter skipped. Continue whenever you're ready, or restart this chapter." : result.complete ? chapter.completion : `${result.connectedLandmarks.length} of ${chapter.requiredLandmarks.length} places linked to the little home.`;
  return <div className="paths-game" data-paths-game>
    <ol className="paths-progress" aria-label="Journey chapters">
      {chapters.map(({ id, name }) => <li key={id} aria-current={id === state.chapterId ? "step" : undefined}>{name}</li>)}
    </ol>
    <div className="paths-chapter-heading">
      <div>
        <p className="small">{chapterProgress[chapterIndex]} of three chapters</p>
        <h3 ref={heading} tabIndex={-1}>{chapter.name}</h3>
      </div>
      <button type="button" className="paths-control" onClick={onExit}>Exit game</button>
    </div>
    <p id="paths-objective">{chapter.objective}</p>
    <p id="paths-instructions">Tap or click a curved path or junction to turn it clockwise. With a keyboard, use Tab to choose a path and Enter or Space to turn it.</p>
    <details className="paths-help">
      <summary>How to play</summary>
      <p>Join the openings on neighbouring pieces. Lines must meet edge to edge. A solid line and double outline mark the network linked to the little home; other paths are dashed. The place list below describes the connections in words.</p>
      <p>Unused branches are fine. Hint points to one useful piece without moving it. You can undo any turn, restart, skip or leave. Each chapter waits for you to choose Continue.</p>
    </details>
    <div className="paths-play-layout">
      <div className="paths-board-region" role="group" aria-label={`${chapter.name} path board`} aria-describedby="paths-objective paths-instructions">
        <ul className="paths-board" role="list" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {chapter.tiles.map((tile) => {
            const connected = result.reachable.includes(tile.id);
            const ports = tilePorts(tile, state.board).join(" and ");
            const movable = isMovable(tile);
            const label = `${tile.name}, opening ${ports}. ${connected ? "Linked to the little home." : "Not yet linked to the little home."}${movable ? " Activate to turn clockwise." : " Fixed place or bridge."}`;
            const classes = `paths-piece ${connected ? "is-linked" : ""} ${hint?.tileId === tile.id ? "is-hint" : ""}`;
            const position: CSSProperties = { gridColumn: tile.x - minX + 1, gridRow: tile.y - minY + 1 };
            return <li key={tile.id} style={position}>
              {movable
                ? <button id={`paths-piece-${tile.id}`} type="button" className={classes} aria-label={label} disabled={skipped} onClick={() => act({ type: "rotate", tileId: tile.id })}><PathSymbol tile={tile} board={state.board} /></button>
                : <span className={classes} role="img" aria-label={label}><PathSymbol tile={tile} board={state.board} /></span>}
            </li>;
          })}
        </ul>
      </div>
      <div className="paths-place-list">
        <h4>Places in this chapter</h4>
        <ul>
          {chapter.requiredLandmarks.map((id) => {
            const tile = chapter.tiles.find((tile) => tile.id === id)!;
            if (tile.kind !== "landmark") return null;
            const Icon = motifIcons[tile.motif];
            return <li key={id}><Icon aria-hidden="true" size={22} /><span>{tile.name}<br /><strong>{id === "home" ? "Starting place" : result.connectedLandmarks.includes(id) ? "Connected" : "Not yet connected"}</strong></span></li>;
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
      <button type="button" className="paths-control" disabled={state.status !== "playing"} onClick={revealHint}>Hint</button>
      <button type="button" className="paths-control" disabled={!state.history.length || skipped} onClick={() => act({ type: "undo" })}>Undo</button>
      <button type="button" className="paths-control" onClick={() => act({ type: "restart" }, true)}>Restart chapter</button>
      <button type="button" className="paths-control" disabled={state.status !== "playing"} onClick={() => act({ type: "skip" }, true)}>Skip chapter</button>
    </div>
    {(state.status === "complete" || skipped) && <div className="paths-forward"><button type="button" className="button" onClick={() => act({ type: "continue" }, true)}>Continue</button></div>}
  </div>;
}
