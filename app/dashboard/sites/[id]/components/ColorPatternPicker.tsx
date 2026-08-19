"use client";

import React from "react";
import {
  type ColorPattern,
  getEnabledColorPatterns,
} from "@/lib/design-assets-config";
import { useI18n } from "@/lib/i18n/context";

const PALETTE_KEYS = ["primary", "accent", "background", "surface", "text"] as const;

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (pattern: ColorPattern) => void;
  onRestoreAi?: () => void;
}

export default function ColorPatternPicker({
  designToken,
  aiDesignToken,
  designTokenScore,
  onApply,
  onRestoreAi,
}: Props) {
  const { t } = useI18n();
  const currentPalette = designToken?.palette || {};
  const patterns = getEnabledColorPatterns();
  const aiPalette = aiDesignToken?.palette || currentPalette;

  const activePattern = patterns.find(
    (p) =>
      p.palette.primary === currentPalette.primary &&
      p.palette.accent === currentPalette.accent &&
      p.palette.background === currentPalette.background &&
      p.palette.surface === currentPalette.surface &&
      p.palette.text === currentPalette.text
  );

  const hasAiRecommendation =
    currentPalette.primary &&
    currentPalette.background &&
    currentPalette.text &&
    (designTokenScore ?? 0) >= 65;

  const isAiActive =
    aiDesignToken?.palette &&
    aiDesignToken.palette.primary === currentPalette.primary &&
    aiDesignToken.palette.accent === currentPalette.accent &&
    aiDesignToken.palette.background === currentPalette.background &&
    aiDesignToken.palette.surface === currentPalette.surface &&
    aiDesignToken.palette.text === currentPalette.text;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {t("dashboard.sitesEditor.colorPattern")}
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
                className="w-4 h-4 rounded-sm border border-white/20"
                style={{ backgroundColor: aiPalette[key] }}
                title={key}
              />
            ))}
          </div>
          <p className="text-[9px] text-amber-200/70 leading-tight">
            {t("dashboard.sitesEditor.aiMadeFor")}
          </p>
        </button>
      )}

      {hasAiRecommendation && (
        <p className="text-[10px] font-medium text-slate-400 text-center">
          {t("dashboard.sitesEditor.orChoosePalette")}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {patterns.map((pattern) => {
          const isActive = activePattern?.id === pattern.id;
          return (
            <button
              key={pattern.id}
              type="button"
              onClick={() => onApply(pattern)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "border-primary bg-primary/10 ring-1 ring-primary"
                  : "border-border hover:border-white/30 bg-white/5 hover:bg-white/10"
              }`}
            >
              <p className="text-[10px] font-bold text-slate-200 mb-1.5 truncate">{pattern.name}</p>
              <div className="flex gap-1 mb-1.5">
                {PALETTE_KEYS.map((key) => (
                  <div
                    key={key}
                    className="w-4 h-4 rounded-sm border border-white/20"
                    style={{ backgroundColor: pattern.palette[key] }}
                    title={key}
                  />
                ))}
              </div>
              <p className="text-[9px] text-slate-500 leading-tight line-clamp-2">
                {pattern.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
