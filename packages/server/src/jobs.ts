import { randomUUID } from "node:crypto";
import { rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

export interface Job {
  id: string;
  outDir: string;
  title: string;
  sourceUrl: string;
  createdAt: number;
}

const JOBS_ROOT = join(tmpdir(), "website-cloner-jobs");
const JOB_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

const jobs = new Map<string, Job>();

export function jobsRoot(): string {
  return JOBS_ROOT;
}

export function createJob(title: string, sourceUrl: string): Job {
  const id = randomUUID();
  const job: Job = { id, outDir: join(JOBS_ROOT, id), title, sourceUrl, createdAt: Date.now() };
  jobs.set(id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return jobs.get(id);
}

async function reapExpiredJobs() {
  const now = Date.now();
  for (const job of jobs.values()) {
    if (now - job.createdAt > JOB_TTL_MS) {
      jobs.delete(job.id);
      await rm(job.outDir, { recursive: true, force: true }).catch(() => {});
    }
  }
}

export function startJobReaper(): NodeJS.Timeout {
  return setInterval(() => void reapExpiredJobs(), 30 * 60 * 1000);
}
