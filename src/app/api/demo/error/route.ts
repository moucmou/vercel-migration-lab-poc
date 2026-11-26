import { NextResponse } from "next/server";
import { logError } from "@/lib/logger";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const { tenant, requestId } = await getTenantContext();
  logError("demo.intentional_error", new Error("intentional demo 500"), {
    tenant,
    requestId,
  });
  return NextResponse.json(
    {
      ok: false,
      error: "INTENTIONAL_500",
      requestId,
      hint: "Use this endpoint to verify error tracking, alerts and log drains.",
    },
    { status: 500 },
  );
}
