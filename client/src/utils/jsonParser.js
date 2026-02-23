export function parseJson(text) {
  const parsed = JSON.parse(text);
  const data = Array.isArray(parsed) ? parsed : [parsed];
  const fields = data.length > 0 ? extractFields(data[0]) : [];
  return { data, fields, errors: [] };
}

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
