"use client";

import React from "react";

interface WizardSheetProps {
  open: boolean;
  title: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  /** Max height of the sheet, default "60dvh" */
  maxHeight?: string;
  /** Accessible dialog label, defaults to string title */
  ariaLabel?: string;
}

/**
 * Reusable bottom-sheet base for all wizard drawers.
 * Handles: backdrop tap-to-close, handle bar, header with ✕ button,
 * slide-in animation, safe-area padding.
 */
export function WizardSheet({
  open,
  title,
  onClose,
  children,
  maxHeight = "60dvh",
  ariaLabel,
}: WizardSheetProps) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop — tap to close, no dim */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        role="dialog"
        aria-label={ariaLabel ?? (typeof title === "string" ? title : undefined)}
        className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl bg-sidebar text-sidebar-foreground border-t border-border shadow-2xl animate-in slide-in-from-bottom duration-300"
        style={{ maxHeight, paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Handle bar — tap to close */}
        <button
          type="button"
          onClick={onClose}
          className="flex flex-col items-center justify-center pt-3 pb-2 w-full shrink-0 cursor-pointer group"
          aria-label="Tutup"
        >
          <div className="h-1 w-10 rounded-full bg-sidebar-muted-foreground/30 group-active:bg-sidebar-muted-foreground/60 transition-colors" />
        </button>

        {/* Header */}
        <div className="flex items-center px-4 py-2 shrink-0">
          <p className="text-sm font-bold text-sidebar-foreground flex-1">{title}</p>
        </div>

        {/* Content */}
        {children}
      </div>
    </>
  );
}
