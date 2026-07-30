import { AdminService } from "@/domain/admin/AdminService";

describe("Enterprise Admin Service Unit Tests", () => {
  test("AdminService computes overview stats", () => {
    const stats = AdminService.getOverviewStats();
    expect(stats.activeOrganizations).toBeGreaterThan(100);
    expect(stats.totalUsers).toBeGreaterThan(1000);
    expect(stats.systemUptimePercentage).toBeGreaterThan(99);
  });

  test("AdminService retrieves feature flag configurations", () => {
    const flags = AdminService.getFeatureFlags();
    expect(flags.length).toBeGreaterThan(0);
    expect(flags[0].enabled).toBe(true);
    expect(flags[0].rolloutPercentage).toBeGreaterThan(0);
  });

  test("AdminService retrieves live system metrics", () => {
    const metrics = AdminService.getSystemMetrics();
    expect(metrics.length).toBeGreaterThan(0);
    const cpu = metrics.find((m) => m.metric.includes("CPU"));
    expect(cpu?.status).toBe("HEALTHY");
  });

  test("AdminService manages background jobs queue and backups", () => {
    const jobs = AdminService.getBackgroundJobs();
    expect(jobs.length).toBeGreaterThan(0);

    const backups = AdminService.getBackups();
    expect(backups.length).toBeGreaterThan(0);
    expect(backups[0].checksumSha256).toBeDefined();
  });
});
