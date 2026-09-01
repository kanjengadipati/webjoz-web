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

  // Direct 1-click toggle between Light and Dark based on current effective theme
  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "dark" ? "light" : "dark");
  }, [theme]);

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
