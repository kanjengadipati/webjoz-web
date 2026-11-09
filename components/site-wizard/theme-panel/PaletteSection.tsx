"use client";

import React from "react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { PalettePreset } from "@/lib/theme-presets";
import { isPaletteApplied } from "@/lib/theme-presets";
import { isColorDark } from "@/components/templates/helpers";
import { Check, ChevronDown, ChevronUp, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_VISIBLE = 4;

interface PaletteSectionProps {
  palettes: PalettePreset[];
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  brandPalette?: Record<string, string> | null;
  brandThemeMode?: "light" | "dark" | null;
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
  brandPalette,
  brandThemeMode,
  onApply,
  onOpenBrandColor,
}: PaletteSectionProps) {
  const { t, locale } = useI18n();
  const isEN = locale === "en";

  const aiPalette = baseToken?.palette || {};
  const isPresetActive = palettes.some((p) => isPaletteApplied(p, theme.applied));

  // Purge stale brand palette key from previous site sessions on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("webjoz_wizard_custom_palette");
      } catch {}
    }
  }, []);

  // Brand palette is strictly scoped to this session's brandLogoPalette
  const activeCustom = brandPalette && Object.keys(brandPalette).length > 0 ? brandPalette : null;
  const activeCustomMode: "light" | "dark" =
    brandThemeMode ??
    (activeCustom?.background ? (isColorDark(activeCustom.background) ? "dark" : "light") : "dark");
  const hasCustomBrandColor = Boolean(activeCustom && activeCustom.primary);

  // Custom is active only if currently applied palette matches activeCustom
  const isCustomActive = Boolean(
    hasCustomBrandColor &&
    activeCustom?.primary &&
    theme.applied.palette?.primary?.toLowerCase() === activeCustom.primary.toLowerCase() &&
    (!activeCustom.background || theme.applied.palette?.background?.toLowerCase() === activeCustom.background.toLowerCase())
  );

  const isAiActive = !isCustomActive && !isPresetActive && (!theme.applied.palette || Object.keys(theme.applied.palette).length === 0);

  // Check if any existing preset matches the AI recommendation
  const matchingPresetIndex = palettes.findIndex((preset) => {
    const p = preset.override.palette;
    if (!p || !aiPalette.primary) return false;
    return (
      p.primary?.toLowerCase() === aiPalette.primary?.toLowerCase() &&
      p.background?.toLowerCase() === aiPalette.background?.toLowerCase()
    );
  });

  // Collapsed/expanded state
  // hasAiCard = true when AI palette is unique (not matching any preset)
  const hasAiCard = matchingPresetIndex === -1 && Boolean(aiPalette.primary);
  // Total cards before custom brand: AI card (0 or 1) + all presets
  const totalCards = (hasAiCard ? 1 : 0) + palettes.length;

  // Auto-expand if the active card is beyond INITIAL_VISIBLE
  const activeIndex = (() => {
    if (isAiActive && hasAiCard) return 0;
    const presetOffset = hasAiCard ? 1 : 0;
    const pi = palettes.findIndex((p) => isPaletteApplied(p, theme.applied));
    return pi >= 0 ? pi + presetOffset : -1;
  })();
  const [showAll, setShowAll] = React.useState(() => activeIndex >= INITIAL_VISIBLE);

  const visibleCount = showAll ? totalCards : Math.min(INITIAL_VISIBLE, totalCards);
  const hiddenCount = totalCards - visibleCount;

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
        {hasAiCard && visibleCount > 0 && (
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

        {/* Preset Palettes — sliced to visibleCount */}
        {palettes.slice(0, visibleCount - (hasAiCard && visibleCount > 0 ? 1 : 0)).map((preset, index) => {
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

      {/* Expand / Collapse toggle */}
      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronDown className="h-3 w-3" />
          {isEN
            ? `See all ${totalCards} palettes`
            : `Lihat semua ${totalCards} palet`}
        </button>
      )}
      {showAll && totalCards > INITIAL_VISIBLE && (
        <button
          type="button"
          onClick={() => setShowAll(false)}
          className="w-full flex items-center justify-center gap-1 py-1 text-[10px] font-semibold text-sidebar-muted-foreground hover:text-sidebar-foreground transition-colors"
        >
          <ChevronUp className="h-3 w-3" />
          {isEN ? "Show less" : "Tampilkan lebih sedikit"}
        </button>
      )}

      {/* Custom Brand Color — always visible outside the collapsed grid */}
      <div className="grid grid-cols-2 gap-2">
        {hasCustomBrandColor && activeCustom ? (
          <div
            onClick={() => {
              if (!isCustomActive && activeCustom) {
                theme.applyNow(
                  {
                    palette: activeCustom,
                    theme_mode: activeCustomMode,
                  },
                  t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")
                );
                onApply(t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya"));
              }
            }}
            className={cn(
              "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between",
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
              <p className="text-[9px] text-sidebar-muted-foreground leading-tight truncate">
                {t("dashboard.wizard.theme.brandColorApplied", "Warna brand")} &middot;{" "}
                {activeCustomMode === "dark" ? "Dark" : "Light"}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenBrandColor();
                }}
                className="text-[9px] text-primary hover:underline font-semibold cursor-pointer shrink-0 ml-1"
              >
                {t("dashboard.sitesEditor.edit", "Ubah")}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenBrandColor}
            className="p-2.5 rounded-xl border border-dashed border-border bg-sidebar hover:bg-sidebar-muted/50 transition-all cursor-pointer text-sidebar-foreground flex flex-col items-center justify-center gap-1.5 text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-sidebar-muted/60 flex items-center justify-center text-sidebar-foreground">
              <Palette className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-sidebar-foreground leading-tight">
              {t("dashboard.wizard.theme.brandColorCard", "Warna brand saya")}
            </span>
            <span className="text-[9px] text-sidebar-muted-foreground leading-tight">
              {t("dashboard.wizard.theme.brandColorDesc", "Upload logo / kustom")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
