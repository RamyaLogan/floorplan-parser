import type { ScaleInfo, NodeOut, WallOut, RoomOut, DimensionOut, ParseResponse } from '../schema.js';
import { makeMockRect } from '../mocks/sampleOutputs.js';

interface ToJsonArgs {
  scale: ScaleInfo;
  nodes: NodeOut[];
  walls: WallOut[];
  rooms: RoomOut[];
  dimensions: DimensionOut[];
  warnings: string[];
}

export function toJson({ scale, nodes, walls, rooms, dimensions, warnings }: ToJsonArgs): ParseResponse {
  if (nodes.length === 0 || walls.length === 0) {
    const mock = makeMockRect();
    return {
      units: 'ft',
      scale,
      nodes: mock.nodes,
      walls: mock.walls,
      dimensions: mock.dimensions,
      rooms: mock.rooms,
      warnings: [...warnings, 'returned mock rectangle'],
    };
  }
  return { units: 'ft', scale, nodes, walls, dimensions, rooms, warnings };
}

