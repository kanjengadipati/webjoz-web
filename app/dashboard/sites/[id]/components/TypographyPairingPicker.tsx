"use client";

import React, { useState, useEffect } from "react";
import {
  type TypographyPairing,
  getEnabledTypographyPairings,
} from "@/lib/design-assets-config";
import { loadGoogleFont } from "@/components/templates/helpers";
import FontPicker from "./FontPicker";
import { useI18n } from "@/lib/i18n/context";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Check } from "lucide-react";

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (pairing: TypographyPairing) => void;
  onFieldChange?: (field: string, subfield: string, value: string) => void;
  onRestoreAi?: () => void;
}

export default function TypographyPairingPicker({
  designToken,
  aiDesignToken,
  designTokenScore,
  onApply,
  onFieldChange,
  onRestoreAi,
}: Props) {
  const { t } = useI18n();
  const [showManual, setShowManual] = useState(false);
  const pairings = getEnabledTypographyPairings();

  useEffect(() => {
    pairings.forEach((p) => loadGoogleFont(p.heading_font, p.body_font));
  }, []);

  const currentHeading = designToken?.typography?.heading_font || "Inter";
  const currentBody = designToken?.typography?.body_font || "Inter";
  const aiTypography = aiDesignToken?.typography || designToken?.typography || {};
  const aiHeading = aiTypography.heading_font || "Inter";
  const aiBody = aiTypography.body_font || "Inter";
  const activePairing = pairings.find(
    (p) => p.heading_font === currentHeading && p.body_font === currentBody
  );
  const hasAiRecommendation =
    designToken?.typography?.heading_font && (designTokenScore ?? 0) >= 65;
  const isAiActive =
    aiTypography.heading_font === currentHeading &&
    aiTypography.body_font === currentBody;

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground">
        {t("dashboard.sitesEditor.typographyStyle")}
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
          <p className="text-[10px] font-bold text-sidebar-foreground mb-1 truncate flex items-center gap-1">
            <SparkleIcon className="h-2.5 w-2.5 shrink-0" />
            {t("dashboard.sitesEditor.aiRecommendation")}
          </p>
          <div className="space-y-0.5 pointer-events-none">
            <p
              style={{
                fontFamily: `'${aiHeading}', sans-serif`,
                fontWeight: aiTypography.heading_weight ?? "700",
                fontStyle: aiTypography.heading_style ?? "normal",
                textTransform: (aiTypography.heading_transform ?? "none") as any,
                letterSpacing: aiTypography.heading_tracking ?? "normal",
                fontSize: "13px",
                lineHeight: 1.2,
                margin: 0,
              }}
              className="text-sidebar-foreground"
            >
              Heading
            </p>
            <p
              style={{
                fontFamily: `'${aiBody}', sans-serif`,
                fontSize: "10px",
                margin: 0,
                lineHeight: 1.4,
              }}
              className="text-sidebar-muted-foreground"
            >
              Teks deskripsi bisnis Anda...
            </p>
          </div>
        </button>
      )}

      {hasAiRecommendation && (
        <p className="text-[10px] font-medium text-sidebar-muted-foreground text-center">
          {t("dashboard.sitesEditor.orChoosePairing")}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {pairings.map((pairing) => {
          const isActive = activePairing?.id === pairing.id;
          return (
            <button
              key={pairing.id}
              type="button"
              onClick={() => onApply(pairing)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isActive
                  ? "relative border-2 border-primary bg-primary/10 ring-2 ring-primary/30"
                  : "border-border hover:border-primary/40 bg-sidebar-muted hover:bg-sidebar-border"
              }`}
            >
              {isActive && (
                  <span className="absolute top-1.5 right-1.5 z-10 inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-black text-primary-foreground">
              <Check className="h-2.5 w-2.5 stroke-[3]" />
              {t("dashboard.sitesEditor.activeBadge")}
            </span>
              )}
              <p className={`text-[10px] font-bold text-sidebar-foreground mb-1 truncate ${isActive ? "pr-16" : ""}`}>{pairing.name}</p>
              <div className="space-y-0.5 pointer-events-none">
                <p
                  style={{
                    fontFamily: `'${pairing.heading_font}', sans-serif`,
                    fontWeight: pairing.heading_weight,
                    fontStyle: pairing.heading_style ?? "normal",
                    textTransform: (pairing.heading_transform ?? "none") as any,
                    letterSpacing: pairing.heading_tracking ?? "normal",
                    fontSize: "13px",
                    lineHeight: 1.2,
                  }}
                  className="text-sidebar-foreground"
                >
                  Heading
                </p>
                <p
                  style={{
                    fontFamily: `'${pairing.body_font}', sans-serif`,
                    fontSize: "10px",
                    lineHeight: 1.4,
                  }}
                  className="text-sidebar-muted-foreground"
                >
                  Teks deskripsi bisnis Anda...
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowManual((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-sidebar-subtle-foreground hover:text-sidebar-foreground transition-colors cursor-pointer"
      >
        <span>{showManual ? "▾" : "▸"}</span>
        {t("dashboard.sitesEditor.manualFineTune")}
      </button>

      {showManual && (
        <div className="space-y-2 pl-3 border-l border-border">
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.headingFont")}
            </label>
            <FontPicker
              value={currentHeading}
              onChange={(v) => onFieldChange?.("typography", "heading_font", v)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.bodyFont")}
            </label>
            <FontPicker
              value={currentBody}
              onChange={(v) => onFieldChange?.("typography", "body_font", v)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.headingWeight")}
            </label>
            <select
              value={designToken?.typography?.heading_weight || "700"}
              onChange={(e) => onFieldChange?.("typography", "heading_weight", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-border bg-sidebar-input text-sidebar-foreground rounded-md text-[13px] outline-none focus:border-primary/60"
            >
              <option value="400" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.weightRegular")} (400)</option>
              <option value="500" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.weightMedium")} (500)</option>
              <option value="600" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.weightSemiBold")} (600)</option>
              <option value="700" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.weightBold")} (700)</option>
              <option value="800" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.weightExtraBold")} (800)</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.heroTitleSize")}
            </label>
            <select
              value={designToken?.typography?.heading_size_hero || "3rem"}
              onChange={(e) => onFieldChange?.("typography", "heading_size_hero", e.target.value)}
              className="w-full px-2.5 py-1.5 border border-border bg-sidebar-input text-sidebar-foreground rounded-md text-[13px] outline-none focus:border-primary/60"
            >
              <option value="2rem" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.sizeSmall")} (2rem)</option>
              <option value="2.5rem" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.sizeMedium")} (2.5rem)</option>
              <option value="3rem" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.sizeLarge")} (3rem)</option>
              <option value="3.5rem" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.sizeVeryLarge")} (3.5rem)</option>
              <option value="4rem" className="bg-sidebar-input text-sidebar-foreground">{t("dashboard.sitesEditor.sizeMax")} (4rem)</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
