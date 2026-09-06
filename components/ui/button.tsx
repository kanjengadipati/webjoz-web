import type { ButtonHTMLAttributes, ReactNode } from "react";
import { DISABLED_STYLES, FOCUS_VISIBLE, MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";
import { Spinner, type SpinnerSize } from "./spinner";

type ButtonVariant = "default" | "outline" | "ghost" | "secondary" | "destructive";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
  loading?: boolean;
  loadingText?: ReactNode;
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: "btn-primary",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-border bg-background/50 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground hover:border-accent",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  destructive: "bg-destructive text-white shadow-sm hover:bg-destructive/90",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  lg: "h-11 rounded-md px-8",
  icon: "size-10",
};

export function buttonClassName({ className, variant = "default", size = "default" }: Pick<ButtonProps, "className" | "variant" | "size"> = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background hover:scale-[1.02] active:scale-[0.98]",
    FOCUS_VISIBLE,
    DISABLED_STYLES,
    MOTION.standard,
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className,
  );
}

export function Button({
  children,
  className,
  variant = "default",
  size = "default",
  loading = false,
  loadingText,
  disabled,
  ...props
}: ButtonProps) {
  const spinnerSize: SpinnerSize = size === "sm" ? "xs" : size === "lg" ? "md" : "sm";
  const spinnerVariant = variant === "default" || variant === "destructive" ? "white" : "current";

  return (
    <button
      className={buttonClassName({ className, variant, size })}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <Spinner
          size={spinnerSize}
          variant={spinnerVariant}
          className="shrink-0"
        />
      )}
      {loading && loadingText !== undefined ? loadingText : children}
    </button>
  );
}
