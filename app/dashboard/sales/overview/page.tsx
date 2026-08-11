"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import {
  fetchMyCommissions,
  CommissionSummary,
  getCommissionConfig,
  CommissionConfig,
} from "@/lib/api/commissions";
import { fetchMyBonuses, BonusSummary } from "@/lib/api/bonuses";
import { fetchMyReferralCode } from "@/lib/api/referral";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  DollarSign,
  Award,
  Clock,
  Sparkles,
  Share2,
  Copy,
  Check,
  Loader2,
  ShieldAlert,
  TrendingUp,
  ArrowRight,
  Gift,
  Target,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

// ─── Stat card ───────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  desc: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

function StatCard({ label, value, desc, icon, valueClassName }: StatCardProps) {
  return (
    <Card className="border-border/40 shadow-sm bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
          {label}
          {icon}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-extrabold ${valueClassName ?? "text-foreground"}`}>
          {value}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1">{desc}</p>
      </CardContent>
    </Card>
  );
}

// ─── Quick link card ──────────────────────────────────────────────────────────

interface QuickLinkCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string; // tailwind border/bg accent class
}

function QuickLinkCard({ href, icon, title, desc, accent }: QuickLinkCardProps) {
  return (
    <Link href={href} className="group block">
      <Card
        className={`border-border/40 bg-card shadow-sm hover:shadow-md transition-all duration-200 group-hover:border-opacity-60 ${accent}`}
      >
        <CardContent className="p-5 flex items-start gap-4">
          <div className="mt-0.5 shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SalesOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [loading, setLoading] = useState(true);

  const [commSummary, setCommSummary] = useState<CommissionSummary>({
    total_earned: 0,
    total_pending: 0,
    total_voided: 0,
  });
  const [bonusSummary, setBonusSummary] = useState<BonusSummary>({
    total_earned: 0,
    total_pending: 0,
    total_voided: 0,
    total_paid: 0,
    onboarding_count: 0,
    milestone_count: 0,
  });
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [copied, setCopied] = useState(false);

  const canAccess =
    hasPermission("sales:manage-referral") ||
    hasPermission("commission:read_own") ||
    role === "superadmin" ||
    role === "admin" ||
    role === "sales";

  useEffect(() => {
    if (!token || !canAccess) return;

    setLoading(true);
    Promise.all([
      fetchMyCommissions(token, new URLSearchParams({ page: "1", limit: "1" })),
      fetchMyBonuses(token, new URLSearchParams({ page: "1", limit: "1" })),
      getCommissionConfig(token),
      fetchMyReferralCode(token),
    ])
      .then(([commRes, bonusRes, configRes, refRes]) => {
        setCommSummary(
          commRes.data?.summary ?? { total_earned: 0, total_pending: 0, total_voided: 0 }
        );
        setBonusSummary(
          bonusRes.data?.summary ?? {
            total_earned: 0,
            total_pending: 0,
            total_voided: 0,
            total_paid: 0,
            onboarding_count: 0,
            milestone_count: 0,
          }
        );
        setConfig(configRes.data);
        setReferralCode(refRes.data?.referral_code ?? "");
      })
      .catch((err: any) => {
        pushToast(err.message || t("dashboard.salesOverview.loadFailed"), "error");
      })
      .finally(() => setLoading(false));
  }, [token, canAccess]);

  const handleCopy = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    pushToast(t("dashboard.salesOverview.codeCopied"), "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const referralUrl =
    typeof window !== "undefined" && referralCode
      ? `${window.location.origin}/create?ref=${referralCode}`
      : "";

  const handleCopyLink = () => {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    pushToast(t("dashboard.salesOverview.linkCopied"), "success");
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">{t("dashboard.salesOverview.loading")}</p>
      </div>
    );
  }

  // ── Access denied ──────────────────────────────────────────────────────────
  if (!canAccess) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">{t("dashboard.salesOverview.accessDeniedTitle")}</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("dashboard.salesOverview.accessDeniedDesc")}
        </p>
      </div>
    );
  }

  // ── Derived values ─────────────────────────────────────────────────────────
  const grandTotal = commSummary.total_earned + bonusSummary.total_earned;
  const grandPending = commSummary.total_pending + bonusSummary.total_pending;
  const t1 = config ? config.tier1_rate_percent.toFixed(0) : "20";
  const t2 = config ? config.tier2_rate_percent.toFixed(0) : "10";
  const months = config?.tier_threshold_months ?? 12;

  const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <TrendingUp className="size-6 text-emerald-500" />
          {t("dashboard.salesOverview.pageTitle")}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {t("dashboard.salesOverview.pageDesc", undefined, {
            t1,
            months: String(months),
            t2,
          })}
        </p>
      </div>

      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          label={t("dashboard.salesOverview.cardTotal")}
          value={fmt(grandTotal)}
          desc={t("dashboard.salesOverview.cardTotalDesc")}
          valueClassName="text-emerald-600 dark:text-emerald-400"
          icon={<Sparkles className="size-4 text-emerald-500" />}
        />
        <StatCard
          label={t("dashboard.salesOverview.cardCommission")}
          value={fmt(commSummary.total_earned)}
          desc={t("dashboard.salesOverview.cardCommissionDesc", undefined, { t1, t2 })}
          icon={<DollarSign className="size-4 text-emerald-500" />}
        />
        <StatCard
          label={t("dashboard.salesOverview.cardBonus")}
          value={fmt(bonusSummary.total_earned)}
          desc={t("dashboard.salesOverview.cardBonusDesc", undefined, {
            onboarding: String(bonusSummary.onboarding_count),
            milestone: String(bonusSummary.milestone_count),
          })}
          valueClassName="text-amber-600 dark:text-amber-400"
          icon={<Award className="size-4 text-amber-500" />}
        />
        <StatCard
          label={t("dashboard.salesOverview.cardPending")}
          value={fmt(grandPending)}
          desc={t("dashboard.salesOverview.cardPendingDesc")}
          valueClassName="text-amber-600 dark:text-amber-400"
          icon={<Clock className="size-4 text-amber-500" />}
        />
      </div>

      {/* ── Referral code + commission scheme ─────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        {/* Referral code card */}
        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-3 border-b border-border/20">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Share2 className="size-4 text-primary" />
              {t("dashboard.salesOverview.refCardTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {/* Code display */}
            <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
              <span className="font-mono text-xl font-bold tracking-widest text-primary">
                {referralCode || "—"}
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-border/60 bg-background px-3 py-1.5 hover:bg-muted transition cursor-pointer"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
                {copied
                  ? t("dashboard.salesOverview.copied")
                  : t("dashboard.salesOverview.copyCode")}
              </button>
            </div>

            {/* Shareable URL */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("dashboard.salesOverview.refLinkLabel")}
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                <span className="flex-1 text-xs font-mono text-muted-foreground truncate">
                  {referralUrl || "—"}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-md border border-border/60 bg-background px-2.5 py-1 hover:bg-muted transition cursor-pointer"
                >
                  <Copy className="size-3" />
                  {t("dashboard.salesOverview.copyLink")}
                </button>
              </div>
            </div>

            <Link
              href="/dashboard/sales"
              className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline underline-offset-4"
            >
              {t("dashboard.salesOverview.manageRef")}
              <ArrowRight className="size-3.5" />
            </Link>
          </CardContent>
        </Card>

        {/* Commission scheme card */}
        <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
          <CardHeader className="pb-3 border-b border-emerald-500/15">
            <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
              <Zap className="size-4" />
              {t("dashboard.salesOverview.schemeTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {/* Tier bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
                <div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                    Tier 1
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t("dashboard.salesOverview.tier1Desc", undefined, {
                      months: String(months),
                    })}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {t1}%
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-4 py-2.5">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Tier 2
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {t("dashboard.salesOverview.tier2Desc", undefined, {
                      months: String(months),
                    })}
                  </p>
                </div>
                <span className="text-2xl font-extrabold text-muted-foreground">
                  {t2}%
                </span>
              </div>
            </div>

            {/* Bonus badges */}
            <div className="pt-1 space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t("dashboard.salesOverview.bonusSchemeTitle")}
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <Gift className="size-3" />
                  {t("dashboard.salesOverview.bonusOnboarding")}
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                  <Target className="size-3" />
                  {t("dashboard.salesOverview.bonusMilestone")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick links ───────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t("dashboard.salesOverview.quickLinksTitle")}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <QuickLinkCard
            href="/dashboard/sales/commissions"
            icon={<DollarSign className="size-5 text-emerald-500" />}
            title={t("dashboard.salesOverview.linkCommissionsTitle")}
            desc={t("dashboard.salesOverview.linkCommissionsDesc")}
            accent="hover:border-emerald-500/40"
          />
          <QuickLinkCard
            href="/dashboard/sales"
            icon={<Share2 className="size-5 text-primary" />}
            title={t("dashboard.salesOverview.linkReferralTitle")}
            desc={t("dashboard.salesOverview.linkReferralDesc")}
            accent="hover:border-primary/40"
          />
        </div>
      </div>
    </div>
  );
}
