"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, UserPlus, Edit3, AlertCircle } from "lucide-react";

import { contactFormSchema, ContactFormInput } from "@/lib/validations/contact-form";
import { contactMockService } from "@/services/contact-mock-service";
import { ContactEntity } from "@/domain/contact/types";
import { ContactFormSections } from "./contact-form-sections";
import { UnsavedChangesDialog } from "@/components/leads/forms/unsaved-changes-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ContactModalFormProps {
  isOpen: boolean;
  mode: "create" | "edit";
  initialData?: ContactEntity | null;
  onClose: () => void;
  onSuccess: (contact: ContactEntity) => void;
}

export function ContactModalForm({
  isOpen,
  mode,
  initialData,
  onClose,
  onSuccess,
}: ContactModalFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [showUnsavedDialog, setShowUnsavedDialog] = React.useState(false);

  const defaultValues: ContactFormInput = React.useMemo(() => {
    if (mode === "edit" && initialData) {
      const parts = initialData.fullName.split(" ");
      const firstName = parts[0] || "";
      const lastName = parts.slice(1).join(" ") || "";
      return {
        firstName,
        lastName,
        email: initialData.email,
        phone: initialData.phone,
        status: initialData.status,
        assignedAgentName: initialData.assignedAgentName,
        companyName: initialData.companyName,
        designation: initialData.designation,
        tags: initialData.tags.join(", "),
        notes: "",
      };
    }
    return {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      status: "ACTIVE",
      assignedAgentName: "Alex Morgan",
      companyName: "",
      designation: "",
      tags: "",
      notes: "",
    };
  }, [mode, initialData]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
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

  const onSubmit = async (data: ContactFormInput) => {
    setServerError(null);
    try {
      if (mode === "create") {
        const createdContact = await contactMockService.createContact(data);
        toast.success(`Contact "${createdContact.fullName}" created successfully!`);
        onSuccess(createdContact);
      } else if (mode === "edit" && initialData) {
        const updatedContact = await contactMockService.updateContact(initialData.id, data);
        toast.success(`Contact "${updatedContact.fullName}" updated successfully!`);
        onSuccess(updatedContact);
      }
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to process contact record.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150 select-none">
        {/* Modal Container */}
        <div
          role="dialog"
          aria-modal="true"
          aria-label={mode === "create" ? "Create New Contact Profile" : "Edit Contact Record"}
          className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                {mode === "create" ? <UserPlus className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {mode === "create" ? "Create New Contact Profile" : "Edit Contact Record"}
                </h2>
                <p className="text-xs text-zinc-400">
                  {mode === "create"
                    ? "Add a new client or business contact to the directory"
                    : `Modify record parameters for ${initialData?.fullName}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseAttempt}
              aria-label="Close dialog"
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

            <ContactFormSections register={register} errors={errors} />

            {/* Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-950/95 py-2">
              <div className="text-[11px] text-zinc-500 font-mono">
                {isDirty ? "• Unsaved changes detected" : "• Form synchronized"}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCloseAttempt}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  size="sm"
                  isLoading={isSubmitting}
                  className="text-xs font-semibold shadow-sm"
                >
                  {mode === "create" ? "Save Contact" : "Save Changes"}
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
