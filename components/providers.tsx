"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccentPreference, useThemePreference, persistAuthSession } from "@/lib/auth-store";
import { ToastProvider } from "@/components/toast-provider";
import type { Locale } from "@/lib/i18n/translations";
import { I18nProvider } from "@/lib/i18n/context";
import { socialLogin, linkGoogle } from "@/lib/api/auth";

function GoogleOAuthHandler() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Try to find id_token in URL hash or query string (Google OAuth redirect flow)
    let idToken: string | null = null;

    if (window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      idToken = hashParams.get("id_token");
    }
    if (!idToken && window.location.search) {
      const searchParams = new URLSearchParams(window.location.search);
      idToken = searchParams.get("id_token");
    }

    if (!idToken) return;

    // Clean the id_token from URL immediately so the page looks normal
    if (window.history?.replaceState) {
      const cleanUrl = window.location.pathname + (window.location.search.replace(/[?&]?id_token=[^&]*/g, "").replace(/^\?$/, "") || "");
      window.history.replaceState(null, "", cleanUrl);
    }

    const isLinkMode = sessionStorage.getItem("webjoz_google_link_mode") === "true";
    const returnTo = sessionStorage.getItem("webjoz_google_return_to") || "/dashboard";

    if (isLinkMode) {
      sessionStorage.removeItem("webjoz_google_link_mode");
      sessionStorage.removeItem("webjoz_google_return_to");
      linkGoogle(idToken)
        .then(() => {
          router.replace(returnTo);
        })
        .catch((err: unknown) => {
          console.error("Link Google failed:", err);
          router.replace("/dashboard/settings?error=link_google_failed");
        });
      return;
    }

    // Exchange id_token with backend (Normal Login)
    socialLogin("google", idToken)
      .then((apiResponse) => {
        persistAuthSession("", apiResponse.data.access_token);
        sessionStorage.removeItem("webjoz_google_return_to");

        // Smart back: push history state so back button stays in app, not Google
        window.history.pushState({ smartBack: true }, "", returnTo);
        window.history.pushState({ smartBack: true }, "", returnTo);

        // Listen for back/forward — keep user inside app
        const handlePopState = () => {
          if (!window.location.hash.includes("id_token")) {
            window.history.pushState({ smartBack: true }, "", window.location.pathname);
          }
        };
        window.addEventListener("popstate", handlePopState);
        // Cleanup after 10s (enough for user to settle)
        setTimeout(() => window.removeEventListener("popstate", handlePopState), 10000);

        router.replace(returnTo);
      })
      .catch((err: unknown) => {
        console.error("Google OAuth callback failed:", err);
        router.replace("/login?error=google_failed");
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function Providers({ children, defaultLocale = "id", forcedLocale }: { children: ReactNode; defaultLocale?: Locale; forcedLocale?: Locale }) {
  const theme = useThemePreference();
  const accent = useAccentPreference();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-blue", accent !== "monochrome");
  }, [accent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const ref = urlParams.get("ref") || urlParams.get("referral_code");
      if (ref) {
        localStorage.setItem("webjoz_referral_code", ref);
      }
    }
  }, []);

  return (
    <ToastProvider>
      <I18nProvider defaultLocale={defaultLocale} forcedLocale={forcedLocale}>
        <GoogleOAuthHandler />
        {children}
      </I18nProvider>
    </ToastProvider>
  );
}
