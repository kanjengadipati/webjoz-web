"use client";
import React, { useCallback } from "react";
import { Plus } from "lucide-react";

const NANOID_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

/** Tiny deterministic-ish id helper for freshly added menu/catalog items & categories. */
export function genId(size = 10): string {
  let id = "";
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  for (let i = 0; i < size; i++) id += NANOID_CHARS[bytes[i] % NANOID_CHARS.length];
  return id;
}

const stop = (e: React.SyntheticEvent) => {
  e.stopPropagation();
};

/**
 * Inline "add item" tile rendered on the editor canvas (mirrors gallery's
 * GalleryAddTile). Only shown while isEditorMode is true.
 * Stops propagation on click/pointer/touch so it never triggers section
 * selection or inline-editing handlers of the surrounding canvas.
 */
export function InlineAddTile({
  label,
  onClick,
  compact = false,
  variant = "card",
  style,
  className,
}: {
  label: string;
  onClick: () => void;
  compact?: boolean;
  variant?: "card" | "bar";
  style?: React.CSSProperties;
  className?: string;
}) {
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        stop(e);
        onClick();
      }
    },
    [onClick]
  );

  if (variant === "card" && !compact) {
    return (
      <div
        role="button"
        tabIndex={0}
        title={label}
        aria-label={label}
        onClick={(e) => {
          stop(e);
          onClick();
        }}
        onPointerDown={stop}
        onTouchStart={stop}
        onKeyDown={handleKey}
        className={`group flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-all duration-200 cursor-pointer p-6 select-none hover:shadow-md min-h-[240px] rounded-2xl w-full ${className ?? ""}`}
        style={{
          borderColor: "color-mix(in srgb, var(--dt-primary, #6366f1) 45%, rgba(100, 116, 139, 0.35))",
          background: "color-mix(in srgb, var(--dt-primary, #6366f1) 6%, rgba(100, 116, 139, 0.04))",
          color: "var(--dt-text, currentColor)",
          ...style,
        }}
      >
        {/* Prominent Plus Icon Circle (matches Gallery style) */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-full transition-transform duration-200 group-hover:scale-110 shadow-sm"
          style={{
            background: "color-mix(in srgb, var(--dt-primary, #6366f1) 18%, rgba(100, 116, 139, 0.12))",
            color: "var(--dt-primary, #6366f1)",
            border: "1px solid color-mix(in srgb, var(--dt-primary, #6366f1) 30%, transparent)",
          }}
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </div>

        {/* Label */}
        <span
          className="text-xs font-bold tracking-wide"
          style={{ color: "var(--dt-text, currentColor)" }}
        >
          {label}
        </span>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      title={label}
      aria-label={label}
      onClick={(e) => {
        stop(e);
        onClick();
      }}
      onPointerDown={stop}
      onTouchStart={stop}
      onKeyDown={handleKey}
      className={`group flex items-center justify-center gap-2.5 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 select-none hover:shadow-2xs ${
        compact ? "" : "min-h-[3.25rem]"
      } ${className ?? ""}`}
      style={{
        padding: compact ? "0.5rem 0.875rem" : "0.75rem 1.25rem",
        borderColor: "color-mix(in srgb, var(--dt-primary, #6366f1) 45%, rgba(100, 116, 139, 0.35))",
        background: "color-mix(in srgb, var(--dt-primary, #6366f1) 6%, rgba(100, 116, 139, 0.04))",
        color: "var(--dt-text, currentColor)",
        ...style,
      }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-2xs"
        style={{
          background: "color-mix(in srgb, var(--dt-primary, #6366f1) 18%, rgba(100, 116, 139, 0.12))",
          color: "var(--dt-primary, #6366f1)",
          border: "1px solid color-mix(in srgb, var(--dt-primary, #6366f1) 30%, transparent)",
        }}
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
      </span>
      <span
        className="text-xs font-bold tracking-wide"
        style={{ color: "var(--dt-text, currentColor)" }}
      >
        {label}
      </span>
    </div>
  );
}