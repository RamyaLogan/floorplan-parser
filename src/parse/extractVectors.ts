import { OPS } from 'pdfjs-dist';
import type { TextItem } from './readPdf.js';

export interface LinePdf {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
}

export interface DimText {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export function extractVectors({ opList, textItems }: { opList: any; textItems: TextItem[] }): {
  wallLinesPdf: LinePdf[];
  dimText: DimText[];
} {
  const wallLinesPdf: LinePdf[] = [];
  let currentPoint: { x: number; y: number } | null = null;
  let path: LinePdf[] = [];
  let lineWidth = 0;
  for (let i = 0; i < opList.fnArray.length; i++) {
    const fn = opList.fnArray[i];
    const args = opList.argsArray[i];
    switch (fn) {
      case OPS.setLineWidth:
        lineWidth = args[0];
        break;
      case OPS.moveTo:
        currentPoint = { x: args[0], y: args[1] };
        break;
      case OPS.lineTo:
        if (currentPoint) {
          path.push({ x1: currentPoint.x, y1: currentPoint.y, x2: args[0], y2: args[1], width: lineWidth });
          currentPoint = { x: args[0], y: args[1] };
        }
        break;
      case OPS.rectangle: {
        const [x, y, w, h] = args;
        path.push({ x1: x, y1: y, x2: x + w, y2: y, width: lineWidth });
        path.push({ x1: x + w, y1: y, x2: x + w, y2: y + h, width: lineWidth });
        path.push({ x1: x + w, y1: y + h, x2: x, y2: y + h, width: lineWidth });
        path.push({ x1: x, y1: y + h, x2: x, y2: y, width: lineWidth });
        break;
      }
      case OPS.closePath:
        if (currentPoint && path.length) {
          const first = path[0];
          path.push({ x1: currentPoint.x, y1: currentPoint.y, x2: first.x1, y2: first.y1, width: lineWidth });
        }
        break;
      case OPS.stroke:
      case OPS.closeStroke:
      case OPS.stroke:
      case OPS.closeStroke:
      case OPS.fillStroke:
      case OPS.closeFillStroke:
      case OPS.eoFillStroke:
      case OPS.closeEOFillStroke:
        for (const ln of path) {
          if (ln.width >= 2) wallLinesPdf.push(ln);
        }
        path = [];
        currentPoint = null;
        break;
      case OPS.fill:
      case OPS.eoFill:
        path = [];
        currentPoint = null;
        break;
      default:
        break;
    }
  }

  const dimText: DimText[] = [];
  for (const t of textItems) {
    if (t.text.includes("'") || t.text.includes('"')) {
      const x = t.transform[4];
      const y = t.transform[5];
      dimText.push({ text: t.text, x, y, width: t.width, height: t.height });
    }
  }
  return { wallLinesPdf, dimText };
}

