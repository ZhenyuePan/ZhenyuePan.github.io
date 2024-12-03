'use server';

import { neon, neonConfig } from '@neondatabase/serverless';
import { revalidatePath } from 'next/cache';

neonConfig.fetchConnectionCache = true;

const sql = neon(`${process.env.DATABASE_URL}`);

export async function addTodo(formData: FormData) {
  const todos = formData.get('todos');
  if (typeof todos !== 'string' || todos.length === 0) {
    throw new Error('Invalid todo: Todo must be a non-empty string');
  }
  try {
    // 插入时显式设置 completed 为 NULL
    const result = await sql(
      'INSERT INTO todos (todos, completed) VALUES ($1, $2) RETURNING *',
      [todos, null]
    );
    console.log('Insert result:', result);
    revalidatePath('/todos');
    return result;
  } catch (error) {
    console.error('Failed to add todo:', error);
    throw new Error(
      `Failed to add todo: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}


export async function toggleTodo(todo: string, completed: boolean) {
  try {
    const completedValue = completed ? new Date().toISOString() : null;
    const result = await sql('UPDATE todos SET completed = $1 WHERE todos = $2 RETURNING *', [completedValue, todo]);
    console.log('Toggle result:', result);
    revalidatePath('/todos');
    return result;
  } catch (error) {
    console.error('Failed to toggle todo:', error);
    throw new Error(`Failed to update todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function deleteTodo(todo: string) {
  try {
    const result = await sql('DELETE FROM todos WHERE todos = $1 RETURNING *', [todo]);
    console.log('Delete result:', result);
    revalidatePath('/todos');
    return result;
  } catch (error) {
    console.error('Failed to delete todo:', error);
    throw new Error(`Failed to delete todo: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}











