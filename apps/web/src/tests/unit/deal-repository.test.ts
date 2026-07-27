import { supabaseDealRepository } from "@/infrastructure/repositories/SupabaseDealRepository";

describe("SupabaseDealRepository Unit Tests", () => {
  test("getDeals returns array of deal entities", async () => {
    const deals = await supabaseDealRepository.getDeals();
    expect(Array.isArray(deals)).toBe(true);
    expect(deals.length).toBeGreaterThan(0);
  });

  test("getDealById retrieves specific deal by ID", async () => {
    const deal = await supabaseDealRepository.getDealById("dl-201");
    expect(deal).not.toBeNull();
    expect(deal?.title).toContain("Palm Jumeirah");
  });

  test("createDeal creates and persists new deal Record", async () => {
    const newDeal = await supabaseDealRepository.createDeal({
      title: "Commercial Highrise Suite",
      companyName: "Skyline Holdings",
      relatedLeadId: "ld-101",
      stage: "NEW",
      value: 2900000,
      probability: 40,
      priority: "HIGH",
      expectedCloseDate: "2026-10-15",
      assignedAgentName: "Alex Morgan",
      notes: "High potential commercial transaction",
    });

    expect(newDeal.id).toBeDefined();
    expect(newDeal.title).toBe("Commercial Highrise Suite");

    const fetched = await supabaseDealRepository.getDealById(newDeal.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.value).toBe(2900000);
  });

  test("changeStage updates stage and probability", async () => {
    const updated = await supabaseDealRepository.changeStage("dl-201", "NEGOTIATION", 85);
    expect(updated.stage).toBe("NEGOTIATION");
    expect(updated.probability).toBe(85);
  });

  test("deleteDeal removes record", async () => {
    const success = await supabaseDealRepository.deleteDeal("dl-206");
    expect(success).toBe(true);
    const fetched = await supabaseDealRepository.getDealById("dl-206");
    expect(fetched).toBeNull();
  });
});
