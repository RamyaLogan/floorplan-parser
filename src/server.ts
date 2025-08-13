
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { z } from 'zod';
import { parseFloorplan } from './parse/parseFloorplan.js';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const querySchema = z.object({
  page: z.string().optional().transform((v) => (v ? parseInt(v, 10) : undefined)),
});

app.post('/api/parse-floorplan', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Missing pdf file (multipart field name "pdf")' });
    }
    const q = querySchema.parse(req.query);
    const page = q.page ?? undefined;

    const result = await parseFloorplan({
      pdfPath: req.file.path,
      page
    });

    res.json(result);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err?.message ?? 'Unknown error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`[floorplan-parser] listening on http://localhost:${PORT}`);
});
