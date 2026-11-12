"use client";

import { useState, useCallback, useEffect } from "react";
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
import { MoodSection } from "./MoodSection";
import { MOOD_OPTIONS } from "../constants";
import { WizardSheet } from "../wizard-sheet";

type SheetTab = "warna" | "font";
type SubView = "none" | "brand-color" | "custom-font";

interface ThemeSheetProps {
  open: boolean;
  mood: string;
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  brandPalette?: Record<string, string> | null;
  brandThemeMode?: "light" | "dark" | null;
  onClose: () => void;
  onLogoApplied?: (url: string, paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
  onBrandColorApplied?: (paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
  onSelectMood?: (mood: string) => void;
}

export function ThemeSheet({
  open,
  mood,
  theme,
  baseToken,
  brandPalette,
  brandThemeMode,
  onClose,
  onLogoApplied,
  onBrandColorApplied,
  onSelectMood,
}: ThemeSheetProps) {
  const { t, isIndonesian } = useI18n();
  const [tab, setTab] = useState<SheetTab>("warna");
  const [subView, setSubView] = useState<SubView>("none");
  const [toastLabel, setToastLabel] = useState<string | null>(null);

  // The Drawer stays mounted after closing so its slide animation can run
  // (the old WizardSheet unmounted). Reset the local UI state on every open so
  // a fresh sheet always starts on the "warna" tab, like it used to.
  useEffect(() => {
    if (!open) return;
    setTab("warna");
    setSubView("none");
    setToastLabel(null);
  }, [open]);

  const presets = getPresets(mood);

  const handleApplyPreset = useCallback((label: string) => {
    setToastLabel(label);
    setSubView("none");
  }, []);

  const handleSelectMood = useCallback((newMood: string) => {
    onSelectMood?.(newMood);
    const mo = MOOD_OPTIONS.find((m) => m.value === newMood);
    const label = isIndonesian ? (mo?.label || newMood) : (mo?.labelEn || mo?.label || newMood);
    handleApplyPreset(t("dashboard.wizard.theme.moodApplied", 'Gaya "{mood}" diterapkan', { mood: label }));
  }, [onSelectMood, handleApplyPreset, t, isIndonesian]);

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

  const TABS: { key: SheetTab; label: string }[] = [
    { key: "warna", label: t("dashboard.wizard.theme.tabColor", "Warna") },
    { key: "font", label: t("dashboard.wizard.theme.tabFont", "Font") },
  ];

  const sheetTitle = subView === "brand-color"
    ? t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")
    : subView === "custom-font"
    ? t("dashboard.wizard.theme.customFontTitle", "Font Kustom")
    : t("dashboard.wizard.theme.panelTitle", "Sesuaikan Tema");

  return (
    <WizardSheet
      open={open}
      title={sheetTitle}
      onClose={handleClose}
      maxHeight="50dvh"
      ariaLabel={t("dashboard.wizard.theme.panelTitle", "Sesuaikan Tema")}
    >
        {/* Mood — always at top, above tabs */}
        {subView === "none" && (
          <div className="shrink-0">
            <MoodSection mood={mood} onSelectMood={handleSelectMood} />
          </div>
        )}

        {/* Tabs — below mood, only when not in subview */}
        {subView === "none" && (
          <div className="flex gap-1 mx-4 mb-1 p-0.5 rounded-lg bg-sidebar-muted/60 border border-border shrink-0">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  tab === key
                    ? "bg-sidebar text-sidebar-foreground shadow-xs font-bold"
                    : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Contrast hint */}
        {subView === "none" && (
          <div className="shrink-0">
            <ContrastHint token={theme.previewToken} theme={theme} />
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto min-h-0 relative">
          {subView === "none" && tab === "warna" && (
            <PaletteSection
              palettes={presets.palettes}
              theme={theme}
              baseToken={baseToken}
              brandPalette={brandPalette}
              brandThemeMode={brandThemeMode}
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
              onLogoApplied={onLogoApplied}
              onBrandColorApplied={onBrandColorApplied}
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

          {/* Undo Toast (inside scrollable so it stays above content) */}
          <UndoToast
            label={toastLabel}
            theme={theme}
            onDismiss={handleDismissToast}
          />
        </div>
    </WizardSheet>
  );
}

