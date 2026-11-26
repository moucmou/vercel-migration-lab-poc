import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import { createProject, listProjects } from "@/lib/mock-data";
import { enqueue } from "@/lib/queue";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export async function GET() {
  const { tenant, requestId } = await getTenantContext();
  const projects = listProjects(tenant);
  logEvent("demo.projects.list", { tenant, requestId, count: projects.length });
  return NextResponse.json({ tenant, count: projects.length, projects });
}

export async function POST(request: Request) {
  const { tenant, requestId } = await getTenantContext();
  const body = (await request.json().catch(() => null)) as
    | { name?: string; description?: string; tags?: string[] }
    | null;

  if (!body?.name) {
    return NextResponse.json(
      { ok: false, error: "NAME_REQUIRED", requestId },
      { status: 400 },
    );
  }

  const project = createProject({
    tenant,
    name: body.name,
    description: body.description,
    tags: body.tags,
  });
  const job = enqueue(
    "project-summary",
    tenant,
    `project-summary:${project.id}`,
  );
  logEvent("demo.projects.create", {
    tenant,
    requestId,
    projectId: project.id,
    jobId: job.id,
  });

  return NextResponse.json({ ok: true, project, job, requestId }, { status: 201 });
}
