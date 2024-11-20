import { getBlogPosts } from "@/data/blog"
import BlogHeader from './BlogHeader'
import BlogPosts from './BlogPosts'
import Navbar from "@/components/navbar"

export const metadata = {
  title: "Kafka's Blog",
  description: "Exploring the digital realm throughcode  and creativity.",
}

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    tags?: string[];
  };
}

export default async function BlogPage() {
  const rawPosts = await getBlogPosts()

  const posts: BlogPost[] = rawPosts.map(post => ({
    slug: post.slug,
    metadata: {
      title: post.metadata.title || 'Untitled Entry',
      publishedAt: post.metadata.publishedAt || new Date().toISOString(),
      summary: post.metadata.summary || 'This entry awaits your discovery...',
      tags: Array.isArray(post.metadata.tags) ? post.metadata.tags : undefined
    }
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      <div className="relative">
        <Navbar />
        <BlogHeader />
        <BlogPosts initialPosts={posts} />
        <footer className="container mx-auto px-4 py-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Digital Chronicles. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}