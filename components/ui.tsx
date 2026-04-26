import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const variants = {
    default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-accent",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "size-10",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:scale-[1.02] active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section className={cn(
      "rounded-3xl border border-border/70 bg-card/60 text-card-foreground shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] backdrop-blur-md transition-all duration-300 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)] hover:bg-card/80 hover:border-primary/20",
      className
    )}>
      {children}
    </section>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>;
}

export function Badge({ children, className = "", variant = "default" }: { children: ReactNode; className?: string; variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const variants = {
    default: "border-transparent bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-border/80 bg-background/50 backdrop-blur-sm text-foreground",
    destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
  };

  return (
    <div className={cn(
      "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase transition-all duration-200",
      variants[variant],
      className
    )}>
      {children}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:bg-background/80 disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function Label({ children, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block", className)} {...props}>
      {children}
    </label>
  );
}

export function Separator({ className = "" }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border/50", className)} />;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {eyebrow ? <div className="mb-1 text-xs font-medium text-primary/80">{eyebrow}</div> : null}
        <h2 className="text-2xl font-bold tracking-tight lg:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  text,
  title = "No data yet",
  action,
  icon,
  className = "",
}: {
  text: string;
  title?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center",
      className,
    )}>
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-primary shadow-inner">
        {icon || <EmptyStateIcon />}
      </div>
      <div className="text-sm font-bold tracking-tight text-foreground">{title}</div>
      <div className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function SkeletonBlock({ className = "h-24" }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted/30", className)}>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-muted/40 to-transparent" />
    </div>
  );
}

export function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "success" || normalized === "active" || normalized === "verified") {
    return <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">{status}</Badge>;
  }
  if (normalized === "failed" || normalized === "error" || normalized === "revoked") {
    return <Badge className="border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-400">{status}</Badge>;
  }
  if (normalized === "denied" || normalized === "medium" || normalized === "warning") {
    return <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400">{status}</Badge>;
  }
  if (normalized === "high" || normalized === "critical") {
    return <Badge className="border-rose-600/20 bg-rose-600/10 text-rose-800 dark:text-rose-300 font-bold">{status}</Badge>;
  }
  return <Badge variant="outline" className="opacity-70">{status || "unknown"}</Badge>;
}

export function MetricCard({
  label,
  value,
  helper,
  tone = "neutral",
  signal,
}: {
  label: string;
  value: string;
  helper?: string;
  tone?: "neutral" | "good" | "warning" | "danger" | "info";
  signal?: string;
}) {
  const tones = {
    neutral: {
      accent: "bg-muted-foreground/60",
      panel: "from-muted/30",
      text: "text-muted-foreground",
      ring: "border-border/40 hover:border-primary/30",
    },
    good: {
      accent: "bg-emerald-500",
      panel: "from-emerald-500/10",
      text: "text-emerald-700 dark:text-emerald-400",
      ring: "border-emerald-500/20 hover:border-emerald-500/40",
    },
    warning: {
      accent: "bg-amber-500",
      panel: "from-amber-500/10",
      text: "text-amber-700 dark:text-amber-400",
      ring: "border-amber-500/20 hover:border-amber-500/40",
    },
    danger: {
      accent: "bg-rose-500",
      panel: "from-rose-500/10",
      text: "text-rose-700 dark:text-rose-400",
      ring: "border-rose-500/20 hover:border-rose-500/40",
    },
    info: {
      accent: "bg-sky-500",
      panel: "from-sky-500/10",
      text: "text-sky-700 dark:text-sky-400",
      ring: "border-sky-500/20 hover:border-sky-500/40",
    },
  };
  const style = tones[tone];

  return (
    <Card className={cn("relative overflow-hidden group transition-all duration-500 shadow-sm hover:shadow-primary/5", style.ring)}>
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r via-transparent to-transparent", style.accent)} />
      <div className={cn("absolute top-0 right-0 size-32 bg-gradient-to-br to-transparent blur-[60px] -z-10 transition-colors duration-700", style.panel)} />
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-muted-foreground/70 group-hover:text-primary/80 transition-colors">{label}</div>
          <div className={cn("size-2 rounded-full shadow-[0_0_12px_currentColor]", style.text)} />
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="text-4xl font-bold tracking-tighter lg:text-5xl group-hover:scale-[1.02] transition-transform duration-500">{value}</div>
          {signal ? <div className={cn("mb-1 rounded-full border border-current/20 px-2.5 py-1 text-[10px] font-medium", style.text)}>{signal}</div> : null}
        </div>
        {helper && (
          <div className="line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground/60">{helper}</div>
        )}
      </CardHeader>
    </Card>
  );
}

function EmptyStateIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 17.5 9 12l4 3 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SubtleStat({ label, value, helper, className = "" }: { label: string; value: string; helper?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-background/40 p-4 transition-all hover:bg-background/60 hover:border-primary/30", className)}>
      <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground/80">{label}</div>
      <div className="mt-2 text-xl font-bold tracking-tight">{value}</div>
      {helper ? <div className="mt-1 text-xs leading-relaxed text-muted-foreground/80">{helper}</div> : null}
    </div>
  );
}
