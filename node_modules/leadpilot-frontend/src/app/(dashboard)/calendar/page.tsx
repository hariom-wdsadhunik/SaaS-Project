"use client";

import * as React from "react";
import { CalendarSummary } from "@/components/calendar/calendar-summary";
import { CalendarFilters } from "@/components/calendar/calendar-filters";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { EntityEmptyState } from "@/platform/ui/entity-feedback";
import { CalendarDrawer } from "@/components/calendar/drawer/calendar-drawer";
import { CalendarModalForm } from "@/components/calendar/forms/calendar-modal-form";
import { CalendarSchedulingFacade } from "@/domain/calendar/CalendarSchedulingFacade";
import { CalendarEventEntity, CalendarFilterState, CalendarViewMode } from "@/domain/calendar/types";
import { toast } from "sonner";

const initialFilterState: CalendarFilterState = {
  search: "",
  eventType: "",
  priority: "",
  status: "",
  assignedAgent: "",
};

export default function CalendarPage() {
  const [eventsList, setEventsList] = React.useState<CalendarEventEntity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [viewMode, setViewMode] = React.useState<CalendarViewMode>("month");
  const [filters, setFilters] = React.useState<CalendarFilterState>(initialFilterState);

  // Drawer & Form State
  const [selectedEvent, setSelectedEvent] = React.useState<CalendarEventEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = React.useState<CalendarEventEntity | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    CalendarSchedulingFacade.getEvents(filters)
      .then((data) => {
        if (isMounted) {
          setEventsList(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          toast.error("Failed to load calendar events.");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<CalendarFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilterState);
    toast.info("Calendar filters reset");
  };

  const handleOpenCreateModal = () => {
    setFormMode("create");
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (evt: CalendarEventEntity) => {
    setFormMode("edit");
    setEditingEvent(evt);
    setIsFormModalOpen(true);
  };

  const handleFormSuccess = (evt: CalendarEventEntity) => {
    if (formMode === "create") {
      setEventsList((prev) => [evt, ...prev]);
    } else {
      setEventsList((prev) => prev.map((e) => (e.id === evt.id ? evt : e)));
    }
  };

  const activeFilterCount = Object.values(filters).filter((v) => v !== "").length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Calendar &amp; Scheduling Agenda</h1>
          <p className="text-xs text-zinc-400 mt-1">
            Centralized schedule for property walkthroughs, client meetings, tasks &amp; follow-ups
          </p>
        </div>
      </div>

      {/* Summary KPI */}
      <CalendarSummary events={eventsList} />

      {/* Filter Bar */}
      <CalendarFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Toolbar */}
      <CalendarToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDateText="July 2026"
        onPrevDate={() => toast.info("Previous Month")}
        onNextDate={() => toast.info("Next Month")}
        onToday={() => toast.info("Navigated to Today")}
        onAddEvent={handleOpenCreateModal}
      />

      {/* Main Grid View */}
      {isLoading ? (
        <div className="h-64 rounded-2xl border border-zinc-800 bg-zinc-950/60 animate-pulse flex items-center justify-center text-xs text-zinc-500 font-mono">
          Loading calendar agenda events...
        </div>
      ) : eventsList.length === 0 ? (
        <EntityEmptyState
          title="No Events Scheduled"
          description="No appointments or tasks match your current calendar query filters."
          onResetFilters={handleResetFilters}
        />
      ) : (
        <CalendarGrid
          events={eventsList}
          viewMode={viewMode}
          onSelectEvent={(evt) => {
            setSelectedEvent(evt);
            setIsDrawerOpen(true);
          }}
        />
      )}

      {/* Calendar Drawer Workspace */}
      <CalendarDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedEvent(null);
        }}
        onEdit={() => {
          if (selectedEvent) {
            handleOpenEditModal(selectedEvent);
          }
        }}
      />

      {/* Calendar Event Modal Form */}
      <CalendarModalForm
        isOpen={isFormModalOpen}
        mode={formMode}
        initialData={editingEvent}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
