import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/** Base generic skeleton element with smooth shimmer */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden rounded-md bg-muted/40", className)}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-muted/30 to-transparent" />
    </div>
  );
}

/** Backward-compatible block skeleton */
export function SkeletonBlock({ className = "h-24" }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl bg-muted/30", className)}>
      <div className="absolute inset-0 -translate-x-full motion-safe:animate-shimmer bg-gradient-to-r from-transparent via-muted/40 to-transparent" />
    </div>
  );
}

/** Text paragraph skeleton with configurable line count */
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 rounded-full",
            i === lines - 1 ? "w-3/5" : i === 0 ? "w-full" : "w-4/5"
          )}
        />
      ))}
    </div>
  );
}

/** Card container skeleton */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "rounded-2xl border border-border/70 bg-card/60 p-5 space-y-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-1/3 rounded-full" />
          <Skeleton className="h-3 w-1/2 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-4 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/** Table rows skeleton */
export function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("w-full space-y-3", className)} aria-hidden="true">
      {/* Header skeleton */}
      <div className="flex gap-4 border-b border-border pb-3 px-2">
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4 flex-1 rounded-full" />
        ))}
      </div>
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 px-2 border-b border-border/40">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={cn(
                "h-3.5 flex-1 rounded-full",
                c === 0 ? "w-1/4" : "w-full"
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
