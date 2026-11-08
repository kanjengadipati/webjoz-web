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
  const isAiActive = !theme.applied.typography || Object.keys(theme.applied.typography).length === 0;

  const matchingPresetIndex = fonts.findIndex(
    (f) =>
      f.heading.toLowerCase() === aiHeading.toLowerCase() &&
      f.body.toLowerCase() === aiBody.toLowerCase()
  );

  return (
    <div className="px-4 py-3 space-y-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                ? "relative border-2 border-cyan-400/80 bg-cyan-500/10 ring-2 ring-cyan-400/30"
                : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5 gap-1">
                <div className="flex items-center gap-1 min-w-0">
                  <p className="text-[11px] font-bold text-slate-100 truncate">
                    {t("dashboard.wizard.theme.aiFontName", "AI Original")}
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded px-1 py-0.2 text-[8px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    AI Recom
                  </span>
                </div>
                {isAiActive && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-400 px-1.5 py-0.5 text-[8px] font-black text-black shrink-0">
                    <Check className="h-2 w-2 stroke-[3]" />
                    <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
                  </span>
                )}
              </div>

              <div className="space-y-0.5 pointer-events-none p-1.5 rounded-md bg-black/25 border border-white/5 mb-1.5">
                <p
                  style={{ fontFamily: `'${aiHeading}', sans-serif`, fontWeight: "700" }}
                  className="text-xs text-white leading-tight"
                >
                  Heading
                </p>
                <p
                  style={{ fontFamily: `'${aiBody}', sans-serif` }}
                  className="text-[9.5px] text-slate-400 leading-normal line-clamp-1"
                >
                  Aa Bb Cc 123
                </p>
              </div>
            </div>

            <p className="text-[9px] text-slate-400 truncate mt-0.5">
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
                  ? "relative border-2 border-cyan-400/80 bg-cyan-500/10 ring-2 ring-cyan-400/30"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-1">
                  <div className="flex items-center gap-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-100 truncate">
                      {preset.name}
                    </p>
                    {isPresetMatchingAi && (
                      <span className="inline-flex shrink-0 items-center rounded px-1 py-0.2 text-[8px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        AI Recom
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-cyan-400 px-1.5 py-0.5 text-[8px] font-black text-black shrink-0">
                      <Check className="h-2 w-2 stroke-[3]" />
                      <span>{t("dashboard.sitesEditor.activeBadge", "In use")}</span>
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 pointer-events-none p-1.5 rounded-md bg-black/25 border border-white/5 mb-1.5">
                  <p
                    style={{ fontFamily: `'${preset.heading}', sans-serif`, fontWeight: "700" }}
                    className="text-xs text-white leading-tight"
                  >
                    Heading
                  </p>
                  <p
                    style={{ fontFamily: `'${preset.body}', sans-serif` }}
                    className="text-[9.5px] text-slate-400 leading-normal line-clamp-1"
                  >
                    Aa Bb Cc 123
                  </p>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 truncate mt-0.5">
                {preset.heading} / {preset.body}
              </p>
            </button>
          );
        })}
      </div>

      {/* Custom Font Button */}
      <button
        type="button"
        onClick={onOpenCustomFont}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all cursor-pointer text-slate-300 mt-1"
      >
        <Type className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-xs font-semibold">
          {t("dashboard.wizard.theme.customFontCard", "Font kustom")}
        </span>
      </button>
    </div>
  );
}
