
import type { ParseArgs, ParseResponse, NodeOut, WallOut, DimensionOut } from '../schema.js';
import { loadPdfDoc } from './loadPdf.js';
import { extractPathsAndTexts } from './extract.js';
import { detectScale } from './scale.js';
import { classifyStrokes } from './classify.js';
import { buildGraph } from './graph.js';
import { extractDimensions } from './dimensions.js';

/**
 * Orchestrates the full pipeline. This returns a valid ParseResponse even while
 * parts are TODO — currently includes a small mock so your app can integrate.
 */
export async function parseFloorplan(args: ParseArgs): Promise<ParseResponse> {
  // 1) Load PDF
  const doc = await loadPdfDoc(args.pdfPath);

  // 2) Extract vectors + text from the chosen page
  const { paths, texts, pdfUnitsPerInch } = await extractPathsAndTexts(doc, args.page);

  // 3) Detect scale (using sheet scale text or a known dimension measurement)
  const scale = detectScale({ texts, pdfUnitsPerInch });

  // 4) Separate walls vs annotations
  const { wallStrokes, annoStrokes, fills } = classifyStrokes({ paths });

  // 5) Build wall centerline graph
  const { nodes, walls } = buildGraph({ wallStrokes, fills, scale });

  // 6) Extract and associate dimension strings
  const dimensions = extractDimensions({ texts, scale, nodes, walls });

  // --- TEMP MOCK FALLBACK if nothing detected yet ---
  const hasAny = nodes.length > 0 && walls.length > 0;
  if (!hasAny) {
    const mockNodes: NodeOut[] = [
      { id: 101, xFt: 0, yFt: 0 },
      { id: 102, xFt: 48, yFt: 0 },
      { id: 103, xFt: 48, yFt: 30 },
      { id: 104, xFt: 0, yFt: 30 },
    ];
    const mockWalls: WallOut[] = [
      { id: 201, startId: 101, endId: 102, thicknessInches: 6 },
      { id: 202, startId: 102, endId: 103, thicknessInches: 6 },
      { id: 203, startId: 103, endId: 104, thicknessInches: 6 },
      { id: 204, startId: 104, endId: 101, thicknessInches: 6 },
    ];
    const mockDims: DimensionOut[] = [
      { id: 301, text: "48'-0\"", valueFt: 48, p1Ft: { x: 0, y: 0 }, p2Ft: { x: 48, y: 0 }, type: 'overall' }
    ];
    return {
      units: 'ft',
      scale,
      nodes: mockNodes,
      walls: mockWalls,
      dimensions: mockDims,
      rooms: []
    };
  }

  return {
    units: 'ft',
    scale,
    nodes,
    walls,
    dimensions,
    rooms: [] // TODO
  };
}
