"use client";

import { useEffect, useRef } from "react";
import { CheckIcon, RotateCcw } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";

interface UndoToastProps {
  label: string | null;
  theme: UseThemeDraftReturn;
  onDismiss: () => void;
}

export function UndoToast({ label, theme, onDismiss }: UndoToastProps) {
  const { t } = useI18n();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!label) return;
    // Auto-dismiss after 4 seconds
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [label, onDismiss]);

  if (!label) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-3 fade-in duration-300">
      <div className="flex items-center gap-3 rounded-xl bg-sidebar border border-border px-4 py-3 shadow-2xl backdrop-blur-sm">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <CheckIcon className="h-3.5 w-3.5" />
        </span>
        <p className="flex-1 text-xs font-medium text-sidebar-foreground">
          {t("dashboard.wizard.theme.toastApplied", "{label} diterapkan", { label })}
        </p>
        {theme.canUndo && (
          <button
            type="button"
            onClick={() => {
              theme.undo();
              onDismiss();
            }}
            className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary/80 transition-colors active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            {t("dashboard.wizard.theme.toastUndo", "Urungkan")}
          </button>
        )}
      </div>
    </div>
  );
}

