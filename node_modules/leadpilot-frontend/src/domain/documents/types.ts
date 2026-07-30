export type PermissionLevel = "READ" | "WRITE" | "ADMIN";

export type OCRStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface DocumentPermission {
  id: string;
  documentId: string;
  userId?: string;
  roleId?: string;
  permissionLevel: PermissionLevel;
  createdAt: string;
}

export interface DocumentTag {
  id: string;
  documentId: string;
  tagName: string;
  createdAt: string;
}

export interface DocumentMetadata {
  category?: string;
  confidentiality?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED";
  author?: string;
  keywords?: string[];
  customFields?: Record<string, unknown>;
}

export interface DocumentPreview {
  id: string;
  documentId: string;
  previewUrl: string;
  thumbnailUrl?: string;
  previewType: "IMAGE" | "PDF" | "TEXT";
  status: "PENDING" | "READY" | "FAILED";
  createdAt: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  storagePath: string;
  sizeBytes: number;
  checksum: string;
  uploadedBy: string;
  changeSummary?: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentFolderId?: string;
  ownerId: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  folderId?: string;
  ownerId: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  appointmentId?: string;
  taskId?: string;
  mimeType: string;
  storagePath: string;
  checksum: string;
  currentVersion: number;
  sizeBytes: number;
  metadata?: DocumentMetadata;
  ocrStatus: OCRStatus;
  ocrText?: string;
  summary?: string;
  versions?: DocumentVersion[];
  tags?: string[];
  permissions?: DocumentPermission[];
  previews?: DocumentPreview[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFilterState {
  search?: string;
  folderId?: string;
  ownerId?: string;
  contactId?: string;
  leadId?: string;
  dealId?: string;
  mimeType?: string;
  tag?: string;
}
