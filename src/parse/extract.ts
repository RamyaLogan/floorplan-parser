
/**
 * Extract vector paths (strokes/fills) and text runs from the chosen page.
 * Return everything in PAGE USER SPACE coordinates.
 *
 * Replace the mock with real pdfjs-dist content stream parsing.
 */
export async function extractPathsAndTexts(doc: any, page?: number): Promise<{
  paths: Array<{ points: {x:number,y:number}[], strokeWidth?: number, color?: {r:number,g:number,b:number}, isClosed?: boolean, filled?: boolean }>;
  texts: Array<{ text: string, bbox: {x:number,y:number,w:number,h:number}, fontSize?: number }>;
  pdfUnitsPerInch: number;
}> {
  // TODO: Real implementation
  // pdfUnitsPerInch in PDF default is 72 (user units per inch)
  return {
    paths: [],
    texts: [],
    pdfUnitsPerInch: 72
  };
}
