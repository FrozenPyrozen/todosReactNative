import { useEffect } from 'react';

export default function usePersistState<T>({
  state,
  loadState,
  saveState,
  onLoadState,
  dependency = [],
}: {
  state: T;
  loadState: () => Promise<T | null>;
  saveState: (state: T) => Promise<void>;
  onLoadState: (loadedState: T | null) => void;
  dependency?: any[];
}) {
  useEffect(() => {
    const initializeState = async () => {
      const storedState = await loadState();
      onLoadState(storedState);
    };
    initializeState();
  }, []);

  useEffect(() => {
    const persistState = async () => {
      if (state) {
        await saveState(state);
      }
    };
    persistState();
  }, [state, ...dependency]);
}
