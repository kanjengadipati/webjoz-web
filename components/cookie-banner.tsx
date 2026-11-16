"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n/context";

const CONSENT_KEY = "webjoz_cookie_consent";

// Routes where cookie banner should never appear (interactive builders, dashboards, site previews)
const EXCLUDED_PREFIXES = [
  "/dashboard",
  "/create",
  "/preview",
  "/site",
  "/s/",
  "/sp/",
];

export function CookieBanner() {
  const { locale } = useI18n();
  const pathname = usePathname();
  const isEN = locale === "en";
  const [visible, setVisible] = useState(false);

  const isExcluded =
    !pathname ||
    EXCLUDED_PREFIXES.some(
      (prefix) =>
        pathname.startsWith(prefix) ||
        pathname.startsWith(`/en${prefix}`) ||
        pathname.startsWith(`/id${prefix}`)
    );

  useEffect(() => {
    if (window.self !== window.top) return;
    if (isExcluded) return;
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
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl pointer-events-auto"
      style={{ animation: "cookieBannerIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <style>{`
        @keyframes cookieBannerIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <p className="flex-1 text-xs sm:text-sm text-foreground/85 leading-relaxed">
          {isEN
            ? "We use cookies to keep the site working and improve your experience."
            : "Kami menggunakan cookie untuk menjaga website tetap berfungsi dan meningkatkan pengalaman Anda."}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 self-end sm:self-auto inline-flex h-8 sm:h-9 items-center rounded-full bg-foreground px-4 sm:px-5 text-xs sm:text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-95 cursor-pointer shadow-sm"
        >
          {isEN ? "Got it" : "Mengerti"}
        </button>
      </div>
    </div>
  );
}
