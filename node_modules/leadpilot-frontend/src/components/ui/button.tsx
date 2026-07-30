import React, { ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "default" | "ai";
  size?: "sm" | "md" | "lg" | "default" | "icon";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm",
    default: "bg-blue-600 hover:bg-blue-500 text-white shadow-sm",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700",
    outline: "bg-transparent border border-zinc-700 text-zinc-200 hover:bg-zinc-800",
    danger: "bg-rose-600 hover:bg-rose-500 text-white",
    ghost: "bg-transparent hover:bg-zinc-800 text-zinc-300",
    ai: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-sm border border-indigo-500/30",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-2.5 text-base",
    icon: "p-2 text-sm",
  };

  const selectedVariant = variants[variant as keyof typeof variants] || variants.primary;
  const selectedSize = sizes[size as keyof typeof sizes] || sizes.md;

  return (
    <button
      className={`${baseStyles} ${selectedVariant} ${selectedSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
