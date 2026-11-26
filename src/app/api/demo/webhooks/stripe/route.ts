import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { enqueue } from "@/lib/queue";
import { getTenantContext } from "@/lib/tenant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();

async function hmacHex(secret: string, payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(payload),
  );
  return [...new Uint8Array(signature)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const rawBody = await request.text();
  const provided = request.headers.get("x-lab-signature") ?? "";
  const secret = process.env.WEBHOOK_SECRET ?? "whsec_demo";
  const expectedHex = await hmacHex(secret, rawBody);
  const expected = `sha256=${expectedHex}`;
  const normalized = provided.startsWith("sha256=")
    ? provided
    : `sha256=${provided}`;

  if (normalized !== expected) {
    logEvent("demo.webhook.invalid_signature", {
      tenant,
      requestId,
      bodyBytes: rawBody.length,
    });
    return NextResponse.json(
      { ok: false, error: "INVALID_SIGNATURE", requestId },
      { status: 401 },
    );
  }

  let event: { id?: string; type?: string } | null = null;
  try {
    event = JSON.parse(rawBody) as { id?: string; type?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON", requestId },
      { status: 400 },
    );
  }

  if (!event?.id) {
    return NextResponse.json(
      { ok: false, error: "EVENT_ID_REQUIRED", requestId },
      { status: 400 },
    );
  }

  const job = enqueue(
    "webhook-event",
    tenant,
    `webhook:${event.id}`,
  );
  logEvent("demo.webhook.accepted", {
    tenant,
    requestId,
    eventId: event.id,
    eventType: event.type ?? "unknown",
    jobId: job.id,
  });

  return NextResponse.json({
    ok: true,
    eventId: event.id,
    eventType: event.type ?? "unknown",
    idempotent: true,
    job,
    requestId,
  });
}
