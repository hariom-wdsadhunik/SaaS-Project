import { JobHandler, JobType, ScheduledJob } from "./ScheduledJob";
import { jobQueue } from "./JobQueue";
import { defaultRetryPolicy } from "./RetryPolicy";

export class JobRunner {
  private handlers: Map<JobType, JobHandler> = new Map();
  private isProcessing = false;

  public registerHandler(type: JobType, handler: JobHandler): void {
    this.handlers.set(type, handler);
  }

  public async processNext(): Promise<boolean> {
    const job = jobQueue.dequeueNext();
    if (!job) return false;

    const handler = this.handlers.get(job.type);
    if (!handler) {
      job.status = "FAILED";
      job.lastError = `No handler registered for job type: ${job.type}`;
      jobQueue.updateJob(job);
      return false;
    }

    job.status = "RUNNING";
    job.attempts += 1;
    jobQueue.updateJob(job);

    try {
      await handler(job as ScheduledJob<Record<string, unknown>>);
      job.status = "COMPLETED";
      jobQueue.updateJob(job);
      return true;
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Job execution failed";
      job.lastError = errorMsg;

      if (defaultRetryPolicy.shouldRetry(job.attempts)) {
        job.status = "RETRYING";
      } else {
        job.status = "FAILED";
      }
      jobQueue.updateJob(job);
      return false;
    }
  }

  public startLoop(intervalMs = 100): () => void {
    this.isProcessing = true;
    const interval = setInterval(async () => {
      if (this.isProcessing) {
        await this.processNext();
      }
    }, intervalMs);

    return () => {
      this.isProcessing = false;
      clearInterval(interval);
    };
  }
}

export const jobRunner = new JobRunner();
