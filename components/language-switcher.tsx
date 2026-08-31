"use client";

import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();
  const pathname = usePathname() || "/";
  const router = useRouter();

  const toggleLanguage = () => {
    const nextLocale = locale === "id" ? "en" : "id";
    setLocale(nextLocale);

    try {
      document.cookie = `webjoz_locale=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
      localStorage.setItem("webjoz_locale", nextLocale);
    } catch {}

    // If on landing root or explicit /en routes, navigate correctly
    if (pathname === "/" && nextLocale === "en") {
      router.push("/en");
    } else if (pathname === "/en" && nextLocale === "id") {
      router.push("/");
    } else if (pathname.startsWith("/en/")) {
      if (nextLocale === "id") {
        router.push(pathname.replace(/^\/en/, "") || "/");
      }
    } else if (nextLocale === "en" && (pathname === "/privacy-policy" || pathname === "/terms" || pathname === "/refund-policy")) {
      router.push(`/en${pathname}`);
    }
    // For all other pages (/login, /register, /help, /dashboard, /forgot-password, etc.),
    // setLocale() reactively updates the UI in-place WITHOUT redirecting the user away!
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${className}`}
      aria-label={`Switch language from ${locale.toUpperCase()}`}
    >
      <span>{locale.toUpperCase()}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}
