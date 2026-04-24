"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, SubtleStat } from "@/components/ui";
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
    <main className="min-h-screen px-6 py-10 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-6">
          <Badge variant="secondary" className="w-fit">Admin Login</Badge>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-tight lg:text-6xl">
            Sign into the polished demo layer sitting on top of your auth API.
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
            Sign in with the seeded admin account to explore the logs feed, AI investigation workflow, active sessions, and user management endpoints through a polished dashboard.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SubtleStat label="Default Email" value="admin@mail.com" />
            <SubtleStat label="Default Password" value="admin123" />
          </div>
        </div>
        <Card className="bg-card/90 backdrop-blur">
          <CardHeader className="border-b border-border/60 bg-gradient-to-br from-background via-background to-primary/8">
            <CardDescription>Live Auth</CardDescription>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Use the seeded account to unlock the dashboard and test the backend in a realistic flow.</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
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
            <div className="mt-6 text-sm text-muted-foreground">
              <Link href="/" className="font-medium text-primary hover:opacity-80">Back to overview</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
