export type Tenant = {
  slug: string;
  name: string;
  plan: "free" | "pro";
  region: string;
  accent: string;
  seats: number;
  monthlyRequests: number;
};

export type Project = {
  id: string;
  tenant: string;
  name: string;
  description: string;
  status: "active" | "paused" | "archived";
  owner: string;
  createdAt: string;
  updatedAt: string;
  requests: number;
  errorRate: number;
  p95: number;
  tags: string[];
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  author: string;
  tags: string[];
  readMinutes: number;
};

export type Activity = {
  id: string;
  tenant: string;
  type: "deploy" | "flag" | "queue" | "incident" | "billing" | "member";
  message: string;
  at: string;
  actor: string;
};

export type Metrics = {
  projectCount: number;
  activeCount: number;
  totalRequests: number;
  avgErrorRate: number;
  p95: number;
  sparkline: number[];
};

export const DEMO_USER = {
  email: "demo@acme.test",
  password: "demo1234",
  name: "Demo Operator",
};

export const tenants: Tenant[] = [
  {
    slug: "acme",
    name: "Acme Cloud",
    plan: "pro",
    region: "ap-shanghai",
    accent: "#c6f36b",
    seats: 42,
    monthlyRequests: 8_400_000,
  },
  {
    slug: "globex",
    name: "Globex Labs",
    plan: "free",
    region: "ap-singapore",
    accent: "#7de8dd",
    seats: 12,
    monthlyRequests: 1_200_000,
  },
  {
    slug: "initech",
    name: "Initech",
    plan: "pro",
    region: "ap-guangzhou",
    accent: "#ffbd78",
    seats: 27,
    monthlyRequests: 3_100_000,
  },
];

const projectSeed: Project[] = [
  {
    id: "prj_atlas_api",
    tenant: "acme",
    name: "Atlas API",
    description: "多租户核心 API，承载项目、成员与计费读写。",
    status: "active",
    owner: "demo@acme.test",
    createdAt: "2026-09-02T09:20:00.000Z",
    updatedAt: "2026-11-26T02:18:00.000Z",
    requests: 2_840_000,
    errorRate: 0.12,
    p95: 184,
    tags: ["api", "multi-tenant", "billing"],
  },
  {
    id: "prj_beacon_store",
    tenant: "acme",
    name: "Beacon Storefront",
    description: "面向海外客户的商品站点，使用 ISR 与图片优化。",
    status: "active",
    owner: "store@acme.test",
    createdAt: "2026-08-14T03:10:00.000Z",
    updatedAt: "2026-11-25T16:42:00.000Z",
    requests: 1_960_000,
    errorRate: 0.21,
    p95: 236,
    tags: ["storefront", "isr", "image"],
  },
  {
    id: "prj_comet_docs",
    tenant: "acme",
    name: "Comet Docs",
    description: "产品文档与 changelog，静态生成 + 按需失效。",
    status: "active",
    owner: "docs@acme.test",
    createdAt: "2026-07-21T11:05:00.000Z",
    updatedAt: "2026-11-24T07:30:00.000Z",
    requests: 840_000,
    errorRate: 0.03,
    p95: 96,
    tags: ["docs", "ssg", "isr"],
  },
  {
    id: "prj_helios_billing",
    tenant: "acme",
    name: "Helios Billing",
    description: "订阅、发票与 webhook 回调，要求幂等与重放保护。",
    status: "paused",
    owner: "finance@acme.test",
    createdAt: "2026-06-03T08:00:00.000Z",
    updatedAt: "2026-11-20T12:12:00.000Z",
    requests: 310_000,
    errorRate: 0.44,
    p95: 412,
    tags: ["billing", "webhook", "queue"],
  },
  {
    id: "prj_ion_dashboard",
    tenant: "globex",
    name: "Ion Dashboard",
    description: "运营分析面板，SSR + 流式渲染 + 多角色权限。",
    status: "active",
    owner: "ops@globex.test",
    createdAt: "2026-10-11T05:25:00.000Z",
    updatedAt: "2026-11-26T01:05:00.000Z",
    requests: 420_000,
    errorRate: 0.18,
    p95: 268,
    tags: ["dashboard", "ssr", "rbac"],
  },
  {
    id: "prj_juno_search",
    tenant: "globex",
    name: "Juno Search",
    description: "站内搜索与筛选，依赖请求级缓存和边缘函数。",
    status: "active",
    owner: "search@globex.test",
    createdAt: "2026-09-19T13:40:00.000Z",
    updatedAt: "2026-11-23T18:22:00.000Z",
    requests: 690_000,
    errorRate: 0.09,
    p95: 142,
    tags: ["search", "edge", "cache"],
  },
  {
    id: "prj_krypton_media",
    tenant: "initech",
    name: "Krypton Media",
    description: "图片与视频素材库，上传、转码、签名读。",
    status: "active",
    owner: "media@initech.test",
    createdAt: "2026-05-27T02:15:00.000Z",
    updatedAt: "2026-11-26T00:40:00.000Z",
    requests: 1_240_000,
    errorRate: 0.31,
    p95: 320,
    tags: ["media", "blob", "upload"],
  },
  {
    id: "prj_lumen_crm",
    tenant: "initech",
    name: "Lumen CRM",
    description: "客户与商机管理，表单动作 + 数据库事务。",
    status: "active",
    owner: "sales@initech.test",
    createdAt: "2026-04-08T09:55:00.000Z",
    updatedAt: "2026-11-22T14:05:00.000Z",
    requests: 580_000,
    errorRate: 0.14,
    p95: 210,
    tags: ["crm", "server-action", "database"],
  },
  {
    id: "prj_meteor_edge",
    tenant: "initech",
    name: "Meteor Edge",
    description: "地理位置分流与 A/B 实验，跑在边缘运行时。",
    status: "archived",
    owner: "growth@initech.test",
    createdAt: "2026-03-12T06:30:00.000Z",
    updatedAt: "2026-10-30T10:00:00.000Z",
    requests: 260_000,
    errorRate: 0.07,
    p95: 88,
    tags: ["edge", "experiment", "geo"],
  },
];

