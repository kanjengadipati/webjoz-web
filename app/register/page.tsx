"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { register } from "@/lib/api";
import { SOCIAL_ACTIVE_PROVIDERS } from "@/lib/config";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

const REGISTER_API_FIELDS = ["name", "email", "password"] as const;
type RegisterField = "name" | "email" | "password" | "confirmPassword";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterForm(name: string, email: string, password: string, confirmPassword: string): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {};

  if (!name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, like jane@mail.com.";
  }

  if (!password) {
    errors.password = "Enter a password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (password && password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateRegisterForm(name, email, password, confirmPassword);
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

    try {
      await register(name, email, password);
      pushToast("Account created. Check your email to verify it.", "success");
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setState("error");
      const nextErrors = getApiFieldErrors(error, REGISTER_API_FIELDS);
      setFieldErrors(nextErrors);
      const message = getFormErrorMessage(error, "Registration failed", nextErrors);
      setErrorMessage(message);
      
      const apiError = error as import("@/lib/api").ApiError;
      pushToast(message, "error", {
        aiDetails: apiError?.aiDetails,
        suggestions: apiError?.suggestions,
      });
    }
  }

  const hasGoogle = SOCIAL_ACTIVE_PROVIDERS.includes("google") && !!process.env.NEXT_PUBLIC_SOCIAL_GOOGLE_CLIENT_ID;
  const hasFacebook = SOCIAL_ACTIVE_PROVIDERS.includes("facebook") && !!process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_CLIENT_ID;
  const hasAnySocial = hasGoogle || hasFacebook;

  return (
    <AuthShell
      badge="Register"
      title="Create an account for the same auth backend powering the dashboard."
      description="This form uses the backend registration flow directly, then hands the user into the email verification step before login."
      stats={[
        { label: "Backend Flow", value: "Register", helper: "Creates the user through the Go auth service." },
        { label: "Next Step", value: "Verify Email", helper: "The backend sends a verification link after signup." },
      ]}
      cardEyebrow="Auth Flow"
      cardTitle="Create Account"
      cardDescription="Use the same registration endpoint your backend already exposes."
      footer={
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:gap-x-4">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Back to login</Link>
          <Link href="/auth/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setFieldErrors((current) => ({ ...current, name: undefined }));
            }}
            placeholder="Jane Admin"
            error={fieldErrors.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setFieldErrors((current) => ({ ...current, email: undefined }));
            }}
            placeholder="jane@mail.com"
            error={fieldErrors.email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setFieldErrors((current) => ({ ...current, password: undefined, confirmPassword: undefined }));
            }}
            placeholder="Minimum 8 characters"
            error={fieldErrors.password}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value);
              setFieldErrors((current) => ({ ...current, confirmPassword: undefined }));
            }}
            error={fieldErrors.confirmPassword}
          />
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full shadow-lg shadow-primary/20">
          {state === "loading" ? "Creating account..." : "Create Account"}
        </Button>
      </form>

      {hasAnySocial && (
        <>
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.3em]">
              <span className="bg-card px-3 text-muted-foreground/60">Or signup with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {hasGoogle && (
              <Button variant="outline" disabled aria-label="Google registration unavailable" className="w-full rounded-xl py-5 sm:py-6 opacity-50 cursor-not-allowed grayscale group">
                <svg className="size-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              </Button>
            )}
            {hasFacebook && (
              <Button variant="outline" disabled aria-label="Facebook registration unavailable" className="w-full rounded-xl py-5 sm:py-6 opacity-50 cursor-not-allowed grayscale group">
                <svg className="size-5 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Button>
            )}
          </div>
        </>
      )}
      {errorMessage ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{errorMessage}</div> : null}
    </AuthShell>
  );
}
