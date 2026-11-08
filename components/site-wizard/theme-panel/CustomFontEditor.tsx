"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Palette,
  ChevronDown,
  Upload,
  Link2,
  Trash2,
  Sparkles,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { loadGoogleFont, loadCustomFont } from "@/components/templates/helpers";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import {
  readFontFileDataUrl,
  saveCustomFontStorage,
  WIZARD_FONT_EXTS,
} from "@/lib/wizard-font-storage";

export const POPULAR_HEADING_FONTS = [
  { id: "Inter", label: "Inter", sampleId: "Modern & Bersih", sampleEn: "Modern & Clean" },
  { id: "Poppins", label: "Poppins", sampleId: "Geometris & Ramah", sampleEn: "Geometric & Friendly" },
  { id: "Playfair Display", label: "Playfair Display", sampleId: "Klasik & Elegan", sampleEn: "Classic & Elegant" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sampleId: "Kontemporer & Tegas", sampleEn: "Contemporary & Bold" },
];

export const POPULAR_BODY_FONTS = [
  { id: "Inter", label: "Inter", sampleId: "Sangat mudah dibaca", sampleEn: "Highly readable" },
  { id: "Roboto", label: "Roboto", sampleId: "Standar global web", sampleEn: "Global web standard" },
  { id: "Open Sans", label: "Open Sans", sampleId: "Netral & nyaman", sampleEn: "Neutral & comfortable" },
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", sampleId: "Harmonis modern", sampleEn: "Modern harmony" },
];

export const GOOGLE_FONTS_WHITELIST = [
  "Inter", "Roboto", "Open Sans", "Montserrat", "Lato",
  "Poppins", "Outfit", "Plus Jakarta Sans", "Work Sans", "DM Sans",
  "Playfair Display", "Merriweather", "Lora", "PT Serif",
  "Cinzel", "Cormorant Garamond", "Arvo",
  "Oswald", "Bebas Neue", "Space Grotesk",
  "Fraunces", "Bricolage Grotesque", "Sora", "Urbanist",
  "Schibsted Grotesk", "JetBrains Mono",
];

interface CustomFontEditorProps {
  theme: UseThemeDraftReturn;
  baseToken?: Record<string, any> | null;
  onClose: () => void;
  onApply: () => void;
}

