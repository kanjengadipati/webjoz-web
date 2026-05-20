"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { login } from "@/lib/api";
import { persistAuthSession, useStoredEmail } from "@/lib/auth-store";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

const LOGIN_FIELDS = ["email", "password"] as const;
type LoginField = (typeof LOGIN_FIELDS)[number];
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

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const storedEmail = useStoredEmail();
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState("");
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
          {state === "loading" ? "Signing in..." : "Enter Dashboard"}
        </Button>
      </form>

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

      {errorMessage ? (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">
          {errorMessage}
        </div>
      ) : null}
    </AuthShell>
  );
}
