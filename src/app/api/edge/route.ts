export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const runtime = process.env.NEXT_RUNTIME ?? "nodejs";
  return Response.json(
    {
      ok: true,
      runtime,
      deprecated: true,
      region: process.env.VERCEL_REGION ?? null,
      country: request.headers.get("x-vercel-ip-country"),
      requestId: request.headers.get("x-vercel-id"),
      proxy: request.headers.get("x-lab-proxy"),
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-lab-runtime": runtime,
      },
    },
  );
}
