import { Todo, TodoListResponse } from '@/types/taskLogicTypes';
import axios from 'axios';

const ENDPOINT = 'https://dummyjson.com/todos';

/**
 * Fetch all todos with optional pagination.
 * @param limit - Number of items to fetch.
 * @param skip - Number of items to skip for pagination.
 * @returns A Promise resolving to the list of todos.
 */
export const fetchTodos = async (
  limit?: number,
  skip?: number
): Promise<TodoListResponse> => {
  try {
    const response = await axios.get<TodoListResponse>(ENDPOINT, {
      params: { limit, skip },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add a new todo.
 * @param todo - Partial Todo object containing the new todo details.
 * @returns A Promise resolving to the created todo.
 */
export const addTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  try {
    const response = await axios.post<Todo>(`${ENDPOINT}/add`, todo, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update an existing todo.
 * @param id - ID of the todo to update.
 * @param updates - Partial Todo object with updated data.
 * @returns A Promise resolving to the updated todo.
 */
export const updateTodo = async (
  id: number,
  updates: Partial<Todo>
): Promise<Todo> => {
  try {
    const response = await axios.put<Todo>(`${ENDPOINT}/${id}`, updates, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete a todo.
 * @param id - ID of the todo to delete.
 * @returns A Promise resolving to the deleted todo.
 */
export const deleteTodo = async (id: number): Promise<Todo> => {
  try {
    const response = await axios.delete<Todo>(`${ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Handles API errors by logging and throwing them further.
 * @param error - The caught error object.
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.error(
      `API Error: ${JSON.stringify(error.response?.status)} - ${JSON.stringify(
        error.response?.data
      )}`
    );
    throw new Error(error.response?.data || error.message);
  }
  console.error('Unexpected Error:', error);
  throw new Error('An unexpected error occurred.');
};
