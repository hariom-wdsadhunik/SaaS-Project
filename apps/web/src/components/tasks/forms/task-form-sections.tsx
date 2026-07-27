import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { TaskFormInput } from "@/lib/validations/task-form";
import { Input } from "@/components/ui/input";
import { CheckSquare, Calendar, Link as LinkIcon, Flame } from "lucide-react";

interface TaskFormSectionsProps {
  register: UseFormRegister<TaskFormInput>;
  errors: FieldErrors<TaskFormInput>;
}

export function TaskFormSections({ register, errors }: TaskFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Basic Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <CheckSquare className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Task Details &amp; Category</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Task Title <span className="text-red-400">*</span>
          </label>
          <Input {...register("title")} placeholder="e.g. Schedule Penthouse Viewing Tour" className="text-xs" />
          {errors.title && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              {...register("category")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="SITE_VISIT">Site Visit</option>
              <option value="CONTRACT_REVIEW">Contract Review</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CALL">Call</option>
              <option value="MEETING">Meeting</option>
              <option value="EMAIL">Email</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Priority Level <span className="text-red-400">*</span>
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

      {/* 2. Schedule & Assignment */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Schedule &amp; Assignment</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Due Date &amp; Time <span className="text-red-400">*</span>
            </label>
            <Input {...register("dueDate")} type="datetime-local" className="text-xs" />
            {errors.dueDate && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Assigned Broker Agent <span className="text-red-400">*</span>
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
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Workflow Status</label>
          <select
            {...register("status")}
            className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING">Waiting</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* 3. Linked Entity Relationship */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <LinkIcon className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Linked Domain Entity (Optional)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Entity Type</label>
            <select
              {...register("relatedEntityType")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">None (Standalone Task)</option>
              <option value="PROPERTY">Property</option>
              <option value="DEAL">Deal</option>
              <option value="CONTACT">Contact</option>
              <option value="LEAD">Lead</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Entity Name / Reference</label>
            <Input {...register("relatedEntityName")} placeholder="e.g. Marina Bay Luxury Penthouse" className="text-xs" />
          </div>
        </div>
      </div>

      {/* 4. Description & Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Flame className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Work Description</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Task Notes / Instructions</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Add detailed task execution instructions..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
