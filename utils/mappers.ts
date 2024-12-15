import { Todo, Task } from '@/types/taskLogicTypes';

/**
 * Maps a single Todo (API structure) to a Task (local structure)
 * @param todo - The Todo object from the API
 * @returns A Task object suitable for local use
 */
export const mapTodoToTask = (todo: Todo): Task => ({
  id: todo.id,
  title: todo.todo,
  completed: todo.completed,
  isCreatedByUserLocally: false,
});

/**
 * Making a single Task created by user locally
 * @param todo - The Todo object from the API
 * @returns A Task object suitable for local use
 */
export const makeTaskCreatedByUserLocally = (task: Task): Task => ({
  ...task,
  isCreatedByUserLocally: true,
});

/**
 * Maps a single Task (local structure) to a Todo (API structure)
 * @param task - The Task object from local state
 * @returns A Todo object suitable for API use
 */
export const mapTaskToTodo = (task: Task): Todo => ({
  id: task.id,
  todo: task.title,
  completed: task.completed,
  userId: 1, // Mock userId
});

/**
 * Maps an array of Todos (API structure) to an array of Tasks (local structure)
 * @param todos - Array of Todo objects from the API
 * @returns An array of Task objects suitable for local use
 */
export const mapTodosToTasks = (todos: Todo[]): Task[] =>
  todos.map(mapTodoToTask);

/**
 * Maps an array of Tasks (local structure) to an array of Todos (API structure)
 * @param tasks - Array of Task objects from local state
 * @returns An array of Todo objects suitable for API use
 */
export const mapTasksToTodos = (tasks: Task[]): Todo[] =>
  tasks.map(mapTaskToTodo);
