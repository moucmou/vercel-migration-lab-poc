import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamicParams = false;

const docs: Record<
  string,
  { title: string; eyebrow: string; body: string[] }
> = {
  "getting-started": {
    title: "从演练台开始",
    eyebrow: "DOCS · GETTING STARTED",
    body: [
      "这套 Demo 的目标不是复刻一个完整 SaaS，而是把迁移时最容易出问题的能力放进同一条请求链路。",
      "建议先登录，观察 Dashboard 的租户、变体、请求 ID，再进入 Projects 执行一次创建、归档和删除。",
      "接着打开 Blog 观察 ISR，打开 Streaming 观察流式渲染，最后到 Settings 触发队列和缓存失效。",
    ],
  },
  "deploy/vercel": {
    title: "部署到 Vercel",
    eyebrow: "DOCS · DEPLOY / VERCEL",
    body: [
      "Vercel 侧使用 Dashboard 上传或 Git 集成部署。生产环境需要配置 LAB_ENV_LABEL、NEXT_PUBLIC_LAB_ENV、CRON_SECRET。",
      "部署后记录 x-vercel-id、x-vercel-cache、VERCEL_REGION 和 VERCEL_DEPLOYMENT_ID，作为迁移基线。",
      "如果使用 Hobby 计划，注意它只适合验证，不适合商业生产流量。",
    ],
  },
  "deploy/makers": {
    title: "部署到 EdgeOne Makers",
    eyebrow: "DOCS · DEPLOY / MAKERS",
    body: [
      "Makers 侧使用同一份代码和同一组环境变量指纹，优先选择直接上传或 Git 导入。",
      "部署后先跑框架层探针，再跑数据层探针；不要先接真实数据库，否则排障会被数据问题淹没。",
      "如果暂时没有域名和备案，先用平台默认域名验证运行时，再补自定义域名和 HTTPS。",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((key) => ({ slug: key.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs[slug.join("/")];
  return { title: doc ? doc.title : "Docs" };
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = docs[slug.join("/")];
  if (!doc) notFound();

  return (
    <main className="demo-content-page demo-article">
      <Link className="text-link" href="/demo">
        ← 返回 Demo
      </Link>
      <header className="demo-content-head">
        <p className="eyebrow">{doc.eyebrow}</p>
        <h1>{doc.title}</h1>
      </header>
      <div className="article-body">
        {doc.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
