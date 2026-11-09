"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, Link2, Check, AlertCircle, X, RotateCcw } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import {
  loadCustomFont,
  verifyFontLoaded,
  parseGoogleFontsUrl,
} from "@/components/templates/helpers";
import { readFontFileDataUrl } from "@/lib/wizard-font-storage";

type FontTargetSlot = "heading" | "body" | "both";
type EditorTab = "upload" | "url";

interface CustomFontEditorProps {
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onClose: () => void;
  onApply: () => void;
}

export function CustomFontEditor({
  theme,
  baseToken,
  onClose,
  onApply,
}: CustomFontEditorProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tab, setTab] = useState<EditorTab>("upload");
  const [slotTarget, setSlotTarget] = useState<FontTargetSlot>("both");
  const [urlInput, setUrlInput] = useState("");
  const [manualFamilyName, setManualFamilyName] = useState("");
  const [detectedFont, setDetectedFont] = useState<{ name: string; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Current active typography from draft or applied or baseToken
  const currentTypography =
    theme.draft?.typography ?? theme.applied.typography ?? baseToken?.typography ?? {};
  const baseHeading = baseToken?.typography?.heading_font || "Inter";
  const baseBody = baseToken?.typography?.body_font || "Inter";

  const applyTargetDraft = useCallback(
    (target: FontTargetSlot, font: { name: string; url: string }) => {
      const typoOverride: Record<string, string> = {};
      if (target === "heading" || target === "both") {
        typoOverride.heading_font = font.name;
        typoOverride.heading_font_url = font.url;
      }
      if (target === "body" || target === "both") {
        typoOverride.body_font = font.name;
        typoOverride.body_font_url = font.url;
      }
      theme.setDraft({ typography: typoOverride });
    },
    [theme]
  );

  // File Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const { dataUrl, name } = await readFontFileDataUrl(file);
      loadCustomFont(name, dataUrl);
      const isLoaded = await verifyFontLoaded(name);
      if (!isLoaded) {
        setErrorMessage(
          t(
            "dashboard.wizard.theme.fontVerifyFailed",
            "Font tidak bisa dimuat. Periksa URL, atau coba file .woff2."
          )
        );
        return;
      }

      const fontObj = { name, url: dataUrl };
      setDetectedFont(fontObj);
      applyTargetDraft(slotTarget, fontObj);
    } catch (err: any) {
      setErrorMessage(err?.message || t("dashboard.wizard.theme.fontVerifyFailed", "Gagal memproses file font"));
    } finally {
      setIsProcessing(false);
    }
  };

  // URL Apply handler
  const handleApplyUrl = async () => {
    const rawUrl = urlInput.trim();
    if (!rawUrl) return;
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      let familyName = "";
      const parsed = parseGoogleFontsUrl(rawUrl);
      if (parsed) {
        familyName = parsed.family;
      } else if (manualFamilyName.trim()) {
        familyName = manualFamilyName.trim();
      } else {
        // Derive family name from filename if ends with font extension
        const urlObj = new URL(rawUrl);
        const filename = urlObj.pathname.split("/").pop() || "";
        familyName = filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ").trim();
      }

      if (!familyName) {
        setErrorMessage(t("dashboard.wizard.theme.fontNameRequired", "Masukkan nama font family"));
        return;
      }

      loadCustomFont(familyName, rawUrl);
      const isLoaded = await verifyFontLoaded(familyName);
      if (!isLoaded) {
        setErrorMessage(
          t(
            "dashboard.wizard.theme.fontVerifyFailed",
            "Font tidak bisa dimuat. Periksa URL, atau coba file .woff2."
          )
        );
        return;
      }

      const fontObj = { name: familyName, url: rawUrl };
      setDetectedFont(fontObj);
      applyTargetDraft(slotTarget, fontObj);
    } catch (err: any) {
      setErrorMessage(err?.message || t("dashboard.wizard.theme.fontVerifyFailed", "URL font tidak valid"));
    } finally {
      setIsProcessing(false);
    }
  };

  // When slotTarget changes, re-apply draft with detected font if present
  const handleSlotTargetChange = (newTarget: FontTargetSlot) => {
    setSlotTarget(newTarget);
    if (detectedFont) {
      applyTargetDraft(newTarget, detectedFont);
    }
  };

  // Reset a specific slot back to baseToken default
  const handleResetSlot = (slot: "heading" | "body") => {
    if (slot === "heading") {
      theme.setDraft({
        typography: {
          heading_font: baseHeading,
          heading_font_url: "",
        },
      });
    } else {
      theme.setDraft({
        typography: {
          body_font: baseBody,
          body_font_url: "",
        },
      });
    }
  };

  const handleCancel = () => {
    theme.clearDraft();
    onClose();
  };

  const handleApply = () => {
    theme.commitDraft();
    onApply();
    onClose();
  };

  return (
    <div className="p-4 space-y-4 bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-sidebar-foreground">
          {t("dashboard.wizard.theme.customFontTitle", "Font Kustom")}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-all cursor-pointer"
          title={t("common.close", "Tutup")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Fonts on this site summary — shown first as context */}
      <div className="space-y-1.5 pb-1 border-b border-border/70">
        <p className="text-[10px] font-semibold text-sidebar-subtle-foreground uppercase tracking-wide">
          {t("dashboard.wizard.theme.fontsOnSite", "Font saat ini")}
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {/* Heading Font */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-muted/30 border border-border/50 text-xs">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-sidebar-subtle-foreground block">
                {t("dashboard.wizard.theme.slotHeading", "Judul")}
              </span>
              <span className="font-semibold text-sidebar-foreground truncate block text-[11px]">
                {currentTypography.heading_font || baseHeading}
              </span>
            </div>
            {currentTypography.heading_font && currentTypography.heading_font !== baseHeading && (
              <button
                type="button"
                onClick={() => handleResetSlot("heading")}
                className="flex items-center gap-0.5 text-[10px] text-sidebar-muted-foreground hover:text-primary transition-colors cursor-pointer ml-1 shrink-0"
                title={t("dashboard.wizard.theme.resetToMoodDefault", "Reset")}
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Body Font */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-sidebar-muted/30 border border-border/50 text-xs">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-bold text-sidebar-subtle-foreground block">
                {t("dashboard.wizard.theme.slotBody", "Isi")}
              </span>
              <span className="font-semibold text-sidebar-foreground truncate block text-[11px]">
                {currentTypography.body_font || baseBody}
              </span>
            </div>
            {currentTypography.body_font && currentTypography.body_font !== baseBody && (
              <button
                type="button"
                onClick={() => handleResetSlot("body")}
                className="flex items-center gap-0.5 text-[10px] text-sidebar-muted-foreground hover:text-primary transition-colors cursor-pointer ml-1 shrink-0"
                title={t("dashboard.wizard.theme.resetToMoodDefault", "Reset")}
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-sidebar-muted/60 border border-border">
        <button
          type="button"
          onClick={() => {
            setTab("upload");
            setErrorMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            tab === "upload"
              ? "bg-sidebar text-sidebar-foreground shadow-xs font-bold"
              : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          <span>{t("dashboard.wizard.theme.fontUploadTab", "Upload File")}</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("url");
            setErrorMessage(null);
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
            tab === "url"
              ? "bg-sidebar text-sidebar-foreground shadow-xs font-bold"
              : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
          }`}
        >
          <Link2 className="h-3.5 w-3.5" />
          <span>{t("dashboard.wizard.theme.fontUrl", "Tempel URL")}</span>
        </button>
      </div>

      {/* Tab Content: Upload File */}
      {tab === "upload" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".woff2,.woff,.ttf,.otf"
            onChange={handleFileUpload}
            className="sr-only"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rounded-xl border border-dashed border-border hover:border-primary/60 bg-sidebar-muted/30 hover:bg-sidebar-muted/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
          >
            <Upload className="h-6 w-6 text-sidebar-muted-foreground mb-1.5" />
            <p className="text-xs font-bold text-sidebar-foreground">
              {t("dashboard.wizard.theme.fontUploadAction", "Pilih file font lokal")}
            </p>
            <p className="text-[10px] text-sidebar-muted-foreground mt-0.5">
              .woff2, .woff, .ttf, .otf · Maks. 500 KB
            </p>
          </div>
        </div>
      )}

      {/* Tab Content: Paste URL */}
      {tab === "url" && (
        <div className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground mb-1 uppercase tracking-wide">
              {t("dashboard.wizard.theme.fontUrl", "URL Font")}
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans..."
              className="w-full rounded-lg bg-sidebar-input border border-border px-2.5 py-1.5 text-xs text-sidebar-foreground placeholder:text-sidebar-muted-foreground focus:border-primary focus:outline-none transition-all font-mono"
            />
          </div>

          {/* Manual family name input if URL is not standard Google Fonts */}
          {urlInput && !parseGoogleFontsUrl(urlInput) && (
            <div>
              <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground mb-1 uppercase tracking-wide">
                {t("dashboard.wizard.theme.fontName", "Nama Font Family")}
              </label>
              <input
                type="text"
                value={manualFamilyName}
                onChange={(e) => setManualFamilyName(e.target.value)}
                placeholder="Contoh: My Custom Sans"
                className="w-full rounded-lg bg-sidebar-input border border-border px-2.5 py-1.5 text-xs text-sidebar-foreground placeholder:text-sidebar-muted-foreground focus:border-primary focus:outline-none transition-all"
              />
            </div>
          )}

          <Button
            type="button"
            size="sm"
            disabled={!urlInput.trim() || isProcessing}
            onClick={handleApplyUrl}
            className="w-full rounded-lg text-xs"
          >
            {isProcessing
              ? t("dashboard.wizard.theme.fontChecking", "Memeriksa...")
              : t("dashboard.wizard.theme.fontCheckAndApply", "Periksa & Terapkan")}
          </Button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="flex items-center gap-1.5 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="line-clamp-2">{errorMessage}</span>
        </div>
      )}

      {/* Detected Font Badge + APPLY TO — only shown after font is detected */}
      {detectedFont && (
        <div className="space-y-3">
          {/* Detected badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-primary/10 border border-primary/30 text-primary">
            <Check className="h-4 w-4 shrink-0 stroke-[3]" />
            <p className="text-xs font-semibold truncate">
              {t(
                "dashboard.wizard.theme.fontDetected",
                'Font "{family}" siap digunakan',
                { family: detectedFont.name }
              )}
            </p>
          </div>

          {/* Use For Selector — only meaningful after font is detected */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground uppercase tracking-wide">
              {t("dashboard.wizard.theme.useFor", "Terapkan ke")}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { key: "heading", label: t("dashboard.wizard.theme.useForHeading", "Judul") },
                  { key: "body", label: t("dashboard.wizard.theme.useForBody", "Isi") },
                  { key: "both", label: t("dashboard.wizard.theme.useForBoth", "Keduanya") },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSlotTargetChange(key)}
                  className={`rounded-lg py-1.5 px-2 text-xs font-semibold border transition-all cursor-pointer text-center ${
                    slotTarget === key
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                      : "bg-sidebar-muted/40 border-border text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* License Note */}
          <p className="text-[10px] text-sidebar-muted-foreground leading-normal italic">
            {t(
              "dashboard.wizard.theme.licenseNote",
              "Pastikan Anda memiliki lisensi penggunaan komersial untuk font yang diunggah."
            )}
          </p>

          {/* Action Buttons — only shown when font is ready */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="flex-1 border-border text-sidebar-foreground hover:bg-sidebar-muted rounded-lg"
            >
              {t("dashboard.wizard.theme.cancel", "Batal")}
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="flex-1 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90"
            >
              {t("dashboard.wizard.theme.applyFont", "Terapkan Font")}
            </Button>
          </div>
        </div>
      )}

      {/* Cancel only — shown when no font detected yet */}
      {!detectedFont && (
        <button
          type="button"
          onClick={handleCancel}
          className="w-full text-center text-xs text-sidebar-muted-foreground hover:text-sidebar-foreground transition-colors cursor-pointer py-1"
        >
          {t("dashboard.wizard.theme.cancel", "Batal")}
        </button>
      )}
    </div>
  );
}
