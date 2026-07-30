import { SampleDataLoader } from "@/platform/onboarding/SampleDataLoader";

describe("Onboarding & Sample Data Unit Tests", () => {
  test("seeds initial sample CRM data for organization", async () => {
    const success = await SampleDataLoader.loadSampleCRMData("org-test");
    expect(success).toBe(true);
  });
});
