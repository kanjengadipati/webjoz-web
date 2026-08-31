"use client";

import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function ThemeToggle({ className = "", showAccent = false }: { className?: string; showAccent?: boolean }) {
  const { theme, accent, isMonochrome, toggleTheme, toggleAccent } = useTheme();
  const { t } = useI18n();

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
          <div className={`size-3.5 rounded-full border-2 transition-all ${
            isMonochrome ? "bg-slate-400 border-slate-300" : "bg-primary border-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
          }`} />
        </button>
      )}

      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center justify-center size-8 rounded-lg border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer ${className}`}
        aria-label={theme === "dark" ? t("dashboard.switchLight", "Ganti ke mode terang") : t("dashboard.switchDark", "Ganti ke mode gelap")}
        title={theme === "dark" ? t("dashboard.switchLight", "Mode Terang") : t("dashboard.switchDark", "Mode Gelap")}
      >
        {theme === "dark" ? (
          <Sun className="size-4 text-amber-400" />
        ) : (
          <Moon className="size-4 text-slate-700" />
        )}
      </button>
    </div>
  );
}

export function AccentToggle({ className = "" }: { className?: string }) {
  const { accent, isMonochrome, toggleAccent } = useTheme();
  const { t } = useI18n();

  return (
    <button
      type="button"
      onClick={toggleAccent}
      className={`inline-flex items-center justify-center size-8 rounded-lg border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer ${className}`}
      aria-label={isMonochrome ? t("dashboard.switchAccentBlue", "Ganti ke aksen warna") : t("dashboard.switchAccentMonochrome", "Ganti ke aksen monokrom")}
      title={isMonochrome ? t("dashboard.switchAccentBlue", "Aksen Warna") : t("dashboard.switchAccentMonochrome", "Aksen Monokrom")}
    >
      <div className={`size-3.5 rounded-full border-2 transition-all ${
        isMonochrome ? "bg-slate-400 border-slate-300" : "bg-primary border-primary shadow-[0_0_8px_color-mix(in_srgb,var(--primary)_50%,transparent)]"
      }`} />
    </button>
  );
}
