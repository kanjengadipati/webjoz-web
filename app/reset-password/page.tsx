"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { resetPassword } from "@/lib/api";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      setToken(params.get("token") || "");
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) {
      const nextMessage = "Reset token is missing from the URL.";
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
      return;
    }
    if (password !== confirmPassword) {
      const nextMessage = "Passwords do not match.";
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      await resetPassword(token, password);
      pushToast("Password updated successfully.", "success");
      router.push("/login?reset=success");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Failed to reset password";
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
    }
  }

  return (
    <AuthShell
      badge="Reset Password"
      title="Set a new password using the token issued by the backend."
      description="This page consumes the password reset token from the email link and submits the new password directly to the Go API."
      stats={[
        { label: "Token Source", value: "URL Query", helper: "The backend email links here with a `token` query parameter." },
        { label: "Validation", value: "Backend-first", helper: "Expired or invalid tokens are rejected by the API." },
      ]}
      cardEyebrow="Recovery"
      cardTitle="Choose a New Password"
      cardDescription={token ? "Enter your new password to complete the reset flow." : "Open this page from the password reset email so the token is included."}
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Back to login</Link>
          <Link href="/forgot-password" className="font-medium text-primary hover:opacity-80">Request another reset link</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm New Password</Label>
          <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        <Button type="submit" disabled={state === "loading" || !token} className="w-full">
          {state === "loading" ? "Updating password..." : "Update Password"}
        </Button>
      </form>
      {message ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{message}</div> : null}
    </AuthShell>
  );
}
