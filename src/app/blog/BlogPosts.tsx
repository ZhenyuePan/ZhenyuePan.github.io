'use client'

import { useState, useEffect } from 'react'
import Link from "next/link"
import { CalendarIcon } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"

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

  useEffect(() => {
    const handleScroll = () => {
      const cards = document.querySelectorAll('.blog-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          card.classList.add('in-view');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts
            .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
            .map((post, index) => (
              <motion.div
                key={post.slug}
                className="blog-card w-full max-w-md mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`}>
                  <Card className="group  transition-all duration-300 hover:scale-[1.02] bg-white border-blue-200 hover:border-blue-400 shadow-lg">
                    <CardHeader className="pb-4 bg-gradient-to-r from-blue-100 to-blue-50">
                      <CardTitle className="text-2xl font-serif text-blue-900 group-hover:text-blue-700 transition-colors duration-300">
                        {post.metadata.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-700 line-clamp-3">{post.metadata.summary}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-4 border-t border-blue-100">
                      <div className="flex items-center text-sm text-blue-600">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {new Date(post.metadata.publishedAt).toLocaleDateString()}
                      </div>
                      {post.metadata.tags && (
                        <div className="flex gap-2">
                          {post.metadata.tags.slice(0, 2).map((tag: string) => (
                            <Badge 
                              key={tag} 
                              className="bg-blue-50 text-blue-700 border-blue-200 group-hover:border-blue-300 transition-colors duration-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
        </div>
      </ScrollArea>
      
      {/* Animated lines */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        <motion.div
          className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-blue-200 via-blue-100 to-blue-200"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 0.7 }}
        />
        <motion.div
          className="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.9 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.1 }}
        />
      </div>
    </main>
  )
}