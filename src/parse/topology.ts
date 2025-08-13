import type { LinePdf } from './extractVectors.js';
import type { ScaleInfo, NodeOut, WallOut, RoomOut } from '../schema.js';

interface TopologyResult {
  nodes: NodeOut[];
  walls: WallOut[];
  rooms: RoomOut[];
  warnings: string[];
}

export function topology({ wallLinesPdf, scale }: { wallLinesPdf: LinePdf[]; scale: ScaleInfo }): TopologyResult {
  const nodes: NodeOut[] = [];
  const walls: WallOut[] = [];
  const rooms: RoomOut[] = [];
  const warnings: string[] = [];

  const epsilon = 0.2; // feet
  let nextNodeId = 1;
  let nextWallId = 1;

  function snap(xFt: number, yFt: number): number {
    for (const n of nodes) {
      const dx = n.xFt - xFt;
      const dy = n.yFt - yFt;
      if (Math.hypot(dx, dy) <= epsilon) return n.id;
    }
    const id = nextNodeId++;
    nodes.push({ id, xFt, yFt });
    return id;
  }

  const wallSet = new Set<string>();
  for (const ln of wallLinesPdf) {
    const x1Ft = ln.x1 * scale.feetPerPdfUnit;
    const y1Ft = ln.y1 * scale.feetPerPdfUnit;
    const x2Ft = ln.x2 * scale.feetPerPdfUnit;
    const y2Ft = ln.y2 * scale.feetPerPdfUnit;
    const id1 = snap(x1Ft, y1Ft);
    const id2 = snap(x2Ft, y2Ft);
    if (id1 === id2) continue;
    const key = id1 < id2 ? `${id1}-${id2}` : `${id2}-${id1}`;
    if (wallSet.has(key)) continue;
    wallSet.add(key);
    walls.push({ id: nextWallId++, startId: id1, endId: id2, thicknessInches: ln.width / scale.pdfUnitsPerFoot * 12 });
  }

  return { nodes, walls, rooms, warnings };
}

