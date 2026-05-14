export const UI_TONES = {
  neutral: {
    accent: "bg-muted-foreground/60",
    panel: "from-muted/30",
    text: "text-muted-foreground",
    ring: "border-border/40 hover:border-primary/30",
    badge: "border-border/80 bg-background/70 text-foreground",
  },
  good: {
    accent: "bg-emerald-500",
    panel: "from-emerald-500/10",
    text: "text-emerald-800 dark:text-emerald-300",
    ring: "border-emerald-600/30 hover:border-emerald-500/50",
    badge: "border-emerald-600/40 bg-emerald-500/20 text-emerald-950 dark:text-emerald-300",
  },
  warning: {
    accent: "bg-amber-500",
    panel: "from-amber-500/10",
    text: "text-amber-800 dark:text-amber-300",
    ring: "border-amber-600/30 hover:border-amber-500/50",
    badge: "border-amber-600/40 bg-amber-500/20 text-amber-950 dark:text-amber-300",
  },
  danger: {
    accent: "bg-rose-500",
    panel: "from-rose-500/10",
    text: "text-rose-800 dark:text-rose-300",
    ring: "border-rose-600/30 hover:border-rose-500/50",
    badge: "border-rose-600/40 bg-rose-500/20 text-rose-950 dark:text-rose-300",
  },
  info: {
    accent: "bg-sky-500",
    panel: "from-sky-500/10",
    text: "text-sky-800 dark:text-sky-300",
    ring: "border-sky-600/30 hover:border-sky-500/50",
    badge: "border-sky-600/40 bg-sky-500/20 text-sky-950 dark:text-sky-300",
  },
} as const;

export type ToneKey = keyof typeof UI_TONES;
