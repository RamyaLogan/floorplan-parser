import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

GlobalWorkerOptions.workerSrc = undefined as any;

export interface TextItem {
  text: string;
  transform: number[];
  width: number;
  height: number;
}

export interface PdfPageInfo {
  width: number;
  height: number;
  pdfUnitsPerInch: number;
  getOperatorList: () => Promise<any>;
  getTextContent: () => Promise<any>;
  extractTextItems: () => Promise<TextItem[]>;
}

export async function readPdf(pdfPath: string, pageNumber?: number): Promise<PdfPageInfo> {
  const loadingTask = getDocument(pdfPath);
  const doc = await loadingTask.promise;
  const pageIdx = pageNumber && pageNumber > 0 ? pageNumber : 1;
  const page = await doc.getPage(pageIdx);
  const view = page.view;
  const width = view[2] - view[0];
  const height = view[3] - view[1];
  const pdfUnitsPerInch = 72 * (page.userUnit || 1);
  const getOperatorList = () => page.getOperatorList();
  const getTextContent = () => page.getTextContent();
  const extractTextItems = async (): Promise<TextItem[]> => {
    const tc = await getTextContent();
    return tc.items.map((it: any) => ({
      text: it.str,
      transform: it.transform,
      width: it.width,
      height: 'height' in it ? it.height : it.fontHeight || 0,
    }));
  };
  return { width, height, pdfUnitsPerInch, getOperatorList, getTextContent, extractTextItems };
}

