"use client";

import { useCallback } from "react";
import {
  setAccentPreference,
  setThemePreference,
  useAccentPreference,
  useThemePreference,
  resolveEffectiveTheme,
} from "@/lib/auth-store";

export function useTheme() {
  const preference = useThemePreference(); // "auto" | "light" | "dark"
  const accent = useAccentPreference();

  // Effective resolved theme (what the UI actually shows right now)
  const theme = resolveEffectiveTheme(preference) as "light" | "dark";

  // Cycle: auto → light → dark → auto
  const toggleTheme = useCallback(() => {
    if (preference === "auto") {
      setThemePreference("light");
    } else if (preference === "light") {
      setThemePreference("dark");
    } else {
      setThemePreference("auto");
    }
  }, [preference]);

  const toggleAccent = useCallback(() => {
    setAccentPreference(accent === "monochrome" ? "blue" : "monochrome");
  }, [accent]);

  return {
    theme,
    preference,
    accent,
    isDark: theme === "dark",
    isAuto: preference === "auto",
    isMonochrome: accent === "monochrome",
    toggleTheme,
    toggleAccent,
  };
}
