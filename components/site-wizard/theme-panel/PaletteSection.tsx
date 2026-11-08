"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { PalettePreset } from "@/lib/theme-presets";
import { isPaletteApplied } from "@/lib/theme-presets";
import { isEmptyOverrides } from "@/lib/theme-overrides";
import { isColorDark } from "@/components/templates/helpers";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaletteSectionProps {
  palettes: PalettePreset[];
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onApply: (label: string) => void;
  onOpenBrandColor: () => void;
}

function MiniPalettePreview({
  palette,
}: {
  palette: { primary?: string; accent?: string; background?: string; surface?: string; text?: string };
}) {
  const bg = palette.background || "#0D0D0B";
  const text = palette.text || "#F5F0E8";
  const primary = palette.primary || "#D4AF37";
  const surface = palette.surface || "#1F1F1D";
  const accent = palette.accent || "#F5F0E8";
  const primaryTextColor = isColorDark(primary) ? "#ffffff" : "#0f172a";

  return (
    <div
      className="w-full h-11 rounded-lg p-1.5 flex flex-col justify-between border border-white/10 shadow-2xs relative overflow-hidden mb-2 transition-all"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] font-bold tracking-tight truncate max-w-[70px] leading-none"
          style={{ color: text }}
        >
          Aa Preview
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
          style={{ backgroundColor: accent }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="px-1.5 py-0.5 rounded text-[8px] font-bold shadow-2xs truncate max-w-[55px] leading-tight"
          style={{
            backgroundColor: primary,
            color: primaryTextColor,
          }}
        >
          Button
        </div>
        <div
          className="h-3 flex-1 rounded px-1 flex items-center border border-white/10 shadow-2xs min-w-0"
          style={{ backgroundColor: surface }}
        >
          <div
            className="w-2/3 h-1 rounded-full opacity-60"
            style={{ backgroundColor: text }}
          />
        </div>
      </div>
    </div>
  );
}

export function PaletteSection({
  palettes,
  theme,
  baseToken,
  onApply,
  onOpenBrandColor,
}: PaletteSectionProps) {
  const { t, locale } = useI18n();
  const isEN = locale === "en";

  const aiPalette = baseToken?.palette || {};
  const isAiActive = !theme.applied.palette || Object.keys(theme.applied.palette).length === 0;

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {t("dashboard.sitesEditor.colorPattern", "COLOR PATTERNS")}
      </p>

      {/* AI Recommendation Card */}
      {aiPalette.primary && (
        <button
          type="button"
          onClick={() => {
            theme.resetAll();
            onApply("AI Recommendation");
          }}
          className={cn(
            "relative w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer",
            isAiActive
              ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400/40"
              : "border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25"
          )}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
              <SparkleIcon className="h-3 w-3 text-cyan-400 shrink-0" />
              <span>{t("dashboard.sitesEditor.aiRecommendation", "AI Recommendation")}</span>
            </p>
            {isAiActive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-400 px-1.5 py-0.5 text-[9px] font-bold text-black">
                <Check className="h-2.5 w-2.5 stroke-[3]" />
                <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
              </span>
            )}
          </div>

          <MiniPalettePreview palette={aiPalette} />

          <div className="flex gap-1.5 mb-1.5">
            {[aiPalette.primary, aiPalette.accent, aiPalette.background, aiPalette.surface, aiPalette.text]
              .filter(Boolean)
              .map((color, i) => (
                <div
                  key={i}
                  className="w-5 h-5 rounded-md border border-white/20 shadow-2xs shrink-0"
                  style={{ backgroundColor: color }}
                />
              ))}
          </div>
          <p className="text-[9.5px] text-slate-400 leading-tight">
            {t("dashboard.sitesEditor.aiMadeFor", "Dibuat khusus dari info bisnis Anda")}
          </p>
        </button>
      )}

      {/* Separator */}
      <p className="text-[10px] font-medium text-slate-500 text-center py-0.5">
        {t("dashboard.sitesEditor.orChoosePalette", "— or choose your favorite palette —")}
      </p>

      {/* 2-Column Palette Grid */}
      <div className="grid grid-cols-2 gap-2">
        {palettes.map((preset) => {
          const isActive = isPaletteApplied(preset, theme.applied);
          const p = preset.override.palette || {};
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                theme.applyNow(preset.override, preset.name);
                onApply(preset.name);
              }}
              className={cn(
                "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                isActive
                  ? "relative border-2 border-cyan-400/80 bg-cyan-500/10 ring-2 ring-cyan-400/30"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[11px] font-bold text-slate-100 truncate pr-1">
                    {preset.name}
                  </p>
                  {isActive && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-400 px-1.5 py-0.5 text-[8px] font-black text-black shrink-0">
                      <Check className="h-2 w-2 stroke-[3]" />
                      <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
                    </span>
                  )}
                </div>

                {/* Contextual mini preview */}
                <MiniPalettePreview palette={p} />

                {/* 5 Swatches */}
                <div className="flex gap-1 mb-1.5">
                  {preset.swatches.map((color, i) => (
                    <div
                      key={i}
                      className="w-4.5 h-4.5 rounded-md border border-white/20 shadow-2xs shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-slate-400 leading-tight line-clamp-1 mt-0.5">
                {isEN ? preset.nameEn : preset.name} &middot; {isColorDark(p.background || "#000") ? "Dark" : "Light"}
              </p>
            </button>
          );
        })}
      </div>

      {/* Brand Color Card Button */}
      <button
        type="button"
        onClick={onOpenBrandColor}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all cursor-pointer text-slate-300"
      >
        <Palette className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-xs font-semibold">
          {t("dashboard.wizard.theme.brandColorCard", "Warna brand saya")}
        </span>
      </button>
    </div>
  );
}