export function CustomFontEditor({
  theme,
  baseToken,
  onClose,
  onApply,
}: CustomFontEditorProps) {
  const { t, isIndonesian } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial font states
  const initialHeading =
    theme.draft?.typography?.heading_font ??
    theme.applied.typography?.heading_font ??
    baseToken?.typography?.heading_font ??
    "Inter";
  const initialBody =
    theme.draft?.typography?.body_font ??
    theme.applied.typography?.body_font ??
    baseToken?.typography?.body_font ??
    "Inter";
  const initialHeadingUrl =
    theme.draft?.typography?.heading_font_url ??
    theme.applied.typography?.heading_font_url ??
    baseToken?.typography?.heading_font_url ??
    "";
  const initialBodyUrl =
    theme.draft?.typography?.body_font_url ??
    theme.applied.typography?.body_font_url ??
    baseToken?.typography?.body_font_url ??
    "";

  const [headingFont, setHeadingFont] = useState(initialHeading);
  const [headingUrl, setHeadingUrl] = useState(initialHeadingUrl);
  const [bodyFont, setBodyFont] = useState(initialBody);
  const [bodyUrl, setBodyUrl] = useState(initialBodyUrl);

  // Accordion drawer states
  const [showDrawer, setShowDrawer] = useState(false);
  const [fontTarget, setFontTarget] = useState<"heading" | "body">("heading");
  const [customMode, setCustomMode] = useState<"upload" | "url">("upload");
  const [urlFamily, setUrlFamily] = useState("");
  const [urlHref, setUrlHref] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Dropdown states for Google Fonts
  const [headingDropdownOpen, setHeadingDropdownOpen] = useState(false);
  const [bodyDropdownOpen, setBodyDropdownOpen] = useState(false);
  const headingDropdownRef = useRef<HTMLDivElement>(null);
  const bodyDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        headingDropdownRef.current &&
        !headingDropdownRef.current.contains(e.target as Node)
      ) {
        setHeadingDropdownOpen(false);
      }
      if (
        bodyDropdownRef.current &&
        !bodyDropdownRef.current.contains(e.target as Node)
      ) {
        setBodyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preload fonts for real-time visual fidelity
  useEffect(() => {
    loadGoogleFont(headingFont, bodyFont, headingUrl, bodyUrl);
    POPULAR_HEADING_FONTS.forEach((f) => loadGoogleFont(f.id));
    POPULAR_BODY_FONTS.forEach((f) => loadGoogleFont(f.id));
  }, [headingFont, bodyFont, headingUrl, bodyUrl]);

  // Sync draft live preview when font states change
  const updateLivePreview = useCallback(
    (hFont: string, hUrl: string, bFont: string, bUrl: string) => {
      theme.setDraft({
        typography: {
          heading_font: hFont,
          heading_font_url: hUrl,
          body_font: bFont,
          body_font_url: bUrl,
        },
      });
    },
    [theme]
  );

  const handleSelectHeading = (fontName: string) => {
    setHeadingFont(fontName);
    setHeadingUrl("");
    loadGoogleFont(fontName, bodyFont, "", bodyUrl);
    updateLivePreview(fontName, "", bodyFont, bodyUrl);
  };

  const handleSelectBody = (fontName: string) => {
    setBodyFont(fontName);
    setBodyUrl("");
    loadGoogleFont(headingFont, fontName, headingUrl, "");
    updateLivePreview(headingFont, headingUrl, fontName, "");
  };

  const handleResetCustom = (target: "heading" | "body") => {
    if (target === "heading") {
      setHeadingFont("Inter");
      setHeadingUrl("");
      updateLivePreview("Inter", "", bodyFont, bodyUrl);
    } else {
      setBodyFont("Inter");
      setBodyUrl("");
      updateLivePreview(headingFont, headingUrl, "Inter", "");
    }
  };

  // Upload handler for local font file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);
    setUploading(true);

    try {
      const { dataUrl, name } = await readFontFileDataUrl(file);
      loadCustomFont(name, dataUrl);

      if (fontTarget === "heading") {
        setHeadingFont(name);
        setHeadingUrl(dataUrl);
        saveCustomFontStorage("heading", name, dataUrl);
        updateLivePreview(name, dataUrl, bodyFont, bodyUrl);
      } else {
        setBodyFont(name);
        setBodyUrl(dataUrl);
        saveCustomFontStorage("body", name, dataUrl);
        updateLivePreview(headingFont, headingUrl, name, dataUrl);
      }
      setSuccessMsg(
        t("dashboard.sitesEditor.customFontAppliedSuccess", 'Font "{name}" berhasil diterapkan!', {
          name,
        })
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message
          ? err.message
          : t("dashboard.sitesEditor.fontReadError", "Gagal membaca file font")
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // URL handler for Google Fonts / Custom CSS URL
  const handleApplyUrl = () => {
    if (!urlFamily.trim() || !urlHref.trim()) {
      setErrorMsg(
        t("dashboard.sitesEditor.fontNameAndUrlRequired", "Nama font dan URL font wajib diisi")
      );
      return;
    }
    setErrorMsg(null);
    const cleanName = urlFamily.trim();
    const cleanUrl = urlHref.trim();

    loadCustomFont(cleanName, cleanUrl);

    if (fontTarget === "heading") {
      setHeadingFont(cleanName);
      setHeadingUrl(cleanUrl);
      saveCustomFontStorage("heading", cleanName, cleanUrl);
      updateLivePreview(cleanName, cleanUrl, bodyFont, bodyUrl);
    } else {
      setBodyFont(cleanName);
      setBodyUrl(cleanUrl);
      saveCustomFontStorage("body", cleanName, cleanUrl);
      updateLivePreview(headingFont, headingUrl, cleanName, cleanUrl);
    }
    setSuccessMsg(
      t(
        "dashboard.sitesEditor.customFontUrlAppliedSuccess",
        'Font "{name}" dari URL berhasil diterapkan!',
        { name: cleanName }
      )
    );
  };

  // Commit and apply changes
  const handleApply = () => {
    theme.applyNow({
      typography: {
        heading_font: headingFont,
        heading_font_url: headingUrl,
        body_font: bodyFont,
        body_font_url: bodyUrl,
      },
    });

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(
          "webjoz_wizard_custom_typography",
          JSON.stringify({
            heading_font: headingFont,
            heading_font_url: headingUrl,
            body_font: bodyFont,
            body_font_url: bodyUrl,
          })
        );
      } catch {}
    }

    onApply();
    onClose();
  };

  // Cancel and discard draft
  const handleCancel = () => {
    theme.clearDraft();
    onClose();
  };

  const isHeadingInPopular = POPULAR_HEADING_FONTS.some((f) => f.id === headingFont);
  const isBodyInPopular = POPULAR_BODY_FONTS.some((f) => f.id === bodyFont);
  const isHeadingCustomGoogle = !isHeadingInPopular && !headingUrl;
  const isBodyCustomGoogle = !isBodyInPopular && !bodyUrl;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#12151b] p-4 space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-0.5">
            {t("dashboard.sitesEditor.brandIdentitySettings", "PENGATURAN IDENTITAS")}
          </span>
          <h3 className="text-sm font-bold text-white">
            {t("dashboard.sitesEditor.brandStyle", "Gaya Brand (Brand style)")}
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {t(
              "dashboard.sitesEditor.brandStyleSubtitle",
              "Jaga konsistensi font & warna di seluruh halaman"
            )}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 rounded-lg bg-white/[0.06] text-slate-300 border border-white/10">
            <Palette className="w-4 h-4" />
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={t("common.close", "Tutup")}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Heading font section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 block">
            {t("dashboard.sitesEditor.headingFontLabel", "Font Judul (Heading font)")}
          </label>
          {headingUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded-md font-medium border border-cyan-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              {t("dashboard.sitesEditor.customFontBadge", "Custom Font")}
              <button
                type="button"
                onClick={() => handleResetCustom("heading")}
                className="hover:text-red-400 ml-0.5 cursor-pointer"
                title={t("dashboard.sitesEditor.resetDefaultFont", "Reset ke font bawaan")}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {POPULAR_HEADING_FONTS.map((font) => {
            const isSelected = headingFont === font.id && !headingUrl;
            return (
              <label
                key={font.id}
                onClick={() => handleSelectHeading(font.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30 shadow-xs"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400 text-slate-900"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </span>
                  <span style={{ fontFamily: font.id }}>{font.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isIndonesian ? font.sampleId : font.sampleEn}
                </span>
              </label>
            );
          })}

          {/* Active Custom Font item (Upload/URL) */}
          {headingUrl && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border text-xs border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3.5 h-3.5 rounded-full border border-cyan-400 bg-cyan-400 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </span>
                <span className="truncate" style={{ fontFamily: headingFont }}>
                  {headingFont}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("dashboard.sitesEditor.customFontBadge", "Custom Font")}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetCustom("heading")}
                  className="hover:text-red-400 text-slate-400 cursor-pointer p-0.5"
                  title={t("dashboard.sitesEditor.resetDefaultFont", "Reset ke font bawaan")}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Additional Google Fonts Dropdown */}
          {!headingUrl && (
            <div ref={headingDropdownRef} className="relative pt-0.5">
              <button
                type="button"
                onClick={() => setHeadingDropdownOpen((v) => !v)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isHeadingCustomGoogle
                    ? "border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isHeadingCustomGoogle
                        ? "border-cyan-400 bg-cyan-400 text-slate-900"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isHeadingCustomGoogle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </span>
                  <span
                    className="truncate"
                    style={{ fontFamily: isHeadingCustomGoogle ? headingFont : undefined }}
                  >
                    {isHeadingCustomGoogle
                      ? headingFont
                      : t(
                          "dashboard.sitesEditor.moreGoogleFontsPlaceholder",
                          "Pilih Google Font lainnya..."
                        )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isHeadingCustomGoogle && (
                    <span className="text-[10px] text-cyan-300/80 font-normal">
                      {t("dashboard.sitesEditor.googleFontBadge", "Google Font")}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      headingDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {headingDropdownOpen && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#161a22] border border-white/15 rounded-xl max-h-56 overflow-y-auto shadow-2xl p-1">
                  {GOOGLE_FONTS_WHITELIST.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        handleSelectHeading(f);
                        setHeadingDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        f === headingFont
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                      style={{ fontFamily: f }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body font section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 block">
            {t("dashboard.sitesEditor.bodyFontLabel", "Font Teks Isi (Body font)")}
          </label>
          {bodyUrl && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded-md font-medium border border-cyan-500/30">
              <Sparkles className="w-2.5 h-2.5" />
              {t("dashboard.sitesEditor.customFontBadge", "Custom Font")}
              <button
                type="button"
                onClick={() => handleResetCustom("body")}
                className="hover:text-red-400 ml-0.5 cursor-pointer"
                title={t("dashboard.sitesEditor.resetDefaultFont", "Reset ke font bawaan")}
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          {POPULAR_BODY_FONTS.map((font) => {
            const isSelected = bodyFont === font.id && !bodyUrl;
            return (
              <label
                key={font.id}
                onClick={() => handleSelectBody(font.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? "border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30 shadow-xs"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-slate-300 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-cyan-400 bg-cyan-400 text-slate-900"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </span>
                  <span style={{ fontFamily: font.id }}>{font.label}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-normal">
                  {isIndonesian ? font.sampleId : font.sampleEn}
                </span>
              </label>
            );
          })}

          {/* Active Custom Font item (Upload/URL) */}
          {bodyUrl && (
            <div className="flex items-center justify-between px-3 py-2 rounded-xl border text-xs border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30">
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-3.5 h-3.5 rounded-full border border-cyan-400 bg-cyan-400 flex items-center justify-center shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                </span>
                <span className="truncate" style={{ fontFamily: bodyFont }}>
                  {bodyFont}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="inline-flex items-center gap-1 text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded-md font-medium">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("dashboard.sitesEditor.customFontBadge", "Custom Font")}
                </span>
                <button
                  type="button"
                  onClick={() => handleResetCustom("body")}
                  className="hover:text-red-400 text-slate-400 cursor-pointer p-0.5"
                  title={t("dashboard.sitesEditor.resetDefaultFont", "Reset ke font bawaan")}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}

          {/* Additional Google Fonts Dropdown */}
          {!bodyUrl && (
            <div ref={bodyDropdownRef} className="relative pt-0.5">
              <button
                type="button"
                onClick={() => setBodyDropdownOpen((v) => !v)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl border text-xs cursor-pointer transition-all ${
                  isBodyCustomGoogle
                    ? "border-cyan-400/80 bg-cyan-500/10 text-white font-semibold ring-1 ring-cyan-400/30"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] text-slate-400 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isBodyCustomGoogle
                        ? "border-cyan-400 bg-cyan-400 text-slate-900"
                        : "border-white/20 bg-transparent"
                    }`}
                  >
                    {isBodyCustomGoogle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                    )}
                  </span>
                  <span
                    className="truncate"
                    style={{ fontFamily: isBodyCustomGoogle ? bodyFont : undefined }}
                  >
                    {isBodyCustomGoogle
                      ? bodyFont
                      : t(
                          "dashboard.sitesEditor.moreGoogleFontsPlaceholder",
                          "Pilih Google Font lainnya..."
                        )}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {isBodyCustomGoogle && (
                    <span className="text-[10px] text-cyan-300/80 font-normal">
                      {t("dashboard.sitesEditor.googleFontBadge", "Google Font")}
                    </span>
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      bodyDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </button>

              {bodyDropdownOpen && (
                <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-[#161a22] border border-white/15 rounded-xl max-h-56 overflow-y-auto shadow-2xl p-1">
                  {GOOGLE_FONTS_WHITELIST.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => {
                        handleSelectBody(f);
                        setBodyDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        f === bodyFont
                          ? "bg-cyan-500/20 text-cyan-300 font-semibold"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                      style={{ fontFamily: f }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Accordion Drawer: Upload Font Kustom & Input URL Font */}
      <div className="pt-2 border-t border-white/10">
        <button
          type="button"
          onClick={() => setShowDrawer((prev) => !prev)}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
            showDrawer
              ? "border-cyan-400/80 bg-cyan-500/10 text-cyan-300 ring-1 ring-cyan-400/30"
              : "border-white/10 bg-white/[0.03] text-slate-300 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <span className="flex items-center gap-2">
            <Upload className="w-3.5 h-3.5" />
            {t(
              "dashboard.sitesEditor.customFontDrawerButton",
              "Upload font sendiri atau pakai URL font"
            )}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              showDrawer ? "rotate-180" : ""
            }`}
          />
        </button>

        {showDrawer && (
          <div className="mt-3 p-3.5 rounded-xl border border-white/10 bg-white/[0.02] space-y-3.5 animate-in fade-in-50 duration-200">
            {/* Target Font selector */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                {t("dashboard.sitesEditor.applyFontTo", "Terapkan Ke:")}
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-0.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs">
                <button
                  type="button"
                  onClick={() => setFontTarget("heading")}
                  className={`py-1.5 text-center rounded-md font-semibold transition-all cursor-pointer ${
                    fontTarget === "heading"
                      ? "bg-white/15 text-white shadow-xs font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("dashboard.sitesEditor.fontTargetHeading", "Font Judul (Heading)")}
                </button>
                <button
                  type="button"
                  onClick={() => setFontTarget("body")}
                  className={`py-1.5 text-center rounded-md font-semibold transition-all cursor-pointer ${
                    fontTarget === "body"
                      ? "bg-white/15 text-white shadow-xs font-bold"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {t("dashboard.sitesEditor.fontTargetBody", "Font Teks (Body)")}
                </button>
              </div>
            </div>

            {/* Sub-Tabs: Upload File vs Font URL */}
            <div className="flex gap-4 border-b border-white/10 pb-2">
              <button
                type="button"
                onClick={() => {
                  setCustomMode("upload");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`text-xs font-semibold pb-1 flex items-center gap-1.5 transition cursor-pointer border-b-2 -mb-[9px] ${
                  customMode === "upload"
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                {t("dashboard.sitesEditor.uploadFontTab", "Upload File (.woff2/.ttf)")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCustomMode("url");
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className={`text-xs font-semibold pb-1 flex items-center gap-1.5 transition cursor-pointer border-b-2 -mb-[9px] ${
                  customMode === "url"
                    ? "border-cyan-400 text-cyan-300"
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                {t("dashboard.sitesEditor.urlFontTab", "Input URL Font")}
              </button>
            </div>

            {/* Mode 1: Upload File */}
            {customMode === "upload" && (
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={WIZARD_FONT_EXTS.join(",")}
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="sr-only"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-5 border-2 border-dashed border-white/20 hover:border-cyan-400/60 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-semibold text-white">
                    {uploading
                      ? t("common.processing", "Memproses font...")
                      : t(
                          "dashboard.sitesEditor.selectFontFileComputer",
                          "Pilih file font dari komputer"
                        )}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t(
                      "dashboard.sitesEditor.fontFileFormatHint",
                      "Format: .woff2 (rekomendasi), .ttf, .otf (Maks. 3 MB)"
                    )}
                  </span>
                </button>
              </div>
            )}

            {/* Mode 2: Font URL */}
            {customMode === "url" && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    {t("dashboard.sitesEditor.fontFamilyNameLabel", "Nama Font Family:")}
                  </label>
                  <input
                    type="text"
                    placeholder={t(
                      "dashboard.sitesEditor.fontFamilyNamePlaceholder",
                      "mis. Clash Display / Helvetica"
                    )}
                    value={urlFamily}
                    onChange={(e) => setUrlFamily(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.05] text-white text-xs focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                    {t(
                      "dashboard.sitesEditor.fontUrlLabel",
                      "URL Font (Stylesheet CSS / Woff2):"
                    )}
                  </label>
                  <input
                    type="url"
                    placeholder={t(
                      "dashboard.sitesEditor.fontUrlPlaceholder",
                      "https://api.fontshare.com/v2/css?f[]=... atau .woff2"
                    )}
                    value={urlHref}
                    onChange={(e) => setUrlHref(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.05] text-white text-xs focus:outline-hidden focus:border-cyan-400 font-mono text-[11px]"
                  />
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={handleApplyUrl}
                  className="w-full text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer"
                >
                  <Link2 className="w-3.5 h-3.5 mr-1.5" />
                  {t("dashboard.sitesEditor.applyFontUrlButton", "Terapkan Font URL")}
                </Button>
              </div>
            )}

            {/* Feedback messages */}
            {errorMsg && (
              <div className="flex items-center gap-1.5 text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1.5 rounded-lg">
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons: Cancel and Apply */}
      <div className="pt-2 flex items-center gap-2 border-t border-white/10">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCancel}
          className="flex-1 text-xs border-white/15 hover:bg-white/10 text-slate-300 hover:text-white cursor-pointer"
        >
          {t("dashboard.wizard.theme.cancel", "Batal")}
        </Button>
        <Button
          type="button"
          variant="default"
          size="sm"
          onClick={handleApply}
          className="flex-1 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-900 shadow-md shadow-cyan-500/20 cursor-pointer"
        >
          {t("dashboard.wizard.theme.apply", "Terapkan")}
        </Button>
      </div>
    </div>
  );
}
