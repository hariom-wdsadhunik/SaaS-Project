import { DashboardService } from "@/platform/analytics/DashboardService";

describe("DashboardService Unit Tests", () => {
  test("getExecutiveDashboard returns dashboard instance with widgets", async () => {
    const dash = await DashboardService.getExecutiveDashboard();
    expect(dash.isExecutive).toBe(true);
    expect(dash.widgets.length).toBe(9);
    const revenueWidget = dash.widgets.find((w) => w.id === "w-rev");
    expect(revenueWidget).toBeDefined();
  });
});
