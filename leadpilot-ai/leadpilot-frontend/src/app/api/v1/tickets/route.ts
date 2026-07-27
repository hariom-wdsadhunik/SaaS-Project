import { NextResponse } from "next/server";
import { TicketService } from "@/platform/support/TicketService";

export const dynamic = "force-dynamic";

export async function GET() {
  const service = new TicketService();
  const tickets = service.getTickets("org_default");
  return NextResponse.json({ success: true, tickets });
}

export async function POST(request: Request) {
  const body = await request.json();
  const service = new TicketService();
  const ticket = service.createTicket(
    body.organizationId || "org_default",
    body.userId || "usr_default",
    body.subject || "Support Inquiry",
    body.description || "",
    body.priority || "medium"
  );

  return NextResponse.json({ success: true, ticket });
}
