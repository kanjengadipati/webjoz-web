"use client";

import React, { useEffect } from "react";
import { Check, Type } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { FontPreset } from "@/lib/theme-presets";
import { isFontApplied } from "@/lib/theme-presets";
import { loadGoogleFont } from "@/components/templates/helpers";
import { cn } from "@/lib/utils";

interface FontSectionProps {
  fonts: FontPreset[];
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onApply: (label: string) => void;
  onOpenCustomFont: () => void;
}

export function FontSection({
  fonts,
  theme,
  baseToken,
  onApply,
  onOpenCustomFont,
}: FontSectionProps) {
  const { t } = useI18n();

  useEffect(() => {
    fonts.forEach((p) => {
      loadGoogleFont(p.heading, p.body);
    });
    if (baseToken?.typography) {
      loadGoogleFont(baseToken.typography.heading_font, baseToken.typography.body_font);
    }
  }, [fonts, baseToken]);

  const aiHeading = baseToken?.typography?.heading_font || "Inter";
  const aiBody = baseToken?.typography?.body_font || "Inter";
  const isPresetActive = fonts.some((f) => isFontApplied(f, theme.applied));

  // Source of truth for custom font: theme.applied.typography (set by commitDraft/applyNow).
  // No localStorage read here — wizard-font-storage.ts handles data-URL persistence separately.
  const activeCustomFont = theme.applied.typography ?? null;
  const hasCustomFont = Boolean(
    activeCustomFont && (activeCustomFont.heading_font || activeCustomFont.body_font) &&
    // Not a preset font — custom means it was explicitly set by user (not AI default)
    !fonts.some((f) => isFontApplied(f, theme.applied))
  );

  const isCustomActive = Boolean(
    hasCustomFont &&
    activeCustomFont &&
    theme.applied.typography?.heading_font === activeCustomFont.heading_font &&
    (!activeCustomFont.body_font || theme.applied.typography?.body_font === activeCustomFont.body_font)
  );

  const isAiActive = !isCustomActive && !isPresetActive && (!theme.applied.typography || Object.keys(theme.applied.typography).length === 0);

  useEffect(() => {
    if (activeCustomFont?.heading_font || activeCustomFont?.body_font) {
      loadGoogleFont(
        activeCustomFont.heading_font,
        activeCustomFont.body_font,
        activeCustomFont.heading_font_url,
        activeCustomFont.body_font_url
      );
    }
  }, [activeCustomFont]);

  const matchingPresetIndex = fonts.findIndex(
    (f) =>
      f.heading.toLowerCase() === aiHeading.toLowerCase() &&
      f.body.toLowerCase() === aiBody.toLowerCase()
  );

  return (
    <div className="px-4 py-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
          {t("dashboard.sitesEditor.typographyStyle", "TYPOGRAPHY")}
        </p>
      </div>

      {/* 2-Column Font Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* If AI font is unique (doesn't match any preset), show it as the first card */}
        {matchingPresetIndex === -1 && baseToken?.typography && (
          <button
            type="button"
            onClick={() => {
              theme.applyNow({ typography: undefined });
              onApply("AI Font");
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
                    {t("dashboard.wizard.theme.aiFontName", "AI Original")}
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

              <div className="space-y-0.5 pointer-events-none p-1.5 rounded-md bg-sidebar-muted/40 border border-border/40 mb-1.5">
                <p
                  style={{ fontFamily: `'${aiHeading}', sans-serif`, fontWeight: "700" }}
                  className="text-xs text-sidebar-foreground leading-tight"
                >
                  Heading
                </p>
                <p
                  style={{ fontFamily: `'${aiBody}', sans-serif` }}
                  className="text-[9.5px] text-sidebar-muted-foreground leading-normal line-clamp-1"
                >
                  Aa Bb Cc 123
                </p>
              </div>
            </div>

            <p className="text-[9px] text-sidebar-muted-foreground truncate mt-0.5">
              {aiHeading} / {aiBody}
            </p>
          </button>
        )}

        {/* Preset Fonts */}
        {fonts.map((preset, index) => {
          const isPresetMatchingAi = index === matchingPresetIndex;
          const isActive = isPresetMatchingAi
            ? isAiActive || isFontApplied(preset, theme.applied)
            : isFontApplied(preset, theme.applied);

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                if (isPresetMatchingAi && isAiActive) {
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

                <div className="space-y-0.5 pointer-events-none p-1.5 rounded-md bg-sidebar-muted/40 border border-border/40 mb-1.5">
                  <p
                    style={{ fontFamily: `'${preset.heading}', sans-serif`, fontWeight: "700" }}
                    className="text-xs text-sidebar-foreground leading-tight"
                  >
                    Heading
                  </p>
                  <p
                    style={{ fontFamily: `'${preset.body}', sans-serif` }}
                    className="text-[9.5px] text-sidebar-muted-foreground leading-normal line-clamp-1"
                  >
                    Aa Bb Cc 123
                  </p>
                </div>
              </div>

              <p className="text-[9px] text-sidebar-muted-foreground truncate mt-0.5">
                {preset.heading} / {preset.body}
              </p>
            </button>
          );
        })}

        {/* Custom Font in Grid */}
        {hasCustomFont && activeCustomFont ? (
          <div
            onClick={() => {
              if (!isCustomActive && activeCustomFont) {
                if (activeCustomFont.heading_font || activeCustomFont.body_font) {
                  loadGoogleFont(
                    activeCustomFont.heading_font,
                    activeCustomFont.body_font,
                    activeCustomFont.heading_font_url,
                    activeCustomFont.body_font_url
                  );
                }
                theme.applyNow(
                  { typography: activeCustomFont },
                  t("dashboard.wizard.theme.customFontTitle", "Font Kustom")
                );
                onApply(t("dashboard.wizard.theme.customFontTitle", "Font Kustom"));
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
                    {activeCustomFont.heading_font || activeCustomFont.body_font}
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

              {/* Font sample preview box */}
              <div className="space-y-0.5 pointer-events-none p-1.5 rounded-md bg-sidebar-muted/40 border border-border/40 mb-1.5">
                <p
                  style={{
                    fontFamily: `'${activeCustomFont.heading_font || "sans-serif"}', sans-serif`,
                    fontWeight: "700",
                  }}
                  className="text-xs text-sidebar-foreground leading-tight"
                >
                  Heading
                </p>
                <p
                  style={{
                    fontFamily: `'${activeCustomFont.body_font || "sans-serif"}', sans-serif`,
                  }}
                  className="text-[9.5px] text-sidebar-muted-foreground leading-normal line-clamp-1"
                >
                  Aa Bb Cc 123
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-0.5">
              <p className="text-[9px] text-sidebar-muted-foreground truncate">
                {activeCustomFont.heading_font || "Default"} / {activeCustomFont.body_font || "Default"}
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenCustomFont();
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
            onClick={onOpenCustomFont}
            className="p-2.5 rounded-xl border border-dashed border-border bg-sidebar hover:bg-sidebar-muted/50 transition-all cursor-pointer text-sidebar-foreground flex flex-col items-center justify-center gap-1.5 text-center"
          >
            <div className="w-8 h-8 rounded-lg bg-sidebar-muted/60 flex items-center justify-center text-sidebar-foreground">
              <Type className="h-4 w-4" />
            </div>
            <span className="text-[11px] font-bold text-sidebar-foreground leading-tight">
              {t("dashboard.wizard.theme.customFontCard", "Font kustom")}
            </span>
            <span className="text-[9px] text-sidebar-muted-foreground leading-tight">
              {t("dashboard.wizard.theme.customFontDesc", "Upload / Google Fonts")}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
