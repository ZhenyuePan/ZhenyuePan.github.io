import { getBlogPosts, getPost } from "@/data/blog"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogPostContent from "./blog-post-content"

// Define the Post type to match what BlogPostContent expects
type Post = {
  slug: string;
  source: string;
  metadata: {
    title: string;
    publishedAt: string;
    summary: string;
    image?: string;
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata | undefined> {
  const resolvedParams = await params
  const post = await getPost(resolvedParams.slug)

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
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params
  const rawPost = await getPost(resolvedParams.slug)

  if (!rawPost) {
    notFound()
  }

  // Ensure the post object matches the Post type
  const post: Post = {
    slug: rawPost.slug,
    source: rawPost.source,
    metadata: {
      title: rawPost.metadata.title || '',
      publishedAt: rawPost.metadata.publishedAt || '',
      summary: rawPost.metadata.summary || '',
      image: rawPost.metadata.image,
    }
  }

  return <BlogPostContent post={post} />
}