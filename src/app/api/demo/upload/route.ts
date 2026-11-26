import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { getTenantContext } from "@/lib/tenant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MAX_BYTES = 4 * 1024 * 1024;

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const contentType = request.headers.get("content-type") ?? "";

  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { ok: false, error: "MULTIPART_REQUIRED", requestId },
      { status: 415 },
    );
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "FILE_REQUIRED", requestId },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    logEvent("demo.upload.too_large", {
      tenant,
      requestId,
      size: file.size,
    });
    return NextResponse.json(
      {
        ok: false,
        error: "FILE_TOO_LARGE",
        limitBytes: MAX_BYTES,
        size: file.size,
        requestId,
      },
      { status: 413 },
    );
  }

  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const sha256 = toHex(digest);
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  logEvent("demo.upload.accepted", {
    tenant,
    requestId,
    name: safeName,
    size: file.size,
    sha256,
  });

  return NextResponse.json({
    ok: true,
    tenant,
    name: safeName,
    size: file.size,
    type: file.type || "application/octet-stream",
    sha256,
    url: `/demo/mock-blob/${sha256.slice(0, 12)}/${safeName}`,
    persisted: false,
    note: "Mock upload: metadata only, no object storage write.",
    requestId,
  });
}
