import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";
export type SpinnerVariant = "primary" | "muted" | "white" | "current";

export interface SpinnerProps extends React.HTMLAttributes<SVGElement> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
}

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-10 h-10",
};

const VARIANT_CLASSES: Record<SpinnerVariant, string> = {
  primary: "text-primary",
  muted: "text-muted-foreground",
  white: "text-white",
  current: "text-current",
};

export function Spinner({
  size = "md",
  variant = "primary",
  className,
  ...props
}: SpinnerProps) {
  return (
    <Loader2
      role="status"
      aria-label="Memuat..."
      className={cn(
        "animate-spin shrink-0",
        SIZE_CLASSES[size],
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    />
  );
}
