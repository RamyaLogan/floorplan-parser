import type { TextItem } from './readPdf.js';
import type { ScaleInfo } from '../schema.js';

export function detectScale({ textItems, pdfUnitsPerInch }: { textItems: TextItem[]; pdfUnitsPerInch: number }): ScaleInfo {
  const allText = textItems.map(t => t.text.toUpperCase()).join(' ');
  const match = allText.match(/SCALE\s*:?\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*"?\s*=\s*1['′]?/);
  if (match) {
    const num = parseFloat(match[1]);
    const den = parseFloat(match[2]);
    if (num > 0) {
      const inchesPerFoot = den / num;
      const pdfUnitsPerFoot = inchesPerFoot * pdfUnitsPerInch;
      return { feetPerPdfUnit: 1 / pdfUnitsPerFoot, pdfUnitsPerFoot, source: 'sheet' };
    }
  }
  return { feetPerPdfUnit: 1 / 864, pdfUnitsPerFoot: 864, source: 'default', note: 'no explicit sheet scale found' };
}

