"use client";

import { ReactNode, useEffect } from "react";
import { useAccentPreference, useThemePreference } from "@/lib/auth-store";
import { ToastProvider } from "@/components/toast-provider";

export function Providers({ children }: { children: ReactNode }) {
  const theme = useThemePreference();
  const accent = useAccentPreference();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-blue", accent !== "monochrome");
  }, [accent]);

  return <ToastProvider>{children}</ToastProvider>;
}
