export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  return Response.json(
    {
      ok: true,
      runtime: process.env.NEXT_RUNTIME ?? "unknown",
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
        "x-lab-runtime": "edge",
      },
    },
  );
}
