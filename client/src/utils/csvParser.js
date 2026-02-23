import Papa from 'papaparse';

export function parseCsv(text) {
  // Strip UTF-8 BOM if present so it doesn't pollute the first field name
  const cleanText = text.charCodeAt(0) === 0xFEFF ? text.slice(1) : text;
  const result = Papa.parse(cleanText, {
    header: true,
    skipEmptyLines: true,
    // Keep values as strings so codes like 01 are preserved.
    dynamicTyping: false
  });
  return {
    data: result.data,
    fields: result.meta.fields,
    errors: result.errors
  };
}

export function unparseCsv(data) {
  return Papa.unparse(data);
}
