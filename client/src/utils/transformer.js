export function applyMappings(sourceData, mappings) {
  return sourceData.map(row => {
    const output = {};
    for (const mapping of mappings) {
      if (!mapping.included) continue;
      let value = getNestedValue(row, mapping.sourceField);
      value = applyTransforms(value, mapping.transforms);
      output[mapping.targetField] = value;
    }
    return output;
  });
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

function applyTransforms(value, transforms) {
  if (!transforms) return value;

  if ((value === null || value === undefined || value === '') && transforms.defaultValue) {
    value = transforms.defaultValue;
  }
  if (transforms.typeCast && transforms.typeCast !== 'string') {
    value = castType(value, transforms.typeCast);
  }
  if (transforms.prefix) value = transforms.prefix + value;
  if (transforms.suffix) value = value + transforms.suffix;

  return value;
}

function castType(value, type) {
  switch (type) {
    case 'number': return Number(value);
    case 'boolean': return Boolean(value);
    case 'date': return new Date(value).toISOString();
    default: return String(value ?? '');
  }
}
