import usePersistState from '@/hooks/usePersistState';
import useTaskLogic from '@/hooks/useTasksLogic';
import {
  AppState,
  TASK_REDUCER_ACTION_TYPES,
  TaskAction,
  TaskContextType,
} from '@/types/taskLogicTypes';
import { getStoreState, setStoreState } from '@/utils/asyncStorage';
import React, { createContext, useContext, useMemo, useReducer } from 'react';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export type TaskProviderProps = { children: React.ReactNode };

const initialState: AppState = {
  tasks: [],
  loading: {
    fetchTasks: false,
    addTask: false,
    toggleTask: false,
    deleteTask: false,
    setTasksFromStorage: false,
  },
  errors: {
    fetchTasks: null,
    addTask: null,
    toggleTask: null,
    deleteTask: null,
    setTasksFromStorage: null,
  },
};

const taskReducer = (state: AppState, action: TaskAction): AppState => {
  switch (action.type) {
    case TASK_REDUCER_ACTION_TYPES.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: { ...state.loading, addTask: false },
        errors: { ...state.errors, addTask: null },
      };
    case TASK_REDUCER_ACTION_TYPES.TOGGLE_TASK_COMPLETION:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
        loading: { ...state.loading, toggleTask: false },
        errors: { ...state.errors, toggleTask: null },
      };
    case TASK_REDUCER_ACTION_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: { ...state.loading, deleteTask: false },
        errors: { ...state.errors, deleteTask: null },
      };
    case TASK_REDUCER_ACTION_TYPES.SET_STATE_FROM_STORAGE:
      return {
        ...state,
        ...action.payload,
        loading: { ...state.loading, setTasksFromStorage: false },
        errors: { ...state.errors, setTasksFromStorage: null },
      };
    case TASK_REDUCER_ACTION_TYPES.FETCH_TASKS:
      return {
        ...state,
        tasks: [...action.payload],
        loading: { ...state.loading, fetchTasks: false },
        errors: { ...state.errors, fetchTasks: null },
      };
    case TASK_REDUCER_ACTION_TYPES.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: true },
      };
    case TASK_REDUCER_ACTION_TYPES.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.error },
        loading: { ...state.loading, [action.payload.key]: false },
      };
    default:
      return state;
  }
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { fetchTasks, addTask, toggleTaskCompletion, deleteTask } =
    useTaskLogic(state, dispatch);

  usePersistState({
    state,
    loadState: getStoreState,
    saveState: setStoreState,
    onLoadState: (storedState) => {
      if (storedState && storedState.tasks.length > 0) {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_STATE_FROM_STORAGE,
          payload: storedState,
        });
      } else {
        // Load fresh tasks if no stored state exists
        fetchTasks();
      }
    },
  });

  const tasks = useMemo(() => state.tasks, [state.tasks]);
  const isFetchTasksLoading = useMemo(
    () => state.loading.fetchTasks,
    [state.loading.fetchTasks]
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isFetchTasksLoading,
        fetchTasks,
        addTask,
        toggleTaskCompletion,
        deleteTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