const posts: Post[] = [
  {
    slug: "why-we-moved-off-vercel",
    title: "我们为什么开始评估 Vercel 的替代方案",
    excerpt: "不是因为 Vercel 不好，而是业务进入中国大陆后，入口、计算区域和合规边界需要重新画。",
    body: [
      "Vercel 的产品体验非常完整：一次 git push 就能得到预览、生产、缓存、域名和日志。迁移的难点不在于“有没有对应产品”，而在于这些能力被拆散后，谁来保证一致性。",
      "我们先把业务拆成资源层和框架层。资源层包括 Blob、KV、队列、数据库、沙箱；框架层包括 SSR、ISR、Proxy、Server Actions。两层必须分别验证。",
      "这篇记录不是结论，而是一份可复现的评估方法：同一份代码、同一组探针、两侧部署、结构化 diff。",
    ],
    publishedAt: "2026-11-18T08:00:00.000Z",
    author: "迁移小组",
    tags: ["迁移", "方法论"],
    readMinutes: 6,
  },
  {
    slug: "isr-is-not-a-cdn",
    title: "ISR 不是 CDN：一次缓存语义的实测",
    excerpt: "STALE、后台再生、HIT 三个阶段，决定了迁移后页面会不会“永远不更新”。",
    body: [
      "很多人把 ISR 当成“CDN 缓存 HTML”。实测之后会发现，过期请求先拿到旧快照，同时触发后台再生；再生完成后，后续请求才命中新快照。",
      "迁移到多副本容器后，如果每个副本各自维护 ISR 文件缓存，用户会在不同副本之间看到不同版本。必须换成共享缓存，或者使用目标平台的原生 ISR。",
      "验收时不能只看 HTTP 200，要同时记录缓存状态、age 和页面内的渲染时间。",
    ],
    publishedAt: "2026-11-12T03:30:00.000Z",
    author: "Runtime Lab",
    tags: ["ISR", "缓存"],
    readMinutes: 5,
  },
  {
    slug: "durable-execution-gap",
    title: "durable execution：迁移里最容易被低估的一层",
    excerpt: "队列不是工作流。暂停、恢复、跨部署重放，是另一套语义。",
    body: [
      "Vercel Workflows 把“代码可以暂停数分钟到数月”做成平台能力。消息队列只保证消息被投递，不保证执行状态可以恢复。",
      "如果业务只是异步发信、生成缩略图，TDMQ + worker 足够。如果是订单编排、长流程审批、AI 多步任务，就必须单独评估 durable execution。",
      "评估时先问：任务失败后从哪里恢复？部署切换后旧任务还能不能继续？重复执行会不会产生副作用？",
    ],
    publishedAt: "2026-11-06T10:10:00.000Z",
    author: "Platform Team",
    tags: ["Workflows", "队列"],
    readMinutes: 7,
  },
  {
    slug: "multi-tenant-routing",
    title: "多租户路由：Host、Cookie 与边缘判断",
    excerpt: "同一套代码服务多个租户，入口层要解决租户识别、会话和灰度。",
    body: [
      "多租户系统通常有三类识别方式：子域名、路径前缀、登录态。它们可以组合，但优先级必须固定，否则缓存键和权限判断会混乱。",
      "本次 mock 用 Host 优先、query 兜底、cookie 记忆的顺序，并在 Proxy 中把租户写入请求头，后续页面和 API 都只读这个头。",
      "迁移时要把这套规则复制到 EdgeOne 的边缘规则或 Ingress，不能假设目标平台自动理解你的租户模型。",
    ],
    publishedAt: "2026-10-29T07:45:00.000Z",
    author: "Growth Infra",
    tags: ["多租户", "Proxy"],
    readMinutes: 4,
  },
  {
    slug: "webhook-idempotency",
    title: "Webhook 迁移检查表：签名、重放、幂等",
    excerpt: "支付回调是迁移事故高发区，不能只验证“能收到”。",
    body: [
      "Webhook 的第一层是签名校验，第二层是重放保护，第三层是业务幂等。三层都过，才能说回调链路可迁。",
      "本次 mock 用 HMAC-SHA256 校验原始请求体，并把事件 ID 作为幂等键写入队列。目标端如果拿不到原始 body，签名校验会直接失败。",
      "迁移验收要覆盖：正确签名、错误签名、重复事件、乱序事件、超时重试。",
    ],
    publishedAt: "2026-10-21T12:00:00.000Z",
    author: "Payments",
    tags: ["Webhook", "安全"],
    readMinutes: 5,
  },
  {
    slug: "shanghai-region-notes",
    title: "上海地域 POC：备案、域名与网络路径",
    excerpt: "没有域名和备案时，先把应用跑通，再补入口层。",
    body: [
      "大陆节点的第一道门槛不是技术，而是备案。没有备案域名时，可以先用平台默认域名验证运行时，但正式切流前必须补齐。",
      "第二道门槛是网络路径：入口在哪个地域、计算在哪个地域、数据库在哪个 VPC，三者决定 TTFB 和排障方式。",
      "本次 POC 先验证 Makers 的构建、函数、ISR 和缓存，再决定是否把数据库放进同一地域的 VPC。",
    ],
    publishedAt: "2026-10-15T04:20:00.000Z",
    author: "Migration Lab",
    tags: ["上海", "备案"],
    readMinutes: 4,
  },
];

