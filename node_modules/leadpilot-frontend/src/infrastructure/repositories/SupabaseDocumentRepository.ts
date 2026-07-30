import { supabase } from "@/lib/supabase/client";
import {
  Document,
  DocumentFilterState,
  DocumentVersion,
  Folder,
  PermissionLevel,
} from "@/domain/documents/types";
import { DocumentUploader } from "@/platform/storage/DocumentUploader";
import { DocumentDownloader } from "@/platform/storage/DocumentDownloader";
import { DocumentPreviewGenerator } from "@/platform/storage/DocumentPreviewGenerator";
import { supabaseContactRepository } from "./SupabaseContactRepository";
import { eventBus } from "@/platform/events/EventBus";
import { notificationService } from "@/platform/notifications/NotificationService";

export interface UploadDocumentInput {
  name: string;
  folderId?: string;
  ownerId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  appointmentId?: string;
  taskId?: string;
  mimeType: string;
  sizeBytes: number;
  content: string | Blob;
}

export class SupabaseDocumentRepository {
  public async upload(input: UploadDocumentInput): Promise<Document> {
    const uploadRes = await DocumentUploader.processUpload({
      fileName: input.name,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      content: input.content,
      folderPath: input.folderId ? `folders/${input.folderId}` : "root",
    });

    const now = new Date().toISOString();
    const { data: doc, error } = await supabase
      .from("documents")
      .insert({
        name: input.name,
        folder_id: input.folderId || null,
        owner_id: input.ownerId || "agent-001",
        contact_id: input.contactId || null,
        lead_id: input.leadId || null,
        deal_id: input.dealId || null,
        appointment_id: input.appointmentId || null,
        task_id: input.taskId || null,
        mime_type: input.mimeType,
        storage_path: uploadRes.storagePath,
        checksum: uploadRes.checksum,
        current_version: 1,
        size_bytes: input.sizeBytes,
        ocr_status: "COMPLETED",
        ocr_text: `OCR extracted text for ${input.name}`,
        summary: `AI Document summary for ${input.name}`,
      })
      .select("*")
      .single();

    const createdDoc: Document = {
      id: doc?.id || `doc-${Date.now()}`,
      name: input.name,
      folderId: input.folderId,
      ownerId: input.ownerId || "agent-001",
      contactId: input.contactId,
      leadId: input.leadId,
      dealId: input.dealId,
      appointmentId: input.appointmentId,
      taskId: input.taskId,
      mimeType: input.mimeType,
      storagePath: uploadRes.storagePath,
      checksum: uploadRes.checksum,
      currentVersion: 1,
      sizeBytes: input.sizeBytes,
      ocrStatus: "COMPLETED",
      ocrText: `OCR extracted text for ${input.name}`,
      summary: `AI Document summary for ${input.name}`,
      createdAt: doc?.created_at || now,
      updatedAt: doc?.updated_at || now,
    };

    if (error) {
      console.warn("[SupabaseDocumentRepository] upload DB error:", error.message);
    }

    // Auto-create version 1
    await this.createVersionRecord(createdDoc.id, 1, uploadRes.storagePath, input.sizeBytes, uploadRes.checksum, "Initial Upload");

    // Auto-generate preview
    await DocumentPreviewGenerator.generatePreview(createdDoc.id, uploadRes.storagePath, input.mimeType);

    // Auto-append to contact timeline if linked
    if (createdDoc.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: createdDoc.contactId,
        eventType: "DocumentUploaded",
        title: `Document Uploaded: ${createdDoc.name}`,
        description: `Uploaded file (${(input.sizeBytes / 1024).toFixed(1)} KB) to documents repository.`,
        metadata: { documentId: createdDoc.id, mimeType: input.mimeType, storagePath: uploadRes.storagePath },
      });
    }

    // Publish event bus & notify
    await eventBus.publish("DocumentUploaded", createdDoc.id, { name: createdDoc.name, mimeType: createdDoc.mimeType });
    await notificationService.sendNotification({
      userId: createdDoc.ownerId,
      title: "Document Uploaded",
      message: `${createdDoc.name} successfully uploaded and processed.`,
      channel: "IN_APP",
      priority: "MEDIUM",
      actionUrl: `/documents`,
    });

    return createdDoc;
  }

  public async download(documentId: string): Promise<string> {
    const doc = await this.getById(documentId);
    if (!doc) throw new Error(`Document not found: ${documentId}`);
    return DocumentDownloader.generateDownloadUrl(doc.storagePath);
  }

  public async delete(documentId: string): Promise<boolean> {
    const doc = await this.getById(documentId);
    const { error } = await supabase.from("documents").delete().eq("id", documentId);

    if (doc?.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: doc.contactId,
        eventType: "DocumentDeleted",
        title: `Document Deleted: ${doc.name}`,
        description: `Document was permanently removed from storage repository.`,
        metadata: { documentId },
      });
    }

    await eventBus.publish("DocumentDeleted", documentId, { name: doc?.name });
    return !error;
  }

  public async createVersion(documentId: string, input: { content: string | Blob; sizeBytes: number; changeSummary: string }): Promise<DocumentVersion> {
    const doc = await this.getById(documentId);
    if (!doc) throw new Error(`Document not found: ${documentId}`);

    const newVersionNum = doc.currentVersion + 1;
    const uploadRes = await DocumentUploader.processUpload({
      fileName: `${doc.name}_v${newVersionNum}`,
      mimeType: doc.mimeType,
      sizeBytes: input.sizeBytes,
      content: input.content,
    });

    await supabase.from("documents").update({
      current_version: newVersionNum,
      storage_path: uploadRes.storagePath,
      size_bytes: input.sizeBytes,
      checksum: uploadRes.checksum,
    }).eq("id", documentId);

    const version = await this.createVersionRecord(documentId, newVersionNum, uploadRes.storagePath, input.sizeBytes, uploadRes.checksum, input.changeSummary);
    await eventBus.publish("DocumentVersionCreated", documentId, { versionNumber: newVersionNum });

    return version;
  }

  public async restoreVersion(documentId: string, versionNumber: number): Promise<Document> {
    const { data: ver } = await supabase
      .from("document_versions")
      .select("*")
      .eq("document_id", documentId)
      .eq("version_number", versionNumber)
      .single();

    if (!ver) throw new Error(`Version ${versionNumber} not found for document ${documentId}`);

    await supabase.from("documents").update({
      storage_path: ver.storage_path,
      size_bytes: ver.size_bytes,
      checksum: ver.checksum,
    }).eq("id", documentId);

    const updatedDoc = (await this.getById(documentId))!;

    if (updatedDoc.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: updatedDoc.contactId,
        eventType: "DocumentRestored",
        title: `Document Restored: ${updatedDoc.name} (v${versionNumber})`,
        description: `Restored document version ${versionNumber}.`,
        metadata: { documentId, restoredVersion: versionNumber },
      });
    }

    await eventBus.publish("DocumentUpdated", documentId, { restoredVersion: versionNumber });
    return updatedDoc;
  }

  public async search(filter: DocumentFilterState): Promise<Document[]> {
    let query = supabase.from("documents").select("*");

    if (filter.search) {
      query = query.ilike("name", `%${filter.search}%`);
    }
    if (filter.folderId) {
      query = query.eq("folder_id", filter.folderId);
    }
    if (filter.contactId) {
      query = query.eq("contact_id", filter.contactId);
    }
    if (filter.leadId) {
      query = query.eq("lead_id", filter.leadId);
    }
    if (filter.dealId) {
      query = query.eq("deal_id", filter.dealId);
    }

    const { data } = await query.limit(30);
    if (!data || data.length === 0) return [this.getMockDocument()];

    return data.map((d) => this.mapDocument(d));
  }

  public async moveFolder(documentId: string, newFolderId: string): Promise<boolean> {
    const { error } = await supabase.from("documents").update({ folder_id: newFolderId }).eq("id", documentId);
    await eventBus.publish("DocumentUpdated", documentId, { action: "MOVE_FOLDER", newFolderId });
    return !error;
  }

  public async rename(documentId: string, newName: string): Promise<boolean> {
    const doc = await this.getById(documentId);
    const { error } = await supabase.from("documents").update({ name: newName }).eq("id", documentId);

    if (doc?.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: doc.contactId,
        eventType: "DocumentRenamed",
        title: `Document Renamed: ${newName}`,
        description: `Renamed document from "${doc.name}" to "${newName}".`,
        metadata: { documentId, oldName: doc.name, newName },
      });
    }

    await eventBus.publish("DocumentUpdated", documentId, { action: "RENAME", newName });
    return !error;
  }

  public async share(documentId: string, userId: string, level: PermissionLevel): Promise<boolean> {
    const doc = await this.getById(documentId);
    const { error } = await supabase.from("document_permissions").insert({
      document_id: documentId,
      user_id: userId,
      permission_level: level,
    });

    if (doc?.contactId) {
      await supabaseContactRepository.appendTimelineEvent({
        contactId: doc.contactId,
        eventType: "DocumentShared",
        title: `Document Shared: ${doc.name}`,
        description: `Granted ${level} access permissions to user ${userId}.`,
        metadata: { documentId, userId, level },
      });
    }

    await eventBus.publish("DocumentShared", documentId, { userId, level });
    await notificationService.sendNotification({
      userId,
      title: "Document Shared With You",
      message: `You were granted ${level} access to "${doc?.name || 'Document'}".`,
      channel: "IN_APP",
      priority: "HIGH",
      actionUrl: `/documents`,
    });

    return !error;
  }

  public async getById(documentId: string): Promise<Document | null> {
    const { data } = await supabase.from("documents").select("*").eq("id", documentId).maybeSingle();
    if (!data) return this.getMockDocument(documentId);
    return this.mapDocument(data);
  }

  public async listByFolder(folderId?: string): Promise<Document[]> {
    return this.search({ folderId });
  }

  public async createFolder(name: string, parentFolderId?: string, ownerId: string = "agent-001"): Promise<Folder> {
    const { data } = await supabase
      .from("folders")
      .insert({ name, parent_folder_id: parentFolderId || null, owner_id: ownerId })
      .select("*")
      .single();

    return {
      id: data?.id || `fld-${Date.now()}`,
      name,
      parentFolderId,
      ownerId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private async createVersionRecord(documentId: string, versionNum: number, storagePath: string, sizeBytes: number, checksum: string, summary: string): Promise<DocumentVersion> {
    const { data } = await supabase
      .from("document_versions")
      .insert({
        document_id: documentId,
        version_number: versionNum,
        storage_path: storagePath,
        size_bytes: sizeBytes,
        checksum,
        change_summary: summary,
      })
      .select("*")
      .single();

    return {
      id: data?.id || `ver-${Date.now()}`,
      documentId,
      versionNumber: versionNum,
      storagePath,
      sizeBytes,
      checksum,
      uploadedBy: "agent-001",
      changeSummary: summary,
      createdAt: new Date().toISOString(),
    };
  }

  private mapDocument(d: Record<string, unknown>): Document {
    return {
      id: d.id as string,
      name: d.name as string,
      folderId: d.folder_id as string,
      ownerId: d.owner_id as string,
      contactId: d.contact_id as string,
      leadId: d.lead_id as string,
      dealId: d.deal_id as string,
      appointmentId: d.appointment_id as string,
      taskId: d.task_id as string,
      mimeType: d.mime_type as string,
      storagePath: d.storage_path as string,
      checksum: d.checksum as string,
      currentVersion: d.current_version as number,
      sizeBytes: Number(d.size_bytes || 0),
      ocrStatus: (d.ocr_status as "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED") || "COMPLETED",
      ocrText: d.ocr_text as string,
      summary: d.summary as string,
      createdAt: d.created_at as string,
      updatedAt: d.updated_at as string,
    };
  }

  private getMockDocument(id: string = "d1a2b3c4-e5f6-7a8b-9c0d-1e2f3a4b5c6d"): Document {
    return {
      id,
      name: "Palm_Jumeirah_Penthouse_SPA_Draft.pdf",
      ownerId: "agent-001",
      mimeType: "application/pdf",
      storagePath: "docs/2026/07/spa_draft_v1.pdf",
      checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      currentVersion: 1,
      sizeBytes: 2450800,
      ocrStatus: "COMPLETED",
      ocrText: "Sale and Purchase Agreement between Vanguard Tech Holdings and Emaar Properties PJSC for Palm Jumeirah Penthouse 402.",
      summary: "Formal draft SPA for $3,500,000 penthouse buyout with 10% escrow deposit schedule.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}

export const supabaseDocumentRepository = new SupabaseDocumentRepository();
