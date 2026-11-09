"use client";

import React from "react";
import { Check, Leaf, Palette, Crown, Zap, Hourglass, Bot } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";
import { MOOD_OPTIONS } from "../constants";
import { cn } from "@/lib/utils";

interface MoodSectionProps {
  mood: string;
  onSelectMood: (mood: string) => void;
}

const MOOD_ICON_MAP: Record<
  string,
  {
    icon: React.ReactNode;
    bg: string;
    text: string;
    glow: string;
  }
> = {
  "clean-modern":  { icon: <SparkleIcon className="w-3.5 h-3.5" />, bg: "bg-blue-500/15",    text: "text-blue-400",    glow: "shadow-blue-500/20" },
  "warm-earthy":   { icon: <Leaf        className="w-3.5 h-3.5" />, bg: "bg-emerald-600/15", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
  "bold-vibrant":  { icon: <Palette     className="w-3.5 h-3.5" />, bg: "bg-orange-500/15",  text: "text-orange-400",  glow: "shadow-orange-500/20" },
  "dark-premium":  { icon: <Crown       className="w-3.5 h-3.5" />, bg: "bg-yellow-500/15",  text: "text-yellow-400",  glow: "shadow-yellow-500/20" },
  "bold-dark":     { icon: <Zap         className="w-3.5 h-3.5" />, bg: "bg-red-500/15",     text: "text-red-400",     glow: "shadow-red-500/20" },
  "retro":         { icon: <Hourglass   className="w-3.5 h-3.5" />, bg: "bg-amber-600/15",   text: "text-amber-400",   glow: "shadow-amber-600/20" },
  "futuristic":    { icon: <Bot         className="w-3.5 h-3.5" />, bg: "bg-cyan-500/15",    text: "text-cyan-400",    glow: "shadow-cyan-500/20" },
};

const MOOD_KEY_MAP: Record<string, string> = {
  "clean-modern": "modernClean",
  "warm-earthy": "warmVintage",
  "bold-vibrant": "playfulFun",
  "dark-premium": "elegantLuxury",
  "bold-dark": "boldEnergetic",
  "retro": "retro",
  "futuristic": "futuristic",
};

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

      <div className="grid grid-cols-2 gap-1.5">
        {MOOD_OPTIONS.map((mo, idx) => {
          const isActive = mo.value === mood;
          const isLast = idx === MOOD_OPTIONS.length - 1;
          const moodKey = MOOD_KEY_MAP[mo.value];
          const label = moodKey
            ? t(`dashboard.wizard.moods.${moodKey}`, isIndonesian ? mo.label : (mo.labelEn || mo.label))
            : (isIndonesian ? mo.label : (mo.labelEn || mo.label));

          const cfg = MOOD_ICON_MAP[mo.value] ?? {
            icon: <SparkleIcon className="w-3.5 h-3.5" />,
            bg: "bg-white/10",
            text: "text-slate-300",
            glow: "",
          };

          return (
            <button
              key={mo.value}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                if (!isActive) {
                  onSelectMood(mo.value);
                }
              }}
              className={cn(
                "group relative flex items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-all cursor-pointer select-none",
                isLast && "col-span-2",
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs"
                  : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
              )}
            >
              {/* Icon badge matching chat wizard */}
              <div
                className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform duration-200",
                  cfg.bg,
                  cfg.text,
                  isActive ? "scale-105" : "group-hover:scale-105"
                )}
              >
                {cfg.icon}
              </div>

              {/* Mood label */}
              <span
                className={cn(
                  "text-xs leading-tight truncate flex-1 min-w-0",
                  isActive
                    ? "font-bold text-sidebar-foreground"
                    : "font-medium text-sidebar-foreground/90 group-hover:text-sidebar-foreground"
                )}
              >
                {label}
              </span>

              {/* Active check indicator */}
              {isActive && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground shrink-0 shadow-2xs">
                  <Check className="h-2.5 w-2.5 stroke-[3]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
