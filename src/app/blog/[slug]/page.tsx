import { getBlogPosts, getPost } from "@/data/blog"
//import { DATA } from "@/data/resume"
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
  params: {
    slug: string
  }
}): Promise<Metadata | undefined> {
  const post = await getPost(params.slug)

  if (!post) {
    return
  }

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata
  //const ogImage = image ? `${DATA.url}${image}` : `${DATA.url}/og?title=${title}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
    //  url: `${DATA.url}/blog/${post.slug}`,
    //  images: [
    //    {
    //      url: ogImage,
    //    },
    //  ],
    },
    twitter: {
      
      card: "summary_large_image",
      title,
      description,
     // images: [ogImage],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: {
    slug: string
  }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return <BlogPostContent post={post} />
}