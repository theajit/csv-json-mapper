import { FileJson, RotateCcw } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function Header() {
  const { state, dispatch } = useAppContext();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 text-white p-2 rounded-lg">
          <FileJson size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">CSV/JSON Field Mapper</h1>
          <p className="text-sm text-gray-500">Map, transform, and export your data</p>
        </div>
      </div>
      {state.currentStep > 1 && (
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <RotateCcw size={16} />
          Start Over
        </button>
      )}
    </header>
  );
}
