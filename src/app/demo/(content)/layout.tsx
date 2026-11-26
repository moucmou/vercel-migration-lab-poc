import Link from "next/link";

export default function DemoContentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="demo-content-shell">
      <header className="demo-content-nav">
        <Link className="demo-content-brand" href="/demo">
          Acme Cloud <span>content</span>
        </Link>
        <nav>
          <Link href="/demo/blog">Blog</Link>
          <Link href="/demo/docs/getting-started">Docs</Link>
          <Link href="/demo/images">Images</Link>
          <Link href="/demo/dashboard">Dashboard</Link>
          <Link href="/lab">Lab</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
