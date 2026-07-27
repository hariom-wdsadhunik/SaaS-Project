import * as React from "react";
import { Pin, Search, StickyNote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/formatters";

export interface LeadNoteItem {
  id: string;
  authorName: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
}

const mockNotes: LeadNoteItem[] = [
  {
    id: "note-1",
    authorName: "Alex Morgan",
    content: "Client explicitly requested modern architectural design with high-end kitchen appliances. Willing to stretch budget to $1.6M for prime location.",
    isPinned: true,
    createdAt: "2026-07-22T14:30:00Z",
  },
  {
    id: "note-2",
    authorName: "Sarah Jenkins",
    content: "Spoke via WhatsApp. Prefers weekend site viewings due to work schedule.",
    isPinned: false,
    createdAt: "2026-07-21T10:15:00Z",
  },
];

export function LeadNotes() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredNotes = mockNotes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8 h-8 text-xs bg-zinc-950"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center">
          <StickyNote className="h-8 w-8 text-zinc-500 mb-2" />
          <p className="text-xs font-semibold text-zinc-300">No Notes Found</p>
          <p className="text-[11px] text-zinc-500">No notes recorded for this lead record.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={`p-3.5 border-zinc-800 bg-zinc-900/80 space-y-2 relative ${
                note.isPinned ? "border-indigo-500/30 bg-indigo-950/10" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">{note.authorName}</span>
                  {note.isPinned && (
                    <Badge variant="default" className="text-[9px] px-1.5 py-0 gap-1">
                      <Pin className="h-2.5 w-2.5" />
                      <span>Pinned</span>
                    </Badge>
                  )}
                </div>
                <span className="text-[10px] font-mono text-zinc-500">
                  {formatDate(note.createdAt)}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{note.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
