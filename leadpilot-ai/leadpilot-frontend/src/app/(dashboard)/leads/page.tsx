"use client";

import * as React from "react";
import { LeadStatsSummary } from "@/components/leads/lead-stats-summary";
import { LeadFilters, LeadFilterState } from "@/components/leads/lead-filters";
import { LeadToolbar } from "@/components/leads/lead-toolbar";
import { LeadTable } from "@/components/leads/lead-table";
import { BulkActionBar } from "@/components/leads/bulk-action-bar";
import { LeadDrawer } from "@/components/leads/drawer/lead-drawer";
import { LeadModalForm } from "@/components/leads/forms/lead-modal-form";
import {
  LeadItem,
  LeadLoadingSkeleton,
  LeadEmptyState,
  LeadErrorState,
  LeadCardMobile,
} from "@/components/leads/lead-feedback";
import { toast } from "sonner";

const initialLeadDataset: LeadItem[] = [
  {
    id: "ld-101",
    fullName: "John Doe",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    email: "john.doe@example.com",
    phone: "+1 (555) 234-5678",
    source: "WhatsApp Business API",
    status: "QUALIFIED",
    aiPropensityScore: 88,
    budgetMin: 1000000,
    budgetMax: 1500000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-20T10:30:00Z",
  },
  {
    id: "ld-102",
    fullName: "Sarah Jenkins",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    email: "sarah.jenkins@agency.io",
    phone: "+1 (555) 876-5432",
    source: "Meta / IG Lead Ads",
    status: "NEW",
    aiPropensityScore: 64,
    budgetMin: 750000,
    budgetMax: 900000,
    assignedBrokerName: "Sarah Jenkins",
    createdAt: "2026-07-21T14:15:00Z",
  },
  {
    id: "ld-103",
    fullName: "Alexander Montgomery-Wellington III",
    email: "alexander.wellington.investments@estate-corp.com",
    phone: "+1 (555) 999-0011",
    source: "Client Referrals",
    status: "QUALIFIED",
    aiPropensityScore: 94,
    budgetMin: 2500000,
    budgetMax: 4000000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-22T09:00:00Z",
  },
  {
    id: "ld-104",
    fullName: "Michael Chen",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    email: "m.chen@techholdings.com",
    phone: "+1 (555) 444-3322",
    source: "Website Webhook",
    status: "CONTACTED",
    aiPropensityScore: 72,
    budgetMin: 1200000,
    budgetMax: 1800000,
    assignedBrokerName: "Michael Chen",
    createdAt: "2026-07-22T11:45:00Z",
  },
  {
    id: "ld-105",
    fullName: "Emily Watson",
    email: "emily.watson@designstudio.org",
    phone: "+1 (555) 111-2233",
    source: "Meta / IG Lead Ads",
    status: "NURTURING",
    aiPropensityScore: 52,
    budgetMin: 500000,
    budgetMax: 700000,
    assignedBrokerName: "Unassigned",
    createdAt: "2026-07-23T08:20:00Z",
  },
  {
    id: "ld-106",
    fullName: "David Miller",
    email: "dmiller@construction.net",
    phone: "+1 (555) 666-7788",
    source: "WhatsApp Business API",
    status: "LOST",
    aiPropensityScore: 28,
    budgetMin: 400000,
    budgetMax: 600000,
    assignedBrokerName: "Michael Chen",
    createdAt: "2026-07-18T16:00:00Z",
  },
  {
    id: "ld-107",
    fullName: "Jessica Taylor",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    email: "jtaylor@luxuryhomes.com",
    phone: "+1 (555) 333-8899",
    source: "Client Referrals",
    status: "QUALIFIED",
    aiPropensityScore: 82,
    budgetMin: 1800000,
    budgetMax: 2200000,
    assignedBrokerName: "Alex Morgan",
    createdAt: "2026-07-23T15:30:00Z",
  },
];

const initialFilterState: LeadFilterState = {
  search: "",
  status: "",
  source: "",
  agent: "",
  budgetMin: "",
};

export default function LeadsPage() {
  const [leadsList, setLeadsList] = React.useState<LeadItem[]>(initialLeadDataset);
  const [isLoading] = React.useState(false);
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

  const handleFilterChange = (newFilters: Partial<LeadFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All lead filters reset");
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast.info("Syncing lead catalogue...");
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Lead database updated");
    }, 600);
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

  // Keyboard shortcut `C` for Create Lead
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "c" || e.key === "C") &&
        !isFormModalOpen &&
        !isDrawerOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        handleOpenCreateModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFormModalOpen, isDrawerOpen]);

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

  const selectedCount = Object.keys(selectedRowIds).filter((key) => selectedRowIds[key]).length;

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
        <LeadErrorState onRetry={() => setIsError(false)} />
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
    </div>
  );
}
