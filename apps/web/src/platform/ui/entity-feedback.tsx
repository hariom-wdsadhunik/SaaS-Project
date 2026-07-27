import * as React from "react";
import { FolderOpen, AlertCircle, RefreshCw, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EntityEmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  onResetFilters?: () => void;
}

export function EntityEmptyState({
  title = "No Records Found",
  description = "No domain entity records match your active query filters.",
  icon: Icon = FolderOpen,
  onResetFilters,
}: EntityEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 mb-3">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-zinc-400 mt-1 max-w-sm">{description}</p>
      {onResetFilters && (
        <Button size="sm" variant="outline" onClick={onResetFilters} className="mt-4 text-xs">
          Reset Query Filters
        </Button>
      )}
    </div>
  );
}

interface EntityErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function EntityErrorState({
  title = "Entity Service Error",
  description = "Failed to load records from platform service endpoint.",
  onRetry,
}: EntityErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 p-12 text-center my-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <p className="text-xs text-zinc-400 mt-1 max-w-sm">{description}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="mt-4 text-xs gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Query</span>
        </Button>
      )}
    </div>
  );
}
