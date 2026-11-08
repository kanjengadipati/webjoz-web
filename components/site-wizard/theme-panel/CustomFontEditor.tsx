"use client";

import { useState, useCallback, useRef } from "react";
import { X, ExternalLink, Upload, AlertCircle } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import {
  readFontFileDataUrl,
  saveCustomFontStorage,
  WIZARD_FONT_MAX_BYTES,
  WIZARD_FONT_EXTS,
} from "@/lib/wizard-font-storage";

type FontSlot = "heading" | "body";
type FontMode = "google" | "upload";

interface CustomFontEditorProps {
  theme: UseThemeDraftReturn;
  onClose: () => void;
  onApply: () => void;
}

export function CustomFontEditor({ theme, onClose, onApply }: CustomFontEditorProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [headingUrl, setHeadingUrl] = useState(
    theme.applied.typography?.heading_font_url ?? ""
  );
  const [headingName, setHeadingName] = useState(
    theme.applied.typography?.heading_font ?? ""
  );
  const [bodyUrl, setBodyUrl] = useState(
    theme.applied.typography?.body_font_url ?? ""
  );
  const [bodyName, setBodyName] = useState(
    theme.applied.typography?.body_font ?? ""
  );
  const [slot, setSlot] = useState<FontSlot>("heading");
  const [mode, setMode] = useState<FontMode>(
    (slot === "heading" ? headingUrl : bodyUrl)?.startsWith("data:") ? "upload" : "google"
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const activeUrl = slot === "heading" ? headingUrl : bodyUrl;
  const activeName = slot === "heading" ? headingName : bodyName;

  const handlePreview = useCallback(() => {
    if (slot === "heading" && headingName) {
      theme.setDraft({
        typography: {
          heading_font: headingName,
          heading_font_url: headingUrl,
        },
      });
    } else if (slot === "body" && bodyName) {
      theme.setDraft({
        typography: {
          body_font: bodyName,
          body_font_url: bodyUrl,
        },
      });
    }
  }, [slot, headingName, headingUrl, bodyName, bodyUrl, theme]);

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { dataUrl, name } = await readFontFileDataUrl(file);
      if (slot === "heading") {
        setHeadingName(name);
        setHeadingUrl(dataUrl);
        saveCustomFontStorage("heading", name, dataUrl);
        theme.setDraft({
          typography: {
            heading_font: name,
            heading_font_url: dataUrl,
          },
        });
      } else {
        setBodyName(name);
        setBodyUrl(dataUrl);
        saveCustomFontStorage("body", name, dataUrl);
        theme.setDraft({
          typography: {
            body_font: name,
            body_font_url: dataUrl,
          },
        });
      }
    } catch (err: any) {
      setUploadError(err.message || "Gagal membaca file font.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApply = useCallback(() => {
    const patch: Record<string, any> = {};
    if (headingName) {
      patch.heading_font = headingName;
      if (headingUrl) patch.heading_font_url = headingUrl;
    }
    if (bodyName) {
      patch.body_font = bodyName;
      if (bodyUrl) patch.body_font_url = bodyUrl;
    }
    if (Object.keys(patch).length > 0) {
      theme.applyNow({ typography: patch });
    } else {
      theme.commitDraft();
    }
    onApply();
    onClose();
  }, [theme, headingName, headingUrl, bodyName, bodyUrl, onApply, onClose]);

  const handleCancel = useCallback(() => {
    theme.clearDraft();
    onClose();
  }, [theme, onClose]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white">
          {t("dashboard.wizard.theme.customFontTitle", "Font Kustom")}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Slot selector: Heading vs Body */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.06] border border-white/10">
        {(["heading", "body"] as FontSlot[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSlot(s);
              const url = s === "heading" ? headingUrl : bodyUrl;
              setMode(url.startsWith("data:") ? "upload" : "google");
              setUploadError(null);
            }}
            className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              slot === s
                ? "bg-white/15 text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {s === "heading"
              ? t("dashboard.wizard.theme.fontHeading", "Heading")
              : t("dashboard.wizard.theme.fontBody", "Body")}
          </button>
        ))}
      </div>

      {/* Mode selector: Google Fonts URL vs Upload File */}
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setMode("google")}
          className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-all cursor-pointer ${
            mode === "google"
              ? "bg-white/10 text-cyan-300 border border-cyan-400/30"
              : "text-slate-400 hover:text-white border border-transparent"
          }`}
        >
          Google Fonts
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 rounded-md py-1 text-[11px] font-medium transition-all cursor-pointer ${
            mode === "upload"
              ? "bg-white/10 text-cyan-300 border border-cyan-400/30"
              : "text-slate-400 hover:text-white border border-transparent"
          }`}
        >
          {t("dashboard.wizard.theme.fontUploadTab", "Upload File (.woff2)")}
        </button>
      </div>

      {theme.hasDraft && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] text-amber-300 font-medium">
            {t("dashboard.wizard.theme.draftBadge", "Belum diterapkan")}
          </span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-start gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-2.5 py-2 text-red-300 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
          <span>{uploadError}</span>
        </div>
      )}

      {mode === "google" ? (
        <>
          {/* Font name */}
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
              {t("dashboard.wizard.theme.fontName", "Nama Font (Google Fonts)")}
            </label>
            <input
              type="text"
              value={activeName}
              onChange={(e) => {
                if (slot === "heading") setHeadingName(e.target.value);
                else setBodyName(e.target.value);
              }}
              placeholder="e.g. Roboto"
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-white/30 focus:outline-none focus:bg-white/10 transition-all"
            />
          </div>

          {/* Google Fonts CSS URL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                {t("dashboard.wizard.theme.fontUrl", "URL CSS Google Fonts")}
              </label>
              <a
                href="https://fonts.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
              >
                {t("dashboard.wizard.theme.openGoogleFonts", "Buka Google Fonts")}
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
            <input
              type="text"
              value={activeUrl.startsWith("data:") ? "" : activeUrl}
              onChange={(e) => {
                if (slot === "heading") setHeadingUrl(e.target.value);
                else setBodyUrl(e.target.value);
              }}
              placeholder="https://fonts.googleapis.com/css2?family=..."
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-white/30 focus:outline-none focus:bg-white/10 transition-all"
            />
          </div>
        </>
      ) : (
        /* Upload local font mode */
        <div className="space-y-3">
          <input
            ref={fileInputRef}
            type="file"
            accept={WIZARD_FONT_EXTS.join(",")}
            onChange={handleFileSelected}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/15 hover:border-white/30 rounded-xl p-4 text-center cursor-pointer transition-all bg-white/[0.02] hover:bg-white/[0.05]"
          >
            <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-slate-200">
              {activeUrl.startsWith("data:")
                ? activeName
                : t("dashboard.wizard.theme.fontUploadAction", "Pilih file font lokal")}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              .woff2, .woff, .ttf, .otf (Maks. 500 KB)
            </p>
          </div>

          {activeUrl.startsWith("data:") && (
            <div className="text-[11px] text-slate-400 flex items-center justify-between bg-white/[0.04] px-2.5 py-1.5 rounded-lg border border-white/10">
              <span className="truncate">{activeName} (Data URL)</span>
              <button
                type="button"
                onClick={() => {
                  if (slot === "heading") {
                    setHeadingName("");
                    setHeadingUrl("");
                  } else {
                    setBodyName("");
                    setBodyUrl("");
                  }
                }}
                className="text-[10px] text-red-400 hover:text-red-300 ml-2"
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex-1 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-lg"
        >
          {t("dashboard.wizard.theme.cancel", "Batal")}
        </Button>
        {mode === "google" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="flex-1 rounded-lg border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
          >
            {t("dashboard.wizard.theme.preview", "Preview")}
          </Button>
        )}
        <Button
          size="sm"
          onClick={handleApply}
          className="flex-1 rounded-lg bg-cyan-500 text-black font-bold hover:bg-cyan-400"
        >
          {t("dashboard.wizard.theme.apply", "Terapkan")}
        </Button>
      </div>
    </div>
  );
}
