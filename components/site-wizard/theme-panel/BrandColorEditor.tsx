"use client";

import { useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import { isColorDark } from "@/components/templates/helpers";

type ColorSlot = "primary" | "accent" | "background" | "text";

interface BrandColorEditorProps {
  theme: UseThemeDraftReturn;
  baseToken: Record<string, any> | null;
  onClose: () => void;
  onApply: () => void;
}

const SLOT_LABELS: Record<ColorSlot, { id: string; en: string }> = {
  primary: { id: "Utama", en: "Primary" },
  accent: { id: "Aksen", en: "Accent" },
  background: { id: "Latar", en: "Background" },
  text: { id: "Teks", en: "Text" },
};

export function BrandColorEditor({
  theme,
  baseToken,
  onClose,
  onApply,
}: BrandColorEditorProps) {
  const { t, isIndonesian } = useI18n();

  // Local draft state for the 4 visible slots
  const getInitial = (slot: ColorSlot): string => {
    return (
      theme.applied.palette?.[slot] ??
      baseToken?.palette?.[slot] ??
      "#888888"
    );
  };

  const [localColors, setLocalColors] = useState<Record<ColorSlot, string>>({
    primary: getInitial("primary"),
    accent: getInitial("accent"),
    background: getInitial("background"),
    text: getInitial("text"),
  });

  const handleChange = useCallback((slot: ColorSlot, value: string) => {
    setLocalColors((prev) => ({ ...prev, [slot]: value }));
    // Live preview via draft
    theme.setDraft({ palette: { [slot]: value } });
  }, [theme]);

  const handleApply = useCallback(() => {
    theme.applyNow({
      palette: localColors,
      theme_mode: isColorDark(localColors.background || "#000") ? "dark" : "light",
    });
    onApply();
    onClose();
  }, [theme, localColors, onApply, onClose]);

  const handleCancel = useCallback(() => {
    theme.clearDraft();
    onClose();
  }, [theme, onClose]);

  return (
    <div className="px-4 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-white">
          {t("dashboard.wizard.theme.brandColorTitle", "Warna Brand Saya")}
        </p>
        <button
          type="button"
          onClick={handleCancel}
          className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
          title={t("common.close", "Tutup")}
        >
          <X className="h-3.5 w-3.5" />
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

      <div className="space-y-3">
        {(Object.keys(SLOT_LABELS) as ColorSlot[]).map((slot) => (
          <div key={slot} className="flex items-center gap-3">
            {/* Color picker */}
            <label className="relative cursor-pointer">
              <input
                type="color"
                value={localColors[slot]}
                onChange={(e) => handleChange(slot, e.target.value)}
                className="sr-only"
              />
              <div
                className="h-9 w-9 rounded-lg border-2 border-white/20 shadow-sm transition-all hover:border-white/40 cursor-pointer"
                style={{ backgroundColor: localColors[slot] }}
              />
            </label>

            {/* Hex input */}
            <div className="flex-1">
              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5 uppercase tracking-wide">
                {isIndonesian ? SLOT_LABELS[slot].id : SLOT_LABELS[slot].en}
              </label>
              <input
                type="text"
                value={localColors[slot]}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
                    handleChange(slot, v);
                  } else {
                    // Update local display without sending to draft (incomplete hex)
                    setLocalColors((prev) => ({ ...prev, [slot]: v }));
                  }
                }}
                className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-2.5 py-1.5 text-xs font-mono text-slate-200 placeholder-slate-500 focus:border-white/30 focus:outline-none focus:bg-white/10 transition-all"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>
        ))}
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

