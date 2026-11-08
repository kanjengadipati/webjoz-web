"use client";

import React, { useEffect } from "react";
import { Check, Sparkle, Type } from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";
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

  return (
    <div className="px-4 py-3 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {t("dashboard.sitesEditor.typographyStyle", "TYPOGRAPHY")}
      </p>

      {/* AI Recommendation Font Card */}
      {baseToken?.typography && (
        <button
          type="button"
          onClick={() => {
            theme.applyNow({ typography: undefined });
            onApply("AI Font");
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

          <div className="space-y-0.5 pointer-events-none p-2 rounded-lg bg-black/30 border border-white/5">
            <p
              style={{ fontFamily: `'${aiHeading}', sans-serif`, fontWeight: "700" }}
              className="text-xs text-white leading-tight"
            >
              Heading &middot; {aiHeading}
            </p>
            <p
              style={{ fontFamily: `'${aiBody}', sans-serif` }}
              className="text-[10px] text-slate-400 leading-normal line-clamp-1"
            >
              {t("dashboard.sitesEditor.sampleBusinessDesc", "Teks deskripsi bisnis yang elegan dan mudah dibaca pelanggan.")}
            </p>
          </div>
        </button>
      )}

      {/* Separator */}
      <p className="text-[10px] font-medium text-slate-500 text-center py-0.5">
        {t("dashboard.sitesEditor.orChoosePairing", "— or choose your pairing —")}
      </p>

      {/* 2-Column Font Grid */}
      <div className="grid grid-cols-2 gap-2">
        {fonts.map((preset) => {
          const isActive = isFontApplied(preset, theme.applied);
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
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 transition-all cursor-pointer text-slate-300"
      >
        <Type className="h-4 w-4 text-cyan-400 shrink-0" />
        <span className="text-xs font-semibold">
          {t("dashboard.wizard.theme.customFontCard", "Font kustom")}
        </span>
      </button>
    </div>
  );
}
