
import type { DimensionOut, NodeOut, WallOut } from '../schema.js';

/**
 * Parse dimension strings and associate to nearest walls.
 * Stub returns an empty array for now.
 */
export function extractDimensions({ texts, scale, nodes, walls } : {
  texts: any[],
  scale: { feetPerPdfUnit: number },
  nodes: NodeOut[],
  walls: WallOut[]
}): DimensionOut[] {
  // TODO:
  // - regex match feet/inch strings (e.g., 48'-0")
  // - associate to nearest line segment using projection
  // - return valueFt + endpoints (p1Ft/p2Ft)
  return [];
}
