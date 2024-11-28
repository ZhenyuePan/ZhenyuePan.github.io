'use client'
import { Card } from "@/components/ui/card"
import { DATA } from "@/data/resume"
import { formatDate } from "@/lib/utils"
import { Suspense, useEffect, useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { marked } from 'marked'

// ... (previous interfaces remain unchanged)
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
}

interface Heading {
  id: string
  text: string
  level: number
  subheadings: Heading[]
}


export default function BlogPostContent({ post }: BlogPostContentProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeHeading, setActiveHeading] = useState("")
  const [expandedHeading, setExpandedHeading] = useState<string | null>(null)
  const [isNavVisible, setIsNavVisible] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const [renderedContent, setRenderedContent] = useState("")

  useEffect(() => {
    if (!post.content) {
      console.error("Post content is undefined")
      return
    }

    const rendered = marked(post.content)
    setRenderedContent(rendered as string)

    const parser = new DOMParser()
    const doc = parser.parseFromString(rendered as string, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3')
    const extractedHeadings: Heading[] = []
    const headingStack: Heading[] = []

    Array.from(headingElements).forEach((heading) => {
      const newHeading: Heading = {
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
        subheadings: []
      }

      while (headingStack.length > 0 && headingStack[headingStack.length - 1].level >= newHeading.level) {
        headingStack.pop()
      }

      if (headingStack.length > 0) {
        headingStack[headingStack.length - 1].subheadings.push(newHeading)
      } else {
        extractedHeadings.push(newHeading)
      }

      headingStack.push(newHeading)
    })

    setHeadings(extractedHeadings)
    console.log('Extracted headings:', extractedHeadings)
  }, [post.content])

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Intersecting heading:', entry.target.id)
            setActiveHeading(entry.target.id)
          }
        })
      },
      { 
        rootMargin: '-20% 0px -80% 0px',
        threshold: 0.1
      }
    )

    const observeHeadings = (headings: Heading[]) => {
      headings.forEach((heading) => {
        const element = document.getElementById(heading.id)
        if (element && observerRef.current) {
          observerRef.current.observe(element)
        }
        observeHeadings(heading.subheadings)
      })
    }

    observeHeadings(headings)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [headings])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToHeading = useCallback((headingId: string) => {
    const element = document.getElementById(headingId)
    if (element) {
      const headerHeight = 80 // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })

      setActiveHeading(headingId)

      // If on mobile, close any expanded sections
      if (window.innerWidth < 1024) {
        setExpandedHeading(null)
        setIsNavVisible(false)
      }
    }
  }, [setActiveHeading, setExpandedHeading])

  const toggleExpanded = (id: string) => {
    setExpandedHeading((prev) => (prev === id ? null : id))
  }

  const renderHeadings = useCallback((headings: Heading[], level: number = 0): JSX.Element => (
    <ul className={`space-y-1 text-sm ${level > 0 ? 'ml-4 border-l border-gray-300 dark:border-gray-700 pl-4' : ''}`}>
      {headings.map((heading, index) => (
        <li key={`${heading.id}-${level}-${index}`}>
          <div className="flex items-center gap-2 group">
            {heading.subheadings.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpanded(heading.id)
                }}
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={expandedHeading === heading.id ? "Collapse section" : "Expand section"}
              >
                {expandedHeading === heading.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            )}
            <button
              onClick={() => scrollToHeading(heading.id)}
              className={`flex-grow py-1 px-2 rounded-md transition-colors duration-200 text-left ${
                activeHeading === heading.id
                  ? "bg-gray-200 dark:bg-gray-800 text-primary font-medium"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {heading.text}
            </button>
          </div>
          {expandedHeading === heading.id && heading.subheadings.length > 0 && (
            <div className="mt-1">
              {renderHeadings(heading.subheadings, level + 1)}
            </div>
          )}
        </li>
      ))}
    </ul>
  ), [activeHeading, expandedHeading, scrollToHeading, toggleExpanded])

  return (
    <div className="w-full max-w-screen-3xl px-4 sm:px-6 lg:px-8 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm">
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
      
      <nav className="mb-8 text-xs" aria-label="Back to blog">
        <Link href="/blog" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Back to all articles
        </Link>
      </nav>
      
      <header className="text-center mb-12">
        <h1 className="text-3xl sm:text-2xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-3">{post.metadata.title}</h1>
        <Suspense fallback={<p className="h-5" />}>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {formatDate(post.metadata.publishedAt)}
          </p>
        </Suspense>
      </header>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:w-64 flex-shrink-0 order-1 lg:order-1 ${isNavVisible ? 'block' : 'hidden lg:block'}`}>
          <button
            className="lg:hidden mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-md"
            onClick={() => setIsNavVisible(!isNavVisible)}
          >
            {isNavVisible ? 'Hide' : 'Show'} Table of Contents
          </button>
          <nav className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto pr-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md" aria-label="Table of contents">
            <h2 className="text-base font-semibold mb-3 text-gray-900 dark:text-gray-100">Table of Contents</h2>
            {headings.length > 0 ? (
              renderHeadings(headings)
            ) : (
              <p className="text-xs text-gray-600 dark:text-gray-400">No headings found in this post.</p>
            )}
          </nav>
        </aside>
        
        <Card className="order-2 w-full lg:w-3/4 p-6 rounded-lg shadow-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <article className="flex-grow order-2 lg:order-2 prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none blog-content">
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
      
      <nav className="mt-12 flex justify-between text-xs" aria-label="Post navigation">
        <Link href="/blog" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Back to all articles
        </Link>
        <Link href="#" className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200 flex items-center">
          Back to top
          <ChevronRight className="w-4 h-4 ml-1" aria-hidden="true" />
        </Link>
      </nav>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-gray-200 dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}
    </div>
  )
}


