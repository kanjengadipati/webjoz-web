import type { HTMLAttributes, ReactNode } from "react";
import { MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

type CardVariant = "default" | "elevated" | "outlined";

interface CardProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  variant?: CardVariant;
}

const CARD_VARIANTS: Record<CardVariant, string> = {
  default: "border-border/70 bg-card/60 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)]",
  elevated: "border-border/60 bg-card/80 shadow-xl shadow-primary/5",
  outlined: "border-border/80 bg-background/40 shadow-none",
};

export function Card({ children, className, variant = "default", ...props }: CardProps) {
  return (
    <section
      className={cn(
        "rounded-3xl border text-card-foreground backdrop-blur-md hover:bg-card/80 hover:border-primary/20 hover:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.15)]",
        MOTION.standard,
        CARD_VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

export function CardHeader({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>{children}</div>;
}

export function CardTitle({ children, className, ...props }: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) {
  return <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>{children}</h3>;
}

export function CardDescription({ children, className, ...props }: HTMLAttributes<HTMLParagraphElement> & { children: ReactNode }) {
  return <p className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props}>{children}</p>;
}

export function CardContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={cn("p-6 pt-0", className)} {...props}>{children}</div>;
}

export function CardFooter({ children, className, ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return <div className={cn("flex items-center p-6 pt-0", className)} {...props}>{children}</div>;
}
