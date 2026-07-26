import React from "react";

export interface BadgeProps {
  variant?: "blue" | "emerald" | "amber" | "rose" | "zinc" | "default" | "secondary" | "danger" | "warning" | "success" | "info" | "outline" | "ai" | "destructive";
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = "zinc", children, className = "" }) => {
  const variants = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    secondary: "bg-zinc-800 text-zinc-300 border-zinc-700",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    destructive: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    zinc: "bg-zinc-800 text-zinc-300 border-zinc-700",
    outline: "bg-transparent text-zinc-300 border-zinc-700",
    ai: "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-purple-300 border-purple-500/30",
  };

  const selectedVariant = variants[variant as keyof typeof variants] || variants.zinc;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
};
