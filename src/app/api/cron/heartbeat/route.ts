export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return Response.json(
      {
        ok: false,
        error: "CRON_SECRET_NOT_CONFIGURED",
        hint: "In production set CRON_SECRET; Vercel Cron sends it as a Bearer token.",
      },
      { status: 503 },
    );
  }

  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return Response.json(
      { ok: false, error: "UNAUTHORIZED" },
      { status: 401 },
    );
  }

  return Response.json({
    ok: true,
    job: "heartbeat",
    ranAt: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel" : "local",
  });
}
