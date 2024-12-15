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
  isCreatedByUserLocally: boolean;
};

// task context types
export type AppState = {
  tasks: Task[];
  loading: {
    fetchTasks: boolean;
    addTask: boolean;
    toggleTask: boolean;
    deleteTask: boolean;
    setTasksFromStorage: boolean;
  };
  errors: {
    fetchTasks: string | null;
    addTask: string | null;
    toggleTask: string | null;
    deleteTask: string | null;
    setTasksFromStorage: string | null;
  };
};

export type TaskAction =
  | { type: TASK_REDUCER_TYPES.ADD_TASK; payload: Task }
  | { type: TASK_REDUCER_TYPES.FETCH_TASKS; payload: Task[] }
  | { type: TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION; payload: Task['id'] }
  | { type: TASK_REDUCER_TYPES.DELETE_TASK; payload: Task['id'] }
  | {
      type: TASK_REDUCER_TYPES.SET_LOADING;
      payload: 'setTasks' | 'addTask' | 'toggleTask' | 'deleteTask';
    }
  | {
      type: TASK_REDUCER_TYPES.SET_ERROR;
      payload: {
        key: 'setTasks' | 'addTask' | 'toggleTask' | 'deleteTask';
        error: string;
      };
    };

export type TaskContextType = {
  tasks: Task[];
  isFetchTasksLoading: boolean;
  addTask: (title: Task['title']) => void;
  toggleTaskCompletion: (id: Task['id']) => void;
  deleteTask: (id: Task['id']) => void;
  fetchTasks: () => void;
};
