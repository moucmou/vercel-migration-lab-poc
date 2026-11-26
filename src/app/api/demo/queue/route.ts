import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { enqueue, listJobs, processNext, queueStats } from "@/lib/queue";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const { tenant, requestId } = await getTenantContext();
  return NextResponse.json({
    tenant,
    stats: queueStats(),
    jobs: listJobs().filter((job) => job.tenant === tenant),
    requestId,
  });
}

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const body = (await request.json().catch(() => null)) as
    | { action?: "enqueue" | "process"; type?: string; idempotencyKey?: string }
    | null;
  const action = body?.action ?? "process";

  if (action === "enqueue") {
    const job = enqueue(
      body?.type ?? "digest-email",
      tenant,
      body?.idempotencyKey ?? null,
    );
    logEvent("demo.queue.enqueue", { tenant, requestId, jobId: job.id });
    return NextResponse.json({ ok: true, action, job, requestId });
  }

  const job = processNext();
  logEvent("demo.queue.process", { tenant, requestId, jobId: job?.id ?? null });
  return NextResponse.json({ ok: true, action, job, requestId });
}
