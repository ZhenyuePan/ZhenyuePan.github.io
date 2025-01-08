import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { markdownToHTML } from "../lib/mdx";

interface PostMetadata {
  title: string;
  publishedAt: string;
  summary: string;
  image?: string;
  tags: string[];
}

interface Post {
  slug: string;
  source: string;
  metadata: PostMetadata;
  content: string;
}

function getMDXFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((file) => path.extname(file) === ".mdx");
}

export async function getPost(slug: string): Promise<Post | undefined> {
  const filePath = path.join(process.cwd(), "content", `${slug}.mdx`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const source = fs.readFileSync(filePath, "utf-8");
  const { content: rawContent, data: metadata } = matter(source);
  const content = await markdownToHTML(rawContent);
  return {
    slug,
    source: content,
    metadata: metadata as PostMetadata,
    content: content,
  };
}

async function getAllPosts(dir: string): Promise<Post[]> {
  const mdxFiles = getMDXFiles(dir);
  const posts = await Promise.all(
    mdxFiles.map(async (file) => {
      const slug = path.basename(file, path.extname(file));
      const post = await getPost(slug);
      return post as Post;
    })
  );
  return posts.filter((post): post is Post => post !== undefined);
}

export async function getBlogPosts(): Promise<Post[]> {
  return getAllPosts(path.join(process.cwd(), "content"));
}
