import type { HTMLAttributes, ReactNode } from "react";
import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "secondary" | "outline" | "destructive";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: BadgeVariant;
}

const BADGE_VARIANTS: Record<BadgeVariant, string> = {
  default: "border-transparent bg-primary/90 text-primary-foreground shadow-sm hover:bg-primary",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border-border/80 bg-background/50 backdrop-blur-sm text-foreground",
  destructive: "border-transparent bg-destructive text-white hover:bg-destructive/80",
};

export function Badge({ children, className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wider uppercase",
        MOTION.standard,
        BADGE_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
