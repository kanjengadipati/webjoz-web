"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import Script from "next/script";
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "@/lib/config";
import { login, socialLogin } from "@/lib/api";
import { persistAuthSession, useStoredEmail } from "@/lib/auth-store";

// Module-level promise so HMR re-mounts don't recreate it.
// Resolves once FB.init() has been called inside fbAsyncInit.
let fbReadyResolve: (() => void) | null = null;
const fbReadyPromise: Promise<void> = new Promise((res) => {
  fbReadyResolve = res;
});

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const storedEmail = useStoredEmail();
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");



  // Register window.fbAsyncInit BEFORE the <Script> renders.
  // The Facebook SDK calls this callback automatically once it loads.
  useEffect(() => {
    if (!FACEBOOK_APP_ID || typeof window === "undefined") return;
    if ((window as any).__fbAsyncInitSet) return; // idempotent across HMR
    (window as any).__fbAsyncInitSet = true;

    (window as any).fbAsyncInit = () => {
      (window as any).FB.init({
        appId: FACEBOOK_APP_ID,
        status: false,
        xfbml: false,
        version: "v18.0",
      });
      fbReadyResolve?.();
    };
  }, []);

  const initializeGoogle = useCallback(() => {
    if (!GOOGLE_CLIENT_ID || typeof window === "undefined" || (window as any).__googleInitialized) return;

    const google = (window as any).google;
    if (google?.accounts?.id) {
      (window as any).__googleInitialized = true;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        itp_support: true,
        use_fedcm_for_prompt: false,
        callback: (response: any) => {
          setState("loading");
          socialLogin("google", response.credential)
            .then((apiResponse) => {
              persistAuthSession("", apiResponse.data?.access_token || "", apiResponse.data?.refresh_token || "");
              pushToast("Welcome! Google login successful.", "success");
              router.push("/dashboard");
            })
            .catch((error: any) => {
              setState("error");
              const msg = error?.response?.data?.message || (error instanceof Error ? error.message : "Social login failed");
              setErrorMessage(msg);
              pushToast(msg, "error");
            });
        },
      });
    }
  }, [pushToast, router]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") pushToast("Password updated. You can sign in now.", "success");
    if (params.get("expired") === "true") pushToast("Your session has expired. Please sign in again.", "error");
    if ((window as any).google) initializeGoogle();
  }, [pushToast, initializeGoogle]);

  const handleGoogleClick = () => {
    if (!GOOGLE_CLIENT_ID) {
      pushToast("Google Client ID is missing. Please check your .env file.", "error");
      return;
    }
    const google = (window as any).google;
    if (google?.accounts?.id) {
      google.accounts.id.prompt();
    } else {
      pushToast("Google login is initializing. Please wait.", "info");
      initializeGoogle();
    }
  };

  const handleFacebookClick = () => {
    if (!FACEBOOK_APP_ID) {
      pushToast("Facebook App ID is missing. Please check your .env file.", "error");
      return;
    }

    setState("loading");
    setErrorMessage("");

    // fbReadyPromise only resolves after FB.init() completes inside fbAsyncInit
    fbReadyPromise.then(() => {
      const fb = (window as any).FB;
      if (!fb) {
        setState("error");
        pushToast("Facebook SDK failed to load.", "error");
        return;
      }

      fb.login(
        (response: any) => {
          if (response?.authResponse?.accessToken) {
            socialLogin("facebook", response.authResponse.accessToken)
              .then((apiResponse) => {
                persistAuthSession("", apiResponse.data?.access_token || "", apiResponse.data?.refresh_token || "");
                pushToast("Welcome! Facebook login successful.", "success");
                router.push("/dashboard");
              })
              .catch((error: any) => {
                setState("error");
                const msg = error?.response?.data?.message || (error instanceof Error ? error.message : "Facebook login failed");
                setErrorMessage(msg);
                pushToast(msg, "error");
              });
          } else {
            setState("idle");
            pushToast("Facebook login was cancelled.", "info");
          }
        },
        { scope: "public_profile,email" }
      );
    });
  };

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMessage("");

    login(email, password)
      .then((response) => {
        persistAuthSession(email, response.data?.access_token || "", response.data?.refresh_token || "");
        pushToast("Login successful. Welcome to the live demo.", "success");
        router.push("/dashboard");
      })
      .catch((error: any) => {
        setState("error");
        const message = error?.response?.data?.message || (error instanceof Error ? error.message : "Login failed");
        setErrorMessage(message);
        pushToast(message, "error");
      });
  }

  return (
    <AuthShell
      badge="Pleco Console"
      title="The auth backend built for startup teams."
      description="Sign in with the seeded admin account to explore the logs feed, AI investigation workflow, active sessions, and user management endpoints through a polished dashboard."
      stats={[
        { label: "Session Control", value: "Live Tokens", helper: "Inspect active sessions, refresh rotation, and revocation flows." },
        { label: "Audit Visibility", value: "Real Signals", helper: "See auth logs, investigation output, and user management in one place." },
      ]}
      cardEyebrow="Sign in to continue"
      cardTitle="Sign In"
      cardDescription="Use the seeded account to unlock the dashboard and test the backend in a realistic flow."
      footer={
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-x-5">
          <Link href="/" className="font-medium text-primary hover:opacity-80">Back to overview</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">Create account</Link>
          <Link href="/auth/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@mail.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
          <div className="text-xs font-medium text-muted-foreground/70">
            Demo password: <span className="font-semibold text-foreground/80">admin123</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm font-medium text-primary hover:opacity-80">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full shadow-lg shadow-primary/20">
          {state === "loading" ? "Signing in..." : "Enter Dashboard"}
        </Button>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
          <span className="bg-card px-3 text-muted-foreground/60">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <Button variant="outline" onClick={handleGoogleClick} className="w-full rounded-xl border-border/60 bg-background/50 py-5 sm:py-6 hover:bg-primary/5 transition-all duration-300 group">
          <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </Button>
        <Button variant="outline" onClick={handleFacebookClick} className="w-full rounded-xl border-border/60 bg-background/50 py-5 sm:py-6 hover:bg-[#1877F2]/5 transition-all duration-300 group">
          <svg className="size-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </Button>
        <Button variant="outline" disabled className="w-full rounded-xl border-border/60 bg-background/50 py-5 sm:py-6 opacity-30 cursor-not-allowed grayscale">
          <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
          </svg>
        </Button>
      </div>

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {errorMessage}
        </div>
      ) : null}

      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onLoad={initializeGoogle} />
      {FACEBOOK_APP_ID && (
        <Script src="https://connect.facebook.net/en_US/sdk.js" strategy="afterInteractive" />
      )}
    </AuthShell>
  );
}
