"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { login, requestOtp, verifyOtp } from "@/lib/api";
import { persistAuthSession, useStoredEmail } from "@/lib/auth-store";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

const LOGIN_FIELDS = ["email", "password"] as const;
type LoginField = (typeof LOGIN_FIELDS)[number];
type AuthMode = "password" | "otp";
type OTPChannel = "whatsapp" | "email";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm(email: string, password: string): FieldErrors<LoginField> {
  const errors: FieldErrors<LoginField> = {};

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, like admin@mail.com.";
  }

  if (!password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

function LoginLoadingIndicator() {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const sequence = [1, 2, 3, 2];
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % sequence.length;
      setDotCount(sequence[index]);
    }, 350);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="inline-flex min-w-[112px] items-center justify-center gap-1.5" aria-live="polite">
      <span>Signing in</span>
      <span className="inline-flex translate-y-0.5 gap-1" aria-hidden="true">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className={dot < dotCount ? "size-1 rounded-full bg-primary-foreground transition-opacity duration-150 opacity-100" : "size-1 rounded-full bg-primary-foreground transition-opacity duration-150 opacity-20"}
          />
        ))}
      </span>
    </span>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const storedEmail = useStoredEmail();
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<AuthMode>("password");
  const [otpChannel, setOtpChannel] = useState<OTPChannel>("whatsapp");
  const [otpTarget, setOtpTarget] = useState("");
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({});
  const handledExpiredToastRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") pushToast("Password updated. You can sign in now.", "success");
    if (params.get("passwordChanged") === "true") pushToast("Password changed. Please sign in again.", "success");
    if (params.get("expired") === "true" && !handledExpiredToastRef.current) {
      handledExpiredToastRef.current = true;
      pushToast("Session Expired", "error", {
        message: "Your session has expired. Please sign in again to continue.",
        actionLabel: "Dismiss",
        autoClose: false,
        position: "top-center",
      });
      params.delete("expired");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
    }
  }, [pushToast]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateLoginForm(email, password);
    if (hasFieldErrors(nextFieldErrors)) {
      setState("error");
      setFieldErrors(nextFieldErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
      return;
    }

    setState("loading");
    setErrorMessage("");
    setFieldErrors({});

    login(email, password)
      .then((response) => {
        persistAuthSession(email, response.data.access_token);
        pushToast("Login successful. Welcome to the live demo.", "success");
        router.push("/dashboard");
      })
      .catch((error: unknown) => {
        setState("error");
        const nextErrors = getApiFieldErrors(error, LOGIN_FIELDS);
        setFieldErrors(nextErrors);
        const message = getFormErrorMessage(error, "Login failed", nextErrors);
        setErrorMessage(message);
        
        const apiError = error as import("@/lib/api").ApiError;
        pushToast(message, "error", {
          aiDetails: apiError?.aiDetails,
          suggestions: apiError?.suggestions,
        });
      });
  }

  function handleOTPRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = otpTarget.trim();
    if (!target || (otpChannel === "email" && !EMAIL_PATTERN.test(target)) || (otpChannel === "whatsapp" && !isValidPhoneNumber(target))) {
      setState("error");
      setErrorMessage(otpChannel === "email" ? "Enter a valid email address." : "Enter a WhatsApp number in international format, like +628123456789.");
      return;
    }

    setState("loading");
    setErrorMessage("");
    requestOtp(otpChannel, target)
      .then(() => {
        setOtpRequested(true);
        pushToast("OTP sent successfully.", "success");
      })
      .catch((error: unknown) => {
        setState("error");
        const message = error instanceof Error ? error.message : "Unable to send OTP";
        setErrorMessage(message);
        pushToast(message, "error");
      })
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handleOTPVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setState("error");
      setErrorMessage("Enter the 6-digit OTP code.");
      return;
    }

    setState("loading");
    setErrorMessage("");
    const target = otpTarget.trim();
    verifyOtp({
      channel: otpChannel,
      target,
      otp,
      deviceName: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "browser",
      trustedDevice,
    })
      .then((response) => {
        persistAuthSession(otpChannel === "email" ? target : "", response.data.access_token);
        pushToast("OTP verified. Welcome back.", "success");
        router.push("/dashboard");
      })
      .catch((error: unknown) => {
        setState("error");
        const message = error instanceof Error ? error.message : "Invalid or expired OTP";
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
          <Link href="/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-muted/20 p-1">
        {(["password", "otp"] as const).map((mode) => {
          const isActive = authMode === mode;
          return (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setAuthMode(mode);
              setState("idle");
              setErrorMessage("");
            }}
            className={isActive ? "rounded-md bg-white/[0.12] px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" : "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"}
          >
            {mode === "password" ? "Password" : "OTP"}
          </button>
          );
        })}
      </div>

      {authMode === "password" ? (
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="admin@mail.com"
            error={fieldErrors.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined }));
            }}
            placeholder="Enter your password"
            error={fieldErrors.password}
          />
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
          {state === "loading" ? <LoginLoadingIndicator /> : "Enter Dashboard"}
        </Button>
        </form>
      ) : (
        <form className="mt-4 space-y-4" onSubmit={otpRequested ? handleOTPVerify : handleOTPRequest}>
          <div className="space-y-2">
            <Label>Delivery channel</Label>
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-border/60 bg-background/30 p-1">
              {(["whatsapp", "email"] as const).map((channel) => {
                const isActive = otpChannel === channel;
                return (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => {
                      setOtpChannel(channel);
                      setOtpTarget("");
                      setOtpRequested(false);
                      setOtp("");
                      setErrorMessage("");
                      setState("idle");
                    }}
                    className={isActive ? "rounded-md bg-white/[0.09] px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" : "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"}
                  >
                    {channel === "whatsapp" ? "WhatsApp" : "Email"}
                  </button>
                );
              })}
            </div>
          </div>
          {otpChannel === "email" ? (
            <div className="space-y-2">
              <Label htmlFor="otp-target">Email</Label>
              <Input
                id="otp-target"
                type="email"
                value={otpTarget}
                onChange={(event) => {
                  setOtpTarget(event.target.value);
                  setOtpRequested(false);
                }}
                placeholder="name@example.com"
              />
            </div>
          ) : (
            <PhoneNumberInput
              id="otp-target"
              value={otpTarget}
              onChange={(value) => {
                setOtpTarget(value);
                setOtpRequested(false);
              }}
            />
          )}
          {otpRequested ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="otp-code">OTP code</Label>
                <Input
                  id="otp-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="123456"
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <Checkbox checked={trustedDevice} onChange={(event) => setTrustedDevice(event.target.checked)} />
                Trust this device
              </label>
            </>
          ) : null}
          <Button type="submit" disabled={state === "loading"} className="w-full shadow-lg shadow-primary/20">
            {state === "loading" ? <LoginLoadingIndicator /> : otpRequested ? "Verify OTP" : "Send OTP"}
          </Button>
        </form>
      )}

      {authMode === "password" ? (
        <SocialAuthButtons
          mode="login"
          onLoadingStateChange={(loading) => {
            setState(loading ? "loading" : "idle");
          }}
          onErrorMessageChange={(message) => {
            if (message) {
              setState("error");
            }
            setErrorMessage(message);
          }}
        />
      ) : null}

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {errorMessage}
        </div>
      ) : null}
    </AuthShell>
  );
}
