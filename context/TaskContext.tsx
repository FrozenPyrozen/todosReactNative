import { TASK_REDUCER_TYPES } from '@/constants/taskReducer';
import { TaskContextType, Task, AppState } from '@/types/taskLogicTypes';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'localTasksState';

const setStoreState = async (appState: AppState) => {
  try {
    const jsonValue = JSON.stringify(appState);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error(`[storeData] error on set state to local storage! e: ${e}`);
  }
};

const getStoreState = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error(`[storeData] error on get state from local storage! e: ${e}`);
  }
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export type TaskProviderProps = { children: React.ReactNode };

const initialState: AppState = {
  tasks: [],
};

const taskReducer = (
  state: AppState,
  action: { type: string; payload?: any }
): AppState => {
  switch (action.type) {
    case TASK_REDUCER_TYPES.ADD_TASK:
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: Date.now(), title: action.payload, completed: false },
        ],
      };
    case TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        ),
      };
    case TASK_REDUCER_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case TASK_REDUCER_TYPES.SET_STATE_FROM_STORAGE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  useEffect(() => {
    const loadState = async () => {
      const storedState = await getStoreState();
      if (storedState) {
        dispatch({
          type: TASK_REDUCER_TYPES.SET_STATE_FROM_STORAGE,
          payload: storedState,
        });
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      if (!state) {
        return;
      }
      await setStoreState(state);
    };
    saveState();
  }, [state]);

  const addTask = useCallback((title: string) => {
    dispatch({ type: TASK_REDUCER_TYPES.ADD_TASK, payload: title });
  }, []);

  const toggleTaskCompletion = useCallback((id: Task['id']) => {
    dispatch({ type: TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION, payload: id });
  }, []);

  const deleteTask = useCallback((id: Task['id']) => {
    dispatch({ type: TASK_REDUCER_TYPES.DELETE_TASK, payload: id });
  }, []);

  const tasks = useMemo(() => state.tasks, [state.tasks]);

  return (
    <TaskContext.Provider
      value={{ tasks, addTask, toggleTaskCompletion, deleteTask }}
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
