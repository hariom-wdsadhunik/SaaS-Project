import { NextResponse } from "next/server";
import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const doc = await supabaseDocumentRepository.upload({
      name: body.name || "Uploaded_Document.pdf",
      folderId: body.folderId,
      ownerId: body.ownerId || "agent-001",
      contactId: body.contactId,
      leadId: body.leadId,
      dealId: body.dealId,
      mimeType: body.mimeType || "application/pdf",
      sizeBytes: body.sizeBytes || 102400,
      content: body.content || "Mock Upload Stream Payload",
    });

    return NextResponse.json({ version: "v1", success: true, data: doc }, { status: 201 });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to upload document";
    return NextResponse.json({ version: "v1", success: false, error: errMessage }, { status: 400 });
  }
}
