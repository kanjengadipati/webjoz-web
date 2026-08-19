"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { fetchMyReferralCode, regenerateMyReferralCode } from "@/lib/api/referral";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { Share2, Copy, RefreshCw, Loader2, Check, ShieldAlert, Award, DollarSign } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function SalesReferralPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t } = useI18n();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const canManage = hasPermission("sales:manage-referral") || role === "superadmin" || role === "admin" || role === "sales";

  const loadReferralCode = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const res = await fetchMyReferralCode(token);
      setReferralCode(res.data?.referral_code || "");
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sales.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && canManage) {
      loadReferralCode();
    }
  }, [token, canManage]);

  const handleCopyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    pushToast(t("dashboard.sales.codeCopied"), "success");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const shareableUrl = typeof window !== "undefined" && referralCode
    ? `${window.location.origin}/create?ref=${referralCode}`
    : "";

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    pushToast(t("dashboard.sales.linkCopied"), "success");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!token) return;
    try {
      setRegenerating(true);
      const res = await regenerateMyReferralCode(token);
      setReferralCode(res.data?.referral_code || "");
      pushToast(t("dashboard.sales.regenerated"), "success");
      setConfirmOpen(false);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.sales.regenerateFailed"), "error");
    } finally {
      setRegenerating(false);
    }
  };

  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">{t("dashboard.sales.loading")}</p>
      </div>
    );
  }

  if (!canManage) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">{t("dashboard.sales.accessDeniedTitle")}</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("dashboard.sales.accessDeniedDesc")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
            <Share2 className="size-5 sm:size-6 text-primary shrink-0" />
            <span>{t("dashboard.sales.pageTitle")}</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {t("dashboard.sales.pageDesc")}
          </p>
        </div>
        <Link href="/dashboard/sales/commissions" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl text-xs sm:text-sm h-10 cursor-pointer">
            <DollarSign className="size-4 text-emerald-500" />
            {t("dashboard.sales.viewCommissions")}
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 min-w-0">
        {/* Card 1: Main Referral Code */}
        <Card className="border-border/40 bg-card shadow-sm flex flex-col justify-between rounded-2xl min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Award className="size-4 sm:size-5 text-primary shrink-0" />
              <span>{t("dashboard.sales.codeCardTitle")}</span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {t("dashboard.sales.codeCardDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4 min-w-0">
            <div className="p-3.5 sm:p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between gap-2 min-w-0">
              <span className="font-mono text-xl sm:text-2xl font-bold tracking-wider text-primary truncate min-w-0">
                {referralCode || "—"}
              </span>
              <Button size="sm" variant="outline" onClick={handleCopyCode} className="shrink-0 gap-1.5 rounded-lg text-xs cursor-pointer shadow-sm">
                {copiedCode ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedCode ? t("dashboard.sales.copied") : t("dashboard.sales.copyCode")}</span>
              </Button>
            </div>

            <div className="pt-2 border-t border-border/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>{t("dashboard.sales.updatePrompt")}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                className="w-fit text-xs text-muted-foreground hover:text-foreground gap-1 p-0 h-auto font-medium hover:bg-transparent underline underline-offset-4 cursor-pointer"
              >
                <RefreshCw className="size-3 shrink-0" />
                <span>{t("dashboard.sales.regenerateCode")}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Shareable Link */}
        <Card className="border-border/40 bg-card shadow-sm flex flex-col justify-between rounded-2xl min-w-0 overflow-hidden">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base font-semibold flex items-center gap-2">
              <Share2 className="size-4 sm:size-5 text-primary shrink-0" />
              <span>{t("dashboard.sales.linkCardTitle")}</span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {t("dashboard.sales.linkCardDesc")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 space-y-4 min-w-0">
            <div className="p-3 rounded-xl border border-border/40 bg-muted/30 text-xs font-mono text-muted-foreground flex items-center justify-between gap-2 min-w-0">
              <span className="truncate flex-1 min-w-0">{shareableUrl}</span>
              <Button size="sm" variant="secondary" onClick={handleCopyLink} className="shrink-0 gap-1.5 rounded-lg text-xs cursor-pointer shadow-sm">
                {copiedLink ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                <span>{copiedLink ? t("dashboard.sales.copied") : t("dashboard.sales.copyLink")}</span>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              💡 <strong>{t("dashboard.sales.tipsLabel")}</strong> {t("dashboard.sales.tipsText")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Program Info Card */}
      <Card className="border-emerald-500/20 bg-emerald-500/5 p-4 sm:p-6 space-y-3 rounded-2xl min-w-0">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm uppercase tracking-wider">
          <DollarSign className="size-4 shrink-0" />
          <span>{t("dashboard.sales.programTitle")}</span>
        </div>
        <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
          <li>{t("dashboard.sales.commRatePrefix")} <strong>20%</strong> {t("dashboard.sales.commRateSuffix")}</li>
          <li>{t("dashboard.sales.commRecurringPrefix")} <strong>recurring</strong> {t("dashboard.sales.commRecurringSuffix")}</li>
          <li>{t("dashboard.sales.commEditorPrefix")} <em>Editor</em> {t("dashboard.sales.commEditorSuffix")}</li>
        </ul>
      </Card>

      {/* Confirm Dialog for Regenerate */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen} title={t("dashboard.sales.dialogTitle")}>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("dashboard.sales.confirmPrefix")} (<strong className="font-mono">{referralCode}</strong>) {t("dashboard.sales.confirmSuffix")}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>{t("dashboard.sales.cancel")}</Button>
            <Button variant="destructive" onClick={handleRegenerate} disabled={regenerating} className="gap-2">
              {regenerating && <Loader2 className="size-4 animate-spin" />}
              {regenerating ? t("dashboard.sales.processing") : t("dashboard.sales.confirmRegenerate")}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
