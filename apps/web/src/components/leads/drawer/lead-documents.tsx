import * as React from "react";
import { FileText, Download, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/formatters";
import { toast } from "sonner";

export interface LeadDocumentItem {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  fileType: string;
}

const mockDocuments: LeadDocumentItem[] = [
  {
    id: "doc-1",
    name: "Downtown_Villa_Brochure_v2.pdf",
    size: "4.2 MB",
    uploadedAt: "2026-07-21T11:00:00Z",
    fileType: "PDF",
  },
  {
    id: "doc-2",
    name: "Buyer_Passport_Copy.pdf",
    size: "1.8 MB",
    uploadedAt: "2026-07-20T16:30:00Z",
    fileType: "PDF",
  },
];

export function LeadDocuments() {
  if (mockDocuments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center">
        <FileText className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-xs font-semibold text-zinc-300">No Documents Uploaded</p>
        <p className="text-[11px] text-zinc-500">No contracts or attachments found for this lead.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mockDocuments.map((doc) => (
        <Card key={doc.id} className="p-3 border-zinc-800 bg-zinc-900/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
              <FileText className="h-4 w-4" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{doc.name}</p>
              <p className="text-[10px] text-zinc-400 font-mono">
                {doc.size} • {formatDate(doc.uploadedAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.info(`Previewing ${doc.name}`)}
              className="h-7 w-7 p-0"
              title="Preview File"
            >
              <Eye className="h-3.5 w-3.5 text-zinc-300" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => toast.success(`Downloading ${doc.name}`)}
              className="h-7 w-7 p-0"
              title="Download File"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
