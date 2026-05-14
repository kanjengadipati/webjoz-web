"use client";

import { useCallback } from "react";
import {
  setAccentPreference,
  setThemePreference,
  useAccentPreference,
  useThemePreference,
} from "@/lib/auth-store";

export function useTheme() {
  const theme = useThemePreference();
  const accent = useAccentPreference();

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "dark" ? "light" : "dark");
  }, [theme]);

  const toggleAccent = useCallback(() => {
    setAccentPreference(accent === "monochrome" ? "blue" : "monochrome");
  }, [accent]);

  return {
    theme,
    accent,
    isDark: theme === "dark",
    isMonochrome: accent === "monochrome",
    toggleTheme,
    toggleAccent,
  };
}
