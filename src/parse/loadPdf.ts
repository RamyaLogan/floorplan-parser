import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { promises as fs } from 'fs';

(pdfjs as any).disableWorker = true;

/**
 * Load a PDF document using pdfjs-dist
 *
 * Kept separate so you can swap in pdf-lib or a native bridge later.
 */
export async function loadPdfDoc(pdfPath: string): Promise<pdfjs.PDFDocumentProxy> {
  const data = await fs.readFile(pdfPath);
  const loadingTask = pdfjs.getDocument({ data });
  return loadingTask.promise;
}
