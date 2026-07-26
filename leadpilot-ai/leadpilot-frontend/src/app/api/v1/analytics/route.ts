import { NextResponse } from "next/server";
import { KPIEngine } from "@/platform/analytics/KPIEngine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const force = searchParams.get("force") === "true";

  if (key) {
    const metric = await KPIEngine.getMetric(key, force);
    return NextResponse.json({ version: "v1", success: true, data: metric });
  }

  const metrics = await KPIEngine.getAllMetrics(force);
  const kpis = await KPIEngine.getKPIs();

  return NextResponse.json({
    version: "v1",
    success: true,
    count: metrics.length,
    metrics,
    kpis,
  });
}
