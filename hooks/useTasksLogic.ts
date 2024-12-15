import { addTodo, deleteTodo, fetchTodos, updateTodo } from '@/api/todosApi';
import {
  AppState,
  TASK_REDUCER_ACTION_TYPES,
  Task,
  TaskAction,
} from '@/types/taskLogicTypes';
import {
  makeTaskCreatedByUserLocally,
  mapTodoToTask,
  mapTodosToTasks,
} from '@/utils/mappers';
import { useCallback } from 'react';

export default function useTaskLogic(
  state: AppState,
  dispatch: React.Dispatch<TaskAction>
) {
  /**
   * fetchTasks would reset our local created tasks,
   * because dummy api didn't save data on server
   */
  const fetchTasks = useCallback(async () => {
    try {
      dispatch({
        type: TASK_REDUCER_ACTION_TYPES.SET_LOADING,
        payload: 'fetchTasks',
      });

      const result = await fetchTodos();
      const mappedTasks = mapTodosToTasks(result.todos);

      dispatch({
        type: TASK_REDUCER_ACTION_TYPES.FETCH_TASKS,
        payload: mappedTasks,
      });
    } catch (error) {
      dispatch({
        type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
        payload: { key: 'fetchTasks', error: JSON.stringify(error) },
      });
    }
  }, [dispatch]);

  /**
   * addTask allows to work with locally created tasks and from api,
   * but dummy api didn't save data on server
   * and returns 255 id all time
   */
  const addTask = useCallback(
    async (title: Task['title']) => {
      try {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_LOADING,
          payload: 'addTask',
        });

        const todo = await addTodo({
          todo: title,
          completed: false,
          userId: 1, // mock userId
        });

        const newTask = makeTaskCreatedByUserLocally(
          mapTodoToTask({ ...todo, id: Date.now() + Math.random() })
        );

        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.ADD_TASK,
          payload: newTask,
        });
      } catch (error) {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
          payload: { key: 'addTask', error: JSON.stringify(error) },
        });
      }
    },
    [dispatch]
  );

  /**
   * toggleTaskCompletion supported locally created tasks and tasks from api,
   * but dummy api didn't edit task on server
   * so we didn't send locally created task,
   * because it would get an error
   */
  const toggleTaskCompletion = useCallback(
    async (id: Task['id']) => {
      try {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_LOADING,
          payload: 'toggleTask',
        });

        const taskToUpdate = state.tasks.find((task) => task.id === id);

        if (!taskToUpdate) {
          return dispatch({
            type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
            payload: {
              key: 'toggleTask',
              error: `Task with id:${id} is not found!`,
            },
          });
        }

        const todoUpdates = { completed: !taskToUpdate.completed };

        let updatedTask = taskToUpdate;

        if (!taskToUpdate.isCreatedByUserLocally) {
          const updatedTodo = await updateTodo(id, todoUpdates);
          updatedTask = mapTodoToTask(updatedTodo);
        }

        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.TOGGLE_TASK_COMPLETION,
          payload: updatedTask.id,
        });
      } catch (error) {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
          payload: { key: 'toggleTask', error: JSON.stringify(error) },
        });
      }
    },
    [state.tasks, dispatch]
  );

  /**
   * deleteTask supported locally created tasks and tasks from api,
   * but dummy api didn't delete task on server
   * so we didn't send locally created task,
   * because it would get an error
   */
  const deleteTask = useCallback(
    async (id: Task['id']) => {
      try {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_LOADING,
          payload: 'deleteTask',
        });

        const taskToDelete = state.tasks.find((task) => task.id === id);

        if (!taskToDelete) {
          return dispatch({
            type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
            payload: {
              key: 'deleteTask',
              error: `Task with id:${id} is not found!`,
            },
          });
        }

        let deletedTask = taskToDelete;

        if (!taskToDelete.isCreatedByUserLocally) {
          const result = await deleteTodo(id);
          deletedTask = mapTodoToTask(result);
        }

        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.DELETE_TASK,
          payload: deletedTask.id,
        });
      } catch (error) {
        dispatch({
          type: TASK_REDUCER_ACTION_TYPES.SET_ERROR,
          payload: { key: 'deleteTask', error: JSON.stringify(error) },
        });
      }
    },
    [state.tasks, dispatch]
  );

  return {
    fetchTasks,
    addTask,
    toggleTaskCompletion,
    deleteTask,
  };
}
