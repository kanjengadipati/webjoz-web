"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { AuthShell } from "@/components/auth-shell";
import { buttonClassName } from "@/components/ui";
import { verifyEmail } from "@/lib/api";

export default function VerifyEmailPage() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const verifiedRef = useRef(false);

  useEffect(() => {
    // Prevent double verification in StrictMode
    if (verifiedRef.current) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const email = params.get("email");

      if (!token) {
        setState("idle");
        setMessage(
          email
            ? `A verification email was sent to ${email}. Open the link in that email to complete verification.`
            : "Open this page from your verification email so the token is included in the URL.",
        );
        return;
      }

      verifiedRef.current = true;
      setState("loading");

      verifyEmail(token)
        .then(() => {
          setState("success");
          setMessage("Your email has been successfully verified! You can now log in.");
        })
        .catch((error) => {
          setState("error");
          setMessage(error instanceof Error ? error.message : "Failed to verify email. The link might be expired or invalid.");
        });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <AuthShell
      badge="Account Verification"
      title="Verifying your email address."
      description="This page verifies your email using the token provided in the link sent to your inbox."
      stats={[
        { label: "Token Source", value: "URL Query", helper: "The backend email link includes a unique `token` parameter." },
        { label: "Status", value: "Real-time Validation", helper: "Tokens are validated instantly upon page load." },
      ]}
      cardEyebrow="Verification"
      cardTitle="Email Verification"
      cardDescription={state === "idle" ? "Check your inbox for the verification link." : "Validating your unique secure token..."}
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Proceed to login</Link>
          <Link href="/" className="font-medium text-primary hover:opacity-80">Back to home</Link>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        {state === "loading" ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-primary motion-safe:animate-spin" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Verifying your token...</p>
          </div>
        ) : state === "idle" ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-sm font-medium leading-7 text-muted-foreground">
              {message}
            </div>
            <Link
              href="/login"
              className={buttonClassName({ className: "mt-2 px-8", variant: "outline", size: "default" })}
            >
              Back to Login
            </Link>
          </div>
        ) : state === "success" ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-emerald-500" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Success!</h3>
              <p className="text-sm font-medium text-muted-foreground">{message}</p>
            </div>
            <Link
              href="/login?verified=true"
              className={buttonClassName({ className: "mt-4 px-8 bg-white !text-zinc-950 hover:bg-white/90 dark:!text-zinc-950", size: "default" })}
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-rose-500" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">Verification Failed</h3>
              <p className="text-sm font-medium text-muted-foreground">{message}</p>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
