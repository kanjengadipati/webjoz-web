"use client";

import { useState, useCallback, useRef } from "react";
import { X, Upload, Check, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import { isColorDark } from "@/components/templates/helpers";
import { deriveSurface, mergeThemeOverrides } from "@/lib/theme-overrides";
import { ContrastHint } from "./ContrastHint";
import { extractBrandPalettes, type ExtractedBrandPalette } from "@/lib/brand-color-extractor";
import { compressImage } from "@/components/file-upload";

type ColorSlot = "primary" | "accent" | "background" | "text";

interface BrandColorEditorProps {
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onClose: () => void;
  onApply: () => void;
  onLogoApplied?: (url: string, paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
  onBrandColorApplied?: (paletteMap: Record<string, string>, themeMode: "light" | "dark") => void;
}

const SLOT_LABELS: Record<ColorSlot, { id: string; en: string }> = {
  primary: { id: "Utama", en: "Primary" },
  accent: { id: "Aksen", en: "Accent" },
  background: { id: "Latar", en: "Background" },
  text: { id: "Teks", en: "Text" },
};

const HEX_REGEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const ALLOWED_LOGO_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_SVG_BYTES = 512 * 1024;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

export function BrandColorEditor({
  theme,
  baseToken,
  onClose,
  onApply,
  onLogoApplied,
  onBrandColorApplied,
}: BrandColorEditorProps) {
  const { t, isIndonesian } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initial colors = the palette that is ACTUALLY on screen right now: base token + applied
  // overrides, using dark_palette when the site is in dark mode. Never from localStorage.
  const effectivePalette: Record<string, string> = (() => {
    const merged = mergeThemeOverrides(baseToken, theme.applied);
    const darkActive = merged.theme_mode === "dark" && merged.dark_palette;
    return { ...(merged.palette || {}), ...(darkActive ? merged.dark_palette : {}) };
  })();
  const getInitial = (slot: ColorSlot): string => effectivePalette[slot] ?? "#888888";

  const initialColorsRef = useRef<Record<ColorSlot, string>>({
    primary: getInitial("primary"),
    accent: getInitial("accent"),
    background: getInitial("background"),
    text: getInitial("text"),
  });

  const [localColors, setLocalColors] = useState<Record<ColorSlot, string>>({
    primary: initialColorsRef.current.primary,
    accent: initialColorsRef.current.accent,
    background: initialColorsRef.current.background,
    text: initialColorsRef.current.text,
  });

  // Logo upload state
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [extractedPalette, setExtractedPalette] = useState<ExtractedBrandPalette | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  // Hex validation: all slots must match HEX_REGEX
  const allValid = (Object.keys(SLOT_LABELS) as ColorSlot[]).every((s) =>
    HEX_REGEX.test(localColors[s])
  );

  const handleChange = useCallback(
    (slot: ColorSlot, value: string) => {
      setLocalColors((prev) => ({ ...prev, [slot]: value }));
      if (HEX_REGEX.test(value)) {
        theme.setDraft({ palette: { [slot]: value } });
      }
    },
    [theme]
  );

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setExtractError(null);

    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      setExtractError(
        t(
          "dashboard.wizard.invalidImageFormat",
          "Format file tidak didukung. Gunakan PNG, JPG, WebP, atau SVG."
        )
      );
      return;
    }

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

    setIsExtracting(true);
    try {
      const processed = await compressImage(file, 512, 512, 0.85);
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const res = ev.target?.result as string;
          if (res) resolve(res);
          else reject(new Error("Gagal membaca file gambar."));
        };
        reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
        reader.readAsDataURL(processed);
      });

      const palettes = await extractBrandPalettes(dataUrl);
      const isDark = baseToken?.theme_mode === "dark";
      const selected = isDark ? palettes.dark : palettes.light;

      setLogoDataUrl(dataUrl);
      setExtractedPalette(selected);

      // Update local colors
      const newColors: Record<ColorSlot, string> = {
        primary: selected.primary,
        accent: selected.accent,
        background: selected.background,
        text: selected.text,
      };
      setLocalColors(newColors);

      // Live preview via draft
      theme.setDraft({
        palette: {
          primary: selected.primary,
          accent: selected.accent,
          background: selected.background,
          surface: selected.surface,
          text: selected.text,
        },
        theme_mode: isDark ? "dark" : "light",
      });
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

  const handleApply = useCallback(() => {
    if (!allValid) return;

    // If a new logo was uploaded, apply the full 5-key palette and wire to chat/save
    if (logoDataUrl && extractedPalette) {
      const mode: "light" | "dark" = isColorDark(extractedPalette.background || "#000") ? "dark" : "light";
      const paletteMap: Record<string, string> = {
        primary: extractedPalette.primary,
        accent: extractedPalette.accent,
        background: extractedPalette.background,
        surface: extractedPalette.surface,
        text: extractedPalette.text,
      };

      onLogoApplied?.(logoDataUrl, paletteMap, mode);
      onBrandColorApplied?.(paletteMap, mode);
      theme.applyNow(
        {
          palette: paletteMap,
          theme_mode: mode,
        },
        t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")
      );
      onApply();
      onClose();
      return;
    }

    // Manual edit = "warna kustom": masuk lapisan applied saja (bisa di-Undo, diganti saat ganti
    // mood). TIDAK dijadikan warna brand: brand hanya berasal dari logo.
    const bg = localColors.background;
    const mode: "light" | "dark" = isColorDark(bg) ? "dark" : "light";
    const surface = deriveSurface(bg, localColors.text);
    const customPalette: Record<string, string> = {
      primary: localColors.primary,
      accent: localColors.accent,
      background: localColors.background,
      surface,
      text: localColors.text,
    };

    theme.applyNow(
      {
        palette: customPalette,
        theme_mode: mode,
      },
      t("dashboard.wizard.theme.customColorTitle", "Warna Kustom")
    );
    onApply();
    onClose();
  }, [allValid, logoDataUrl, extractedPalette, localColors, theme, onLogoApplied, onBrandColorApplied, onApply, onClose, t]);

  const handleCancel = useCallback(() => {
    theme.clearDraft();
    onClose();
  }, [theme, onClose]);

  return (
    <div className="p-4 space-y-4 bg-sidebar text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-sidebar-foreground">
          {t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-muted transition-all cursor-pointer"
          title={t("common.close", "Tutup")}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Logo upload section */}
      <div className="rounded-xl border border-dashed border-border bg-sidebar-muted/30 p-3 space-y-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={handleLogoUpload}
          className="sr-only"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            {logoDataUrl ? (
              <img
                src={logoDataUrl}
                alt="Brand logo"
                className="h-8 w-8 rounded-lg object-contain bg-white/10 border border-border shrink-0"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-muted border border-border shrink-0">
                <Upload className="h-4 w-4 text-sidebar-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">
                {t("dashboard.wizard.uploadLogoTitle", "Upload logo")}
              </p>
              <p className="text-[10px] text-sidebar-muted-foreground truncate">
                {t(
                  "dashboard.wizard.uploadLogoHint",
                  "PNG, JPG, atau SVG · warnanya jadi dasar tema"
                )}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isExtracting}
            onClick={() => fileInputRef.current?.click()}
            className="text-xs h-7 px-2.5 shrink-0"
          >
            {isExtracting ? (
              <RefreshCw className="h-3 w-3 animate-spin" />
            ) : logoDataUrl ? (
              t("dashboard.wizard.theme.replaceLogo", "Ganti")
            ) : (
              t("dashboard.wizard.theme.chooseLogo", "Pilih")
            )}
          </Button>
        </div>
        {extractError && (
          <div className="flex items-center gap-1.5 text-[11px] text-destructive">
            <AlertCircle className="h-3 w-3 shrink-0" />
            <span>{extractError}</span>
          </div>
        )}
      </div>

      {theme.hasDraft && (
        <div className="flex items-center gap-1.5 rounded-lg bg-sidebar-muted border border-border px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] text-sidebar-foreground font-medium">
            {t("dashboard.wizard.theme.draftBadge", "Belum diterapkan")}
          </span>
        </div>
      )}

      {/* Contrast hint inside editor */}
      <ContrastHint token={theme.previewToken} theme={theme} />

      {/* Color slots */}
      <div className="space-y-3">
        {(Object.keys(SLOT_LABELS) as ColorSlot[]).map((slot) => {
          const isValid = HEX_REGEX.test(localColors[slot]);
          return (
            <div key={slot} className="flex items-center gap-3">
              {/* Color picker */}
              <label className="relative cursor-pointer">
                <input
                  type="color"
                  value={isValid ? localColors[slot] : "#888888"}
                  onChange={(e) => handleChange(slot, e.target.value)}
                  className="sr-only"
                />
                <div
                  className="h-9 w-9 rounded-lg border-2 border-border shadow-xs transition-all hover:border-sidebar-foreground/40 cursor-pointer"
                  style={{ backgroundColor: isValid ? localColors[slot] : "#888888" }}
                />
              </label>

              {/* Hex input */}
              <div className="flex-1">
                <label className="block text-[10px] font-semibold text-sidebar-subtle-foreground mb-0.5 uppercase tracking-wide">
                  {isIndonesian ? SLOT_LABELS[slot].id : SLOT_LABELS[slot].en}
                </label>
                <input
                  type="text"
                  value={localColors[slot]}
                  onChange={(e) => handleChange(slot, e.target.value.trim())}
                  className={`w-full rounded-lg bg-sidebar-input border px-2.5 py-1.5 text-xs font-mono text-sidebar-foreground placeholder:text-sidebar-muted-foreground focus:outline-none transition-all ${
                    !isValid
                      ? "border-destructive text-destructive focus:border-destructive"
                      : "border-border focus:border-primary"
                  }`}
                  placeholder="#000000"
                  maxLength={7}
                />
                {!isValid && (
                  <p className="text-[10px] text-destructive mt-0.5">
                    {t("dashboard.wizard.theme.invalidHex", "Format HEX tidak valid (contoh: #1A2B3C)")}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
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
          disabled={!allValid}
          onClick={handleApply}
          className="flex-1 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50"
        >
          {t("dashboard.wizard.theme.apply", "Terapkan")}
        </Button>
      </div>
    </div>
  );
}
