"use client";

import { useState, useCallback } from "react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { PalettePreset } from "@/lib/theme-presets";
import { isPaletteApplied } from "@/lib/theme-presets";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaletteSectionProps {
  palettes: PalettePreset[];
  theme: UseThemeDraftReturn;
  onApply: (label: string) => void;
  onOpenBrandColor: () => void;
}

export function PaletteSection({
  palettes,
  theme,
  onApply,
  onOpenBrandColor,
}: PaletteSectionProps) {
  const { t } = useI18n();

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {t("dashboard.wizard.theme.paletteTitle", "Palet Warna")}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {palettes.map((preset) => {
          const isActive = isPaletteApplied(preset, theme.applied);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                theme.applyNow(preset.override, preset.name);
                onApply(preset.name);
              }}
              title={preset.name}
              className={cn(
                "relative flex flex-col gap-1.5 rounded-xl border p-2.5 text-left transition-all active:scale-95 cursor-pointer",
                isActive
                  ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(6,182,212,0.3)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
              )}
            >
              {/* Swatch row */}
              <div className="flex gap-0.5 rounded-md overflow-hidden h-6">
                {preset.swatches.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {/* Name */}
              <span className="text-[10px] font-medium text-slate-300 leading-tight truncate">
                {preset.name}
              </span>
              {/* Active checkmark */}
              {isActive && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-black">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}

        {/* Brand Color Card */}
        <button
          type="button"
          onClick={onOpenBrandColor}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-2.5 text-center transition-all hover:border-white/25 hover:bg-white/[0.05] active:scale-95 cursor-pointer"
        >
          <Palette className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-400 leading-tight">
            {t("dashboard.wizard.theme.brandColorCard", "Warna brand saya")}
          </span>
        </button>
      </div>
    </div>
  );
}

