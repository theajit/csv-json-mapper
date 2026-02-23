import { AppProvider, useAppContext } from './context/AppContext';
import Header from './components/layout/Header';
import StepIndicator from './components/layout/StepIndicator';
import FileUploader from './components/upload/FileUploader';
import FileInfo from './components/upload/FileInfo';
import MergeConfig from './components/upload/MergeConfig';
import MappingEditor from './components/mapping/MappingEditor';
import PreviewTable from './components/preview/PreviewTable';
import RawPreview from './components/preview/RawPreview';
import FormatSelector from './components/preview/FormatSelector';
import ExportPanel from './components/export/ExportPanel';
import { useTransform } from './hooks/useTransform';
import { formatOutput } from './utils/formatOutput';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Table, Code, Plus } from 'lucide-react';

function AppContent() {
  const { state, dispatch } = useAppContext();
  const { transform } = useTransform();
  const [previewView, setPreviewView] = useState('table');
  const [showFileB, setShowFileB] = useState(false);

  const {
    currentStep, fileA, fieldsA, dataA,
    fileB, fieldsB, dataB,
    mergeMode, sourceData, mappings, transformedData, outputFormat, jsonObjectConfig
  } = state;

  const setStep = (step) => dispatch({ type: 'SET_STEP', payload: step });

  const canAdvance = () => {
    switch (currentStep) {
      case 1: {
        if (dataA.length === 0) return false;
        if (dataB.length > 0 && mergeMode === 'join') {
          return !!(state.joinKeyA && state.joinKeyB);
        }
        return true;
      }
      case 2: return mappings.some(m => m.included && m.targetField);
      case 3: return transformedData.length > 0;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 2) {
      transform();
    }
    setStep(currentStep + 1);
  };

  const handleRemoveFileB = () => {
    dispatch({ type: 'REMOVE_FILE_B' });
    setShowFileB(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <StepIndicator currentStep={currentStep} />

      <main className="px-4 pb-24">
        {/* Step 1: Upload */}
        {currentStep === 1 && (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* File A */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                {showFileB || fileB ? 'File A (Primary)' : 'Upload File'}
              </h3>
              {!fileA ? (
                <FileUploader slot="A" />
              ) : (
                <FileInfo file={fileA} fields={fieldsA} rowCount={dataA.length} />
              )}
            </div>

            {/* Add second file button */}
            {fileA && !showFileB && !fileB && (
              <button
                onClick={() => setShowFileB(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add a second file to merge
              </button>
            )}

            {/* File B */}
            {(showFileB || fileB) && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">File B (Secondary)</h3>
                {!fileB ? (
                  <FileUploader slot="B" compact />
                ) : (
                  <FileInfo
                    file={fileB}
                    fields={fieldsB}
                    rowCount={dataB.length}
                    onRemove={handleRemoveFileB}
                  />
                )}
              </div>
            )}

            {/* Merge config */}
            {fileA && fileB && <MergeConfig />}
          </div>
        )}

        {/* Step 2: Map Fields */}
        {currentStep === 2 && <MappingEditor />}

        {/* Step 3: Preview */}
        {currentStep === 3 && (
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewView('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    previewView === 'table'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Table size={14} /> Table
                </button>
                <button
                  onClick={() => setPreviewView('raw')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    previewView === 'raw'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Code size={14} /> Raw
                </button>
              </div>
              <FormatSelector />
            </div>

            {previewView === 'table' ? (
              <PreviewTable data={transformedData} />
            ) : (
              <RawPreview text={formatOutput(transformedData, outputFormat, jsonObjectConfig)} />
            )}
          </div>
        )}

        {/* Step 4: Export */}
        {currentStep === 4 && <ExportPanel />}
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3">
        <div className="max-w-4xl mx-auto flex justify-between">
          <button
            onClick={() => setStep(currentStep - 1)}
            disabled={currentStep === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} /> Back
          </button>
          {currentStep < 4 && (
            <button
              onClick={handleNext}
              disabled={!canAdvance()}
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
