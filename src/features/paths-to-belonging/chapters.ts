import type { Board, Chapter, Connection, Tile } from "./types.ts";

// Shared IDs/positions keep the original home, garden and paths in the expanding world.
const corners: readonly Tile[] = [
  { id: "willow-bend", name: "Curved path beside the willow", x: 0, y: 0, kind: "path", shape: "curve", rotatable: true },
  { id: "garden-bend", name: "Curved path above the garden", x: 2, y: 0, kind: "path", shape: "curve", rotatable: true },
  { id: "home-bend", name: "Curved path below the home", x: 0, y: 2, kind: "path", shape: "curve", rotatable: true },
  { id: "meadow-bend", name: "Curved path beside the meadow", x: 2, y: 2, kind: "path", shape: "curve", rotatable: true },
];
const home: Tile = { id: "home", name: "The little home", x: 0, y: 1, kind: "landmark", motif: "home", ports: ["north", "east", "south"] };
const garden: Tile = { id: "garden", name: "The welcoming garden", x: 2, y: 1, kind: "landmark", motif: "garden", ports: ["north", "south", "west"] };
const bridge: Tile = { id: "garden-bridge", name: "Bridge above the garden", x: 1, y: 0, kind: "path", shape: "straight", rotatable: false, orientation: 1 };
const meadowBridge: Tile = { id: "meadow-bridge", name: "Bridge beside the meadow", x: 1, y: 2, kind: "path", shape: "straight", rotatable: false, orientation: 1 };
const sortSpatially = (tiles: readonly Tile[]) => [...tiles].sort((a, b) => a.y - b.y || a.x - b.x);

const firstStart: Board = { "willow-bend": 0, "garden-bend": 1, "home-bend": 1, "meadow-bend": 0 };
const secondStart: Board = { "willow-bend": 2, "garden-bend": 3, "home-bend": 3, "meadow-bend": 2 };
const neighbourhood = sortSpatially([
  ...corners, home, garden,
  { id: "meeting", name: "The meeting place", x: 1, y: -1, kind: "landmark", motif: "meeting", ports: ["south"] },
  { id: "garden-bridge", name: "Junction above the garden", x: 1, y: 0, kind: "path", shape: "junction", rotatable: true },
  { id: "courtyard", name: "Junction in the courtyard", x: 1, y: 1, kind: "path", shape: "junction", rotatable: true },
  { id: "meadow-bridge", name: "Junction beside the meadow", x: 1, y: 2, kind: "path", shape: "junction", rotatable: true },
  { id: "neighbour", name: "The neighbour's home", x: 1, y: 3, kind: "landmark", motif: "home", ports: ["north"] },
]);
const neighbourhoodStart: Board = { ...firstStart, "garden-bridge": 1, courtyard: 1, "meadow-bridge": 0 };
const neighbourhoodAlternative: Board = { ...secondStart, "garden-bridge": 2, courtyard: 2, "meadow-bridge": 3 };
const requiredPlaces = ["home", "garden", "meeting", "neighbour"];
const upperRoute: readonly Connection[] = [["home", "willow-bend"], ["willow-bend", "garden-bridge"], ["garden-bridge", "garden-bend"], ["garden-bend", "garden"]];
const lowerRoute: readonly Connection[] = [["home", "home-bend"], ["home-bend", "meadow-bridge"], ["meadow-bridge", "meadow-bend"], ["meadow-bend", "garden"]];

export const chapters: readonly Chapter[] = [
  {
    id: "find-a-way",
    name: "Find a Way",
    objective: "Turn the curved paths to make one continuous route from the home to the garden. Unused paths can stay as they are.",
    completion: "A path reaches the garden.",
    tiles: sortSpatially([...corners, home, garden, bridge, meadowBridge]),
    requiredLandmarks: ["home", "garden"],
    arrangements: [
      { id: "willow", name: "By the willow", board: firstStart },
      { id: "meadow", name: "By the meadow", board: secondStart },
    ],
    endings: [],
  },
  {
    id: "make-connections",
    name: "Make Connections",
    objective: "Turn the junctions and curved paths to connect both homes, the garden and the meeting place in one network. Unused branches are welcome.",
    completion: "All places are connected.",
    tiles: neighbourhood,
    requiredLandmarks: requiredPlaces,
    arrangements: [
      { id: "courtyard", name: "Around the courtyard", board: neighbourhoodStart },
      { id: "bridges", name: "Across the bridges", board: neighbourhoodAlternative },
    ],
    endings: [],
  },
  {
    id: "build-belonging",
    name: "Build Belonging",
    objective: "Connect every home, the garden, the meeting place and the heart. Try different paths to shape the composition.",
    completion: "There's more than one way to belong.",
    tiles: sortSpatially([
      ...neighbourhood.filter(({ id }) => id !== "garden"),
      { ...garden, ports: ["north", "east", "south", "west"] },
      { id: "heart", name: "The heart motif", x: 3, y: 0, kind: "landmark", motif: "heart", ports: ["south"] },
      { id: "heart-junction", name: "Junction beside the heart", x: 3, y: 1, kind: "path", shape: "junction", rotatable: true },
      { id: "home-motif", name: "The home motif", x: 3, y: 2, kind: "landmark", motif: "home", ports: ["north"] },
    ]),
    requiredLandmarks: [...requiredPlaces, "heart", "home-motif"],
    arrangements: [
      { id: "heart-garden", name: "A garden around the heart", board: { ...neighbourhoodStart, "heart-junction": 0 } },
      { id: "open-home", name: "Paths around a home", board: { ...neighbourhoodAlternative, "heart-junction": 1 } },
    ],
    endings: [
      { id: "heart-loop", name: "A heart around the garden", motif: "heart", connections: [...upperRoute, ...lowerRoute] },
      { id: "home-arch", name: "An arch above a home", motif: "home", connections: upperRoute },
      { id: "shared-courtyard", name: "A heart beside the courtyard", motif: "heart", connections: [] },
    ],
  },
];
