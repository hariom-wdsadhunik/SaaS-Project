import { NextResponse } from "next/server";
import { DashboardService } from "@/platform/analytics/DashboardService";

export async function GET() {
  const dashboard = await DashboardService.getExecutiveDashboard();
  return NextResponse.json({ version: "v1", success: true, data: dashboard });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const isExecutive = searchParams.get("executive") !== "false";

  const refreshed = await DashboardService.refreshDashboard(isExecutive);
  return NextResponse.json({ version: "v1", success: true, message: "Dashboard metrics refreshed", data: refreshed });
}
