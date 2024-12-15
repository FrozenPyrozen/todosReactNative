import { TASK_REDUCER_TYPES } from '@/constants/taskReducer';
import { TaskContextType, Task, AppState } from '@/types/taskLogicTypes';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addTodo, fetchTodos, updateTodo, deleteTodo } from '@/api/todosApi';
import {
  makeTaskCreatedByUserLocally,
  mapTodoToTask,
  mapTodosToTasks,
} from '@/utils/mappers';

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

const taskReducer = (
  state: AppState,
  action: { type: string; payload?: any }
): AppState => {
  switch (action.type) {
    case TASK_REDUCER_TYPES.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
        loading: { ...state.loading, addTask: false },
        errors: { ...state.errors, addTask: null },
      };
    case TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION:
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
    case TASK_REDUCER_TYPES.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
        loading: { ...state.loading, deleteTask: false },
        errors: { ...state.errors, deleteTask: null },
      };
    case TASK_REDUCER_TYPES.SET_STATE_FROM_STORAGE:
      return {
        ...state,
        ...action.payload,
        loading: { ...state.loading, setTasksFromStorage: false },
        errors: { ...state.errors, setTasksFromStorage: null },
      };
    case TASK_REDUCER_TYPES.FETCH_TASKS:
      return {
        ...state,
        tasks: [...action.payload],
        loading: { ...state.loading, fetchTasks: false },
        errors: { ...state.errors, fetchTasks: null },
      };
    case TASK_REDUCER_TYPES.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload]: true },
      };
    case TASK_REDUCER_TYPES.SET_ERROR:
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

  useEffect(() => {
    const loadState = async () => {
      const storedState = await getStoreState();
      if (storedState && storedState.tasks.length > 0) {
        dispatch({
          type: TASK_REDUCER_TYPES.SET_STATE_FROM_STORAGE,
          payload: storedState,
        });
      } else {
        // Dummy api didn't add, edit, or remove task so it would refresh all tasks
        fetchTasks();
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    // Save the state to AsyncStorage whenever tasks change
    const saveState = async () => {
      if (!state) {
        return;
      }
      await setStoreState(state);
    };
    saveState();
  }, [state]);

  // Tasks logic handling
  const fetchTasks = async () => {
    try {
      dispatch({ type: TASK_REDUCER_TYPES.SET_LOADING, payload: 'fetchTasks' });
      const result = await fetchTodos();
      const mappedTasks = mapTodosToTasks(result.todos);

      dispatch({ type: TASK_REDUCER_TYPES.FETCH_TASKS, payload: mappedTasks });
    } catch (error) {
      dispatch({
        type: TASK_REDUCER_TYPES.SET_ERROR,
        payload: { key: 'fetchTasks', error },
      });
    }
  };

  const addTask = async (title: Task['title']) => {
    try {
      // Dummy api didn't save task on server, and returns 255 id all time
      dispatch({ type: TASK_REDUCER_TYPES.SET_LOADING, payload: 'addTask' });
      const todo = await addTodo({
        todo: title,
        completed: false,
        // mock userId
        userId: 1,
      });
      const newTask = makeTaskCreatedByUserLocally(
        mapTodoToTask({ ...todo, id: Date.now() + Math.random() })
      );
      dispatch({ type: TASK_REDUCER_TYPES.ADD_TASK, payload: newTask });
    } catch (error) {
      dispatch({
        type: TASK_REDUCER_TYPES.SET_ERROR,
        payload: { key: 'addTask', error },
      });
    }
  };

  const toggleTaskCompletion = async (id: Task['id']) => {
    try {
      dispatch({ type: TASK_REDUCER_TYPES.SET_LOADING, payload: 'toggleTask' });
      const taskThatNeedToBeUpdated = state.tasks.find(
        (task) => task.id === id
      );
      if (!taskThatNeedToBeUpdated) {
        return dispatch({
          type: TASK_REDUCER_TYPES.SET_ERROR,
          payload: {
            key: 'toggleTask',
            error: `Task with id:${id} is not found!`,
          },
        });
      }
      const todoUpdates = {
        completed: !taskThatNeedToBeUpdated.completed,
      };
      // Dummy api didn't edit task on server, so we didn't send locally created task, because it would get an error
      let updatedTask = null;
      if (!taskThatNeedToBeUpdated.isCreatedByUserLocally) {
        const updatedTodo = await updateTodo(id, todoUpdates);
        updatedTask = mapTodoToTask(updatedTodo);
      } else {
        // We didn't toggle the completed status here, because we handle it on reducer, cause of dummy api
        updatedTask = taskThatNeedToBeUpdated;
      }
      dispatch({
        type: TASK_REDUCER_TYPES.TOGGLE_TASK_COMPLETION,
        payload: updatedTask.id,
      });
    } catch (error) {
      dispatch({
        type: TASK_REDUCER_TYPES.SET_ERROR,
        payload: { key: 'toggleTask', error },
      });
    }
  };

  const deleteTask = async (id: Task['id']) => {
    try {
      dispatch({ type: TASK_REDUCER_TYPES.SET_LOADING, payload: 'deleteTask' });
      // Dummy api didn't delete task on server, so we didn't send locally deleted task, because it would get an error
      const taskThatNeedToBeDeleted = state.tasks.find(
        (task) => task.id === id
      );
      if (!taskThatNeedToBeDeleted) {
        return dispatch({
          type: TASK_REDUCER_TYPES.SET_ERROR,
          payload: {
            key: 'deleteTask',
            error: `Task with id:${id} is not found!`,
          },
        });
      }
      let deletedTask = null;
      if (!taskThatNeedToBeDeleted.isCreatedByUserLocally) {
        const result = await deleteTodo(id);
        deletedTask = mapTodoToTask(result);
      } else {
        deletedTask = taskThatNeedToBeDeleted;
      }

      dispatch({
        type: TASK_REDUCER_TYPES.DELETE_TASK,
        payload: deletedTask.id,
      });
    } catch (error) {
      dispatch({
        type: TASK_REDUCER_TYPES.SET_ERROR,
        payload: { key: 'deleteTask', error },
      });
    }
  };

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
