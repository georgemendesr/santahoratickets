
import { useState, useCallback, useEffect } from 'react';

interface AsyncState<T> {
  loading: boolean;
  data: T | null;
  error: Error | null;
}

export function useAsync<T, P extends any[]>(
  asyncFunction: (...params: P) => Promise<T>,
  immediate: boolean = false,
  initialParams?: P
) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: immediate,
    data: null,
    error: null,
  });

  const execute = useCallback(
    async (...params: P) => {
      setState({ loading: true, data: null, error: null });
      
      try {
        const result = await asyncFunction(...params);
        setState({ loading: false, data: result, error: null });
        return result;
      } catch (error) {
        setState({ 
          loading: false, 
          data: null, 
          error: error instanceof Error ? error : new Error(String(error)) 
        });
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate && initialParams) {
      execute(...initialParams);
    } else if (immediate) {
      // Fix: This is a type-safe way to handle no params
      execute([] as unknown as P);
    }
  }, [execute, immediate, initialParams]);

  return {
    ...state,
    execute,
  };
}
