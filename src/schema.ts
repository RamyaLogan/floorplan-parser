
export type Units = 'ft' | 'm';

export interface NodeOut {
  id: number;
  xFt: number;
  yFt: number;
}

export interface WallOut {
  id: number;
  startId: number;
  endId: number;
  thicknessInches?: number;
}

export interface DimensionOut {
  id: number;
  text: string;
  valueFt: number;
  p1Ft: { x: number; y: number };
  p2Ft: { x: number; y: number };
  type?: 'overall' | 'segment' | 'room';
}

export interface RoomOut {
  id: number;
  label?: string;
  polygonNodeIds: number[];
}

export interface ScaleInfo {
  feetPerPdfUnit: number;
  pdfUnitsPerFoot: number;
  source: string;
  note?: string;
}

export interface ParseArgs {
  pdfPath: string;
  page?: number;
}

export interface ParseResponse {
  units: Units;
  scale: ScaleInfo;
  nodes: NodeOut[];
  walls: WallOut[];
  dimensions: DimensionOut[];
  rooms: RoomOut[];
  warnings: string[];
}
