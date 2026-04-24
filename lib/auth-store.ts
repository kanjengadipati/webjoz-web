"use client";

import { useSyncExternalStore } from "react";
import {
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

export function useStoredEmail() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([EMAIL_STORAGE_KEY], callback),
    () => readStorageValue(EMAIL_STORAGE_KEY, "admin@mail.com"),
    () => "admin@mail.com",
  );
}

export function useThemePreference() {
  return useSyncExternalStore(
    (callback) => subscribeToKeys([THEME_STORAGE_KEY], callback),
    () => readStorageValue(THEME_STORAGE_KEY, "dark"),
    () => "dark",
  );
}

export function persistAuthSession(email: string, accessToken: string, refreshToken: string) {
  setStoredValue(EMAIL_STORAGE_KEY, email);
  setStoredValue(TOKEN_STORAGE_KEY, accessToken);
  setStoredValue(REFRESH_STORAGE_KEY, refreshToken);
}

export function clearAuthSession() {
  setStoredValue(TOKEN_STORAGE_KEY, "");
  setStoredValue(REFRESH_STORAGE_KEY, "");
}

export function setThemePreference(theme: "dark" | "light") {
  setStoredValue(THEME_STORAGE_KEY, theme);
}
