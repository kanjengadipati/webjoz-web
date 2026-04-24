"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { login } from "@/lib/api";
import { persistAuthSession, useStoredEmail } from "@/lib/auth-store";

export default function LoginPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const storedEmail = useStoredEmail();
  const [email, setEmail] = useState(storedEmail);
  const [password, setPassword] = useState("admin123");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reset") === "success") {
      pushToast("Password updated. You can sign in now.", "success");
    }
  }, [pushToast]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMessage("");

    try {
      const response = await login(email, password);
      persistAuthSession(email, response.data?.access_token || "", response.data?.refresh_token || "");
      pushToast("Login successful. Welcome to the live demo.", "success");
      router.push("/dashboard");
    } catch (error) {
      setState("error");
      const message = error instanceof Error ? error.message : "Login failed";
      setErrorMessage(message);
      pushToast(message, "error");
    }
  }

  return (
    <AuthShell
      badge="Admin Login"
      title="Sign into the polished demo layer sitting on top of your auth API."
      description="Sign in with the seeded admin account to explore the logs feed, AI investigation workflow, active sessions, and user management endpoints through a polished dashboard."
      stats={[
        { label: "Default Email", value: "admin@mail.com" },
        { label: "Default Password", value: "admin123" },
      ]}
      cardEyebrow="Live Auth"
      cardTitle="Sign In"
      cardDescription="Use the seeded account to unlock the dashboard and test the backend in a realistic flow."
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/" className="font-medium text-primary hover:opacity-80">Back to overview</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">Create account</Link>
          <Link href="/forgot-password" className="font-medium text-primary hover:opacity-80">Forgot password</Link>
          <Link href="/auth/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="admin@mail.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full">
          {state === "loading" ? "Signing in..." : "Enter Dashboard"}
        </Button>
      </form>
      {errorMessage ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{errorMessage}</div> : null}
    </AuthShell>
  );
}
