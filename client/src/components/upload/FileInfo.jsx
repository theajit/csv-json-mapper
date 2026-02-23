import { FileSpreadsheet, FileJson, Hash, Rows3, X } from 'lucide-react';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function FileInfo({ file, fields, rowCount, onRemove }) {
  if (!file) return null;

  const Icon = file.type === 'csv' ? FileSpreadsheet : FileJson;

  return (
    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-lg">
          <Icon size={20} className="text-green-600" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-gray-900">{file.name}</p>
          <p className="text-sm text-gray-500">{formatSize(file.size)} &middot; {file.type.toUpperCase()}</p>
        </div>
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove file"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <div className="flex gap-6 mt-3 pt-3 border-t border-green-200">
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Hash size={14} />
          <span>{fields.length} fields detected</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Rows3 size={14} />
          <span>{rowCount} rows</span>
        </div>
      </div>
    </div>
  );
}
