import type {
  InputHTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { DISABLED_STYLES, FOCUS_VISIBLE, MOTION } from "@/lib/ui-tokens";
import { cn } from "@/lib/utils";

type InputVariant = "default" | "filled" | "flushed" | "outline";
type InputSize = "sm" | "default" | "lg";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  inputSize?: InputSize;
  error?: string;
  helperText?: string;
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
}

export function inputClassName({
  className,
  variant = "default",
  size = "default",
  error,
}: {
  className?: string;
  variant?: InputVariant;
  size?: InputSize;
  error?: boolean;
}) {
  const variants: Record<InputVariant, string> = {
    default: "border-input bg-background/50 focus-visible:bg-background/80",
    filled: "border-transparent bg-muted/50 focus-visible:bg-muted/70",
    flushed: "rounded-none border-x-0 border-t-0 border-input bg-transparent px-0",
    outline: "border-2 border-border/50 bg-background",
  };
  const sizes: Record<InputSize, string> = {
    sm: "h-8 px-2 text-xs",
    default: "h-10 px-3 py-2 text-sm",
    lg: "h-12 px-4 text-base",
  };

  return cn(
    "flex w-full rounded-md border ring-offset-background placeholder:text-muted-foreground",
    FOCUS_VISIBLE,
    DISABLED_STYLES,
    MOTION.standard,
    variants[variant],
    sizes[size],
    error && "border-destructive focus-visible:ring-destructive",
    className,
  );
}

export function Input({ className, variant, inputSize, error, helperText, name, ...props }: InputProps) {
  const describedBy = error ? `${name || props.id}-error` : helperText ? `${name || props.id}-helper` : undefined;

  return (
    <div className={cn((error || helperText) && "space-y-1")}>
      <input
        {...props}
        name={name}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={inputClassName({ className, variant, size: inputSize, error: Boolean(error) })}
      />
      {error ? <p id={`${name || props.id}-error`} className="text-xs font-medium text-destructive">{error}</p> : null}
      {helperText ? <p id={`${name || props.id}-helper`} className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}

export function Textarea({ className, error, name, ...props }: TextareaProps) {
  return (
    <textarea
      {...props}
      name={name}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name || props.id}-error` : undefined}
      className={cn(inputClassName({ className, error: Boolean(error) }), "min-h-24 resize-y py-3")}
    />
  );
}

export function Select({ className, error, name, children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      name={name}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${name || props.id}-error` : undefined}
      className={inputClassName({ className, error: Boolean(error) })}
    >
      {children}
    </select>
  );
}

export function Checkbox({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4 rounded border border-input accent-primary",
        FOCUS_VISIBLE,
        DISABLED_STYLES,
        className,
      )}
      {...props}
    />
  );
}

export function Label({ children, className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("mb-2 block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props}>
      {children}
    </label>
  );
}

export function FormField({
  label,
  error,
  children,
  required,
  helperText,
}: {
  label: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
  helperText?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required ? <span className="ml-1 text-destructive">*</span> : null}
      </Label>
      {children}
      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
