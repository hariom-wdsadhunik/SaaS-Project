"use client";

import * as React from "react";
import { LeadStatsSummary } from "@/components/leads/lead-stats-summary";
import { LeadFilters, LeadFilterState } from "@/components/leads/lead-filters";
import { LeadToolbar } from "@/components/leads/lead-toolbar";
import { LeadTable } from "@/components/leads/lead-table";
import { BulkActionBar } from "@/components/leads/bulk-action-bar";
import { LeadDrawer } from "@/components/leads/drawer/lead-drawer";
import { LeadModalForm } from "@/components/leads/forms/lead-modal-form";
import { LeadConfirmationDialog } from "@/components/leads/actions/lead-action-dialogs";
import { LeadStatusAssignModal } from "@/components/leads/actions/lead-status-assign-modal";
import { supabaseLeadRepository } from "@/services/supabase-lead-repository";
import {
  LeadItem,
  LeadLoadingSkeleton,
  LeadEmptyState,
  LeadErrorState,
  LeadCardMobile,
} from "@/components/leads/lead-feedback";
import { toast } from "sonner";

const initialFilterState: LeadFilterState = {
  search: "",
  status: "",
  source: "",
  agent: "",
  budgetMin: "",
};

export default function LeadsPage() {
  const [leadsList, setLeadsList] = React.useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [density, setDensity] = React.useState<"compact" | "standard" | "spacious">("standard");
  const [filters, setFilters] = React.useState<LeadFilterState>(initialFilterState);
  const [selectedRowIds, setSelectedRowIds] = React.useState<Record<string, boolean>>({});

  // Drawer & Modal State
  const [selectedLead, setSelectedLead] = React.useState<LeadItem | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingLead, setEditingLead] = React.useState<LeadItem | null>(null);

  // Bulk / Action Modals State
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    type: "DELETE" | "ARCHIVE";
  }>({ isOpen: false, type: "DELETE" });

  const [assignStatusModal, setAssignStatusModal] = React.useState<{
    isOpen: boolean;
    mode: "ASSIGN" | "STATUS";
  }>({ isOpen: false, mode: "ASSIGN" });

  const [isActionProcessing, setIsActionProcessing] = React.useState(false);

  // Fetch leads from Supabase repository via async effect
  React.useEffect(() => {
    let isMounted = true;
    supabaseLeadRepository
      .getLeads(filters)
      .then((data) => {
        if (isMounted) {
          setLeadsList(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsError(true);
          toast.error("Failed to load leads from Supabase repository.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<LeadFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All lead filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Syncing lead catalogue...");
    try {
      const data = await supabaseLeadRepository.getLeads(filters);
      setLeadsList(data);
      toast.success("Lead database updated");
    } catch {
      toast.error("Failed to refresh leads.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingLead(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (lead: LeadItem) => {
    if (formMode === "create") {
      setLeadsList((prev) => [lead, ...prev]);
    } else {
      setLeadsList((prev) => prev.map((l) => (l.id === lead.id ? lead : l)));
    }
  };

  // Extract selected IDs list
  const selectedLeadIds = React.useMemo(() => {
    return Object.keys(selectedRowIds).filter((id) => selectedRowIds[id]);
  }, [selectedRowIds]);

  const selectedCount = selectedLeadIds.length;

  // Execute Action Handlers
  const handleConfirmAction = async () => {
    setIsActionProcessing(true);
    try {
      if (confirmDialog.type === "DELETE") {
        await supabaseLeadRepository.bulkDeleteLeads(selectedLeadIds);
        setLeadsList((prev) => prev.filter((l) => !selectedRowIds[l.id]));
        toast.success(`Successfully deleted ${selectedCount} lead record(s)`);
      } else {
        await supabaseLeadRepository.bulkDeleteLeads(selectedLeadIds);
        setLeadsList((prev) => prev.filter((l) => !selectedRowIds[l.id]));
        toast.success(`Successfully archived ${selectedCount} lead record(s)`);
      }
      setSelectedRowIds({});
      setConfirmDialog({ isOpen: false, type: "DELETE" });
    } catch {
      toast.error("Failed to execute action.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleApplyStatusOrAssign = async (val: string) => {
    setIsActionProcessing(true);
    try {
      if (assignStatusModal.mode === "ASSIGN") {
        await Promise.all(selectedLeadIds.map((id) => supabaseLeadRepository.assignBroker(id, val)));
        setLeadsList((prev) =>
          prev.map((l) =>
            selectedRowIds[l.id] ? { ...l, assignedBrokerName: val } : l
          )
        );
        toast.success(`Assigned ${selectedCount} lead(s) to ${val}`);
      } else {
        await Promise.all(
          selectedLeadIds.map((id) =>
            supabaseLeadRepository.changeStatus(id, val as LeadItem["status"])
          )
        );
        setLeadsList((prev) =>
          prev.map((l) =>
            selectedRowIds[l.id]
              ? { ...l, status: val as LeadItem["status"] }
              : l
          )
        );
        toast.success(`Updated status to ${val} for ${selectedCount} lead(s)`);
      }
      setSelectedRowIds({});
      setAssignStatusModal({ isOpen: false, mode: "ASSIGN" });
    } catch {
      toast.error("Failed to execute status update.");
    } finally {
      setIsActionProcessing(false);
    }
  };

  // Keyboard shortcut `C` for Create Lead
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

  const filteredLeads = React.useMemo(() => {
    return leadsList.filter((lead) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = lead.fullName.toLowerCase().includes(query);
        const matchesEmail = lead.email.toLowerCase().includes(query);
        const matchesPhone = lead.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }
      if (filters.status && lead.status !== filters.status) return false;
      if (filters.source && lead.source !== filters.source) return false;
      if (filters.agent && lead.assignedBrokerName !== filters.agent) return false;
      return true;
    });
  }, [leadsList, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Lead Management Workspace</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Capture, qualify, and auto-assign real estate buyer &amp; seller inquiries
          </p>
        </div>
      </div>

      {/* Top Stats Summary */}
      <LeadStatsSummary />

      {/* Multi-attribute Filter Bar */}
      <LeadFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar Controls */}
      <LeadToolbar
        density={density}
        onDensityChange={setDensity}
        onRefresh={handleRefresh}
        onAddLead={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Primary Data View Surface */}
      {isLoading ? (
        <LeadLoadingSkeleton />
      ) : isError ? (
        <LeadErrorState onRetry={handleRefresh} />
      ) : filteredLeads.length === 0 ? (
        <LeadEmptyState onResetFilters={handleResetFilters} />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <LeadTable
              data={filteredLeads}
              density={density}
              selectedRowIds={selectedRowIds}
              onRowSelectionChange={setSelectedRowIds}
              onSelectLead={(lead) => {
                setSelectedLead(lead);
                setIsDrawerOpen(true);
              }}
            />
          </div>

          {/* Mobile Card Grid View */}
          <div className="block md:hidden space-y-3">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => {
                  setSelectedLead(lead);
                  setIsDrawerOpen(true);
                }}
                className="cursor-pointer"
              >
                <LeadCardMobile lead={lead} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Floating Bulk Action Bar */}
      <BulkActionBar
        selectedCount={selectedCount}
        onClearSelection={() => setSelectedRowIds({})}
        onBulkAssign={() => setAssignStatusModal({ isOpen: true, mode: "ASSIGN" })}
        onBulkStatus={() => setAssignStatusModal({ isOpen: true, mode: "STATUS" })}
        onBulkExport={() => toast.success(`Exporting ${selectedCount} leads to CSV`)}
        onBulkArchive={() => setConfirmDialog({ isOpen: true, type: "ARCHIVE" })}
        onBulkDelete={() => setConfirmDialog({ isOpen: true, type: "DELETE" })}
      />

      {/* Slide-over Lead Details Drawer */}
      <LeadDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
      />

      {/* Create / Edit Lead Modal Form */}
      <LeadModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingLead}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Single / Bulk Delete & Archive Confirmation Dialog */}
      <LeadConfirmationDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        itemCount={selectedCount}
        isProcessing={isActionProcessing}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Single / Bulk Assign & Status Change Modal */}
      <LeadStatusAssignModal
        isOpen={assignStatusModal.isOpen}
        mode={assignStatusModal.mode}
        itemCount={selectedCount}
        isProcessing={isActionProcessing}
        onConfirm={handleApplyStatusOrAssign}
        onClose={() => setAssignStatusModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
