export type LayerRisk = "low" | "medium" | "high";
export type LayerStatus = "ready" | "verify" | "risk";

export interface MigrationLayer {
  id: string;
  category: string;
  vercel: string;
  tencent: string;
  fallback: string;
  risk: LayerRisk;
  check: string;
}

export interface CapabilityRow {
  capability: string;
  route: string;
  vercel: string;
  tencent: string;
  check: string;
  status: LayerStatus;
}

export const capabilityRows: CapabilityRow[] = [
  {
    capability: "SSR / RSC",
    route: "/lab",
    vercel: "Vercel Functions",
    tencent: "EdgeOne Pages / CloudBase Run",
    check: "首字节、动态渲染、运行时 Node API",
    status: "ready",
  },
  {
    capability: "Serverless API",
    route: "/api/health",
    vercel: "Node.js Function",
    tencent: "EdgeOne Node Functions / SCF",
    check: "冷启动、超时、并发、请求体上限",
    status: "ready",
  },
  {
    capability: "Legacy Edge",
    route: "/api/edge",
    vercel: "Edge Runtime（已弃用）",
    tencent: "EdgeOne Edge Functions（存量兼容）",
    check: "Next.js 16.3+ 已标记弃用，当前仍可运行但不应新用",
    status: "risk",
  },
  {
    capability: "请求拦截",
    route: "/lab",
    vercel: "Next.js Proxy",
    tencent: "Edge Functions / 网关规则",
    check: "是否依赖 Node API 或 Vercel 请求头",
    status: "verify",
  },
  {
    capability: "ISR",
    route: "/lab/isr",
    vercel: "Vercel ISR Cache",
    tencent: "EdgeOne Pages ISR",
    check: "缓存命中、失效传播、多实例一致性",
    status: "verify",
  },
  {
    capability: "Cron",
    route: "/api/cron/heartbeat",
    vercel: "Cron Jobs（Legacy）/ Schedules",
    tencent: "SCF 定时触发器 / TKE CronJob",
    check: "时区、重试、幂等、鉴权、Schedules 迁移",
    status: "risk",
  },
];

export const migrationPhases = [
  {
    number: "01",
    title: "观测 Vercel 真实依赖",
    duration: "1–2 天",
    description:
      "不是只看代码仓库。把每个 Deployment 的构建产物、运行时、环境变量、域名、Cron 和日志先盘点出来。",
    outputs: [
      "项目与团队、Production / Preview 分支清单",
      "Functions 运行时、内存、最大执行时长",
      "环境变量与第三方 Marketplace 依赖",
    ],
  },
  {
    number: "02",
    title: "在腾讯云做等价部署",
    duration: "3–7 天",
    description:
      "先并行部署，不切主域名。把静态、SSR、API、缓存、定时任务、对象存储逐项对齐并压测。",
    outputs: [
      "EdgeOne Pages 或容器化 TKE / CloudBase 路径二选一",
      "数据库、Redis、COS、DNS 连接串完成联调",
      "同一套验收脚本在双端产出可比较结果",
    ],
  },
  {
    number: "03",
    title: "灰度切流与回滚",
    duration: "1–3 天",
    description:
      "DNS TTL 提前降短，按地域或权重灰度。Vercel 先保持可回退，确认缓存与数据同步后再下线。",
    outputs: [
      "1% → 10% → 50% → 100% 的放量观测记录",
      "回滚触发阈值、负责人、DNS 恢复步骤",
      "切换后 7 天 Vercel 资源保留窗口",
    ],
  },
];

export const riskLayers = [
  { label: "最大的隐性依赖", value: "ISR / 缓存语义" },
  { label: "最容易被低估", value: "Cron 与请求头" },
  { label: "最需要提前演练", value: "DNS 回滚" },
  { label: "最不能迁移假设", value: "第三方 Marketplace" },
];

