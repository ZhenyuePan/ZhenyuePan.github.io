import { neon } from '@neondatabase/serverless';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

export default async function TodoPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const todos = await sql('SELECT * FROM todos ORDER BY created_at DESC');
  console.log('Fetched todos:', todos);

  return (
    <div className="max-w-4xl absolute left-[30%] w-[50%]  ">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoForm />
    </div>
  );
}














