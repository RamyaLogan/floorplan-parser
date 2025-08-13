import type { ParseArgs, ParseResponse } from '../schema.js';
import { readPdf } from './readPdf.js';
import { detectScale } from './detectScale.js';
import { extractVectors } from './extractVectors.js';
import { resolveDims } from './resolveDims.js';
import { topology } from './topology.js';
import { toJson } from './toJson.js';

export async function parseFloorplan(args: ParseArgs): Promise<ParseResponse> {
  const page = await readPdf(args.pdfPath, args.page);
  const textItems = await page.extractTextItems();
  const scale = detectScale({ textItems, pdfUnitsPerInch: page.pdfUnitsPerInch });
  const opList = await page.getOperatorList();
  const vectors = extractVectors({ opList, textItems });
  const dimRes = resolveDims({ dimText: vectors.dimText, wallLinesPdf: vectors.wallLinesPdf, scale });
  const topo = topology({ wallLinesPdf: vectors.wallLinesPdf, scale });
  return toJson({
    scale,
    nodes: topo.nodes,
    walls: topo.walls,
    rooms: topo.rooms,
    dimensions: dimRes.dimensions,
    warnings: [...dimRes.warnings, ...topo.warnings],
  });
}

