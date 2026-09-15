"use client";

import {
  useState,
  useRef,
  useEffect,
  useId,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomSelectOption<T extends string = string> {
  value: T;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface CustomSelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: CustomSelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: "sm" | "default" | "lg";
  error?: boolean | string;
  id?: string;
}

export function CustomSelect<T extends string = string>({
  value,
  onChange,
  options,
  placeholder = "Pilih opsi...",
  disabled = false,
  className,
  triggerClassName,
  menuClassName,
  size = "default",
  error,
  id,
}: CustomSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedOption = options.find(o => o.value === value);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [open]);

  // Sync highlighted index with selected value when opened
  useEffect(() => {
    if (open) {
      const idx = options.findIndex(o => o.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [open, value, options]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || highlightedIndex < 0 || !menuRef.current) return;
    const item = menuRef.current.children[highlightedIndex] as HTMLElement | undefined;
    if (item) {
      item.scrollIntoView({ block: "nearest" });
    }
  }, [open, highlightedIndex]);

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => {
          let next = prev + 1;
          while (next < options.length && options[next]?.disabled) {
            next++;
          }
          return next < options.length ? next : prev;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => {
          let next = prev - 1;
          while (next >= 0 && options[next]?.disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (highlightedIndex >= 0 && options[highlightedIndex] && !options[highlightedIndex].disabled) {
          onChange(options[highlightedIndex].value);
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const sizeClasses = {
    sm: "min-h-[36px] px-3 py-1.5 text-xs",
    default: "min-h-[42px] px-3.5 py-2 text-sm",
    lg: "min-h-[48px] px-4 py-2.5 text-base",
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        id={id}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => !disabled && setOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        className={cn(
          "group flex w-full items-center justify-between gap-3 rounded-xl border border-border/80 bg-background/80 hover:bg-background text-left font-medium text-foreground transition-all duration-200 outline-none cursor-pointer shadow-2xs",
          "hover:border-foreground/30 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20",
          open && "border-primary ring-2 ring-primary/20 bg-background shadow-sm",
          error && "border-destructive focus-visible:ring-destructive",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none",
          sizeClasses[size],
          triggerClassName
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <span className="shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
                  {selectedOption.icon}
                </span>
              )}
              <div className="flex items-baseline gap-2 min-w-0 truncate">
                <span className="font-semibold text-foreground truncate">
                  {selectedOption.label}
                </span>
                {selectedOption.sublabel && (
                  <span className="text-[11px] text-muted-foreground font-mono truncate px-1.5 py-0.5 rounded-md bg-muted/60 dark:bg-white/5 border border-border/40">
                    {selectedOption.sublabel}
                  </span>
                )}
              </div>
            </>
          ) : (
            <span className="text-muted-foreground text-sm font-normal">
              {placeholder}
            </span>
          )}
        </div>

        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180 text-foreground"
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          className={cn(
            "absolute left-0 top-full z-50 mt-1.5 w-full rounded-2xl border border-border/80 bg-popover/98 text-popover-foreground p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-150",
            menuClassName
          )}
        >
          <div ref={menuRef} className="max-h-60 overflow-y-auto space-y-1 p-0.5 overscroll-contain focus:outline-none">
            {options.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-muted-foreground">
                Tidak ada opsi tersedia
              </div>
            ) : (
              options.map((opt, idx) => {
                const isSelected = opt.value === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onClick={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={cn(
                      "group/item relative flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors cursor-pointer select-none",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : isHighlighted
                        ? "bg-muted/70 dark:bg-white/10 text-foreground"
                        : "text-foreground hover:bg-muted/60 dark:hover:bg-white/5",
                      opt.disabled && "opacity-40 cursor-not-allowed pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {opt.icon && (
                        <span
                          className={cn(
                            "shrink-0 transition-colors",
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground group-hover/item:text-foreground"
                          )}
                        >
                          {opt.icon}
                        </span>
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{opt.label}</span>
                          {opt.badge && (
                            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-primary/10 text-primary">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        {opt.sublabel && (
                          <span
                            className={cn(
                              "text-[11px] font-mono truncate mt-0.5",
                              isSelected
                                ? "text-primary/70"
                                : "text-muted-foreground"
                            )}
                          >
                            {opt.sublabel}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="size-4 shrink-0 text-primary animate-in zoom-in-50 duration-150" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
