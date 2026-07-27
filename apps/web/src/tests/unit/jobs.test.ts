import { jobScheduler } from "@/platform/jobs/JobScheduler";
import { jobQueue } from "@/platform/jobs/JobQueue";
import { jobRunner } from "@/platform/jobs/JobRunner";
import { defaultRetryPolicy } from "@/platform/jobs/RetryPolicy";

describe("Background Job Queue Unit Tests", () => {
  beforeEach(() => {
    jobQueue.clear();
  });

  test("schedules jobs into pending state in job queue", () => {
    const job = jobScheduler.scheduleJob("REMINDER_DELIVERY", { appointmentId: "apt-101" });
    expect(job.id).toBeDefined();
    expect(job.status).toBe("PENDING");
    expect(jobQueue.size()).toBe(1);
  });

  test("runs job handler and updates status to COMPLETED", async () => {
    let executed = false;
    jobRunner.registerHandler("AI_TASK", async () => {
      executed = true;
    });

    const job = jobScheduler.scheduleJob("AI_TASK", { prompt: "Analyze leads" });
    const success = await jobRunner.processNext();

    expect(success).toBe(true);
    expect(executed).toBe(true);
    expect(jobScheduler.getJobStatus(job.id)?.status).toBe("COMPLETED");
  });

  test("applies retry policy on handler failure", async () => {
    jobRunner.registerHandler("WORKFLOW_EXECUTION", async () => {
      throw new Error("Temporary service outage");
    });

    const job = jobScheduler.scheduleJob("WORKFLOW_EXECUTION", { workflowId: "wf-123" });
    const success = await jobRunner.processNext();

    expect(success).toBe(false);
    expect(jobScheduler.getJobStatus(job.id)?.status).toBe("RETRYING");
    expect(jobScheduler.getJobStatus(job.id)?.attempts).toBe(1);
  });

  test("calculates exponential backoff delays", () => {
    expect(defaultRetryPolicy.getNextDelayMs(1)).toBe(100);
    expect(defaultRetryPolicy.getNextDelayMs(2)).toBe(200);
    expect(defaultRetryPolicy.getNextDelayMs(3)).toBe(400);
  });
});
