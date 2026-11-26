import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import {
  REQUEST_ID_HEADER,
  resolveTenant,
  TENANT_HEADER,
  VARIANT_HEADER,
} from "@/lib/tenant";

function pickVariant(request: NextRequest) {
  const existing = request.cookies.get("lab_variant")?.value;
  if (existing === "a" || existing === "b") return existing;
  return Math.random() < 0.5 ? "a" : "b";
}

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const tenant = resolveTenant(
    request.headers.get("host"),
    searchParams.get("tenant"),
    request.cookies.get("lab_tenant")?.value,
  );
  const variant = pickVariant(request);
  const requestId = crypto.randomUUID();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-lab-proxy", "hit");
  requestHeaders.set("x-lab-proxy-path", pathname);
  requestHeaders.set(TENANT_HEADER, tenant);
  requestHeaders.set(VARIANT_HEADER, variant);
  requestHeaders.set(REQUEST_ID_HEADER, requestId);

  if (pathname.startsWith("/demo/dashboard")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = token ? await verifySession(token) : null;
    if (!session) {
      const loginUrl = new URL("/demo/login", request.url);
      loginUrl.searchParams.set("next", `${pathname}${request.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-lab-proxy", "hit");
  response.headers.set("x-lab-proxy-path", pathname);
  response.headers.set(TENANT_HEADER, tenant);
  response.headers.set(VARIANT_HEADER, variant);
  response.headers.set(REQUEST_ID_HEADER, requestId);

  if (!request.cookies.get("lab_variant")) {
    response.cookies.set("lab_variant", variant, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  if (searchParams.get("tenant")) {
    response.cookies.set("lab_tenant", tenant, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
    });
  }

  return response;
}

export const config = {
  matcher: ["/lab/:path*", "/api/:path*", "/migration", "/demo/:path*"],
};
