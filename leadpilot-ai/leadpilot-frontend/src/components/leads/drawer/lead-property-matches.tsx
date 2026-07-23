import * as React from "react";
import { Building2, Sparkles, MapPin, Bed, Bath, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/formatters";
import { toast } from "sonner";

export interface PropertyMatchItem {
  id: string;
  title: string;
  matchScore: number; // 0 - 100
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
}

const mockMatches: PropertyMatchItem[] = [
  {
    id: "prop-101",
    title: "Downtown Palm Luxury Villa #04",
    matchScore: 96,
    price: 1350000,
    location: "Downtown Palm Boulevard",
    bedrooms: 3,
    bathrooms: 4,
    sqft: 2850,
  },
  {
    id: "prop-102",
    title: "Marina Penthouse Horizon",
    matchScore: 84,
    price: 1480000,
    location: "Marina Tower 2",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2600,
  },
];

export function LeadPropertyMatches() {
  if (mockMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 p-8 text-center">
        <Building2 className="h-8 w-8 text-zinc-500 mb-2" />
        <p className="text-xs font-semibold text-zinc-300">No Matched Properties</p>
        <p className="text-[11px] text-zinc-500">AI search engine did not find matching inventory.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {mockMatches.map((item) => (
        <Card key={item.id} className="p-3.5 border-zinc-800 bg-zinc-900/80 space-y-2.5">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">{item.title}</h4>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                <MapPin className="h-3 w-3 text-zinc-500" />
                <span>{item.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-300 font-mono shrink-0">
              <Sparkles className="h-3 w-3 text-violet-400" />
              <span>{item.matchScore}% Match</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
            <div className="font-mono font-bold text-indigo-400">{formatCurrency(item.price)}</div>
            <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
              <span className="flex items-center gap-1">
                <Bed className="h-3 w-3 text-zinc-500" />
                {item.bedrooms} Beds
              </span>
              <span className="flex items-center gap-1">
                <Bath className="h-3 w-3 text-zinc-500" />
                {item.bathrooms} Baths
              </span>
              <span>{item.sqft} sqft</span>
            </div>
          </div>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.info(`Viewing ${item.title} details`)}
            className="w-full h-7 text-xs gap-1"
          >
            <span>Inspect Property Inventory</span>
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
