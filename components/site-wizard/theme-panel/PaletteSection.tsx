"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { PalettePreset } from "@/lib/theme-presets";
import { isPaletteApplied } from "@/lib/theme-presets";
import { isColorDark } from "@/components/templates/helpers";
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
      className="w-full h-11 rounded-lg p-1.5 flex flex-col justify-between border border-border/40 shadow-2xs relative overflow-hidden mb-2 transition-all"
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
          className="h-3 flex-1 rounded px-1 flex items-center border border-border/30 shadow-2xs min-w-0"
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
  const isPresetActive = palettes.some((p) => isPaletteApplied(p, theme.applied));
  const isAiActive = !theme.applied.palette || Object.keys(theme.applied.palette).length === 0;
  const isCustomApplied =
    !isAiActive && !isPresetActive && Boolean(theme.applied.palette?.primary);

  const [savedCustomPalette, setSavedCustomPalette] = React.useState<{
    palette: Record<string, string>;
    theme_mode?: "light" | "dark";
  } | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem("webjoz_wizard_custom_palette");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    if (isCustomApplied && theme.applied.palette) {
      const data = {
        palette: theme.applied.palette as Record<string, string>,
        theme_mode: theme.applied.theme_mode as "light" | "dark" | undefined,
      };
      setSavedCustomPalette(data);
      try {
        localStorage.setItem("webjoz_wizard_custom_palette", JSON.stringify(data));
      } catch {}
    }
  }, [isCustomApplied, theme.applied.palette, theme.applied.theme_mode]);

  const activeCustom = isCustomApplied ? theme.applied.palette : savedCustomPalette?.palette;
  const hasCustomBrandColor = Boolean(activeCustom && activeCustom.primary);
  const isCustomActive = isCustomApplied;

  // Check if any existing preset matches the AI recommendation
  const matchingPresetIndex = palettes.findIndex((preset) => {
    const p = preset.override.palette;
    if (!p || !aiPalette.primary) return false;
    return (
      p.primary?.toLowerCase() === aiPalette.primary?.toLowerCase() &&
      p.background?.toLowerCase() === aiPalette.background?.toLowerCase()
    );
  });

  return (
    <div className="px-4 py-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.colorPattern", "COLOR PATTERNS")}
        </p>
      </div>

      {/* 2-Column Palette Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* If AI palette is unique (doesn't match any preset), show it as the first card */}
        {matchingPresetIndex === -1 && aiPalette.primary && (
          <button
            type="button"
            onClick={() => {
              theme.resetAll();
              onApply("AI Recommendation");
            }}
            className={cn(
              "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
              isAiActive
                ? "relative border-2 border-primary bg-primary/10 ring-1 ring-primary/40"
                : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <p className="text-[11px] font-bold text-sidebar-foreground truncate">
                    {t("dashboard.wizard.theme.aiPaletteName", "AI Original")}
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded px-1 py-0.2 text-[8px] font-bold bg-sidebar-muted text-sidebar-foreground border border-border">
                    AI Recom
                  </span>
                </div>
                {isAiActive && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                    <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
                  </span>
                )}
              </div>

              {/* Contextual mini preview */}
              <MiniPalettePreview palette={aiPalette} />

              {/* 5 Swatches */}
              <div className="flex gap-1 mb-1.5">
                {[aiPalette.primary, aiPalette.accent, aiPalette.background, aiPalette.surface, aiPalette.text]
                  .filter(Boolean)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="w-4.5 h-4.5 rounded-md border border-border/50 shadow-2xs shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </div>

            <p className="text-[9px] text-sidebar-muted-foreground leading-tight line-clamp-1 mt-0.5">
              {t("dashboard.sitesEditor.aiRecommendation", "Rekomendasi AI")} &middot; {isColorDark(aiPalette.background || "#000") ? "Dark" : "Light"}
            </p>
          </button>
        )}

        {/* Preset Palettes */}
        {palettes.map((preset, index) => {
          const isPresetMatchingAi = index === matchingPresetIndex;
          const isActive = isPresetMatchingAi
            ? isAiActive || isPaletteApplied(preset, theme.applied)
            : isPaletteApplied(preset, theme.applied);
          const p = preset.override.palette || {};

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (isPresetMatchingAi && isAiActive) {
                  // already active AI recommendation
                  return;
                }
                theme.applyNow(preset.override, preset.name);
                onApply(preset.name);
              }}
              className={cn(
                "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
                isActive
                  ? "relative border-2 border-primary bg-primary/10 ring-1 ring-primary/40"
                  : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <p className="text-[11px] font-bold text-sidebar-foreground truncate">
                      {preset.name}
                    </p>
                    {isPresetMatchingAi && (
                      <span className="inline-flex shrink-0 items-center rounded px-1 py-0.2 text-[8px] font-bold bg-sidebar-muted text-sidebar-foreground border border-border">
                        AI Recom
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground shrink-0">
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
                      className="w-4.5 h-4.5 rounded-md border border-border/50 shadow-2xs shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-sidebar-muted-foreground leading-tight line-clamp-1 mt-0.5">
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
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-border bg-sidebar hover:bg-sidebar-muted/50 transition-all cursor-pointer text-sidebar-foreground mt-1"
      >
        <Palette className="h-4 w-4 text-sidebar-foreground shrink-0" />
        <span className="text-xs font-semibold">
          {t("dashboard.wizard.theme.brandColorCard", "Warna brand saya")}
        </span>
      </button>

      {/* Dedicated Card for Custom Brand Color */}
      {hasCustomBrandColor && activeCustom && (
        <div
          onClick={() => {
            if (!isCustomActive) {
              theme.applyNow(
                {
                  palette: activeCustom,
                  theme_mode:
                    savedCustomPalette?.theme_mode ??
                    (isColorDark(activeCustom.background || "#000") ? "dark" : "light"),
                },
                t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")
              );
              onApply(t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya"));
            }
          }}
          className={cn(
            "w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between mt-1",
            isCustomActive
              ? "relative border-2 border-primary bg-primary/10 ring-1 ring-primary/40"
              : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
          )}
        >
          <div>
            <div className="flex items-center justify-between mb-1.5 gap-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <p className="text-[11px] font-bold text-sidebar-foreground truncate">
                  {t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")}
                </p>
                <span className="inline-flex shrink-0 items-center rounded px-1 py-0.2 text-[8px] font-bold bg-sidebar-muted text-sidebar-muted-foreground border border-border">
                  Custom
                </span>
              </div>
              {isCustomActive && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground shrink-0">
                  <Check className="h-2 w-2 stroke-[3]" />
                  <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
                </span>
              )}
            </div>

            {/* Contextual mini preview */}
            <MiniPalettePreview palette={activeCustom} />

            {/* 5 Swatches */}
            <div className="flex gap-1 mb-1.5">
              {[
                activeCustom.primary,
                activeCustom.accent,
                activeCustom.background,
                activeCustom.surface,
                activeCustom.text,
              ]
                .filter(Boolean)
                .map((color, i) => (
                  <div
                    key={i}
                    className="w-4.5 h-4.5 rounded-md border border-border/50 shadow-2xs shrink-0"
                    style={{ backgroundColor: color }}
                  />
                ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-0.5">
            <p className="text-[9px] text-sidebar-muted-foreground leading-tight">
              {t("dashboard.wizard.theme.brandColorApplied", "Warna brand")} &middot;{" "}
              {isColorDark(activeCustom.background || "#000") ? "Dark" : "Light"}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenBrandColor();
              }}
              className="text-[9px] text-primary hover:underline font-semibold cursor-pointer"
            >
              {t("dashboard.sitesEditor.edit", "Ubah")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
