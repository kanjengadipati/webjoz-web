import type { ReactNode } from "react";
import { EmptyChartIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export function EmptyState({
  text,
  title = "No data yet",
  action,
  icon,
  className,
}: {
  text: string;
  title?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border/60 bg-background/70 text-primary shadow-inner">
        {icon || <EmptyChartIcon />}
      </div>
      <div className="text-sm font-bold tracking-tight text-foreground">{title}</div>
      <div className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{text}</div>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
