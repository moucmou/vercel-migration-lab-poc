import type { Metadata } from "next";
import Link from "next/link";
import { MetricChart } from "@/components/demo/metric-chart";
import { requireSession } from "@/lib/auth";
import { getCachedMetrics } from "@/lib/cached";
import { FLAG_META, getFlags } from "@/lib/flags";
import { formatDate, formatFullNumber, formatPercent } from "@/lib/format";
import {
  getTenant,
  listActivity,
  listProjects,
} from "@/lib/mock-data";
import { queueStats } from "@/lib/queue";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireSession("/demo/dashboard");
  const { tenant, variant, requestId, proxy } = await getTenantContext();
  const tenantInfo = getTenant(tenant);
  const metrics = await getCachedMetrics(tenant);
  const projects = listProjects(tenant).slice(0, 4);
  const activity = listActivity(tenant, 6);
  const queue = queueStats();
  const flags = getFlags(tenant, variant);

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">OPERATIONS OVERVIEW</p>
          <h1>你好，{session.name}</h1>
          <p>
            {tenantInfo.name} 当前运行在 {tenantInfo.region}，套餐{" "}
            {tenantInfo.plan}。以下指标来自 mock 数据与缓存层。
          </p>
        </div>
        <div className="demo-head-actions">
          <Link className="button button-small" href="/demo/dashboard/projects/new">
            新建项目
          </Link>
          <Link className="button button-small" href="/demo/dashboard/settings">
            设置
          </Link>
        </div>
      </header>

      <section className="metric-grid" aria-label="核心指标">
        <article className="metric-card">
          <p className="metric-label">Requests / month</p>
          <strong>{formatFullNumber(metrics.totalRequests)}</strong>
          <span>累计 {metrics.projectCount} 个项目</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">P95 latency</p>
          <strong>{metrics.p95}ms</strong>
          <span>目标 &lt; 250ms</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Avg error rate</p>
          <strong>{formatPercent(metrics.avgErrorRate)}</strong>
          <span>过去 24 小时</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Active projects</p>
          <strong>
            {metrics.activeCount}/{metrics.projectCount}
          </strong>
          <span>mock 进程内状态</span>
        </article>
      </section>

      <section className="demo-split">
        <div className="panel">
          <div className="panel-title">
            <h2>请求趋势</h2>
            <span>cache 30s · tag metrics</span>
          </div>
          <MetricChart values={metrics.sparkline} />
          <p className="note">
            该指标通过 <code>unstable_cache</code> 缓存 30 秒，设置页可触发{" "}
            <code>updateTag(&quot;metrics&quot;)</code>。
          </p>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h2>Flags / 变体</h2>
            <span>variant {variant}</span>
          </div>
          <div className="flag-list">
            {FLAG_META.map((flag) => (
              <div className="flag-row" key={flag.key}>
                <div>
                  <strong>{flag.label}</strong>
                  <span>{flag.description}</span>
                </div>
                <span
                  className={`badge ${
                    flags[flag.key] ? "badge-green" : "badge-muted"
                  }`}
                >
                  {flags[flag.key] ? "on" : "off"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="demo-split">
        <div className="panel">
          <div className="panel-title">
            <h2>最近项目</h2>
            <Link className="text-link" href="/demo/dashboard/projects">
              全部项目 →
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>状态</th>
                  <th>请求</th>
                  <th>P95</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/demo/dashboard/projects/${project.id}`}
                      >
                        {project.name}
                      </Link>
                      <small>{project.tags.join(" · ")}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${project.status}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>{formatFullNumber(project.requests)}</td>
                    <td>{project.p95}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h2>队列</h2>
            <Link className="text-link" href="/demo/dashboard/settings">
              管理 →
            </Link>
          </div>
          <div className="queue-stats">
            <div>
              <strong>{queue.queued}</strong>
              <span>queued</span>
            </div>
            <div>
              <strong>{queue.running}</strong>
              <span>running</span>
            </div>
            <div>
              <strong>{queue.done}</strong>
              <span>done</span>
            </div>
            <div>
              <strong>{queue.failed}</strong>
              <span>failed</span>
            </div>
          </div>
          <p className="note">
            队列为进程内 mock，用于验证 at-least-once、幂等键与重试语义。
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>最近活动</h2>
          <span>{activity.length} events</span>
        </div>
        <div className="timeline">
          {activity.map((event) => (
            <div className="timeline-item" key={event.id}>
              <span className={`badge badge-${event.type}`}>{event.type}</span>
              <div>
                <strong>{event.message}</strong>
                <small>
                  {event.actor} · {formatDate(event.at)}
                </small>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="runtime-strip">
        <span>region {process.env.VERCEL_REGION ?? "local"}</span>
        <span>env {process.env.VERCEL_ENV ?? "local"}</span>
        <span>proxy {proxy}</span>
        <span>variant {variant}</span>
        <span>req {requestId.slice(0, 16)}</span>
      </section>
    </div>
  );
}
