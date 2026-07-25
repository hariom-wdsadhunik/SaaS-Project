import * as React from "react";
import { Badge } from "@/components/ui/badge";

export type BadgeVariant = "default" | "secondary" | "success" | "warning" | "danger" | "outline" | "ai";

interface EntityStatusBadgeProps {
  status: string;
  variantMap?: Record<string, BadgeVariant>;
  className?: string;
}

export function EntityStatusBadge({
  status,
  variantMap,
  className = "text-[10px] uppercase font-mono tracking-wider",
}: EntityStatusBadgeProps) {
  const defaultMap: Record<string, BadgeVariant> = {
    ACTIVE: "secondary",
    NEW: "indigo" as unknown as BadgeVariant,
    QUALIFIED: "success",
    WIN: "success",
    AVAILABLE: "success",
    CLIENT: "success",
    PROSPECT: "warning",
    RESERVED: "warning",
    VIP: "danger",
    LOST: "danger",
    SOLD: "secondary",
    OFF_MARKET: "default",
    INACTIVE: "default",
  };

  const map = variantMap || defaultMap;
  const variant = map[status] || "default";

  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
