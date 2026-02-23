import { Router } from 'express';
import Papa from 'papaparse';

const router = Router();

router.post('/', (req, res, next) => {
  try {
    const { data, mappings, outputFormat } = req.body;

    if (!data || !mappings) {
      return res.status(400).json({ success: false, error: 'Missing data or mappings' });
    }

    const transformed = data.map(row => {
      const output = {};
      for (const mapping of mappings) {
        if (!mapping.included) continue;
        let value = getNestedValue(row, mapping.sourceField);
        if ((value === null || value === undefined || value === '') && mapping.transforms?.defaultValue) {
          value = mapping.transforms.defaultValue;
        }
        if (mapping.transforms?.typeCast) {
          value = castType(value, mapping.transforms.typeCast);
        }
        if (mapping.transforms?.prefix) value = mapping.transforms.prefix + value;
        if (mapping.transforms?.suffix) value = value + mapping.transforms.suffix;
        output[mapping.targetField] = value;
      }
      return output;
    });

    let result;
    if (outputFormat === 'csv') {
      // Prepend UTF-8 BOM so downstream tools display encoded characters correctly
      result = '\uFEFF' + Papa.unparse(transformed);
    } else {
      result = JSON.stringify(transformed, null, 2);
    }

    res.json({ success: true, result, rowCount: transformed.length });
  } catch (err) {
    next(err);
  }
});

function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

function castType(value, type) {
  switch (type) {
    case 'number': return Number(value);
    case 'boolean': return Boolean(value);
    case 'date': return new Date(value).toISOString();
    default: return String(value ?? '');
  }
}

export default router;
