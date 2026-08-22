"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth-shell";
import { Button, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { forgotPassword } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";

export default function ForgotPasswordPage() {
  const { pushToast } = useToast();
  const { t } = useI18n();
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
      setMessage(t("auth.forgotSentSuccess"));
      pushToast(t("auth.forgotSentToast"), "success");
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : t("auth.errorForgotSend");
      setState("error");
      setMessage(nextMessage);
      pushToast(nextMessage, "error");
    }
  }

  return (
    <AuthShell
      badge={t("auth.forgotBadge")}
      title={t("auth.forgotTitle")}
      description={t("auth.forgotDesc")}
      stats={[
        { label: t("auth.forgotStat1Label"), value: t("auth.forgotStat1Value"), helper: t("auth.forgotStat1Helper") },
        { label: t("auth.forgotStat2Label"), value: t("auth.forgotStat2Value"), helper: t("auth.forgotStat2Helper") },
      ]}
      cardTitle={t("auth.forgotCardTitle")}
      cardDescription={t("auth.forgotCardDesc")}
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/login" className="font-medium text-primary hover:opacity-80">{t("auth.forgotFooterLogin")}</Link>
          <Link href="/register" className="font-medium text-primary hover:opacity-80">{t("auth.forgotFooterRegister")}</Link>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.forgotEmail")}</Label>
          <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("auth.forgotEmailPlaceholder")} />
        </div>
        <Button type="submit" disabled={state === "loading"} className="w-full">
          {state === "loading" ? t("auth.forgotSending") : t("auth.forgotSubmit")}
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
