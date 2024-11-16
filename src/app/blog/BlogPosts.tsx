'use client'

import { useState } from 'react'
import Link from "next/link"
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface BlogPost {
  slug: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    tags?: string[];
  };
}

export default function BlogPosts({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts] = useState(initialPosts)

  return (
    <main className="container mx-auto px-4 py-8">
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts
            .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
            .map((post, index) => (
              <Card 
                key={post.slug} 
                className="group overflow-hidden transition-all duration-300 hover:scale-[1.02] bg-blue-950/40 border-blue-400/20 hover:border-blue-400/60 backdrop-blur-sm animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl text-blue-100 group-hover:text-blue-300 transition-colors duration-300">
                      {post.metadata.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-blue-200/80 line-clamp-3">{post.metadata.summary}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-4 border-t border-blue-400/20">
                    <div className="flex items-center text-sm text-blue-300">
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      {new Date(post.metadata.publishedAt).toLocaleDateString()}
                    </div>
                    {post.metadata.tags && (
                      <div className="flex gap-2">
                        {post.metadata.tags.slice(0, 2).map((tag: string) => (
                          <Badge 
                            key={tag} 
                            className="bg-blue-900/50 text-blue-200 border-blue-400/30 group-hover:border-blue-400/60 transition-colors duration-300"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardFooter>
                </Link>
              </Card>
            ))}
        </div>
      </ScrollArea>
    </main>
  )
}