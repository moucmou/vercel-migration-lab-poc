import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Streaming",
};

async function SlowPanel({
  title,
  delay,
  children,
}: {
  title: string;
  delay: number;
  children: React.ReactNode;
}) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return (
    <section className="stream-panel">
      <div className="panel-title">
        <h2>{title}</h2>
        <span>{delay}ms</span>
      </div>
      <p>{children}</p>
    </section>
  );
}

export default function StreamingPage() {
  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">STREAMING SSR</p>
          <h1>先返回骨架，再补齐数据</h1>
          <p>
            下面两个面板分别延迟 800ms 和 1800ms。观察浏览器是先出现 fallback，
            还是等所有数据完成才返回 HTML。
          </p>
        </div>
        <Link className="button button-small" href="/api/demo/stream">
          打开 SSE 流 →
        </Link>
      </header>

      <div className="stream-grid">
        <Suspense
          fallback={
            <section className="stream-panel stream-skeleton">
              正在加载「租户概况」…
            </section>
          }
        >
          <SlowPanel title="租户概况" delay={800}>
            这个面板延迟 800ms。它验证 Suspense 边界与流式 HTML 是否在目标端保持一致。
          </SlowPanel>
        </Suspense>

        <Suspense
          fallback={
            <section className="stream-panel stream-skeleton">
              正在加载「慢查询」…
            </section>
          }
        >
          <SlowPanel title="慢查询" delay={1800}>
            这个面板延迟 1800ms。迁移后如果平台缓冲整个响应，首字节时间会明显变差。
          </SlowPanel>
        </Suspense>
      </div>

      <div className="notice">
        用 <code>curl -N http://.../demo/streaming</code> 观察分块到达时间；
        不要只看最终 HTML。
      </div>
    </div>
  );
}
