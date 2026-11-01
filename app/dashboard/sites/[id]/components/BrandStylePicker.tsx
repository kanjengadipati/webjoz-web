"use client";

import React, { useRef, useState, useEffect } from "react";
import { Palette, ChevronDown, Check, Plus, Upload, Link2, Trash2, Sparkles, AlertCircle } from "lucide-react";
import { Button, Badge } from "webjoz-ui";
import { loadGoogleFont, loadCustomFont } from "@/components/templates/helpers";
import FontPicker from "./FontPicker";
import { useI18n } from "@/lib/i18n/context";

interface Props {
  designToken: any;
  onUpdateField: (group: "palette" | "typography" | "layout", key: string, value: any) => void;
  locale?: string;
}

const POPULAR_HEADING_FONTS = [
  { id: "Inter", label: "Inter", sample: "Modern & Bersih" },
  { id: "Poppins", label: "Poppins", sample: "Geometris & Ramah" },
  { id: "Playfair Display", label: "Playfair Display", sample: "Klasik & Elegan" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sample: "Kontemporer & Tegas" },
];

const POPULAR_BODY_FONTS = [
  { id: "Inter", label: "Inter", sample: "Sangat mudah dibaca" },
  { id: "Roboto", label: "Roboto", sample: "Standar global web" },
  { id: "Open Sans", label: "Open Sans", sample: "Netral & nyaman" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sample: "Harmonis modern" },
];

