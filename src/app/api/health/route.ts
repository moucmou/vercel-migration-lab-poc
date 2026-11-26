export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const body = {
    ok: true,
    service: "migration-lab",
    runtime: "nodejs",
    platform: process.env.VERCEL ? "vercel" : "local",
    label: process.env.LAB_ENV_LABEL ?? null,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    region: process.env.VERCEL_REGION ?? null,
    node: process.version,
    uptimeSeconds: Math.round(process.uptime()),
    commit: process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
    requestId: request.headers.get("x-vercel-id"),
    proxy: request.headers.get("x-lab-proxy"),
    timestamp: new Date().toISOString(),
  };

  return Response.json(body, {
    headers: {
      "cache-control": "no-store",
      "x-lab-runtime": "nodejs",
    },
  });
}
