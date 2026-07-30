import { DemoModeService } from "@/platform/demo/DemoModeService";

describe("Demo Mode Unit Tests", () => {
  test("toggles demo mode state and generates demo workspace summary", () => {
    DemoModeService.toggleDemoMode(true);
    expect(DemoModeService.isDemoActive()).toBe(true);

    const summary = DemoModeService.getDemoWorkspaceSummary();
    expect(summary.organizationName).toBeDefined();
    expect(summary.samplePipelineValue).toBe("$24,500,000");
  });
});
