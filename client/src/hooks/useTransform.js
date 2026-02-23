import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { applyMappings } from '../utils/transformer';

export function useTransform() {
  const { state, dispatch } = useAppContext();

  const transform = useCallback(() => {
    const result = applyMappings(state.sourceData, state.mappings);
    dispatch({ type: 'SET_TRANSFORMED_DATA', payload: result });
    return result;
  }, [state.sourceData, state.mappings, dispatch]);

  return { transform };
}