export const migrationLayers: MigrationLayer[] = [
  {
    id: "network",
    category: "网络与 CDN",
    vercel: "Vercel Edge Network / 全球 PoP",
    tencent: "EdgeOne / CDN + DNSPod",
    fallback: "若以中国大陆用户为主，需要 ICP 备案与境内加速域名",
    risk: "medium",
    check: "按省份/国家验证解析、TLS、缓存键与回源",
  },
  {
    id: "static",
    category: "静态资源",
    vercel: "Build Output + Immutable CDN",
    tencent: "EdgeOne Pages / COS + CDN",
    fallback: "TKE 内 Nginx 仅作过渡，不建议长期直接对外",
    risk: "low",
    check: "构建产物路径、缓存头、压缩、404/301 行为",
  },
  {
    id: "ssr",
    category: "SSR / RSC",
    vercel: "Vercel Functions (Node.js)",
    tencent: "EdgeOne Pages Node SSR / CloudBase Run / TKE",
    fallback: "Next.js standalone 容器是跨平台保底方案",
    risk: "medium",
    check: "Node 版本、原生依赖、流式响应、最大执行时长",
  },
  {
    id: "api",
    category: "API 计算",
    vercel: "Vercel Functions",
    tencent: "EdgeOne Node Functions / SCF / API Gateway",
    fallback: "长连接、WebSocket 或重任务改用容器与消息队列",
    risk: "medium",
    check: "冷启动 P95、并发、超时、请求/响应体上限",
  },
  {
    id: "edge",
    category: "边缘逻辑",
    vercel: "Edge Functions / Proxy",
    tencent: "EdgeOne Edge Functions / 网关规则",
    fallback: "Node.js Proxy 不能直接假设为边缘执行",
    risk: "high",
    check: "Web API 兼容、Vercel 专有请求头、执行时间限制",
  },
  {
    id: "isr",
    category: "增量静态再生",
    vercel: "Vercel ISR Cache",
    tencent: "EdgeOne Pages ISR / 自建共享缓存",
    fallback: "TKE 多副本需外部共享缓存，不能依赖容器本地盘",
    risk: "high",
    check: "stale-while-revalidate、按标签失效、多实例一致性",
  },
  {
    id: "cron",
    category: "定时任务",
    vercel: "Vercel Cron",
    tencent: "SCF 定时触发器 / TKE CronJob",
    fallback: "务必做分布式锁与幂等，避免多副本重复执行",
    risk: "high",
    check: "时区、重试、超时、鉴权头、失败告警",
  },
  {
    id: "object",
    category: "对象存储",
    vercel: "Vercel Blob / Marketplace S3",
    tencent: "COS",
    fallback: "保留 S3 兼容适配层，迁移只替换 endpoint 与凭证",
    risk: "medium",
    check: "直传签名、跨域、生命周期、回源与 CDN 鉴权",
  },
  {
    id: "database",
    category: "关系型数据库",
    vercel: "Marketplace: Neon / Supabase / Turso",
    tencent: "TencentDB for PostgreSQL / MySQL",
    fallback: "先迁移 schema 与读流量，再做双写或 CDC 切换",
    risk: "high",
    check: "连接池、SSL、时区、字符集、慢查询、备份恢复",
  },
  {
    id: "redis",
    category: "KV / 缓存",
    vercel: "Marketplace Redis / Upstash",
    tencent: "TencentDB for Redis",
    fallback: "确认命令兼容性，避免依赖 Vercel 本地内存状态",
    risk: "high",
    check: "序列化、过期策略、热点 key、跨可用区延迟",
  },
  {
    id: "image",
    category: "图片优化",
    vercel: "Next.js Image Optimization",
    tencent: "EdgeOne 图片处理 / COS 图片处理",
    fallback: "自建 sharp 服务会增加 CPU 与缓存复杂度",
    risk: "medium",
    check: "尺寸白名单、格式协商、缓存命中与回源成本",
  },
  {
    id: "secrets",
    category: "配置与密钥",
    vercel: "Environment Variables",
    tencent: "SSM 密钥管理 / 云函数环境变量",
    fallback: "不要把 Vercel 的 Preview / Production 作用域语义照搬",
    risk: "medium",
    check: "环境隔离、轮换、最小权限、审计日志",
  },
  {
    id: "observability",
    category: "日志与监控",
    vercel: "Deployment Logs / Observability",
    tencent: "CLS 日志服务 + APM + 云监控",
    fallback: "先统一 trace id，切换时才能比较双端错误率",
    risk: "medium",
    check: "请求日志、函数耗时、缓存命中、告警到达率",
  },
  {
    id: "cicd",
    category: "CI/CD 与回滚",
    vercel: "Git Integration / Preview Deployments",
    tencent: "CODING DevOps / EdgeOne Pages Git / TKE",
    fallback: "预发环境不能省；Preview URL 语义需用独立环境替代",
    risk: "medium",
    check: "构建可复现、制品版本、审批、一键回滚",
  },
];

export const decisionPaths = [
  {
    title: "EdgeOne Pages",
    bestFor: "标准 Next.js 应用、希望最小改造、尽量保留 SSR / ISR / Edge 能力。",
    bullets: [
      "优先验证 Next.js 版本与 App Router 兼容性",
      "确认 Node Functions 与 Edge Functions 的配额",
      "中国大陆域名需要 ICP 备案",
    ],
  },
  {
    title: "CloudBase 云开发",
    bestFor: "需要数据库、存储、登录、云函数一体化，或微信生态集成。",
    bullets: [
      "Next.js 可用 CloudBase Run 容器化运行",
      "认证与数据模型通常需要重写适配层",
      "适合中小团队降低基础设施运维成本",
    ],
  },
  {
    title: "TKE + 云产品",
    bestFor: "复杂后端、长连接、严格网络隔离、已有腾讯云基础设施。",
    bullets: [
      "控制力最高，但运维与成本也最高",
      "需自行实现 ISR 共享缓存与定时任务",
      "通过 CLB + Ingress + HPA 做流量与弹性",
    ],
  },
];

export const cutoverChecks = [
  {
    step: "G1",
    title: "功能门禁",
    description:
      "同一套 Playwright / k6 用例在 Vercel 与腾讯云双端执行，关键页面、API、上传下载、登录态全部通过。",
    evidence: "双端测试报告、差异清单、已知问题签字确认",
  },
  {
    step: "G2",
    title: "性能与稳定性门禁",
    description:
      "对比 P50/P95/P99、冷启动、ISR 命中率、错误率；至少完成一次峰值压测和依赖故障演练。",
    evidence: "压测曲线、缓存命中、告警与降级演练记录",
  },
  {
    step: "G3",
    title: "回滚门禁",
    description:
      "DNS TTL 已提前降至 60 秒，Vercel 保持可部署；数据库变更可逆，切流负责人和回滚命令可一键执行。",
    evidence: "回滚演练记录、DNS 快照、数据恢复点",
  },
];
