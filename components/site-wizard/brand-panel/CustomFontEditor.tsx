"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Upload, Link2, Check, AlertCircle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import {
  loadCustomFont,
  loadGoogleFont,
  verifyFontLoaded,
  parseGoogleFontsUrl,
} from "@/components/templates/helpers";
import { readFontFileDataUrl } from "@/lib/wizard-font-storage";

type FontSlot = "heading" | "body";
type UploadTab = "upload" | "url";

interface FontOption {
  name: string;
  desc: string;
  descEn: string;
}

// Curated Google Fonts library for heading
const HEADING_FONTS: FontOption[] = [
  { name: "Inter", desc: "Modern & Bersih", descEn: "Modern & Clean" },
  { name: "Poppins", desc: "Geometris & Ramah", descEn: "Geometric & Friendly" },
  { name: "Playfair Display", desc: "Klasik & Elegan", descEn: "Classic & Elegant" },
  { name: "Plus Jakarta Sans", desc: "Kontemporer & Tegas", descEn: "Contemporary & Bold" },
  { name: "Montserrat", desc: "Bold & Modern", descEn: "Bold & Modern" },
  { name: "Raleway", desc: "Anggun & Tipis", descEn: "Graceful & Thin" },
  { name: "Oswald", desc: "Kondensed & Kuat", descEn: "Condensed & Strong" },
  { name: "Lora", desc: "Sastra & Halus", descEn: "Literary & Refined" },
  { name: "DM Serif Display", desc: "Premium & Display", descEn: "Premium & Display" },
  { name: "Space Grotesk", desc: "Teknikal & Segar", descEn: "Technical & Fresh" },
  { name: "Fraunces", desc: "Organik & Hangat", descEn: "Organic & Warm" },
  { name: "Cormorant Garamond", desc: "Mewah & Klasik", descEn: "Luxurious & Classic" },
];

