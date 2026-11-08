"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
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

type SheetTab = "warna" | "font";
type SubView = "none" | "brand-color" | "custom-font";

interface ThemeSheetProps {
  open: boolean;
  mood: string;
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onClose: () => void;
}

export function ThemeSheet({ open, mood, theme, baseToken, onClose }: ThemeSheetProps) {
  const { t } = useI18n();
  const [tab, setTab] = useState<SheetTab>("warna");
  const [subView, setSubView] = useState<SubView>("none");
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  const presets = getPresets(mood);

  const handleApplyPreset = useCallback((label: string) => {
    setToastLabel(label);
    setSubView("none");
  }, []);

  const handleDismissToast = useCallback(() => {
    setToastLabel(null);
  }, []);

  const handleClose = useCallback(() => {
    // If in subview with draft, discard draft
    if (subView !== "none" && theme.hasDraft) {
      theme.clearDraft();
    }
    setSubView("none");
    onClose();
  }, [subView, theme, onClose]);

  if (!open) return null;

  const TABS: { key: SheetTab; label: string }[] = [
    { key: "warna", label: t("dashboard.wizard.theme.tabColor", "Warna") },
    { key: "font", label: t("dashboard.wizard.theme.tabFont", "Font") },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl bg-[#141720] overflow-hidden animate-in slide-in-from-bottom duration-300"
        style={{ maxHeight: "75dvh" }}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1 w-10 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 shrink-0">
          <p className="text-sm font-bold text-white">
            {subView === "brand-color"
              ? t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")
              : subView === "custom-font"
              ? t("dashboard.wizard.theme.customFontTitle", "Font Kustom")
              : t("dashboard.wizard.theme.panelTitle", "Sesuaikan Tema")}
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs — only show when not in subview */}
        {subView === "none" && (
          <div
            className="flex gap-1 mx-4 mb-1 p-0.5 rounded-lg bg-white/[0.06] border border-white/10 shrink-0"
          >
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  tab === key
                    ? "bg-white/15 text-white shadow-xs"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Contrast hint */}
        {subView === "none" && (
          <ContrastHint token={theme.previewToken} theme={theme} />
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto relative">
          {subView === "none" && tab === "warna" && (
            <PaletteSection
              palettes={presets.palettes}
              theme={theme}
              baseToken={baseToken}
              onApply={handleApplyPreset}
              onOpenBrandColor={() => setSubView("brand-color")}
            />
          )}

          {subView === "none" && tab === "font" && (
            <FontSection
              fonts={presets.fonts}
              theme={theme}
              baseToken={baseToken}
              onApply={handleApplyPreset}
              onOpenCustomFont={() => setSubView("custom-font")}
            />
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
              onClose={() => setSubView("none")}
              onApply={() => handleApplyPreset(t("dashboard.wizard.theme.customFontApplied", "Font kustom"))}
            />
          )}

          {/* Undo Toast (inside scrollable so it stays above content) */}
          <UndoToast
            label={toastLabel}
            theme={theme}
            onDismiss={handleDismissToast}
          />
        </div>
      </div>
    </>
  );
}

