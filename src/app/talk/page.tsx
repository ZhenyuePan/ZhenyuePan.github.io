import { neon } from '@neondatabase/serverless';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import Navbar from '@/components/navbar';

export default async function TodoPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const todos = await sql('SELECT * FROM todos ORDER BY created_at DESC');
  console.log('Fetched todos:', todos);

  return (
    <div className="max-w-4xl mx-auto p-4 absolute top-[10%] left-[30%]  ">
      <Navbar/>
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoForm />
      <TodoList initialTodos={todos} />
    </div>
  );
}














