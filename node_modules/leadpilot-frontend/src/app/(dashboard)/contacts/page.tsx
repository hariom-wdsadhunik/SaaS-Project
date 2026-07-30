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
import { ContactDrawer } from "@/components/contacts/drawer/contact-drawer";
import { ContactModalForm } from "@/components/contacts/forms/contact-modal-form";
import { ContactConfirmationDialog } from "@/components/contacts/actions/contact-action-dialogs";
import { ContactStatusAssignModal } from "@/components/contacts/actions/contact-status-assign-modal";
import { supabaseContactRepository } from "@/infrastructure/repositories/SupabaseContactRepository";
import { ContactEntity, ContactFilterState, ContactStatus } from "@/domain/contact/types";
import { toast } from "sonner";

const initialFilterState: ContactFilterState = {
  search: "",
  status: "",
  company: "",
  assignedAgent: "",
  tag: "",
  isFavorite: undefined,
};

export default function ContactsPage() {
  const [contactsList, setContactsList] = React.useState<ContactEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<ContactFilterState>(initialFilterState);

  // Drawer State
  const [selectedContact, setSelectedContact] = React.useState<ContactEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Modal Form State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingContact, setEditingContact] = React.useState<ContactEntity | null>(null);

  // Action Dialog States
  const [actionDialog, setActionDialog] = React.useState<{
    isOpen: boolean;
    type: "delete" | "archive";
    contactId?: string;
    contactName?: string;
  }>({ isOpen: false, type: "delete" });

  const [assignModal, setAssignModal] = React.useState<{
    isOpen: boolean;
    mode: "status" | "agent";
    contactId?: string;
  }>({ isOpen: false, mode: "status" });

  const [isActionProcessing, setIsActionProcessing] = React.useState(false);

  // Fetch contacts from Supabase repository
  React.useEffect(() => {
    let isMounted = true;
    supabaseContactRepository
      .getContacts(filters)
      .then((data) => {
        if (isMounted) {
          setContactsList(data);
          setIsLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setIsError(true);
          const msg = err instanceof Error ? err.message : "Failed to load contacts";
          toast.error(msg);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

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
      const freshData = await supabaseContactRepository.getContacts(filters);
      setContactsList(freshData);
      toast.success("Contacts database updated");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to refresh contacts";
      toast.error(msg);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingContact(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (contact: ContactEntity) => {
    if (formMode === "create") {
      setContactsList((prev) => [contact, ...prev]);
    } else {
      setContactsList((prev) => prev.map((c) => (c.id === contact.id ? contact : c)));
    }
  };

  const handleToggleFavorite = async (contact: ContactEntity) => {
    const nextFavorite = !contact.isFavorite;
    // Optimistic UI update
    setContactsList((prev) =>
      prev.map((c) => (c.id === contact.id ? { ...c, isFavorite: nextFavorite } : c))
    );

    try {
      await supabaseContactRepository.favoriteContact(contact.id, nextFavorite);
      toast.success(
        nextFavorite
          ? `Marked ${contact.fullName} as Favorite`
          : `Removed ${contact.fullName} from Favorites`
      );
    } catch (err: unknown) {
      // Rollback optimistic update
      setContactsList((prev) =>
        prev.map((c) => (c.id === contact.id ? { ...c, isFavorite: contact.isFavorite } : c))
      );
      const msg = err instanceof Error ? err.message : "Failed to update favorite status";
      toast.error(msg);
    }
  };

  const handleConfirmAction = async () => {
    if (!actionDialog.contactId) return;
    setIsActionProcessing(true);
    try {
      if (actionDialog.type === "delete") {
        await supabaseContactRepository.deleteContact(actionDialog.contactId);
        setContactsList((prev) => prev.filter((c) => c.id !== actionDialog.contactId));
        toast.success(`Contact record deleted.`);
      } else {
        await supabaseContactRepository.archiveContact(actionDialog.contactId);
        setContactsList((prev) =>
          prev.map((c) =>
            c.id === actionDialog.contactId ? { ...c, status: "ARCHIVED" } : c
          )
        );
        toast.success(`Contact record archived.`);
      }
      setActionDialog({ isOpen: false, type: "delete" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Action failed";
      toast.error(msg);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const handleConfirmAssign = async (val: string) => {
    if (!assignModal.contactId) return;
    setIsActionProcessing(true);
    try {
      if (assignModal.mode === "status") {
        const contact = contactsList.find((c) => c.id === assignModal.contactId);
        if (contact) {
          await supabaseContactRepository.updateContact(contact.id, {
            firstName: contact.fullName.split(" ")[0] || contact.fullName,
            lastName: contact.fullName.split(" ").slice(1).join(" ") || "",
            email: contact.email,
            phone: contact.phone,
            status: val as ContactStatus,
            assignedAgentName: contact.assignedAgentName,
            companyName: contact.company || contact.companyName,
            designation: contact.jobTitle || contact.designation,
          });
          setContactsList((prev) =>
            prev.map((c) => (c.id === assignModal.contactId ? { ...c, status: val as ContactStatus } : c))
          );
          toast.success(`Contact status updated to ${val}.`);
        }
      }
      setAssignModal({ isOpen: false, mode: "status" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Assignment failed";
      toast.error(msg);
    } finally {
      setIsActionProcessing(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((val) => val !== "" && val !== undefined).length;

  const filteredContacts = React.useMemo(() => {
    return contactsList.filter((cnt) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = cnt.fullName.toLowerCase().includes(query);
        const matchesEmail = cnt.email.toLowerCase().includes(query);
        const matchesPhone = cnt.phone.toLowerCase().includes(query);
        const matchesCompany = (cnt.company || cnt.companyName || "").toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesCompany) return false;
      }
      if (filters.status && cnt.status !== filters.status) return false;
      if (filters.assignedAgent && cnt.assignedAgentName !== filters.assignedAgent) return false;
      if (filters.tag && !cnt.tags.includes(filters.tag)) return false;
      if (filters.isFavorite !== undefined && cnt.isFavorite !== filters.isFavorite) return false;
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
        onAddContact={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Primary Contacts Display View (Grid / Table) */}
      {isLoading ? (
        <ContactsLoading />
      ) : isError ? (
        <ContactsErrorState onRetry={handleRefresh} />
      ) : filteredContacts.length === 0 ? (
        <ContactsEmptyState onResetFilters={handleResetFilters} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onSelectContact={(c) => {
                setSelectedContact(c);
                setIsDrawerOpen(true);
              }}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <ContactTable
          data={filteredContacts}
          onSelectContact={(c) => {
            setSelectedContact(c);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Contact Details Drawer Workspace */}
      <ContactDrawer
        contact={selectedContact}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedContact(null);
        }}
      />

      {/* Create / Edit Contact Modal Form */}
      <ContactModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingContact}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Action Dialogs */}
      <ContactConfirmationDialog
        isOpen={actionDialog.isOpen}
        actionType={actionDialog.type}
        contactCount={1}
        contactName={actionDialog.contactName}
        onConfirm={handleConfirmAction}
        onClose={() => setActionDialog({ isOpen: false, type: "delete" })}
        isProcessing={isActionProcessing}
      />

      <ContactStatusAssignModal
        isOpen={assignModal.isOpen}
        mode={assignModal.mode}
        contactCount={1}
        onConfirm={handleConfirmAssign}
        onClose={() => setAssignModal({ isOpen: false, mode: "status" })}
        isProcessing={isActionProcessing}
      />
    </div>
  );
}
