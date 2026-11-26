import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import { listPosts } from "@/lib/mock-data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "ISR 60 秒再生的内容站示例。",
};

export default function BlogPage() {
  const posts = listPosts();

  return (
    <main className="demo-content-page">
      <header className="demo-content-head">
        <p className="eyebrow">CONTENT · ISR 60S</p>
        <h1>迁移日志</h1>
        <p>
          这一组页面使用 ISR：首次生成后缓存 60 秒，过期请求先拿到旧快照并触发后台再生。
          迁移后重点观察多副本是否共享同一份缓存。
        </p>
      </header>

      <div className="demo-post-grid">
        {posts.map((post) => (
          <article className="demo-post-card" key={post.slug}>
            <div className="demo-post-meta">
              <span>{formatDate(post.publishedAt)}</span>
              <span>{post.readMinutes} min read</span>
            </div>
            <h2>
              <Link href={`/demo/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.excerpt}</p>
            <div className="tag-row">
              {post.tags.map((tag) => (
                <span className="badge" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <Link className="text-link" href={`/demo/blog/${post.slug}`}>
              阅读全文 →
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
