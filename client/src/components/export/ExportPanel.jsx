import { Download } from 'lucide-react';
import { useExport } from '../../hooks/useExport';
import { useAppContext } from '../../context/AppContext';
import FormatSelector from '../preview/FormatSelector';
import ApiUploader from './ApiUploader';

export default function ExportPanel() {
  const { state } = useAppContext();
  const { download } = useExport();
  const formatLabel = state.outputFormat === 'jsonByValue' ? 'JSON (Object map)' : state.outputFormat.toUpperCase();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Download Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Download File</h3>
        <div className="flex items-center gap-4">
          <FormatSelector />
          <button
            onClick={download}
            disabled={!state.transformedData.length}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download size={16} />
            Download {formatLabel}
          </button>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          {state.transformedData.length} rows will be exported
        </p>
      </div>

      {/* API Upload Section */}
      <ApiUploader />
    </div>
  );
}
