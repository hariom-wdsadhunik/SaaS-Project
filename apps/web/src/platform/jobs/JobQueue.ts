import { ScheduledJob } from "./ScheduledJob";

export class JobQueue {
  private queue: Map<string, ScheduledJob> = new Map();

  public enqueue(job: ScheduledJob): void {
    this.queue.set(job.id, job);
  }

  public dequeueNext(): ScheduledJob | null {
    const now = new Date().getTime();
    for (const job of this.queue.values()) {
      if (job.status === "PENDING" || job.status === "RETRYING") {
        if (new Date(job.runAt).getTime() <= now) {
          return job;
        }
      }
    }
    return null;
  }

  public getJob(id: string): ScheduledJob | undefined {
    return this.queue.get(id);
  }

  public updateJob(job: ScheduledJob): void {
    this.queue.set(job.id, { ...job, updatedAt: new Date().toISOString() });
  }

  public size(): number {
    return this.queue.size;
  }

  public clear(): void {
    this.queue.clear();
  }
}

export const jobQueue = new JobQueue();
