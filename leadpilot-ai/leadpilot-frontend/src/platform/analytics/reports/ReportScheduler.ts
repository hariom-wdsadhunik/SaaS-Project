import { jobScheduler } from "@/platform/jobs/JobScheduler";

export class ReportScheduler {
  public static async scheduleReportDelivery(reportId: string, cronSchedule: string, recipients: string[]): Promise<boolean> {
    console.log(`[ReportScheduler] Scheduling report ${reportId} for delivery: ${cronSchedule} to ${recipients.join(", ")}`);

    jobScheduler.scheduleJob(
      "REPORT_GENERATION",
      { reportId, cronSchedule, recipients },
      new Date().toISOString()
    );

    return true;
  }
}
