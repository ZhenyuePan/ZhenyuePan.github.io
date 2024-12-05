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
    <div className="absolute overflow-x-hidden"
      style = {{
      backgroundImage: "url('/sakura/rainy.jpg')",
      backgroundPosition: "center",
      height: "100vh",
      width: "100vw",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    }}>
    <div className="absolute top-[60%] w-[100%] from-blue-50 via-white to-blue-100">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] opacity-5 bg-cover bg-center mix-blend-overlay" />
      <div className="relative">
        <Navbar />
        <BlogHeader />
        <BlogPosts initialPosts={posts} />
       
        <footer className="bg-gray-200 py-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 卡夫卡的笔记本 版权所有。</p>
              <p>powered by 我自己</p>
            </div>
          </footer>
      </div>
    </div>
    </div>
  )
}