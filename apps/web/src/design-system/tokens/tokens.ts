export const DESIGN_TOKENS = {
  colors: {
    bgDark: "#09090b", // zinc-950
    bgCard: "#18181b", // zinc-900
    border: "#27272a", // zinc-800
    primary: "#6366f1", // indigo-500
    primaryHover: "#4f46e5", // indigo-600
    textMain: "#ffffff",
    textMuted: "#a1a1aa", // zinc-400
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  borderRadius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  transitions: {
    fast: "150ms ease-in-out",
    normal: "200ms ease-in-out",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
} as const;
