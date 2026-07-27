import { Forecast, MetricCategory } from "@/domain/analytics/types";
import { ForecastModel } from "./ForecastModel";
import { TrendAnalyzer, TrendPoint } from "./TrendAnalyzer";
import { eventBus } from "@/platform/events/EventBus";

export class ForecastEngine {
  public static async generateForecast(category: MetricCategory, forecastPeriodDays: number = 30): Promise<Forecast> {
    const historicalPoints: TrendPoint[] = [
      { date: "2026-06-01", value: 2100000 },
      { date: "2026-06-15", value: 2450000 },
      { date: "2026-07-01", value: 2900000 },
      { date: "2026-07-15", value: 3500000 },
    ];

    const points = ForecastModel.generatePredictivePoints(category, historicalPoints, forecastPeriodDays);
    const growthRate = TrendAnalyzer.calculateGrowthRate(historicalPoints);
    const totalPredicted = points.reduce((acc, p) => acc + p.predictedValue, 0);

    const forecast: Forecast = {
      id: `frc-${category.toLowerCase()}-${Date.now()}`,
      metricCategory: category,
      targetMetricName: `${category} 30-Day Predictive Projection`,
      historicalPeriodDays: 45,
      forecastPeriodDays,
      points,
      totalPredictedValue: totalPredicted,
      growthRatePercentage: growthRate,
      generatedAt: new Date().toISOString(),
    };

    await eventBus.publish("ForecastGenerated", forecast.id, { category, totalPredicted });
    return forecast;
  }
}
