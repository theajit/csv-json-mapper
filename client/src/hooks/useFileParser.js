import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { parseCsv } from '../utils/csvParser';
import { parseJson } from '../utils/jsonParser';

export function useFileParser() {
  const { dispatch } = useAppContext();

  // slot: 'A' (primary) or 'B' (secondary)
  const parseFile = useCallback((file, slot = 'A') => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
          let result;

          if (ext === '.csv') {
            result = parseCsv(text);
          } else if (ext === '.json') {
            result = parseJson(text);
          } else {
            throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
          }

          dispatch({
            type: slot === 'B' ? 'SET_FILE_B' : 'SET_FILE_A',
            payload: { name: file.name, size: file.size, type: ext.replace('.', '') }
          });
          dispatch({
            type: slot === 'B' ? 'SET_DATA_B' : 'SET_DATA_A',
            payload: { data: result.data, fields: result.fields }
          });

          resolve(result);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file, 'UTF-8');
    });
  }, [dispatch]);

  return { parseFile };
}
