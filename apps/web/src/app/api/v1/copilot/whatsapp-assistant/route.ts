import { NextResponse } from "next/server";
import { WhatsAppCopilotService } from "@/platform/copilot/WhatsAppCopilotService";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await request.json();
  const result = await WhatsAppCopilotService.processRequest(body);
  return NextResponse.json({ success: true, result });
}
