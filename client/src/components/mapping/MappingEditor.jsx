import { useAppContext } from '../../context/AppContext';
import MappingRow from './MappingRow';
import { Wand2, Trash2 } from 'lucide-react';

export default function MappingEditor() {
  const { state, dispatch } = useAppContext();
  const { mappings } = state;

  const mappedCount = mappings.filter(m => m.included && m.targetField).length;

  const autoMapAll = () => {
    dispatch({
      type: 'SET_MAPPINGS',
      payload: mappings.map(m => ({ ...m, targetField: m.sourceField.replace(/^[AB]::/, ''), included: true }))
    });
  };

  const clearAll = () => {
    dispatch({
      type: 'SET_MAPPINGS',
      payload: mappings.map(m => ({ ...m, targetField: '', included: false }))
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Map Fields</h2>
          <p className="text-sm text-gray-500">
            {mappedCount} of {mappings.length} fields mapped
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={autoMapAll}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Wand2 size={14} />
            Auto-map All
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-3 px-4 py-2.5 bg-gray-50 rounded-t-xl text-xs font-medium text-gray-500 uppercase tracking-wide">
          <span></span>
          <span>Source Field</span>
          <span></span>
          <span>Target Field</span>
          <span></span>
        </div>
        {mappings.map(mapping => (
          <MappingRow key={mapping.id} mapping={mapping} />
        ))}
      </div>
    </div>
  );
}
