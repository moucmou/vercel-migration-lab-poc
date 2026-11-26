import { headers } from "next/headers";

export const TENANT_HEADER = "x-lab-tenant";
export const VARIANT_HEADER = "x-lab-variant";
export const REQUEST_ID_HEADER = "x-lab-request-id";

const TENANT_SLUGS = new Set(["acme", "globex", "initech"]);

export function isTenantSlug(
  value: string | null | undefined,
): value is string {
  return Boolean(value && TENANT_SLUGS.has(value));
}

export function resolveTenant(
  host: string | null,
  queryTenant?: string | null,
  cookieTenant?: string | null,
) {
  const subdomain = (host ?? "").split(".")[0]?.toLowerCase();
  if (isTenantSlug(subdomain)) return subdomain;
  if (isTenantSlug(queryTenant)) return queryTenant;
  if (isTenantSlug(cookieTenant)) return cookieTenant;
  return "acme";
}

export async function getTenantContext() {
  const requestHeaders = await headers();
  return {
    tenant: requestHeaders.get(TENANT_HEADER) ?? "acme",
    variant: requestHeaders.get(VARIANT_HEADER) ?? "a",
    requestId:
      requestHeaders.get(REQUEST_ID_HEADER) ?? crypto.randomUUID(),
    proxy: requestHeaders.get("x-lab-proxy") ?? "miss",
  };
}
