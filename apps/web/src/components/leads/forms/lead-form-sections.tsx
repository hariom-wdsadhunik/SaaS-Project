import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { LeadFormInput } from "@/lib/validations/lead-form";
import { Input } from "@/components/ui/input";
import { User, Phone, Mail, Building, DollarSign, FileText } from "lucide-react";

interface LeadFormSectionsProps {
  register: UseFormRegister<LeadFormInput>;
  errors: FieldErrors<LeadFormInput>;
}

export function LeadFormSections({ register, errors }: LeadFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Basic Information */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <User className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Basic Information</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Full Name <span className="text-red-400">*</span>
          </label>
          <Input
            {...register("fullName")}
            placeholder="e.g. Alexander Montgomery"
            className="text-xs"
          />
          {errors.fullName && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Lead Source <span className="text-red-400">*</span>
            </label>
            <select
              {...register("source")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select Source...</option>
              <option value="WhatsApp Business API">WhatsApp API</option>
              <option value="Meta / IG Lead Ads">Meta Ads</option>
              <option value="Website Webhook">Website Webhook</option>
              <option value="Client Referrals">Referrals</option>
            </select>
            {errors.source && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.source.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Initial Status <span className="text-red-400">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="QUALIFIED">QUALIFIED</option>
              <option value="NURTURING">NURTURING</option>
              <option value="LOST">LOST</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Contact Details */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Phone className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Contact Information</span>
        </div>
        <p className="text-[11px] text-zinc-400 italic">
          Mandatory: At least one contact method (Email or Phone) must be provided.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Mail className="h-3 w-3 text-zinc-400" />
              <span>Email Address</span>
            </label>
            <Input
              type="email"
              {...register("email")}
              placeholder="alex@domain.com"
              className="text-xs"
            />
            {errors.email && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
              <Phone className="h-3 w-3 text-zinc-400" />
              <span>Phone Number</span>
            </label>
            <Input
              type="tel"
              {...register("phone")}
              placeholder="+1 (555) 000-0000"
              className="text-xs"
            />
            {errors.phone && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Property Preferences & Budget */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Preferences &amp; Budget</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Min Budget ($)</label>
            <Input
              type="number"
              {...register("budgetMin", { valueAsNumber: true })}
              placeholder="e.g. 500000"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Max Budget ($)</label>
            <Input
              type="number"
              {...register("budgetMax", { valueAsNumber: true })}
              placeholder="e.g. 1500000"
              className="text-xs"
            />
            {errors.budgetMax && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.budgetMax.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Preferred Location</label>
            <Input
              {...register("preferredLocation")}
              placeholder="e.g. Downtown Palm"
              className="text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Property Type</label>
            <select
              {...register("preferredPropertyType")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Any Type</option>
              <option value="Villa">Luxury Villa</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Apartment">Apartment</option>
              <option value="Townhouse">Townhouse</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Assignment & Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Assignment &amp; Internal Notes</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Assign Broker</label>
          <select
            {...register("assignedBrokerName")}
            className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          >
            <option value="Unassigned">Unassigned</option>
            <option value="Alex Morgan">Alex Morgan</option>
            <option value="Sarah Jenkins">Sarah Jenkins</option>
            <option value="Michael Chen">Michael Chen</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
            <FileText className="h-3 w-3 text-zinc-400" />
            <span>Internal Notes</span>
          </label>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Add confidential notes regarding requirements..."
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
