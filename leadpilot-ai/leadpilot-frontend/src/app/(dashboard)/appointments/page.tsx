"use client";

import * as React from "react";
import { AppointmentSummary } from "@/components/appointments/appointment-summary";
import { AppointmentFilters } from "@/components/appointments/appointment-filters";
import { AppointmentToolbar } from "@/components/appointments/appointment-toolbar";
import { AppointmentCard } from "@/components/appointments/appointment-card";
import { AppointmentTable } from "@/components/appointments/appointment-table";
import { EntityEmptyState } from "@/platform/ui/entity-feedback";
import { appointmentService } from "@/domain/appointment/services/AppointmentService";
import { AppointmentEntity, AppointmentFilterState } from "@/domain/appointment/types";
import { toast } from "sonner";

const initialFilterState: AppointmentFilterState = {
  search: "",
  status: "",
  priority: "",
  appointmentType: "",
  assignedAgent: "",
};

export default function AppointmentsPage() {
  const [appointmentsList, setAppointmentsList] = React.useState<AppointmentEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<"grid" | "table">("grid");
  const [filters, setFilters] = React.useState<AppointmentFilterState>(initialFilterState);

  React.useEffect(() => {
    let isMounted = true;
    appointmentService
      .getAppointments(filters)
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
      const freshData = await appointmentService.getAppointments(filters);
      setAppointmentsList(freshData);
      toast.success("Appointments updated");
    } catch {
      toast.error("Failed to refresh.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

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
        onAddAppointment={() => toast.info("Book Appointment Modal Triggered")}
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
              onSelectAppointment={(selected) => toast.info(`Selected appointment: "${selected.title}"`)}
            />
          ))}
        </div>
      ) : (
        <AppointmentTable
          data={appointmentsList}
          onSelectAppointment={(selected) => toast.info(`Selected appointment: "${selected.title}"`)}
        />
      )}
    </div>
  );
}
