import { NextResponse } from "next/server";
import { logEvent } from "@/lib/logger";
import {
  deleteProject,
  getProject,
  updateProject,
} from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const { tenant, requestId } = await getTenantContext();
  const { id } = await params;
  const project = getProject(id);

  if (!project || project.tenant !== tenant) {
    return NextResponse.json(
      { ok: false, error: "NOT_FOUND", requestId },
      { status: 404 },
    );
  }

  logEvent("demo.projects.get", { tenant, requestId, projectId: id });
  return NextResponse.json({ ok: true, project, requestId });
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { tenant, requestId } = await getTenantContext();
  const { id } = await params;
  const existing = getProject(id);
  if (!existing || existing.tenant !== tenant) {
    return NextResponse.json(
      { ok: false, error: "NOT_FOUND", requestId },
      { status: 404 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | {
        name?: string;
        description?: string;
        status?: "active" | "paused" | "archived";
        tags?: string[];
      }
    | null;
  if (!body) {
    return NextResponse.json(
      { ok: false, error: "INVALID_JSON", requestId },
      { status: 400 },
    );
  }

  const project = updateProject(id, body);
  logEvent("demo.projects.update", { tenant, requestId, projectId: id });
  return NextResponse.json({ ok: true, project, requestId });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { tenant, requestId } = await getTenantContext();
  const { id } = await params;
  const existing = getProject(id);
  if (!existing || existing.tenant !== tenant) {
    return NextResponse.json(
      { ok: false, error: "NOT_FOUND", requestId },
      { status: 404 },
    );
  }

  deleteProject(id);
  logEvent("demo.projects.delete", { tenant, requestId, projectId: id });
  return NextResponse.json({ ok: true, deleted: id, requestId });
}
