import { NextResponse } from "next/server";
import { supabaseDocumentRepository } from "@/infrastructure/repositories/SupabaseDocumentRepository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const folderId = searchParams.get("folderId") || undefined;
  const contactId = searchParams.get("contactId") || undefined;

  const results = await supabaseDocumentRepository.search({ search: q, folderId, contactId });
  return NextResponse.json({ version: "v1", success: true, count: results.length, data: results });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ version: "v1", success: false, error: "Missing document id" }, { status: 400 });
  }

  const deleted = await supabaseDocumentRepository.delete(id);
  return NextResponse.json({ version: "v1", success: deleted, documentId: id });
}
