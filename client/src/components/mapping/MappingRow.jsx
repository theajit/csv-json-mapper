import { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import TransformOptions from './TransformOptions';

export default function MappingRow({ mapping }) {
  const { state, dispatch } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const hasTwoFiles = state.dataB.length > 0;

  const isDuplicate =
    mapping.targetField &&
    state.mappings.filter(m => m.included && m.targetField === mapping.targetField).length > 1;

  const update = (changes) => {
    dispatch({ type: 'UPDATE_MAPPING', payload: { id: mapping.id, ...changes } });
  };

  // Display the field name without the A:: / B:: prefix
  const displayName = mapping.sourceField.replace(/^[AB]::/, '');
  const fileBadge = mapping.sourceField.startsWith('B::') ? 'B' : 'A';

  return (
    <div className={`${!mapping.included ? 'opacity-50' : ''}`}>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] gap-3 px-4 py-3 items-center">
        <input
          type="checkbox"
          checked={mapping.included}
          onChange={(e) => update({ included: e.target.checked })}
          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />

        <div className="flex items-center gap-2">
          {hasTwoFiles && (
            <span
              className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                fileBadge === 'A'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {fileBadge}
            </span>
          )}
          <div className="px-3 py-1.5 bg-gray-100 rounded-lg text-sm font-mono text-gray-700 truncate">
            {displayName}
          </div>
        </div>

        <ArrowRight size={16} className="text-gray-400 mx-1" />

        <input
          type="text"
          value={mapping.targetField}
          onChange={(e) => update({ targetField: e.target.value })}
          placeholder="Target field name"
          className={`px-3 py-1.5 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 ${
            isDuplicate
              ? 'border-red-300 focus:ring-red-200 bg-red-50'
              : 'border-gray-300 focus:ring-blue-200'
          }`}
        />

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
          title="Transform options"
        >
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </button>
      </div>

      {isDuplicate && (
        <div className="px-4 pb-1 -mt-1">
          <p className="text-xs text-red-500">Duplicate target field name</p>
        </div>
      )}

      {expanded && (
        <TransformOptions mapping={mapping} onUpdate={update} />
      )}
    </div>
  );
}
