import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createSession,
  SESSION_COOKIE,
  verifySession,
  type Session,
} from "@/lib/session";

export { createSession, SESSION_COOKIE, verifySession };
export type { Session };

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function requireSession(nextPath = "/demo/dashboard") {
  const session = await getSession();
  if (!session) {
    redirect(`/demo/login?next=${encodeURIComponent(nextPath)}`);
  }
  return session;
}

export function sessionCookieOptions() {
  const secureOverride = process.env.COOKIE_SECURE;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 8,
    secure:
      secureOverride === "1" ||
      (secureOverride !== "0" && process.env.NODE_ENV === "production"),
  };
}
