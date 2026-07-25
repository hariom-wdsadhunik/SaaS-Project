import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { CalendarEventFormInput } from "@/lib/validations/calendar-event-form";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Link as LinkIcon, User } from "lucide-react";

interface CalendarEventFormSectionsProps {
  register: UseFormRegister<CalendarEventFormInput>;
  errors: FieldErrors<CalendarEventFormInput>;
}

export function CalendarEventFormSections({ register, errors }: CalendarEventFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Basic Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Event Title &amp; Classification</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Event Title <span className="text-red-400">*</span>
          </label>
          <Input {...register("title")} placeholder="e.g. VIP Penthouse Tour" className="text-xs" />
          {errors.title && <p className="text-[11px] text-red-400 mt-0.5">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Event Type <span className="text-red-400">*</span>
            </label>
            <select
              {...register("eventType")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="PROPERTY_VISIT">Property Visit</option>
              <option value="MEETING">Meeting</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="TASK">Task</option>
              <option value="APPOINTMENT">Appointment</option>
              <option value="REMINDER">Reminder</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Priority <span className="text-red-400">*</span>
            </label>
            <select
              {...register("priority")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Date & Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Clock className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Schedule &amp; Timings</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Start Time <span className="text-red-400">*</span>
            </label>
            <Input {...register("start")} type="datetime-local" className="text-xs" />
            {errors.start && <p className="text-[11px] text-red-400 mt-0.5">{errors.start.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              End Time <span className="text-red-400">*</span>
            </label>
            <Input {...register("end")} type="datetime-local" className="text-xs" />
            {errors.end && <p className="text-[11px] text-red-400 mt-0.5">{errors.end.message}</p>}
          </div>
        </div>
      </div>

      {/* 3. Assignment & Related Entity */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <User className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Host Agent &amp; Linked Entity</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Host Agent <span className="text-red-400">*</span>
            </label>
            <select
              {...register("assignedAgentName")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="Alex Morgan">Alex Morgan (Senior Broker)</option>
              <option value="Sarah Jenkins">Sarah Jenkins (Agent)</option>
              <option value="Michael Chen">Michael Chen (Agent)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Linked Entity Type</label>
            <select
              {...register("relatedEntityType")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">None</option>
              <option value="PROPERTY">Property</option>
              <option value="DEAL">Deal</option>
              <option value="CONTACT">Contact</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Linked Entity Name / ID</label>
          <Input {...register("relatedEntityName")} placeholder="e.g. Marina Bay Villa" className="text-xs" />
        </div>
      </div>

      {/* 4. Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Agenda Notes</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Event Description</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Add detailed meeting agenda or tour notes..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
