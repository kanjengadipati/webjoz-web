"use client";

import React from "react";
import { AlertTriangle, RotateCcw, X } from "lucide-react";

type WizardErrorModalVariant = "warning" | "error";

interface WizardErrorModalProps {
  open: boolean;
  title: string;
  message: string;
  retryLabel?: string;
  cancelLabel?: string;
  variant?: WizardErrorModalVariant;
  onRetry: () => void;
  onCancel: () => void;
}

export function WizardErrorModal({
  open,
  title,
  message,
  retryLabel = "Coba lagi",
  cancelLabel = "Batal",
  variant = "error",
  onRetry,
  onCancel,
}: WizardErrorModalProps) {
  if (!open) return null;

  const isWarning = variant === "warning";
  const accentClass = isWarning ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400";

  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 px-4" onClick={onCancel}>
      <div
        className="w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-300"
        style={{ background: "rgba(17,19,24,0.97)", border: "1px solid rgba(255,255,255,0.1)" }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${accentClass}`}>
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h3 className="mb-2 text-base font-bold text-slate-100">{title}</h3>
          <p className="mb-6 text-xs leading-relaxed text-slate-400">{message}</p>
          <div className="flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300 transition-all active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onRetry}
              className="flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
              style={{ background: "linear-gradient(135deg, #7c3aed, #5b21b6)" }}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {retryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
