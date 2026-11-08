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
    <div className="p-4 space-y-4 bg-sidebar text-sidebar-foreground">
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

      {theme.hasDraft && (
        <div className="flex items-center gap-1.5 rounded-lg bg-sidebar-muted border border-border px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] text-sidebar-foreground font-medium">
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
                className="h-9 w-9 rounded-lg border-2 border-border shadow-xs transition-all hover:border-sidebar-foreground/40 cursor-pointer"
                style={{ backgroundColor: localColors[slot] }}
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
                onChange={(e) => {
                  const v = e.target.value.trim();
                  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) {
                    handleChange(slot, v);
                  } else {
                    // Update local display without sending to draft (incomplete hex)
                    setLocalColors((prev) => ({ ...prev, [slot]: v }));
                  }
                }}
                className="w-full rounded-lg bg-sidebar-input border border-border px-2.5 py-1.5 text-xs font-mono text-sidebar-foreground placeholder:text-sidebar-muted-foreground focus:border-primary focus:outline-none transition-all"
                placeholder="#000000"
                maxLength={7}
              />
            </div>
          </div>
        ))}
      </div>

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
          onClick={handleApply}
          className="flex-1 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90"
        >
          {t("dashboard.wizard.theme.apply", "Terapkan")}
        </Button>
      </div>
    </div>
  );
}

