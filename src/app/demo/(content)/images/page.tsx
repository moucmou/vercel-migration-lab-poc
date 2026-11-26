import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Images",
  description: "next/image 与图片优化边界。",
};

export default function ImagesPage() {
  return (
    <main className="demo-content-page">
      <header className="demo-content-head">
        <p className="eyebrow">IMAGE OPTIMIZATION</p>
        <h1>图片不是静态文件那么简单</h1>
        <p>
          Vercel 的 Image Optimization 会在边缘做尺寸、格式和缓存处理。迁移时要验证
          loader、缓存头、成本与源站回源，而不是只看图片能不能显示。
        </p>
      </header>

      <div className="image-grid">
        <figure className="image-card">
          <Image
            src="/demo/vercel-live-lab.png"
            alt="Vercel 线上运行观测台截图"
            width={960}
            height={540}
            sizes="(max-width: 900px) 100vw, 50vw"
            priority
          />
          <figcaption>
            <strong>Vercel 线上观测台</strong>
            <span>记录入口地域、函数地域、缓存状态与部署 ID。</span>
          </figcaption>
        </figure>
        <figure className="image-card">
          <Image
            src="/demo/local-lab.png"
            alt="本地迁移演练台截图"
            width={960}
            height={540}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          <figcaption>
            <strong>本地目标端</strong>
            <span>用同一份代码观察 standalone 容器与共享缓存的差异。</span>
          </figcaption>
        </figure>
      </div>

      <div className="notice">
        DevTools 里检查 <code>/_next/image?url=...</code> 的响应头；迁移后如果目标端没有
        等价优化器，需要改 <code>loader</code> 或关闭优化。
      </div>
    </main>
  );
}
