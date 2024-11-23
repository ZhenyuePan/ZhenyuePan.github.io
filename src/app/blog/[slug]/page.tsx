import { getBlogPosts, getPost } from "@/data/blog"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPostContent from "./blog-post-content"

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata | undefined> {
  const post = await getPost(params.slug)

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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} />
}

