"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      pushToast("Passwords do not match", "error");
      return;
    }

    setState("loading");
    setErrorMessage("");

    try {
      await register(name, email, password);
      pushToast("Account created. Check your email to verify it.", "success");
      router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setState("error");
      const message = error instanceof Error ? error.message : "Registration failed";
      setErrorMessage(message);
      pushToast(message, "error");
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
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">Back to login</Link>
          <Link href="/auth/verify" className="font-medium text-primary hover:opacity-80">Verify email</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Jane Admin" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="jane@mail.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Minimum 8 characters" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full">
          {state === "loading" ? "Creating account..." : "Create Account"}
        </Button>
      </form>
      {errorMessage ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{errorMessage}</div> : null}
    </AuthShell>
  );
}
