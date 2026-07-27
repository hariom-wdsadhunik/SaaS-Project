import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { DealFormInput } from "@/lib/validations/deal-form";
import { Input } from "@/components/ui/input";
import { DollarSign, Calendar, Building, FileText } from "lucide-react";

interface DealFormSectionsProps {
  register: UseFormRegister<DealFormInput>;
  errors: FieldErrors<DealFormInput>;
}

export function DealFormSections({ register, errors }: DealFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Basic Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Basic Deal Parameters</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Deal Title <span className="text-red-400">*</span>
          </label>
          <Input
            {...register("title")}
            placeholder="e.g. Downtown Penthouse Acquisition"
            className="text-xs"
          />
          {errors.title && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Company Name</label>
            <Input
              {...register("companyName")}
              placeholder="e.g. Vanguard Tech Holdings"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Related Lead Record <span className="text-red-400">*</span>
            </label>
            <select
              {...register("relatedLeadId")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select Lead Contact...</option>
              <option value="ld-101">John Doe (Downtown Inquiry)</option>
              <option value="ld-102">Sarah Jenkins (Marina Suite Inquiry)</option>
              <option value="ld-103">Alexander Montgomery III (Palm Villa)</option>
              <option value="ld-104">Michael Chen (Design Studio)</option>
            </select>
            {errors.relatedLeadId && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.relatedLeadId.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Value & Stage */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Financial Value &amp; Pipeline Stage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Deal Value ($) <span className="text-red-400">*</span>
            </label>
            <Input
              type="number"
              {...register("value", { valueAsNumber: true })}
              placeholder="1250000"
              className="text-xs font-mono font-bold"
            />
            {errors.value && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.value.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Pipeline Stage <span className="text-red-400">*</span>
            </label>
            <select
              {...register("stage")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="NEW">New Inquiry</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="PROPOSAL_SENT">Proposal Sent</option>
              <option value="NEGOTIATION">Negotiation</option>
              <option value="WON">Won / Closed</option>
              <option value="LOST">Lost</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Win Probability (%)</label>
            <Input
              type="number"
              {...register("probability", { valueAsNumber: true })}
              placeholder="75"
              className="text-xs font-mono"
            />
            {errors.probability && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.probability.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Assignment & Target Date */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Assignment &amp; Timeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Priority Level</label>
            <select
              {...register("priority")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Expected Close Date <span className="text-red-400">*</span>
            </label>
            <Input
              type="date"
              {...register("expectedCloseDate")}
              className="text-xs"
            />
            {errors.expectedCloseDate && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.expectedCloseDate.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Assigned Broker <span className="text-red-400">*</span>
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
      </div>

      {/* 4. Internal Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <FileText className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Confidential Deal Notes</span>
        </div>

        <div className="space-y-1">
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Add confidential notes regarding deal negotiations..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
          {errors.notes && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.notes.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
