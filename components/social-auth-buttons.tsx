"use client";

import { useEffect, useId, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { socialLogin } from "@/lib/api";
import { persistAuthSession } from "@/lib/auth-store";
import { FACEBOOK_CLIENT_ID, GOOGLE_CLIENT_ID, SOCIAL_ACTIVE_PROVIDERS } from "@/lib/config";
import { cn } from "@/lib/utils";

type GoogleCredentialResponse = {
  credential?: string;
};

type PromptMomentNotification = {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () => string;
  isSkippedMoment: () => boolean;
  getSkippedReason: () => string;
  isDismissedMoment: () => boolean;
  getDismissedReason: () => string;
};

type GoogleIdClient = {
  initialize: (options: {
    client_id: string;
    itp_support: boolean;
    use_fedcm_for_prompt: boolean;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  prompt: (callback?: (notification: PromptMomentNotification) => void) => void;
  renderButton: (
    parent: HTMLElement,
    options: {
      theme?: "outline" | "filled_blue" | "filled_black" | "neutral";
      size?: "small" | "medium" | "large";
      text?: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape?: "rectangular" | "pill" | "circle" | "square";
      width?: string | number;
      type?: "standard" | "icon";
    }
  ) => void;
};

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
    __googleInitialized?: boolean;
    fbAsyncInit?: () => void;
    FB?: FacebookSdk;
    google?: {
      accounts?: {
        id?: GoogleIdClient;
      };
    };
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
};

export function SocialAuthButtons({ mode, onLoadingStateChange, onErrorMessageChange, compact }: SocialAuthButtonsProps) {
  const router = useRouter();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const reactId = useId();
  const googleContainerId = useMemo(() => `google-signin-${mode}-${reactId.replace(/[:]/g, "")}`, [mode, reactId]);

  const setLocalLoading = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
    onLoadingStateChange?.(isLoading);
  }, [onLoadingStateChange]);

  // Intercept and suppress GSI/FedCM noise during user cancellation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    console.error = (...args: unknown[]) => {
      const firstArg = args[0];
      if (
        typeof firstArg === "string" &&
        (firstArg.includes("[GSI_LOGGER]") || firstArg.includes("GSI_LOGGER")) &&
        (firstArg.includes("NetworkError") ||
          firstArg.includes("Error retrieving a token") ||
          firstArg.includes("AbortError") ||
          firstArg.includes("signal is aborted") ||
          firstArg.includes("NotAllowedError"))
      ) {
        return;
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args: unknown[]) => {
      const firstArg = args[0];
      if (
        typeof firstArg === "string" &&
        (firstArg.includes("[GSI_LOGGER]") || firstArg.includes("GSI_LOGGER")) &&
        (firstArg.includes("NetworkError") ||
          firstArg.includes("Error retrieving a token") ||
          firstArg.includes("AbortError") ||
          firstArg.includes("signal is aborted") ||
          firstArg.includes("NotAllowedError"))
      ) {
        return;
      }
      originalConsoleWarn.apply(console, args);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      if (reason) {
        const errorMsg = reason.message || String(reason);
        if (
          errorMsg.includes("Error retrieving a token") ||
          errorMsg.includes("FedCM") ||
          errorMsg.includes("AbortError") ||
          errorMsg.includes("signal is aborted") ||
          errorMsg.includes("NotAllowedError")
        ) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

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

  const renderGoogleButton = useCallback(() => {
    if (typeof window === "undefined") return;
    const google = window.google;
    if (!google?.accounts?.id) return;
    const container = document.getElementById(googleContainerId);
    if (!container) return;

    container.innerHTML = "";
    google.accounts.id.renderButton(container, {
      theme: "outline",
      size: "large",
      // We render the official button invisibly (overlay) and show our own icon-only
      // styling underneath. This keeps a consistent design while preserving
      // the most reliable Google sign-in click behavior.
      type: "standard",
      shape: "pill",
      width: "250",
      text: mode === "login" ? "continue_with" : "signup_with",
    });
    setGoogleReady(true);
  }, [googleContainerId, mode]);

  const initializeGoogle = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || !SOCIAL_ACTIVE_PROVIDERS.includes("google") || typeof window === "undefined") return;

    const google = window.google;
    if (google?.accounts?.id) {
      if (!window.__googleInitialized) {
        window.__googleInitialized = true;
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          itp_support: true,
          use_fedcm_for_prompt: false,
          callback: (response) => {
            if (!response.credential) {
              pushToast("Google did not return a credential.", "error");
              return;
            }
            setLocalLoading(true);
            onErrorMessageChange?.("");
            socialLogin("google", response.credential)
              .then((apiResponse) => {
                persistAuthSession("", apiResponse.data.access_token);
                pushToast(`Welcome! Google ${mode === "login" ? "login" : "signup"} successful.`, "success");
                router.push("/dashboard");
              })
              .catch((error: unknown) => {
                setLocalLoading(false);
                const msg = getErrorMessage(error, `Social ${mode === "login" ? "login" : "signup"} failed`);
                onErrorMessageChange?.(msg);
                pushToast(msg, "error");
              });
          },
        });
      }
      renderGoogleButton();
    }
  }, [pushToast, router, mode, onErrorMessageChange, setLocalLoading, renderGoogleButton]);

  // If the GIS script loads after a route transition, initialize/render once.
  useEffect(() => {
    if (googleReady) return;
    if (!GOOGLE_CLIENT_ID || !SOCIAL_ACTIVE_PROVIDERS.includes("google") || typeof window === "undefined") return;
    if (window.google?.accounts?.id) {
      window.setTimeout(initializeGoogle, 0);
    }
  }, [googleReady, initializeGoogle]);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      pushToast("Google Client ID is missing. Please check your .env file.", "error");
      return;
    }
    if (!googleReady) {
      pushToast("Google login is still loading. Please wait a moment.", "info");
      initializeGoogle();
      return;
    }
    const google = window.google;
    if (google?.accounts?.id) {
      if (!window.__googleInitialized) {
        initializeGoogle();
      }
      // For button-based flows, the rendered Google button handles the click.
      // We keep this handler to provide helpful toasts if GIS isn't ready.
      renderGoogleButton();
      return;
    }
    if (!google?.accounts?.id) {
      pushToast("Google login is initializing. Please wait.", "info");
      initializeGoogle();
    }
  };

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
                router.push("/dashboard");
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
  const hasFacebook = SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && !!FACEBOOK_CLIENT_ID;
  const hasAnySocial = hasGoogle || hasFacebook;

  if (!hasAnySocial) return null;

  return (
    <>
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

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {hasGoogle && (
          <div className="relative">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleClick}
              disabled={loading || !googleReady}
              aria-label={`Continue with Google for ${mode}`}
              className="w-full rounded-xl border-border/60 bg-background/50 py-5 sm:py-6 hover:bg-primary/5 transition-all duration-300 group"
            >
              {!googleReady ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/25 border-t-current/70" aria-hidden="true" />
              ) : null}
              <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </Button>

            {/* Invisible Google-rendered button overlay to handle the click reliably */}
            <div
              id={googleContainerId}
              className="absolute inset-0 z-10 overflow-hidden opacity-0"
              style={{
                transform: "scale(2.5)",
                transformOrigin: "center",
              }}
            />
          </div>
        )}
        {hasFacebook && (
          <Button
            variant="outline"
            type="button"
            onClick={handleFacebookClick}
            disabled={loading}
            aria-label={`Continue with Facebook for ${mode}`}
            className="w-full rounded-xl border-border/60 bg-background/50 py-5 sm:py-6 hover:bg-[#1877F2]/5 transition-all duration-300 group"
          >
            <svg className="size-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </Button>
        )}
      </div>

      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogle} />
      {SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && FACEBOOK_CLIENT_ID && (
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />
      )}
    </>
  );
}
