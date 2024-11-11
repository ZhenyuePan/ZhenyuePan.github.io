import { getBlogPosts } from "@/data/blog"
import Link from "next/link"
import { CalendarIcon } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import Navbar from '@/components/navbar'

export const metadata = {
  title: "Blog",
  description: "My thoughts on software development, life, and more.",
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {/*<h1 className="text-4xl font-bold mb-8 text-center text-primary">My Blog</h1>*/}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts
              .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
              .map((post) => (
                <Card key={post.slug} className="overflow-hidden transition-all hover:shadow-lg">
                  <Link href={`/blog/${post.slug}`}>
                    <CardHeader className="pb-4">
                      <CardTitle className="line-clamp-2">{post.metadata.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">{post.metadata.summary}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        {new Date(post.metadata.publishedAt).toLocaleDateString()}
                      </div>
                      {post.metadata.tags && (
                        <div className="flex gap-2">
                          {post.metadata.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary">
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
    </div>
  )
}