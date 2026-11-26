# Vercel → 腾讯云迁移演练台

一套可实际部署、可观测、可容器化的 Next.js 16 演示应用，用于回答三个问题：

1. Vercel 上的业务到底由哪些运行时和托管能力组成？
2. 哪些能力可以平移到腾讯云，哪些必须改造或放弃？
3. 切流前如何证明双端等价，切流后如何回滚？

## 演练入口

| 路径 | 能力 | 迁移关注点 |
| --- | --- | --- |
| `/` | 迁移总览 | 方法、风险与能力矩阵 |
| `/lab` | SSR + 请求上下文 | Vercel 请求头、地域、环境变量、Proxy |
| `/api/health` | Node.js Function | 冷启动、地域、部署元数据 |
| `/api/echo` | JSON 请求体 | 大小限制、响应头、无状态执行 |
| `/api/edge` | Legacy Edge 探针 | Next.js 16.3+ 已标记弃用，当前仍可运行 |
| `/api/cron/heartbeat` | Vercel Cron | Bearer 鉴权、UTC 时区、幂等 |
| `/lab/isr` | ISR | 30 秒再生、缓存命中、多实例一致性 |
| `/migration` | 14 层能力映射 | 目标选型与切流门禁 |

## 本地运行

```bash
npm install
LAB_ENV_LABEL=local NEXT_PUBLIC_LAB_ENV=local CRON_SECRET=local-secret npm run dev
```

打开 `http://localhost:3000`。

生产构建与本地验收：

```bash
npm run lint
npm run build
LAB_ENV_LABEL=local-verification \
NEXT_PUBLIC_LAB_ENV=local-verification \
CRON_SECRET=verify-secret \
npm run start
```

验收命令：

```bash
curl -i http://localhost:3000/api/health
curl -i -X POST http://localhost:3000/api/echo \
  -H 'content-type: application/json' \
  -d '{"source":"curl","ok":true}'
curl -i http://localhost:3000/api/cron/heartbeat
curl -i http://localhost:3000/api/cron/heartbeat \
  -H 'authorization: Bearer verify-secret'
curl -i http://localhost:3000/lab
```

Cron 未带密钥时应返回 `401`；带正确密钥时应返回 `200`。

## 容器化目标端

这条路径对应 TKE / CloudBase Run / 任意支持容器的腾讯云运行环境：

```bash
docker build -t migration-lab:local .
docker run --rm -p 3211:3000 \
  -e LAB_ENV_LABEL=docker-target \
  -e NEXT_PUBLIC_LAB_ENV=docker-target \
  -e CRON_SECRET=verify-secret \
  migration-lab:local
```

打开 `http://localhost:3211`，再运行一次相同探针。容器可移植不代表迁移完成：
数据库、对象存储、缓存、定时任务与域名仍需单独替换。

## 本地切流模拟

没有腾讯云账号时，可以先用 Nginx 模拟 EdgeOne / CLB，在真实 Vercel 与本地容器之间做灰度：

```bash
cd target-sim
CANARY_PERCENT=10 ./run.sh
TOTAL=60 ./smoke-cutover.sh
```

详见 [target-sim/README.md](./target-sim/README.md)。

## 基线探针

`scripts/verify.mjs` 把 P0 的框架层探针固化成可 diff 的 JSON：

```bash
CRON_SECRET="$(cat /tmp/migration-lab-cron-secret)" \
  node scripts/verify.mjs > baseline-source.json

PROFILE=target \
BASE_URL=http://localhost:8080 \
CRON_SECRET=target-sim-cron-secret \
  node scripts/verify.mjs > baseline-target-local.json
```

源侧结果：10 PASS / 0 DIFF / 0 UNKNOWN / 3 SKIP。
本地目标端结果：9 PASS / 1 DIFF / 0 UNKNOWN / 3 SKIP；其中 DIFF 是本地 HTTP，
生产必须是 HTTPS，不构成产品缺口。详见 [scripts/README.md](./scripts/README.md)。

## Vercel 部署

```bash
npx vercel@latest login
npx vercel@latest deploy --prod
```

首次部署后，在 Vercel Project Settings 中设置：

- `LAB_ENV_LABEL=vercel-prod`
- `NEXT_PUBLIC_LAB_ENV=vercel-prod`
- `CRON_SECRET=<随机长字符串>`

环境变量变更后需要重新部署才会生效。

## 迁移文档

- [Vercel 运行模型：先看懂再迁移](./docs/01-vercel-mental-model.md)
- [腾讯云迁移 Runbook](./docs/02-tencent-migration-runbook.md)
- [演练台操作手册](./docs/03-lab-walkthrough.md)
- [Vercel 线上基线](./docs/04-vercel-baseline.md)
- [灰度切流与回滚模拟](./docs/05-cutover-simulation.md)
- [迁移评估清单（资源层 × 框架层）](./docs/06-migration-assessment-checklist.md)

## 当前验收状态

- `npm run lint`：通过
- `npm run build`：通过
- 本地 SSR / API / Proxy / ISR / Cron：通过
- 容器化目标端：镜像构建通过；Node 22.23.5 下 SSR / API / Proxy / ISR / Cron 通过
- Vercel 生产部署：已完成，生产域名 `https://migration-lab-one.vercel.app/`
- Vercel 线上基线：Node Function 落在 `iad1`，Legacy Edge 落在 `sin1`；详见 `docs/04-vercel-baseline.md`
- Vercel 环境变量与 Cron：已验证；未授权 401，Bearer 授权 200；Cron Jobs 已被平台标记为 Legacy
- ISR：已验证 `STALE → 后台再生 → HIT`
- 灰度切流：10% 下 100 次请求 89/11、0 失败；100% 全切 10/10 命中目标端；0% 回滚 5/5 回到 Vercel
- 基线探针：`baseline-source.json` 10 PASS / 0 DIFF / 0 UNKNOWN / 3 SKIP
- 本地目标端基线：`baseline-target-local.json` 9 PASS / 1 DIFF（HTTP）/ 0 UNKNOWN / 3 SKIP
- 切流稳定性：连续 6 次重建全部成功；10% 复测 20 次请求 17/3、0 失败

> 本应用不使用持久化数据，不包含真实业务凭证，适合作为迁移方法验证样板。
