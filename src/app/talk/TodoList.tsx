'use client';

import { useOptimistic } from 'react';

type Todo = {
  id: number;
  task: string;
  completed: boolean;
};

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
}: {
  todos: Todo[];
  toggleTodo: (id: number, completed: boolean) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
}) {
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => {
      return state.map((todo) => (todo.id === newTodo.id ? newTodo : todo));
    }
  );

  return (
    <ul className="space-y-2">
      {optimisticTodos.map((todo) => (
        <li key={todo.id} className="flex items-center justify-between bg-white p-4 rounded-md shadow">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={async () => {
                addOptimisticTodo({ ...todo, completed: !todo.completed });
                await toggleTodo(todo.id, !todo.completed);
              }}
              className="mr-2 h-5 w-5 text-blue-500"
            />
            <span className={todo.completed ? 'line-through text-gray-500' : ''}>{todo.task}</span>
          </div>
          <button
            onClick={async () => {
              await deleteTodo(todo.id);
              addOptimisticTodo({ ...todo, id: -1 }); // Remove from list optimistically
            }}
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

