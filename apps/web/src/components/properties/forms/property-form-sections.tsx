import * as React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PropertyFormInput } from "@/lib/validations/property-form";
import { Input } from "@/components/ui/input";
import { Building, MapPin, DollarSign, ImageIcon } from "lucide-react";

interface PropertyFormSectionsProps {
  register: UseFormRegister<PropertyFormInput>;
  errors: FieldErrors<PropertyFormInput>;
}

export function PropertyFormSections({ register, errors }: PropertyFormSectionsProps) {
  return (
    <div className="space-y-6">
      {/* 1. Basic Info & Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <Building className="h-3.5 w-3.5 text-indigo-400" />
          <span>1. Listing Basics &amp; Classification</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Property Title <span className="text-red-400">*</span>
          </label>
          <Input
            {...register("title")}
            placeholder="e.g. The Sky Penthouse at Palm Tower"
            className="text-xs"
          />
          {errors.title && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.title.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Property Type <span className="text-red-400">*</span>
            </label>
            <select
              {...register("propertyType")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="PENTHOUSE">Penthouse</option>
              <option value="VILLA">Villa</option>
              <option value="APARTMENT">Apartment</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="DUPLEX">Duplex</option>
              <option value="TOWNHOUSE">Townhouse</option>
            </select>
            {errors.propertyType && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.propertyType.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Inventory Status <span className="text-red-400">*</span>
            </label>
            <select
              {...register("status")}
              className="w-full h-9 rounded-md border border-zinc-800 bg-zinc-950 px-2.5 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="AVAILABLE">Available</option>
              <option value="RESERVED">Reserved</option>
              <option value="SOLD">Sold</option>
              <option value="OFF_MARKET">Off Market</option>
            </select>
            {errors.status && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.status.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Financials & Specs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <DollarSign className="h-3.5 w-3.5 text-indigo-400" />
          <span>2. Valuation &amp; Specifications</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Price ($) <span className="text-red-400">*</span>
            </label>
            <Input
              type="number"
              {...register("price", { valueAsNumber: true })}
              placeholder="4250000"
              className="text-xs font-mono font-bold"
            />
            {errors.price && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.price.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              Area (sqft) <span className="text-red-400">*</span>
            </label>
            <Input
              type="number"
              {...register("areaSqFt", { valueAsNumber: true })}
              placeholder="5200"
              className="text-xs font-mono"
            />
            {errors.areaSqFt && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.areaSqFt.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Bedrooms</label>
            <Input
              type="number"
              {...register("bedrooms", { valueAsNumber: true })}
              placeholder="4"
              className="text-xs font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Bathrooms</label>
            <Input
              type="number"
              step="0.5"
              {...register("bathrooms", { valueAsNumber: true })}
              placeholder="5"
              className="text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* 3. Location & Agent */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <MapPin className="h-3.5 w-3.5 text-indigo-400" />
          <span>3. Property Location &amp; Agent</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">
            Address Line <span className="text-red-400">*</span>
          </label>
          <Input
            {...register("address")}
            placeholder="e.g. Palm Jumeirah East Crescent"
            className="text-xs"
          />
          {errors.address && (
            <p className="text-[11px] text-red-400 mt-0.5">{errors.address.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">
              City <span className="text-red-400">*</span>
            </label>
            <Input {...register("city")} placeholder="Dubai" className="text-xs" />
            {errors.city && (
              <p className="text-[11px] text-red-400 mt-0.5">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">State / Region</label>
            <Input {...register("state")} placeholder="Dubai" className="text-xs" />
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

      {/* 4. Media & Description */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider border-b border-zinc-800 pb-1.5">
          <ImageIcon className="h-3.5 w-3.5 text-indigo-400" />
          <span>4. Media &amp; Description</span>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Cover Image URL</label>
          <Input
            {...register("coverImageUrl")}
            placeholder="https://images.unsplash.com/..."
            className="text-xs font-mono"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-300">Description &amp; Highlights</label>
          <textarea
            {...register("description")}
            rows={3}
            placeholder="Luxury penthouse with panoramic sea views..."
            className="w-full rounded-md border border-zinc-800 bg-zinc-950 p-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
