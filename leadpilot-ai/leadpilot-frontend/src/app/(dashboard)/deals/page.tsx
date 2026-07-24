"use client";

import * as React from "react";
import { DealsSummary } from "@/components/deals/deals-summary";
import { DealsFilters, DealFilterState } from "@/components/deals/deals-filters";
import { DealsToolbar } from "@/components/deals/deals-toolbar";
import { DealsBoard } from "@/components/deals/deals-board";
import { DealsLoading, DealsEmptyState, DealsErrorState } from "@/components/deals/deals-feedback";
import { initialDealsDataset, DealItem, DealStage } from "@/services/deal-mock-service";
import { toast } from "sonner";

const initialFilterState: DealFilterState = {
  search: "",
  stage: "",
  agent: "",
  priority: "",
};

export default function DealsPage() {
  const [dealsList, setDealsList] = React.useState<DealItem[]>(initialDealsDataset);
  const [isLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [filters, setFilters] = React.useState<DealFilterState>(initialFilterState);

  const handleFilterChange = (newFilters: Partial<DealFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All deal filters reset");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Refreshing deal pipeline...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Pipeline updated");
    }, 500);
  };

  const handleDealStageChange = (dealId: string, newStage: DealStage) => {
    setDealsList((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
    );
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== "").length;

  const filteredDeals = React.useMemo(() => {
    return dealsList.filter((deal) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = deal.title.toLowerCase().includes(query);
        const matchesCompany = deal.companyName.toLowerCase().includes(query);
        const matchesContact = deal.contactName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesCompany && !matchesContact) return false;
      }
      if (filters.stage && deal.stage !== filters.stage) return false;
      if (filters.agent && deal.assignedAgentName !== filters.agent) return false;
      if (filters.priority && deal.priority !== filters.priority) return false;
      return true;
    });
  }, [dealsList, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Deals Pipeline</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual Kanban management for active real estate acquisitions &amp; sales negotiations
          </p>
        </div>
      </div>

      {/* Top Pipeline KPI Summary */}
      <DealsSummary deals={filteredDeals} />

      {/* Filter Bar */}
      <DealsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <DealsToolbar onRefresh={handleRefresh} isRefreshing={isRefreshing} />

      {/* Primary Kanban Surface */}
      {isLoading ? (
        <DealsLoading />
      ) : isError ? (
        <DealsErrorState onRetry={() => setIsError(false)} />
      ) : filteredLeadsLengthZeroCheck(filteredDeals) ? (
        <DealsEmptyState onResetFilters={handleResetFilters} />
      ) : (
        <DealsBoard deals={filteredDeals} onDealStageChange={handleDealStageChange} />
      )}
    </div>
  );
}

function filteredLeadsLengthZeroCheck(deals: DealItem[]) {
  return deals.length === 0;
}
