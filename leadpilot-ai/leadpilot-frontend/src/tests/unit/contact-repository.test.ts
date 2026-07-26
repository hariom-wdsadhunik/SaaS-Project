import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";

describe("SupabaseContactRepository Unit Tests", () => {
  test("getContacts returns array of contact entities", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    expect(Array.isArray(contacts)).toBe(true);
    expect(contacts.length).toBeGreaterThan(0);
  });

  test("getContactById retrieves specific contact", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    const firstId = contacts[0].id;
    const contact = await supabaseContactRepository.getContactById(firstId);
    expect(contact).not.toBeNull();
    expect(contact?.id).toBe(firstId);
  });

  test("createContact creates and persists contact profile", async () => {
    const newContact = await supabaseContactRepository.createContact({
      firstName: "Robert",
      lastName: "Sterling",
      email: "robert.sterling@sterlingholdings.ae",
      phone: "+971 50 777 9999",
      companyName: "Sterling Global Real Estate",
      designation: "Managing Partner",
      status: "VIP",
      assignedAgentName: "Alex Morgan",
      tags: "VIP, Investor, Commercial",
      notes: "Ultra-wealthy investor interested in prime commercial towers.",
    });

    expect(newContact.id).toBeDefined();
    expect(newContact.fullName).toBe("Robert Sterling");
    expect(newContact.status).toBe("VIP");

    const fetched = await supabaseContactRepository.getContactById(newContact.id);
    expect(fetched).not.toBeNull();
    expect(fetched?.email).toBe("robert.sterling@sterlingholdings.ae");
  });

  test("favoriteContact toggles favorite state", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    const testId = contacts[0].id;
    const initialFav = contacts[0].isFavorite;

    const updated = await supabaseContactRepository.favoriteContact(testId, !initialFav);
    expect(updated.isFavorite).toBe(!initialFav);
  });

  test("archiveContact updates status to ARCHIVED", async () => {
    const contacts = await supabaseContactRepository.getContacts();
    const testId = contacts[contacts.length - 1].id;

    const archived = await supabaseContactRepository.archiveContact(testId);
    expect(archived.status).toBe("ARCHIVED");
  });

  test("deleteContact removes record", async () => {
    const newContact = await supabaseContactRepository.createContact({
      firstName: "Temp",
      lastName: "DeleteMe",
      email: "temp.delete@example.com",
      status: "INACTIVE",
      assignedAgentName: "Alex Morgan",
    });

    const deleted = await supabaseContactRepository.deleteContact(newContact.id);
    expect(deleted).toBe(true);

    const fetched = await supabaseContactRepository.getContactById(newContact.id);
    expect(fetched).toBeNull();
  });
});
