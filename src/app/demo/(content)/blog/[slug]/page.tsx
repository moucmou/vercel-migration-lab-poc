import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/format";
import { getPost, listPosts } from "@/lib/mock-data";

export const revalidate = 60;

export function generateStaticParams() {
  return listPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  return {
    title: post ? post.title : "Post not found",
    description: post?.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <main className="demo-content-page demo-article">
      <Link className="text-link" href="/demo/blog">
        ← 返回博客
      </Link>
      <header className="demo-content-head">
        <p className="eyebrow">ISR ARTICLE · 60S</p>
        <h1>{post.title}</h1>
        <p>
          {post.author} · {formatDate(post.publishedAt)} · {post.readMinutes} min
        </p>
        <div className="tag-row">
          {post.tags.map((tag) => (
            <span className="badge" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>
      <div className="article-body">
        {post.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="notice">
        这篇文章是 ISR 页面。刷新时如果内容没有立刻变化，属于 60 秒再生窗口内的预期行为。
      </div>
    </main>
  );
}
