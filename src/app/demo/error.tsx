"use client";

export default function DemoError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="site-shell section">
      <section className="panel">
        <p className="eyebrow">DEMO ERROR BOUNDARY</p>
        <h1>这个页面出错了。</h1>
        <p className="note">
          {error.message || "未知错误"}
          {error.digest ? ` · digest ${error.digest}` : ""}
        </p>
        <button className="button button-primary" onClick={reset}>
          重试
        </button>
      </section>
    </main>
  );
}
