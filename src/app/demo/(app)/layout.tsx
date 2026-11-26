import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getTenant, listTenants } from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";
import { logoutAction } from "@/app/demo/actions";
import { SubmitButton } from "@/components/demo/submit-button";

const navItems = [
  { href: "/demo", label: "Overview" },
  { href: "/demo/dashboard", label: "Dashboard" },
  { href: "/demo/dashboard/projects", label: "Projects" },
  { href: "/demo/dashboard/settings", label: "Settings" },
  { href: "/demo/blog", label: "Blog" },
  { href: "/demo/docs/getting-started", label: "Docs" },
  { href: "/demo/streaming", label: "Streaming" },
  { href: "/demo/images", label: "Images" },
  { href: "/lab", label: "Migration Lab" },
];

export default async function DemoAppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { tenant, variant, requestId, proxy } = await getTenantContext();
  const tenantInfo = getTenant(tenant);
  const session = await getSession();

  return (
    <div className="demo-shell">
      <aside className="demo-sidebar">
        <Link className="demo-brand" href="/demo">
          <span className="brand-mark">A</span>
          <span>
            <strong>Acme Cloud</strong>
            <small>mock production app</small>
          </span>
        </Link>

        <nav className="demo-nav" aria-label="Demo 导航">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="demo-sidebar-section">
          <p className="demo-sidebar-label">租户切换</p>
          <div className="tenant-switcher">
            {listTenants().map((item) => (
              <Link
                key={item.slug}
                className={item.slug === tenant ? "active" : ""}
                href={`/demo?tenant=${item.slug}`}
              >
                <span style={{ background: item.accent }} />
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="demo-sidebar-foot">
          <div className="demo-session">
            <span>{session ? session.email : "未登录"}</span>
            <small>
              {tenantInfo.plan} · {variant.toUpperCase()} · proxy {proxy}
            </small>
            <small>req {requestId.slice(0, 8)}</small>
          </div>
          {session ? (
            <form action={logoutAction}>
              <SubmitButton className="button button-small" pendingText="退出中…">
                退出
              </SubmitButton>
            </form>
          ) : (
            <Link className="button button-small" href="/demo/login">
              登录
            </Link>
          )}
        </div>
      </aside>

      <main className="demo-main">
        <header className="demo-topbar">
          <div className="demo-topbar-title">
            <span className="badge">{tenantInfo.name}</span>
            <span className="badge">{tenantInfo.plan}</span>
            <span className="badge">variant {variant}</span>
            <span className="badge">region {tenantInfo.region}</span>
          </div>
          <div className="demo-topbar-meta">
            <span>proxy {proxy}</span>
            <span>req {requestId.slice(0, 12)}</span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
