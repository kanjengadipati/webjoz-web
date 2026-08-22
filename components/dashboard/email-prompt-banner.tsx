"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { getLinkedMethods, updateEmail } from "@/lib/api/auth";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const DISMISS_KEY = "webjoz_email_prompt_dismissed";
const REDISMISS_DAYS = 7;

function wasDismissedRecently(): boolean {
  try {
    const val = localStorage.getItem(DISMISS_KEY);
    if (!val) return false;
    const dismissedAt = new Date(val).getTime();
    const daysSince = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);
    return daysSince < REDISMISS_DAYS;
  } catch {
    return false;
  }
}

export function EmailPromptBanner({ className }: { className?: string }) {
  const { t } = useI18n();
  const { pushToast } = useToast();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (wasDismissedRecently()) return;
    getLinkedMethods()
      .then((res) => {
        if (res.data.is_synthetic_email) {
          setVisible(true);
          setEmail("");
        }
      })
      .catch(() => {});
  }, []);

  const handleDismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, new Date().toISOString());
    setVisible(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSaving(true);
    try {
      await updateEmail(email);
      pushToast(t("dashboard.emailPrompt.emailUpdated"), "success");
      setVisible(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.emailPrompt.emailUpdateFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [email, pushToast, t]);

  if (!visible) return null;

  return (
    <div className={cn(
      "rounded-lg border border-amber-200 bg-amber-50 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3",
      className
    )}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-amber-900">
          {t("dashboard.emailPrompt.title")}
        </p>
        <p className="text-xs text-amber-700 mt-1">
          {t("dashboard.emailPrompt.description")}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 shrink-0">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="text-sm rounded-md border border-amber-300 px-3 py-1.5 w-56 focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <Button type="submit" size="sm" disabled={saving || !email}>
          {t("dashboard.emailPrompt.save")}
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={handleDismiss}>
          {t("dashboard.emailPrompt.dismiss")}
        </Button>
      </form>
    </div>
  );
}
