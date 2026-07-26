import { AIContext, EntityReference } from "./types";
import { supabase } from "@/lib/supabase/client";

export class AIContextBuilder {
  public static async buildContext(organizationId: string, userId: string, activeEntity?: EntityReference): Promise<AIContext> {
    const relatedEntities: EntityReference[] = [];

    // Query active leads
    const { data: leads } = await supabase.from("leads").select("id, full_name, status").limit(3);
    leads?.forEach((l) =>
      relatedEntities.push({ id: l.id, type: "LEAD", title: `Lead: ${l.full_name} (${l.status})` })
    );

    // Query active deals
    const { data: deals } = await supabase.from("deals").select("id, title, stage, value").limit(3);
    deals?.forEach((d) =>
      relatedEntities.push({ id: d.id, type: "DEAL", title: `Deal: ${d.title} ($${Number(d.value).toLocaleString()})` })
    );

    // Query recent documents
    const { data: docs } = await supabase.from("documents").select("id, name").limit(2);
    docs?.forEach((doc) =>
      relatedEntities.push({ id: doc.id, type: "DOCUMENT", title: `Document: ${doc.name}` })
    );

    const activitySummary = `Active pipeline: ${deals?.length || 0} deals, ${leads?.length || 0} hot leads, ${docs?.length || 0} stored documents.`;

    return {
      organizationId,
      userId,
      userRole: "BROKER",
      activeEntity,
      relatedEntities,
      recentActivitySummary: activitySummary,
    };
  }
}
