"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar, Edit3, AlertCircle } from "lucide-react";
import { calendarEventFormSchema, CalendarEventFormInput } from "@/lib/validations/calendar-event-form";
import { calendarEventService } from "@/domain/calendar/services/CalendarEventService";
import { CalendarEventEntity } from "@/domain/calendar/types";
import { CalendarEventFormSections } from "./calendar-event-form-sections";
import { UnsavedChangesDialog } from "@/components/leads/forms/unsaved-changes-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface CalendarModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: CalendarEventEntity | null;
  onClose: () => void;
  onSuccess: (event: CalendarEventEntity) => void;
}

export function CalendarModalForm({
  isOpen,
  mode,
  initialData,
  onClose,
  onSuccess,
}: CalendarModalFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);

  const defaultValues: CalendarEventFormInput = React.useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        title: initialData.title,
        description: initialData.description || "",
        eventType: initialData.eventType,
        priority: initialData.priority,
        status: initialData.status,
        start: initialData.start ? initialData.start.slice(0, 16) : "",
        end: initialData.end ? initialData.end.slice(0, 16) : "",
        assignedAgentName: initialData.assignedAgentName,
        relatedEntityType: initialData.relatedEntityType,
        relatedEntityName: initialData.relatedEntityName || "",
      };
    }
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 3600000);
    return {
      title: "",
      description: "",
      eventType: "PROPERTY_VISIT",
      priority: "HIGH",
      status: "SCHEDULED",
      start: now.toISOString().slice(0, 16),
      end: oneHourLater.toISOString().slice(0, 16),
      assignedAgentName: "Alex Morgan",
      relatedEntityType: undefined,
      relatedEntityName: "",
    };
  }, [mode, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CalendarEventFormInput>({
    resolver: zodResolver(calendarEventFormSchema),
    values: defaultValues,
  });

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowUnsavedDialog(true);
    } else {
      setServerError(null);
      onClose();
    }
  };

  const onSubmit = async (data: CalendarEventFormInput) => {
    setServerError(null);
    try {
      if (mode === "create") {
        const created = await calendarEventService.createEvent(data);
        toast.success(`Event "${created.title}" scheduled!`);
        onSuccess(created);
      } else if (mode === "edit" && initialData) {
        const updated = await calendarEventService.updateEvent(initialData.id, data);
        toast.success(`Event "${updated.title}" updated!`);
        onSuccess(updated);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process calendar event.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Schedule New Calendar Event" : "Edit Event Parameters"}
          className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {mode === "create" ? <Calendar className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {mode === "create" ? "Schedule New Calendar Event" : "Edit Event Parameters"}
                </h2>
                <p className="text-xs text-zinc-400">
                  {mode === "create"
                    ? "Schedule a walkthrough tour, client meeting, or follow-up agenda"
                    : `Modify schedule for "${initialData?.title}"`}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAttempt}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {serverError && (
              <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <CalendarEventFormSections register={register} errors={errors} />

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950/95 py-2">
              <div className="text-[11px] text-zinc-500 font-mono">
                {isDirty ? "• Unsaved changes detected" : "• Form synchronized"}
              </div>

              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" onClick={handleCloseAttempt} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" variant="default" size="sm" isLoading={isSubmitting} className="text-xs font-semibold shadow-sm">
                  {mode === "create" ? "Schedule Event" : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onConfirmDiscard={() => {
          setShowUnsavedDialog(false);
          setServerError(null);
          onClose();
        }}
        onKeepEditing={() => setShowUnsavedDialog(false)}
      />
    </>
  );
}
