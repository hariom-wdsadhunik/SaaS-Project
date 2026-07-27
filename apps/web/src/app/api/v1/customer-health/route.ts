import { NextResponse } from "next/server";
import { HealthScoreEngine } from "@/platform/support/HealthScoreEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const engine = new HealthScoreEngine();
  const health = engine.calculateScore({
    loginFrequencyDaysPerWeek: 6,
    featureAdoptionCount: 7,
    monthlyAiQueries: 140,
    monthlyWorkflowRuns: 320,
    openUnresolvedTickets: 0,
    storageUtilizationPercentage: 45,
    onboardingCompleted: true,
  });

  return NextResponse.json({ success: true, health });
}
