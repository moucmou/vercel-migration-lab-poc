export const SESSION_COOKIE = "lab_session";
const AUTH_SECRET = process.env.AUTH_SECRET ?? "demo-auth-secret-change-me";
const encoder = new TextEncoder();

export type Session = {
  email: string;
  name: string;
  exp: number;
};

function base64UrlEncode(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlEncodeText(value: string) {
  return base64UrlEncode(encoder.encode(value));
}

function base64UrlDecodeText(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

async function hmacKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

export async function createSession(
  email = "demo@acme.test",
  name = "Demo Operator",
  ttlSeconds = 8 * 60 * 60,
) {
  const payload: Session = {
    email,
    name,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const body = base64UrlEncodeText(JSON.stringify(payload));
  const signature = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(),
    encoder.encode(body),
  );
  return `${body}.${base64UrlEncode(new Uint8Array(signature))}`;
}

export async function verifySession(token: string): Promise<Session | null> {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = await crypto.subtle.sign(
    "HMAC",
    await hmacKey(),
    encoder.encode(body),
  );
  if (base64UrlEncode(new Uint8Array(expected)) !== signature) return null;

  try {
    const payload = JSON.parse(base64UrlDecodeText(body)) as Session;
    if (!payload.email || !payload.exp) return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
