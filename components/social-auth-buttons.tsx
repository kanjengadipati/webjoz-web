"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/components/toast-provider";
import { socialLogin } from "@/lib/api";
import { persistAuthSession } from "@/lib/auth-store";
import { FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID, SOCIAL_ACTIVE_PROVIDERS } from "@/lib/config";
import { cn } from "@/lib/utils";
import Script from "next/script";

type FacebookLoginResponse = {
  authResponse?: {
    accessToken?: string;
  };
};

type FacebookSdk = {
  init: (options: {
    appId: string;
    status: boolean;
    xfbml: boolean;
    version: string;
  }) => void;
  login: (
    callback: (response: FacebookLoginResponse) => void,
    options: { scope: string },
  ) => void;
};

declare global {
  interface Window {
    __fbAsyncInitSet?: boolean;
    fbAsyncInit?: () => void;
    FB?: FacebookSdk;
  }
}

// Module-level promise so HMR re-mounts don't recreate it.
let fbReadyResolve: (() => void) | null = null;
const fbReadyPromise: Promise<void> = new Promise((res) => {
  fbReadyResolve = res;
});

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

type SocialAuthButtonsProps = {
  mode: "login" | "signup";
  onLoadingStateChange?: (loading: boolean) => void;
  onErrorMessageChange?: (message: string) => void;
  compact?: boolean;
  layout?: "circle" | "grid";
  showSeparator?: boolean;
};

export function SocialAuthButtons({
  mode,
  onLoadingStateChange,
  onErrorMessageChange,
  compact,
  layout = "circle",
  showSeparator = true,
}: SocialAuthButtonsProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);

  const setLocalLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
    onLoadingStateChange?.(isLoading);
  }, [onLoadingStateChange]);

  // Register window.fbAsyncInit BEFORE the <Script> renders.
  useEffect(() => {
    if (!FACEBOOK_CLIENT_ID || !SOCIAL_ACTIVE_PROVIDERS.includes("facebook") || typeof window === "undefined") return;
    if (window.__fbAsyncInitSet) return;
    window.__fbAsyncInitSet = true;

    window.fbAsyncInit = () => {
      window.FB?.init({
        appId: FACEBOOK_CLIENT_ID,
        status: false,
        xfbml: false,
        version: "v18.0",
      });
      fbReadyResolve?.();
    };
  }, []);

  // ─── Google: OAuth Redirect Flow ────────────────────────────────────────────
  // Much more reliable than GIS iframe overlay — works the same way as jogjagem.
  // 1. User clicks → redirect to Google OAuth
  // 2. Google redirects back with #id_token=... in URL hash
  // 3. providers.tsx picks up id_token on load and calls socialLogin API
  const handleGoogleClick = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      pushToast("Google Client ID is missing. Please check your .env file.", "error");
      return;
    }

    // Save current path so we can return after OAuth callback
    if (typeof window !== "undefined") {
      const redirectParam = new URLSearchParams(window.location.search).get("redirect");
      const pendingWizard = localStorage.getItem("webjoz_pending_wizard_data");
      if (redirectParam) {
        sessionStorage.setItem("webjoz_google_return_to", redirectParam);
} else if (pendingWizard) {
              sessionStorage.setItem("webjoz_google_return_to", "/dashboard");
            } else {
              sessionStorage.setItem("webjoz_google_return_to", "/dashboard");
            }
    }

    const redirectUri = window.location.origin;
    const nonce = Math.random().toString(36).substring(2);
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=openid%20email%20profile` +
      `&nonce=${nonce}` +
      `&prompt=login`;

    window.location.href = googleAuthUrl;
  }, [pushToast]);

  // ─── Facebook ────────────────────────────────────────────────────────────────
  const handleFacebookClick = () => {
    if (!FACEBOOK_CLIENT_ID) {
      pushToast("Facebook App ID is missing. Please check your .env file.", "error");
      return;
    }

    setLocalLoading(true);
    onErrorMessageChange?.("");

    fbReadyPromise.then(() => {
      const fb = window.FB;
      if (!fb) {
        setLocalLoading(false);
        pushToast("Facebook SDK failed to load.", "error");
        return;
      }

      fb.login(
        (response) => {
          if (response?.authResponse?.accessToken) {
            socialLogin("facebook", response.authResponse.accessToken)
              .then((apiResponse) => {
                persistAuthSession("", apiResponse.data.access_token);
                pushToast(`Welcome! Facebook ${mode === "login" ? "login" : "signup"} successful.`, "success");

const redirectParam = new URLSearchParams(window.location.search).get("redirect");
              const pendingWizard = localStorage.getItem("webjoz_pending_wizard_data");
              if (redirectParam) {
                router.push(redirectParam);
              } else {
                router.push("/dashboard");
              }
              })
              .catch((error: unknown) => {
                setLocalLoading(false);
                const msg = getErrorMessage(error, `Facebook ${mode === "login" ? "login" : "signup"} failed`);
                onErrorMessageChange?.(msg);
                pushToast(msg, "error");
              });
          } else {
            setLocalLoading(false);
            pushToast("Facebook login was cancelled.", "info");
          }
        },
        { scope: "public_profile,email" }
      );
    });
  };

  const hasGoogle = SOCIAL_ACTIVE_PROVIDERS.includes("google") && !!GOOGLE_CLIENT_ID;
  const hasFacebook = SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && !!FACEBOOK_CLIENT_ID && mode !== "login";
  const hasAnySocial = hasGoogle || hasFacebook;

  if (!hasAnySocial) return null;

  return (
    <>
      {showSeparator && (
        <div className={cn("relative", compact ? "mb-4 mt-3" : "my-8")}>
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
            <span className="bg-card px-3 text-muted-foreground/60">
              {mode === "login" ? "Or continue with" : "Or signup with"}
            </span>
          </div>
        </div>
      )}

      {layout === "grid" ? (
        <div className={`grid gap-3.5 my-4 ${hasGoogle && hasFacebook ? "grid-cols-2" : "grid-cols-1"}`}>
          {hasGoogle && (
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleClick}
              aria-label="Continue with Google"
              className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg bg-foreground/8 hover:bg-foreground/14 text-sm font-semibold text-foreground transition cursor-pointer disabled:opacity-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          )}
          {hasFacebook && (
            <button
              type="button"
              onClick={handleFacebookClick}
              disabled={loading}
              className="h-11 flex items-center justify-center gap-2.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-semibold transition cursor-pointer disabled:opacity-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-4 sm:gap-5 my-4">
          {hasGoogle && (
            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleClick}
              aria-label="Continue with Google"
              className={cn(
                "relative size-10 rounded-full border border-border/60 bg-background/50 flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                loading ? "pointer-events-none opacity-50" : "cursor-pointer group"
              )}
            >
              <svg className="size-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </button>
          )}
          {hasFacebook && (
            <div className={cn("relative size-10 rounded-full border border-border/60 bg-background/50 flex items-center justify-center transition-all duration-300", loading ? "pointer-events-none opacity-50" : "group cursor-pointer")}>
              <button
                type="button"
                onClick={handleFacebookClick}
                disabled={loading}
                aria-label={`Continue with Facebook for ${mode}`}
                className="size-10 rounded-full flex items-center justify-center hover:bg-[#1877F2]/5 transition-all duration-300 cursor-pointer disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <svg className="size-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && FACEBOOK_CLIENT_ID && (
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />
      )}
    </>
  );
}
