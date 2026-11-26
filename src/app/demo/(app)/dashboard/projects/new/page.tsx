import type { Metadata } from "next";
import Link from "next/link";
import { createProjectAction } from "@/app/demo/actions";
import { SubmitButton } from "@/components/demo/submit-button";
import { requireSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New project",
};

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireSession("/demo/dashboard/projects/new");
  const params = await searchParams;

  return (
    <div className="demo-page">
      <header className="demo-page-head">
        <div>
          <p className="eyebrow">SERVER ACTION FORM</p>
          <h1>新建项目</h1>
          <p>
            这个表单直接调用 Server Action，写入 mock store 后触发{" "}
            <code>updateTag(&quot;metrics&quot;)</code>。
          </p>
        </div>
        <Link className="button button-small" href="/demo/dashboard/projects">
          取消
        </Link>
      </header>

      {params.error === "name" ? (
        <div className="notice notice-error">项目名称不能为空。</div>
      ) : null}

      <section className="panel">
        <form action={createProjectAction} className="demo-form">
          <label className="field">
            <span>项目名称</span>
            <input
              className="input"
              name="name"
              placeholder="例如：Orion Gateway"
              required
            />
          </label>
          <label className="field">
            <span>描述</span>
            <textarea
              className="input textarea"
              name="description"
              rows={4}
              placeholder="这个项目负责什么？迁移时最担心哪一层？"
            />
          </label>
          <label className="field">
            <span>标签（逗号分隔）</span>
            <input
              className="input"
              name="tags"
              placeholder="api, queue, postgres"
            />
          </label>
          <div className="form-actions">
            <SubmitButton
              className="button button-primary"
              pendingText="创建中…"
            >
              创建项目
            </SubmitButton>
            <Link className="text-link" href="/demo/dashboard/projects">
              返回列表
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
