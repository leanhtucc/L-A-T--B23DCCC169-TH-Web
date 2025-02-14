import type { Todo } from '@/services/TodoList';

const LOCAL_STORAGE_KEY = 'todolist';

export const getTodos = (): Todo[] => {
  const storedTodos = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedTodos ? JSON.parse(storedTodos) : [];
};

export const saveTodos = (todos: Todo[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos));
};

export const addTodo = (todos: Todo[], text: string, description?: string): Todo[] => {
  const newTodo: Todo = {id: Date.now(), title: text, completed: false, description: description || ''};
  const updatedTodos = [...todos, newTodo];
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const updateTodo = (todos: Todo[], id: number, newText: string, description: string): Todo[] => {
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, title: newText, description} : todo
  );
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const toggleTodo = (todos: Todo[], id: number): Todo[] => {
  const updatedTodos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const deleteTodo = (todos: Todo[], id: number): Todo[] => {
  const updatedTodos = todos.filter(todo => todo.id !== id);
  saveTodos(updatedTodos);
  return updatedTodos;
};

export const clearAllTodos = (): Todo[] => {
  saveTodos([]);
  return [];
};