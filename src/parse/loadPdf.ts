
/**
 * PDF loader stub
 *
 * In production, use pdfjs-dist to open the PDF and hand a document proxy to extract.ts.
 * Kept separate so you can swap in pdf-lib or a native bridge later.
 */
export async function loadPdfDoc(pdfPath: string): Promise<any> {
  // TODO: implement real pdfjs-dist load here.
  // For now we just return the file path; extract.ts will know what to do (mock).
  return { pdfPath };
}
