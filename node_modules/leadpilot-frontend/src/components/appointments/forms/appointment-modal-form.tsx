import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { appointmentFormSchema, AppointmentFormInput } from "@/lib/validations/appointment-form";
import { supabaseAppointmentRepository } from "@/infrastructure/repositories/SupabaseAppointmentRepository";
import { AppointmentEntity } from "@/domain/appointment/types";
import { SectionTitleAndType, SectionScheduleAndHost } from "./appointment-form-sections";
import { UnsavedChangesDialog } from "@/components/leads/forms/unsaved-changes-dialog";
import { toast } from "sonner";

interface AppointmentModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: AppointmentEntity | null;
  onClose: () => void;
  onSuccess: (apt: AppointmentEntity) => void;
}

export function AppointmentModalForm({
  isOpen,
  mode,
  initialData,
  onClose,
  onSuccess,
}: AppointmentModalFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmClose, setShowConfirmClose] = React.useState(false);

  const defaultValues: Partial<AppointmentFormInput> = React.useMemo(() => {
    if (mode === "edit" && initialData) {
      return {
        title: initialData.title,
        description: initialData.description || "",
        location: initialData.location || "Online Video Link",
        meetingType: initialData.meetingType || "VIDEO",
        status: initialData.status || "SCHEDULED",
        startTime: initialData.startTime ? initialData.startTime.slice(0, 16) : "",
        endTime: initialData.endTime ? initialData.endTime.slice(0, 16) : "",
        assignedTo: initialData.assignedTo || "Alex Morgan",
        meetingLink: initialData.meetingLink || "",
        notes: initialData.notes || "",
        contactId: initialData.contactId,
        leadId: initialData.leadId,
        dealId: initialData.dealId,
        taskId: initialData.taskId,
      };
    }
    return {
      title: "",
      description: "",
      location: "Online Video Link",
      meetingType: "VIDEO",
      status: "SCHEDULED",
      startTime: "",
      endTime: "",
      assignedTo: "Alex Morgan",
      meetingLink: "",
      notes: "",
    };
  }, [mode, initialData]);

  const form = useForm<AppointmentFormInput>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = form;

  React.useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  if (!isOpen) return null;

  const handleSafeClose = () => {
    if (isDirty) {
      setShowConfirmClose(true);
    } else {
      onClose();
    }
  };

  const onSubmit = async (data: AppointmentFormInput) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const created = await supabaseAppointmentRepository.createAppointment(data);
        toast.success(`Appointment "${created.title}" scheduled successfully!`);
        onSuccess(created);
      } else if (mode === "edit" && initialData) {
        const updated = await supabaseAppointmentRepository.updateAppointment(initialData.id, data);
        toast.success(`Appointment "${updated.title}" updated successfully!`);
        onSuccess(updated);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save appointment";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-6 py-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {mode === "create" ? "Book New Appointment" : "Edit Appointment Details"}
                </h3>
                <p className="text-xs text-zinc-400">
                  {mode === "create"
                    ? "Schedule property viewing, client consultation or legal closing"
                    : `Modifying appointment record ID: ${initialData?.id}`}
                </p>
              </div>
            </div>
            <button
              onClick={handleSafeClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="appointment-form" onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
            <SectionTitleAndType form={form} />
            <SectionScheduleAndHost form={form} />
          </form>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/40 px-6 py-4">
            <Button size="sm" variant="outline" onClick={handleSafeClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button size="sm" type="submit" form="appointment-form" isLoading={isSubmitting} className="gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium">
              <span>{mode === "create" ? "Confirm Booking" : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </div>

      <UnsavedChangesDialog
        isOpen={showConfirmClose}
        onConfirmDiscard={() => {
          setShowConfirmClose(false);
          onClose();
        }}
        onKeepEditing={() => setShowConfirmClose(false)}
      />
    </>
  );
}
