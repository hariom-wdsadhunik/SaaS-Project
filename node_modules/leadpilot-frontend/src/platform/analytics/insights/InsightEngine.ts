import { Insight } from "@/domain/analytics/types";
import { InsightGenerator } from "./InsightGenerator";
import { InsightRanking } from "./InsightRanking";
import { eventBus } from "@/platform/events/EventBus";

export class InsightEngine {
  public static async generateInsights(): Promise<Insight[]> {
    const raw = await InsightGenerator.generateInsights();
    const ranked = InsightRanking.rankInsights(raw);

    if (ranked.length > 0) {
      await eventBus.publish("InsightGenerated", ranked[0].id, {
        title: ranked[0].title,
        severity: ranked[0].severity,
      });
    }

    return ranked;
  }
}
