import { ContactEntity, ContactFilterState } from "@/domain/contact/types";
import { ContactFormInput } from "@/lib/validations/contact-form";
import { platformAuditLogger } from "@/platform/audit";

export const initialContactsDataset: ContactEntity[] = [
  {
    id: "cnt-301",
    fullName: "John Doe",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    jobTitle: "Managing Director",
    designation: "Managing Director",
    company: "Vanguard Tech Holdings",
    companyName: "Vanguard Tech Holdings",
    email: "john.doe@vanguardtech.com",
    phone: "+971 50 123 4567",
    status: "VIP",
    isFavorite: true,
    tags: ["High Net Worth", "Commercial Buyer"],
    assignedAgentName: "Alex Morgan",
    agentAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    lastActivity: "2026-07-24T09:30:00Z",
    createdAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "cnt-302",
    fullName: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    jobTitle: "VP of Operations",
    designation: "VP of Operations",
    company: "Apex Logistics Ltd",
    companyName: "Apex Logistics Ltd",
    email: "sarah.jenkins@apexlogistics.com",
    phone: "+971 52 987 6543",
    status: "CLIENT",
    isFavorite: false,
    tags: ["Repeat Client", "Penthouse Preference"],
    assignedAgentName: "Sarah Jenkins",
    agentAvatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    lastActivity: "2026-07-23T14:15:00Z",
    createdAt: "2026-06-15T11:00:00Z",
  },
  {
    id: "cnt-303",
    fullName: "Alexander Montgomery III",
    jobTitle: "Chairman",
    designation: "Chairman",
    company: "Wellington Investments",
    companyName: "Wellington Investments",
    email: "alexander@wellington.ae",
    phone: "+971 55 444 8888",
    status: "PROSPECT",
    isFavorite: true,
    tags: ["Luxury Villa", "Investor"],
    assignedAgentName: "Alex Morgan",
    lastActivity: "2026-07-22T11:00:00Z",
    createdAt: "2026-07-10T15:20:00Z",
  },
  {
    id: "cnt-304",
    fullName: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    jobTitle: "Principal Architect",
    designation: "Principal Architect",
    company: "Chen Design Studio",
    companyName: "Chen Design Studio",
    email: "m.chen@chendesign.io",
    phone: "+971 50 888 2211",
    status: "ACTIVE",
    isFavorite: false,
    tags: ["Partner", "Duplex Preference"],
    assignedAgentName: "Michael Chen",
    agentAvatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    lastActivity: "2026-07-20T16:45:00Z",
    createdAt: "2026-05-20T08:30:00Z",
  },
  {
    id: "cnt-305",
    fullName: "Emily Watson",
    jobTitle: "Head of Expansion",
    designation: "Head of Expansion",
    company: "Urban Coffee Roasters",
    companyName: "Urban Coffee Roasters",
    email: "emily@urbancoffee.com",
    phone: "+971 54 333 1122",
    status: "CLIENT",
    isFavorite: false,
    tags: ["Retail", "Commercial Tenant"],
    assignedAgentName: "Alex Morgan",
    lastActivity: "2026-07-18T10:00:00Z",
    createdAt: "2026-07-05T12:00:00Z",
  },
];

export const contactMockService = {
  async getContacts(filters?: Partial<ContactFilterState>): Promise<ContactEntity[]> {
    await new Promise((res) => setTimeout(res, 200));

    let items = [...initialContactsDataset];

    if (filters) {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(
          (c) =>
            c.fullName.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.companyName?.toLowerCase().includes(q) ||
            c.company.toLowerCase().includes(q)
        );
      }
      if (filters.status) {
        items = items.filter((c) => c.status === filters.status);
      }
      if (filters.assignedAgent) {
        items = items.filter((c) => c.assignedAgentName === filters.assignedAgent);
      }
      if (filters.company) {
        items = items.filter((c) => c.companyName === filters.company || c.company === filters.company);
      }
    }

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "CONTACT",
      entityIds: items.map((i) => i.id),
      payload: { filterCount: items.length },
      timestamp: new Date().toISOString(),
    });

    return items;
  },

  async createContact(input: ContactFormInput): Promise<ContactEntity> {
    await new Promise((res) => setTimeout(res, 400));

    if (input.email) {
      const emailMatch = initialContactsDataset.find(
        (c) => c.email.toLowerCase() === input.email?.toLowerCase()
      );
      if (emailMatch) {
        throw new Error(`A contact with email "${input.email}" already exists.`);
      }
    }

    const fullName = `${input.firstName} ${input.lastName}`;
    const newContact: ContactEntity = {
      id: `cnt-${Math.floor(300 + Math.random() * 700)}`,
      fullName,
      jobTitle: input.designation || "Executive",
      designation: input.designation || "Executive",
      company: input.companyName || "Independent Client",
      companyName: input.companyName || "Independent Client",
      email: input.email || `${input.firstName.toLowerCase()}@client.me`,
      phone: input.phone || "+971 50 000 0000",
      status: input.status,
      isFavorite: false,
      tags: input.tags ? input.tags.split(",").map((t) => t.trim()) : ["New Profile"],
      assignedAgentName: input.assignedAgentName,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    initialContactsDataset.push(newContact);

    platformAuditLogger.log({
      action: "CREATE",
      entityType: "CONTACT",
      entityIds: [newContact.id],
      payload: { fullName },
      timestamp: new Date().toISOString(),
    });

    return newContact;
  },

  async updateContact(id: string, input: ContactFormInput): Promise<ContactEntity> {
    await new Promise((res) => setTimeout(res, 400));

    const fullName = `${input.firstName} ${input.lastName}`;
    const updatedContact: ContactEntity = {
      id,
      fullName,
      jobTitle: input.designation || "Executive",
      designation: input.designation || "Executive",
      company: input.companyName || "Independent Client",
      companyName: input.companyName || "Independent Client",
      email: input.email || "contact@client.me",
      phone: input.phone || "+971 50 000 0000",
      status: input.status,
      isFavorite: false,
      tags: input.tags ? input.tags.split(",").map((t) => t.trim()) : ["Updated Profile"],
      assignedAgentName: input.assignedAgentName,
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "CONTACT",
      entityIds: [id],
      payload: { fullName },
      timestamp: new Date().toISOString(),
    });

    return updatedContact;
  },
};
