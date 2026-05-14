import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

export function SubtleStat({
  label,
  value,
  helper,
  className,
}: {
  label: string;
  value: string;
  helper?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-border/40 bg-background/40 p-4 hover:bg-background/60 hover:border-primary/30", MOTION.standard, className)}>
      <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground/80">{label}</div>
      <div className="mt-2 text-xl font-bold tracking-tight">{value}</div>
      {helper ? <div className="mt-1 text-xs leading-relaxed text-muted-foreground/80">{helper}</div> : null}
    </div>
  );
}
