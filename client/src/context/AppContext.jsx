import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  currentStep: 1,
  // File A (primary)
  fileA: null,
  dataA: [],
  fieldsA: [],
  // File B (secondary, optional)
  fileB: null,
  dataB: [],
  fieldsB: [],
  // Merge config
  mergeMode: 'single',  // 'single' | 'join' | 'append'
  joinKeyA: '',
  joinKeyB: '',
  // Merged data used by mapper
  sourceData: [],
  sourceFields: [],
  mappings: [],
  outputFormat: 'json',
  jsonObjectConfig: {
    keyField: '',
    valueMode: 'object', // 'object' | 'field'
    valueField: ''
  },
  transformedData: [],
  apiConfig: {
    url: '',
    method: 'POST',
    headers: {}
  }
};

function buildMappings(fields) {
  return fields.map((field, i) => ({
    id: `m${i}`,
    sourceField: field,
    targetField: field.replace(/^[AB]::/, ''),
    included: true,
    source: field.startsWith('B::') ? 'B' : 'A',
    transforms: {
      defaultValue: '',
      typeCast: 'string',
      prefix: '',
      suffix: ''
    }
  }));
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

function mergeData(state) {
  const { dataA, dataB, fieldsA, fieldsB, mergeMode, joinKeyA, joinKeyB } = state;

  if (mergeMode === 'single' || dataB.length === 0) {
    return { sourceData: dataA, sourceFields: fieldsA };
  }

  // Prefix fields to avoid name collisions between files
  const prefixedFieldsA = fieldsA.map(f => `A::${f}`);
  const prefixedFieldsB = fieldsB.map(f => `B::${f}`);
  const allFields = [...prefixedFieldsA, ...prefixedFieldsB];

  if (mergeMode === 'join' && joinKeyA && joinKeyB) {
    // Build index on File B's join key
    const bIndex = new Map();
    dataB.forEach(row => {
      const key = String(getNestedValue(row, joinKeyB) ?? '');
      if (!bIndex.has(key)) bIndex.set(key, []);
      bIndex.get(key).push(row);
    });

    const merged = [];
    for (const rowA of dataA) {
      const key = String(getNestedValue(rowA, joinKeyA) ?? '');
      const matchesB = bIndex.get(key) || [null];
      for (const rowB of matchesB) {
        const out = {};
        for (const f of fieldsA) out[`A::${f}`] = getNestedValue(rowA, f);
        for (const f of fieldsB) out[`B::${f}`] = rowB ? getNestedValue(rowB, f) : null;
        merged.push(out);
      }
    }
    return { sourceData: merged, sourceFields: allFields };
  }

  // Append mode: pair rows by index
  const maxLen = Math.max(dataA.length, dataB.length);
  const merged = [];
  for (let i = 0; i < maxLen; i++) {
    const out = {};
    const rowA = dataA[i];
    const rowB = dataB[i];
    for (const f of fieldsA) out[`A::${f}`] = rowA ? getNestedValue(rowA, f) : null;
    for (const f of fieldsB) out[`B::${f}`] = rowB ? getNestedValue(rowB, f) : null;
    merged.push(out);
  }
  return { sourceData: merged, sourceFields: allFields };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_FILE_A':
      return { ...state, fileA: action.payload };
    case 'SET_DATA_A': {
      const next = { ...state, dataA: action.payload.data, fieldsA: action.payload.fields };
      const { sourceData, sourceFields } = mergeData(next);
      return { ...next, sourceData, sourceFields, mappings: buildMappings(sourceFields) };
    }
    case 'SET_FILE_B':
      return { ...state, fileB: action.payload };
    case 'SET_DATA_B': {
      const next = {
        ...state,
        dataB: action.payload.data,
        fieldsB: action.payload.fields,
        mergeMode: 'append'
      };
      const { sourceData, sourceFields } = mergeData(next);
      return { ...next, sourceData, sourceFields, mappings: buildMappings(sourceFields) };
    }
    case 'REMOVE_FILE_B': {
      const next = {
        ...state,
        fileB: null, dataB: [], fieldsB: [],
        mergeMode: 'single', joinKeyA: '', joinKeyB: ''
      };
      const { sourceData, sourceFields } = mergeData(next);
      return { ...next, sourceData, sourceFields, mappings: buildMappings(sourceFields) };
    }
    case 'SET_MERGE_CONFIG': {
      const next = { ...state, ...action.payload };
      const { sourceData, sourceFields } = mergeData(next);
      return { ...next, sourceData, sourceFields, mappings: buildMappings(sourceFields) };
    }
    case 'SET_MAPPINGS':
      return { ...state, mappings: action.payload };
    case 'UPDATE_MAPPING':
      return {
        ...state,
        mappings: state.mappings.map(m =>
          m.id === action.payload.id ? { ...m, ...action.payload } : m
        )
      };
    case 'SET_OUTPUT_FORMAT':
      return { ...state, outputFormat: action.payload };
    case 'SET_JSON_OBJECT_CONFIG':
      return {
        ...state,
        jsonObjectConfig: { ...state.jsonObjectConfig, ...action.payload }
      };
    case 'SET_TRANSFORMED_DATA':
      return {
        ...state,
        transformedData: action.payload,
        jsonObjectConfig: syncJsonObjectConfig(state.jsonObjectConfig, action.payload)
      };
    case 'SET_API_CONFIG':
      return { ...state, apiConfig: { ...state.apiConfig, ...action.payload } };
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

function syncJsonObjectConfig(config, transformedData) {
  if (!Array.isArray(transformedData) || transformedData.length === 0) return config;

  const fields = Object.keys(transformedData[0] || {});
  if (!fields.length) return config;

  const next = { ...config };
  if (!next.keyField || !fields.includes(next.keyField)) {
    next.keyField = fields[0];
  }
  if (next.valueMode === 'field' && (!next.valueField || !fields.includes(next.valueField))) {
    next.valueField = fields[0];
  }
  return next;
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
