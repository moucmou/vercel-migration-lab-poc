import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const url = new URL(request.url);
  const requested = Number(url.searchParams.get("ms") ?? "2500");
  const waitedMs = Math.min(
    Math.max(Number.isFinite(requested) ? requested : 2500, 0),
    10000,
  );

  await new Promise((resolve) => setTimeout(resolve, waitedMs));
  logEvent("demo.slow.completed", { tenant, requestId, waitedMs });

  return NextResponse.json({ ok: true, waitedMs, requestId });
}
