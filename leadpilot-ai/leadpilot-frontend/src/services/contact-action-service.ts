import { ContactEntity, ContactStatus } from "@/domain/contact/types";
import { platformAuditLogger } from "@/platform/audit";

export const contactActionService = {
  async assignAgent(contactIds: string[], agentName: string): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: contactIds,
      payload: { agentName },
      timestamp: new Date().toISOString(),
    });
    return true;
  },

  async updateStatus(contactIds: string[], status: ContactStatus): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: contactIds,
      payload: { newStatus: status },
      timestamp: new Date().toISOString(),
    });
    return true;
  },

  async archiveContacts(contactIds: string[]): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 350));
    platformAuditLogger.log({
      action: "CHANGE_STATUS",
      entityType: "SYSTEM",
      entityIds: contactIds,
      payload: { count: contactIds.length },
      timestamp: new Date().toISOString(),
    });
    return true;
  },

  async deleteContacts(contactIds: string[]): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 400));
    platformAuditLogger.log({
      action: "DELETE",
      entityType: "SYSTEM",
      entityIds: contactIds,
      payload: { count: contactIds.length },
      timestamp: new Date().toISOString(),
    });
    return true;
  },

  async mergeContacts(sourceContactId: string, targetContactId: string): Promise<ContactEntity> {
    await new Promise((res) => setTimeout(res, 500));

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: [sourceContactId, targetContactId],
      payload: { mergedInto: targetContactId },
      timestamp: new Date().toISOString(),
    });

    return {
      id: targetContactId,
      fullName: "Merged Contact Profile",
      designation: "Executive",
      companyName: "Merged Enterprise",
      email: "merged@contact.ae",
      phone: "+971 50 999 0000",
      status: "ACTIVE",
      tags: ["Merged Record"],
      assignedAgentName: "Alex Morgan",
      lastActivity: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
  },
};
