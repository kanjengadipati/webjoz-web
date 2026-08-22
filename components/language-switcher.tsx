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
      className={`inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 px-2.5 py-1 text-[11px] font-medium tracking-wider text-white/70 hover:text-white transition-all cursor-pointer backdrop-blur-md ${className}`}
      aria-label={`Switch language from ${locale.toUpperCase()}`}
    >
      <svg className="size-3 text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span>{locale.toUpperCase()}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
