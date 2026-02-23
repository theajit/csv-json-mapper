import { useAppContext } from '../../context/AppContext';
import { Link, Rows3 } from 'lucide-react';

export default function MergeConfig() {
  const { state, dispatch } = useAppContext();
  const { mergeMode, joinKeyA, joinKeyB, fieldsA, fieldsB } = state;

  const update = (changes) => {
    dispatch({ type: 'SET_MERGE_CONFIG', payload: changes });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">How should the two files be merged?</h3>

      <div className="flex gap-3">
        <button
          onClick={() => update({ mergeMode: 'append' })}
          className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
            mergeMode === 'append'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Rows3 size={18} />
          <div className="text-left">
            <div>Row-by-Row</div>
            <div className="text-xs font-normal text-gray-500">Pair rows by position (row 1 + row 1, etc.)</div>
          </div>
        </button>

        <button
          onClick={() => update({ mergeMode: 'join' })}
          className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
            mergeMode === 'join'
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Link size={18} />
          <div className="text-left">
            <div>Join on Key</div>
            <div className="text-xs font-normal text-gray-500">Match rows by a shared field value (like VLOOKUP)</div>
          </div>
        </button>
      </div>

      {mergeMode === 'join' && (
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              File A - Join Key
            </label>
            <select
              value={joinKeyA}
              onChange={(e) => update({ joinKeyA: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a field...</option>
              {fieldsA.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              File B - Join Key
            </label>
            <select
              value={joinKeyB}
              onChange={(e) => update({ joinKeyB: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select a field...</option>
              {fieldsB.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
