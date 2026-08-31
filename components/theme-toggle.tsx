"use client";

import React from "react";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
import { useI18n } from "@/lib/i18n/context";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
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
  );
}