const POPULAR_ACCENT_COLORS = [
  { hex: "#E85D2A", name: "Warm Orange" },
  { hex: "#2563EB", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald Green" },
  { hex: "#7C3AED", name: "Vibrant Purple" },
  { hex: "#18181B", name: "Deep Slate" },
];

export default function BrandStylePicker({ designToken, onUpdateField, locale = "id" }: Props) {
  const { t } = useI18n();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  // State untuk kustom font (Upload / URL)
  const [showCustomFontPanel, setShowCustomFontPanel] = useState(false);
  const [customFontMode, setCustomFontMode] = useState<"upload" | "url">("upload");
  const [fontTarget, setFontTarget] = useState<"heading" | "body">("heading");
  const [urlFontFamily, setUrlFontFamily] = useState("");
  const [urlFontHref, setUrlFontHref] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const currentHeading = designToken?.typography?.heading_font || "Inter";
  const currentBody = designToken?.typography?.body_font || "Inter";
  const currentHeadingUrl = designToken?.typography?.heading_font_url || "";
  const currentBodyUrl = designToken?.typography?.body_font_url || "";
  const currentAccent = designToken?.palette?.primary || "#E85D2A";

  const isHeadingCustom = !POPULAR_HEADING_FONTS.some((f) => f.id === currentHeading);
  const isBodyCustom = !POPULAR_BODY_FONTS.some((f) => f.id === currentBody);
  const isAccentCustom = !POPULAR_ACCENT_COLORS.some((c) => c.hex.toLowerCase() === currentAccent.toLowerCase());

  // Muat Fonts secara dinamis agar preview akurat
  useEffect(() => {
    loadGoogleFont(currentHeading, currentBody, currentHeadingUrl, currentBodyUrl);
    POPULAR_HEADING_FONTS.forEach((f) => loadGoogleFont(f.id));
    POPULAR_BODY_FONTS.forEach((f) => loadGoogleFont(f.id));
  }, [currentHeading, currentBody, currentHeadingUrl, currentBodyUrl]);

  const handleSelectHeading = (font: string) => {
    // Reset custom URL jika memilih dari preset/Google font
    if (currentHeadingUrl) {
      onUpdateField("typography", "heading_font_url", "");
    }
    loadGoogleFont(font, currentBody);
    onUpdateField("typography", "heading_font", font);
  };

  const handleSelectBody = (font: string) => {
    // Reset custom URL jika memilih dari preset/Google font
    if (currentBodyUrl) {
      onUpdateField("typography", "body_font_url", "");
    }
    loadGoogleFont(currentHeading, font);
    onUpdateField("typography", "body_font", font);
  };

  const handleSelectAccent = (hex: string) => {
    onUpdateField("palette", "primary", hex);
  };

  // Handler Upload File Font (.woff2, .woff, .ttf, .otf)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Validasi ekstensi
    const validExts = [".woff2", ".woff", ".ttf", ".otf"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!validExts.includes(ext)) {
      setUploadError(t("dashboard.sitesEditor.fontInvalidFormatError"));
      return;
    }

    // Maksimal 3MB
    if (file.size > 3 * 1024 * 1024) {
      setUploadError(t("dashboard.sitesEditor.fontFileSizeError"));
      return;
    }

    // Nama font dari nama file bersih (mis. "Gilmer-Bold.woff2" -> "Gilmer Bold")
    const cleanFontName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      // Muat font ke browser secara real-time
      loadCustomFont(cleanFontName, dataUrl);

      if (fontTarget === "heading") {
        onUpdateField("typography", "heading_font", cleanFontName);
        onUpdateField("typography", "heading_font_url", dataUrl);
      } else {
        onUpdateField("typography", "body_font", cleanFontName);
        onUpdateField("typography", "body_font_url", dataUrl);
      }

      setUploadSuccess(
        t("dashboard.sitesEditor.customFontAppliedSuccess", undefined, { name: cleanFontName })
      );
    };

    reader.onerror = () => {
      setUploadError(t("dashboard.sitesEditor.fontReadError"));
    };

    reader.readAsDataURL(file);
  };

  // Handler Terapkan Font via URL
  const handleApplyUrlFont = () => {
    if (!urlFontFamily.trim() || !urlFontHref.trim()) {
      setUploadError(t("dashboard.sitesEditor.fontNameAndUrlRequired"));
      return;
    }

    setUploadError(null);
    const fontName = urlFontFamily.trim();
    const fontUrl = urlFontHref.trim();

    loadCustomFont(fontName, fontUrl);

    if (fontTarget === "heading") {
      onUpdateField("typography", "heading_font", fontName);
      onUpdateField("typography", "heading_font_url", fontUrl);
    } else {
      onUpdateField("typography", "body_font", fontName);
      onUpdateField("typography", "body_font_url", fontUrl);
    }

    setUploadSuccess(
      t("dashboard.sitesEditor.customFontUrlAppliedSuccess", undefined, { name: fontName })
    );
  };

  const handleResetCustomFont = (type: "heading" | "body") => {
    if (type === "heading") {
      onUpdateField("typography", "heading_font", "Inter");
      onUpdateField("typography", "heading_font_url", "");
    } else {
      onUpdateField("typography", "body_font", "Inter");
      onUpdateField("typography", "body_font_url", "");
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-sidebar-muted/30 p-4 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground block mb-0.5">
            {t("dashboard.sitesEditor.brandIdentitySettings")}
          </span>
          <h3 className="text-sm font-bold text-sidebar-foreground">
            {t("dashboard.sitesEditor.brandStyle")}
          </h3>
          <p className="text-[11px] text-sidebar-muted-foreground mt-0.5">
            {t("dashboard.sitesEditor.brandStyleSubtitle")}
          </p>
        </div>
        <div className="p-1.5 rounded-lg bg-sidebar-muted text-sidebar-foreground/80 border border-border/50">
          <Palette className="w-4 h-4" />
        </div>
      </div>

      {/* Heading font */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-sidebar-foreground block">
            {t("dashboard.sitesEditor.headingFontLabel")}
          </label>
          {currentHeadingUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              {t("dashboard.sitesEditor.customFontBadge")}
              <button
                type="button"
                onClick={() => handleResetCustomFont("heading")}
                className="hover:text-red-500 ml-0.5 cursor-pointer"
                title={t("dashboard.sitesEditor.resetDefaultFont")}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {POPULAR_HEADING_FONTS.map((font) => {
            const isSelected = currentHeading === font.id && !currentHeadingUrl;
            return (
              <label
                key={font.id}
                onClick={() => handleSelectHeading(font.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-sidebar-foreground font-semibold ring-1 ring-primary/40"
                    : "border-border/70 bg-sidebar hover:bg-sidebar-muted/60 text-sidebar-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-sidebar"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span style={{ fontFamily: font.id }}>{font.label}</span>
                </div>
                <span className="text-[10px] text-sidebar-subtle-foreground font-normal">{font.sample}</span>
              </label>
            );
          })}

          {/* Custom Font yang sedang aktif (Upload / URL) */}
          {currentHeadingUrl && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border text-xs border-primary bg-primary/10 text-sidebar-foreground font-semibold ring-1 ring-primary/40">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3.5 h-3.5 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="truncate" style={{ fontFamily: currentHeading }}>
                  {currentHeading}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("dashboard.sitesEditor.customFontBadge")}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetCustomFont("heading")}
                  className="hover:text-red-500 text-sidebar-subtle-foreground cursor-pointer p-0.5"
                  title={t("dashboard.sitesEditor.resetDefaultFont")}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Opsi Font Tambahan dari Google Fonts */}
          {!currentHeadingUrl && (
            <div className="pt-0.5">
              <FontPicker
                value={currentHeading}
                isSelected={isHeadingCustom}
                placeholder={t("dashboard.sitesEditor.moreGoogleFontsPlaceholder")}
                badgeLabel={t("dashboard.sitesEditor.googleFontBadge")}
                onChange={(val) => handleSelectHeading(val)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Body font */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-sidebar-foreground block">
            {t("dashboard.sitesEditor.bodyFontLabel")}
          </label>
          {currentBodyUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-md font-medium">
              <Sparkles className="w-2.5 h-2.5" />
              {t("dashboard.sitesEditor.customFontBadge")}
              <button
                type="button"
                onClick={() => handleResetCustomFont("body")}
                className="hover:text-red-500 ml-0.5 cursor-pointer"
                title={t("dashboard.sitesEditor.resetDefaultFont")}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {POPULAR_BODY_FONTS.map((font) => {
            const isSelected = currentBody === font.id && !currentBodyUrl;
            return (
              <label
                key={font.id}
                onClick={() => handleSelectBody(font.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/10 text-sidebar-foreground font-semibold ring-1 ring-primary/40"
                    : "border-border/70 bg-sidebar hover:bg-sidebar-muted/60 text-sidebar-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-sidebar"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                  <span style={{ fontFamily: font.id }}>{font.label}</span>
                </div>
                <span className="text-[10px] text-sidebar-subtle-foreground font-normal">{font.sample}</span>
              </label>
            );
          })}

          {/* Custom Font yang sedang aktif (Upload / URL) */}
          {currentBodyUrl && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border text-xs border-primary bg-primary/10 text-sidebar-foreground font-semibold ring-1 ring-primary/40">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3.5 h-3.5 rounded-full border border-primary bg-primary text-primary-foreground flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <span className="truncate" style={{ fontFamily: currentBody }}>
                  {currentBody}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-md font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("dashboard.sitesEditor.customFontBadge")}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetCustomFont("body")}
                  className="hover:text-red-500 text-sidebar-subtle-foreground cursor-pointer p-0.5"
                  title={t("dashboard.sitesEditor.resetDefaultFont")}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Opsi Font Tambahan dari Google Fonts */}
          {!currentBodyUrl && (
            <div className="pt-0.5">
              <FontPicker
                value={currentBody}
                isSelected={isBodyCustom}
                placeholder={t("dashboard.sitesEditor.moreGoogleFontsPlaceholder")}
                badgeLabel={t("dashboard.sitesEditor.googleFontBadge")}
                onChange={(val) => handleSelectBody(val)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Accordion / Drawer: Upload Font Kustom & Input URL Font */}
      <div className="pt-1 border-t border-border/60">
        <button
          type="button"
          onClick={() => setShowCustomFontPanel((prev) => !prev)}
          className="w-full flex items-center justify-between text-left text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            {t("dashboard.sitesEditor.customFontDrawerButton")}
          </span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCustomFontPanel ? "rotate-180" : ""}`} />
        </button>

        {showCustomFontPanel && (
          <div className="mt-2.5 p-3 rounded-xl border border-border bg-sidebar space-y-3">
            {/* Target Font: Heading vs Body */}
            <div>
              <label className="text-[10px] font-semibold text-sidebar-muted-foreground uppercase tracking-wide block mb-1">
                {t("dashboard.sitesEditor.applyFontTo")}
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg border border-border bg-sidebar-muted/50 text-xs">
                <button
                  type="button"
                  onClick={() => setFontTarget("heading")}
                  className={`py-1 text-center rounded-md font-medium transition cursor-pointer ${
                    fontTarget === "heading" ? "bg-sidebar text-foreground shadow-2xs font-bold" : "text-sidebar-muted-foreground"
                  }`}
                >
                  {t("dashboard.sitesEditor.fontTargetHeading")}
                </button>
                <button
                  type="button"
                  onClick={() => setFontTarget("body")}
                  className={`py-1 text-center rounded-md font-medium transition cursor-pointer ${
                    fontTarget === "body" ? "bg-sidebar text-foreground shadow-2xs font-bold" : "text-sidebar-muted-foreground"
                  }`}
                >
                  {t("dashboard.sitesEditor.fontTargetBody")}
                </button>
              </div>
            </div>

            {/* Sub-Tab: Upload File vs Input URL */}
            <div className="flex gap-2 border-b border-border/80 pb-2">
              <button
                type="button"
                onClick={() => { setCustomFontMode("upload"); setUploadError(null); setUploadSuccess(null); }}
                className={`text-[11px] font-semibold pb-0.5 border-b-2 transition cursor-pointer ${
                  customFontMode === "upload"
                    ? "border-primary text-primary"
                    : "border-transparent text-sidebar-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                <Upload className="w-3 h-3 inline mr-1" />
                {t("dashboard.sitesEditor.uploadFontTab")}
              </button>
              <button
                type="button"
                onClick={() => { setCustomFontMode("url"); setUploadError(null); setUploadSuccess(null); }}
                className={`text-[11px] font-semibold pb-0.5 border-b-2 transition cursor-pointer ${
                  customFontMode === "url"
                    ? "border-primary text-primary"
                    : "border-transparent text-sidebar-muted-foreground hover:text-sidebar-foreground"
                }`}
              >
                <Link2 className="w-3 h-3 inline mr-1" />
                {t("dashboard.sitesEditor.urlFontTab")}
              </button>
            </div>

            {/* Mode 1: Upload File Font */}
            {customFontMode === "upload" && (
              <div className="space-y-2">
                <input
                  ref={fontFileInputRef}
                  type="file"
                  accept=".woff2,.woff,.ttf,.otf"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => fontFileInputRef.current?.click()}
                  className="w-full py-4 border-2 border-dashed border-border hover:border-primary/60 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-sidebar-muted/30 hover:bg-sidebar-muted/60 transition cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-sidebar-muted-foreground" />
                  <span className="text-xs font-semibold text-sidebar-foreground">
                    {t("dashboard.sitesEditor.selectFontFileComputer")}
                  </span>
                  <span className="text-[10px] text-sidebar-subtle-foreground">
                    {t("dashboard.sitesEditor.fontFileFormatHint")}
                  </span>
                </button>
              </div>
            )}

            {/* Mode 2: Input URL Font */}
            {customFontMode === "url" && (
              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-sidebar-muted-foreground block mb-0.5">
                    {t("dashboard.sitesEditor.fontFamilyNameLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("dashboard.sitesEditor.fontFamilyNamePlaceholder")}
                    value={urlFontFamily}
                    onChange={(e) => setUrlFontFamily(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-sidebar-input text-sidebar-foreground text-xs focus:outline-hidden focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-sidebar-muted-foreground block mb-0.5">
                    {t("dashboard.sitesEditor.fontUrlLabel")}
                  </label>
                  <input
                    type="url"
                    placeholder={t("dashboard.sitesEditor.fontUrlPlaceholder")}
                    value={urlFontHref}
                    onChange={(e) => setUrlFontHref(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-sidebar-input text-sidebar-foreground text-xs focus:outline-hidden focus:border-primary font-mono text-[11px]"
                  />
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleApplyUrlFont}
                  className="w-full mt-1 text-xs"
                >
                  <Link2 className="w-3.5 h-3.5 mr-1" />
                  {t("dashboard.sitesEditor.applyFontUrlButton")}
                </Button>
              </div>
            )}

            {/* Pesan Error / Sukses */}
            {uploadError && (
              <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {uploadError}
              </p>
            )}
            {uploadSuccess && (
              <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium">
                <Check className="w-3 h-3 shrink-0" />
                {uploadSuccess}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Brand accent color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-sidebar-foreground block">
            {t("dashboard.sitesEditor.brandAccentLabel")}
          </label>
          <span className="text-[10px] font-mono text-sidebar-subtle-foreground uppercase">{currentAccent}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {POPULAR_ACCENT_COLORS.map((color) => {
            const isSelected = currentAccent.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                key={color.hex}
                type="button"
                onClick={() => handleSelectAccent(color.hex)}
                className={`w-7 h-7 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 ring-offset-sidebar scale-110 shadow-sm"
                    : "hover:scale-105 border border-black/10"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-[3]" />}
              </button>
            );
          })}

          {/* Custom Color Input */}
          <div className="relative">
            <button
              type="button"
              onClick={() => colorInputRef.current?.click()}
              className={`w-7 h-7 rounded-xl border border-dashed flex items-center justify-center transition-all cursor-pointer ${
                isAccentCustom
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-sidebar scale-110 shadow-sm"
                  : "border-border hover:border-primary/50 text-sidebar-muted-foreground hover:text-sidebar-foreground"
              }`}
              style={isAccentCustom ? { backgroundColor: currentAccent } : {}}
              title={t("dashboard.sitesEditor.pickCustomColorTitle")}
            >
              {isAccentCustom ? (
                <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-[3]" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
            </button>
            <input
              ref={colorInputRef}
              type="color"
              value={currentAccent.startsWith("#") ? currentAccent : "#E85D2A"}
              onChange={(e) => handleSelectAccent(e.target.value)}
              className="sr-only"
            />
          </div>
        </div>
      </div>

      {/* Real-time Mini Preview */}
      <div className="pt-2">
        <div className="p-3.5 rounded-xl border border-border/80 bg-sidebar space-y-3">
          <span className="text-[9px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground block">
            {t("dashboard.sitesEditor.brandPreviewTitle")}
          </span>

          <div className="space-y-1">
            <h4
              style={{
                fontFamily: `'${currentHeading}', sans-serif`,
                color: currentAccent,
              }}
              className="text-sm font-bold leading-tight"
            >
              {t("dashboard.sitesEditor.brandPreviewSampleHeadline")}
            </h4>
            <p
              style={{ fontFamily: `'${currentBody}', sans-serif` }}
              className="text-[11px] text-sidebar-muted-foreground truncate"
            >
              {currentHeading} {currentHeadingUrl ? "(Custom)" : ""} · {currentBody} {currentBodyUrl ? "(Custom)" : ""} · {currentAccent.toUpperCase()}
            </p>
          </div>

          <button
            type="button"
            style={{
              backgroundColor: currentAccent,
              fontFamily: `'${currentBody}', sans-serif`,
            }}
            className="w-full py-2 px-3 rounded-lg text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-default pointer-events-none"
          >
            <span>{t("dashboard.sitesEditor.brandPreviewContactButton")}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
        <p className="text-[10px] text-sidebar-subtle-foreground/80 mt-2 text-center italic">
          {t("dashboard.sitesEditor.brandStylesLockedHint")}
        </p>
      </div>
    </div>
  );
}
