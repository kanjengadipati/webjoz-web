"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { AuthShell } from "@/components/auth-shell";
import { buttonClassName } from "webjoz-ui";
import { unsubscribeEmail, resubscribeEmail } from "@/lib/api";
import { useI18n } from "@/lib/i18n/context";

type UnsubState = "idle" | "loading" | "success" | "error" | "undoing";

export default function UnsubscribeEmailPage() {
  const { t } = useI18n();
  const [state, setState] = useState<UnsubState>("idle");
  const [message, setMessage] = useState("");
  const [undoFailed, setUndoFailed] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing in StrictMode
    if (processedRef.current) return;

    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setState("idle");
        setMessage(t("auth.unsubNoToken"));
        return;
      }

      processedRef.current = true;
      tokenRef.current = token;
      setState("loading");

      unsubscribeEmail(token)
        .then(() => {
          setState("success");
          setMessage(t("auth.unsubDone"));
        })
        .catch((error) => {
          setState("error");
          setMessage(error instanceof Error ? error.message : t("auth.errorUnsubFailed"));
        });
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  const handleUndo = () => {
    const token = tokenRef.current;
    if (!token || state === "undoing") return;

    setUndoFailed(false);
    setState("undoing");
    resubscribeEmail(token)
      .then(() => {
        setState("idle");
        setMessage(t("auth.unsubUndoDone"));
      })
      .catch(() => {
        setUndoFailed(true);
        setState("success");
        setMessage(t("auth.unsubDone"));
      });
  };

  return (
    <AuthShell
      badge={t("auth.unsubBadge")}
      title={t("auth.unsubTitle")}
      description={t("auth.unsubDesc")}
      stats={[
        { label: t("auth.unsubStat1Label"), value: t("auth.unsubStat1Value"), helper: t("auth.unsubStat1Helper") },
        { label: t("auth.unsubStat2Label"), value: t("auth.unsubStat2Value"), helper: t("auth.unsubStat2Helper") },
      ]}
      cardEyebrow={t("auth.unsubCardEyebrow")}
      cardTitle={t("auth.unsubCardTitle")}
      cardDescription={state === "idle" ? t("auth.unsubCardIdle") : t("auth.unsubCardLoading")}
      footer={
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
          <Link href="/" className="font-medium text-primary hover:opacity-80">{t("auth.unsubFooterHome")}</Link>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center space-y-6 py-8">
        {state === "loading" || state === "undoing" ? (
          <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-primary motion-safe:animate-spin" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            <p className="text-sm font-medium text-muted-foreground animate-pulse">
              {state === "undoing" ? t("auth.unsubUndoing") : t("auth.unsubLoadingSpinner")}
            </p>
          </div>
        ) : state === "idle" ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <div className="rounded-2xl border border-border/70 bg-muted/35 px-4 py-4 text-sm font-medium leading-7 text-muted-foreground">
              {message || t("auth.unsubCardIdle")}
            </div>
            <Link
              href="/"
              className={buttonClassName({ className: "mt-2 px-8", variant: "outline", size: "default" })}
            >
              {t("auth.unsubFooterHome")}
            </Link>
          </div>
        ) : state === "success" ? (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-emerald-500" aria-hidden="true">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{t("auth.unsubSuccessTitle")}</h3>
              <p className="text-sm font-medium text-muted-foreground">{message}</p>
            </div>
            <p className="max-w-sm text-xs leading-6 text-muted-foreground/80">{t("auth.unsubNote")}</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleUndo}
                className={buttonClassName({ className: "mt-2 px-8", variant: "outline", size: "default" })}
              >
                {t("auth.unsubUndo")}
              </button>
              <Link
                href="/login"
                className={buttonClassName({ className: "mt-2 px-8 bg-white !text-zinc-950 hover:bg-white/90 dark:!text-zinc-950", size: "default" })}
              >
                {t("auth.verifyGoToLogin")}
              </Link>
            </div>
            {undoFailed ? (
              <p className="max-w-sm text-xs leading-6 text-rose-600 dark:text-rose-400">{t("auth.unsubUndoFailed")}</p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center animate-in fade-in zoom-in duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-16 text-rose-500" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-rose-600 dark:text-rose-400">{t("auth.unsubFailedTitle")}</h3>
              <p className="text-sm font-medium text-muted-foreground">{message}</p>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
