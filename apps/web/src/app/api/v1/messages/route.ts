import { NextResponse } from "next/server";
import { supabaseCommunicationRepository } from "@/infrastructure/repositories/SupabaseCommunicationRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  const results = await supabaseCommunicationRepository.searchMessages(query);
  return NextResponse.json({ version: "v1", success: true, count: results.length, data: results });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = await supabaseCommunicationRepository.sendMessage(body);
    return NextResponse.json({ version: "v1", success: true, data: message }, { status: 201 });
  } catch {
    return NextResponse.json({ version: "v1", success: false, error: "Failed to send message" }, { status: 400 });
  }
}
