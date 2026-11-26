import { NextResponse } from "next/server";
import { sessionCookieOptions } from "@/lib/auth";
import { DEMO_USER } from "@/lib/mock-data";
import { createSession, SESSION_COOKIE } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;
  const email = (body?.email ?? "").trim().toLowerCase();

  if (email !== DEMO_USER.email || body?.password !== DEMO_USER.password) {
    return NextResponse.json(
      { ok: false, error: "INVALID_CREDENTIALS" },
      { status: 401 },
    );
  }

  const token = await createSession(email, DEMO_USER.name);
  const response = NextResponse.json({
    ok: true,
    email,
    name: DEMO_USER.name,
  });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
