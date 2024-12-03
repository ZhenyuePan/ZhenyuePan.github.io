'use client';

import { useRef, useState } from 'react';
import { addTodo } from './actions';

export default function TodoForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        setIsSubmitting(true);
        setError(null);
        try {
          const result = await addTodo(formData);
          console.log('Todo added successfully:', result);
          formRef.current?.reset();
        } catch (e) {
          console.error('Error adding todo:', e);
          setError(e instanceof Error ? e.message : 'An unknown error occurred');
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="mb-4"
    >
      <div className="flex">
        <input
          type="text"
          name="todos"
          placeholder="Add a new todo"
          className="w-full px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </form>
  );
}














