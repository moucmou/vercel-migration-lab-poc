import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/">
          <span className="brand-mark">VC→TC</span>
          <span>迁移演练台</span>
        </Link>
        <nav className="nav" aria-label="主导航">
          <Link href="/demo">复杂 Mock</Link>
          <Link href="/lab">运行观测</Link>
          <Link href="/migration">能力映射</Link>
          <Link href="/lab/isr">ISR 缓存</Link>
        </nav>
      </div>
    </header>
  );
}
