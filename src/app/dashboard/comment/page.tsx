import { neon } from '@neondatabase/serverless';

export default async function CommentsPage() {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const comments = await sql('SELECT * FROM comments ORDER BY created_at DESC');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Comments</h1>
      <ul className="space-y-4">
        {comments.map((comment: any) => (
          <li key={comment.id} className="bg-white shadow rounded-lg p-4">
            <p>{comment.comment}</p>
            <small className="text-gray-500">
              {new Date(comment.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
