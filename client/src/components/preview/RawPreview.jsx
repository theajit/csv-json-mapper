import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function RawPreview({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative border border-gray-200 rounded-lg">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
      >
        {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
      <pre className="p-4 text-sm font-mono text-gray-700 overflow-auto max-h-[400px] whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}