const activities: Activity[] = [
  {
    id: "act_001",
    tenant: "acme",
    type: "deploy",
    message: "Atlas API 发布 v2.14.0，生产流量切换完成。",
    at: "2026-11-26T02:18:00.000Z",
    actor: "ci-bot",
  },
  {
    id: "act_002",
    tenant: "acme",
    type: "queue",
    message: "项目摘要任务完成，耗时 1.8s。",
    at: "2026-11-26T01:55:00.000Z",
    actor: "worker-01",
  },
  {
    id: "act_003",
    tenant: "acme",
    type: "flag",
    message: "checkout-v2 对 10% 租户开启。",
    at: "2026-11-25T18:10:00.000Z",
    actor: "demo@acme.test",
  },
  {
    id: "act_004",
    tenant: "acme",
    type: "incident",
    message: "Beacon Storefront 图片优化超时，已回滚配置。",
    at: "2026-11-25T16:42:00.000Z",
    actor: "on-call",
  },
  {
    id: "act_005",
    tenant: "acme",
    type: "billing",
    message: "本月函数调用量达到套餐额度的 72%。",
    at: "2026-11-24T09:00:00.000Z",
    actor: "billing",
  },
  {
    id: "act_006",
    tenant: "globex",
    type: "deploy",
    message: "Ion Dashboard 预览环境部署成功。",
    at: "2026-11-26T01:05:00.000Z",
    actor: "ci-bot",
  },
  {
    id: "act_007",
    tenant: "globex",
    type: "member",
    message: "新增 3 名只读成员。",
    at: "2026-11-25T11:20:00.000Z",
    actor: "admin@globex.test",
  },
  {
    id: "act_008",
    tenant: "globex",
    type: "flag",
    message: "new-dashboard 对内部成员开启。",
    at: "2026-11-23T14:30:00.000Z",
    actor: "ops@globex.test",
  },
  {
    id: "act_009",
    tenant: "initech",
    type: "incident",
    message: "Krypton Media 上传接口触发 4MB 限额。",
    at: "2026-11-26T00:40:00.000Z",
    actor: "media@initech.test",
  },
  {
    id: "act_010",
    tenant: "initech",
    type: "queue",
    message: "媒体转码任务重试 1 次后成功。",
    at: "2026-11-25T22:15:00.000Z",
    actor: "worker-02",
  },
  {
    id: "act_011",
    tenant: "initech",
    type: "deploy",
    message: "Lumen CRM 发布 v4.2.1。",
    at: "2026-11-22T14:05:00.000Z",
    actor: "ci-bot",
  },
  {
    id: "act_012",
    tenant: "initech",
    type: "billing",
    message: "对象存储出站流量环比增长 18%。",
    at: "2026-11-21T08:00:00.000Z",
    actor: "billing",
  },
];

