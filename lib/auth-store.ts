"use client";

import { useSyncExternalStore } from "react";
import {
  ACCENT_STORAGE_KEY,
  EMAIL_STORAGE_KEY,
  REFRESH_STORAGE_KEY,
  THEME_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
} from "@/lib/config";
import { readStorageValue, setStoredValue, subscribeToKeys } from "@/lib/storage";

export function useAuthToken() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([TOKEN_STORAGE_KEY], callback),
    () => readStorageValue(TOKEN_STORAGE_KEY, ""),
    () => "",
  );
}

export function useAuthReady() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([TOKEN_STORAGE_KEY], callback),
    () => true,
    () => false,
  );
}

export function useStoredEmail() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([EMAIL_STORAGE_KEY], callback),
    () => readStorageValue(EMAIL_STORAGE_KEY, ""),
    () => "",
  );
}

export type ThemePreference = "auto" | "dark" | "light";

/**
 * Returns 'light' during daytime (06:00 - 18:00 local time)
 * and 'dark' during nighttime (18:00 - 06:00 local time).
 */
export function getTimeBasedTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "dark";
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "light" : "dark";
}

/**
 * Resolves effective theme ("light" | "dark") from user preference.
 * If preference is "auto" or empty, dynamically calculates theme by time of day.
 */
export function resolveEffectiveTheme(preference: string): "dark" | "light" {
  if (preference === "light") return "light";
  if (preference === "dark") return "dark";
  return getTimeBasedTheme();
}

export function useThemePreference() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([THEME_STORAGE_KEY], callback),
    () => readStorageValue(THEME_STORAGE_KEY, "auto"),
    () => "auto",
  );
}

export function useAccentPreference() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([ACCENT_STORAGE_KEY], callback),
    () => readStorageValue(ACCENT_STORAGE_KEY, "monochrome"),
    () => "monochrome",
  );
}

export function persistAuthSession(email: string, accessToken: string) {
  if (email) {
    setStoredValue(EMAIL_STORAGE_KEY, email);
  }
  setStoredValue(TOKEN_STORAGE_KEY, accessToken);
  setStoredValue(REFRESH_STORAGE_KEY, "");
  setStoredValue("webjoz_active_tenant_id", "");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage_tenant_changed"));
  }
}

export function clearAuthSession() {
  setStoredValue(TOKEN_STORAGE_KEY, "");
  setStoredValue(REFRESH_STORAGE_KEY, "");
  setStoredValue("webjoz_active_tenant_id", "");
  setStoredValue("webjoz_login_redirect", "");
  setStoredValue("webjoz_wizard_prefill", "");
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage_tenant_changed"));
  }
}

export function setThemePreference(theme: "auto" | "dark" | "light") {
  setStoredValue(THEME_STORAGE_KEY, theme);
}

export function setAccentPreference(accent: "blue" | "monochrome") {
  setStoredValue(ACCENT_STORAGE_KEY, accent);
}

