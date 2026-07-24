"use client";

import * as React from "react";
import { ContactsSummary } from "@/components/contacts/contacts-summary";
import { ContactsFilters } from "@/components/contacts/contacts-filters";
import { ContactsToolbar } from "@/components/contacts/contacts-toolbar";
import { ContactCard } from "@/components/contacts/contact-card";
import { ContactTable } from "@/components/contacts/contact-table";
import {
  ContactsLoading,
  ContactsEmptyState,
  ContactsErrorState,
} from "@/components/contacts/contacts-feedback";
import { initialContactsDataset, contactMockService } from "@/services/contact-mock-service";
import { ContactEntity, ContactFilterState } from "@/domain/contact/types";
import { toast } from "sonner";

const initialFilterState: ContactFilterState = {
  search: "",
  status: "",
  company: "",
  assignedAgent: "",
  tag: "",
};

export default function ContactsPage() {
  const [contactsList, setContactsList] = React.useState<ContactEntity[]>(initialContactsDataset);
  const [isLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<ContactFilterState>(initialFilterState);

  const handleFilterChange = (newFilters: Partial<ContactFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All contact filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing contacts directory...");
    try {
      const freshData = await contactMockService.getContacts(filters);
      setContactsList(freshData);
      toast.success("Contacts database updated");
    } catch {
      toast.error("Failed to refresh contacts.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== "").length;

  const filteredContacts = React.useMemo(() => {
    return contactsList.filter((cnt) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = cnt.fullName.toLowerCase().includes(query);
        const matchesEmail = cnt.email.toLowerCase().includes(query);
        const matchesPhone = cnt.phone.toLowerCase().includes(query);
        const matchesCompany = cnt.companyName.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCompany) return false;
      }
      if (filters.status && cnt.status !== filters.status) return false;
      if (filters.assignedAgent && cnt.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  }, [contactsList, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Contacts Directory Workspace</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Unified contact relationship directory, buyer profiles &amp; corporate clients
          </p>
        </div>
      </div>

      {/* Top Contact Portfolio KPI Summary */}
      <ContactsSummary contacts={filteredContacts} />

      {/* Filter Bar */}
      <ContactsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <ContactsToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Primary Contacts Display View (Grid / Table) */}
      {isLoading ? (
        <ContactsLoading />
      ) : isError ? (
        <ContactsErrorState onRetry={() => setIsError(false)} />
      ) : filteredContacts.length === 0 ? (
        <ContactsEmptyState onResetFilters={handleResetFilters} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onSelectContact={(c) => toast.info(`Viewing record for ${c.fullName}`)}
            />
          ))}
        </div>
      ) : (
        <ContactTable
          data={filteredContacts}
          onSelectContact={(c) => toast.info(`Viewing record for ${c.fullName}`)}
        />
      )}
    </div>
  );
}
