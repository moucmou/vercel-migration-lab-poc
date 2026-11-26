import { recordActivity } from "@/lib/mock-data";

export type QueueJob = {
  id: string;
  tenant: string;
  type: string;
  status: "queued" | "running" | "done" | "failed";
  attempts: number;
  idempotencyKey: string | null;
  createdAt: string;
  updatedAt: string;
  result: string | null;
};

const jobs: QueueJob[] = [
  {
    id: "job_seed_done",
    tenant: "acme",
    type: "project-summary",
    status: "done",
    attempts: 1,
    idempotencyKey: "seed:project-summary",
    createdAt: "2026-11-26T01:54:12.000Z",
    updatedAt: "2026-11-26T01:54:14.000Z",
    result: "summary generated",
  },
  {
    id: "job_seed_queued",
    tenant: "acme",
    type: "digest-email",
    status: "queued",
    attempts: 0,
    idempotencyKey: null,
    createdAt: "2026-11-26T02:20:00.000Z",
    updatedAt: "2026-11-26T02:20:00.000Z",
    result: null,
  },
  {
    id: "job_seed_failed",
    tenant: "initech",
    type: "media-transcode",
    status: "failed",
    attempts: 1,
    idempotencyKey: "seed:media-transcode",
    createdAt: "2026-11-25T22:14:00.000Z",
    updatedAt: "2026-11-25T22:15:00.000Z",
    result: "timeout",
  },
];

let sequence = 0;

function nextId() {
  sequence += 1;
  return `job_demo_${Date.now()}_${sequence}`;
}

export function enqueue(
  type: string,
  tenant: string,
  idempotencyKey?: string | null,
) {
  if (idempotencyKey) {
    const existing = jobs.find((job) => job.idempotencyKey === idempotencyKey);
    if (existing) return existing;
  }

  const now = new Date().toISOString();
  const job: QueueJob = {
    id: nextId(),
    tenant,
    type,
    status: "queued",
    attempts: 0,
    idempotencyKey: idempotencyKey ?? null,
    createdAt: now,
    updatedAt: now,
    result: null,
  };
  jobs.unshift(job);
  return job;
}

export function processNext() {
  const job = jobs.find(
    (candidate) =>
      candidate.status === "queued" ||
      (candidate.status === "failed" && candidate.attempts < 3),
  );
  if (!job) return null;

  job.status = "running";
  job.attempts += 1;
  job.updatedAt = new Date().toISOString();

  if (job.type.includes("fail")) {
    job.status = "failed";
    job.result = "simulated failure";
  } else {
    job.status = "done";
    job.result = `${job.type} processed by demo worker`;
    recordActivity({
      tenant: job.tenant,
      type: "queue",
      message: `任务 ${job.type} 完成（${job.id}）。`,
      actor: "worker-demo",
    });
  }

  job.updatedAt = new Date().toISOString();
  return job;
}

export function listJobs() {
  return [...jobs];
}

export function queueStats() {
  return {
    total: jobs.length,
    queued: jobs.filter((job) => job.status === "queued").length,
    running: jobs.filter((job) => job.status === "running").length,
    done: jobs.filter((job) => job.status === "done").length,
    failed: jobs.filter((job) => job.status === "failed").length,
  };
}
