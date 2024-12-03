import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64 bg-gray-100">
        <nav className="p-4">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            </li>
            <li>
              <Link href="/comments" className="text-blue-600 hover:underline">Comments</Link>
            </li>
            {/* Add more navigation links as needed */}
          </ul>
        </nav>
      </div>
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
    </div>
  );
}

