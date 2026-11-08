"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Palette,
  ChevronDown,
  Check,
  Plus,
  Upload,
  Link2,
  Trash2,
  Sparkles,
  AlertCircle,
  Type,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button, Badge } from "webjoz-ui";
import { loadGoogleFont, loadCustomFont } from "@/components/templates/helpers";
import FontPicker from "./FontPicker";
import { useI18n } from "@/lib/i18n/context";
import {
  uploadFontFile,
  FONT_UPLOAD_EXTS,
  FONT_UPLOAD_MAX_BYTES,
} from "@/components/file-upload";

interface Props {
  designToken: any;
  onUpdateField: (group: "palette" | "typography" | "layout", key: string, value: any) => void;
  onUpdateBatch?: (updates: Array<{ group: "palette" | "typography" | "layout"; key: string; value: any }>) => void;
  locale?: string;
}

const POPULAR_HEADING_FONTS = [
  { id: "Inter", label: "Inter", sampleId: "Modern & Bersih", sampleEn: "Modern & Clean" },
  { id: "Poppins", label: "Poppins", sampleId: "Geometris & Ramah", sampleEn: "Geometric & Friendly" },
  { id: "Playfair Display", label: "Playfair Display", sampleId: "Klasik & Elegan", sampleEn: "Classic & Elegant" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sampleId: "Kontemporer & Tegas", sampleEn: "Contemporary & Bold" },
];

const POPULAR_BODY_FONTS = [
  { id: "Inter", label: "Inter", sampleId: "Sangat mudah dibaca", sampleEn: "Highly readable" },
  { id: "Roboto", label: "Roboto", sampleId: "Standar global web", sampleEn: "Global web standard" },
  { id: "Open Sans", label: "Open Sans", sampleId: "Netral & nyaman", sampleEn: "Neutral & comfortable" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sampleId: "Harmonis modern", sampleEn: "Modern harmony" },
];

const FONT_PAIRING_PRESETS = [
  {
    id: "modern",
    heading: "Inter",
    body: "Inter",
    nameId: "Modern Clean",
    nameEn: "Modern Clean",
  },
  {
    id: "elegant",
    heading: "Playfair Display",
    body: "Plus Jakarta Sans",
    nameId: "Klasik Elegan",
    nameEn: "Classic Elegant",
  },
  {
    id: "contemporary",
    heading: "Plus Jakarta Sans",
    body: "Inter",
    nameId: "Kontemporer",
    nameEn: "Contemporary",
  },
  {
    id: "friendly",
    heading: "Poppins",
    body: "Roboto",
    nameId: "Geometris Ramah",
    nameEn: "Geometric Friendly",
  },
];

const POPULAR_ACCENT_COLORS = [
  { hex: "#E85D2A", name: "Warm Orange" },
  { hex: "#2563EB", name: "Royal Blue" },
  { hex: "#059669", name: "Emerald Green" },
  { hex: "#7C3AED", name: "Vibrant Purple" },
  { hex: "#18181B", name: "Deep Slate" },
];

