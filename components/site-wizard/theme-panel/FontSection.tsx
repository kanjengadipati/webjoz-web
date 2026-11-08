"use client";

import { Check, Type } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import type { UseThemeDraftReturn } from "../use-theme-draft";
import type { FontPreset } from "@/lib/theme-presets";
import { isFontApplied } from "@/lib/theme-presets";
import { cn } from "@/lib/utils";

interface FontSectionProps {
  fonts: FontPreset[];
  theme: UseThemeDraftReturn;
  onApply: (label: string) => void;
  onOpenCustomFont: () => void;
}

export function FontSection({
  fonts,
  theme,
  onApply,
  onOpenCustomFont,
}: FontSectionProps) {
  const { t } = useI18n();

  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {t("dashboard.wizard.theme.fontTitle", "Font")}
      </p>

      <div className="grid grid-cols-3 gap-2">
        {fonts.map((preset) => {
          const isActive = isFontApplied(preset, theme.applied);
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                theme.applyNow(preset.override, preset.name);
                onApply(preset.name);
              }}
              title={`${preset.heading} / ${preset.body}`}
              className={cn(
                "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all active:scale-95 cursor-pointer",
                isActive
                  ? "border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_0_1px_rgba(6,182,212,0.3)]"
                  : "border-white/10 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.07]"
              )}
            >
              {/* "Aa" sample */}
              <span
                className="text-xl font-bold text-white leading-none"
                style={{ fontFamily: `'${preset.heading}', serif` }}
              >
                Aa
              </span>
              <span className="text-[10px] font-medium text-slate-300 leading-tight truncate w-full">
                {preset.name}
              </span>
              <span className="text-[9px] text-slate-500 leading-tight truncate w-full">
                {preset.heading}
              </span>
              {isActive && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-black">
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}

        {/* Custom Font Card */}
        <button
          type="button"
          onClick={onOpenCustomFont}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-center transition-all hover:border-white/25 hover:bg-white/[0.05] active:scale-95 cursor-pointer"
        >
          <Type className="h-4 w-4 text-slate-400" />
          <span className="text-[10px] font-medium text-slate-400 leading-tight">
            {t("dashboard.wizard.theme.customFontCard", "Font kustom")}
          </span>
        </button>
      </div>
    </div>
  );
}

