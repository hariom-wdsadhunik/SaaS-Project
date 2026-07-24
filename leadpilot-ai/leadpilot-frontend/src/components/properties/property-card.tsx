import * as React from "react";
import Image from "next/image";
import { MapPin, Bed, Bath, Maximize2, Eye, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PropertyEntity } from "@/domain/property/types";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";

interface PropertyCardProps {
  property: PropertyEntity;
  onSelectProperty?: (property: PropertyEntity) => void;
}

export function PropertyCard({ property, onSelectProperty }: PropertyCardProps) {
  const statusVariantMap = {
    AVAILABLE: "success",
    RESERVED: "warning",
    SOLD: "secondary",
    OFF_MARKET: "default",
  } as const;

  return (
    <Card
      onClick={() => onSelectProperty?.(property)}
      className="group rounded-2xl border-zinc-800/80 bg-zinc-900/90 hover:border-zinc-700/90 hover:bg-zinc-900 shadow-md overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between select-none"
    >
      {/* Property Cover Image & Badges */}
      <div className="relative h-48 w-full bg-zinc-950 overflow-hidden">
        <Image
          src={property.coverImageUrl}
          alt={property.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Top Badges Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <Badge variant={statusVariantMap[property.status]} className="text-[10px] px-2 py-0.5 shadow-md">
            {property.status}
          </Badge>
          <span className="text-[10px] font-mono font-bold text-white bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-full">
            {property.mlsId}
          </span>
        </div>

        {/* Bottom Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="text-base font-extrabold font-mono text-white bg-black/80 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-xl shadow-lg">
            {formatCurrency(property.price)}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-xs text-zinc-400 mt-1 line-clamp-1">
            <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>
              {property.address}, {property.city}
            </span>
          </div>
        </div>

        {/* Specs Bar */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-zinc-800/80 py-2.5 text-xs text-zinc-300">
          <div className="flex items-center gap-1.5 justify-center">
            <Bed className="h-3.5 w-3.5 text-indigo-400" />
            <span>{property.bedrooms > 0 ? `${property.bedrooms} Beds` : "N/A"}</span>
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

        {/* Footer: Agent & Quick Actions */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Avatar src={property.agentAvatarUrl} fallback={property.assignedAgentName[0]} size="sm" />
            <span className="text-xs text-zinc-400 font-mono line-clamp-1">
              {property.assignedAgentName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                toast.info(`Sharing listing link for ${property.title}`);
              }}
              className="h-7 w-7 p-0"
              title="Share Listing"
            >
              <Share2 className="h-3 w-3 text-zinc-400" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty?.(property);
              }}
              className="h-7 text-xs px-2 gap-1"
            >
              <Eye className="h-3 w-3 text-indigo-400" />
              <span>View</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
