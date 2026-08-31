"use client";

import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, SunMoon } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

/**
 * ThemeToggle — cycles through Auto → Light → Dark → Auto.
 * Shows a colour-dot accent toggle alongside when showAccent is true.
 */
export function ThemeToggle({ className = "", showAccent = false }: { className?: string; showAccent?: boolean }) {
  const { theme, preference, isAuto, isMonochrome, toggleTheme, toggleAccent } = useTheme();
  const { t } = useI18n();

  const themeLabel =
    preference === "auto"
      ? t("dashboard.autoTheme", "Mode Otomatis (Siang/Malam)")
      : theme === "dark"
      ? t("dashboard.switchLight", "Ganti ke Mode Terang")
      : t("dashboard.switchDark", "Ganti ke Mode Gelap");

  const ThemeIcon =
    preference === "auto" ? SunMoon : theme === "dark" ? Sun : Moon;

  const themeIconClass =
    preference === "auto"
      ? "text-sky-500"
      : theme === "dark"
      ? "text-amber-400"
      : "text-slate-600";

  return (
    <div className="inline-flex items-center gap-1">
      {showAccent && (
        <button
          type="button"
          onClick={toggleAccent}
          className={`inline-flex items-center justify-center size-8 rounded-lg border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer ${className}`}
          aria-label={isMonochrome ? t("dashboard.switchAccentBlue", "Ganti ke aksen warna") : t("dashboard.switchAccentMonochrome", "Ganti ke aksen monokrom")}
          title={isMonochrome ? t("dashboard.switchAccentBlue", "Aksen Warna") : t("dashboard.switchAccentMonochrome", "Aksen Monokrom")}
        >
          <div
            className={`size-3.5 rounded-full border-2 transition-all ${
              isMonochrome
                ? "bg-slate-400 border-slate-300"
                : "bg-primary border-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
            }`}
          />
        </button>
      )}

      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center justify-center size-8 rounded-lg border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer ${className}`}
        aria-label={themeLabel}
        title={themeLabel}
      >
        <ThemeIcon className={`size-4 ${themeIconClass}`} />
      </button>
    </div>
  );
}

export function AccentToggle({ className = "" }: { className?: string }) {
  const { isMonochrome, toggleAccent } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleAccent}
      className={`inline-flex items-center justify-center size-8 rounded-lg border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer ${className}`}
      aria-label={isMonochrome ? t("dashboard.switchAccentBlue", "Ganti ke aksen warna") : t("dashboard.switchAccentMonochrome", "Ganti ke aksen monokrom")}
      title={isMonochrome ? t("dashboard.switchAccentBlue", "Aksen Warna") : t("dashboard.switchAccentMonochrome", "Aksen Monokrom")}
    >
      <div
        className={`size-3.5 rounded-full border-2 transition-all ${
          isMonochrome
            ? "bg-slate-400 border-slate-300"
            : "bg-primary border-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
        }`}
      />
    </button>
  );
}
