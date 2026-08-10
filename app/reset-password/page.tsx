"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { resetPassword } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { pushToast } = useToast();
  const { t } = useI18n();
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
      const nextMessage = t("auth.errorResetTokenMissing");
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
      return;
    }
    if (password !== confirmPassword) {
      const nextMessage = t("auth.errorPasswordMismatch");
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
      return;
    }

    setState("loading");
    setMessage("");

    try {
      await resetPassword(token, password);
      pushToast(t("auth.toastResetSuccess"), "success");
      router.push("/login?reset=success");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : t("auth.errorResetFailed");
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
    }
  }

  return (
    <AuthShell
      badge={t("auth.resetBadge")}
      title={t("auth.resetTitle")}
      description={t("auth.resetDesc")}
      stats={[
        { label: t("auth.resetStat1Label"), value: t("auth.resetStat1Value"), helper: t("auth.resetStat1Helper") },
        { label: t("auth.resetStat2Label"), value: t("auth.resetStat2Value"), helper: t("auth.resetStat2Helper") },
      ]}
      cardEyebrow={t("auth.resetCardEyebrow")}
      cardTitle={t("auth.resetCardTitle")}
      cardDescription={token ? t("auth.resetCardDesc") : t("auth.resetCardDescNoToken")}
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">{t("auth.resetFooterLogin")}</Link>
          <Link href="/forgot-password" className="font-medium text-primary hover:opacity-80">{t("auth.resetFooterRequest")}</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.resetNewPassword")}</Label>
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder={t("auth.resetNewPasswordPlaceholder")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">{t("auth.resetConfirmPassword")}</Label>
          <Input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
        </div>
        <Button type="submit" disabled={state === "loading" || !token} className="w-full">
          {state === "loading" ? t("auth.resetUpdating") : t("auth.resetUpdate")}
        </Button>
      </form>
      {message ? <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-200">{message}</div> : null}
    </AuthShell>
  );
}
