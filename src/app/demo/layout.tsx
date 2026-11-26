import type { Metadata } from "next";
import "./demo.css";

export const metadata: Metadata = {
  title: {
    default: "复杂业务 Mock",
    template: "%s · Acme Cloud",
  },
  description:
    "一个比迁移演练台更接近真实业务的 Next.js mock：多租户、认证、队列、Flags、ISR、上传、Webhook 与流式渲染。",
};

export default function DemoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="demo-root">
      <div className="demo-banner">
        <strong>MOCK PRODUCTION APP</strong>
        <span>
          多租户 SaaS · Auth · Queue · Flags · ISR · Upload · Webhook ·
          Streaming
        </span>
        <a href="/migration">迁移映射 →</a>
      </div>
      {children}
    </div>
  );
}
