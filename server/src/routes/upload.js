import { Router } from 'express';
import Papa from 'papaparse';
import upload from '../middleware/fileUpload.js';

const router = Router();

router.post('/', upload.single('file'), (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    // Strip UTF-8 BOM if present, then decode as UTF-8
    let text = req.file.buffer.toString('utf-8');
    if (text.charCodeAt(0) === 0xFEFF) {
      text = text.slice(1);
    }
    const ext = req.file.originalname.toLowerCase().slice(req.file.originalname.lastIndexOf('.'));

    let data, fields;

    if (ext === '.csv') {
      const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false });
      data = result.data;
      fields = result.meta.fields;
    } else {
      const parsed = JSON.parse(text);
      data = Array.isArray(parsed) ? parsed : [parsed];
      fields = data.length > 0 ? extractFields(data[0]) : [];
    }

    res.json({
      success: true,
      data,
      fields,
      rowCount: data.length,
      fileType: ext.replace('.', '')
    });
  } catch (err) {
    next(err);
  }
});

function extractFields(obj, prefix = '') {
  let fields = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      fields = fields.concat(extractFields(obj[key], fullKey));
    } else {
      fields.push(fullKey);
    }
  }
  return fields;
}

export default router;
