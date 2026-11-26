import Link from "next/link";
import { capabilityRows, migrationPhases, riskLayers } from "@/lib/migration-data";

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">VERCEL → TENCENT CLOUD · MIGRATION LAB</p>
          <h1 className="hero-title">
            先看清 Vercel 的
            <span className="gradient-text">运行边界</span>，
            <br />
            再迁移业务。
          </h1>
          <p className="hero-copy">
            这不是一张概念对照表。这里用真实部署运行 SSR、API、请求拦截、ISR、Cron
            和环境变量，用可观测结果判断每一项能力迁到腾讯云后是否等价。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/demo">
              打开复杂业务 Mock
            </Link>
            <Link className="button" href="/lab">
              打开运行观测台
            </Link>
            <Link className="button" href="/migration">
              查看迁移映射
            </Link>
          </div>
        </div>
        <aside className="hero-terminal" aria-label="迁移演练关键指标">
          <div className="terminal-bar">
            <span />
            <span />
            <span />
            <p>migration-readiness</p>
          </div>
          <div className="terminal-body">
            <p>
              <span className="prompt">$</span> inspect runtime
            </p>
            <p className="terminal-muted">framework ......... Next.js 16</p>
            <p className="terminal-muted">compute ........... Vercel Functions</p>
            <p className="terminal-muted">edge boundary ..... Proxy</p>
            <p className="terminal-muted">cache mode ........ ISR / static</p>
            <p className="terminal-ok">✓ observability ready</p>
            <p className="terminal-ok">✓ rollback path defined</p>
            <p>
              <span className="prompt">$</span> target tencent-cloud
              <span className="cursor" />
            </p>
          </div>
        </aside>
      </section>

      <section className="stats-grid" aria-label="演练概览">
        <article className="stat-card">
          <p className="stat-label">真实运行能力</p>
          <strong>6</strong>
          <span>SSR / API / Proxy / ISR / Cron / Env</span>
        </article>
        <article className="stat-card">
          <p className="stat-label">迁移映射层</p>
          <strong>14</strong>
          <span>计算、数据、网络、安全、运维</span>
        </article>
        <article className="stat-card">
          <p className="stat-label">切换门禁</p>
          <strong>3</strong>
          <span>功能、性能、回滚同时通过</span>
        </article>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">三步迁移法</p>
            <h2>不从服务器开始，从依赖边界开始</h2>
          </div>
          <p>
            迁移失败通常不是代码跑不起来，而是缓存、定时任务、域名、密钥和回滚没有被一起搬迁。
          </p>
        </div>
        <div className="phase-grid">
          {migrationPhases.map((phase) => (
            <article className="phase-card" key={phase.number}>
              <div className="phase-topline">
                <span className="phase-number">{phase.number}</span>
                <span className="badge">{phase.duration}</span>
              </div>
              <h3>{phase.title}</h3>
              <p>{phase.description}</p>
              <ul>
                {phase.outputs.map((output) => (
                  <li key={output}>{output}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">能力等价矩阵</p>
            <h2>每个 Vercel 能力，都要有腾讯云的验证替身</h2>
          </div>
          <Link className="text-link" href="/migration">
            查看完整映射 →
          </Link>
        </div>
        <div className="table-wrap">
          <table className="cap-table">
            <thead>
              <tr>
                <th>能力</th>
                <th>演练入口</th>
                <th>Vercel 原语</th>
                <th>腾讯云首选</th>
                <th>验证重点</th>
              </tr>
            </thead>
            <tbody>
              {capabilityRows.map((row) => (
                <tr key={row.capability}>
                  <td>
                    <span className={`dot ${row.status}`} />
                    {row.capability}
                  </td>
                  <td>
                    <code>{row.route}</code>
                  </td>
                  <td>{row.vercel}</td>
                  <td>{row.tencent}</td>
                  <td>{row.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="section callout">
        <div>
          <p className="eyebrow">先保住可回退性</p>
          <h2>迁移期间不做“大爆炸式切换”</h2>
          <p>
            先用量化流量在腾讯云验证，再按 1% → 10% → 50% → 100%
            放量。DNS 的 TTL、缓存预热、数据双向同步和 Vercel
            项目保留时间，必须在切换前写进 Runbook。
          </p>
        </div>
        <div className="risk-list">
          {riskLayers.map((item) => (
            <div className="risk-row" key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
