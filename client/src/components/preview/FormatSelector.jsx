import { useAppContext } from '../../context/AppContext';

export default function FormatSelector() {
  const { state, dispatch } = useAppContext();
  const fieldsFromData = state.transformedData.length
    ? Object.keys(state.transformedData[0] || {})
    : [];
  const fieldsFromMapping = state.mappings
    .filter(m => m.included && m.targetField)
    .map(m => m.targetField);
  const fieldOptions = fieldsFromData.length ? fieldsFromData : [...new Set(fieldsFromMapping)];
  const keyField = state.jsonObjectConfig.keyField || fieldOptions[0] || '';
  const valueField = state.jsonObjectConfig.valueField || fieldOptions[0] || '';

  const formats = [
    { value: 'json', label: 'JSON' },
    { value: 'jsonByValue', label: 'JSON (Object map)' },
    { value: 'csv', label: 'CSV' }
  ];

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {formats.map(format => (
          <button
            key={format.value}
            onClick={() => dispatch({ type: 'SET_OUTPUT_FORMAT', payload: format.value })}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              state.outputFormat === format.value
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {format.label}
          </button>
        ))}
      </div>

      {state.outputFormat === 'jsonByValue' && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <label className="text-gray-500">Key</label>
          <select
            value={keyField}
            onChange={(e) => dispatch({ type: 'SET_JSON_OBJECT_CONFIG', payload: { keyField: e.target.value } })}
            disabled={!fieldOptions.length}
            className="px-2 py-1 border border-gray-300 rounded-md bg-white"
          >
            {!fieldOptions.length && <option value="">No fields</option>}
            {fieldOptions.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>

          <label className="text-gray-500">Value</label>
          <select
            value={state.jsonObjectConfig.valueMode}
            onChange={(e) => dispatch({ type: 'SET_JSON_OBJECT_CONFIG', payload: { valueMode: e.target.value } })}
            className="px-2 py-1 border border-gray-300 rounded-md bg-white"
          >
            <option value="object">Full object</option>
            <option value="field">Single field</option>
          </select>

          {state.jsonObjectConfig.valueMode === 'field' && (
            <select
              value={valueField}
              onChange={(e) => dispatch({ type: 'SET_JSON_OBJECT_CONFIG', payload: { valueField: e.target.value } })}
              disabled={!fieldOptions.length}
              className="px-2 py-1 border border-gray-300 rounded-md bg-white"
            >
              {!fieldOptions.length && <option value="">No fields</option>}
              {fieldOptions.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          )}
        </div>
      )}
    </div>
  );
}
