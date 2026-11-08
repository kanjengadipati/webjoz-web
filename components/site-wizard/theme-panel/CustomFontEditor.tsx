"use client";

import { useState, useCallback } from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";

type FontSlot = "heading" | "body";

interface CustomFontEditorProps {
  theme: UseThemeDraftReturn;
  onClose: () => void;
  onApply: () => void;
}

export function CustomFontEditor({ theme, onClose, onApply }: CustomFontEditorProps) {
  const { t } = useI18n();
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

  const handleApply = useCallback(() => {
    theme.commitDraft();
    onApply();
    onClose();
  }, [theme, onApply, onClose]);

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

      {/* Slot selector */}
      <div className="flex gap-1 p-0.5 rounded-lg bg-white/[0.06] border border-white/10">
        {(["heading", "body"] as FontSlot[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSlot(s)}
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

      {theme.hasDraft && (
        <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-[11px] text-amber-300 font-medium">
            {t("dashboard.wizard.theme.draftBadge", "Belum diterapkan")}
          </span>
        </div>
      )}

      {/* Font name */}
      <div>
        <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wide">
          {t("dashboard.wizard.theme.fontName", "Nama Font (Google Fonts)")}
        </label>
        <input
          type="text"
          value={slot === "heading" ? headingName : bodyName}
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
          value={slot === "heading" ? headingUrl : bodyUrl}
          onChange={(e) => {
            if (slot === "heading") setHeadingUrl(e.target.value);
            else setBodyUrl(e.target.value);
          }}
          placeholder="https://fonts.googleapis.com/css2?family=..."
          className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-white/30 focus:outline-none focus:bg-white/10 transition-all"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="flex-1 text-slate-400 hover:text-white border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-lg"
        >
          {t("dashboard.wizard.theme.cancel", "Batal")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreview}
          className="flex-1 rounded-lg border-white/15 bg-white/5 text-slate-200 hover:bg-white/10"
        >
          {t("dashboard.wizard.theme.preview", "Preview")}
        </Button>
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

