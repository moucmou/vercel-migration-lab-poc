import type { Metadata } from "next";
import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { formatDate, formatFullNumber, formatPercent } from "@/lib/format";
import { listProjects } from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
};

const PAGE_SIZE = 5;
const statuses = ["all", "active", "paused", "archived"] as const;
type Status = (typeof statuses)[number];

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  await requireSession("/demo/dashboard/projects");
  const { tenant } = await getTenantContext();
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const status = statuses.includes(params.status as Status)
    ? (params.status as Status)
    : "all";
  const requestedPage = Number(params.page ?? "1");

  const filtered = listProjects(tenant).filter((project) => {
    const matchesQuery =
      !query ||
      project.name.toLowerCase().includes(query.toLowerCase()) ||
      project.description.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || project.status === status;
    return matchesQuery && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(
    Math.max(1, Number.isFinite(requestedPage) ? requestedPage : 1),
    totalPages,
  );
  const rows = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function pageHref(page: number) {
    const nextParams = new URLSearchParams();
    if (query) nextParams.set("q", query);
    if (status !== "all") nextParams.set("status", status);
    if (page > 1) nextParams.set("page", String(page));
    const suffix = nextParams.toString();
    return `/demo/dashboard/projects${suffix ? `?${suffix}` : ""}`;
  }

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">MULTI-TENANT PROJECTS</p>
          <h1>项目</h1>
          <p>
            {filtered.length} 个结果 · 租户 {tenant} · 第 {currentPage}/
            {totalPages} 页
          </p>
        </div>
        <Link className="button button-primary" href="/demo/dashboard/projects/new">
          新建项目
        </Link>
      </header>

      <form className="demo-filter" method="get">
        <label className="field">
          <span>搜索</span>
          <input
            className="input"
            name="q"
            defaultValue={query}
            placeholder="按名称或描述搜索"
          />
        </label>
        <label className="field">
          <span>状态</span>
          <select className="input" name="status" defaultValue={status}>
            {statuses.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <button className="button button-small" type="submit">
          筛选
        </button>
        <Link className="text-link" href="/demo/dashboard/projects">
          重置
        </Link>
      </form>

      <section className="panel">
        {rows.length === 0 ? (
          <div className="empty-state">
            <strong>没有匹配的项目</strong>
            <p>换一个关键词或状态，或者新建一个项目。</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>项目</th>
                  <th>状态</th>
                  <th>请求</th>
                  <th>P95</th>
                  <th>错误率</th>
                  <th>更新时间</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((project) => (
                  <tr key={project.id}>
                    <td>
                      <Link
                        className="table-link"
                        href={`/demo/dashboard/projects/${project.id}`}
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
                    <td>{formatPercent(project.errorRate)}</td>
                    <td>{formatDate(project.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <nav className="pagination" aria-label="分页">
        <Link
          className={currentPage === 1 ? "disabled" : ""}
          href={pageHref(Math.max(1, currentPage - 1))}
        >
          ← 上一页
        </Link>
        <span>
          {currentPage} / {totalPages}
        </span>
        <Link
          className={currentPage === totalPages ? "disabled" : ""}
          href={pageHref(Math.min(totalPages, currentPage + 1))}
        >
          下一页 →
        </Link>
      </nav>
    </div>
  );
}
