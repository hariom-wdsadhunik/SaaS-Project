import * as React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { AppointmentFormInput } from "@/lib/validations/appointment-form";

interface FormSectionProps {
  form: UseFormReturn<AppointmentFormInput>;
}

export function SectionTitleAndType({ form }: FormSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
        1. Appointment Identity &amp; Type
      </h4>
      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-zinc-300">Appointment Title *</label>
          <Input
            {...register("title")}
            placeholder="e.g., VIP Penthouse Private Viewing"
            className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
          />
          {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Appointment Type *</label>
            <select
              {...register("appointmentType")}
              className="mt-1 w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="PROPERTY_VIEWING">Property Viewing</option>
              <option value="CLIENT_CONSULTATION">Client Consultation</option>
              <option value="LISTING_PRESENTATION">Listing Presentation</option>
              <option value="CONTRACT_SIGNING">Contract Signing</option>
              <option value="INSPECTION">Inspection</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Priority Level *</label>
            <select
              {...register("priority")}
              className="mt-1 w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-300">Description</label>
          <textarea
            {...register("description")}
            rows={2}
            placeholder="Brief overview of appointment objectives..."
            className="mt-1 w-full rounded-md border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}

export function SectionScheduleAndHost({ form }: FormSectionProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4 pt-2 border-t border-zinc-800/80">
      <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
        2. Schedule &amp; Entities
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Start Time *</label>
            <Input
              type="datetime-local"
              {...register("start")}
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.start && <p className="text-[11px] text-red-400 mt-1">{errors.start.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">End Time *</label>
            <Input
              type="datetime-local"
              {...register("end")}
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.end && <p className="text-[11px] text-red-400 mt-1">{errors.end.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Customer Name *</label>
            <Input
              {...register("customerName")}
              placeholder="e.g., Marcus Vance"
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.customerName && <p className="text-[11px] text-red-400 mt-1">{errors.customerName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Property Name *</label>
            <Input
              {...register("propertyName")}
              placeholder="e.g., Marina Bay Penthouse"
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.propertyName && <p className="text-[11px] text-red-400 mt-1">{errors.propertyName.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Assigned Broker *</label>
            <Input
              {...register("assignedAgentName")}
              placeholder="e.g., Alex Morgan"
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.assignedAgentName && <p className="text-[11px] text-red-400 mt-1">{errors.assignedAgentName.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Workflow Status *</label>
            <select
              {...register("status")}
              className="mt-1 w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
              <option value="RESCHEDULED">Rescheduled</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
