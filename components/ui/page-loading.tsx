import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

export interface PageLoadingProps {
  /** Optional loading message/title */
  message?: string;
  /** Optional subtitle or descriptive text */
  description?: string;
  /** Whether to occupy the full viewport height */
  fullScreen?: boolean;
  /** Additional classes for the container */
  className?: string;
}

export function PageLoading({
  message = "Memuat...",
  description,
  fullScreen = false,
  className,
}: PageLoadingProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center text-center select-none",
        fullScreen ? "min-h-screen w-full bg-background/80 backdrop-blur-sm px-4" : "py-16 px-4 w-full",
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-3">
        <div className="absolute -inset-2 rounded-full bg-primary/20 blur-md animate-pulse" />
        <Spinner size={fullScreen ? "xl" : "lg"} variant="primary" />
      </div>
      {message && (
        <p className="text-sm font-semibold tracking-tight text-foreground/90">
          {message}
        </p>
      )}
      {description && (
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}
