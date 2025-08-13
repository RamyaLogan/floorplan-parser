import type { DimText, LinePdf } from './extractVectors.js';
import type { ScaleInfo, DimensionOut } from '../schema.js';

interface ResolveResult {
  dimensions: DimensionOut[];
  warnings: string[];
}

export function resolveDims({ dimText, wallLinesPdf, scale }: { dimText: DimText[]; wallLinesPdf: LinePdf[]; scale: ScaleInfo }): ResolveResult {
  const dimensions: DimensionOut[] = [];
  const warnings: string[] = [];
  let id = 1;
  for (const dt of dimText) {
    const valueFt = parseDim(dt.text);
    if (valueFt == null) continue;
    const center = { x: dt.x + dt.width / 2, y: dt.y + dt.height / 2 };
    let best: LinePdf | undefined;
    let bestDist = Infinity;
    for (const line of wallLinesPdf) {
      const dist = pointToSegmentDistance(center, line);
      if (dist < bestDist) {
        bestDist = dist;
        best = line;
      }
    }
    if (!best) {
      warnings.push(`no wall line found for dimension "${dt.text}"`);
      continue;
    }
    dimensions.push({
      id: id++,
      text: dt.text,
      valueFt,
      p1Ft: { x: best.x1 * scale.feetPerPdfUnit, y: best.y1 * scale.feetPerPdfUnit },
      p2Ft: { x: best.x2 * scale.feetPerPdfUnit, y: best.y2 * scale.feetPerPdfUnit },
      type: 'overall',
    });
  }
  return { dimensions, warnings };
}

function parseDim(text: string): number | null {
  const m = text.match(/(\d+)\s*'\s*-?\s*(\d+)?/);
  if (!m) return null;
  const feet = parseInt(m[1], 10);
  const inches = m[2] ? parseInt(m[2], 10) : 0;
  return feet + inches / 12;
}

function pointToSegmentDistance(p: { x: number; y: number }, l: LinePdf): number {
  const { x1, y1, x2, y2 } = l;
  const A = p.x - x1;
  const B = p.y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = lenSq !== 0 ? dot / lenSq : -1;
  if (param < 0) {
    param = 0;
  } else if (param > 1) {
    param = 1;
  }
  const xx = x1 + param * C;
  const yy = y1 + param * D;
  const dx = p.x - xx;
  const dy = p.y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

