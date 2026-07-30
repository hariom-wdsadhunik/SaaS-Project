import * as React from "react";
import { X, Building, MapPin, DollarSign, Bed, Bath, Maximize2, Share2, PhoneCall, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { PropertyEntity } from "@/domain/property/types";
import { toast } from "sonner";

interface PropertyDrawerHeaderProps {
  property: PropertyEntity;
  onClose: () => void;
}

export function PropertyDrawerHeader({ property, onClose }: PropertyDrawerHeaderProps) {
  const statusVariantMap = {
    AVAILABLE: "success",
    RESERVED: "warning",
    SOLD: "secondary",
    OFF_MARKET: "default",
  } as const;

  return (
    <div className="border-b border-zinc-800/80 bg-zinc-950 p-6 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>MLS ID: {property.mlsId}</span>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          title="Close Drawer (Esc)"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Title & Valuation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">{property.title}</h2>
            <Badge variant={statusVariantMap[property.status]} className="text-[10px]">
              {property.status}
            </Badge>
          </div>
          <p className="text-xs text-zinc-400 flex items-center gap-1">
            <MapPin className="h-3 w-3 text-zinc-500 shrink-0" />
            <span>
              {property.address}, {property.city}
            </span>
          </p>
        </div>

        {/* Valuation Badge */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <DollarSign className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-emerald-300 tracking-wider">
              Listing Price
            </span>
            <div className="text-lg font-extrabold font-mono text-white leading-none">
              {formatCurrency(property.price)}
            </div>
          </div>
        </div>
      </div>

      {/* Property Specs Bar */}
      <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-800/80 py-2.5 text-xs text-zinc-300">
        <div className="flex items-center gap-1.5 justify-center">
          <Bed className="h-3.5 w-3.5 text-indigo-400" />
          <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : "Commercial"}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center border-l border-r border-zinc-800">
          <Bath className="h-3.5 w-3.5 text-indigo-400" />
          <span>{property.bathrooms} Baths</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center">
          <Maximize2 className="h-3.5 w-3.5 text-indigo-400" />
          <span>{property.areaSqFt.toLocaleString()} sqft</span>
        </div>
      </div>

      {/* Quick Action Triggers */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Sharing listing link for ${property.title}`)}
            className="h-8 text-xs gap-1.5"
          >
            <Share2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Share Listing</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Calling assigned agent ${property.assignedAgentName}`)}
            className="h-8 text-xs gap-1.5"
          >
            <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
            <span>Call Agent</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast.info(`Email inquiry generated for ${property.title}`)}
            className="h-8 text-xs gap-1.5"
          >
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>Inquire</span>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar src={property.agentAvatarUrl} fallback={property.assignedAgentName[0]} size="sm" />
          <span className="text-xs text-zinc-300 font-mono hidden sm:inline">
            {property.assignedAgentName}
          </span>
        </div>
      </div>
    </div>
  );
}