export default function BrandStylePicker({
  designToken,
  onUpdateField,
  onUpdateBatch,
  locale = "id",
}: Props) {
  const { t, isIndonesian } = useI18n();
  const colorInputRef = useRef<HTMLInputElement>(null);
  const fontFileInputRef = useRef<HTMLInputElement>(null);

  // Card sub-editor toggles
  const [showColorEditor, setShowColorEditor] = useState(false);
  const [showFontEditor, setShowFontEditor] = useState(false);

  // State untuk kustom font upload/URL drawer
  const [showCustomFontPanel, setShowCustomFontPanel] = useState(false);
  const [customFontMode, setCustomFontMode] = useState<"upload" | "url">("upload");
  const [fontTarget, setFontTarget] = useState<"heading" | "body">("heading");
  const [urlFontFamily, setUrlFontFamily] = useState("");
  const [urlFontHref, setUrlFontHref] = useState("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadingFont, setUploadingFont] = useState(false);

  const currentHeading = designToken?.typography?.heading_font || "Inter";
  const currentBody = designToken?.typography?.body_font || "Inter";
  const currentHeadingUrl = designToken?.typography?.heading_font_url || "";
  const currentBodyUrl = designToken?.typography?.body_font_url || "";
  const currentAccent = designToken?.palette?.primary || "#E85D2A";

  const isHeadingCustom = !POPULAR_HEADING_FONTS.some((f) => f.id === currentHeading);
  const isBodyCustom = !POPULAR_BODY_FONTS.some((f) => f.id === currentBody);
  const isAccentCustom = !POPULAR_ACCENT_COLORS.some(
    (c) => c.hex.toLowerCase() === currentAccent.toLowerCase()
  );

  // Muat Fonts secara dinamis agar preview akurat
  useEffect(() => {
    loadGoogleFont(currentHeading, currentBody, currentHeadingUrl, currentBodyUrl);
    POPULAR_HEADING_FONTS.forEach((f) => loadGoogleFont(f.id));
    POPULAR_BODY_FONTS.forEach((f) => loadGoogleFont(f.id));
    FONT_PAIRING_PRESETS.forEach((p) => {
      loadGoogleFont(p.heading);
      loadGoogleFont(p.body);
    });
  }, [currentHeading, currentBody, currentHeadingUrl, currentBodyUrl]);

  const handleSelectHeading = (font: string) => {
    if (currentHeadingUrl) {
      onUpdateField("typography", "heading_font_url", "");
    }
    loadGoogleFont(font, currentBody);
    onUpdateField("typography", "heading_font", font);
  };

  const handleSelectBody = (font: string) => {
    if (currentBodyUrl) {
      onUpdateField("typography", "body_font_url", "");
    }
    loadGoogleFont(currentHeading, font);
    onUpdateField("typography", "body_font", font);
  };

  const handleSelectAccent = (hex: string) => {
    onUpdateField("palette", "primary", hex);
  };

  const handleSelectPresetPairing = (heading: string, body: string) => {
    loadGoogleFont(heading, body, "", "");
    if (onUpdateBatch) {
      onUpdateBatch([
        { group: "typography", key: "heading_font", value: heading },
        { group: "typography", key: "heading_font_url", value: "" },
        { group: "typography", key: "body_font", value: body },
        { group: "typography", key: "body_font_url", value: "" },
      ]);
    } else {
      if (currentHeadingUrl) onUpdateField("typography", "heading_font_url", "");
      if (currentBodyUrl) onUpdateField("typography", "body_font_url", "");
      onUpdateField("typography", "heading_font", heading);
      onUpdateField("typography", "body_font", body);
    }
  };

  // Handler Upload File Font (.woff2, .woff, .ttf, .otf)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!FONT_UPLOAD_EXTS.includes(ext)) {
      setUploadError(t("dashboard.sitesEditor.fontInvalidFormatError"));
      input.value = "";
      return;
    }

    if (file.size > FONT_UPLOAD_MAX_BYTES) {
      setUploadError(t("dashboard.sitesEditor.fontFileSizeError"));
      input.value = "";
      return;
    }

    const cleanFontName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

    setUploadingFont(true);
    try {
      const fontUrl = await uploadFontFile(file);
      loadCustomFont(cleanFontName, fontUrl);

      if (onUpdateBatch) {
        onUpdateBatch([
          {
            group: "typography",
            key: fontTarget === "heading" ? "heading_font" : "body_font",
            value: cleanFontName,
          },
          {
            group: "typography",
            key: fontTarget === "heading" ? "heading_font_url" : "body_font_url",
            value: fontUrl,
          },
        ]);
      } else {
        if (fontTarget === "heading") {
          onUpdateField("typography", "heading_font", cleanFontName);
          onUpdateField("typography", "heading_font_url", fontUrl);
        } else {
          onUpdateField("typography", "body_font", cleanFontName);
          onUpdateField("typography", "body_font_url", fontUrl);
        }
      }

      setUploadSuccess(
        t("dashboard.sitesEditor.customFontAppliedSuccess", undefined, { name: cleanFontName })
      );
    } catch (err) {
      setUploadError(
        err instanceof Error && err.message ? err.message : t("dashboard.sitesEditor.fontReadError")
      );
    } finally {
      setUploadingFont(false);
      input.value = "";
    }
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

    if (onUpdateBatch) {
      onUpdateBatch([
        {
          group: "typography",
          key: fontTarget === "heading" ? "heading_font" : "body_font",
          value: fontName,
        },
        {
          group: "typography",
          key: fontTarget === "heading" ? "heading_font_url" : "body_font_url",
          value: fontUrl,
        },
      ]);
    } else {
      if (fontTarget === "heading") {
        onUpdateField("typography", "heading_font", fontName);
        onUpdateField("typography", "heading_font_url", fontUrl);
      } else {
        onUpdateField("typography", "body_font", fontName);
        onUpdateField("typography", "body_font_url", fontUrl);
      }
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
    <div className="space-y-4">
      {/* ═══ CARD 1: BRAND COLORS ══════════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-sidebar-muted/30 p-4 space-y-3.5 shadow-xs">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground block mb-0.5">
              {t("dashboard.sitesEditor.brandIdentitySettings")}
            </span>
            <h3 className="text-sm font-bold text-sidebar-foreground">
              {t("dashboard.sitesEditor.brandColorsCardTitle")}
            </h3>
            <p className="text-[11px] text-sidebar-muted-foreground mt-0.5">
              {t("dashboard.sitesEditor.brandColorsCardSubtitle")}
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-2">
            <span
              className="w-4 h-4 rounded-full border border-border shadow-xs"
              style={{ backgroundColor: currentAccent }}
            />
            <span className="text-[11px] font-mono font-semibold text-sidebar-foreground uppercase">
              {currentAccent}
            </span>
          </div>
        </div>

        {/* Quick Swatches Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-medium text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.popularAccentsLabel")}
            </span>
            {isAccentCustom && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                <Sparkles className="w-2.5 h-2.5" />
                {t("dashboard.sitesEditor.customAccentLabel")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {POPULAR_ACCENT_COLORS.map((color) => {
              const isSelected = currentAccent.toLowerCase() === color.hex.toLowerCase();
              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => handleSelectAccent(color.hex)}
                  className={`w-7 h-7 rounded-xl transition-all cursor-pointer relative flex items-center justify-center ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-sidebar scale-110 shadow-xs"
                      : "hover:scale-105 border border-border/70"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Sesuaikan Warna Brand */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowColorEditor((prev) => !prev)}
          className="w-full text-xs font-semibold border-border hover:bg-sidebar-muted text-sidebar-foreground cursor-pointer justify-between h-8 px-3"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sidebar-muted-foreground" />
            {t("dashboard.sitesEditor.customizeColorButton")}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-sidebar-muted-foreground transition-transform duration-200 ${
              showColorEditor ? "rotate-180" : ""
            }`}
          />
        </Button>

        {/* Dedicated Custom Color Card (Under the button) */}
        {(showColorEditor || isAccentCustom) && (
          <div className="p-3 rounded-xl border border-border bg-sidebar space-y-2.5 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-sidebar-muted-foreground uppercase tracking-wide">
                {t("dashboard.sitesEditor.myBrandColorTitle")}
              </span>
              {isAccentCustom && (
                <button
                  type="button"
                  onClick={() => handleSelectAccent(POPULAR_ACCENT_COLORS[0].hex)}
                  className="text-[10px] text-red-500 hover:text-red-600 font-medium cursor-pointer flex items-center gap-1"
                  title={t("dashboard.sitesEditor.resetDefaultFont")}
                >
                  <Trash2 className="w-3 h-3" />
                  Reset
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => colorInputRef.current?.click()}
                  className="w-9 h-9 rounded-xl border border-border flex items-center justify-center transition-all cursor-pointer shadow-xs hover:scale-105"
                  style={{ backgroundColor: currentAccent }}
                  title={t("dashboard.sitesEditor.pickCustomColorTitle")}
                />
                <input
                  ref={colorInputRef}
                  type="color"
                  value={currentAccent.startsWith("#") ? currentAccent : "#E85D2A"}
                  onChange={(e) => handleSelectAccent(e.target.value)}
                  className="sr-only"
                />
              </div>

              <div className="flex-1 relative">
                <input
                  type="text"
                  value={currentAccent}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val.startsWith("#") || val.length <= 7) {
                      handleSelectAccent(val);
                    }
                  }}
                  placeholder="#E85D2A"
                  className="w-full px-3 py-1.5 rounded-lg border border-border bg-sidebar-input text-sidebar-foreground text-xs font-mono uppercase focus:outline-hidden focus:border-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ CARD 2: BRAND TYPOGRAPHY ═════════════════════════════════════ */}
      <div className="rounded-2xl border border-border bg-sidebar-muted/30 p-4 space-y-3.5 shadow-xs">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sidebar-subtle-foreground block mb-0.5">
              {t("dashboard.sitesEditor.brandIdentitySettings")}
            </span>
            <h3 className="text-sm font-bold text-sidebar-foreground">
              {t("dashboard.sitesEditor.brandTypographyCardTitle")}
            </h3>
            <p className="text-[11px] text-sidebar-muted-foreground mt-0.5">
              {t("dashboard.sitesEditor.brandTypographyCardSubtitle")}
            </p>
          </div>
          <div className="p-1.5 rounded-lg bg-sidebar-muted text-sidebar-foreground/80 border border-border/50 shrink-0 ml-2">
            <Type className="w-4 h-4" />
          </div>
        </div>

        {/* Active Font Pairing Box (Pratinjau Font Aktif) */}
        <div className="p-3 rounded-xl border border-border bg-sidebar space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sidebar-muted-foreground uppercase tracking-wide">
              {t("dashboard.sitesEditor.activeFontPairing")}
            </span>
            {(currentHeadingUrl || currentBodyUrl) && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-md">
                <Sparkles className="w-2.5 h-2.5" />
                {t("dashboard.sitesEditor.customFontBadge")}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Heading */}
            <div className="p-2 rounded-lg border border-border/60 bg-sidebar-muted/40 min-w-0">
              <span className="text-[10px] text-sidebar-subtle-foreground block mb-0.5">
                {t("dashboard.sitesEditor.headingShort")}
              </span>
              <span
                className="font-bold text-sidebar-foreground block truncate text-xs"
                style={{ fontFamily: currentHeading }}
              >
                {currentHeading}
              </span>
            </div>

            {/* Body */}
            <div className="p-2 rounded-lg border border-border/60 bg-sidebar-muted/40 min-w-0">
              <span className="text-[10px] text-sidebar-subtle-foreground block mb-0.5">
                {t("dashboard.sitesEditor.bodyShort")}
              </span>
              <span
                className="font-medium text-sidebar-foreground block truncate text-xs"
                style={{ fontFamily: currentBody }}
              >
                {currentBody}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Pairings (Pilihan Pasangan Cepat) */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-medium text-sidebar-muted-foreground block">
            {t("dashboard.sitesEditor.quickPairingsLabel")}
          </span>

          <div className="grid grid-cols-2 gap-1.5">
            {FONT_PAIRING_PRESETS.map((preset) => {
              const isSelected =
                currentHeading === preset.heading &&
                currentBody === preset.body &&
                !currentHeadingUrl &&
                !currentBodyUrl;

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPresetPairing(preset.heading, preset.body)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs"
                      : "border-border/70 bg-sidebar hover:bg-sidebar-muted/60"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sidebar-foreground truncate">
                      {isIndonesian ? preset.nameId : preset.nameEn}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <span
                      className="text-[11px] block truncate font-semibold text-sidebar-foreground"
                      style={{ fontFamily: preset.heading }}
                    >
                      {preset.heading}
                    </span>
                    <span
                      className="text-[10px] block truncate text-sidebar-muted-foreground"
                      style={{ fontFamily: preset.body }}
                    >
                      + {preset.body}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button: Kustomisasi Font */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowFontEditor((prev) => !prev)}
          className="w-full text-xs font-semibold border-border hover:bg-sidebar-muted text-sidebar-foreground cursor-pointer justify-between h-8 px-3"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-sidebar-muted-foreground" />
            {t("dashboard.sitesEditor.customizeFontButton")}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-sidebar-muted-foreground transition-transform duration-200 ${
              showFontEditor ? "rotate-180" : ""
            }`}
          />
        </Button>

        {/* Dedicated Active Custom Font Card (under button when user has custom uploaded/URL font) */}
        {(currentHeadingUrl || currentBodyUrl) && !showFontEditor && (
          <div className="p-3 rounded-xl border border-primary/40 bg-primary/5 space-y-2 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wide flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                {t("dashboard.sitesEditor.brandFontTitle")}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleResetCustomFont("heading");
                  handleResetCustomFont("body");
                }}
                className="text-[10px] text-red-500 hover:text-red-600 font-medium cursor-pointer flex items-center gap-1"
                title={t("dashboard.sitesEditor.resetDefaultFont")}
              >
                <Trash2 className="w-3 h-3" />
                Reset
              </button>
            </div>
            <div className="text-xs space-y-1">
              {currentHeadingUrl && (
                <div className="flex items-center justify-between text-sidebar-foreground">
                  <span className="text-sidebar-muted-foreground text-[11px]">
                    {t("dashboard.sitesEditor.headingShort")}:
                  </span>
                  <span className="font-semibold truncate max-w-[150px]" style={{ fontFamily: currentHeading }}>
                    {currentHeading}
                  </span>
                </div>
              )}
              {currentBodyUrl && (
                <div className="flex items-center justify-between text-sidebar-foreground">
                  <span className="text-sidebar-muted-foreground text-[11px]">
                    {t("dashboard.sitesEditor.bodyShort")}:
                  </span>
                  <span className="font-semibold truncate max-w-[150px]" style={{ fontFamily: currentBody }}>
                    {currentBody}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Custom Font Sub-Editor Drawer */}
        {showFontEditor && (
          <div className="p-3.5 rounded-xl border border-border bg-sidebar space-y-4 animate-in fade-in-50 duration-200">
            {/* Header sub-editor */}
            <div className="flex items-center justify-between border-b border-border/80 pb-2">
              <span className="text-xs font-bold text-sidebar-foreground">
                {t("dashboard.sitesEditor.customizeFontButton")}
              </span>
              <button
                type="button"
                onClick={() => setShowFontEditor(false)}
                className="p-1 rounded-md text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-colors cursor-pointer"
                title={t("dashboard.sitesEditor.closeCustomEditor")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Heading font selection */}
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
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-sidebar"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                        </span>
                        <span style={{ fontFamily: font.id }}>{font.label}</span>
                      </div>
                      <span className="text-[10px] text-sidebar-subtle-foreground font-normal">
                        {isIndonesian ? font.sampleId : font.sampleEn}
                      </span>
                    </label>
                  );
                })}

                {/* Additional Google Fonts Picker */}
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

            {/* Body font selection */}
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
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-sidebar"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
                        </span>
                        <span style={{ fontFamily: font.id }}>{font.label}</span>
                      </div>
                      <span className="text-[10px] text-sidebar-subtle-foreground font-normal">
                        {isIndonesian ? font.sampleId : font.sampleEn}
                      </span>
                    </label>
                  );
                })}

                {/* Additional Google Fonts Picker */}
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
            <div className="pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setShowCustomFontPanel((prev) => !prev)}
                className="w-full flex items-center justify-between text-left text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  {t("dashboard.sitesEditor.customFontDrawerButton")}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    showCustomFontPanel ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showCustomFontPanel && (
                <div className="mt-2.5 p-3 rounded-xl border border-border bg-sidebar-muted/20 space-y-3">
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
                          fontTarget === "heading"
                            ? "bg-sidebar text-foreground shadow-2xs font-bold"
                            : "text-sidebar-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {t("dashboard.sitesEditor.fontTargetHeading")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontTarget("body")}
                        className={`py-1 text-center rounded-md font-medium transition cursor-pointer ${
                          fontTarget === "body"
                            ? "bg-sidebar text-foreground shadow-2xs font-bold"
                            : "text-sidebar-muted-foreground hover:text-foreground"
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
                      onClick={() => {
                        setCustomFontMode("upload");
                        setUploadError(null);
                        setUploadSuccess(null);
                      }}
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
                      onClick={() => {
                        setCustomFontMode("url");
                        setUploadError(null);
                        setUploadSuccess(null);
                      }}
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
                        accept={FONT_UPLOAD_EXTS.join(",")}
                        onChange={handleFileUpload}
                        disabled={uploadingFont}
                        className="sr-only"
                      />
                      <button
                        type="button"
                        onClick={() => fontFileInputRef.current?.click()}
                        disabled={uploadingFont}
                        aria-busy={uploadingFont}
                        className="w-full py-4 border-2 border-dashed border-border hover:border-primary/60 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-sidebar-muted/30 hover:bg-sidebar-muted/60 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                      >
                        <Upload className="w-5 h-5 text-sidebar-muted-foreground" />
                        <span className="text-xs font-semibold text-sidebar-foreground">
                          {uploadingFont
                            ? t("common.processing", "Memproses font...")
                            : t("dashboard.sitesEditor.selectFontFileComputer")}
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
                        className="w-full mt-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                      >
                        <Link2 className="w-3.5 h-3.5 mr-1" />
                        {t("dashboard.sitesEditor.applyFontUrlButton")}
                      </Button>
                    </div>
                  )}

                  {/* Error & Success Feedback */}
                  {uploadError && (
                    <p className="text-[11px] text-destructive flex items-center gap-1 font-medium bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {uploadError}
                    </p>
                  )}
                  {uploadSuccess && (
                    <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                      <Check className="w-3.5 h-3.5 shrink-0" />
                      {uploadSuccess}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Done button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFontEditor(false)}
              className="w-full text-xs font-semibold border-border hover:bg-sidebar-muted text-sidebar-foreground cursor-pointer"
            >
              {t("common.done", "Selesai")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
