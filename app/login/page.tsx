"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { MailIcon, WhatsAppIcon } from "@/components/icons";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Checkbox, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { checkPasswordlessIdentity, login, startPasswordless, verifyMagicLink, verifyOtp } from "@/lib/api";
import { persistAuthSession, useStoredEmail } from "@/lib/auth-store";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

const LOGIN_FIELDS = ["email", "password"] as const;
const PASSWORDLESS_FIELDS = ["email", "phone", "otp"] as const;
type LoginField = (typeof LOGIN_FIELDS)[number];
type PasswordlessField = (typeof PASSWORDLESS_FIELDS)[number];
type AuthMode = "password" | "passwordless";
type OTPChannel = "whatsapp" | "email";
type PasswordlessStep = "delivery" | "confirm" | "code" | "link";
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

function LoginLoadingIndicator({ label = "Signing in" }: { label?: string }) {
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
      <span>{label}</span>
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
  const [passwordlessEmail, setPasswordlessEmail] = useState(storedEmail);
  const [passwordlessPhone, setPasswordlessPhone] = useState("");
  const [passwordlessStep, setPasswordlessStep] = useState<PasswordlessStep>("delivery");
  const [otp, setOtp] = useState("");
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginField>>({});
  const [passwordlessFieldErrors, setPasswordlessFieldErrors] = useState<FieldErrors<PasswordlessField>>({});
  const handledExpiredToastRef = useRef(false);

  const passwordlessTarget = otpChannel === "email" ? passwordlessEmail.trim().toLowerCase() : passwordlessPhone.trim();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") pushToast("Password updated. You can sign in now.", "success");
    if (params.get("passwordChanged") === "true") pushToast("Password changed. Please sign in again.", "success");
    const magicToken = params.get("magic_token");
    if (magicToken) {
      verifyMagicLink({
        token: magicToken,
        deviceName: navigator.userAgent.slice(0, 80),
        trustedDevice: true,
      })
        .then((response) => {
          persistAuthSession("", response.data.access_token);
          pushToast("Login successful. Welcome back.", "success");
          router.push("/dashboard");
        })
        .catch((error: unknown) => {
          setState("error");
          const message = getFormErrorMessage(error, "Invalid or expired magic link", {});
          setErrorMessage(message);

          const apiError = error as import("@/lib/api").ApiError;
          pushToast(message, "error", {
            aiDetails: apiError?.aiDetails,
            suggestions: apiError?.suggestions,
          });
        });
      params.delete("magic_token");
      const nextSearch = params.toString();
      window.history.replaceState(null, "", `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`);
    }
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
  }, [pushToast, router]);

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

  function validatePasswordlessTarget() {
    const target = passwordlessTarget;
    if (otpChannel === "email" && (!target || !EMAIL_PATTERN.test(target))) {
      const nextErrors = { email: "Enter a valid email address." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
      return "";
    }
    if (otpChannel === "whatsapp" && !isValidPhoneNumber(target)) {
      const nextErrors = { phone: "Enter a valid WhatsApp number." };
      setPasswordlessStep("delivery");
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
      return "";
    }
    return target;
  }

  function handlePasswordlessError(error: unknown, fallback: string) {
    setState("error");
    const nextErrors = getApiFieldErrors(error, PASSWORDLESS_FIELDS);
    setPasswordlessFieldErrors(nextErrors);
    const message = getFormErrorMessage(error, fallback, nextErrors);
    setErrorMessage(message);

    const apiError = error as import("@/lib/api").ApiError;
    pushToast(message, "error", {
      aiDetails: apiError?.aiDetails,
      suggestions: apiError?.suggestions,
    });
  }

  function handlePasswordlessCheck(event: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const target = validatePasswordlessTarget();
    if (!target) return;

    if (otpChannel === "email") setPasswordlessEmail(target);
    if (otpChannel === "whatsapp") setPasswordlessPhone(target);
    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    checkPasswordlessIdentity(otpChannel, target)
      .then(() => {
        setPasswordlessStep("confirm");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Unable to continue passwordless login"))
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handlePasswordlessStart(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const target = validatePasswordlessTarget();
    if (!target) return;

    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    startPasswordless(otpChannel, target)
      .then((response) => {
        const nextStep = response.data.next_step;
        setPasswordlessStep(nextStep === "magic_link" ? "link" : "code");
        pushToast("Check your messages.", "success");
      })
      .catch((error: unknown) => handlePasswordlessError(error, "Unable to continue passwordless login"))
      .finally(() => setState((current) => (current === "loading" ? "idle" : current)));
  }

  function handleOTPVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      const nextErrors = { otp: "Enter the 6-digit OTP code." };
      setState("error");
      setPasswordlessFieldErrors(nextErrors);
      setErrorMessage("Please fix the highlighted fields.");
      pushToast("Please fix the highlighted fields.", "error");
      return;
    }

    setState("loading");
    setErrorMessage("");
    setPasswordlessFieldErrors({});
    const target = passwordlessTarget;
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
      .catch((error: unknown) => handlePasswordlessError(error, "Invalid or expired OTP"));
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
        {(["password", "passwordless"] as const).map((mode) => {
          const isActive = authMode === mode;
          return (
          <button
            key={mode}
            type="button"
            onClick={() => {
              setAuthMode(mode);
              if (mode === "passwordless") setPasswordlessStep("delivery");
              setState("idle");
              setErrorMessage("");
            }}
            className={isActive ? "rounded-md bg-white/[0.12] px-3 py-2 text-sm font-semibold text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" : "rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"}
          >
            {mode === "password" ? "Password" : "Passwordless"}
          </button>
          );
        })}
      </div>

      <div className="mt-4 min-h-[18rem]">
        {authMode === "password" ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="space-y-4">
          {passwordlessStep === "delivery" ? (
            <form className="space-y-4" onSubmit={handlePasswordlessCheck}>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["whatsapp", "email"] as const).map((channel) => {
                  const isActive = otpChannel === channel;
                  const Icon = channel === "whatsapp" ? WhatsAppIcon : MailIcon;
                  return (
                    <button
                      key={channel}
                      type="button"
                      aria-label={channel === "whatsapp" ? "Use WhatsApp" : "Use email"}
                      onClick={() => {
                        setOtpChannel(channel);
                        setOtp("");
                        setErrorMessage("");
                        setState("idle");
                      }}
                      className={isActive ? "flex h-20 items-center justify-center rounded-lg border border-primary/70 bg-primary/10 text-foreground shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70" : "flex h-20 items-center justify-center rounded-lg border border-border/60 bg-background/30 text-muted-foreground transition hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70"}
                    >
                      <Icon size="lg" />
                    </button>
                  );
                })}
              </div>
              {otpChannel === "email" ? (
                <div className="space-y-2">
                  <Label htmlFor="passwordless-email">Email</Label>
                  <Input
                    id="passwordless-email"
                    type="email"
                    value={passwordlessEmail}
                    onChange={(event) => {
                      setPasswordlessEmail(event.target.value);
                      setPasswordlessFieldErrors((current) => ({ ...current, email: undefined }));
                      setOtp("");
                      setErrorMessage("");
                    }}
                    placeholder="name@example.com"
                    error={passwordlessFieldErrors.email}
                  />
                </div>
              ) : (
                <PhoneNumberInput
                  id="passwordless-phone"
                  label="WhatsApp number"
                  value={passwordlessPhone}
                  onChange={(value) => {
                    setPasswordlessPhone(value);
                    setPasswordlessFieldErrors((current) => ({ ...current, phone: undefined }));
                    setOtp("");
                    setErrorMessage("");
                  }}
                  error={passwordlessFieldErrors.phone}
                />
              )}
              <Button type="submit" disabled={state === "loading"} className="w-full shadow-lg shadow-primary/20">
                {state === "loading" ? <LoginLoadingIndicator label="Checking" /> : "Continue"}
              </Button>
            </form>
          ) : null}

          {passwordlessStep === "confirm" ? (
            <form className="space-y-4" onSubmit={handlePasswordlessStart}>
              <div className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground">
                We will send a secure sign-in step for <span className="break-all font-semibold">{passwordlessTarget}</span>.
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordlessStep("delivery");
                    setErrorMessage("");
                    setState("idle");
                  }}
                >
                  Back
                </Button>
                <Button type="submit" disabled={state === "loading"} className="shadow-lg shadow-primary/20">
                  {state === "loading" ? <LoginLoadingIndicator label="Sending" /> : "Continue"}
                </Button>
              </div>
            </form>
          ) : null}

          {passwordlessStep === "code" ? (
            <form className="space-y-4" onSubmit={handleOTPVerify}>
              <div className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground">
                Code sent through {otpChannel === "whatsapp" ? "WhatsApp" : "email"} for <span className="break-all font-semibold">{otpChannel === "whatsapp" ? passwordlessPhone : passwordlessEmail}</span>. It expires in 5 minutes.
              </div>
              <div className="space-y-2">
                <Label htmlFor="otp-code">OTP code</Label>
                <Input
                  id="otp-code"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(event) => {
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                    setPasswordlessFieldErrors((current) => ({ ...current, otp: undefined }));
                  }}
                  placeholder="000000"
                  className="h-14 text-center text-2xl tracking-[0.4em]"
                  error={passwordlessFieldErrors.otp}
                />
              </div>
              <label className="flex items-center gap-3 text-sm text-muted-foreground">
                <Checkbox checked={trustedDevice} onChange={(event) => setTrustedDevice(event.target.checked)} />
                Trust this device
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setPasswordlessStep("delivery");
                    setOtp("");
                    setErrorMessage("");
                    setState("idle");
                  }}
                >
                  Back
                </Button>
                <Button type="submit" disabled={state === "loading"} className="shadow-lg shadow-primary/20">
                  {state === "loading" ? <LoginLoadingIndicator label="Verifying" /> : "Verify OTP"}
                </Button>
              </div>
              <button
                type="button"
                className="w-full text-center text-sm font-medium text-primary hover:opacity-80"
                disabled={state === "loading"}
                onClick={() => handlePasswordlessStart()}
              >
                Did not receive it? Send again
              </button>
            </form>
          ) : null}

          {passwordlessStep === "link" ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-foreground">
                A secure sign-in link has been sent. Open it on this device to continue.
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setPasswordlessStep("delivery");
                  setErrorMessage("");
                  setState("idle");
                }}
              >
                Back
              </Button>
            </div>
          ) : null}
          </div>
        )}
      </div>

      <SocialAuthButtons
        mode="login"
        compact
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

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {errorMessage}
        </div>
      ) : null}
    </AuthShell>
  );
}
