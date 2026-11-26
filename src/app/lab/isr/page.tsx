import type { Metadata } from "next";
import Link from "next/link";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "ISR 缓存观测",
};

export default function IsrPage() {
  const renderedAt = new Date().toISOString();
  const commit = process.env.VERCEL_GIT_COMMIT_SHA ?? "local-build";

  return (
    <main className="site-shell">
      <section className="page-hero">
        <p className="eyebrow">INCREMENTAL STATIC REGENERATION</p>
        <h1>
          这页本该
          <span className="gradient-text">静止 30 秒</span>。
        </h1>
        <p>
          ISR 页面先以静态内容响应，超过 revalidate 窗口后再后台再生。刷新页面时观察下方时间：
          短时间内不变，窗口过后才会产生新的渲染时间。这正是迁移时最容易出现“首页更新了、详情页没更新”
          的地方。
        </p>
      </section>

      <div className="lab-grid">
        <section className="panel span-7">
          <div className="panel-title">
            <h2>缓存快照</h2>
            <span>isr / revalidate 30s</span>
          </div>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">rendered_at</span>
              <span className="kv-value">{renderedAt}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">render_mode</span>
              <span className="kv-value">static + revalidate</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">commit</span>
              <span className="kv-value">{commit.slice(0, 18)}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">next_public_env</span>
              <span className="kv-value">
                {process.env.NEXT_PUBLIC_LAB_ENV ?? "not-set"}
              </span>
            </div>
          </div>
          <div className="mini-links">
            <Link className="mini-link" href="/lab">
              返回运行观测台
            </Link>
            <a className="mini-link" href="/lab/isr">
              再刷新一次
            </a>
          </div>
        </section>

        <section className="panel span-5">
          <div className="panel-title">
            <h3>怎么判断是否命中</h3>
            <span>migration test</span>
          </div>
          <div className="feature-state">
            <div className="feature-row">
              <p>用 curl 连续请求两次</p>
              <strong>时间应保持一致</strong>
            </div>
            <div className="feature-row">
              <p>等待 30 秒后再次请求</p>
              <strong>时间应更新</strong>
            </div>
            <div className="feature-row">
              <p>对比 Vercel 与腾讯云</p>
              <strong>记录命中率</strong>
            </div>
          </div>
          <div className="note" style={{ marginTop: 22 }}>
            <strong>注意：</strong>
            只比较 HTML 时间还不够。迁移验收还要检查 `x-vercel-cache`
            之类的原平台响应头是否被业务依赖，以及目标平台是否支持按 tag/path 主动失效。
          </div>
        </section>
      </div>
    </main>
  );
}
