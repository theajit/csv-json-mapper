import { useState } from 'react';
import { Send, Plus, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useExport } from '../../hooks/useExport';

export default function ApiUploader() {
  const { state, dispatch } = useAppContext();
  const { uploadToApi } = useExport();
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const updateConfig = (changes) => {
    dispatch({ type: 'SET_API_CONFIG', payload: changes });
  };

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index, field, value) => {
    const updated = [...headers];
    updated[index] = { ...updated[index], [field]: value };
    setHeaders(updated);

    // Sync to state
    const headerObj = {};
    updated.forEach(h => {
      if (h.key.trim()) headerObj[h.key] = h.value;
    });
    updateConfig({ headers: headerObj });
  };

  const handleSend = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await uploadToApi();
      setResult(res);
    } catch (err) {
      setResult({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload to API</h3>

      <div className="space-y-4">
        <div className="flex gap-3">
          <select
            value={state.apiConfig.method}
            onChange={(e) => updateConfig({ method: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
          </select>
          <input
            type="text"
            value={state.apiConfig.url}
            onChange={(e) => updateConfig({ url: e.target.value })}
            placeholder="https://api.example.com/data"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>

        {/* Custom Headers */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-600">Headers</label>
            <button
              onClick={addHeader}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
            >
              <Plus size={12} /> Add Header
            </button>
          </div>
          <div className="space-y-2">
            {headers.map((header, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(i, 'key', e.target.value)}
                  placeholder="Header name"
                  className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(i, 'value', e.target.value)}
                  placeholder="Value"
                  className="flex-1 px-2.5 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <button
                  onClick={() => removeHeader(i)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSend}
          disabled={!state.apiConfig.url || loading || !state.transformedData.length}
          className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send size={16} />
              Send to API
            </>
          )}
        </button>

        {result && (
          <div
            className={`p-3 rounded-lg border text-sm ${
              result.success
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            <div className="flex items-center gap-2 font-medium mb-1">
              {result.success ? (
                <><CheckCircle size={16} /> Success (Status {result.status})</>
              ) : (
                <><AlertCircle size={16} /> {result.error || `Error (Status ${result.status})`}</>
              )}
            </div>
            {result.responseBody && (
              <pre className="mt-2 text-xs font-mono bg-white/50 p-2 rounded overflow-auto max-h-32">
                {typeof result.responseBody === 'string'
                  ? result.responseBody
                  : JSON.stringify(result.responseBody, null, 2)}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
