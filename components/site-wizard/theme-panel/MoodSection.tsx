"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import { MOOD_OPTIONS } from "../constants";
import { MoodPill } from "../mood-card";

const MOOD_KEY_MAP: Record<string, string> = {
  "clean-modern": "modernClean",
  "warm-earthy":   "warmVintage",
  "bold-vibrant":  "playfulFun",
  "dark-premium":  "elegantLuxury",
  "bold-dark":     "boldEnergetic",
  "retro":         "retro",
  "futuristic":    "futuristic",
};

interface MoodSectionProps {
  mood: string;
  onSelectMood: (mood: string) => void;
}

export function MoodSection({ mood, onSelectMood }: MoodSectionProps) {
  const { t, isIndonesian } = useI18n();

  // Aktif mood paling depan
  const sortedMoods = React.useMemo(() => {
    const active = MOOD_OPTIONS.filter((m) => m.value === mood);
    const rest   = MOOD_OPTIONS.filter((m) => m.value !== mood);
    return [...active, ...rest];
  }, [mood]);

  return (
    <div className="py-2 space-y-1.5">
      <div className="px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
          {t("dashboard.wizard.theme.moodSection", "Gaya Tampilan")}
        </p>
      </div>

      {/* Single-row horizontal scroll */}
      <div className="[overflow:visible]">
        <div className="flex gap-1.5 pt-1 pb-1 px-4 overflow-x-auto [overflow-y:visible] [scrollbar-width:none] [-webkit-overflow-scrolling:touch]">
          {sortedMoods.map((mo) => {
            const moodKey = MOOD_KEY_MAP[mo.value];
            const label = moodKey
              ? t(
                  `dashboard.wizard.moods.${moodKey}`,
                  isIndonesian ? mo.label : (mo.labelEn || mo.label)
                )
              : (isIndonesian ? mo.label : (mo.labelEn || mo.label));

            return (
              <MoodPill
                key={mo.value}
                value={mo.value}
                label={label}
                isActive={mo.value === mood}
                onClick={() => { if (mo.value !== mood) onSelectMood(mo.value); }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
