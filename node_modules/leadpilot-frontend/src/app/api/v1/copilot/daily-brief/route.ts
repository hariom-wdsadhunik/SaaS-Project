import { NextResponse } from "next/server";
import { DailyBriefEngine } from "@/platform/copilot/DailyBriefEngine";

export const dynamic = "force-dynamic";

export async function GET() {
  const brief = await DailyBriefEngine.generateDailyBrief();
  return NextResponse.json({ success: true, brief });
}
