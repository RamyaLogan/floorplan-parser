import { describe, it, expect } from 'vitest';
import { parseFloorplan } from '../parse/parseFloorplan.js';
import { PDFDocument } from 'pdf-lib';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

describe('parseFloorplan', () => {
  it('returns mock rectangle when no vectors detected', async () => {
    const pdf = await PDFDocument.create();
    pdf.addPage([300, 300]);
    const bytes = await pdf.save();
    const file = join(tmpdir(), 'blank.pdf');
    writeFileSync(file, bytes);
    const result = await parseFloorplan({ pdfPath: file });
    expect(result.nodes.length).toBe(4);
    expect(result.walls.length).toBe(4);
    expect(result.dimensions.length).toBeGreaterThan(0);
    expect(result.warnings).toContain('returned mock rectangle');
  });
});

