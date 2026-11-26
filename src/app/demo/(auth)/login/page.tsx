import type { Metadata } from "next";
import Link from "next/link";
import { loginAction } from "@/app/demo/actions";
import { SubmitButton } from "@/components/demo/submit-button";
import { DEMO_USER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "登录 Demo",
};

export default async function DemoLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="demo-auth-shell">
      <section className="login-card">
        <p className="eyebrow">ACME CLOUD · MOCK AUTH</p>
        <h1>登录 Demo 控制台</h1>
        <p className="note">
          这是一个 mock 登录：签名 Cookie 由 Server Action 写入，Proxy 负责保护
          <code>/demo/dashboard</code>。
        </p>

        {params.error ? (
          <div className="notice notice-error">邮箱或密码不正确，请重试。</div>
        ) : null}

        <form action={loginAction} className="demo-form">
          <input
            type="hidden"
            name="next"
            value={params.next ?? "/demo/dashboard"}
          />
          <label className="field">
            <span>邮箱</span>
            <input
              className="input"
              name="email"
              type="email"
              defaultValue={DEMO_USER.email}
              autoComplete="username"
              required
            />
          </label>
          <label className="field">
            <span>密码</span>
            <input
              className="input"
              name="password"
              type="password"
              defaultValue={DEMO_USER.password}
              autoComplete="current-password"
              required
            />
          </label>
          <SubmitButton
            className="button button-primary"
            pendingText="登录中…"
          >
            登录
          </SubmitButton>
        </form>

        <div className="login-hint">
          <span>Demo 凭证</span>
          <code>{DEMO_USER.email}</code>
          <code>{DEMO_USER.password}</code>
        </div>

        <Link className="text-link" href="/demo">
          ← 返回 Demo 首页
        </Link>
      </section>
    </main>
  );
}
