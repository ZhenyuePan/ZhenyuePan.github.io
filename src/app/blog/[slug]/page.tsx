import { Metadata } from 'next'
import { getBlogPosts, getPost } from "@/data/blog"
import { notFound } from "next/navigation"
import BlogPostContent from "./blog-post-content"

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} />
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata | undefined> {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description } = post.metadata

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}







