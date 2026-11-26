"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import {
  createSession,
  SESSION_COOKIE,
  sessionCookieOptions,
} from "@/lib/auth";
import {
  createProject,
  deleteProject,
  DEMO_USER,
  updateProject,
} from "@/lib/mock-data";
import { getTenantContext } from "@/lib/tenant";
import { enqueue, processNext } from "@/lib/queue";

function safeNext(value: FormDataEntryValue | null) {
  const next = String(value ?? "/demo/dashboard");
  return next.startsWith("/demo") ? next : "/demo/dashboard";
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
    redirect(
      `/demo/login?error=invalid&next=${encodeURIComponent(next)}`,
    );
  }

  const token = await createSession(email, DEMO_USER.name);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions());
  redirect(next);
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/demo");
}

export async function createProjectAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .slice(0, 6);

  if (!name) {
    redirect("/demo/dashboard/projects/new?error=name");
  }

  const { tenant } = await getTenantContext();
  const project = createProject({
    tenant,
    name,
    description,
    tags,
    owner: DEMO_USER.email,
  });

  updateTag("metrics");
  revalidatePath("/demo/dashboard");
  revalidatePath("/demo/dashboard/projects");
  redirect(`/demo/dashboard/projects/${project.id}`);
}

export async function archiveProjectAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  updateProject(id, { status: "archived" });
  updateTag("metrics");
  revalidatePath("/demo/dashboard");
  revalidatePath("/demo/dashboard/projects");
  revalidatePath(`/demo/dashboard/projects/${id}`);
}

export async function deleteProjectAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  deleteProject(id);
  updateTag("metrics");
  revalidatePath("/demo/dashboard");
  revalidatePath("/demo/dashboard/projects");
  redirect("/demo/dashboard/projects");
}

export async function enqueueDigestAction() {
  const { tenant } = await getTenantContext();
  const day = new Date().toISOString().slice(0, 10);
  enqueue("digest-email", tenant, `digest:${tenant}:${day}`);
  revalidatePath("/demo/dashboard/settings");
}

export async function processQueueAction() {
  processNext();
  revalidatePath("/demo/dashboard/settings");
  revalidatePath("/demo/dashboard");
}

export async function revalidateDemoAction() {
  updateTag("metrics");
  revalidatePath("/demo/blog");
  revalidatePath("/demo/dashboard");
}
