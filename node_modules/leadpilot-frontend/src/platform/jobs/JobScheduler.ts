import { JobType, ScheduledJob } from "./ScheduledJob";
import { jobQueue } from "./JobQueue";

export class JobScheduler {
  public scheduleJob<T = Record<string, unknown>>(
    type: JobType,
    payload: T,
    runAt?: string,
    maxAttempts = 3
  ): ScheduledJob<T> {
    const job: ScheduledJob<T> = {
      id: `job-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      type,
      payload,
      status: "PENDING",
      runAt: runAt || new Date().toISOString(),
      attempts: 0,
      maxAttempts,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jobQueue.enqueue(job as unknown as ScheduledJob<Record<string, unknown>>);
    return job;
  }

  public getJobStatus(jobId: string): ScheduledJob | undefined {
    return jobQueue.getJob(jobId);
  }
}

export const jobScheduler = new JobScheduler();
