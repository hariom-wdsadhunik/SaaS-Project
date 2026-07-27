import * as React from "react";
import { Layers, AlertTriangle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function DealsLoading() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-72 shrink-0 space-y-3 p-3 rounded-2xl border border-zinc-800 bg-zinc-950/60">
          <Skeleton className="h-8 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

export function DealsEmptyState({ onResetFilters }: { onResetFilters: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-4">
        <Layers className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-white">No Deals Matching Criteria</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
        No active pipeline deals match your search query or filter parameters.
      </p>
      <Button size="sm" variant="outline" onClick={onResetFilters} className="text-xs">
        Reset All Filters
      </Button>
    </div>
  );
}

export function DealsErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-red-200">Failed to Load Pipeline Deals</h3>
      <p className="text-xs text-zinc-400 max-w-sm mt-1 mb-4">
        An error occurred while fetching deal records from the backend API.
      </p>
      <Button size="sm" variant="secondary" onClick={onRetry} className="text-xs gap-1.5">
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
