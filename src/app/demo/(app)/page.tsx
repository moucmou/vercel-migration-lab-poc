import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getCachedMetrics } from "@/lib/cached";
import { getTenant, listPosts } from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Acme Cloud · 复杂业务 Mock",
};

const features = [
  {
    title: "多租户",
    body: "Host / query / cookie 三级租户识别，Proxy 写入请求头，页面与 API 统一读取。",
    href: "/demo/t/globex",
  },
  {
    title: "认证与会话",
    body: "签名 Cookie + Proxy 重定向 + Server Action 登录，验证边缘鉴权与回跳。",
    href: "/demo/login",
  },
  {
    title: "Flags 与实验",
    body: "按租户套餐、环境变量与 A/B 变体计算 Flag，验证 Vercel Flags 的替代难度。",
    href: "/demo/dashboard/settings",
  },
  {
    title: "队列与后台任务",
    body: "幂等键、重复投递、失败重试、worker 处理，模拟异步摘要与摘要邮件。",
    href: "/demo/dashboard/settings",
  },
  {
    title: "ISR 与按需失效",
    body: "Blog 60 秒再生，设置页触发 revalidateTag / revalidatePath，观察缓存语义。",
    href: "/demo/blog",
  },
  {
    title: "上传与 Webhook",
    body: "multipart 限额、SHA-256、原始 body 的 HMAC 签名校验，覆盖真实回调链路。",
    href: "/lab",
  },
  {
    title: "流式渲染",
    body: "Suspense + 异步组件，观察首字节与完整 HTML 的时间差。",
    href: "/demo/streaming",
  },
  {
    title: "图片与 OG",
    body: "next/image 与 Edge ImageResponse，验证图片优化和边缘函数边界。",
    href: "/demo/images",
  },
];

export default async function DemoHomePage() {
  const { tenant, variant, requestId } = await getTenantContext();
  const tenantInfo = getTenant(tenant);
  const session = await getSession();
  const metrics = await getCachedMetrics(tenant);
  const posts = listPosts().slice(0, 3);

  return (
    <div className="demo-page">
      <section className="demo-hero">
        <div>
          <p className="eyebrow">ACME CLOUD · MOCK PRODUCTION APP</p>
          <h1>
            一套更接近
            <span className="gradient-text">真实生产</span>
            <br />
            的 Vercel 迁移样本。
          </h1>
          <p className="hero-copy">
            多租户、登录态、队列、Flags、ISR、图片、上传、Webhook 和流式渲染都在这里。
            它不是 Vercel 的功能清单，而是一套会被真实流量和真实故障打到的业务 mock。
          </p>
          <div className="hero-actions">
            <Link
              className="button button-primary"
              href={session ? "/demo/dashboard" : "/demo/login"}
            >
              {session ? "进入控制台" : "登录 Demo"}
            </Link>
            <Link className="button" href="/demo/blog">
              查看 ISR 博客
            </Link>
            <Link className="button" href="/demo/streaming">
              观察流式渲染
            </Link>
          </div>
        </div>

        <aside className="demo-context-card">
          <p className="eyebrow">RESOLVED CONTEXT</p>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">tenant</span>
              <span className="kv-value">{tenantInfo.name}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">plan / region</span>
              <span className="kv-value">
                {tenantInfo.plan} / {tenantInfo.region}
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">variant</span>
              <span className="kv-value">{variant}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">request</span>
              <span className="kv-value">{requestId.slice(0, 18)}…</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">projects</span>
              <span className="kv-value">
                {metrics.activeCount} active / {metrics.projectCount} total
              </span>
            </div>
          </div>
          <p className="note">
            当前租户可通过 <code>?tenant=globex</code> 或{" "}
            <code>/demo/t/initech</code> 切换。
          </p>
        </aside>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">WHAT THIS MOCK EXERCISES</p>
          <h2>八个会决定迁移成败的能力面</h2>
        </div>
        <div className="demo-feature-grid">
          {features.map((feature) => (
            <Link className="demo-feature" href={feature.href} key={feature.title}>
              <strong>{feature.title}</strong>
              <p>{feature.body}</p>
              <span>打开 →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="demo-split">
          <div className="panel">
            <div className="panel-title">
              <h2>Mock 边界</h2>
              <span>read me first</span>
            </div>
            <div className="demo-note-list">
              <p>
                数据存在进程内，部署或实例切换后会重置；真实迁移必须换
                TencentDB / Redis / COS。
              </p>
              <p>
                上传接口只计算 SHA-256 并返回 mock URL，不写入持久化对象存储。
              </p>
              <p>
                AI 摘要、队列 worker、Webhook 均为本地模拟，用于验证接口语义与超时边界。
              </p>
              <p>
                登录是 demo 凭证，不构成真实安全方案；迁移时替换为
                IdP / CAM / 自建会话。
              </p>
            </div>
          </div>
          <div className="panel">
            <div className="panel-title">
              <h2>最近文章</h2>
              <span>ISR 60s</span>
            </div>
            <div className="demo-post-list">
              {posts.map((post) => (
                <Link href={`/demo/blog/${post.slug}`} key={post.slug}>
                  <strong>{post.title}</strong>
                  <span>
                    {post.author} · {post.readMinutes} min
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
