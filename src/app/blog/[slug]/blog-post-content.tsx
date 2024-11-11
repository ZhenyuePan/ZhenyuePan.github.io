'use client'

import { DATA } from "@/data/resume"
import { formatDate } from "@/lib/utils"
import { Suspense, useEffect, useState, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PostMetadata {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

interface Post {
  slug: string
  metadata: PostMetadata
  source: string
}

export default function BlogPostContent({ post }: { post: Post }) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [activeHeading, setActiveHeading] = useState("")
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (!post.source) {
      console.error("Post source is undefined")
      return
    }

    // Extract headings from the post content
    const parser = new DOMParser()
    const doc = parser.parseFromString(post.source, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3')
    const extractedHeadings = Array.from(headingElements).map((heading, index) => ({
      id: heading.id || `heading-${index}`,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }))
    setHeadings(extractedHeadings)
  }, [post.source])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0.1 // Adjust this value to fine-tune when a heading is considered "active"
      }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings])

  const scrollToHeading = (headingId: string) => {
    const element = document.getElementById(headingId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${DATA.url}${post.metadata.image}`
              : `${DATA.url}/og?title=${post.metadata.title}`,
            url: `${DATA.url}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: DATA.name,
            },
          }),
        }}
      />
      
      <nav className="mb-8" aria-label="Back to blog">
        <Link href="/blog" className="text-primary hover:underline flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to all posts
        </Link>
      </nav>
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary mb-2">{post.metadata.title}</h1>
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-muted-foreground">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </header>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-50 flex-shrink-0">
          <nav className="sticky top-8" aria-label="Table of contents">
            <h2 className="text-lg font-semibold mb-4">导航栏</h2>
            {headings.length > 0 ? (
              <ul className="space-y-2">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`block w-full text-left py-1 px-2 rounded transition-colors ${
                        activeHeading === heading.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {heading.text}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No headings found in this post.</p>
            )}
          </nav>
        </aside>
        <article className="flex-grow prose dark:prose-invert max-w-none blog-content">
        {post.source ? (
          <div dangerouslySetInnerHTML={{ __html: post.source }} />
        ) : (
          <Alert>
            <AlertTitle>Content Unavailable</AlertTitle>
            <AlertDescription>
              The content for this blog post is currently unavailable. Please check back later.
            </AlertDescription>
          </Alert>
        )}
      </article>
      </div>
      <nav className="mt-8 flex justify-between" aria-label="Post navigation">
        <Link href="/blog" className="text-primary hover:underline flex items-center">
          <ChevronLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to all posts
        </Link>
        <Link href="#" className="text-primary hover:underline flex items-center">
          Back to top
          <ChevronRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </Link>
      </nav>
    </div>
  )
}