import { NextResponse } from "next/server";
import { MeetingPrepEngine } from "@/platform/copilot/MeetingPrepEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("leadId") || "lead-101";

  const prep = await MeetingPrepEngine.generatePrep(leadId);
  return NextResponse.json({ success: true, prep });
}
