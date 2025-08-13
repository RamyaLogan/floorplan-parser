
/**
 * Determine feetPerPdfUnit based on sheet scale text or a dimension measurement.
 * For now, we assume default 72 units per inch and 12 inches per foot.
 * That gives feetPerPdfUnit = 1 / (72*12), then allow override.
 */
export function detectScale({ texts, pdfUnitsPerInch } : { texts: any[], pdfUnitsPerInch: number }) {
  // TODO: try to parse explicit scale strings in `texts` (e.g., "SCALE: 1/4" = 1'-0"")
  const feetPerPdfUnit = 1 / (pdfUnitsPerInch * 12);
  const pdfUnitsPerFoot = 1 / feetPerPdfUnit;
  return {
    feetPerPdfUnit,
    pdfUnitsPerFoot,
    note: 'default scale (no sheet scale parsed yet)'
  };
}
