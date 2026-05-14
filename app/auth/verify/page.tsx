"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { verifyEmail } from "@/lib/api";

export default function VerifyEmailPage() {
  const { pushToast } = useToast();
  const [token, setToken] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Open this page from your verification email so the token is included in the URL.");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const nextToken = params.get("token") || "";
      const nextEmail = params.get("email") || "";
      setToken(nextToken);

      if (nextToken) {
        setState("loading");
        setMessage("Verifying your email with the backend...");
        return;
      }

      if (nextEmail) {
        setMessage(`A verification email was sent to ${nextEmail}. Open the link in that email to complete verification.`);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!token) return;
    let active = true;

    async function runVerification() {
      try {
        await verifyEmail(token);
        if (!active) return;
        setState("success");
        setMessage("Email verified successfully. You can sign in now.");
        pushToast("Email verified successfully.", "success");
      } catch (error) {
        if (!active) return;
        const nextMessage = error instanceof Error ? error.message : "Failed to verify email";
        setState("error");
        setMessage(nextMessage);
        pushToast(nextMessage, "error");
      }
    }

    void runVerification();
    return () => {
      active = false;
    };
  }, [pushToast, token]);

  return (
    <AuthShell
      badge="Verify Email"
      title="Complete email verification through the backend token flow."
      description="The Go auth service issues verification tokens, and this page consumes the token from the email link so users can finish onboarding in the dashboard frontend."
      stats={[
        { label: "Verification", value: token ? "Token Present" : "Awaiting Link", helper: "This page reacts to the backend-issued `token` query param." },
        { label: "After Verify", value: "Sign In", helper: "Once verified, the existing login flow should work normally." },
      ]}
      cardEyebrow="Email Verification"
      cardTitle={state === "success" ? "Verified" : state === "error" ? "Verification Failed" : "Check Your Inbox"}
      cardDescription="Use the email link from the backend to verify the account before signing in."
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Back to login</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">Create another account</Link>
        </div>
      }
    >
      <div className="space-y-4">
        <div className={`rounded-2xl border px-4 py-4 text-sm leading-7 ${
          state === "success"
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
            : state === "error"
              ? "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200"
              : "border-border/70 bg-muted/35 text-muted-foreground"
        }`}>
          {message}
        </div>

        <div className="flex flex-wrap gap-3">
          <Link href="/login">
            <Button variant={state === "success" ? "default" : "outline"}>Go to Login</Button>
          </Link>
          <Link href="/forgot-password">
            <Button variant="outline">Forgot Password</Button>
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}
