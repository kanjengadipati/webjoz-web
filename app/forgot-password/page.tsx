"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setMessage("");

    try {
      await forgotPassword(email);
      setState("success");
      setMessage("Reset link sent. Check your email for the password reset link.");
      pushToast("Reset link sent.", "success");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "Failed to send reset link";
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
    }
  }

  return (
    <AuthShell
      badge="Password Recovery"
      title="Start the backend password reset flow from the dashboard frontend."
      description="Submit your email and the Go API will issue the reset token and email link through its existing forgot-password flow."
      stats={[
        { label: "Delivery", value: "Email Link", helper: "The backend sends a reset link to the email address you submit." },
        { label: "Reset Route", value: "/reset-password", helper: "The emailed link lands on the dashboard reset page." },
      ]}
      cardEyebrow="Recovery"
      cardTitle="Forgot Password"
      cardDescription="Enter your account email to request a password reset link."
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Back to login</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">Create account</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@mail.com" />
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full">
          {state === "loading" ? "Sending link..." : "Send Reset Link"}
        </Button>
      </form>
      {message ? (
        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${state === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200" : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-200"}`}>
          {message}
        </div>
      ) : null}
    </AuthShell>
  );
}
