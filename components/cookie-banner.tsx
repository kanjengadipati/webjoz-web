"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";

const CONSENT_KEY = "webjoz_cookie_consent";

export function CookieBanner() {
  const { locale } = useI18n();
  const isEN = locale === "en";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.self !== window.top) return;
    if (window.location.pathname.startsWith("/dashboard")) return;
    if (!localStorage.getItem(CONSENT_KEY)) {
      const id = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(id);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(CONSENT_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={isEN ? "Cookie notice" : "Pemberitahuan cookie"}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-2xl"
      style={{ animation: "cookieBannerIn 0.35s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <style>{`
        @keyframes cookieBannerIn {
          from { opacity: 0; transform: translate(-50%, 12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
        <p className="flex-1 text-sm text-foreground/75 leading-relaxed">
          {isEN
            ? "We use cookies to keep the site working and improve your experience."
            : "Kami menggunakan cookie untuk menjaga website tetap berfungsi dan meningkatkan pengalaman Anda."}
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 inline-flex h-9 items-center rounded-full bg-foreground px-5 text-sm font-semibold text-background transition-all hover:opacity-90 active:scale-95 cursor-pointer"
        >
          {isEN ? "Got it" : "Mengerti"}
        </button>
      </div>
    </div>
  );
}
