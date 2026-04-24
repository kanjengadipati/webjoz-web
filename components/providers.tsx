"use client";

import { ReactNode, useEffect } from "react";
import { useThemePreference } from "@/lib/auth-store";
import { ToastProvider } from "@/components/toast-provider";

export function Providers({ children }: { children: ReactNode }) {
  const theme = useThemePreference();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return <ToastProvider>{children}</ToastProvider>;
}