const projects = [...projectSeed];
const runtimeActivities = [...activities];
let sequence = 100;

function nextId(prefix: string) {
  sequence += 1;
  return `${prefix}_${sequence}`;
}

export function listTenants() {
  return tenants;
}

export function getTenant(slug: string) {
  return tenants.find((tenant) => tenant.slug === slug) ?? tenants[0];
}

export function isTenantSlug(value: string | null | undefined): value is string {
  return Boolean(value && tenants.some((tenant) => tenant.slug === value));
}

export function listProjects(tenant?: string) {
  const rows = tenant ? projects.filter((project) => project.tenant === tenant) : projects;
  return [...rows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function getProject(id: string) {
  return projects.find((project) => project.id === id) ?? null;
}

export function createProject(input: {
  tenant: string;
  name: string;
  description?: string;
  owner?: string;
  tags?: string[];
}) {
  const now = new Date().toISOString();
  const project: Project = {
    id: nextId("prj"),
    tenant: input.tenant,
    name: input.name,
    description: input.description ?? "由 Demo 控制台创建的项目。",
    status: "active",
    owner: input.owner ?? DEMO_USER.email,
    createdAt: now,
    updatedAt: now,
    requests: 0,
    errorRate: 0,
    p95: 120,
    tags: input.tags ?? ["new"],
  };
  projects.unshift(project);
  recordActivity({
    tenant: input.tenant,
    type: "deploy",
    message: `创建项目 ${project.name}。`,
    actor: project.owner,
  });
  return project;
}

export function updateProject(
  id: string,
  patch: Partial<Pick<Project, "name" | "description" | "status" | "tags">>,
) {
  const project = getProject(id);
  if (!project) return null;
  Object.assign(project, patch, { updatedAt: new Date().toISOString() });
  recordActivity({
    tenant: project.tenant,
    type: "deploy",
    message: `更新项目 ${project.name}（${patch.status ?? "metadata"}）。`,
    actor: DEMO_USER.email,
  });
  return project;
}

export function deleteProject(id: string) {
  const index = projects.findIndex((project) => project.id === id);
  if (index < 0) return false;
  const [removed] = projects.splice(index, 1);
  recordActivity({
    tenant: removed.tenant,
    type: "deploy",
    message: `删除项目 ${removed.name}。`,
    actor: DEMO_USER.email,
  });
  return true;
}

export function listPosts() {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug) ?? null;
}

export function listActivity(tenant?: string, limit = 8) {
  const rows = tenant
    ? runtimeActivities.filter((activity) => activity.tenant === tenant)
    : runtimeActivities;
  return rows.slice(0, limit);
}

export function recordActivity(input: {
  tenant: string;
  type: Activity["type"];
  message: string;
  actor: string;
}) {
  runtimeActivities.unshift({
    id: nextId("act"),
    tenant: input.tenant,
    type: input.type,
    message: input.message,
    at: new Date().toISOString(),
    actor: input.actor,
  });
  return runtimeActivities[0];
}

export function getMetrics(tenant: string): Metrics {
  const rows = listProjects(tenant);
  const totalRequests = rows.reduce((sum, project) => sum + project.requests, 0);
  const avgErrorRate =
    rows.length === 0
      ? 0
      : rows.reduce((sum, project) => sum + project.errorRate, 0) / rows.length;
  const p95 =
    rows.length === 0
      ? 0
      : Math.round(rows.reduce((sum, project) => sum + project.p95, 0) / rows.length);
  const seed = tenant === "globex" ? 0.45 : tenant === "initech" ? 0.68 : 1;
  const sparkline = [42, 51, 48, 63, 58, 72, 69, 81, 76, 88, 84, 96].map(
    (value, index) => Math.round(value * seed + (index % 3) * 2),
  );
  return {
    projectCount: rows.length,
    activeCount: rows.filter((project) => project.status === "active").length,
    totalRequests,
    avgErrorRate: Number(avgErrorRate.toFixed(2)),
    p95,
    sparkline,
  };
}
