import { neon } from '@neondatabase/serverless';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default async function TodoPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const todos = await sql('SELECT * FROM todos ORDER BY created_at DESC');

  async function addTodo(formData: FormData) {
    'use server';
    const task = formData.get('task');
    await sql('INSERT INTO todos (task, completed) VALUES ($1, $2)', [task, false]);
  }

  async function toggleTodo(id: number, completed: boolean) {
    'use server';
    await sql('UPDATE todos SET completed = $1 WHERE id = $2', [completed, id]);
  }

  async function deleteTodo(id: number) {
    'use server';
    await sql('DELETE FROM todos WHERE id = $1', [id]);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
}

