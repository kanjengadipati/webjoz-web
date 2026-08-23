"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Card, CardContent, CardHeader, Input, Label } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useAuthToken } from "@/lib/auth-store";
import { getLinkedMethods, setPassword, unlinkGoogle, updateEmail } from "@/lib/api/auth";
import { GOOGLE_CLIENT_ID, SOCIAL_ACTIVE_PROVIDERS } from "@/lib/config";
import { useI18n } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";
import type { LinkedMethods } from "@/lib/api/auth";

export function LinkAccountCard({ className }: { className?: string }) {
  const token = useAuthToken();
  const { t } = useI18n();
  const { pushToast } = useToast();
  const searchParams = useSearchParams();
  const [methods, setMethods] = useState<LinkedMethods | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPasswordValue] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showUnlinkPassword, setShowUnlinkPassword] = useState(false);
  const [email, setEmailValue] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getLinkedMethods(token || undefined);
      setMethods(res.data);
      setEmailValue(res.data.email || "");
    } catch {
      pushToast(t("dashboard.linkAccount.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  }, [token, pushToast, t]);

  useEffect(() => {
    load();
  }, [load]);

  // Handle Google OAuth redirect callbacks (success / failure)
  useEffect(() => {
    const error = searchParams?.get("error");
    const success = typeof window !== "undefined"
      ? sessionStorage.getItem("webjoz_google_link_success")
      : null;

    if (success) {
      sessionStorage.removeItem("webjoz_google_link_success");
      pushToast(t("dashboard.linkAccount.googleLinked"), "success");
      load();
    } else if (error === "link_google_failed") {
      pushToast(t("dashboard.linkAccount.googleLinkFailed"), "error");
      // Remove ?error= from URL without re-navigating
      if (typeof window !== "undefined" && window.history?.replaceState) {
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        window.history.replaceState(null, "", url.toString());
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetPassword = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) return;
    // If user already has password, require current password
    if (methods?.has_password && !currentPassword) return;
    setSaving(true);
    try {
      await setPassword(newPassword, token || undefined, methods?.has_password ? currentPassword : undefined);
      pushToast(t("dashboard.linkAccount.passwordSetSuccess"), "success");
      setNewPassword("");
      setCurrentPassword("");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.passwordSetFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [newPassword, currentPassword, methods, token, load, pushToast, t]);

  const handleLinkGoogle = useCallback(() => {
    if (!GOOGLE_CLIENT_ID) {
      pushToast(t("dashboard.linkAccount.googleClientMissing"), "error");
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("webjoz_google_link_mode", "true");
      sessionStorage.setItem("webjoz_google_return_to", "/dashboard/settings");
    }

    const redirectUri = window.location.origin;
    const nonceArray = new Uint8Array(32);
    crypto.getRandomValues(nonceArray);
    const nonce = Array.from(nonceArray, b => b.toString(16).padStart(2, "0")).join("");
    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=openid%20email%20profile` +
      `&nonce=${nonce}` +
      `&prompt=consent`;

    window.location.href = googleAuthUrl;
  }, [pushToast, t]);

  const handleUnlinkGoogle = useCallback(async () => {
    if (!password) {
      pushToast(t("dashboard.linkAccount.enterPassword"), "error");
      return;
    }
    setSaving(true);
    try {
      await unlinkGoogle(password, token || undefined);
      pushToast(t("dashboard.linkAccount.googleUnlinked"), "success");
      setPasswordValue("");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.googleUnlinkFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [password, token, load, pushToast, t]);

  const handleUpdateEmail = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email === methods?.email) return;
    setSaving(true);
    try {
      await updateEmail(email, token || undefined);
      pushToast(t("dashboard.linkAccount.emailUpdated"), "success");
      await load();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("dashboard.linkAccount.emailUpdateFailed");
      pushToast(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [email, methods, token, load, pushToast, t]);

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
      <CardHeader className="border-b border-border/60">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("dashboard.settings.profileEyebrow")}
          </div>
          <h3 className="text-lg font-bold tracking-tight">{t("dashboard.linkAccount.title")}</h3>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">

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
            <div className="space-y-2">
              <span className="text-sm text-green-600">{t("dashboard.linkAccount.passwordSet")}</span>
              <form onSubmit={handleSetPassword} className="flex flex-col gap-2">
                <div className="relative">
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder={t("dashboard.linkAccount.currentPassword")}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="flex-1 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    )}
                  </button>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="password"
                    placeholder={t("dashboard.linkAccount.minChars")}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={saving || newPassword.length < 8 || !currentPassword} size="sm">
                    {t("dashboard.linkAccount.setPassword")}
                  </Button>
                </div>
              </form>
            </div>
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
                  <div className="relative">
                    <Input
                      type={showUnlinkPassword ? "text" : "password"}
                      placeholder={t("dashboard.linkAccount.confirmPassword")}
                      value={password}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      className="w-48 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowUnlinkPassword(!showUnlinkPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showUnlinkPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      )}
                    </button>
                  </div>
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
              <Button variant="outline" size="sm" onClick={handleLinkGoogle}>
                {t("dashboard.linkAccount.linkGoogle")}
              </Button>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
