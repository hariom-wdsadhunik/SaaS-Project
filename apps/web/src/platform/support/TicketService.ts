import { Ticket, TicketPriority } from "@/domain/support/Ticket";

export class TicketService {
  private tickets: Ticket[] = [
    {
      id: "tkt_1001",
      organizationId: "org_default",
      userId: "usr_1001",
      subject: "API Rate Limit Clarification for Webhook Actions",
      description: "Need higher throughput limits for custom workflow triggers during sales blitz.",
      status: "open",
      priority: "high",
      assignedAgent: "Sarah Connor (Support Lead)",
      comments: [
        {
          id: "cmt_101",
          ticketId: "tkt_1001",
          authorName: "Sarah Connor",
          isStaff: true,
          content: "Looking into your organization throughput limits now.",
          createdAt: new Date(),
        },
      ],
      createdAt: new Date(Date.now() - 3600000),
      updatedAt: new Date(),
    },
  ];

  getTickets(organizationId: string): Ticket[] {
    return this.tickets.filter((t) => t.organizationId === organizationId);
  }

  createTicket(organizationId: string, userId: string, subject: string, description: string, priority: TicketPriority): Ticket {
    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      organizationId,
      userId,
      subject,
      description,
      status: "open",
      priority,
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tickets.push(newTicket);
    return newTicket;
  }
}
