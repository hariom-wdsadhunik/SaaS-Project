import { NextResponse } from "next/server";
import { LeadSummaryEngine } from "@/platform/copilot/LeadSummaryEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId") || "lead-101";

  const summary = await LeadSummaryEngine.generateSummary(leadId);
  return NextResponse.json({ success: true, summary });
}
