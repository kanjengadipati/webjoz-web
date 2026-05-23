"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { PhoneNumberInput, isValidPhoneNumber } from "@/components/phone-number-input";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { register } from "@/lib/api";
import { FieldErrors, getApiFieldErrors, getFormErrorMessage, hasFieldErrors } from "@/lib/form-errors";

const REGISTER_API_FIELDS = ["name", "email", "password"] as const;
type RegisterField = "name" | "email" | "phoneNumber" | "password" | "confirmPassword";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateRegisterForm(name: string, email: string, phoneNumber: string, password: string, confirmPassword: string): FieldErrors<RegisterField> {
  const errors: FieldErrors<RegisterField> = {};

  if (!name.trim()) {
    errors.name = "Enter your name.";
  }

  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address, like jane@mail.com.";
  }

  if (phoneNumber.trim() && !isValidPhoneNumber(phoneNumber.trim())) {
    errors.phoneNumber = "Use international format, like +628123456789.";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterField>>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextFieldErrors = validateRegisterForm(name, email, phoneNumber, password, confirmPassword);
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
      await register(name, email, phoneNumber, password);
      pushToast("Account created. Check your email to verify it.", "success");
      router.push(`/verify?email=${encodeURIComponent(email)}`);
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
          <Link href="/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
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
        <PhoneNumberInput
          id="phone-number"
          optional
          value={phoneNumber}
          onChange={(value) => {
            setPhoneNumber(value);
            setFieldErrors((current) => ({ ...current, phoneNumber: undefined }));
          }}
          error={fieldErrors.phoneNumber}
        />
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

      <SocialAuthButtons
        mode="signup"
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
      {errorMessage ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{errorMessage}</div> : null}
    </AuthShell>
  );
}