// Curated Google Fonts library for body
const BODY_FONTS: FontOption[] = [
  { name: "Inter", desc: "Sangat Readable", descEn: "Highly Readable" },
  { name: "Roboto", desc: "Standar Web Global", descEn: "Global Web Standard" },
  { name: "Open Sans", desc: "Netral & Nyaman", descEn: "Neutral & Comfortable" },
  { name: "Plus Jakarta Sans", desc: "Harmonis Modern", descEn: "Modern Harmony" },
  { name: "Lato", desc: "Hangat & Ramah", descEn: "Warm & Friendly" },
  { name: "Nunito", desc: "Rounded & Approachable", descEn: "Rounded & Approachable" },
  { name: "DM Sans", desc: "Bersih & Versatile", descEn: "Clean & Versatile" },
  { name: "Poppins", desc: "Geometris & Rapi", descEn: "Geometric & Neat" },
  { name: "Source Sans 3", desc: "Legible & Clean", descEn: "Legible & Clean" },
  { name: "Mulish", desc: "Minimalis & Ringan", descEn: "Minimal & Light" },
];

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
  const { t, locale } = useI18n();
  const isEN = locale === "en";
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentTypography =
    theme.draft?.typography ?? theme.applied.typography ?? baseToken?.typography ?? {};
  const baseHeading = baseToken?.typography?.heading_font || "Inter";
  const baseBody = baseToken?.typography?.body_font || "Inter";

  // Selected font state (heading + body independent)
  const [selectedHeading, setSelectedHeading] = useState<string>(
    currentTypography.heading_font || baseHeading
  );
  const [selectedHeadingUrl, setSelectedHeadingUrl] = useState<string>(
    currentTypography.heading_font_url || ""
  );
  const [selectedBody, setSelectedBody] = useState<string>(
    currentTypography.body_font || baseBody
  );
  const [selectedBodyUrl, setSelectedBodyUrl] = useState<string>(
    currentTypography.body_font_url || ""
  );

  // Upload accordion state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSlot, setUploadSlot] = useState<FontSlot>("heading");
  const [uploadTab, setUploadTab] = useState<UploadTab>("upload");
  const [urlInput, setUrlInput] = useState("");
  const [manualFamilyName, setManualFamilyName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Preload all library fonts
  useEffect(() => {
    const allFonts = [...HEADING_FONTS, ...BODY_FONTS];
    const unique = Array.from(new Set(allFonts.map((f) => f.name)));
    // Batch them in pairs to reduce requests
    for (let i = 0; i < unique.length; i += 2) {
      loadGoogleFont(unique[i], unique[i + 1]);
    }
  }, []);

  // Update draft for live preview whenever selection changes
  const applyDraft = useCallback(
    (hName: string, hUrl: string, bName: string, bUrl: string) => {
      theme.setDraft({
        typography: {
          heading_font: hName,
          heading_font_url: hUrl,
          body_font: bName,
          body_font_url: bUrl,
        },
      });
    },
    [theme]
  );

  const handleSelectHeading = (name: string, url: string = "") => {
    setSelectedHeading(name);
    setSelectedHeadingUrl(url);
    applyDraft(name, url, selectedBody, selectedBodyUrl);
  };

  const handleSelectBody = (name: string, url: string = "") => {
    setSelectedBody(name);
    setSelectedBodyUrl(url);
    applyDraft(selectedHeading, selectedHeadingUrl, name, url);
  };

  // File upload handler
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
          t("dashboard.wizard.theme.fontVerifyFailed", "Font tidak bisa dimuat. Periksa URL, atau coba file .woff2.")
        );
        return;
      }
      if (uploadSlot === "heading") {
        handleSelectHeading(name, dataUrl);
      } else {
        handleSelectBody(name, dataUrl);
      }
      setUploadOpen(false);
    } catch (err: any) {
      setErrorMessage(
        err?.message ?? t("dashboard.wizard.theme.fontVerifyFailed", "Gagal memproses file font")
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // URL apply handler
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
          t("dashboard.wizard.theme.fontVerifyFailed", "Font tidak bisa dimuat. Periksa URL, atau coba file .woff2.")
        );
        return;
      }
      if (uploadSlot === "heading") {
        handleSelectHeading(familyName, rawUrl);
      } else {
        handleSelectBody(familyName, rawUrl);
      }
      setUploadOpen(false);
    } catch (err: any) {
      setErrorMessage(
        err?.message ?? t("dashboard.wizard.theme.fontVerifyFailed", "URL font tidak valid")
      );
    } finally {
      setIsProcessing(false);
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

  // Render a font row
  const renderFontRow = (
    name: string,
    desc: string,
    descEn: string,
    isSelected: boolean,
    onSelect: () => void,
    isCustom = false
  ) => (
    <button
      key={name + desc}
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
        isSelected
          ? "border-primary/50 bg-sidebar-muted/60"
          : "border-border/50 bg-sidebar hover:border-border hover:bg-sidebar-muted/30"
      }`}
    >
      {/* Radio dot */}
      <span
        className={`flex-shrink-0 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
          isSelected ? "border-primary bg-primary" : "border-border/70"
        }`}
      >
        {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>

      {/* Font name rendered in its own face */}
      <span
        className={`flex-1 min-w-0 truncate text-[13px] text-sidebar-foreground ${
          isSelected ? "font-bold" : "font-medium"
        }`}
        style={{ fontFamily: `'${name}', sans-serif` }}
      >
        {name}
      </span>

      {/* Description / badge */}
      <span
        className={`text-[10px] shrink-0 ${
          isCustom
            ? "font-semibold text-primary"
            : isSelected
            ? "font-semibold text-sidebar-foreground"
            : "text-sidebar-muted-foreground"
        }`}
      >
        {isCustom ? t("dashboard.sitesEditor.customFontBadge", "Custom Font") : (isEN ? descEn : desc)}
      </span>
    </button>
  );

  const headingInLibrary = HEADING_FONTS.some((f) => f.name === selectedHeading);
  const bodyInLibrary = BODY_FONTS.some((f) => f.name === selectedBody);

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* ── Header ──────────────────────────────────────────── */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-border">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-sidebar-foreground">
            {t("dashboard.wizard.theme.customFontTitle", "Font Kustom")}
          </p>
          <p className="text-[11px] text-sidebar-muted-foreground truncate">
            {t("dashboard.wizard.theme.customFontSubtitle", "Pilih font untuk heading & body")}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-all cursor-pointer shrink-0"
          title={t("common.close", "Tutup")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* ── Scrollable content ──────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-5">

          {/* Heading Font Section */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-sidebar-foreground">
              {t("dashboard.wizard.theme.slotHeadingFull", "Heading font")}
            </p>
            <div className="space-y-1">
              {HEADING_FONTS.map((f) =>
                renderFontRow(
                  f.name,
                  f.desc,
                  f.descEn,
                  selectedHeading === f.name,
                  () => handleSelectHeading(f.name)
                )
              )}
              {/* Show custom heading if not in library */}
              {!headingInLibrary && selectedHeading &&
                renderFontRow(selectedHeading, "Custom Font", "Custom Font", true, () => {}, true)}
            </div>
          </div>

          {/* Body Font Section */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-sidebar-foreground">
              {t("dashboard.wizard.theme.slotBodyFull", "Body font")}
            </p>
            <div className="space-y-1">
              {BODY_FONTS.map((f) =>
                renderFontRow(
                  f.name,
                  f.desc,
                  f.descEn,
                  selectedBody === f.name,
                  () => handleSelectBody(f.name)
                )
              )}
              {/* Show custom body if not in library */}
              {!bodyInLibrary && selectedBody &&
                renderFontRow(selectedBody, "Custom Font", "Custom Font", true, () => {}, true)}
            </div>
          </div>

          {/* ── Upload custom font accordion ───────────────── */}
          <div className="rounded-xl border border-border/70 overflow-hidden">
            <button
              type="button"
              onClick={() => setUploadOpen((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-sidebar-muted/40 hover:bg-sidebar-muted/70 transition-colors cursor-pointer text-left"
            >
              <Upload className="h-3.5 w-3.5 text-sidebar-foreground shrink-0" />
              <span className="flex-1 text-xs font-semibold text-sidebar-foreground">
                {t(
                  "dashboard.wizard.theme.uploadCustomFontAccordion",
                  "Upload font sendiri atau pakai URL font"
                )}
              </span>
              {uploadOpen ? (
                <ChevronUp className="h-4 w-4 text-sidebar-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-sidebar-muted-foreground" />
              )}
            </button>

            {uploadOpen && (
              <div className="p-3 space-y-3 border-t border-border/50 bg-sidebar">
                {/* TERAPKAN KE */}
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-sidebar-subtle-foreground">
                    {t("dashboard.wizard.theme.useFor", "Terapkan ke")}:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["heading", "body"] as FontSlot[]).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setUploadSlot(slot)}
                        className={`rounded-lg py-2 px-2 text-xs font-semibold border transition-all cursor-pointer text-center ${
                          uploadSlot === slot
                            ? "bg-primary text-primary-foreground border-primary font-bold"
                            : "bg-sidebar-muted/40 border-border text-sidebar-muted-foreground hover:bg-sidebar-muted"
                        }`}
                      >
                        {slot === "heading"
                          ? t("dashboard.wizard.theme.slotHeadingFull", "Font Judul (Heading)")
                          : t("dashboard.wizard.theme.slotBodyFull", "Font Teks (Body)")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-tabs: Upload / URL */}
                <div className="flex gap-4 border-b border-border/50 pb-2">
                  {(["upload", "url"] as UploadTab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => {
                        setUploadTab(tab);
                        setErrorMessage(null);
                      }}
                      className={`flex items-center gap-1.5 text-xs font-semibold pb-1 border-b-2 transition-all cursor-pointer ${
                        uploadTab === tab
                          ? "border-primary text-sidebar-foreground"
                          : "border-transparent text-sidebar-muted-foreground hover:text-sidebar-foreground"
                      }`}
                    >
                      {tab === "upload" ? (
                        <>
                          <Upload className="h-3 w-3" />
                          {t("dashboard.wizard.theme.fontUploadTab", "Upload File (.woff2/.ttf)")}
                        </>
                      ) : (
                        <>
                          <Link2 className="h-3 w-3" />
                          {t("dashboard.wizard.theme.fontUrlTab", "Input URL Font")}
                        </>
                      )}
                    </button>
                  ))}
                </div>

                {/* Upload area */}
                {uploadTab === "upload" && (
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
                      className="rounded-xl border border-dashed border-border hover:border-primary/60 bg-sidebar-muted/20 hover:bg-sidebar-muted/40 p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all"
                    >
                      <Upload className="h-6 w-6 text-sidebar-muted-foreground mb-2" />
                      <p className="text-xs font-bold text-sidebar-foreground">
                        {t("dashboard.wizard.theme.fontUploadAction", "Pilih file font dari komputer")}
                      </p>
                      <p className="text-[10px] text-sidebar-muted-foreground mt-1">
                        {isEN
                          ? "Format: .woff2 (recommended), .ttf, .otf (Max 3 MB)"
                          : "Format: .woff2 (rekomendasi), .ttf, .otf (Maks. 3 MB)"}
                      </p>
                    </div>
                  </div>
                )}

                {/* URL input */}
                {uploadTab === "url" && (
                  <div className="space-y-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground mb-1 uppercase tracking-wide">
                        URL Font
                      </label>
                      <input
                        type="text"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://fonts.googleapis.com/css2?family=..."
                        className="w-full rounded-lg bg-sidebar-input border border-border px-2.5 py-1.5 text-xs text-sidebar-foreground placeholder:text-sidebar-muted-foreground focus:border-primary focus:outline-none transition-all font-mono"
                      />
                    </div>
                    {urlInput && !parseGoogleFontsUrl(urlInput) && (
                      <div>
                        <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground mb-1 uppercase tracking-wide">
                          {t("dashboard.wizard.theme.fontName", "Nama Font Family")}
                        </label>
                        <input
                          type="text"
                          value={manualFamilyName}
                          onChange={(e) => setManualFamilyName(e.target.value)}
                          placeholder={isEN ? "e.g. My Custom Sans" : "Contoh: My Custom Sans"}
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

                {/* Error */}
                {errorMessage && (
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="line-clamp-2">{errorMessage}</span>
                  </div>
                )}

                {/* License note */}
                <p className="text-[10px] text-sidebar-muted-foreground leading-normal italic">
                  {t(
                    "dashboard.wizard.theme.licenseNote",
                    "Pastikan Anda memiliki lisensi penggunaan komersial untuk font yang diunggah."
                  )}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Footer buttons ──────────────────────────────────── */}
      <div className="shrink-0 flex gap-2 p-4 border-t border-border bg-sidebar">
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
  );
}
