export const UI_TONES = {
  neutral: {
    accent: "bg-muted-foreground/60",
    panel: "from-muted/30",
    text: "text-muted-foreground",
    ring: "border-border/40 hover:border-primary/30",
    badge: "border-border/80 bg-muted/70 text-foreground dark:border-border dark:bg-muted/50 dark:text-zinc-100",
  },
  good: {
    accent: "bg-emerald-500",
    panel: "from-emerald-500/10",
    text: "text-emerald-800 dark:text-emerald-300",
    ring: "border-emerald-600/30 hover:border-emerald-500/50",
    badge: "border-emerald-600/40 bg-emerald-500/15 text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  warning: {
    accent: "bg-amber-500",
    panel: "from-amber-500/10",
    text: "text-amber-800 dark:text-amber-300",
    ring: "border-amber-600/30 hover:border-amber-500/50",
    badge: "border-amber-600/40 bg-amber-500/15 text-amber-800 dark:border-amber-500/40 dark:bg-amber-950/60 dark:text-amber-300",
  },
  danger: {
    accent: "bg-rose-500",
    panel: "from-rose-500/10",
    text: "text-rose-700 dark:text-rose-300",
    ring: "border-rose-600/30 hover:border-rose-500/50",
    badge: "border-rose-500/40 bg-rose-500/15 text-rose-700 dark:border-rose-500/40 dark:bg-rose-950/60 dark:text-rose-300",
  },
  info: {
    accent: "bg-sky-500",
    panel: "from-sky-500/10",
    text: "text-sky-800 dark:text-sky-300",
    ring: "border-sky-600/30 hover:border-sky-500/50",
    badge: "border-sky-600/40 bg-sky-500/15 text-sky-800 dark:border-sky-500/40 dark:bg-sky-950/60 dark:text-sky-300",
  },
} as const;

export type ToneKey = keyof typeof UI_TONES;
