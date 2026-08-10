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

function resolvePath(obj: Translations, path: string): string | undefined {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === "string" ? current : undefined;
}

function interpolate(text: string, params?: Record<string, string>): string {
  if (!params) return text;
  return text.replace(/\{(\w+)\}/g, (_, k) => params[k] || `{${k}}`);
}

export function I18nProvider({ children, defaultLocale = "id" }: { children: React.ReactNode; defaultLocale?: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved === "id" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved === "id" ? "id" : "en";
    }
  }, []);

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
  }, []);

  const t = useCallback(
    (key: string, fallback?: string, params?: Record<string, string>): string => {
      const resolved = resolvePath(translations[locale], key);
      const text = resolved || fallback || key;
      return interpolate(text, params);
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
