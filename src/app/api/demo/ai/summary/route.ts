import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function mockSummary(input: string) {
  const normalized = input.replace(/\s+/g, " ").trim();
  const first = normalized.slice(0, 80);
  const words = normalized.split(" ").filter(Boolean).length;
  return [
    `摘要：${first}${normalized.length > 80 ? "…" : ""}`,
    `输入约 ${words} 个词；建议先迁移读路径，再迁移写路径。`,
    "风险：目标端若无 durable execution，多步摘要任务需要重写编排。",
  ].join("\n");
}

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const body = (await request.json().catch(() => null)) as
    | { text?: string }
    | null;

  if (!body?.text) {
    return NextResponse.json(
      { ok: false, error: "TEXT_REQUIRED", requestId },
      { status: 400 },
    );
  }

  const startedAt = Date.now();
  await new Promise((resolve) => setTimeout(resolve, 350));
  const summary = mockSummary(body.text);
  const latencyMs = Date.now() - startedAt;

  logEvent("demo.ai.summary", {
    tenant,
    requestId,
    inputChars: body.text.length,
    latencyMs,
  });

  return NextResponse.json({
    ok: true,
    model: "mock-ai-v1",
    summary,
    latencyMs,
    requestId,
  });
}
