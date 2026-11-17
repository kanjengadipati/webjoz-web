"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const CONSENT_KEY = "webjoz_cookie_consent";

// Banner cookie hanya untuk situs marketing utama. Subdomain (app., stg., tenant),
// preview Vercel, custom domain, dan localhost tidak boleh menampilkannya.
const ALLOWED_HOSTS = new Set(["webjoz.com", "www.webjoz.com"]);

function isAllowedHost() {
  if (typeof window === "undefined") return false;
  return ALLOWED_HOSTS.has(window.location.hostname.toLowerCase());
}

const EXCLUDED_PREFIXES = ["/dashboard", "/create", "/preview", "/site", "/s/", "/sp/"];

export function CookieBanner() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const isEN = locale === "en";
  const [visible, setVisible] = useState(false);

  const isExcluded =
    !pathname ||
    EXCLUDED_PREFIXES.some(
      (p) =>
        pathname.startsWith(p) ||
        pathname.startsWith(`/en${p}`) ||
        pathname.startsWith(`/id${p}`)
    );

  useEffect(() => {
    if (window.self !== window.top) return;
    if (isExcluded) return;
    if (!isAllowedHost()) return;
    if (!localStorage.getItem(CONSENT_KEY)) {
      const id = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(id);
    }
  }, [isExcluded]);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "1");
    setVisible(false);
  }

  if (isExcluded || !visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isEN ? "Cookie notice" : "Pemberitahuan cookie"}
      className="fixed bottom-4 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[calc(100%-2rem)] sm:max-w-2xl z-[9999]"
      style={{ animation: "cookieBannerIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <style>{`
        @keyframes cookieBannerIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (min-width: 640px) {
          @keyframes cookieBannerIn {
            from { opacity: 0; transform: translate(-50%, 12px); }
            to   { opacity: 1; transform: translate(-50%, 0); }
          }
        }
      `}</style>

      <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md px-4 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <p className="flex-1 text-xs sm:text-sm text-foreground/80 leading-relaxed">
          {isEN
            ? "We use cookies to keep the site working and improve your experience."
            : "Kami menggunakan cookie agar website berfungsi dengan baik."}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-semibold text-background transition-all hover:opacity-90 active:scale-95 cursor-pointer"
        >
          {isEN ? "Got it" : "Mengerti"}
        </button>
      </div>
    </div>
  );
}
