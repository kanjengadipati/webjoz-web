"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  extractBrandPalettes,
  type BrandLogoExtractResult,
  type ExtractedBrandPalette,
} from "@/lib/brand-color-extractor";
import { useI18n } from "@/lib/i18n/context";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Upload, Image as ImageIcon, Check, RefreshCw, Sun, Moon } from "lucide-react";
import { isColorDark } from "@/components/templates/helpers";

const PALETTE_KEYS = ["primary", "accent", "background", "surface", "text"] as const;

interface BrandLogoColorPickerProps {
  designToken: any;
  currentLogoUrl?: string | null;
  onApplyPalette: (
    palette: Record<string, string>,
    themeMode?: "light" | "dark",
    newLogoUrl?: string
  ) => void;
}

function MiniPalettePreview({
  palette,
  t,
}: {
  palette: Record<string, string | undefined> | ExtractedBrandPalette;
  t: any;
}) {
  const p = palette as Record<string, string | undefined>;
  const bg = p.background || "#FAF7F2";
  const text = p.text || "#2C2C2A";
  const primary = p.primary || "#4F46E5";
  const surface = p.surface || "#FFFFFF";
  const accent = p.accent || "#7C3AED";
  const primaryTextColor = isColorDark(primary) ? "#ffffff" : "#0f172a";

  const previewLabel = t ? t("dashboard.sitesEditor.previewAa", "Aa Preview") : "Aa Preview";
  const accentLabel = t ? t("dashboard.sitesEditor.paletteAccent", "Aksen") : "Aksen";
  const buttonLabel = t ? t("dashboard.sitesEditor.sampleButton", "Tombol") : "Tombol";

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
          {previewLabel}
        </span>
        <span
          className="w-2 h-2 rounded-full shrink-0 shadow-2xs"
          style={{ backgroundColor: accent }}
          title={`${accentLabel}: ${accent}`}
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
          {buttonLabel}
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

export function BrandLogoColorPicker({
  designToken,
  currentLogoUrl,
  onApplyPalette,
}: BrandLogoColorPickerProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeLogo, setActiveLogo] = useState<string | null>(currentLogoUrl || null);
  const [extractResult, setExtractResult] = useState<BrandLogoExtractResult | null>(null);
  const [selectedMode, setSelectedMode] = useState<"light" | "dark">("light");
  const [syncSiteLogo, setSyncSiteLogo] = useState<boolean>(true);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [justApplied, setJustApplied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Sync with currentLogoUrl when it changes externally
  useEffect(() => {
    if (currentLogoUrl && !activeLogo) {
      setActiveLogo(currentLogoUrl);
    }
  }, [currentLogoUrl, activeLogo]);

  const processImage = useCallback(async (imageSrc: string) => {
    setIsExtracting(true);
    try {
      const res = await extractBrandPalettes(imageSrc);
      setExtractResult(res);
      setSelectedMode(res.recommendedTheme);
      setActiveLogo(imageSrc);
    } catch (err) {
      console.error("Failed to extract colors from logo:", err);
    } finally {
      setIsExtracting(false);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      processImage(result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        processImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const activePalette: ExtractedBrandPalette | null = extractResult
    ? selectedMode === "dark"
      ? extractResult.dark
      : extractResult.light
    : null;

  const handleApply = () => {
    if (!activePalette) return;

    const palettePayload: Record<string, string> = {
      primary: activePalette.primary,
      accent: activePalette.accent,
      background: activePalette.background,
      surface: activePalette.surface,
      text: activePalette.text,
    };

    onApplyPalette(
      palettePayload,
      selectedMode,
      syncSiteLogo && activeLogo ? activeLogo : undefined
    );

    setJustApplied(true);
    setTimeout(() => setJustApplied(false), 2500);
  };

  return (
    <div className="space-y-3 p-3 rounded-2xl bg-sidebar-muted/40 border border-border/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-sidebar-foreground">
            {t("dashboard.sitesEditor.brandLogoColorTitle", "Warna dari Logo Brand")}
          </p>
        </div>
        <span className="text-[9px] font-semibold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
          Auto Palette
        </span>
      </div>

      <p className="text-[9px] text-sidebar-subtle-foreground leading-snug">
        {t(
          "dashboard.sitesEditor.brandLogoColorSubtitle",
          "Ekstrak palet warna primer, aksen, dan background langsung dari logo bisnis secara otomatis."
        )}
      </p>

      {/* Action to extract from current site logo if present and not yet extracted */}
      {currentLogoUrl && !extractResult && (
        <button
          type="button"
          onClick={() => processImage(currentLogoUrl)}
          disabled={isExtracting}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl border border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
        >
          {isExtracting ? (
            <RefreshCw className="w-3 h-3 animate-spin" />
          ) : (
            <SparkleIcon className="w-3 h-3" />
          )}
          <span>
            {t("dashboard.sitesEditor.extractFromSiteLogo", "Ekstrak dari logo situs aktif")}
          </span>
        </button>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Dropzone / Upload Area */}
      {!extractResult && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed text-center transition-all cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-sidebar-muted/80 bg-sidebar-muted/30"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1.5">
            <Upload className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-bold text-sidebar-foreground">
            {t("dashboard.sitesEditor.uploadLogoTitle", "Upload Logo Brand")}
          </p>
          <p className="text-[8.5px] text-sidebar-subtle-foreground mt-0.5">
            PNG, JPG, WebP, atau SVG (maks. 5MB)
          </p>
        </div>
      )}

      {/* Extracted Palette View */}
      {extractResult && activePalette && (
        <div className="space-y-2.5 pt-1">
          {/* Logo preview thumbnail & reset action */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-background border border-border/80">
            <div className="flex items-center gap-2 min-w-0">
              {activeLogo && (
                <div className="w-7 h-7 rounded-lg border border-border/80 p-0.5 bg-sidebar-muted flex items-center justify-center overflow-hidden shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={activeLogo} alt="Brand Logo" className="w-full h-full object-contain" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[9.5px] font-bold text-foreground truncate">
                  {t("dashboard.sitesEditor.extractedPaletteReady", "Palet Warna Terdeteksi")}
                </p>
                <p className="text-[8px] text-muted-foreground truncate">
                  Primary: {activePalette.primary} • Accent: {activePalette.accent}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[9px] text-primary hover:underline font-semibold shrink-0 cursor-pointer"
            >
              {t("dashboard.sitesEditor.changeLogoBtn", "Ganti")}
            </button>
          </div>

          {/* Theme mode toggle: Light vs Dark */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-sidebar-muted border border-border/60">
            <button
              type="button"
              onClick={() => setSelectedMode("light")}
              className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${
                selectedMode === "light"
                  ? "bg-background text-foreground shadow-2xs border border-border/60"
                  : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
              }`}
            >
              <Sun className={`w-3 h-3 ${selectedMode === "light" ? "text-amber-500" : ""}`} />
              <span>{t("dashboard.sitesEditor.lightMode", "Tema Terang")}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedMode("dark")}
              className={`flex items-center justify-center gap-1.5 py-1 px-2 rounded-lg text-[9.5px] font-bold transition-all cursor-pointer ${
                selectedMode === "dark"
                  ? "bg-background text-foreground shadow-2xs border border-border/60"
                  : "text-sidebar-muted-foreground hover:text-sidebar-foreground"
              }`}
            >
              <Moon className={`w-3 h-3 ${selectedMode === "dark" ? "text-primary" : ""}`} />
              <span>{t("dashboard.sitesEditor.darkMode", "Tema Gelap")}</span>
            </button>
          </div>

          {/* Mini Aa Preview */}
          <MiniPalettePreview palette={activePalette} t={t} />

          {/* Color Swatches */}
          <div className="flex gap-1.5 justify-between">
            {PALETTE_KEYS.map((key) => (
              <div
                key={key}
                className="flex-1 h-7 rounded-md border border-border/80 shadow-2xs transition-transform hover:scale-105 relative group/swatch"
                style={{ backgroundColor: activePalette[key] }}
                title={`${key}: ${activePalette[key]}`}
              >
                <span className="sr-only">{key}</span>
              </div>
            ))}
          </div>

          {/* Sync logo to header option */}
          <label className="flex items-center gap-2 cursor-pointer select-none pt-0.5">
            <input
              type="checkbox"
              checked={syncSiteLogo}
              onChange={(e) => setSyncSiteLogo(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-primary focus:ring-primary border-border"
            />
            <span className="text-[9px] text-sidebar-foreground">
              {t("dashboard.sitesEditor.useAsSiteLogoCheckbox", "Pasang juga logo ini di header website")}
            </span>
          </label>

          {/* Apply Button */}
          <button
            type="button"
            onClick={handleApply}
            disabled={justApplied}
            className={`w-full py-2 px-3 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              justApplied
                ? "bg-emerald-600 text-white"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {justApplied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{t("dashboard.sitesEditor.paletteAppliedSuccess", "Palet Brand Diterapkan!")}</span>
              </>
            ) : (
              <>
                <SparkleIcon className="w-3.5 h-3.5" />
                <span>{t("dashboard.sitesEditor.applyBrandPaletteBtn", "Terapkan Palet Brand")}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default BrandLogoColorPicker;

