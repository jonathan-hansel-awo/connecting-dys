import { evaluateBoard, tilePorts } from "./engine.ts";
import type { Board, Chapter, Direction, Tile } from "./types.ts";

// Original SVG artwork. All geometry shares the engine's 100-unit tile space;
// the same home, garden, stream and bridges stay put as the world expands.
const portEnds: Record<Direction, string> = { north: "50 0", east: "100 50", south: "50 100", west: "0 50" };

export function worldBounds(chapter: Chapter) {
  const minX = Math.min(...chapter.tiles.map(({ x }) => x));
  const minY = Math.min(...chapter.tiles.map(({ y }) => y));
  const columns = Math.max(...chapter.tiles.map(({ x }) => x)) - minX + 1;
  const rows = Math.max(...chapter.tiles.map(({ y }) => y)) - minY + 1;
  return { minX, minY, columns, rows, viewBox: `${minX * 100} ${minY * 100} ${columns * 100} ${rows * 100}` };
}

function Tree({ x, y, slender = false }: { x: number; y: number; slender?: boolean }) {
  return <g transform={`translate(${x} ${y})`} className="paths-tree paths-paper-cut">
    <ellipse cy="16" rx="15" ry="4" className="paths-earth" />
    <path d="M0 16 V-8" className="paths-tree-stem" />
    <path d={slender ? "M0-35 C-24-13-18 4 0 6 C18 4 24-13 0-35Z" : "M-4-30 C-17-33-28-15-20-6 C-30 5-8 15 0 7 C15 17 30 0 20-9 C27-23 9-37-4-30Z"} className="paths-leaf" />
    <path d="M0 5 V-17 M0-3 L-8-10 M0-9 L8-16" className="paths-leaf-vein" />
  </g>;
}

