export const directions = ["north", "east", "south", "west"] as const;
export type Direction = (typeof directions)[number];
export type QuarterTurn = 0 | 1 | 2 | 3;
export type PathShape = "curve" | "straight" | "junction";

type TilePosition = {
  readonly id: string;
  readonly name: string;
  readonly x: number;
  readonly y: number;
};

export type Tile = TilePosition & (
  | { readonly kind: "path"; readonly shape: PathShape; readonly rotatable: true }
  | { readonly kind: "path"; readonly shape: PathShape; readonly rotatable: false; readonly orientation: QuarterTurn }
  | { readonly kind: "landmark"; readonly motif: "home" | "garden" | "meeting" | "heart"; readonly ports: readonly Direction[] }
);

// Only movable pieces have entries. Fixed bridges and landmarks cannot be turned.
export type Board = Readonly<Record<string, QuarterTurn>>;
export type Connection = readonly [string, string];
export type Arrangement = {
  readonly id: string;
  readonly name: string;
  readonly board: Board;
};
export type Ending = {
  readonly id: string;
  readonly name: string;
  readonly motif: "heart" | "home";
  // Ordered rules describe actual matched edges, not just nearby/reachable tiles.
  readonly connections: readonly Connection[];
};
export type Chapter = {
  readonly id: string;
  readonly name: string;
  readonly objective: string;
  readonly completion: string;
  readonly tiles: readonly Tile[];
  readonly requiredLandmarks: readonly string[];
  readonly arrangements: readonly Arrangement[];
  readonly endings: readonly Ending[];
};
export type Connectivity = {
  readonly connections: readonly Connection[];
  readonly reachable: readonly string[];
  readonly connectedLandmarks: readonly string[];
  readonly complete: boolean;
  readonly endingId: string | null;
};
