'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface TableOfContentsProps {
  content: string
}

interface Heading {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading) => ({
      id: heading.id,
      text: heading.textContent || '',
      level: parseInt(heading.tagName.charAt(1))
    }))

    setHeadings(extractedHeadings)
  }, [content])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '0px 0px -80% 0px' }
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-64 rounded-md border">
      <div className="bg-white/70 p-4">
        <h4 className="mb-4 text-sm font-medium leading-none">目录</h4>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} style={{ marginLeft: `${(heading.level - 1) * 12}px` }}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  "block text-sm hover:text-blue-500 transition-colors",
                  activeId === heading.id ? "text-black font-medium" : "text-gray-500"
                )}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  )
}

