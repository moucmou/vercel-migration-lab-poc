import { NextResponse } from "next/server";
import { enqueue } from "@/lib/queue";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET_NOT_CONFIGURED" },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  const day = new Date().toISOString().slice(0, 10);
  const job = enqueue("digest-email", "acme", `cron-digest:${day}`);

  return NextResponse.json({
    ok: true,
    job,
    ranAt: new Date().toISOString(),
    schedule: "daily digest",
  });
}
