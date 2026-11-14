import type { Board } from "../../src/features/paths-to-belonging/types.ts";

// Independently authored examples, rather than snapshots returned by the solver.
export const gardenRoutes = {
  upper: { "willow-bend": 1, "garden-bend": 2, "home-bend": 1, "meadow-bend": 0 },
  lower: { "willow-bend": 0, "garden-bend": 1, "home-bend": 0, "meadow-bend": 3 },
} as const satisfies Record<string, Board>;

export const neighbourhoodRoutes = {
  perimeter: { "willow-bend": 1, "garden-bend": 2, "home-bend": 0, "meadow-bend": 3, "garden-bridge": 0, courtyard: 0, "meadow-bridge": 2 },
  courtyard: { "willow-bend": 0, "garden-bend": 0, "home-bend": 0, "meadow-bend": 3, "garden-bridge": 1, courtyard: 0, "meadow-bridge": 2 },
} as const satisfies Record<string, Board>;

export const endingRoutes = {
  "heart-loop": { ...neighbourhoodRoutes.perimeter, "heart-junction": 3 },
  "home-arch": { ...neighbourhoodRoutes.perimeter, "meadow-bend": 0, "meadow-bridge": 3, "heart-junction": 3 },
  "shared-courtyard": { ...neighbourhoodRoutes.courtyard, "heart-junction": 3 },
} as const satisfies Record<string, Board>;
