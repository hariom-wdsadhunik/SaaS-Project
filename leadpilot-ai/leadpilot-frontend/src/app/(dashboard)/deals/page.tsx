"use client";

import * as React from "react";
import { DealsSummary } from "@/components/deals/deals-summary";
import { DealsFilters, DealFilterState } from "@/components/deals/deals-filters";
import { DealsToolbar } from "@/components/deals/deals-toolbar";
import { DealsBoard } from "@/components/deals/deals-board";
import { DealsLoading, DealsEmptyState, DealsErrorState } from "@/components/deals/deals-feedback";
import { DealDrawer } from "@/components/deals/drawer/lead-drawer";
import { DealModalForm } from "@/components/deals/forms/lead-modal-form";
import { DealConfirmationDialog } from "@/components/deals/actions/deal-action-dialogs";
import { DealStatusAssignModal } from "@/components/deals/actions/deal-status-assign-modal";
import { supabaseDealRepository } from "@/infrastructure/repositories/SupabaseDealRepository";
import { DealItem, DealStage } from "@/services/deal-mock-service";
import { toast } from "sonner";

const initialFilterState: DealFilterState = {
  search: "",
  stage: "",
  agent: "",
  priority: "",
};

export default function DealsPage() {
  const [dealsList, setDealsList] = React.useState<DealItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [filters, setFilters] = React.useState<DealFilterState>(initialFilterState);

  // Drawer State
  const [selectedDeal, setSelectedDeal] = React.useState<DealItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingDeal, setEditingDeal] = React.useState<DealItem | null>(null);

  // Action Modals State
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    type: "DELETE" | "ARCHIVE";
  }>({ isOpen: false, type: "DELETE" });

  const [assignStatusModal, setAssignStatusModal] = React.useState<{
    isOpen: boolean;
    mode: "ASSIGN" | "STAGE";
  }>({ isOpen: false, mode: "ASSIGN" });

  const [isActionProcessing, setIsActionProcessing] = React.useState(false);

  // Fetch deals from Supabase repository
  React.useEffect(() => {
    let isMounted = true;
    supabaseDealRepository
      .getDeals(filters)
      .then((data) => {
        if (isMounted) {
          setDealsList(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
          toast.error("Failed to load deals from Supabase repository.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<DealFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All deal filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Syncing deal pipeline...");
    try {
      const data = await supabaseDealRepository.getDeals(filters);
      setDealsList(data);
      toast.success("Pipeline database updated");
    } catch {
      toast.error("Failed to refresh deal pipeline.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingDeal(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (deal: DealItem) => {
    if (formMode === "create") {
      setDealsList((prev) => [deal, ...prev]);
    } else {
      setDealsList((prev) => prev.map((d) => (d.id === deal.id ? deal : d)));
    }
  };

  const handleDealStageChange = async (dealId: string, newStage: DealStage, newProbability: number) => {
    // Optimistic UI update
    setDealsList((prev) =>
      prev.map((d) =>
        d.id === dealId ? { ...d, stage: newStage, probability: newProbability } : d
      )
    );

    try {
      await supabaseDealRepository.changeStage(dealId, newStage, newProbability);
      toast.success(`Deal moved to ${newStage}`);
    } catch {
      toast.error("Failed to update deal stage in database.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeal) return;
    setIsActionProcessing(true);
    try {
      await supabaseDealRepository.deleteDeal(selectedDeal.id);
      setDealsList((prev) => prev.filter((d) => d.id !== selectedDeal.id));
      toast.success(`Deal "${selectedDeal.title}" deleted.`);
      setConfirmDialog({ isOpen: false, type: "DELETE" });
      setSelectedDeal(null);
    } catch {
      toast.error("Failed to delete deal.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  // Keyboard shortcut `C` for Create Deal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "c" || e.key === "C") &&
        !isFormModalOpen &&
        !isDrawerOpen &&
        !confirmDialog.isOpen &&
        !assignStatusModal.isOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        handleOpenCreateModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormModalOpen, isDrawerOpen, confirmDialog, assignStatusModal]);

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Deals Pipeline Workspace</h1>
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
      <DealsToolbar
        onRefresh={handleRefresh}
        onAddDeal={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Primary Kanban Surface */}
      {isLoading ? (
        <DealsLoading />
      ) : isError ? (
        <DealsErrorState onRetry={handleRefresh} />
      ) : filteredDeals.length === 0 ? (
        <DealsEmptyState onResetFilters={handleResetFilters} />
      ) : (
        <DealsBoard
          deals={filteredDeals}
          onDealStageChange={handleDealStageChange}
          onSelectDeal={(deal) => {
            setSelectedDeal(deal);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Deal Details Drawer Workspace */}
      <DealDrawer
        deal={selectedDeal}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedDeal(null);
        }}
      />

      {/* Create / Edit Deal Modal Form */}
      <DealModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingDeal}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Single / Bulk Delete & Archive Confirmation Dialog */}
      <DealConfirmationDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        itemCount={1}
        isProcessing={isActionProcessing}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Single / Bulk Assign & Stage Change Modal */}
      <DealStatusAssignModal
        isOpen={assignStatusModal.isOpen}
        mode={assignStatusModal.mode}
        itemCount={1}
        isProcessing={isActionProcessing}
        onConfirm={(val) => {
          toast.success(`Applied ${assignStatusModal.mode} action: ${val}`);
          setAssignStatusModal((prev) => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setAssignStatusModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
