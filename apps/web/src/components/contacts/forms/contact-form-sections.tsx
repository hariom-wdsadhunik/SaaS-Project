import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ContactFormInput } from "@/lib/validations/contact-form";
import { Input } from "@/components/ui/input";
import { User, Building, Mail, Tag } from "lucide-react";

interface ContactFormSectionsProps {
  register: UseFormRegister<ContactFormInput>;
  errors: FieldErrors<ContactFormInput>;
}

export function ContactFormSections({ register, errors }: ContactFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Personal Identity */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <User className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Personal Identity &amp; Status</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              First Name <span className="text-red-400">*</span>
            </label>
            <Input {...register("firstName")} placeholder="John" className="text-xs" />
            {errors.firstName && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.firstName.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Last Name <span className="text-red-400">*</span>
            </label>
            <Input {...register("lastName")} placeholder="Doe" className="text-xs" />
            {errors.lastName && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Relationship Status <span className="text-red-400">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="ACTIVE">Active</option>
              <option value="PROSPECT">Prospect</option>
              <option value="CLIENT">Client</option>
              <option value="VIP">VIP</option>
              <option value="INACTIVE">Inactive</option>
            </select>
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
      </div>

      {/* 2. Communication Channels */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Mail className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Communication Channels</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <Input {...register("email")} placeholder="john.doe@example.com" className="text-xs" />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Phone Number</label>
            <Input {...register("phone")} placeholder="+971 50 123 4567" className="text-xs font-mono" />
          </div>
        </div>
      </div>

      {/* 3. Corporate & Professional */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Corporate &amp; Professional Info</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Company Name</label>
            <Input {...register("companyName")} placeholder="Vanguard Tech Holdings" className="text-xs" />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Designation / Title</label>
            <Input {...register("designation")} placeholder="Managing Director" className="text-xs" />
          </div>
        </div>
      </div>

      {/* 4. Categorization & Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Tag className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Tags &amp; Confidential Notes</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Tags (comma separated)</label>
          <Input {...register("tags")} placeholder="High Net Worth, Investor, Commercial Buyer" className="text-xs" />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Confidential Notes</label>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Add internal relationship notes..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
