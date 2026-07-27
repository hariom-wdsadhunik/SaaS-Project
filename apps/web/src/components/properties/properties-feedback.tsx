import * as React from "react";
import { Building, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PropertiesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-72 rounded-2xl border border-zinc-800 bg-zinc-950/60" />
      ))}
    </div>
  );
}

export function PropertiesEmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
        <Building className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white">No Properties Found</h3>
      <p className="text-xs text-zinc-400 mt-1 max-w-sm">
        No real estate inventory records match your active query filters.
      </p>
      <Button size="sm" variant="outline" onClick={onResetFilters} className="mt-4 text-xs">
        Reset Query Filters
      </Button>
    </div>
  );
}

export function PropertiesErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white">Inventory Query Failure</h3>
      <p className="text-xs text-zinc-400 mt-1 max-w-sm">
        Failed to fetch real estate inventory catalog records from service endpoint.
      </p>
      <Button size="sm" variant="outline" onClick={onRetry} className="mt-4 text-xs gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Retry Query</span>
      </Button>
    </div>
  );
}
