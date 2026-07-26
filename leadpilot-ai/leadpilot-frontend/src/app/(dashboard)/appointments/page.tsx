"use client";

import * as React from "react";
import { AppointmentSummary } from "@/components/appointments/appointment-summary";
import { AppointmentFilters } from "@/components/appointments/appointment-filters";
import { AppointmentToolbar } from "@/components/appointments/appointment-toolbar";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { EntityEmptyState } from "@/platform/ui/entity-feedback";
import { AppointmentDrawer } from "@/components/appointments/drawer/appointment-drawer";
import { AppointmentModalForm } from "@/components/appointments/forms/appointment-modal-form";
import { AppointmentLifecycleFacade } from "@/domain/appointment/AppointmentLifecycleFacade";
import { AppointmentEntity, AppointmentFilterState } from "@/domain/appointment/types";
import { toast } from "sonner";

const initialFilterState: AppointmentFilterState = {
  search: "",
  status: "",
  priority: "",
  appointmentType: "",
  meetingType: "",
  assignedAgent: "",
  assignedTo: "",
};

export default function AppointmentsPage() {
  const [appointmentsList, setAppointmentsList] = React.useState<AppointmentEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<AppointmentFilterState>(initialFilterState);

  // Drawer & Form State
  const [selectedAppointment, setSelectedAppointment] = React.useState<AppointmentEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingAppointment, setEditingAppointment] = React.useState<AppointmentEntity | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    AppointmentLifecycleFacade.getAppointments(filters)
      .then((data) => {
        if (isMounted) {
          setAppointmentsList(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Failed to load appointments.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<AppointmentFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("Appointment filters reset");
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Refreshing appointments...");
    try {
      const freshData = await AppointmentLifecycleFacade.getAppointments(filters);
      setAppointmentsList(freshData);
      toast.success("Appointments updated");
    } catch {
      toast.error("Failed to refresh.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingAppointment(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (apt: AppointmentEntity) => {
    setFormMode("edit");
    setEditingAppointment(apt);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (apt: AppointmentEntity) => {
    if (formMode === "create") {
      setAppointmentsList((prev) => [apt, ...prev]);
    } else {
      setAppointmentsList((prev) => prev.map((a) => (a.id === apt.id ? apt : a)));
      if (selectedAppointment?.id === apt.id) {
        setSelectedAppointment(apt);
      }
    }
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "" && v !== undefined).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Appointments Directory</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized property viewings, client consultations &amp; contract execution bookings
          </p>
        </div>
      </div>

      {/* KPI Summary */}
      <AppointmentSummary appointments={appointmentsList} />

      {/* Filter Bar */}
      <AppointmentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <AppointmentToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={handleRefresh}
        onAddAppointment={handleOpenCreateModal}
        isRefreshing={isRefreshing}
      />

      {/* Main View Grid / Table */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 rounded-xl border border-zinc-800 bg-zinc-950/60" />
          ))}
        </div>
      ) : appointmentsList.length === 0 ? (
        <EntityEmptyState
          title="No Appointments Found"
          description="No appointments match your active query filters."
          onResetFilters={handleResetFilters}
        />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointmentsList.map((apt) => (
            <AppointmentCard
              key={apt.id}
              appointment={apt}
              onSelectAppointment={(selected) => {
                setSelectedAppointment(selected);
                setIsDrawerOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <AppointmentTable
          data={appointmentsList}
          onSelectAppointment={(selected) => {
            setSelectedAppointment(selected);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Appointment Drawer Workspace */}
      <AppointmentDrawer
        appointment={selectedAppointment}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedAppointment(null);
        }}
        onEdit={() => {
          if (selectedAppointment) {
            handleOpenEditModal(selectedAppointment);
          }
        }}
      />

      {/* Appointment Modal Form */}
      <AppointmentModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingAppointment}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
