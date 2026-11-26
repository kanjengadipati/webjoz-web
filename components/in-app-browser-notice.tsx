"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n/context";
import {
  buildAndroidChromeIntentUrl,
  detectInAppBrowser,
  type InAppBrowserInfo,
} from "@/lib/in-app-browser";

/**
 * Pemberitahuan di dekat tombol login sosial ketika halaman dibuka di
 * in-app browser (Instagram/Facebook/TikTok). Login Google tidak berfungsi
 * di sana; arahkan user membuka di browser utama atau memakai email.
 */
export function InAppBrowserNotice() {
  const { locale } = useI18n();
  const isEN = locale === "en";
  const [info, setInfo] = useState<InAppBrowserInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setInfo(detectInAppBrowser());
  }, []);

  if (!info?.isInApp) return null;

  const intentUrl = info.isAndroid ? buildAndroidChromeIntentUrl() : null;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* clipboard bisa diblokir di webview; user masih bisa memakai email */
    }
  }

  return (
    <div
      role="note"
      className="my-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-xs leading-relaxed text-foreground"
    >
      <p className="font-semibold">
        {isEN
          ? "Google login doesn't work inside this app's browser"
          : "Login Google tidak berfungsi di browser aplikasi ini"}
      </p>
      <p className="mt-1 text-muted-foreground">
        {isEN
          ? "Open this page in Chrome/Safari, or continue with your email below."
          : "Buka halaman ini di Chrome/Safari, atau lanjutkan dengan email di bawah."}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {intentUrl && (
          <a
            href={intentUrl}
            className="rounded-md bg-primary px-2.5 py-1.5 font-semibold text-primary-foreground"
          >
            {isEN ? "Open in Chrome" : "Buka di Chrome"}
          </a>
        )}
        <button
          type="button"
          onClick={copyLink}
          className="cursor-pointer rounded-md border border-border/70 px-2.5 py-1.5 font-semibold"
        >
          {copied
            ? isEN
              ? "Link copied ✓"
              : "Tautan disalin ✓"
            : isEN
              ? "Copy link"
              : "Salin tautan"}
        </button>
      </div>
    </div>
  );
}
