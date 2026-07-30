import { ActivityEvent, ResourceDomain } from "./OrganizationTypes";

export class ActivityLogger {
  private static mockEvents: ActivityEvent[] = [
    {
      id: "act-101",
      organizationId: "org-1",
      userId: "usr-1",
      userName: "Alex Morgan",
      action: "Created new lead Metro Commercial Group",
      objectType: "Leads",
      objectId: "lead-101",
      objectTitle: "Metro Commercial Group",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "act-102",
      organizationId: "org-1",
      userId: "usr-2",
      userName: "Sarah Jenkins",
      action: "Moved deal Downtown Plaza to Closing Stage",
      objectType: "Deals",
      objectId: "deal-201",
      objectTitle: "Downtown Plaza Acquisition",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
      id: "act-103",
      organizationId: "org-1",
      userId: "usr-1",
      userName: "Alex Morgan",
      action: "Invited Marcus Vance to organization as Agent",
      objectType: "Team",
      objectId: "inv-301",
      objectTitle: "marcus@leadpilot.ai",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
  ];

  public static async getActivities(orgId: string = "org-1"): Promise<ActivityEvent[]> {
    return this.mockEvents.filter((e) => e.organizationId === orgId);
  }

  public static async logActivity(
    orgId: string,
    userId: string,
    userName: string,
    action: string,
    objectType: ResourceDomain,
    objectId: string,
    objectTitle: string
  ): Promise<ActivityEvent> {
    const event: ActivityEvent = {
      id: `act-${Date.now()}`,
      organizationId: orgId,
      userId,
      userName,
      action,
      objectType,
      objectId,
      objectTitle,
      timestamp: new Date().toISOString(),
    };
    this.mockEvents.unshift(event);
    return event;
  }
}
