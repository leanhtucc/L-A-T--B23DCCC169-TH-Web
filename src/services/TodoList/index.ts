import { useState, useCallback } from 'react';
import { addTodo, clearAllTodos, deleteTodo, getTodos, saveTodos, toggleTodo, updateTodo as updateTodoHelper } from '@/models/todolist';

export type Todo = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
};

export default () => {
  const [todos, setTodos] = useState<Todo[]>(getTodos());

  const addNewTodo = useCallback((title: string, description: string) => {
    setTodos(current => addTodo(current, title, description));
  }, []);

  const removeTodo = useCallback((id: number) => {
    setTodos(current => deleteTodo(current, id));
  }, []);

  const toggleTodoStatus = useCallback((id: number) => {
    setTodos(current => toggleTodo(current, id));
  }, []);

  const updateTodoItem = useCallback((id: number, title: string, description: string) => {
    setTodos(current => updateTodoHelper(current, id, title, description));
  }, []);

  const clearTodos = useCallback(() => {
    setTodos(clearAllTodos());
  }, []);

  return {
    todos,
    addTodo: addNewTodo,
    deleteTodo: removeTodo,
    toggleTodo: toggleTodoStatus,
    updateTodo: updateTodoItem,
    clearAllTodos: clearTodos,
  };
};