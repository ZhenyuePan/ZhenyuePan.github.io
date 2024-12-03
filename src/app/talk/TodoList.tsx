'use client';

import { useOptimistic, useTransition, useState, useEffect } from 'react';
import { toggleTodo, deleteTodo } from './actions';

type Todo = {
  todos: string;
  created_at: string;
  task: string;
  completed: string | null;
};

export default function TodoList({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTodos(initialTodos);
  }, [initialTodos]);

  const updateTodo = (updatedTodo: Todo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.todos === updatedTodo.todos ? updatedTodo : todo))
    );
  };

  const removeTodo = (todoText: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.todos !== todoText));
  };

  return (
    <div >
      <ul className="space-y-2">
        {todos.map((todo) => (
          <li key={todo.todos} className="flex items-center justify-between bg-white p-4 rounded-md shadow">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed !== null}
                onChange={() => {
                  startTransition(async () => {
                    try {
                      const updatedTodo = { ...todo, completed: todo.completed ? null : new Date().toISOString() };
                      const result = await toggleTodo(todo.todos, updatedTodo.completed !== null);
                      updateTodo(updatedTodo);
                      console.log('Todo toggled successfully:', result);
                      setError(null);
                    } catch (e) {
                      console.error('Error toggling todo:', e);
                      setError(e instanceof Error ? e.message : 'Failed to update todo');
                    }
                  });
                }}
                className="mr-2 h-5 w-5 text-blue-500"
              />
              <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.todos}</span>
            </div>
            <button
              onClick={() => {
                startTransition(async () => {
                  try {
                    await deleteTodo(todo.todos);
                    removeTodo(todo.todos);
                    console.log('Todo deleted successfully');
                    setError(null);
                  } catch (e) {
                    console.error('Error deleting todo:', e);
                    setError(e instanceof Error ? e.message : 'Failed to delete todo');
                  }
                });
              }}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}














