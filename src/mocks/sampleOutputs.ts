import type { NodeOut, WallOut, DimensionOut, RoomOut } from '../schema.js';

export function makeMockRect(): { nodes: NodeOut[]; walls: WallOut[]; dimensions: DimensionOut[]; rooms: RoomOut[] } {
  const nodes: NodeOut[] = [
    { id: 1, xFt: 0, yFt: 0 },
    { id: 2, xFt: 48, yFt: 0 },
    { id: 3, xFt: 48, yFt: 30 },
    { id: 4, xFt: 0, yFt: 30 },
  ];
  const walls: WallOut[] = [
    { id: 1, startId: 1, endId: 2, thicknessInches: 6 },
    { id: 2, startId: 2, endId: 3, thicknessInches: 6 },
    { id: 3, startId: 3, endId: 4, thicknessInches: 6 },
    { id: 4, startId: 4, endId: 1, thicknessInches: 6 },
  ];
  const dimensions: DimensionOut[] = [
    { id: 1, text: "48'-0\"", valueFt: 48, p1Ft: { x: 0, y: 0 }, p2Ft: { x: 48, y: 0 }, type: 'overall' },
    { id: 2, text: "30'-0\"", valueFt: 30, p1Ft: { x: 48, y: 0 }, p2Ft: { x: 48, y: 30 }, type: 'overall' },
  ];
  const rooms: RoomOut[] = [];
  return { nodes, walls, dimensions, rooms };
}

