import { ForecastPoint, MetricCategory } from "@/domain/analytics/types";
import { TrendAnalyzer, TrendPoint } from "./TrendAnalyzer";

export class ForecastModel {
  public static generatePredictivePoints(category: MetricCategory, historicalPoints: TrendPoint[], forecastDays: number = 30): ForecastPoint[] {
    const growthRatePct = TrendAnalyzer.calculateGrowthRate(historicalPoints);
    const dailyFactor = 1 + growthRatePct / 100 / 30;

    const lastVal = historicalPoints[historicalPoints.length - 1]?.value || 100000;
    const result: ForecastPoint[] = [];

    let currentVal = lastVal;
    const now = new Date();

    for (let day = 1; day <= forecastDays; day++) {
      currentVal = Math.round(currentVal * dailyFactor);
      const nextDate = new Date(now.getTime() + day * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const variance = currentVal * 0.08;
      result.push({
        date: nextDate,
        predictedValue: currentVal,
        lowerBound: Math.round(currentVal - variance),
        upperBound: Math.round(currentVal + variance),
        confidenceScore: 0.92,
      });
    }

    return result;
  }
}
