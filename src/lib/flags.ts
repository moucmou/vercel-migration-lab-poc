import { getTenant } from "@/lib/mock-data";

export type FlagKey = "newDashboard" | "aiSummary" | "checkoutV2";

const ENV_KEYS: Record<FlagKey, string> = {
  newDashboard: "FLAG_NEW_DASHBOARD",
  aiSummary: "FLAG_AI_SUMMARY",
  checkoutV2: "FLAG_CHECKOUT_V2",
};

function envFlag(name: string, fallback: boolean) {
  const value = process.env[name];
  if (!value) return fallback;
  return ["1", "true", "on", "yes"].includes(value.toLowerCase());
}

export function getFlags(
  tenantSlug: string,
  variant: string,
): Record<FlagKey, boolean> {
  const tenant = getTenant(tenantSlug);
  return {
    newDashboard: envFlag(ENV_KEYS.newDashboard, tenant.plan === "pro"),
    aiSummary: envFlag(ENV_KEYS.aiSummary, tenant.plan === "pro"),
    checkoutV2: envFlag(
      ENV_KEYS.checkoutV2,
      variant === "b" && tenant.plan === "pro",
    ),
  };
}

export const FLAG_META: Array<{
  key: FlagKey;
  label: string;
  description: string;
}> = [
  {
    key: "newDashboard",
    label: "new-dashboard",
    description: "新版运营面板，按租户套餐与定向规则开启。",
  },
  {
    key: "aiSummary",
    label: "ai-summary",
    description: "项目 AI 摘要，依赖异步任务与模型网关。",
  },
  {
    key: "checkoutV2",
    label: "checkout-v2",
    description: "新版结算流程，按 A/B 变体分流。",
  },
];
