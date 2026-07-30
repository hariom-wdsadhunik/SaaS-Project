import { supabase } from "@/lib/supabase/client";

export class SampleDataLoader {
  public static async loadSampleCRMData(organizationId: string): Promise<boolean> {
    console.log(`[SampleDataLoader] Seeding sample CRM data for tenant organization: ${organizationId}`);

    // Seed sample lead if empty
    const { data: leads } = await supabase.from("leads").select("id").limit(1);
    if (!leads || leads.length === 0) {
      await supabase.from("leads").insert({
        full_name: "Victoria Kensington-Smythe",
        email: "victoria.k@kensington.uk",
        phone: "+442079460912",
        status: "QUALIFIED",
        source: "WEBSITE",
        budget: 5500000,
        notes: "Interested in luxury Palm Jumeirah waterfront penthouses.",
      });
    }

    return true;
  }
}
