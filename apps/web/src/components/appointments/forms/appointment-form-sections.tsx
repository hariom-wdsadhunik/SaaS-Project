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
            placeholder="e.g., Penthouse Acquisition Presentation"
            className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
          />
          {errors.title && <p className="text-[11px] text-red-400 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Meeting Type *</label>
            <select
              {...register("meetingType")}
              className="mt-1 w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="VIDEO">Video Call</option>
              <option value="CALL">Phone Call</option>
              <option value="IN_PERSON">In Person</option>
              <option value="SITE_VISIT">Site Visit / Inspection</option>
              <option value="DEMO">Product Demo</option>
              <option value="FOLLOW_UP">Follow-up</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Workflow Status *</label>
            <select
              {...register("status")}
              className="mt-1 w-full h-9 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
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
        2. Schedule &amp; Location
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Start Time *</label>
            <Input
              type="datetime-local"
              {...register("startTime")}
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.startTime && <p className="text-[11px] text-red-400 mt-1">{errors.startTime.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">End Time *</label>
            <Input
              type="datetime-local"
              {...register("endTime")}
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.endTime && <p className="text-[11px] text-red-400 mt-1">{errors.endTime.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-zinc-300">Location / Venue *</label>
            <Input
              {...register("location")}
              placeholder="e.g., Google Meet or Business Bay Plot 4"
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.location && <p className="text-[11px] text-red-400 mt-1">{errors.location.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-300">Assigned Broker *</label>
            <Input
              {...register("assignedTo")}
              placeholder="e.g., Alex Morgan"
              className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
            />
            {errors.assignedTo && <p className="text-[11px] text-red-400 mt-1">{errors.assignedTo.message}</p>}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-zinc-300">Video Link / URL (Optional)</label>
          <Input
            {...register("meetingLink")}
            placeholder="https://meet.google.com/xyz-abc-123"
            className="mt-1 text-xs bg-zinc-900 border-zinc-800 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
