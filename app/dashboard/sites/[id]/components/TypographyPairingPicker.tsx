"use client";

import React, { useState, useEffect, useRef } from "react";
import { CustomSelect, Button } from "webjoz-ui";
import {
  type TypographyPairing,
  getEnabledTypographyPairings,
} from "@/lib/design-assets-config";
import { loadGoogleFont, loadCustomFont } from "@/components/templates/helpers";
import FontPicker from "./FontPicker";
import { useI18n } from "@/lib/i18n/context";
import { SparkleIcon } from "@/components/sparkle-icon";
import { Check, Type, Sparkles, ChevronDown, Upload, Link2, AlertCircle, X } from "lucide-react";
import {
  uploadFontFile,
  FONT_UPLOAD_EXTS,
  FONT_UPLOAD_MAX_BYTES,
} from "@/components/file-upload";

interface Props {
  designToken: any;
  aiDesignToken?: any;
  designTokenScore?: number;
  onApply: (pairing: TypographyPairing) => void;
  onFieldChange?: (field: string, subfield: string, value: string) => void;
  onRestoreAi?: () => void;
}

export default function TypographyPairingPicker({
  designToken,
  aiDesignToken,
  designTokenScore,
  onApply,
  onFieldChange,
  onRestoreAi,
}: Props) {
  const { t, locale } = useI18n();
  const isEN = locale === "en";
  const [showBrandFont, setShowBrandFont] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [customMode, setCustomMode] = useState<"upload" | "url">("upload");
  const [fontTarget, setFontTarget] = useState<"heading" | "body">("heading");
  const [urlFamily, setUrlFamily] = useState("");
  const [urlHref, setUrlHref] = useState("");
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pairings = getEnabledTypographyPairings();

  useEffect(() => {
    pairings.forEach((p) => loadGoogleFont(p.heading_font, p.body_font));
  }, []);

  const currentHeading = designToken?.typography?.heading_font || "Inter";
  const currentBody = designToken?.typography?.body_font || "Inter";
  const currentHeadingUrl = designToken?.typography?.heading_font_url || "";
  const currentBodyUrl = designToken?.typography?.body_font_url || "";

  useEffect(() => {
    loadGoogleFont(currentHeading, currentBody, currentHeadingUrl, currentBodyUrl);
  }, [currentHeading, currentBody, currentHeadingUrl, currentBodyUrl]);

  // Handle local font upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!FONT_UPLOAD_EXTS.includes(ext)) {
      setErrorMsg(t("dashboard.sitesEditor.fontInvalidFormatError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > FONT_UPLOAD_MAX_BYTES) {
      setErrorMsg(t("dashboard.sitesEditor.fontFileSizeError"));
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const cleanFontName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]/g, " ")
      .trim();

    setUploading(true);
    try {
      const fontUrl = await uploadFontFile(file);
      loadCustomFont(cleanFontName, fontUrl);

      if (fontTarget === "heading") {
        onFieldChange?.("typography", "heading_font", cleanFontName);
        onFieldChange?.("typography", "heading_font_url", fontUrl);
      } else {
        onFieldChange?.("typography", "body_font", cleanFontName);
        onFieldChange?.("typography", "body_font_url", fontUrl);
      }

      setSuccessMsg(
        t("dashboard.sitesEditor.customFontAppliedSuccess", undefined, { name: cleanFontName })
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error && err.message ? err.message : t("dashboard.sitesEditor.fontReadError")
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Handle URL Font
  const handleApplyUrl = () => {
    if (!urlFamily.trim() || !urlHref.trim()) {
      setErrorMsg(t("dashboard.sitesEditor.fontNameAndUrlRequired"));
      return;
    }

    setErrorMsg(null);
    const fontName = urlFamily.trim();
    const fontUrl = urlHref.trim();

    loadCustomFont(fontName, fontUrl);

    if (fontTarget === "heading") {
      onFieldChange?.("typography", "heading_font", fontName);
      onFieldChange?.("typography", "heading_font_url", fontUrl);
    } else {
      onFieldChange?.("typography", "body_font", fontName);
      onFieldChange?.("typography", "body_font_url", fontUrl);
    }

    setSuccessMsg(
      t("dashboard.sitesEditor.customFontUrlAppliedSuccess", undefined, { name: fontName })
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
          {t("dashboard.sitesEditor.typographyPairings", "Kombinasi Tipografi")}
        </label>
        {aiDesignToken?.typography && (
          <button
            type="button"
            onClick={onRestoreAi}
            className="flex items-center gap-1 text-[10px] text-primary hover:underline font-semibold cursor-pointer"
          >
            <SparkleIcon className="w-2.5 h-2.5" />
            {t("dashboard.sitesEditor.restoreAi", "Pulihkan AI")}
          </button>
        )}
      </div>

      {/* Preset Pairings Grid */}
      <div className="grid grid-cols-2 gap-2">
        {pairings.map((pairing) => {
          const isSelected =
            currentHeading.toLowerCase() === pairing.heading_font.toLowerCase() &&
            currentBody.toLowerCase() === pairing.body_font.toLowerCase() &&
            !currentHeadingUrl &&
            !currentBodyUrl;

          return (
            <button
              key={pairing.id}
              type="button"
              onClick={() => onApply(pairing)}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary/40 shadow-xs"
                  : "border-border/70 bg-sidebar hover:border-border hover:bg-sidebar-muted/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-sidebar-foreground truncate">
                  {isEN ? (pairing.nameEn || pairing.name) : pairing.name}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                )}
              </div>

              <div className="space-y-0.5">
                <p
                  style={{
                    fontFamily: `'${pairing.heading_font}', sans-serif`,
                    fontWeight: pairing.heading_weight || "700",
                    fontSize: "12px",
                  }}
                  className="text-sidebar-foreground truncate"
                >
                  {pairing.heading_font}
                </p>
                <p
                  style={{
                    fontFamily: `'${pairing.body_font}', sans-serif`,
                    fontSize: "10px",
                    lineHeight: 1.4,
                  }}
                  className="text-sidebar-muted-foreground truncate"
                >
                  {pairing.body_font}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Brand Font Button (Theme Panel Style) ────────────────────── */}
      <button
        type="button"
        onClick={() => setShowBrandFont((v) => !v)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl border border-dashed border-border bg-sidebar hover:bg-sidebar-muted/50 transition-all cursor-pointer text-sidebar-foreground"
      >
        <span className="flex items-center gap-2 text-xs font-semibold">
          <Type className="h-4 w-4 text-sidebar-foreground shrink-0" />
          {t("dashboard.sitesEditor.brandFontButton", "Font brand saya")}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-sidebar-muted-foreground transition-transform duration-200 ${
            showBrandFont ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ── Dedicated Card for Brand Font (Always visible underneath) ── */}
      <div className="w-full p-3 rounded-xl border border-border bg-sidebar text-left space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[11px] font-bold text-sidebar-foreground truncate">
              {t("dashboard.sitesEditor.brandFontTitle", "Font Brand Saya")}
            </span>
            {(currentHeadingUrl || currentBodyUrl) && (
              <span className="inline-flex shrink-0 items-center rounded px-1.5 py-0.5 text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                Custom
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowBrandFont((v) => !v)}
            className="text-[10px] text-primary hover:underline font-semibold cursor-pointer"
          >
            {showBrandFont ? t("dashboard.sitesEditor.closeCustomEditor", "Tutup") : t("dashboard.sitesEditor.edit", "Ubah")}
          </button>
        </div>

        {/* Font sample box in real font styling */}
        <div className="p-2 rounded-lg bg-sidebar-muted/40 border border-border/40 space-y-0.5">
          <p
            style={{ fontFamily: `'${currentHeading}', sans-serif`, fontWeight: 700 }}
            className="text-xs text-sidebar-foreground leading-tight truncate"
          >
            {currentHeading}
          </p>
          <p
            style={{ fontFamily: `'${currentBody}', sans-serif` }}
            className="text-[10px] text-sidebar-muted-foreground leading-normal truncate"
          >
            {currentBody} &middot; Aa Bb Cc 123
          </p>
        </div>
      </div>

      {/* ── Sub-Editor (Expandable when clicked) ───────────────────────── */}
      {showBrandFont && (
        <div className="p-3.5 rounded-xl border border-border bg-sidebar space-y-3.5 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between border-b border-border/80 pb-2">
            <span className="text-xs font-bold text-sidebar-foreground">
              {t("dashboard.sitesEditor.customizeFontButton", "Kustomisasi Font")}
            </span>
            <button
              type="button"
              onClick={() => setShowBrandFont(false)}
              className="p-1 rounded-md text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-colors cursor-pointer"
              title={t("dashboard.sitesEditor.closeCustomEditor", "Tutup")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Heading Font */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.headingFont")}
            </label>
            <FontPicker
              value={currentHeading}
              onChange={(v) => {
                if (currentHeadingUrl) onFieldChange?.("typography", "heading_font_url", "");
                onFieldChange?.("typography", "heading_font", v);
              }}
            />
          </div>

          {/* Body Font */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.bodyFont")}
            </label>
            <FontPicker
              value={currentBody}
              onChange={(v) => {
                if (currentBodyUrl) onFieldChange?.("typography", "body_font_url", "");
                onFieldChange?.("typography", "body_font", v);
              }}
            />
          </div>

          {/* Heading Weight */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.headingWeight")}
            </label>
            <CustomSelect
              value={designToken?.typography?.heading_weight || "700"}
              onChange={(val) => onFieldChange?.("typography", "heading_weight", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              options={[
                { value: "400", label: `${t("dashboard.sitesEditor.weightRegular")} (400)` },
                { value: "500", label: `${t("dashboard.sitesEditor.weightMedium")} (500)` },
                { value: "600", label: `${t("dashboard.sitesEditor.weightSemiBold")} (600)` },
                { value: "700", label: `${t("dashboard.sitesEditor.weightBold")} (700)` },
                { value: "800", label: `${t("dashboard.sitesEditor.weightExtraBold")} (800)` },
              ]}
            />
          </div>

          {/* Hero Title Size */}
          <div className="space-y-1">
            <label className="text-[11px] uppercase tracking-wide font-semibold text-sidebar-muted-foreground">
              {t("dashboard.sitesEditor.heroTitleSize")}
            </label>
            <CustomSelect
              value={designToken?.typography?.heading_size_hero || "3rem"}
              onChange={(val) => onFieldChange?.("typography", "heading_size_hero", val)}
              size="sm"
              triggerClassName="bg-sidebar-input text-sidebar-foreground border-border text-[12px] h-9"
              options={[
                { value: "2rem", label: `${t("dashboard.sitesEditor.sizeSmall")} (2rem)` },
                { value: "2.5rem", label: `${t("dashboard.sitesEditor.sizeMedium")} (2.5rem)` },
                { value: "3rem", label: `${t("dashboard.sitesEditor.sizeLarge")} (3rem)` },
                { value: "3.5rem", label: `${t("dashboard.sitesEditor.sizeVeryLarge")} (3.5rem)` },
                { value: "4rem", label: `${t("dashboard.sitesEditor.sizeMax")} (4rem)` },
              ]}
            />
          </div>

          {/* Accordion: Upload Font File or URL */}
          <div className="pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => setShowDrawer((prev) => !prev)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-primary hover:text-primary/80 transition-colors py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                {t("dashboard.sitesEditor.customFontDrawerButton")}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${showDrawer ? "rotate-180" : ""}`}
              />
            </button>

            {showDrawer && (
              <div className="mt-2.5 p-3 rounded-xl border border-border bg-sidebar-muted/20 space-y-3">
                {/* Target */}
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

                {/* Sub-tab: Upload vs URL */}
                <div className="flex gap-2 border-b border-border/80 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMode("upload");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`text-[11px] font-semibold pb-0.5 border-b-2 transition cursor-pointer ${
                      customMode === "upload"
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
                      setCustomMode("url");
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`text-[11px] font-semibold pb-0.5 border-b-2 transition cursor-pointer ${
                      customMode === "url"
                        ? "border-primary text-primary"
                        : "border-transparent text-sidebar-muted-foreground hover:text-sidebar-foreground"
                    }`}
                  >
                    <Link2 className="w-3 h-3 inline mr-1" />
                    {t("dashboard.sitesEditor.urlFontTab")}
                  </button>
                </div>

                {/* Upload Mode */}
                {customMode === "upload" && (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={FONT_UPLOAD_EXTS.join(",")}
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="sr-only"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full py-4 border-2 border-dashed border-border hover:border-primary/60 rounded-xl flex flex-col items-center justify-center gap-1.5 bg-sidebar-muted/30 hover:bg-sidebar-muted/60 transition cursor-pointer disabled:opacity-60"
                    >
                      <Upload className="w-5 h-5 text-sidebar-muted-foreground" />
                      <span className="text-xs font-semibold text-sidebar-foreground">
                        {uploading
                          ? t("common.processing", "Memproses font...")
                          : t("dashboard.sitesEditor.selectFontFileComputer")}
                      </span>
                      <span className="text-[10px] text-sidebar-subtle-foreground">
                        {t("dashboard.sitesEditor.fontFileFormatHint")}
                      </span>
                    </button>
                  </div>
                )}

                {/* URL Mode */}
                {customMode === "url" && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-semibold text-sidebar-muted-foreground block mb-0.5">
                        {t("dashboard.sitesEditor.fontFamilyNameLabel")}
                      </label>
                      <input
                        type="text"
                        placeholder={t("dashboard.sitesEditor.fontFamilyNamePlaceholder")}
                        value={urlFamily}
                        onChange={(e) => setUrlFamily(e.target.value)}
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
                        value={urlHref}
                        onChange={(e) => setUrlHref(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-sidebar-input text-sidebar-foreground text-xs focus:outline-hidden focus:border-primary font-mono text-[11px]"
                      />
                    </div>

                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={handleApplyUrl}
                      className="w-full mt-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1" />
                      {t("dashboard.sitesEditor.applyFontUrlButton")}
                    </Button>
                  </div>
                )}

                {errorMsg && (
                  <p className="text-[11px] text-destructive flex items-center gap-1 font-medium bg-destructive/10 border border-destructive/20 p-2 rounded-lg">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errorMsg}
                  </p>
                )}
                {successMsg && (
                  <p className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                    <Check className="w-3.5 h-3.5 shrink-0" />
                    {successMsg}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowBrandFont(false)}
            className="w-full text-xs font-semibold border-border hover:bg-sidebar-muted text-sidebar-foreground cursor-pointer"
          >
            {t("common.done", "Selesai")}
          </Button>
        </div>
      )}
    </div>
  );
}
