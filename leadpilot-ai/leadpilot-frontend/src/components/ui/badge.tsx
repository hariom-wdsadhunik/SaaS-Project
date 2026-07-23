import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        secondary: "border-transparent bg-zinc-800 text-zinc-300 border-zinc-700/50",
        success: "border-transparent bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "border-transparent bg-amber-500/10 text-amber-400 border-amber-500/20",
        danger: "border-transparent bg-red-500/10 text-red-400 border-red-500/20",
        ai: "border-transparent bg-violet-500/15 text-violet-300 border-violet-500/30 shadow-sm shadow-violet-500/20",
        outline: "text-zinc-300 border-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
