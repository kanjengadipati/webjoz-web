"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";
import { isEmptyOverrides } from "@/lib/theme-overrides";
import { ensureReadableText } from "@/lib/theme-overrides";
import type { UseThemeDraftReturn } from "../use-theme-draft";

function parseHex(hex: string) {
  const c = hex.trim().replace(/^#/, "");
  if (c.length === 6) {
    return {
      r: parseInt(c.substring(0, 2), 16),
      g: parseInt(c.substring(2, 4), 16),
      b: parseInt(c.substring(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number) {
  const [rs, gs, bs] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1: string, hex2: string): number {
  const c1 = parseHex(hex1);
  const c2 = parseHex(hex2);
  if (!c1 || !c2) return 21;
  const l1 = getLuminance(c1.r, c1.g, c1.b);
  const l2 = getLuminance(c2.r, c2.g, c2.b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

interface ContrastHintProps {
  /** The design token currently being previewed */
  token: Record<string, any> | null;
  theme: UseThemeDraftReturn;
}

export function ContrastHint({ token, theme }: ContrastHintProps) {
  const { t } = useI18n();

  if (!token?.palette) return null;

  const { text, background } = token.palette;
  if (!text || !background) return null;

  const ratio = getContrastRatio(text, background);
  if (ratio >= 4.5) return null;

  return (
    <div className="mx-4 mt-2 flex items-start gap-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-2.5">
      <AlertTriangle className="h-3.5 w-3.5 text-amber-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-300 leading-tight">
          {t("dashboard.wizard.theme.contrastLow", "Kontras teks rendah ({ratio}:1)", {
            ratio: ratio.toFixed(1),
          })}
        </p>
        <p className="text-[11px] text-amber-400/70 leading-snug mt-0.5">
          {t("dashboard.wizard.theme.contrastDesc", "Teks mungkin sulit dibaca di beberapa template.")}
        </p>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!token) return;
          const fixed = ensureReadableText(token);
          if (fixed.palette?.text && fixed.palette.text !== text) {
            theme.applyNow({ palette: { text: fixed.palette.text } });
          }
        }}
        className="shrink-0 text-[11px] font-semibold text-amber-300 hover:text-amber-200 transition-colors active:scale-95 cursor-pointer whitespace-nowrap"
      >
        {t("dashboard.wizard.theme.contrastFix", "Perbaiki otomatis")}
      </button>
    </div>
  );
}

