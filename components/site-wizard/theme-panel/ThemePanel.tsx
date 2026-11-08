"use client";

import { useState, useCallback } from "react";
import { RotateCcw, Palette } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import { getPresets } from "@/lib/theme-presets";
import { isEmptyOverrides } from "@/lib/theme-overrides";
import { PaletteSection } from "./PaletteSection";
import { BrandColorEditor } from "./BrandColorEditor";
import { FontSection } from "./FontSection";
import { CustomFontEditor } from "./CustomFontEditor";
import { ContrastHint } from "./ContrastHint";
import { UndoToast } from "./UndoToast";

interface ThemePanelProps {
  mood: string;
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onClose?: () => void;
}

type SubView = "none" | "brand-color" | "custom-font";

export function ThemePanel({ mood, theme, baseToken }: ThemePanelProps) {
  const { t } = useI18n();
  const [subView, setSubView] = useState<SubView>("none");
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  const presets = getPresets(mood);
  const hasApplied = !isEmptyOverrides(theme.applied);

  const handleApplyPreset = useCallback((label: string) => {
    setToastLabel(label);
    setSubView("none");
  }, []);

  const handleDismissToast = useCallback(() => {
    setToastLabel(null);
  }, []);

  return (
    <div className="flex h-full flex-col bg-[#111318] overflow-hidden relative">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className="shrink-0 flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.09)" }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">
            {t("dashboard.wizard.theme.panelTitle", "Sesuaikan Tema")}
          </p>
          <p className="text-[11px] text-slate-400 leading-tight truncate">
            {t("dashboard.wizard.theme.panelSubtitle", "Ubah warna & font pratinjau")}
          </p>
        </div>

        {hasApplied && (
          <button
            type="button"
            onClick={() => {
              theme.resetAll();
              setToastLabel(null);
              setSubView("none");
            }}
            title={t("dashboard.wizard.theme.resetAll", "Reset semua")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.08] active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* ── Contrast hint (outside subview) ───────────────────────────── */}
      {subView === "none" && (
        <ContrastHint token={theme.previewToken} theme={theme} />
      )}

      {/* ── Scrollable body ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {subView === "none" && (
          <>
            {/* Palette section */}
            <div
              className="border-b"
              style={{ borderColor: "rgba(255,255,255,0.07)" }}
            >
              <PaletteSection
                palettes={presets.palettes}
                theme={theme}
                baseToken={baseToken}
                onApply={handleApplyPreset}
                onOpenBrandColor={() => setSubView("brand-color")}
              />
            </div>

            {/* Font section */}
            <FontSection
              fonts={presets.fonts}
              theme={theme}
              baseToken={baseToken}
              onApply={handleApplyPreset}
              onOpenCustomFont={() => setSubView("custom-font")}
            />
          </>
        )}

        {subView === "brand-color" && (
          <BrandColorEditor
            theme={theme}
            baseToken={baseToken}
            onClose={() => setSubView("none")}
            onApply={() => handleApplyPreset(t("dashboard.wizard.theme.brandColorApplied", "Warna brand"))}
          />
        )}

        {subView === "custom-font" && (
          <CustomFontEditor
            theme={theme}
            baseToken={baseToken}
            onClose={() => setSubView("none")}
            onApply={() => handleApplyPreset(t("dashboard.wizard.theme.customFontApplied", "Font kustom"))}
          />
        )}
      </div>

      {/* ── Footer status ─────────────────────────────────────────────── */}
      {hasApplied && subView === "none" && (
        <div
          className="shrink-0 px-4 py-2.5 flex items-center justify-between gap-2"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span className="text-[11px] text-slate-400 leading-tight">
            {t("dashboard.wizard.theme.customizedStatus", "Tema dimodifikasi")}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      )}

      {/* ── Undo Toast ────────────────────────────────────────────────── */}
      <UndoToast
        label={toastLabel}
        theme={theme}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}

