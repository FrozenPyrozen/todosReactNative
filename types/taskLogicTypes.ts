import { TASK_REDUCER_TYPES } from '@/constants/taskReducer';

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodoListResponse {
  todos: Todo[];
  total: number;
  skip: number;
  limit: number;
}

// task logic types
export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

// task context types
export type AppState = {
  tasks: Task[];
};

export type TaskAction =
  | { type: TASK_REDUCER_TYPES.ADD_TASK; payload: Task['title'] }
  | { type: TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION; payload: Task['id'] }
  | { type: TASK_REDUCER_TYPES.DELETE_TASK; payload: Task['id'] };

export type TaskContextType = {
  tasks: Task[];
  addTask: (title: Task['title']) => void;
  toggleTaskCompletion: (id: Task['id']) => void;
  deleteTask: (id: Task['id']) => void;
};
