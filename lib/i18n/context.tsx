"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import { translations, type Locale, type Translations } from "./translations";

export const LOCALE_STORAGE_KEY = "webjoz_locale";

type TranslationFunction = (key: string, fallback?: string, params?: Record<string, string>) => string;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationFunction;
  translations: Translations;
  isIndonesian: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function resolvePath(obj: Translations, path: string): any {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return current;
}

function interpolate(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => params[k] || `{${k}}`);
}

export function I18nProvider({ children, defaultLocale = "id", forcedLocale }: { children: React.ReactNode; defaultLocale?: Locale; forcedLocale?: Locale }) {
  // Must match SSR exactly on first render to avoid hydration mismatch.
  // defaultLocale is derived server-side from the webjoz_locale cookie via RootLayout,
  // so it already reflects the user's saved preference when the cookie is present.
  const [locale, setLocaleState] = useState<Locale>(forcedLocale ?? defaultLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (forcedLocale) {
      document.documentElement.lang = forcedLocale === "id" ? "id" : "en";
      return;
    }
    // After hydration: read cookie first (set by proxy.ts or setLocale),
    // then fall back to localStorage. This ensures the client always reflects
    // the user's saved preference even when SSR defaultLocale was stale.
    try {
      const match = document.cookie.match(
        new RegExp("(?:^|; )" + LOCALE_STORAGE_KEY + "=([^;]*)")
      );
      const cookieLocale = match && (match[1] === "id" || match[1] === "en") ? (match[1] as Locale) : null;
      const lsLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale | null;
      const active = cookieLocale ?? (lsLocale === "id" || lsLocale === "en" ? lsLocale : null);
      const resolved = active ?? defaultLocale;
      setLocaleState(resolved);
      document.documentElement.lang = resolved === "id" ? "id" : "en";
      // Keep cookie and localStorage in sync
      if (active) {
        try { localStorage.setItem(LOCALE_STORAGE_KEY, active); } catch {}
        document.cookie = `${LOCALE_STORAGE_KEY}=${active}; path=/; max-age=31536000; SameSite=Lax`;
      }
    } catch {
      document.documentElement.lang = defaultLocale === "id" ? "id" : "en";
    }
  }, [forcedLocale, defaultLocale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof document !== "undefined") {
      document.documentElement.lang = next === "id" ? "id" : "en";
    }
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
    try {
      document.cookie =
        LOCALE_STORAGE_KEY + "=" + next + "; path=/; max-age=31536000; SameSite=Lax";
    } catch {
      /* ignore cookie errors */
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: any, params?: Record<string, string>): any => {
      const resolved = resolvePath(translations[locale], key);
      const val = resolved !== undefined ? resolved : fallback || key;
      if (typeof val === "string") {
        return interpolate(val, params);
      }
      return val;
    },
    [locale]
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      translations: translations[locale],
      isIndonesian: locale === "id",
    }),
    [locale, setLocale, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      locale: "id",
      setLocale: () => {},
      t: (key: string, fallback?: string, params?: Record<string, string>) => {
        const text = fallback || key;
        return interpolate(text, params);
      },
      translations: translations.id,
      isIndonesian: true,
    };
  }
  return ctx;
}
