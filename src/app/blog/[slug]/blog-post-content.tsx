'use client'

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft } from 'lucide-react'
import Link from "next/link"
import { marked } from 'marked'
import { formatDate } from "@/lib/utils"

interface PostMetadata {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

interface Post {
  slug: string
  metadata: PostMetadata
  content: string
}

interface BlogPostContentProps {
  post: Post
  backgroundImage?: string
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    if (!post.content) {
      console.error("Post content is undefined")
      return
    }
    setRenderedContent(marked(post.content) as string)
  }, [post.content])

  return (
    <div className="flex overflow-x-hidden"
      style={{
        backgroundImage: "url('/sakura/linboli.jpg')",
        backgroundPosition: "center",
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}>
      <div className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100 text-sm">
        {/* Top Navigation */}
        <nav className="w-full max-w-4xl py-4" aria-label="Back to blog">
          <Link href="/blog" className="flex items-center text-white hover:text-blue-200 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200">
            <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>Back to all articles</span>
          </Link>
        </nav>
  
        <header className="text-center mb-12 w-full max-w-4xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-blue-200 dark:text-gray-100 mb-3">{post.metadata.title}</h1>
          <p className="text-base text-white dark:text-gray-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </header>
        
        <div className="w-full flex justify-center">
          <Card className="w-full max-w-5xl lg:p-6 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 backdrop-blur-sm overflow-hidden">
            <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none blog-content break-words">
              {renderedContent ? (
                <div 
                  className="[&_a]:break-all" 
                  dangerouslySetInnerHTML={{ __html: renderedContent }} 
                />
              ) : (
                <Alert>
                  <AlertTitle>Content Unavailable</AlertTitle>
                  <AlertDescription>
                    The content for this blog post is currently unavailable. Please check back later.
                  </AlertDescription>
                </Alert>
              )}
            </article>
          </Card>
        </div>
  
        {/* Bottom Navigation */}
        <nav className="w-full max-w-4xl py-8" aria-label="Back to blog">
          <Link href="/blog" className="flex items-center text-white hover:text-blue-200 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200">
            <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
            <span>Back to all articles</span>
          </Link>
        </nav>
      </div>
    </div>
  )
}
