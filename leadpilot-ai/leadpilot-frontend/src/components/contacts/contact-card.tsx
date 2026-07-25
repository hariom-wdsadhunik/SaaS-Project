import * as React from "react";
import { Building, Mail, Phone, Clock, MessageSquare, PhoneCall } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ContactEntity } from "@/domain/contact/types";
import { formatDate } from "@/utils/formatters";
import { toast } from "sonner";

interface ContactCardProps {
  contact: ContactEntity;
  onSelectContact?: (contact: ContactEntity) => void;
}

export const ContactCard = React.memo(function ContactCard({
  contact,
  onSelectContact,
}: ContactCardProps) {
  const statusVariantMap = {
    VIP: "danger",
    CLIENT: "success",
    PROSPECT: "warning",
    ACTIVE: "secondary",
    INACTIVE: "default",
  } as const;

  return (
    <Card
      onClick={() => onSelectContact?.(contact)}
      className="group rounded-2xl border-zinc-800/80 bg-zinc-900/90 hover:border-zinc-700/90 hover:bg-zinc-900 shadow-md p-4 space-y-3 cursor-pointer flex flex-col justify-between transition-all select-none"
    >
      {/* Top Header: Avatar, Name, Status Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar src={contact.avatarUrl} fallback={contact.fullName[0]} size="md" />
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
              {contact.fullName}
            </h3>
            <span className="text-[11px] text-zinc-400 line-clamp-1">{contact.designation}</span>
          </div>
        </div>

        <Badge variant={statusVariantMap[contact.status]} className="text-[9px] px-2 py-0.5 shrink-0">
          {contact.status}
        </Badge>
      </div>

      {/* Middle Info: Company & Channels */}
      <div className="border-t border-b border-zinc-800/80 py-2.5 space-y-1.5 text-xs text-zinc-300">
        <div className="flex items-center gap-2 text-zinc-400">
          <Building className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
          <span className="font-semibold text-zinc-200 line-clamp-1">{contact.companyName}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-0.5">
          <div className="flex items-center gap-1.5 truncate">
            <Mail className="h-3 w-3 text-zinc-500 shrink-0" />
            <span className="truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Phone className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>{contact.phone}</span>
          </div>
        </div>
      </div>

      {/* Tags Bar */}
      <div className="flex flex-wrap items-center gap-1">
        {contact.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-zinc-800/80 border border-zinc-700/50 px-1.5 py-0.5 text-[9px] font-mono text-zinc-300"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer: Broker Agent & Quick Triggers */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
          <Clock className="h-3 w-3 text-zinc-500" />
          <span>{formatDate(contact.lastActivity)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Opening WhatsApp chat for ${contact.fullName}`);
            }}
            className="h-7 w-7 p-0"
            title="WhatsApp Chat"
          >
            <MessageSquare className="h-3 w-3 text-indigo-400" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              toast.info(`Calling ${contact.fullName}`);
            }}
            className="h-7 w-7 p-0"
            title="Call Contact"
          >
            <PhoneCall className="h-3 w-3 text-emerald-400" />
          </Button>
        </div>
      </div>
    </Card>
  );
});
