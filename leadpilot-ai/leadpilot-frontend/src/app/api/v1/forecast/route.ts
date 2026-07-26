import { NextResponse } from "next/server";
import { ForecastEngine } from "@/platform/analytics/forecast/ForecastEngine";
import { MetricCategory } from "@/domain/analytics/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") as MetricCategory) || "REVENUE";
  const days = Number(searchParams.get("days") || 30);

  const forecast = await ForecastEngine.generateForecast(category, days);
  return NextResponse.json({ version: "v1", success: true, data: forecast });
}
