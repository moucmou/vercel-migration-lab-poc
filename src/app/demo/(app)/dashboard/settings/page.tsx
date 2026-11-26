import type { Metadata } from "next";
import {
  enqueueDigestAction,
  processQueueAction,
  revalidateDemoAction,
} from "@/app/demo/actions";
import { SubmitButton } from "@/components/demo/submit-button";
import { requireSession } from "@/lib/auth";
import { FLAG_META, getFlags } from "@/lib/flags";
import { formatDate, formatFullNumber } from "@/lib/format";
import { getTenant } from "@/lib/mock-data";
import { listJobs, queueStats } from "@/lib/queue";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
  await requireSession("/demo/dashboard/settings");
  const { tenant, variant } = await getTenantContext();
  const tenantInfo = getTenant(tenant);
  const flags = getFlags(tenant, variant);
  const queue = queueStats();
  const jobs = listJobs().slice(0, 8);

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">TENANT SETTINGS</p>
          <h1>设置</h1>
          <p>
            这个页面集中展示迁移时最容易“看起来有、实际不等价”的能力：
            Flags、队列、缓存失效与密钥。
          </p>
        </div>
      </header>

      <section className="demo-split">
        <div className="panel">
          <div className="panel-title">
            <h2>租户</h2>
            <span>{tenantInfo.slug}</span>
          </div>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">plan</span>
              <span className="kv-value">{tenantInfo.plan}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">region</span>
              <span className="kv-value">{tenantInfo.region}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">seats</span>
              <span className="kv-value">{tenantInfo.seats}</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">monthly requests</span>
              <span className="kv-value">
                {formatFullNumber(tenantInfo.monthlyRequests)}
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h2>Feature Flags</h2>
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
          <p className="note">
            可用环境变量覆盖：<code>FLAG_NEW_DASHBOARD</code>、
            <code>FLAG_AI_SUMMARY</code>、<code>FLAG_CHECKOUT_V2</code>。
            Vercel Flags 的定向规则与 Explorer 在目标端没有同层产品。
          </p>
        </div>
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>队列与后台任务</h2>
          <span>
            queued {queue.queued} · failed {queue.failed} · done {queue.done}
          </span>
        </div>
        <div className="demo-head-actions">
          <form action={enqueueDigestAction}>
            <SubmitButton pendingText="入队中…">入队摘要任务</SubmitButton>
          </form>
          <form action={processQueueAction}>
            <SubmitButton pendingText="处理中…">处理一个任务</SubmitButton>
          </form>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job</th>
                <th>Type</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Updated</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id}>
                  <td>
                    <code>{job.id}</code>
                  </td>
                  <td>{job.type}</td>
                  <td>
                    <span className={`badge badge-${job.status}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>{job.attempts}</td>
                  <td>{formatDate(job.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="demo-split">
        <div className="panel">
          <div className="panel-title">
            <h2>缓存失效</h2>
            <span>tag metrics / path blog</span>
          </div>
          <p className="note">
            触发后会清理指标缓存并重新验证 Blog 路径。目标端必须提供等价的
            tag/path 失效语义，否则会出现“首页更新、详情页不更新”。
          </p>
          <form action={revalidateDemoAction}>
            <SubmitButton pendingText="失效中…">
              触发 revalidate
            </SubmitButton>
          </form>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h2>API Keys</h2>
            <span>masked</span>
          </div>
          <div className="kv-list">
            <div className="kv-row">
              <span className="kv-key">live key</span>
              <span className="kv-value">
                sk_live_{tenant}_••••••••9f2c
              </span>
            </div>
            <div className="kv-row">
              <span className="kv-key">webhook secret</span>
              <span className="kv-value">whsec_demo_••••••</span>
            </div>
            <div className="kv-row">
              <span className="kv-key">revalidate secret</span>
              <span className="kv-value">set via env</span>
            </div>
          </div>
          <p className="note">
            真实迁移时，密钥应进入 KMS / Secrets Manager，而不是代码或明文环境变量。
          </p>
        </div>
      </section>
    </div>
  );
}
