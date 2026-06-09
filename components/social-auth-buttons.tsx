"use client";

import { useEffect, useId, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

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
  const [googleReady, setGoogleReady] = useState(false);
  const reactId = useId();
  const googleContainerId = useMemo(() => `google-signin-${mode}-${reactId.replace(/[:]/g, "")}`, [mode, reactId]);
  const hiddenGoogleContainerId = useMemo(() => `google-hidden-${mode}-${reactId.replace(/[:]/g, "")}`, [mode, reactId]);

  const handleGoogleClick = useCallback(() => {
    const container = document.getElementById(hiddenGoogleContainerId);
    const btn = container?.querySelector("div[role='button'], button") as HTMLElement | null;
    if (btn) {
      btn.click();
    } else {
      pushToast("Google Sign-In belum siap, coba lagi.", "error");
    }
  }, [hiddenGoogleContainerId, pushToast]);

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

      if (typeof firstArg === "string" && firstArg.includes("The method FB.login can no longer be called from http pages")) {
        setLocalLoading(false);
        pushToast("Facebook login requires HTTPS. Please run your dev server with 'next dev --experimental-https'.", "error");
        return;
      }

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
  }, [pushToast, setLocalLoading]);

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

    if (layout === "grid") {
      // In grid layout we show a custom button, so render GIS into the hidden div
      const hiddenContainer = document.getElementById(hiddenGoogleContainerId);
      if (!hiddenContainer) return;
      hiddenContainer.innerHTML = "";
      google.accounts.id.renderButton(hiddenContainer, {
        theme: "outline",
        size: "large",
        type: "standard",
        shape: "rectangular",
        text: mode === "login" ? "signin" : "signup_with",
        width: 190,
      });
    } else {
      const container = document.getElementById(googleContainerId);
      if (!container) return;
      container.innerHTML = "";
      google.accounts.id.renderButton(container, {
        theme: "filled_blue",
        size: "large",
        type: "icon",
        shape: "circle",
      });
    }
    setGoogleReady(true);
  }, [googleContainerId, hiddenGoogleContainerId, layout, mode]);

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
                
                const redirectParam = new URLSearchParams(window.location.search).get("redirect");
                const pendingWizard = localStorage.getItem("giwangan_pending_wizard_data");
                if (redirectParam) {
                  router.push(redirectParam);
                } else if (pendingWizard) {
                  router.push("/create");
                } else {
                  router.push("/dashboard/sites");
                }
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
                const pendingWizard = localStorage.getItem("giwangan_pending_wizard_data");
                if (redirectParam) {
                  router.push(redirectParam);
                } else if (pendingWizard) {
                  router.push("/create");
                } else {
                  router.push("/dashboard/sites");
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
  const hasFacebook = SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && !!FACEBOOK_CLIENT_ID;
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
        <div className="grid grid-cols-2 gap-3.5 my-4">
          {/* Hidden GIS container — keeps auth callback alive */}
          <div
            id={hiddenGoogleContainerId}
            aria-hidden="true"
            className="absolute pointer-events-none opacity-0 overflow-hidden w-px h-px"
          />
          {hasGoogle && (
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={loading || !googleReady}
              className="h-11 flex items-center justify-center gap-2.5 rounded-lg border border-border/80 bg-background hover:bg-muted text-sm font-semibold text-foreground transition cursor-pointer disabled:opacity-50 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Google multicolor G logo */}
              <svg className="size-[18px] shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
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
            <div className={cn("relative size-10 rounded-full border border-border/60 bg-background/50 flex items-center justify-center transition-all duration-300", loading ? "pointer-events-none opacity-50" : "group cursor-pointer")}>
              <div
                id={googleContainerId}
                className={cn("absolute inset-0 rounded-full overflow-hidden transition-opacity duration-300", googleReady ? "opacity-100" : "opacity-0 pointer-events-none")}
              />
              {!googleReady && (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current/25 border-t-current/70" aria-hidden="true" />
              )}
            </div>
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

          {/* Apple (Disabled/Coming Soon) */}
          <div
            className="relative size-10 rounded-full border border-border/30 bg-background/20 flex items-center justify-center opacity-30 cursor-not-allowed transition-all duration-300"
            title="Apple Sign-In (Coming Soon)"
          >
            <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
            </svg>
          </div>

          {/* GitHub (Disabled/Coming Soon) */}
          <div
            className="relative size-10 rounded-full border border-border/30 bg-background/20 flex items-center justify-center opacity-30 cursor-not-allowed transition-all duration-300"
            title="GitHub Sign-In (Coming Soon)"
          >
            <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </div>

          {/* Microsoft (Disabled/Coming Soon) */}
          <div
            className="relative size-10 rounded-full border border-border/30 bg-background/20 flex items-center justify-center opacity-30 cursor-not-allowed transition-all duration-300"
            title="Microsoft Sign-In (Coming Soon)"
          >
            <svg className="size-5 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="2" y="2" width="9" height="9" />
              <rect x="13" y="2" width="9" height="9" />
              <rect x="2" y="13" width="9" height="9" />
              <rect x="13" y="13" width="9" height="9" />
            </svg>
          </div>
        </div>
      )}

      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogle} />
      {SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && FACEBOOK_CLIENT_ID && (
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />
      )}
    </>
  );
}
