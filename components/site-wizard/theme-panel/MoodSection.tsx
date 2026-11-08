"use client";

import React from "react";
import { Check } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { MOOD_OPTIONS } from "../constants";
import { cn } from "@/lib/utils";

interface MoodSectionProps {
  mood: string;
  onSelectMood: (mood: string) => void;
}

export function MoodSection({ mood, onSelectMood }: MoodSectionProps) {
  const { t, isIndonesian } = useI18n();

  return (
    <div className="px-4 py-3 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
          {t("dashboard.wizard.theme.moodSection", "Gaya Tampilan")}
        </p>
        <span className="text-[10px] text-sidebar-muted-foreground truncate">
          {t("dashboard.wizard.theme.moodHint", "Mengubah tampilan, teks tetap")}
        </span>
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {MOOD_OPTIONS.map((mo) => {
          const isActive = mo.value === mood;
          const label = isIndonesian ? mo.label : (mo.labelEn || mo.label);

          return (
            <button
              key={mo.value}
              type="button"
              onClick={() => {
                if (!isActive) {
                  onSelectMood(mo.value);
                }
              }}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer select-none",
                isActive
                  ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                  : "bg-sidebar-muted/40 border-border text-sidebar-foreground hover:bg-sidebar-muted hover:border-sidebar-foreground/30"
              )}
            >
              <span className="text-sm leading-none">{mo.emoji}</span>
              <span>{label}</span>
              {isActive && (
                <Check className="h-3 w-3 stroke-[3] shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

