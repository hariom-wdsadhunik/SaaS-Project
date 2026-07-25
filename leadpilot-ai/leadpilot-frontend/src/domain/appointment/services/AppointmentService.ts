import { AppointmentEntity, AppointmentFilterState } from "../types";
import { platformAuditLogger } from "@/platform/audit";

export const initialAppointmentsDataset: AppointmentEntity[] = [
  {
    id: "apt-101",
    title: "VIP Penthouse Private Viewing",
    description: "Private viewing tour for HNW buyer Marcus Vance.",
    customerName: "Marcus Vance",
    propertyName: "Marina Bay Sky Villa #45-02",
    assignedAgentName: "Alex Morgan",
    start: "2026-07-26T10:00:00Z",
    end: "2026-07-26T11:30:00Z",
    status: "CONFIRMED",
    priority: "URGENT",
    appointmentType: "PROPERTY_VIEWING",
    source: "Direct Referral",
    createdAt: "2026-07-25T10:00:00Z",
    updatedAt: "2026-07-25T10:00:00Z",
  },
  {
    id: "apt-102",
    title: "Conveyancing Contract Signing",
    description: "Legal closing and document execution for Beachfront Villa sale.",
    customerName: "Eleanor Sterling",
    propertyName: "Beachfront Villa #12",
    assignedAgentName: "Sarah Jenkins",
    start: "2026-07-26T14:00:00Z",
    end: "2026-07-26T15:00:00Z",
    status: "SCHEDULED",
    priority: "HIGH",
    appointmentType: "CONTRACT_SIGNING",
    source: "Inbound Lead",
    createdAt: "2026-07-25T10:00:00Z",
    updatedAt: "2026-07-25T10:00:00Z",
  },
  {
    id: "apt-103",
    title: "Listing Representation Consultation",
    description: "Property assessment and valuation consultation for prospective seller.",
    customerName: "David Kim",
    propertyName: "Downtown Executive Loft #8B",
    assignedAgentName: "Michael Chen",
    start: "2026-07-27T11:00:00Z",
    end: "2026-07-27T12:00:00Z",
    status: "CHECKED_IN",
    priority: "MEDIUM",
    appointmentType: "LISTING_PRESENTATION",
    source: "Website Form",
    createdAt: "2026-07-25T10:00:00Z",
    updatedAt: "2026-07-25T10:00:00Z",
  },
];

export const appointmentService = {
  async getAppointments(filters?: Partial<AppointmentFilterState>): Promise<AppointmentEntity[]> {
    await new Promise((res) => setTimeout(res, 200));

    platformAuditLogger.log({
      action: "UPDATE",
      entityType: "SYSTEM",
      entityIds: ["appointments-list"],
      payload: { filters },
      timestamp: new Date().toISOString(),
    });

    if (!filters) return initialAppointmentsDataset;

    return initialAppointmentsDataset.filter((apt) => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesTitle = apt.title.toLowerCase().includes(q);
        const matchesCustomer = apt.customerName.toLowerCase().includes(q);
        const matchesProperty = apt.propertyName.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCustomer && !matchesProperty) return false;
      }
      if (filters.status && apt.status !== filters.status) return false;
      if (filters.priority && apt.priority !== filters.priority) return false;
      if (filters.appointmentType && apt.appointmentType !== filters.appointmentType) return false;
      if (filters.assignedAgent && apt.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  },
};
