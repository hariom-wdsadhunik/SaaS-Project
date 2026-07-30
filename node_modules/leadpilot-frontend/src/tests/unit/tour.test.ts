import { ProductTourService } from "@/platform/tour/ProductTourService";

describe("Product Tour Unit Tests", () => {
  test("returns guided tour steps for CRM modules", () => {
    const dashboardSteps = ProductTourService.getTourSteps("DASHBOARD");
    expect(dashboardSteps.length).toBeGreaterThan(0);
    expect(dashboardSteps[0].title).toBe("Revenue Metrics");
  });
});
