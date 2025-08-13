
# Floorplan Parser Starter (Node + TypeScript)

A minimal, production-minded starter service that turns a **vector PDF floorplan** into a graph your React floorplan editor can use.

This ships with:
- Express API (`POST /api/parse-floorplan`) with file upload (multer)
- Clear pipeline scaffolding (parse → classify → scale → graph → output)
- Strong types and a clean JSON contract
- TODOs where you’ll plug real logic (pdfjs/text extraction, geometry, etc.)

> ⚠️ This is a **starter**. It returns a tiny mock graph until you implement extraction. The pipeline & file layout are production-friendly so you can grow into it.

---

## Quick start

```bash
# inside this folder
npm i
npm run dev
# API at http://localhost:4000
```

### Test with cURL

```bash
curl -F pdf=@/path/to/your/plan.pdf http://localhost:4000/api/parse-floorplan
```

You should get a JSON payload with units, nodes, walls, etc. (mock until you wire real parsing).

---

## Project structure

```
src/
  server.ts                  # Express server + /api/parse-floorplan
  schema.ts                  # Types for output JSON (nodes, walls, dimensions...)
  parse/
    parseFloorplan.ts        # Orchestrator: calls each pipeline stage
    loadPdf.ts               # pdfjs/pdf-lib loader (TODO implement)
    extract.ts               # vector/text extraction from PDF (TODO implement)
    scale.ts                 # scale detection from dimension text (TODO implement)
    classify.ts              # separate walls vs annotations (TODO implement)
    graph.ts                 # snap, merge, build node/edge graph (TODO implement)
    dimensions.ts            # parse "48'-0"" etc + associate to edges (TODO)
```

---

## Output JSON contract (what your React app can ingest)

```ts
type Units = "ft" | "m";

interface NodeOut { id: number; xFt: number; yFt: number; }
interface WallOut { id: number; startId: number; endId: number; thicknessInches?: number; }

interface DimensionOut {
  id: number;
  text: string;                // e.g. "48'-0""
  valueFt: number;             // parsed numeric
  p1Ft: { x: number; y: number };
  p2Ft: { x: number; y: number };
  type?: "overall" | "segment" | "room";
}

interface ParseResponse {
  units: Units;               // "ft" by default
  scale: {
    feetPerPdfUnit: number;   // computed from scale or a known dimension
    pdfUnitsPerFoot: number;
    note?: string;
  };
  nodes: NodeOut[];
  walls: WallOut[];
  dimensions: DimensionOut[];
  rooms: { id: number; label?: string; polygonNodeIds: number[] }[];
}
```

Use this response to set your `cornerPoints` & `wallSegments`.

---

## Where to implement real logic

- `src/parse/loadPdf.ts` — open the PDF with `pdfjs-dist` or `pdf-lib`
- `src/parse/extract.ts` — collect **paths** (strokes/fills) and **texts** (strings+bboxes)
- `src/parse/scale.ts` — parse sheet scale (“1/4″ = 1′–0″”) or derive from a known dimension
- `src/parse/classify.ts` — split **thick walls** vs **thin annotations**
- `src/parse/graph.ts` — convert wall shapes to **centerlines**, **snap** endpoints, **build graph**
- `src/parse/dimensions.ts` — regex parse `48'-0"` strings and associate to edges

Each file is stubbed with TODOs and strongly typed function signatures.

---

## Notes

- Page selection: send `?page=5` or `form field page=5` to pick the main floor page.
- Supports multi-floor later by returning `{ floors: [...] }` with the same payload per page.
- If your PDF is **scanned** (raster) instead of vector, you’ll need OCR + vectorization. This starter focuses on **vector PDFs** (what you told me you have).

Happy building!
