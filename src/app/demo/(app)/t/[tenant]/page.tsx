import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCachedMetrics } from "@/lib/cached";
import { formatFullNumber, formatPercent } from "@/lib/format";
import { getTenant, listProjects } from "@/lib/mock-data";
import { isTenantSlug } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tenant: string }>;
}): Promise<Metadata> {
  const { tenant } = await params;
  return {
    title: isTenantSlug(tenant) ? `${getTenant(tenant).name} · Tenant` : "Tenant",
  };
}

export default async function TenantPage({
  params,
}: {
  params: Promise<{ tenant: string }>;
}) {
  const { tenant: slug } = await params;
  if (!isTenantSlug(slug)) notFound();

  const tenant = getTenant(slug);
  const metrics = await getCachedMetrics(slug);
  const projects = listProjects(slug);

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">PATH-BASED TENANT</p>
          <h1>{tenant.name}</h1>
          <p>
            这是路径级多租户页面：<code>/demo/t/{slug}</code>。它与
            <code>?tenant=</code>、Host 级租户共用同一套解析逻辑。
          </p>
        </div>
        <Link
          className="button button-primary"
          href={`/demo/dashboard?tenant=${slug}`}
        >
          用该租户进入控制台
        </Link>
      </header>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-label">Plan</p>
          <strong>{tenant.plan}</strong>
          <span>{tenant.region}</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Monthly requests</p>
          <strong>{formatFullNumber(tenant.monthlyRequests)}</strong>
          <span>{tenant.seats} seats</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Projects</p>
          <strong>{metrics.projectCount}</strong>
          <span>{metrics.activeCount} active</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Avg error</p>
          <strong>{formatPercent(metrics.avgErrorRate)}</strong>
          <span>mock metrics</span>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>项目</h2>
          <span>{projects.length} rows</span>
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
                      href={`/demo/dashboard/projects/${project.id}?tenant=${slug}`}
                    >
                      {project.name}
                    </Link>
                    <small>{project.description}</small>
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
      </section>
    </div>
  );
}
