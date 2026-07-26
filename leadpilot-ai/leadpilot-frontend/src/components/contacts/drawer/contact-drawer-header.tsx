import * as React from "react";
import { X, Building, Mail, Phone, MessageSquare, PhoneCall } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContactEntity } from "@/domain/contact/types";
import { toast } from "sonner";

interface ContactDrawerHeaderProps {
  contact: ContactEntity;
  onClose: () => void;
}

export function ContactDrawerHeader({ contact, onClose }: ContactDrawerHeaderProps) {
  const statusVariantMap = {
    VIP: "danger",
    CLIENT: "success",
    PROSPECT: "warning",
    ACTIVE: "secondary",
    ARCHIVED: "secondary",
    INACTIVE: "default",
  } as const;

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>{contact.companyName}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Close Drawer (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Identity & Status */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={contact.avatarUrl} fallback={contact.fullName[0]} size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{contact.fullName}</h2>
              <Badge variant={statusVariantMap[contact.status]} className="text-[10px]">
                {contact.status}
              </Badge>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {contact.designation} • {contact.companyName}
            </p>
          </div>
        </div>
      </div>

      {/* Communication Contacts */}
      <div className="flex flex-wrap items-center gap-3 border-t border-b border-zinc-800/80 py-2.5 text-xs text-zinc-300 font-mono">
        <div className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5 text-indigo-400" />
          <span>{contact.email}</span>
        </div>
        <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
          <Phone className="h-3.5 w-3.5 text-indigo-400" />
          <span>{contact.phone}</span>
        </div>
      </div>

      {/* Quick Action Triggers */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`WhatsApp chat opened for ${contact.fullName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
            <span>WhatsApp</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Initiating call to ${contact.fullName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span>Call</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Email composer opened for ${contact.fullName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>Email</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar src={contact.agentAvatarUrl} fallback={contact.assignedAgentName[0]} size="sm" />
          <span className="text-xs text-zinc-300 font-mono hidden sm:inline">
            {contact.assignedAgentName}
          </span>
        </div>
      </div>
    </div>
  );
}
