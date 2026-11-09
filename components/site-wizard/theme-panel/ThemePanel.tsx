"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { RotateCcw, Palette, ArrowLeft, MoreVertical } from "lucide-react";
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
import { MoodSection } from "./MoodSection";
import { MOOD_OPTIONS } from "../constants";

interface ThemePanelProps {
  mood: string;
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  brandPalette?: Record<string, string> | null;
  brandThemeMode?: "light" | "dark" | null;
  onBack: () => void;
  onReset: () => void;
  onLogoApplied?: (url: string, paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
  onBrandColorApplied?: (paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
  onSelectMood?: (mood: string) => void;
}

type SubView = "none" | "brand-color" | "custom-font";

export function ThemePanel({
  mood,
  theme,
  baseToken,
  brandPalette,
  brandThemeMode,
  onBack,
  onReset,
  onLogoApplied,
  onBrandColorApplied,
  onSelectMood,
}: ThemePanelProps) {
  const { t } = useI18n();
  const [subView, setSubView] = useState<SubView>("none");
  const [toastLabel, setToastLabel] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu on outside click or Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmingReset(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setConfirmingReset(false);
      }
    };
    document.addEventListener("mousedown", handleDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [menuOpen]);

  const presets = getPresets(mood);
  const hasApplied = !isEmptyOverrides(theme.applied);

  const handleApplyPreset = useCallback((label: string) => {
    setToastLabel(label);
    setSubView("none");
  }, []);

  const handleSelectMood = useCallback((newMood: string) => {
    onSelectMood?.(newMood);
    const mo = MOOD_OPTIONS.find((m) => m.value === newMood);
    const label = mo?.label || newMood;
    handleApplyPreset(t("dashboard.wizard.theme.moodApplied", 'Gaya "{mood}" diterapkan', { mood: label }));
  }, [onSelectMood, handleApplyPreset, t]);

  const handleDismissToast = useCallback(() => {
    setToastLabel(null);
  }, []);

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground border-r border-border overflow-hidden relative">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-3 border-b border-border bg-sidebar">
        <button
          type="button"
          onClick={onBack}
          aria-label={t("dashboard.wizard.theme.back", "Kembali")}
          title={t("dashboard.wizard.theme.back", "Kembali")}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground leading-tight">
            {t("dashboard.wizard.theme.panelTitle", "Sesuaikan Tema")}
          </p>
          <p className="text-[11px] text-sidebar-muted-foreground leading-tight truncate">
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
            title={t("dashboard.wizard.theme.resetAll", "Reset tema")}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-border bg-sidebar hover:bg-sidebar-muted text-sidebar-muted-foreground hover:text-sidebar-foreground transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        )}

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={t("dashboard.wizard.theme.moreActions", "Opsi lain")}
            title={t("dashboard.wizard.theme.moreActions", "Opsi lain")}
            onClick={() => {
              setMenuOpen((v) => !v);
              setConfirmingReset(false);
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-sidebar text-sidebar-muted-foreground hover:bg-sidebar-muted hover:text-sidebar-foreground transition-all cursor-pointer"
          >
            <MoreVertical className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-10 z-50 w-64 rounded-xl border border-border bg-sidebar p-1 shadow-xl animate-in fade-in-50 zoom-in-95 duration-150"
            >
              {!confirmingReset ? (
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => setConfirmingReset(true)}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-sidebar-foreground hover:bg-sidebar-muted cursor-pointer transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5 text-sidebar-muted-foreground" />
                  <span>{t("dashboard.wizard.resetChatTooltip", "Mulai ulang chat dari awal")}</span>
                </button>
              ) : (
                <div className="space-y-2.5 p-2">
                  <p className="text-xs text-sidebar-foreground leading-snug">
                    {t(
                      "dashboard.wizard.theme.confirmReset",
                      "Mulai ulang dari awal? Hasil dan pilihan temamu akan dihapus."
                    )}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setConfirmingReset(false);
                        setMenuOpen(false);
                      }}
                      className="flex-1 rounded-lg border border-border px-2 py-1.5 text-xs text-sidebar-foreground hover:bg-sidebar-muted transition-colors cursor-pointer"
                    >
                      {t("dashboard.wizard.theme.cancel", "Batal")}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setConfirmingReset(false);
                        onReset();
                      }}
                      className="flex-1 rounded-lg bg-primary px-2 py-1.5 text-xs font-bold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      {t("dashboard.wizard.theme.confirmResetYes", "Ya, mulai ulang")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Contrast hint (outside subview) ───────────────────────────── */}
      {subView === "none" && (
        <ContrastHint token={theme.previewToken} theme={theme} />
      )}

      {/* ── Scrollable body ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {subView === "none" && (
          <>
            {/* Mood section */}
            <div className="border-b border-border">
              <MoodSection mood={mood} onSelectMood={handleSelectMood} />
            </div>

            {/* Palette section */}
            <div className="border-b border-border">
              <PaletteSection
                palettes={presets.palettes}
                theme={theme}
                baseToken={baseToken}
                brandPalette={brandPalette}
                brandThemeMode={brandThemeMode}
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
      </div>

      {/* ── Footer status ─────────────────────────────────────────────── */}
      {hasApplied && subView === "none" && (
        <div className="shrink-0 px-4 py-2.5 flex items-center justify-between gap-2 border-t border-border bg-sidebar">
          <span className="text-[11px] text-sidebar-muted-foreground leading-tight">
            {t("dashboard.wizard.theme.customizedStatus", "Tema dimodifikasi")}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
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

