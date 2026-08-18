"use client";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  const toggleLanguage = () => {
    const nextLocale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);
    try {
      document.cookie = `webjoz_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      localStorage.setItem("webjoz_locale", nextLocale);
    } catch {}
    if (typeof window !== "undefined") {
      window.location.href = nextLocale === "en" ? "/en" : "/";
    }
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition-all cursor-pointer backdrop-blur-md shadow-xs ${className}`}
      aria-label={`Switch language from ${locale.toUpperCase()}`}
    >
      <span>{locale.toUpperCase()}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/60">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
