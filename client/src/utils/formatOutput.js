import { unparseCsv } from './csvParser';

function toKeyedObject(data, config = {}) {
  if (!Array.isArray(data)) return {};

  const sample = data.find(item => item && typeof item === 'object') || {};
  const fallbackField = Object.keys(sample)[0] || 'value';
  const keyField = config.keyField || (sample.value !== undefined ? 'value' : fallbackField);
  const valueMode = config.valueMode || 'object';
  const valueField = config.valueField || 'sap_value';

  return data.reduce((acc, item) => {
    if (!item || typeof item !== 'object') return acc;
    const key = item[keyField] ?? item[fallbackField];
    if (key === null || key === undefined || key === '') return acc;

    if (valueMode === 'field') {
      acc[String(key)] = item[valueField];
    } else {
      acc[String(key)] = item;
    }

    return acc;
  }, {});
}

export function formatOutput(data, format, jsonObjectConfig) {
  if (format === 'csv') return unparseCsv(data);
  if (format === 'jsonByValue') return JSON.stringify(toKeyedObject(data, jsonObjectConfig), null, 2);
  return JSON.stringify(data, null, 2);
}
