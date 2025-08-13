
/**
 * Separate walls vs annotations using stroke width, fill and heuristics.
 */
export function classifyStrokes({ paths } : { paths: Array<any> }) {
  // TODO: examine strokeWidth, filled, color to split walls vs thin annotations.
  const wallStrokes = paths.filter(p => (p.strokeWidth ?? 1) >= 1.0 || p.filled);
  const annoStrokes = paths.filter(p => (p.strokeWidth ?? 1) < 1.0 && !p.filled);
  const fills = paths.filter(p => p.filled);

  return { wallStrokes, annoStrokes, fills };
}
