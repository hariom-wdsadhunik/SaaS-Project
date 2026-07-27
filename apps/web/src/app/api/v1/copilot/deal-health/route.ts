import { NextResponse } from "next/server";
import { DealHealthEngine } from "@/platform/copilot/DealHealthEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dealId = searchParams.get("dealId");

  if (dealId) {
    const health = await DealHealthEngine.predictHealth(dealId);
    return NextResponse.json({ success: true, health });
  }

  const deals = await DealHealthEngine.predictAllDeals();
  return NextResponse.json({ success: true, count: deals.length, deals });
}
