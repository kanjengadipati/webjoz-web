import { cn } from "@/lib/utils";

export function SkeletonBlock({ className = "h-24" }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted/30", className)}>
      <div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-muted/40 to-transparent" />
    </div>
  );
}