function Flowers({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`} className="paths-garden-bloom">
    <path d="M-12 10 V-3 M2 12 V-13 M14 9 V-1" className="paths-leaf-vein" />
    <g className="paths-flower-petals"><circle cx="-12" cy="-5" r="5" /><circle cx="2" cy="-15" r="6" /><circle cx="14" cy="-3" r="4" /></g>
    <g className="paths-flower-centres"><circle cx="-12" cy="-5" r="1.5" /><circle cx="2" cy="-15" r="2" /><circle cx="14" cy="-3" r="1.5" /></g>
  </g>;
}

function LandscapeLayers({ expanded, complete }: { expanded: boolean; complete: boolean }) {
  return <g className="paths-landscape-layers" data-complete={complete}>
    <path d="M-20 58 C46-8 95 0 128 47 C173 94 234 8 306 42 C384 66 423 163 384 240 C348 313 230 268 168 302 C91 346 25 288-20 310 C-57 259-56 112-20 58Z" className="paths-field" />
    <path d="M-10 227 C46 198 86 229 107 269 C121 291 81 338-10 314Z" className="paths-meadow" />
    <path d="M158-130 C101-32 201 59 148 136 S194 275 146 359 S179 494 146 551" className="paths-water-bank" />
    <path d="M158-130 C101-32 201 59 148 136 S194 275 146 359 S179 494 146 551" className="paths-water" />
    <path d="M146 104 Q132 126 139 141 M166 204 Q173 221 164 234 M147 388 Q153 404 155 418" className="paths-water-ripple" />
    <g className="paths-bridge-deck paths-paper-cut">
      <path d="M119 40 Q150 34 181 40 L181 60 Q150 54 119 60Z M119 240 Q150 234 181 240 L181 260 Q150 254 119 260Z" />
      <path d="M128 39 V58 M141 37 V57 M154 37 V56 M167 38 V57 M128 239 V258 M141 237 V257 M154 237 V256 M167 238 V257" className="paths-bridge-grain" />
    </g>
    <Tree x={20} y={27} slender />
    <Tree x={279} y={32} />
    <Tree x={20} y={284} />
    <path d="M222 110 Q251 100 277 118 M222 190 Q249 205 281 183" className="paths-garden-bed" />
    <Flowers x={250} y={116} />
    <Flowers x={251} y={190} />
    <g className="paths-grass"><path d="M82 110 L78 102 M84 110 L89 100 M205 280 L201 273 M208 280 L212 269 M30 202 L27 195 M34 203 L39 194" /></g>
    {expanded && <g className="paths-expanded-landscape">
      <path d="M12-88 C87-132 179-92 228-110 C294-148 369-120 392-68 C410-16 330 21 268-23 C204-64 151-25 96-31 Q38-26 12-88Z" className="paths-meadow" />
      <path d="M21 365 Q101 319 154 368 T315 405 C387 419 396 493 341 512 C265 537 196 492 139 512 C77 537 15 500 21 365Z" className="paths-field" />
      <Tree x={26} y={-55} />
      <Tree x={263} y={-56} slender />
      <Tree x={54} y={430} slender />
      <Tree x={268} y={452} />
      <path d="M213 35 Q233 19 246 35 M220 42 Q232 33 238 40" className="paths-birds" />
      <Flowers x={242} y={371} />
    </g>}
  </g>;
}

export function PaperLandscape({ chapter, complete }: { chapter: Chapter; complete: boolean }) {
  return <svg className="paths-landscape" viewBox={worldBounds(chapter).viewBox} fill="none" aria-hidden="true" focusable="false" data-paper-landscape>
    <LandscapeLayers expanded={chapter.id !== "find-a-way"} complete={complete} />
  </svg>;
}

function LandmarkCutout({ motif }: { motif: Extract<Tile, { kind: "landmark" }>["motif"] }) {
  if (motif === "home") return <g className="paths-home-cutout paths-paper-cut">
    <path d="M24 47 L50 25 L76 47 V77 Q50 84 24 77Z" className="paths-house-wall" />
    <path d="M18 47 L50 19 L82 47 L76 53 L50 31 L24 53Z" className="paths-house-roof" />
    <path d="M46 79 V59 Q51 55 56 59 V80" className="paths-house-door" />
    <path d="M31 54 H40 V64 H31Z M61 54 H70 V64 H61Z" className="paths-house-window" />
  </g>;
  if (motif === "garden") return <g className="paths-paper-cut">
    <path d="M22 62 Q50 50 78 62 L75 77 Q50 87 25 77Z" className="paths-garden-soil" />
    <path d="M49 65 V33 M34 67 V47 M65 66 V44" className="paths-leaf-vein" />
    <path d="M49 48 Q25 50 27 29 Q49 28 49 48Z M50 42 Q72 40 72 21 Q48 20 50 42Z M34 58 Q17 55 22 42 Q38 43 34 58Z M65 55 Q83 54 78 39 Q62 40 65 55Z" className="paths-leaf" />
  </g>;
  if (motif === "meeting") return <g className="paths-paper-cut">
    <path d="M22 46 L50 28 L78 46 V75 H22Z" className="paths-house-wall" />
    <path d="M17 47 L50 23 L83 47" className="paths-meeting-roof" />
    <path d="M29 51 H71 M29 70 H71 M34 51 V70 M66 51 V70" className="paths-meeting-table" />
    <circle cx="50" cy="60" r="5" className="paths-flower-petals" />
  </g>;
  return <g className="paths-paper-cut"><path d="M50 78 C38 68 20 56 20 39 C20 18 43 17 50 33 C57 17 80 18 80 39 C80 56 62 68 50 78Z" className="paths-heart-cutout" /><path d="M31 38 Q32 28 40 30" className="paths-heart-glint" /></g>;
}

export function TileArtwork({ tile, board }: { tile: Tile; board: Board }) {
  const ports = tilePorts(tile, board);
  const rotation = tile.kind === "path" ? (tile.rotatable ? board[tile.id] : tile.orientation) * 90 : 0;
  const path = tile.kind === "path" ? tile.shape === "curve" ? "M50 0 Q50 50 100 50" : tile.shape === "straight" ? "M50 0 V100" : "M50 0 V50 M0 50 H100" : ports.map((port) => `M50 50 L${portEnds[port]}`).join(" ");
  return <>
    <g className="paths-pathwork" transform={`rotate(${rotation} 50 50)`}>
      <path d={path} className="paths-path-relief" />
      <path d={path} className="paths-path-paper" />
      <path d={path} className="paths-path-ink" />
    </g>
    {tile.kind === "landmark" && <g className="paths-landmark">
      <ellipse className="paths-landmark-halo" cx="50" cy="53" rx="33" ry="30" />
      <LandmarkCutout motif={tile.motif} />
    </g>}
  </>;
}

export function PaperPiece({ tile, board }: { tile: Tile; board: Board }) {
  return <svg className="paths-lines" viewBox="0 0 100 100" fill="none" aria-hidden="true" focusable="false"><TileArtwork tile={tile} board={board} /></svg>;
}

const endingFrames: Record<string, { path: string; x: number; y: number; scale: number }> = {
  "heart-loop": { path: "M320 580 C245 518 84 375 84 222 C84 54 270 35 320 156 C370 35 556 54 556 222 C556 375 395 518 320 580Z", x: 170, y: 140, scale: .75 },
  "home-arch": { path: "M80 250 L320 62 L560 250 M120 230 V557 H520 V230", x: 172, y: 155, scale: .74 },
  "shared-courtyard": { path: "M107 401 C20 246 111 100 241 126 C280 129 305 160 320 192 C359 89 527 98 548 220 C572 370 420 478 320 563 C275 528 222 489 190 453", x: 175, y: 158, scale: .71 },
};

export function EndingComposition({ chapter, board, endingId }: { chapter: Chapter; board: Board; endingId: string }) {
  const result = evaluateBoard(chapter, board);
  const frame = endingFrames[endingId];
  const ending = chapter.endings.find(({ id }) => id === endingId);
  // The final picture always comes from the actual completed graph, never a stock ending.
  if (!result.complete || result.endingId !== endingId || !frame || !ending) return null;
  return <figure className="paths-ending" data-ending={endingId}>
    <svg viewBox="0 0 640 620" fill="none" aria-hidden="true" focusable="false" className="paths-ending-art">
      <path d={frame.path} className="paths-ending-relief" />
      <path d={frame.path} className="paths-ending-frame" pathLength="1" />
      <g transform={`translate(${frame.x} ${frame.y}) scale(${frame.scale}) translate(0 100)`}>
        <LandscapeLayers expanded complete />
        {chapter.tiles.map((tile) => <g key={tile.id} transform={`translate(${tile.x * 100} ${tile.y * 100})`} className={`${result.reachable.includes(tile.id) ? "is-linked" : ""} ${result.pairedLandmarks.includes(tile.id) ? "is-joined" : ""}`} data-ending-piece={tile.id}>
          <TileArtwork tile={tile} board={board} />
        </g>)}
      </g>
      <g className="paths-ending-sprig" transform="translate(548 493)"><Tree x={0} y={0} slender /><Flowers x={-23} y={38} /></g>
    </svg>
    <figcaption>{ending.name}. The paths and places reflect the connections you made.</figcaption>
  </figure>;
}
