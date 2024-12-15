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

export type LoadingAndErrorStateType =
  | 'setTasks'
  | 'addTask'
  | 'toggleTask'
  | 'deleteTask'
  | 'fetchTasks';

export type TaskAction =
  | { type: TASK_REDUCER_ACTION_TYPES.ADD_TASK; payload: Task }
  | { type: TASK_REDUCER_ACTION_TYPES.FETCH_TASKS; payload: Task[] }
  | {
      type: TASK_REDUCER_ACTION_TYPES.TOGGLE_TASK_COMPLETION;
      payload: Task['id'];
    }
  | { type: TASK_REDUCER_ACTION_TYPES.DELETE_TASK; payload: Task['id'] }
  | {
      type: TASK_REDUCER_ACTION_TYPES.SET_LOADING;
      payload: LoadingAndErrorStateType;
    }
  | {
      type: TASK_REDUCER_ACTION_TYPES.SET_ERROR;
      payload: {
        key: LoadingAndErrorStateType;
        error: string;
      };
    }
  | {
      type: TASK_REDUCER_ACTION_TYPES.SET_STATE_FROM_STORAGE;
      payload: AppState;
    };

export type TaskContextType = {
  tasks: Task[];
  isFetchTasksLoading: boolean;
  addTask: (title: Task['title']) => void;
  toggleTaskCompletion: (id: Task['id']) => void;
  deleteTask: (id: Task['id']) => void;
  fetchTasks: () => void;
};

export enum TASK_REDUCER_ACTION_TYPES {
  FETCH_TASKS = 'FETCH_TASKS',
  ADD_TASK = 'ADD_TASK',
  TOGGLE_TASK_COMPLETION = 'TOGGLE_TASK_COMPLETION',
  DELETE_TASK = 'DELETE_TASK',
  SET_STATE_FROM_STORAGE = 'SET_STATE_FROM_STORAGE',
  SET_LOADING = 'SET_LOADING',
  SET_ERROR = 'SET_ERROR',
}
