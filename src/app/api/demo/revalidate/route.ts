import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const secret = process.env.REVALIDATE_SECRET ?? "revalidate-demo";
  const authorization = request.headers.get("authorization");

  if (authorization !== `Bearer ${secret}`) {
    return NextResponse.json(
      { ok: false, error: "UNAUTHORIZED", requestId },
      { status: 401 },
    );
  }

  revalidateTag("metrics", "max");
  revalidatePath("/demo/blog");
  revalidatePath("/demo/dashboard");
  logEvent("demo.revalidate", { tenant, requestId });

  return NextResponse.json({
    ok: true,
    revalidatedTag: "metrics",
    revalidatedPaths: ["/demo/blog", "/demo/dashboard"],
    requestId,
    revalidatedAt: new Date().toISOString(),
  });
}
