
import type { NodeOut, WallOut } from '../schema.js';

/**
 * Convert wall shapes into a centerline graph, then snap endpoints and return nodes+walls.
 * This is a stub that returns empty arrays until you implement.
 */
export function buildGraph({ wallStrokes, fills, scale } : any): { nodes: NodeOut[], walls: WallOut[] } {
  // TODO:
  // - if `fills` present: union & skeletonize to centerlines
  // - else: pair parallel strokes and compute midlines
  // - snap endpoints, merge colinear segments
  // - output nodes[] & walls[] in *feet* using scale
  return { nodes: [], walls: [] };
}
