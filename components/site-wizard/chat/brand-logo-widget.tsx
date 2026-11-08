"use client";

import React, { useRef, useState } from "react";
import { Upload, Check, RefreshCw, X, AlertCircle } from "lucide-react";
import { SparkleGenAI } from "@/components/sparkle-icon";
import { useI18n } from "@/lib/i18n/context";
import { extractBrandPalettes, type ExtractedBrandPalette } from "@/lib/brand-color-extractor";
import { compressImage } from "@/components/file-upload";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SVG_BYTES = 512 * 1024; // 512 KB
const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB

interface BrandLogoWidgetProps {
  isLocked: boolean;
  logoUrl: string | null;
  palette: ExtractedBrandPalette | null;
  mood?: string;
  onLogoSelected: (
    logoUrl: string,
    palette: ExtractedBrandPalette,
    fileName: string,
    themeMode: "light" | "dark"
  ) => void;
  onLogoRemoved: () => void;
  onSubmit: () => void;
}

export function BrandLogoWidget({
  isLocked,
  logoUrl,
  palette,
  mood,
  onLogoSelected,
  onLogoRemoved,
  onSubmit,
}: BrandLogoWidgetProps) {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting the exact same file fires onChange again
    input.value = "";

    setExtractError(null);

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setExtractError(
        t(
          "dashboard.wizard.invalidImageFormat",
          "Format file tidak didukung. Gunakan PNG, JPG, WebP, atau SVG."
        )
      );
      return;
    }

    // Validate size limit (SVG vs Bitmap)
    if (file.type === "image/svg+xml" && file.size > MAX_SVG_BYTES) {
      setExtractError(
        t("dashboard.wizard.svgFileSizeError", "Ukuran file SVG maksimal 512 KB.")
      );
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      setExtractError(
        t("dashboard.wizard.imageFileSizeError", "Ukuran gambar maksimal 10 MB.")
      );
      return;
    }

    setFileName(file.name);
    setIsExtracting(true);

    try {
      // Compress bitmap image to max 512x512 to preserve browser memory and storage quota
      const processed = await compressImage(file, 512, 512, 0.85);

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const res = event.target?.result as string;
          if (res) resolve(res);
          else reject(new Error("Gagal membaca data gambar."));
        };
        reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
        reader.readAsDataURL(processed);
      });

      const palettes = await extractBrandPalettes(dataUrl);

      // Rule: mood dark-premium enforces dark palette + dark theme_mode.
      // Other moods use light palette + light theme_mode.
      const isDarkMood = mood === "dark-premium";
      const selectedPalette = isDarkMood ? palettes.dark : palettes.light;
      const themeMode: "light" | "dark" = isDarkMood ? "dark" : "light";

      onLogoSelected(dataUrl, selectedPalette, file.name, themeMode);
    } catch {
      setExtractError(
        t(
          "dashboard.wizard.colorExtractionFailed",
          "Warna tidak terbaca, pakai warna bawaan mood"
        )
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const triggerUpload = () => {
    if (isLocked || isExtracting) return;
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
        disabled={isLocked || isExtracting}
      />

      {extractError && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-2.5 text-amber-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-100">{extractError}</p>
            <p className="text-[11px] text-amber-300/80 mt-0.5">
              {t(
                "dashboard.wizard.continueOrRetryHint",
                "Anda dapat mencoba file lain atau melanjutkan dengan warna bawaan mood."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={triggerUpload}
            className="px-2 py-1 rounded text-[11px] font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 shrink-0 cursor-pointer"
          >
            {t("dashboard.wizard.retry", "Coba lagi")}
          </button>
        </div>
      )}

      {!logoUrl ? (
        // Dropzone area as an accessible button
        <button
          type="button"
          onClick={triggerUpload}
          disabled={isLocked || isExtracting}
          aria-label={t("dashboard.wizard.uploadLogoTitle", "Upload logo")}
          className={`w-full text-left group flex items-center gap-3.5 p-3.5 rounded-xl border border-dashed border-white/20 bg-white/[0.03] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
            isLocked || isExtracting
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
        </button>
      ) : (
        // Logo preview & extracted palette card
        <div className="p-3 rounded-xl border border-white/15 bg-white/[0.04] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-lg border border-white/15 bg-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoUrl}
                  alt={t("dashboard.wizard.brandLogoAlt", "Logo Brand")}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-100 truncate">{fileName || t("dashboard.wizard.brandLogoAlt", "Logo Brand")}</p>
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
                  aria-label={t("dashboard.wizard.removeLogo", "Hapus logo")}
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
            disabled={isExtracting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-950 bg-white hover:bg-slate-100 active:scale-[0.98] shadow-lg shadow-white/10 transition-all cursor-pointer border border-white disabled:opacity-60 disabled:cursor-wait"
          >
            {isExtracting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>{t("dashboard.wizard.extractingBrandColor", "Mengekstrak warna brand...")}</span>
              </>
            ) : (
              <>
                <SparkleGenAI className="w-4 h-4 text-slate-950" />
                <span>{t("dashboard.wizard.btnCreateMyWebsite", "Buat website saya")}</span>
              </>
            )}
          </button>
          <p className="text-[10.5px] text-center text-slate-400">
            {t(
              "dashboard.wizard.colorsFontEditableNotice",
              "Warna dan font bisa diubah kapan saja setelah website jadi."
            )}
          </p>
        </div>
      )}
    </div>
  );
}
