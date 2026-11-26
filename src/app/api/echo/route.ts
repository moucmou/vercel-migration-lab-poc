export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxBodyBytes = 4096;

export async function POST(request: Request) {
  const rawBody = await request.text();
  const size = new TextEncoder().encode(rawBody).byteLength;

  if (size > maxBodyBytes) {
    return Response.json(
      {
        ok: false,
        error: "body_too_large",
        limitBytes: maxBodyBytes,
        receivedBytes: size,
      },
      { status: 413 },
    );
  }

  let body: unknown = rawBody;

  try {
    body = JSON.parse(rawBody);
  } catch {
    // Plain text is accepted as a fallback; the response records that it was not JSON.
  }

  return Response.json(
    {
      ok: true,
      runtime: "nodejs",
      receivedBytes: size,
      contentType: request.headers.get("content-type"),
      proxy: request.headers.get("x-lab-proxy"),
      echoed: body,
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-lab-runtime": "nodejs",
      },
    },
  );
}
