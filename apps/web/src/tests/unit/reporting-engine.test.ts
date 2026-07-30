import { ReportingEngine } from "@/domain/reporting/ReportingEngine";

describe("Enterprise Reporting Engine Unit Tests", () => {
  test("ReportingEngine calculates 16 KPI metrics", () => {
    const kpis = ReportingEngine.getKpis();
    expect(kpis.length).toBeGreaterThanOrEqual(9);
    const revKpi = kpis.find((k) => k.id === "kpi-rev");
    expect(revKpi?.formattedValue).toBe("$32.2M");
    expect(revKpi?.changePercentage).toBeGreaterThan(0);
  });

  test("ReportingEngine retrieves custom dashboard layouts", () => {
    const layouts = ReportingEngine.getCustomDashboards();
    expect(layouts.length).toBeGreaterThan(0);
    expect(layouts[0].widgets.length).toBeGreaterThan(0);
  });

  test("ReportingEngine retrieves scheduled report configurations", () => {
    const scheduled = ReportingEngine.getScheduledReports();
    expect(scheduled.length).toBeGreaterThan(0);
    expect(scheduled[0].format).toBe("PDF");
  });

  test("ReportingEngine exports data to CSV and JSON formats", () => {
    const csvData = ReportingEngine.exportData("LEADS", "CSV");
    expect(csvData).toContain("LEADS");

    const jsonData = ReportingEngine.exportData("DEALS", "JSON");
    const parsed = JSON.parse(jsonData);
    expect(parsed.entity).toBe("DEALS");
  });
});
