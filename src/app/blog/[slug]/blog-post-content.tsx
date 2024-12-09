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




    const rendered = marked(post.content)
    setRenderedContent(rendered as string)
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
      <div className="flex-grow flex-col items-center sm:px-6 lg:px-8 text-gray-900 dark:text-gray-100 text-sm">
        <nav className="mb-8" aria-label="Back to blog">
          <Link href="/blog" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200">
            <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
            Back to all articles
          </Link>
        </nav>

        <header className="text-center mb-12">
          <h1 className="text-3xl sm:text-2xl lg:text-5xl font-bold tracking-tight text-blue-200 dark:text-gray-100 mb-3">{post.metadata.title}</h1>
          <p className="text-base text-white dark:text-gray-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </header>
        <div className="flex">

          <Card className="lg:flex-grow w-full lg:p-6 bg-white/70 dark:bg-gray-900/70 text-gray-900 dark:text-gray-100 backdrop-blur-sm ml-64">
            <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none blog-content">
              {renderedContent ? (
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
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
      </div>
    </div>
  )
}













