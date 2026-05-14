export const FOCUS_VISIBLE =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

export const DISABLED_STYLES = "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export const MOTION = {
  standard: "motion-safe:transition-all motion-safe:duration-200 motion-reduce:transition-none",
  slow: "motion-safe:transition-all motion-safe:duration-500 motion-reduce:transition-none",
  transform: "motion-safe:transition-transform motion-safe:duration-300 motion-reduce:transition-none",
} as const;

export const SPACING = {
  xs: "px-3 py-2",
  sm: "px-4 py-3",
  md: "px-6 py-4",
  lg: "px-8 py-6",
} as const;

export const GRADIENTS = {
  primary: "from-primary/10 via-transparent to-transparent",
  muted: "from-muted/30 via-transparent to-transparent",
  success: "from-emerald-500/10 via-transparent to-transparent",
  danger: "from-rose-500/10 via-transparent to-transparent",
} as const;
