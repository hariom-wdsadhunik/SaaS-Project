"use client";

import * as React from "react";
import { PropertiesSummary } from "@/components/properties/properties-summary";
import { PropertiesFilters } from "@/components/properties/properties-filters";
import { PropertiesToolbar } from "@/components/properties/properties-toolbar";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyTable } from "@/components/properties/property-table";
import {
  PropertiesLoading,
  PropertiesEmptyState,
  PropertiesErrorState,
} from "@/components/properties/properties-feedback";
import { PropertyDrawer } from "@/components/properties/drawer/property-drawer";
import { PropertyModalForm } from "@/components/properties/forms/property-modal-form";
import { PropertyConfirmationDialog } from "@/components/properties/actions/property-action-dialogs";
import { PropertyStatusAssignModal } from "@/components/properties/actions/property-status-assign-modal";
import { initialPropertiesDataset, propertyMockService } from "@/services/property-mock-service";
import { PropertyEntity, PropertyFilterState } from "@/domain/property/types";
import { toast } from "sonner";

const initialFilterState: PropertyFilterState = {
  search: "",
  propertyType: "",
  status: "",
  city: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  assignedAgent: "",
};

export default function PropertiesPage() {
  const [propertiesList, setPropertiesList] = React.useState<PropertyEntity[]>(initialPropertiesDataset);
  const [isLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<PropertyFilterState>(initialFilterState);

  // Drawer State
  const [selectedProperty, setSelectedProperty] = React.useState<PropertyEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Modal Form State
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingProperty, setEditingProperty] = React.useState<PropertyEntity | null>(null);

  // Action Modals State
  const [confirmDialog, setConfirmDialog] = React.useState<{
    isOpen: boolean;
    type: "DELETE" | "ARCHIVE";
  }>({ isOpen: false, type: "DELETE" });

  const [assignStatusModal, setAssignStatusModal] = React.useState<{
    isOpen: boolean;
    mode: "ASSIGN" | "STATUS";
  }>({ isOpen: false, mode: "ASSIGN" });

  const [isActionProcessing] = React.useState(false);

  const handleFilterChange = (newFilters: Partial<PropertyFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("All inventory filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing property inventory...");
    try {
      const freshData = await propertyMockService.getProperties(filters);
      setPropertiesList(freshData);
      toast.success("Inventory catalog updated");
    } catch {
      toast.error("Failed to refresh inventory.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingProperty(null);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (property: PropertyEntity) => {
    if (formMode === "create") {
      setPropertiesList((prev) => [property, ...prev]);
    } else {
      setPropertiesList((prev) => prev.map((p) => (p.id === property.id ? property : p)));
    }
  };

  // Keyboard shortcut `C` for Create Property
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

  const filteredProperties = React.useMemo(() => {
    return propertiesList.filter((prop) => {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = prop.title.toLowerCase().includes(query);
        const matchesAddress = prop.address.toLowerCase().includes(query);
        const matchesCity = prop.city.toLowerCase().includes(query);
        const matchesMls = prop.mlsId.toLowerCase().includes(query);
        if (!matchesTitle && !matchesAddress && !matchesCity && !matchesMls) return false;
      }
      if (filters.propertyType && prop.propertyType !== filters.propertyType) return false;
      if (filters.status && prop.status !== filters.status) return false;
      if (filters.assignedAgent && prop.assignedAgentName !== filters.assignedAgent) return false;
      return true;
    });
  }, [propertiesList, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Properties Inventory Workspace</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real estate inventory management, listing statuses &amp; catalog metrics
          </p>
        </div>
      </div>

      {/* Top Portfolio KPI Summary */}
      <PropertiesSummary properties={filteredProperties} />

      {/* Filter Bar */}
      <PropertiesFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <PropertiesToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        onAddProperty={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Primary Inventory Display View (Grid / Table) */}
      {isLoading ? (
        <PropertiesLoading />
      ) : isError ? (
        <PropertiesErrorState onRetry={() => setIsError(false)} />
      ) : filteredProperties.length === 0 ? (
        <PropertiesEmptyState onResetFilters={handleResetFilters} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
                setIsDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <PropertyTable
          data={filteredProperties}
          onSelectProperty={(prop) => {
            setSelectedProperty(prop);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Property Details Drawer Workspace */}
      <PropertyDrawer
        property={selectedProperty}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedProperty(null);
        }}
      />

      {/* Create / Edit Property Modal Form */}
      <PropertyModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingProperty}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Single / Bulk Delete & Archive Confirmation Dialog */}
      <PropertyConfirmationDialog
        isOpen={confirmDialog.isOpen}
        type={confirmDialog.type}
        itemCount={1}
        isProcessing={isActionProcessing}
        onConfirm={() => {
          toast.success(`Action executed successfully.`);
          setConfirmDialog((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Single / Bulk Assign & Status Change Modal */}
      <PropertyStatusAssignModal
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
