import { useState, useEffect, useMemo, useCallback } from 'react';
import { Todo, TodoListResponse } from '@/types/taskLogicTypes';

const ENDPOINT = 'https://dummyjson.com/todos';

type RequestState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const useFetchTodos = () => {
  const [state, setState] = useState<RequestState<TodoListResponse>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchData = useCallback(
    debounce(async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch(`${ENDPOINT}`);
        const result: TodoListResponse = await response.json();
        setState({ data: result, loading: false, error: null });
      } catch (err) {
        setState({ data: null, loading: false, error: (err as Error).message });
      }
    }, 300),
    [endpoint]
  );

  useEffect(() => {
    fetchData();
  }, dependencies);

  return useMemo(() => ({ ...state, refetch: fetchData }), [state, fetchData]);
};

export const usePostTodo = () => {
  const [state, setState] = useState<RequestState<Todo>>({
    data: null,
    loading: false,
    error: null,
  });

  const postData = useCallback(async (body: Omit<Todo, 'id'>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch('https://dummyjson.com/todos/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result: Todo = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, []);

  return useMemo(() => ({ ...state, postData }), [state, postData]);
};

export const useUpdateTodo = () => {
  const [state, setState] = useState<RequestState<Todo>>({
    data: null,
    loading: false,
    error: null,
  });

  const updateData = useCallback(async (id: number, body: Partial<Todo>) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result: Todo = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, []);

  return useMemo(() => ({ ...state, updateData }), [state, updateData]);
};

export const useDeleteTodo = () => {
  const [state, setState] = useState<RequestState<Todo>>({
    data: null,
    loading: false,
    error: null,
  });

  const deleteData = useCallback(async (id: number) => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetch(`https://dummyjson.com/todos/${id}`, {
        method: 'DELETE',
      });
      const result: Todo = await response.json();
      setState({ data: result, loading: false, error: null });
    } catch (err) {
      setState({ data: null, loading: false, error: (err as Error).message });
    }
  }, []);

  return useMemo(() => ({ ...state, deleteData }), [state, deleteData]);
};
