import { HelpCenterService } from "@/platform/support/HelpCenterService";
import { TicketService } from "@/platform/support/TicketService";
import { HealthScoreEngine } from "@/platform/support/HealthScoreEngine";

describe("Customer Success Platform Unit Test Suite", () => {
  test("searches help center articles correctly", () => {
    const service = new HelpCenterService();
    const results = service.searchArticles("Copilot");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].title).toContain("AI Copilot");
  });

  test("manages support ticket lifecycle", () => {
    const service = new TicketService();
    const ticket = service.createTicket("org_test", "usr_test", "Login Failure", "Cannot log in", "urgent");
    expect(ticket.status).toBe("open");
    expect(ticket.priority).toBe("urgent");
  });

  test("computes composite 0-100 customer health score", () => {
    const engine = new HealthScoreEngine();
    const result = engine.calculateScore({
      loginFrequencyDaysPerWeek: 7,
      featureAdoptionCount: 8,
      monthlyAiQueries: 200,
      monthlyWorkflowRuns: 500,
      openUnresolvedTickets: 0,
      storageUtilizationPercentage: 50,
      onboardingCompleted: true,
    });
    expect(result.score).toBe(100);
    expect(result.status).toBe("HEALTHY");
  });
});
