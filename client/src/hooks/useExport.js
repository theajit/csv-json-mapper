import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatOutput } from '../utils/formatOutput';

export function useExport() {
  const { state } = useAppContext();

  const download = useCallback(() => {
    const output = formatOutput(state.transformedData, state.outputFormat, state.jsonObjectConfig);
    const ext = state.outputFormat === 'csv' ? '.csv' : '.json';

    // Prepend UTF-8 BOM for CSV so Excel correctly displays encoded/multilingual characters
    const bom = state.outputFormat === 'csv' ? '\uFEFF' : '';
    const mimeType = state.outputFormat === 'csv'
      ? 'text/csv;charset=utf-8'
      : 'application/json;charset=utf-8';
    const blob = new Blob([bom + output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapped_output${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.transformedData, state.outputFormat, state.jsonObjectConfig]);

  const uploadToApi = useCallback(async () => {
    const { url, method, headers } = state.apiConfig;
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetUrl: url,
        method,
        headers,
        data: state.transformedData
      })
    });
    return response.json();
  }, [state.transformedData, state.apiConfig]);

  return { download, uploadToApi };
}
