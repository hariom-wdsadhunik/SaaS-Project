import { Report } from "@/domain/analytics/types";
import { ReportBuilder, BuildReportInput } from "./ReportBuilder";
import { ReportExporter, ExportFormat } from "./ReportExporter";
import { ReportScheduler } from "./ReportScheduler";
import { eventBus } from "@/platform/events/EventBus";

export class ReportEngine {
  private static savedReports: Map<string, Report> = new Map();

  public static async createReport(input: BuildReportInput): Promise<Report> {
    const report = ReportBuilder.buildReport(input);
    this.savedReports.set(report.id, report);

    await eventBus.publish("ReportCreated", report.id, { title: report.title, category: report.category });
    return report;
  }

  public static async getReport(reportId: string): Promise<Report | null> {
    const report = this.savedReports.get(reportId);
    if (!report) {
      return ReportBuilder.buildReport({ title: "Default Sales Report", category: "REVENUE" });
    }
    return report;
  }

  public static exportReport(report: Report, format: ExportFormat): string {
    return ReportExporter.export(report, format);
  }

  public static async scheduleReport(reportId: string, cronSchedule: string, recipients: string[]): Promise<boolean> {
    return ReportScheduler.scheduleReportDelivery(reportId, cronSchedule, recipients);
  }
}
