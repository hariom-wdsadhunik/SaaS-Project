import { ReportEngine } from "@/platform/analytics/reports/ReportEngine";

describe("ReportEngine Unit Tests", () => {
  test("creates custom report and exports to CSV format", async () => {
    const report = await ReportEngine.createReport({
      title: "Quarterly Deal Velocity Analysis",
      category: "PIPELINE",
    });

    expect(report.id).toBeDefined();
    const csv = ReportEngine.exportReport(report, "CSV");
    expect(csv).toContain("id,entity_name,category,metric_value,created_at");
  });
});
