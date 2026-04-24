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
    default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background",
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
  return <section className={cn("rounded-3xl border border-border/70 bg-card text-card-foreground shadow-[0_20px_60px_-28px_rgba(15,23,42,0.28)] backdrop-blur-sm", className)}>{children}</section>;
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}

export function CardDescription({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>;
}

export function CardContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 pt-0", className)}>{children}</div>;
}

export function CardFooter({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={cn("flex items-center p-6 pt-0", className)}>{children}</div>;
}

export function Badge({ children, className = "", variant = "default" }: { children: ReactNode; className?: string; variant?: "default" | "secondary" | "outline" | "destructive" }) {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border-border/80 bg-background/70 text-foreground",
    destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
  };

  return <div className={cn("inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.14em] uppercase transition-colors", variants[variant], className)}>{children}</div>;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    />
  );
}

export function Label({ children, className = "", ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
      {children}
    </label>
  );
}

export function Separator({ className = "" }: { className?: string }) {
  return <div className={cn("h-px w-full bg-border", className)} />;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <div className="text-xs uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</div> : null}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight lg:text-3xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-border/80 bg-muted/45 px-4 py-5 text-sm leading-7 text-muted-foreground">{text}</div>;
}

export function SkeletonBlock({ className = "h-24" }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-2xl bg-muted", className)} />;
}

export function StatusBadge({ status }: { status?: string }) {
  const normalized = (status || "").toLowerCase();
  if (normalized === "success") {
    return <Badge className="border-emerald-500/20 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">{status}</Badge>;
  }
  if (normalized === "failed" || normalized === "error") {
    return <Badge className="border-rose-500/20 bg-rose-500/15 text-rose-700 dark:text-rose-300">{status}</Badge>;
  }
  if (normalized === "denied") {
    return <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300">{status}</Badge>;
  }
  if (normalized === "current" || normalized === "verified" || normalized === "low") {
    return <Badge className="border-sky-500/20 bg-sky-500/15 text-sky-700 dark:text-sky-300">{status}</Badge>;
  }
  if (normalized === "medium") {
    return <Badge className="border-amber-500/20 bg-amber-500/15 text-amber-700 dark:text-amber-300">{status}</Badge>;
  }
  if (normalized === "high") {
    return <Badge className="border-rose-500/20 bg-rose-500/15 text-rose-700 dark:text-rose-300">{status}</Badge>;
  }
  return <Badge variant="outline">{status || "unknown"}</Badge>;
}

export function MetricCard({ label, value, helper }: { label: string; value: string; helper?: string }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3 bg-gradient-to-br from-background via-background to-primary/5">
        <CardDescription className="text-xs uppercase tracking-[0.26em]">{label}</CardDescription>
        <CardTitle className="text-4xl lg:text-5xl">{value}</CardTitle>
        {helper ? <CardDescription className="text-sm leading-6">{helper}</CardDescription> : null}
      </CardHeader>
    </Card>
  );
}

export function SubtleStat({ label, value, helper, className = "" }: { label: string; value: string; helper?: string; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-background/70 px-4 py-4", className)}>
      <div className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight">{value}</div>
      {helper ? <div className="mt-2 text-sm leading-6 text-muted-foreground">{helper}</div> : null}
    </div>
  );
}
