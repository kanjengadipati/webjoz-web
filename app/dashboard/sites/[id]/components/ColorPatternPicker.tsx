"use client";

import React from "react";
import {
  type ColorPattern,
  getEnabledColorPatterns,
} from "@/lib/design-assets-config";
import { useI18n } from "@/lib/i18n/context";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Check } from "lucide-react";
import { isColorDark } from "@/components/templates/helpers";

const PALETTE_KEYS = ["primary", "accent", "background", "surface", "text"] as const;

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (pattern: ColorPattern) => void;
  onRestoreAi?: () => void;
}

function MiniPalettePreview({ palette }: { palette: Record<string, string | undefined> }) {
  const bg = palette.background || "#FAF7F2";
  const text = palette.text || "#2C2C2A";
  const primary = palette.primary || "#4F46E5";
  const surface = palette.surface || "#FFFFFF";
  const accent = palette.accent || "#7C3AED";
  const primaryTextColor = isColorDark(primary) ? "#ffffff" : "#0f172a";

  return (
    <div
      className="w-full h-11 rounded-lg p-1.5 flex flex-col justify-between border border-border/70 shadow-2xs relative overflow-hidden mb-2 transition-all"
      style={{ backgroundColor: bg }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-[9px] font-bold tracking-tight truncate max-w-[65px] leading-none"
          style={{ color: text }}
        >
          Aa Preview
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
          style={{ backgroundColor: accent }}
          title={`Aksen: ${accent}`}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <div
          className="px-1.5 py-0.5 rounded text-[8px] font-bold shadow-2xs truncate max-w-[50px] leading-tight"
          style={{
            backgroundColor: primary,
            color: primaryTextColor,
          }}
        >
          Tombol
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
      <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
        {t("dashboard.sitesEditor.colorPattern")}
      </p>

      {hasAiRecommendation && (
        <button
          type="button"
          onClick={onRestoreAi}
          className={`relative w-full p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
            isAiActive
              ? "border-sidebar-border bg-sidebar-muted ring-1 ring-sidebar-border"
              : "border-dashed border-sidebar-border bg-sidebar-muted/50 hover:bg-sidebar-muted"
          }`}
        >
          {isAiActive && (
            <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-black text-primary-foreground">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
              {t("dashboard.sitesEditor.activeBadge")}
            </span>
          )}
          <p className="text-[10px] font-bold text-sidebar-foreground mb-1.5 truncate flex items-center gap-1">
            <SparkleIcon className="h-2.5 w-2.5 shrink-0" /> {t("dashboard.sitesEditor.aiRecommendation")}
          </p>

          {/* Contextual mini preview */}
          <MiniPalettePreview palette={aiPalette} />

          <div className="flex gap-1.5 mb-1.5">
            {PALETTE_KEYS.map((key) => (
              <div
                key={key}
                className="w-6 h-6 rounded-md border border-border/80 shadow-2xs shrink-0 transition-transform hover:scale-105"
                style={{ backgroundColor: aiPalette[key] }}
                title={`${key}: ${aiPalette[key]}`}
              />
            ))}
          </div>
          <p className="text-[9px] text-sidebar-subtle-foreground leading-tight">
            {t("dashboard.sitesEditor.aiMadeFor")}
          </p>
        </button>
      )}

      {hasAiRecommendation && (
        <p className="text-[10px] font-medium text-sidebar-muted-foreground text-center">
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
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? "relative border-2 border-primary bg-primary/10 ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-sidebar-muted hover:bg-sidebar-border"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] font-bold text-sidebar-foreground truncate">{pattern.name}</p>
                  {isActive && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[8px] font-black text-primary-foreground shrink-0">
                      <Check className="h-2 w-2 stroke-[3]" />
                      {t("dashboard.sitesEditor.activeBadge")}
                    </span>
                  )}
                </div>

                {/* Contextual mini preview */}
                <MiniPalettePreview palette={pattern.palette} />

                {/* Larger Swatches */}
                <div className="flex gap-1 mb-1.5">
                  {PALETTE_KEYS.map((key) => (
                    <div
                      key={key}
                      className="w-5.5 h-5.5 rounded-md border border-border/80 shadow-2xs shrink-0 transition-transform hover:scale-105"
                      style={{ backgroundColor: pattern.palette[key] }}
                      title={`${key}: ${pattern.palette[key]}`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-[9px] text-sidebar-subtle-foreground leading-tight line-clamp-2">
                {pattern.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
