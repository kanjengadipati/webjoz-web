"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  size?: "sm" | "md";
  variant?: "emerald" | "primary";
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      checked,
      onCheckedChange,
      size = "md",
      variant = "emerald",
      className,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const isSm = size === "sm";

    const activeBg =
      variant === "primary"
        ? "bg-primary dark:bg-emerald-500"
        : "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400";

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={(e) => {
          if (disabled) return;
          onClick?.(e);
          onCheckedChange?.(!checked);
        }}
        className={cn(
          "relative inline-flex shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isSm ? "h-5 w-9" : "h-6 w-11",
          checked
            ? activeBg
            : "bg-muted-foreground/30 hover:bg-muted-foreground/40 dark:bg-zinc-700/80 dark:hover:bg-zinc-700 border border-border/30",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block rounded-full bg-white shadow-md ring-0 transition-transform duration-200 ease-in-out",
            isSm ? "size-3.5" : "size-5",
            isSm
              ? checked
                ? "translate-x-[18px]"
                : "translate-x-0.5"
              : checked
                ? "translate-x-[22px]"
                : "translate-x-0.5"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
