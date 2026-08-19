"use client";

import React from "react";
import {
  type IndustryPreset,
  getEnabledIndustryPresets,
  getEnabledTypographyPairings,
  getEnabledColorPatterns,
} from "@/lib/design-assets-config";
import { useI18n } from "@/lib/i18n/context";

const PALETTE_KEYS = ["primary", "accent", "background", "surface", "text"] as const;

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (preset: IndustryPreset) => void;
  onRestoreAi?: () => void;
}

export default function IndustryPresetPicker({
  designToken,
  aiDesignToken,
  designTokenScore,
  onApply,
  onRestoreAi,
}: Props) {
  const { t } = useI18n();
  const currentHeading = designToken?.typography?.heading_font || "";
  const currentBody = designToken?.typography?.body_font || "";
  const currentPalette = designToken?.palette || {};

  const presets = getEnabledIndustryPresets();
  const allPairings = getEnabledTypographyPairings();
  const allPatterns = getEnabledColorPatterns();

  const activePreset = presets.find((preset) => {
    const pairing = allPairings.find((p) => p.id === preset.pairing_id);
    const pattern = allPatterns.find((p) => p.id === preset.pattern_id);
    if (!pairing || !pattern) return false;
    return (
      currentHeading === pairing.heading_font &&
      currentBody === pairing.body_font &&
      currentPalette.primary === pattern.palette.primary &&
      currentPalette.accent === pattern.palette.accent &&
      currentPalette.background === pattern.palette.background &&
      currentPalette.surface === pattern.palette.surface &&
      currentPalette.text === pattern.palette.text
    );
  });

  const aiPalette = aiDesignToken?.palette || {};
  const aiTypography = aiDesignToken?.typography || {};
  const hasAiRecommendation =
    currentPalette.primary && aiTypography.heading_font && (designTokenScore ?? 0) >= 65;
  const isAiActive =
    aiDesignToken?.palette &&
    aiDesignToken?.typography &&
    aiDesignToken.palette.primary === currentPalette.primary &&
    aiDesignToken.palette.accent === currentPalette.accent &&
    aiDesignToken.palette.background === currentPalette.background &&
    aiDesignToken.palette.surface === currentPalette.surface &&
    aiDesignToken.palette.text === currentPalette.text &&
    aiTypography.heading_font === currentHeading &&
    aiTypography.body_font === currentBody;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {t("dashboard.sitesEditor.appearancePreset")}
      </p>

      {hasAiRecommendation && (
        <button
          type="button"
          onClick={onRestoreAi}
          className={`w-full p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
            isAiActive
              ? "border-amber-400 bg-amber-400/10 ring-1 ring-amber-400"
              : "border-dashed border-amber-400/50 bg-amber-400/5 hover:bg-amber-400/10"
          }`}
        >
          <p className="text-[10px] font-bold text-amber-300 mb-1.5 truncate flex items-center gap-1">
            <span>✨</span> {t("dashboard.sitesEditor.aiRecommendation")}
          </p>
          <div className="flex gap-1 mb-1.5">
            {PALETTE_KEYS.map((key) => (
              <div
                key={key}
                className="w-3.5 h-3.5 rounded-sm border border-border"
                style={{ backgroundColor: aiPalette[key] }}
                title={key}
              />
            ))}
          </div>
          <div className="space-y-0.5 pointer-events-none">
            <p
              style={{
                fontFamily: `'${aiTypography.heading_font || "Inter"}', sans-serif`,
                fontWeight: aiTypography.heading_weight ?? "700",
                fontSize: "11px",
                lineHeight: 1.2,
                color: "rgba(252,211,77,0.9)",
                margin: 0,
              }}
            >
              {aiTypography.heading_font || "Heading Font"}
            </p>
            <p
              style={{
                fontFamily: `'${aiTypography.body_font || "Inter"}', sans-serif`,
                fontSize: "9px",
                color: "rgba(252,211,77,0.5)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {aiTypography.body_font || "Body Font"}
            </p>
          </div>
          <p className="text-[9px] text-amber-200/70 leading-tight mt-1">
            {t("dashboard.sitesEditor.aiMadeFor")}
          </p>
        </button>
      )}

      {hasAiRecommendation && (
        <p className="text-[10px] font-medium text-slate-400 text-center">
          {t("dashboard.sitesEditor.orChoosePreset")}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {presets.map((preset) => {
          const pairing = allPairings.find((p) => p.id === preset.pairing_id);
          const pattern = allPatterns.find((p) => p.id === preset.pattern_id);
          const isActive = activePreset?.id === preset.id;

          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onApply(preset)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border hover:border-border bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-sm">{preset.icon}</span>
                <p className="text-[10px] font-bold text-slate-200 truncate">{preset.name}</p>
              </div>
              {pattern && (
                <div className="flex gap-1 mb-1.5">
                  {PALETTE_KEYS.map((key) => (
                    <div
                      key={key}
                      className="w-3.5 h-3.5 rounded-sm border border-border"
                      style={{ backgroundColor: pattern.palette[key] }}
                      title={key}
                    />
                  ))}
                </div>
              )}
              {pairing && (
                <div className="space-y-0.5 pointer-events-none mt-1">
                  <p
                    style={{
                      fontFamily: `'${pairing.heading_font}', sans-serif`,
                      fontWeight: pairing.heading_weight,
                      fontSize: "11px",
                      lineHeight: 1.2,
                      color: "rgba(255,255,255,0.7)",
                      margin: 0,
                    }}
                  >
                    {pairing.heading_font}
                  </p>
                  <p
                    style={{
                      fontFamily: `'${pairing.body_font}', sans-serif`,
                      fontSize: "9px",
                      color: "rgba(255,255,255,0.35)",
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {pairing.body_font}
                  </p>
                </div>
              )}
              <p className="text-[9px] text-slate-500 leading-tight line-clamp-2 mt-1">
                {preset.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
