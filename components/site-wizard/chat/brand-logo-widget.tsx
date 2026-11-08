"use client";

import React, { useRef, useState } from "react";
import { Upload, Image as ImageIcon, Check, RefreshCw, X } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";
import { extractBrandPaletteFromImage, type ExtractedBrandPalette } from "@/lib/brand-color-extractor";

interface BrandLogoWidgetProps {
  isLocked: boolean;
  logoUrl: string | null;
  palette: ExtractedBrandPalette | null;
  onLogoSelected: (logoUrl: string, palette: ExtractedBrandPalette, fileName: string) => void;
  onLogoRemoved: () => void;
  onSubmit: () => void;
}

export function BrandLogoWidget({
  isLocked,
  logoUrl,
  palette,
  onLogoSelected,
  onLogoRemoved,
  onSubmit,
}: BrandLogoWidgetProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsExtracting(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        setIsExtracting(false);
        return;
      }

      try {
        const extracted = await extractBrandPaletteFromImage(dataUrl, false);
        onLogoSelected(dataUrl, extracted, file.name);
      } catch {
        // Fallback default palette
        const fallback: ExtractedBrandPalette = {
          primary: "#2563eb",
          accent: "#f59e0b",
          background: "#f8fafc",
          surface: "#ffffff",
          text: "#0f172a",
          textMuted: "#64748b",
          isDark: false,
        };
        onLogoSelected(dataUrl, fallback, file.name);
      } finally {
        setIsExtracting(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => {
    if (isLocked) return;
    fileInputRef.current?.click();
  };

  if (isLocked && !logoUrl) {
    return null;
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/80 backdrop-blur-md p-4 space-y-3.5 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        onChange={handleFileChange}
        className="hidden"
        disabled={isLocked}
      />

      {!logoUrl ? (
        // Dropzone area
        <div
          onClick={triggerUpload}
          className={`group flex items-center gap-3.5 p-3.5 rounded-xl border border-dashed border-white/20 bg-white/[0.03] transition-all ${
            isLocked
              ? "opacity-60 cursor-not-allowed"
              : "hover:border-white/40 hover:bg-white/[0.06] cursor-pointer active:scale-[0.99]"
          }`}
        >
          <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-white">
            {isExtracting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-100">
                {t("dashboard.wizard.uploadLogoTitle", "Upload logo")}
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                ({t("dashboard.wizard.optional", "opsional")})
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              {t("dashboard.wizard.uploadLogoHint", "PNG, JPG, atau SVG · warnanya jadi dasar tema")}
            </p>
          </div>
        </div>
      ) : (
        // Logo preview & extracted palette card
        <div className="p-3 rounded-xl border border-white/15 bg-white/[0.04] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg border border-white/15 bg-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoUrl} alt="Brand Logo" className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{fileName || "Logo Brand"}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 mt-0.5 font-medium">
                  <Check className="w-3 h-3 shrink-0" />
                  <span>{t("dashboard.wizard.brandColorsApplied", "Warna brand diterapkan")}</span>
                </div>
              </div>
            </div>

            {!isLocked && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={triggerUpload}
                  className="px-2 py-1 rounded-md text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {t("dashboard.wizard.changeLogo", "Ganti")}
                </button>
                <button
                  type="button"
                  onClick={onLogoRemoved}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Hapus logo"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {palette && (
            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {t("dashboard.wizard.extractedPalette", "Palet Terdeteksi")}
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-xs"
                    style={{ backgroundColor: palette.primary }}
                  />
                  <span className="text-[10px] font-mono text-slate-300">{palette.primary}</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-xs"
                    style={{ backgroundColor: palette.accent }}
                  />
                  <span className="text-[10px] font-mono text-slate-300">{palette.accent}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLocked && (
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onSubmit}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 active:scale-[0.98] shadow-lg shadow-white/10 transition-all cursor-pointer border border-white"
          >
            <SparkleGenAI className="w-4 h-4 text-slate-950" />
            <span>{t("dashboard.wizard.btnCreateMyWebsite", "Buat website saya")}</span>
          </button>
          <p className="text-[10.5px] text-center text-slate-400">
            {t("dashboard.wizard.colorsFontEditableNotice", "Warna dan font bisa diubah kapan saja setelah website jadi.")}
          </p>
        </div>
      )}
    </div>
  );
}

