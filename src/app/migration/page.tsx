import type { Metadata } from "next";
import {
  cutoverChecks,
  decisionPaths,
  migrationLayers,
} from "@/lib/migration-data";

export const metadata: Metadata = {
  title: "迁移能力映射",
};

const riskLabel = {
  low: "低风险",
  medium: "需验证",
  high: "高风险",
};

export default function MigrationPage() {
  return (
    <main className="site-shell">
      <section className="page-hero">
        <p className="eyebrow">CAPABILITY MAP · NOT A PRODUCT NAME MAPPING</p>
        <h1>
          迁移不是把
          <span className="gradient-text">产品名</span>
          <br />
          一一替换。
        </h1>
        <p>
          真正要迁移的是行为：请求在哪个运行时执行、缓存何时失效、任务由谁触发、状态存在哪里、
          故障时如何回退。下面 14 层是建议的盘点顺序，不是腾讯云最终选型结论。
        </p>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">先选路径</p>
            <h2>三条目标路径，取舍不同</h2>
          </div>
          <p>
            绝大多数 Next.js 站点优先评估 EdgeOne Pages；需要一体化后端时再看 CloudBase；
            有复杂网络与长连接需求才考虑 TKE。
          </p>
        </div>
        <div className="decision-grid">
          {decisionPaths.map((path) => (
            <article className="decision-card" key={path.title}>
              <h2>{path.title}</h2>
              <p>{path.bestFor}</p>
              <ul>
                {path.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">14 层迁移清单</p>
            <h2>从边缘网络，到回滚能力</h2>
          </div>
          <p>
            先从“低风险、可独立验证”的层开始，把数据库和域名切换留到功能、性能门禁之后。
          </p>
        </div>
        <div className="mapping-grid">
          {migrationLayers.map((layer) => (
            <article className="layer-card" key={layer.id}>
              <div className="layer-topline">
                <h2>{layer.category}</h2>
                <span className={`risk-badge ${layer.risk}`}>
                  {riskLabel[layer.risk]}
                </span>
              </div>
              <div className="layer-path">
                <p>{layer.vercel}</p>
                <span>→</span>
                <p>{layer.tencent}</p>
              </div>
              <div className="layer-detail">
                <p>
                  <strong>验收</strong>
                  {layer.check}
                </p>
                <p>
                  <strong>备注</strong>
                  {layer.fallback}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CUTOVER GATES</p>
            <h2>三个门禁，全部通过才切 DNS</h2>
          </div>
          <p>
            灰度不是“先切一点看看”。每个百分比都必须有可观测指标、止损阈值和明确的回滚动作。
          </p>
        </div>
        <div className="checklist">
          {cutoverChecks.map((check) => (
            <article className="check-item" key={check.step}>
              <span>{check.step}</span>
              <h3>{check.title}</h3>
              <p>
                {check.description}
                <br />
                <strong>证据：</strong>
                {check.evidence}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
