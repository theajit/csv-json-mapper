import { useState, useRef } from 'react';
import { CloudUpload, File } from 'lucide-react';
import { useFileParser } from '../../hooks/useFileParser';

export default function FileUploader({ slot = 'A', label, compact = false, onSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { parseFile } = useFileParser();

  const handleFile = async (file) => {
    setError(null);
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!['.csv', '.json'].includes(ext)) {
      setError('Please upload a CSV or JSON file.');
      return;
    }
    setLoading(true);
    try {
      await parseFile(file, slot);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  return (
    <div>
      {label && (
        <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${
          compact ? 'p-6' : 'p-12'
        } ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : error
            ? 'border-red-300 bg-red-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
        }`}
      >
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-gray-500">Parsing file...</p>
          </div>
        ) : (
          <>
            <CloudUpload
              size={compact ? 32 : 48}
              className={`mx-auto mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}
            />
            <p className={`font-medium text-gray-700 mb-1 ${compact ? 'text-sm' : 'text-lg'}`}>
              Drag & drop a CSV or JSON file here
            </p>
            <p className="text-sm text-gray-400 mb-3">or click to browse files</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <File size={14} /> Supports .csv and .json
            </div>
          </>
        )}
      </div>
      {error && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,.json"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
}
