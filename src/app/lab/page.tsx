import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { ApiLab } from "@/components/api-lab";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "运行观测台",
};

const headerKeys = [
  "host",
  "x-vercel-id",
  "x-vercel-deployment-url",
  "x-vercel-ip-country",
  "x-vercel-ip-city",
  "x-lab-proxy",
  "x-lab-proxy-path",
];

function displayValue(value: string | null) {
  return value && value.length > 0 ? value : "not-present";
}

function shortHash(value: string | undefined) {
  if (!value) return "not-present";
  return value.length > 13 ? `${value.slice(0, 7)}…${value.slice(-4)}` : value;
}

export default async function LabPage() {
  const requestHeaders = await headers();
  const headerRows = headerKeys.map((key) => ({
    key,
    value: displayValue(requestHeaders.get(key)),
  }));
  const isVercel = Boolean(process.env.VERCEL);
  const proxyHit = requestHeaders.get("x-lab-proxy") === "hit";
  const envRows = [
    {
      key: "LAB_ENV_LABEL",
      value: process.env.LAB_ENV_LABEL ?? "not-set",
    },
    {
      key: "VERCEL_ENV",
      value: process.env.VERCEL_ENV ?? "local",
    },
    {
      key: "VERCEL_REGION",
      value: process.env.VERCEL_REGION ?? "local",
    },
    {
      key: "VERCEL_GIT_COMMIT_SHA",
      value: shortHash(process.env.VERCEL_GIT_COMMIT_SHA),
    },
    {
      key: "VERCEL_DEPLOYMENT_ID",
      value: process.env.VERCEL_DEPLOYMENT_ID ?? "local",
    },
  ];

  return (
    <main className="site-shell">
      <section className="page-hero">
        <p className="eyebrow">OBSERVE BEFORE MIGRATE</p>
        <h1>
          看见每一次
          <span className="gradient-text">请求</span>
          <br />
          落在哪种运行时。
        </h1>
        <p>
          这一页由服务端动态渲染。页面上方的代理标记、地域信息、部署元数据，以及四个 API
          探针，是迁移时最先要建立的双端对照基线。
        </p>
      </section>

      <div className="status-strip" aria-label="运行状态">
        <span className="status-pill">
          platform <strong>{isVercel ? "vercel" : "local"}</strong>
        </span>
        <span className="status-pill">
          render <strong>dynamic / SSR</strong>
        </span>
        <span className="status-pill">
          proxy <strong>{proxyHit ? "hit" : "miss"}</strong>
        </span>
        <span className="status-pill">
          node <strong>{process.version}</strong>
        </span>
      </div>

      <div className="lab-grid">
        <section className="panel span-7">
          <div className="panel-title">
            <h2>请求上下文</h2>
            <span>request headers</span>
          </div>
          <div className="kv-list">
            {headerRows.map((row) => (
              <div className="kv-row" key={row.key}>
                <span className="kv-key">{row.key}</span>
                <span
                  className={`kv-value ${
                    row.value === "not-present" ? "muted-value" : ""
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="note" style={{ marginTop: 22 }}>
            <strong>迁移提醒：</strong>
            Vercel 的 `x-vercel-*` 请求头不是标准协议。任何业务逻辑、审计或风控如果读取了这些头，
            切云后都需要显式适配，不能假设 EdgeOne 自动提供同名字段。
          </div>
        </section>

        <section className="panel span-5">
          <div className="panel-title">
            <h3>环境与部署</h3>
            <span>resolved values</span>
          </div>
          <div className="kv-list">
            {envRows.map((row) => (
              <div className="kv-row" key={row.key}>
                <span className="kv-key">{row.key}</span>
                <span
                  className={`kv-value ${
                    row.value === "not-set" || row.value === "local"
                      ? "muted-value"
                      : ""
                  }`}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>
          <div className="feature-state" style={{ marginTop: 24 }}>
            <div className="feature-row">
              <p>动态渲染</p>
              <strong>PASS</strong>
            </div>
            <div className="feature-row">
              <p>代理注入</p>
              <strong>{proxyHit ? "PASS" : "CHECK"}</strong>
            </div>
            <div className="feature-row">
              <p>Vercel 元数据</p>
              <strong>{isVercel ? "PASS" : "LOCAL"}</strong>
            </div>
          </div>
        </section>

        <section className="panel span-6">
          <div className="panel-title">
            <h2>API 探针</h2>
            <span>manual checks</span>
          </div>
          <ApiLab />
        </section>

        <section className="panel span-6">
          <div className="panel-title">
            <h2>缓存与定时任务</h2>
            <span>non-request paths</span>
          </div>
          <div className="feature-state">
            <div className="feature-row">
              <p>ISR 页面</p>
              <strong>revalidate 30s</strong>
            </div>
            <div className="feature-row">
              <p>Cron 入口</p>
              <strong>legacy cron + bearer</strong>
            </div>
            <div className="feature-row">
              <p>部署配置</p>
              <strong>vercel.json</strong>
            </div>
          </div>
          <div className="mini-links">
            <Link className="mini-link" href="/lab/isr">
              查看 ISR 页面
            </Link>
            <a className="mini-link" href="/api/cron/heartbeat">
              直接请求 Cron
            </a>
            <a
              className="mini-link"
              href="https://vercel.com/docs/cron-jobs"
              target="_blank"
              rel="noreferrer"
            >
              Vercel Cron 文档
            </a>
          </div>
          <div className="note" style={{ marginTop: 22 }}>
            <strong>迁移提醒：</strong>
            ISR 不是普通 CDN 缓存。切换目标必须验证 revalidate
            窗口、按标签失效、以及多实例之间是否共享同一份缓存。
          </div>
          <div className="note" style={{ marginTop: 10 }}>
            <strong>运行时变化：</strong>
            Next.js 16.3 起已弃用 Route Handler 的 `runtime = &quot;edge&quot;`，
            但当前 16.4.6 在 Vercel 上仍可构建和运行，并发出警告。Vercel
            建议存量 Edge Function 迁回 Node.js；这个探针只用于观察兼容行为，
            不应作为新项目选型依据。
          </div>
          <div className="note" style={{ marginTop: 10 }}>
            <strong>Cron 变化：</strong>
            Vercel 已在控制台把 Cron Jobs 标记为 Legacy，并推荐使用 Schedules。
            迁移清单应同时覆盖旧 Cron 配置与新 Schedules，不要假设旧能力长期不变。
          </div>
        </section>
      </div>
    </main>
  );
}
