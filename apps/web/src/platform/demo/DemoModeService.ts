export class DemoModeService {
  private static isDemoModeActive = false;

  public static toggleDemoMode(enable?: boolean): boolean {
    this.isDemoModeActive = enable ?? !this.isDemoModeActive;
    console.log(`[DemoModeService] Demo mode active: ${this.isDemoModeActive}`);
    return this.isDemoModeActive;
  }

  public static isDemoActive(): boolean {
    return this.isDemoModeActive;
  }

  public static getDemoWorkspaceSummary(): Record<string, unknown> {
    return {
      organizationName: "Demo Luxury Real Estate Group",
      sampleLeadsCount: 15,
      sampleDealsCount: 8,
      samplePipelineValue: "$24,500,000",
      sampleDocumentsCount: 12,
      sampleAIConversationsCount: 4,
    };
  }
}
