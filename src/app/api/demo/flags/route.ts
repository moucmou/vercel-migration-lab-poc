import { NextResponse } from "next/server";
import { getFlags } from "@/lib/flags";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const { tenant, variant, requestId } = await getTenantContext();
  return NextResponse.json({
    tenant,
    variant,
    flags: getFlags(tenant, variant),
    requestId,
  });
}
