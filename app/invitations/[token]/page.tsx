"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthToken, useAuthReady, persistAuthSession } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { acceptInvitationRegister, fetchInvitation } from "@/lib/api";
import { Button, Input, Label } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

type PageStatus = "loading" | "form" | "accepting" | "success" | "error";

function getErrorMessage(err: unknown, fallback: string) {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}

export default function AcceptInvitationPage() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const authReady = useAuthReady();
  const authToken = useAuthToken();
  const [status, setStatus] = useState<PageStatus>("loading");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (authToken) {
      (async () => {
        try {
          await request(`/invitations/${token}/accept`, {
            method: "POST",
          }, authToken);
          setStatus("success");
          setMessage(t("auth.inviteSuccess"));
        } catch (err: unknown) {
          setStatus("error");
          setMessage(getErrorMessage(err, t("auth.inviteFailedTitle")));
        }
      })();
      return;
    }

    (async () => {
      try {
        const info = await fetchInvitation(token);
        setEmail(info.data.email);
        setStatus("form");
      } catch (err: unknown) {
        setStatus("error");
        setMessage(getErrorMessage(err, t("auth.inviteFailedTitle")));
      }
    })();
  }, [authReady, authToken, token, t]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("accepting");
    setMessage("");
    setEmailTaken(false);
    try {
      const res = await acceptInvitationRegister(token, name, password);
      persistAuthSession(email, res.data.access_token);
      setStatus("success");
      setMessage(t("auth.inviteSuccess"));
    } catch (err: unknown) {
      setStatus("error");
      const apiErr = err as { code?: string; message?: string } | null;
      if (apiErr?.code === "AUTH_EMAIL_TAKEN" || String(apiErr?.message || "").toLowerCase().includes("already")) {
        setEmailTaken(true);
        setMessage(t("auth.inviteAlreadyRegistered"));
      } else {
        setMessage(getErrorMessage(err, t("auth.inviteFailedTitle")));
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl border bg-card text-center space-y-4">
        {status === "loading" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">{t("auth.inviteProcessing")}</p>
          </>
        )}

        {status === "form" && (
          <>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Mail className="w-5 h-5" />
              <p className="text-sm font-medium">{email}</p>
            </div>
            <h1 className="text-lg font-bold">{t("auth.inviteRegisterTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("auth.inviteRegisterDesc")}</p>
            <form className="space-y-4 text-left" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="inv-name">{t("auth.inviteRegisterNameLabel")}</Label>
                <Input
                  id="inv-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.inviteRegisterNamePlaceholder")}
                  required
                  minLength={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inv-password">{t("auth.inviteRegisterPasswordLabel")}</Label>
                <Input
                  id="inv-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.inviteRegisterPasswordHint")}
                  required
                  minLength={8}
                />
                <p className="text-xs text-muted-foreground">{t("auth.inviteRegisterPasswordHint")}</p>
              </div>
              {message && (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
                  {message}
                </div>
              )}
              <Button type="submit" className="w-full">{t("auth.inviteRegisterButton")}</Button>
            </form>
            <button
              type="button"
              onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/invitations/${token}`)}`)}
              className="block w-full text-center text-sm font-medium text-primary hover:opacity-80 transition"
            >
              {t("auth.inviteExistingAccount")}
            </button>
          </>
        )}

        {status === "accepting" && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
            <p className="text-sm text-muted-foreground">{t("auth.inviteRegisterLoading")}</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-10 h-10 text-green-500 mx-auto" />
            <h1 className="text-lg font-bold">{message}</h1>
            <p className="text-sm text-muted-foreground">{t("auth.inviteSuccessDesc")}</p>
            <Button onClick={() => router.push("/dashboard")}>{t("auth.inviteDashboard")}</Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-10 h-10 text-red-500 mx-auto" />
            <h1 className="text-lg font-bold">{t("auth.inviteFailedTitle")}</h1>
            <p className="text-sm text-muted-foreground">{message}</p>
            {emailTaken ? (
              <Button variant="outline" onClick={() => router.push(`/login?redirect=${encodeURIComponent(`/invitations/${token}`)}`)}>
                {t("auth.inviteBackToLogin")}
              </Button>
            ) : (
              <Button variant="outline" onClick={() => router.push("/login")}>{t("auth.inviteBackToLogin")}</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}