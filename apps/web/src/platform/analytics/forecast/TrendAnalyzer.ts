export interface TrendPoint {
  date: string;
  value: number;
}

export class TrendAnalyzer {
  public static calculateGrowthRate(points: TrendPoint[]): number {
    if (points.length < 2) return 0.05;

    const first = points[0].value;
    const last = points[points.length - 1].value;

    if (first === 0) return 0.1;
    return Number((((last - first) / first) * 100).toFixed(2));
  }

  public static calculateMovingAverage(points: TrendPoint[], windowSize: number = 3): number[] {
    const averages: number[] = [];
    for (let i = 0; i < points.length; i++) {
      const start = Math.max(0, i - windowSize + 1);
      const windowPoints = points.slice(start, i + 1);
      const sum = windowPoints.reduce((acc, p) => acc + p.value, 0);
      averages.push(Math.round(sum / windowPoints.length));
    }
    return averages;
  }
}
