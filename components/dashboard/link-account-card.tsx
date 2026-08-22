"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardContent, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { getLinkedMethods, setPassword, linkGoogle, unlinkGoogle, updateEmail } from "@/lib/api/auth";
import { GOOGLE_CLIENT_ID, SOCIAL_ACTIVE_PROVIDERS } from "@/lib/config";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { LinkedMethods } from "@/lib/api/auth";

declare global {
  interface Window {
    google?: { accounts: { id: { initialize: (opts: Record<string, unknown>) => void; renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void } } };
  }
}

export function LinkAccountCard({ className }: { className?: string }) {
  const { t } = useI18n();
  const { pushToast } = useToast();
  const [methods, setMethods] = useState<LinkedMethods | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPasswordValue] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmailValue] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await getLinkedMethods();
      setMethods(res.data);
      setEmailValue(res.data.email || "");
    } catch {
      pushToast(t("dashboard.linkAccount.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [pushToast, t]);

  useEffect(() => { load(); }, [load]);

  const handleSetPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return;
    setSaving(true);
    try {
      await setPassword(newPassword);
      pushToast(t("dashboard.linkAccount.passwordSetSuccess"), "success");
      setNewPassword("");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.passwordSetFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [newPassword, load, pushToast, t]);

  const handleLinkGoogle = useCallback(async () => {
    if (!window.google) {
      pushToast(t("dashboard.linkAccount.googleNotLoaded"), "error");
      return;
    }
    setGoogleLoading(true);
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: { credential?: string }) => {
          if (!response.credential) {
            setGoogleLoading(false);
            return;
          }
          try {
            await linkGoogle(response.credential);
            pushToast(t("dashboard.linkAccount.googleLinked"), "success");
            await load();
          } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.googleLinkFailed");
            pushToast(msg, "error");
          } finally {
            setGoogleLoading(false);
          }
        },
      });
      const container = document.getElementById("google-link-btn");
      if (container) {
        window.google.accounts.id.renderButton(container, { theme: "outline", size: "large", text: "continue_with" });
        container.querySelector<HTMLElement>("button")?.click();
      }
    } catch {
      setGoogleLoading(false);
      pushToast(t("dashboard.linkAccount.googleInitFailed"), "error");
    }
  }, [load, pushToast, t]);

  const handleUnlinkGoogle = useCallback(async () => {
    if (!password) {
      pushToast(t("dashboard.linkAccount.enterPassword"), "error");
      return;
    }
    setSaving(true);
    try {
      await unlinkGoogle(password);
      pushToast(t("dashboard.linkAccount.googleUnlinked"), "success");
      setPasswordValue("");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.googleUnlinkFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [password, load, pushToast, t]);

  const handleUpdateEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email === methods?.email) return;
    setSaving(true);
    try {
      await updateEmail(email);
      pushToast(t("dashboard.linkAccount.emailUpdated"), "success");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.emailUpdateFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [email, methods, load, pushToast, t]);

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-6">
          <div className="h-6 w-40 bg-muted rounded mb-4" />
          <div className="h-4 w-full bg-muted rounded mb-2" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!methods) return null;

  return (
    <Card className={className}>
      <CardContent className="p-6 space-y-6">
        <h3 className="text-lg font-semibold">{t("dashboard.linkAccount.title")}</h3>

        {/* Email */}
        <div className="space-y-2">
          <Label>{t("dashboard.linkAccount.emailLabel")}</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{methods.email}</span>
            {methods.is_synthetic_email && (
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded">{t("dashboard.linkAccount.systemGenerated")}</span>
            )}
          </div>
          {methods.is_synthetic_email && (
            <form onSubmit={handleUpdateEmail} className="flex gap-2">
              <Input
                type="email"
                placeholder={t("dashboard.linkAccount.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmailValue(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={saving || !email || email === methods.email} size="sm">
                {t("dashboard.linkAccount.update")}
              </Button>
            </form>
          )}
        </div>

        {/* Phone */}
        {methods.phone_number && (
          <div className="space-y-2">
            <Label>{t("dashboard.linkAccount.phoneLabel")}</Label>
            <span className="text-sm text-muted-foreground">{methods.phone_number}</span>
          </div>
        )}

        {/* Password */}
        <div className="space-y-2">
          <Label>{t("dashboard.linkAccount.passwordLabel")}</Label>
          {methods.has_password ? (
            <span className="text-sm text-green-600">{t("dashboard.linkAccount.passwordSet")}</span>
          ) : (
            <form onSubmit={handleSetPassword} className="flex gap-2">
              <Input
                type="password"
                placeholder={t("dashboard.linkAccount.minChars")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={saving || newPassword.length < 8} size="sm">
                {t("dashboard.linkAccount.setPassword")}
              </Button>
            </form>
          )}
        </div>

        {/* Google */}
        <div className="space-y-2">
          <Label>{t("dashboard.linkAccount.googleLabel")}</Label>
          {methods.has_google ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-green-600">{t("dashboard.linkAccount.linkedStatus")}</span>
              {methods.has_password ? (
                <>
                  <Input
                    type="password"
                    placeholder={t("dashboard.linkAccount.confirmPassword")}
                    value={password}
                    onChange={(e) => setPasswordValue(e.target.value)}
                    className="w-48"
                  />
                  <Button variant="destructive" size="sm" onClick={handleUnlinkGoogle} disabled={saving || !password}>
                    {t("dashboard.linkAccount.unlink")}
                  </Button>
                </>
              ) : (
                <span className="text-xs text-muted-foreground">{t("dashboard.linkAccount.needPasswordToUnlink")}</span>
              )}
            </div>
          ) : (
            SOCIAL_ACTIVE_PROVIDERS.includes("google") && (
              <>
                <div id="google-link-btn" />
                <Button variant="outline" size="sm" onClick={handleLinkGoogle} disabled={googleLoading}>
                  {googleLoading ? t("dashboard.linkAccount.linking") : t("dashboard.linkAccount.linkGoogle")}
                </Button>
              </>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
