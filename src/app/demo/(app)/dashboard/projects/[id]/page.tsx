import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  archiveProjectAction,
  deleteProjectAction,
} from "@/app/demo/actions";
import { SubmitButton } from "@/components/demo/submit-button";
import { requireSession } from "@/lib/auth";
import {
  formatDate,
  formatFullNumber,
  formatPercent,
} from "@/lib/format";
import {
  getProject,
  listActivity,
} from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = getProject(id);
  return { title: project ? project.name : "Project not found" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession("/demo/dashboard/projects");
  const { tenant } = await getTenantContext();
  const { id } = await params;
  const project = getProject(id);

  if (!project || project.tenant !== tenant) notFound();

  const projectActivity = listActivity(tenant, 30).filter((event) =>
    event.message.includes(project.name),
  );
  const activity = projectActivity.length > 0
    ? projectActivity
    : listActivity(tenant, 5);

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">PROJECT DETAIL · {project.id}</p>
          <h1>{project.name}</h1>
          <p>{project.description}</p>
        </div>
        <div className="demo-head-actions">
          <Link className="button button-small" href="/demo/dashboard/projects">
            ← 返回列表
          </Link>
          <form action={archiveProjectAction}>
            <input type="hidden" name="id" value={project.id} />
            <SubmitButton pendingText="归档中…">归档</SubmitButton>
          </form>
          <form action={deleteProjectAction}>
            <input type="hidden" name="id" value={project.id} />
            <SubmitButton
              className="button button-small button-danger"
              pendingText="删除中…"
            >
              删除
            </SubmitButton>
          </form>
        </div>
      </header>

      <section className="metric-grid">
        <article className="metric-card">
          <p className="metric-label">Requests</p>
          <strong>{formatFullNumber(project.requests)}</strong>
          <span>生命周期累计</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">P95</p>
          <strong>{project.p95}ms</strong>
          <span>过去 24 小时</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Error rate</p>
          <strong>{formatPercent(project.errorRate)}</strong>
          <span>5xx / total</span>
        </article>
        <article className="metric-card">
          <p className="metric-label">Status</p>
          <strong>
            <span className={`badge badge-${project.status}`}>
              {project.status}
            </span>
          </strong>
          <span>updated {formatDate(project.updatedAt)}</span>
        </article>
      </section>

      <section className="demo-split">
        <div className="panel">
          <div className="panel-title">
            <h2>元数据</h2>
            <span>mock store</span>
          </div>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">owner</span>
              <span className="kv-value">{project.owner}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">tenant</span>
              <span className="kv-value">{project.tenant}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">created</span>
              <span className="kv-value">{formatDate(project.createdAt)}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">tags</span>
              <span className="kv-value">{project.tags.join(" · ")}</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h2>项目活动</h2>
            <span>{activity.length} events</span>
          </div>
          <div className="timeline">
            {activity.map((event) => (
              <div className="timeline-item" key={event.id}>
                <span className={`badge badge-${event.type}`}>
                  {event.type}
                </span>
                <div>
                  <strong>{event.message}</strong>
                  <small>
                    {event.actor} · {formatDate(event.at)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>迁移观察点</h2>
          <span>checklist hints</span>
        </div>
        <div className="demo-note-list">
          <p>
            项目详情是动态 SSR；迁移后要验证请求头、Cookie、租户隔离与错误边界。
          </p>
          <p>
            归档/删除走 Server Action；目标平台必须支持表单动作与
            <code>revalidatePath</code> 等价语义。
          </p>
          <p>
            当前数据在进程内，实例切换后会重置；真实迁移需落
            TencentDB，并验证事务与连接池。
          </p>
        </div>
      </section>
    </div>
  );
}
