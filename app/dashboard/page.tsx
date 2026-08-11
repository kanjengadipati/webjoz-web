"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, EmptyState, SectionTitle, SkeletonBlock } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchProfile } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { fetchMyCommissions, CommissionSummary, getCommissionConfig, CommissionConfig } from "@/lib/api/commissions";
import { fetchMyBonuses, BonusSummary } from "@/lib/api/bonuses";
import { fetchMyReferralCode } from "@/lib/api/referral";
import { SectionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/context";
import {
  Building2, Users, Globe, CreditCard, Activity, Megaphone, TrendingUp,
  Loader2, Calendar, Zap, Database, Server, Cpu, ChevronRight,
  BarChart3, ShieldCheck, TicketCheck, UserPlus, ArrowUpRight,
  LayoutDashboard, DollarSign, Award, Clock, Sparkles, Share2,
  Copy, Check, ArrowRight, Gift, Target,
} from "lucide-react";
import type { Profile } from "@/lib/types";

interface PlatformStats {
  total_tenants: number;
  total_users: number;
  total_sites: number;
  new_tenants_7d: number;
  new_users_7d: number;
}

interface SystemHealth {
  database: string;
  cache: string;
  ai: string;
  version: string;
}

interface TenantItem {
  id: number;
  name: string;
  slug: string;
  plan: string;
  owner_id: number;
  member_count: number;
  site_count: number;
  created_at: string;
}

interface PlanItem {
  id: number;
  name: string;
  slug: string;
}

interface Site {
  id: number;
  name: string;
  status: "draft" | "published";
  created_at?: string;
  updated_at?: string;
}

interface PlanDetail {
  id: number;
  name: string;
  slug: string;
  max_sites: number;
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_members: number;
}

interface Lead {
  id: number;
  created_at: string;
  name: string;
  email: string;
  site_id: number;
}

interface PageViewStat {
  date: string;
  count: number;
}

interface AnalyticsData {
  total_pageviews: number;
  pageviews_by_date: PageViewStat[];
}

const DASHBOARD_CONFIG = {
  INITIAL_PAGE: 1,
  ITEMS_PER_PAGE: 24,
  TREND_WINDOW_DAYS: 7,
} as const;

function StatCard({ label, value, icon: Icon, href, color, sub }: { label: string; value: string | number; icon: any; href: string; color: string; sub?: string }) {
  return (
    <Link href={href}>
      <div className="group bg-card border border-border/60 shadow-sm rounded-3xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</span>
          <div className={`size-10 rounded-2xl bg-gradient-to-br ${color}/10 ${color}/5 flex items-center justify-center`}>
            <Icon className={`size-5 ${color}`} />
          </div>
        </div>
        <p className="text-4xl font-bold tracking-tight text-foreground">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-1.5">{sub}</p>}
      </div>
    </Link>
  );
}

function QuickLink({ href, label, icon: Icon, desc }: { href: string; label: string; icon: any; desc: string }) {
  return (
    <Link href={href} className="group flex items-center gap-4 p-4 rounded-2xl border border-border/40 bg-card hover:border-primary/30 hover:bg-primary/5 transition-all duration-300">
      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
        <Icon className="size-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
    </Link>
  );
}

export default function DashboardOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { activeTenantId, activeTenant } = useActiveTenant();
  const { role } = usePermissions();
  const isAdmin = role === "superadmin" || role === "admin";
  const isSales = !isAdmin && (role === "sales");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [tenants, setTenants] = useState<TenantItem[]>([]);
  const [planCount, setPlanCount] = useState<number>(0);

  // Regular user state
  const [sites, setSites] = useState<Site[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [plans, setPlans] = useState<PlanDetail[]>([]);
  const [tenantUsage, setTenantUsage] = useState<{
    usage: { generate_count: number; section_regen_count: number; design_regen_count: number };
    max_ai_generates: number;
    max_section_regens: number;
    max_design_regens: number;
  } | null>(null);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  // ── Sales-specific state ──────────────────────────────────────────────────
  const [commSummary, setCommSummary] = useState<CommissionSummary>({ total_earned: 0, total_pending: 0, total_voided: 0 });
  const [bonusSummary, setBonusSummary] = useState<BonusSummary>({ total_earned: 0, total_pending: 0, total_voided: 0, total_paid: 0, onboarding_count: 0, milestone_count: 0 });
  const [commConfig, setCommConfig] = useState<CommissionConfig | null>(null);
  const [referralCode, setReferralCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const refresh = useCallback(async (showToast = false) => {
    if (!token) return;
    setState(SectionState.LOADING);

    if (isAdmin) {
      const [profileRes, statsRes, healthRes, tenantsRes, plansRes] = await Promise.allSettled([
        fetchProfile(token),
        request<PlatformStats>("/tenants/admin/stats", {}, token),
        request<SystemHealth>("/health/system", {}, token),
        request<TenantItem[]>("/tenants/admin", {}, token),
        request<PlanItem[]>("/admin/plans", {}, token),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (healthRes.status === "fulfilled") setHealth(healthRes.value.data);
      if (tenantsRes.status === "fulfilled") setTenants((tenantsRes.value.data || []).slice(0, 5));
      if (plansRes.status === "fulfilled") setPlanCount((plansRes.value.data || []).length);
    } else if (isSales) {
      const [profileRes, commRes, bonusRes, configRes, refRes] = await Promise.allSettled([
        fetchProfile(token),
        fetchMyCommissions(token, new URLSearchParams({ page: "1", limit: "1" })),
        fetchMyBonuses(token, new URLSearchParams({ page: "1", limit: "1" })),
        getCommissionConfig(token),
        fetchMyReferralCode(token),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (commRes.status === "fulfilled") setCommSummary(commRes.value.data?.summary ?? { total_earned: 0, total_pending: 0, total_voided: 0 });
      if (bonusRes.status === "fulfilled") setBonusSummary(bonusRes.value.data?.summary ?? { total_earned: 0, total_pending: 0, total_voided: 0, total_paid: 0, onboarding_count: 0, milestone_count: 0 });
      if (configRes.status === "fulfilled") setCommConfig(configRes.value.data);
      if (refRes.status === "fulfilled") setReferralCode(refRes.value.data?.referral_code ?? "");
    } else {
      const fromDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      const toDate = new Date().toISOString().split("T")[0];
      const tenantHeaders: Record<string, string> = activeTenantId
        ? { "X-Tenant-ID": activeTenantId.toString() }
        : {};

      const [profileRes, sitesRes, leadsRes, analyticsRes, plansRes, usageRes] = await Promise.allSettled([
        fetchProfile(token),
        activeTenantId
          ? request<Site[]>("/sites", { headers: tenantHeaders }, token)
          : Promise.reject(new Error("No tenant")),
        activeTenantId
          ? request<Lead[]>("/leads", { headers: tenantHeaders }, token)
          : Promise.reject(new Error("No tenant")),
        activeTenantId
          ? request<AnalyticsData>(`/analytics?from=${fromDate}&to=${toDate}`, { headers: tenantHeaders }, token)
          : Promise.reject(new Error("No tenant")),
        request<PlanDetail[]>("/plans/active", {}, token),
        activeTenantId
          ? request<any>(`/tenants/${activeTenantId}/usage`, {}, token)
          : Promise.reject(new Error("No tenant")),
      ]);

      if (profileRes.status === "fulfilled") setProfile(profileRes.value.data);
      if (sitesRes.status === "fulfilled") setSites(sitesRes.value.data || []);
      if (leadsRes.status === "fulfilled") setLeads(leadsRes.value.data || []);
      if (analyticsRes.status === "fulfilled") setAnalytics(analyticsRes.value.data);
      if (plansRes.status === "fulfilled") setPlans(plansRes.value.data || []);
      if (usageRes.status === "fulfilled" && usageRes.value.data) setTenantUsage(usageRes.value.data);
    }

    setState(SectionState.SUCCESS);
    if (showToast) pushToast(t("dashboard.refreshed"), "success");
  }, [pushToast, token, activeTenantId, isAdmin, isSales, t]);

  useEffect(() => {
    if (!token || state !== SectionState.IDLE) return;
    const timeout = window.setTimeout(() => void refresh(false), 0);
    return () => window.clearTimeout(timeout);
  }, [refresh, state, token]);

  useEffect(() => {
    if (!token) return;
    setState(SectionState.IDLE);
  }, [token, isAdmin, isSales, activeTenantId]);

  const metrics = useMemo(() => {
    const publishedSites = sites.filter((s) => s.status === "published");
    const drafts = sites.length - publishedSites.length;
    const totalViews = analytics?.total_pageviews ?? 0;
    return { totalSites: sites.length, publishedSites: publishedSites.length, drafts, totalLeads: leads.length, totalViews };
  }, [sites, leads, analytics]);

  const currentPlan = useMemo(() => {
    if (!activeTenant?.tenant?.plan || plans.length === 0) return null;
    return plans.find((p) => p.slug === activeTenant.tenant.plan) || null;
  }, [plans, activeTenant]);

  const barData = useMemo(() => {
    const byDate = analytics?.pageviews_by_date || [];
    return byDate.slice(-DASHBOARD_CONFIG.TREND_WINDOW_DAYS);
  }, [analytics]);

  const recentActivity = useMemo(() => {
    const dateLocale = locale === "id" ? "id-ID" : "en-US";
    const items: Array<{ title: string; time: string; date: Date }> = [];
    leads.forEach((l) => items.push({ title: t("dashboard.leadNew", undefined, { name: l.name }), time: new Date(l.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), date: new Date(l.created_at) }));
    sites.forEach((s) => { if (s.updated_at) items.push({ title: t("dashboard.siteUpdated", undefined, { name: s.name }), time: new Date(s.updated_at).toLocaleDateString(dateLocale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }), date: new Date(s.updated_at) }); });
    items.sort((a, b) => b.date.getTime() - a.date.getTime());
    return items.slice(0, 5);
  }, [leads, sites, t, locale]);

  if (state === SectionState.LOADING) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <SkeletonBlock className="h-40 rounded-3xl" />
        <div className="grid grid-cols-4 gap-5">
          <SkeletonBlock className="h-32 rounded-3xl" /><SkeletonBlock className="h-32 rounded-3xl" />
          <SkeletonBlock className="h-32 rounded-3xl" /><SkeletonBlock className="h-32 rounded-3xl" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <SkeletonBlock className="h-64 rounded-3xl" /><SkeletonBlock className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isSales) {
    const t1 = commConfig ? commConfig.tier1_rate_percent.toFixed(0) : "20";
    const t2 = commConfig ? commConfig.tier2_rate_percent.toFixed(0) : "10";
    const months = commConfig?.tier_threshold_months ?? 12;
    const grandTotal = commSummary.total_earned + bonusSummary.total_earned;
    const grandPending = commSummary.total_pending + bonusSummary.total_pending;
    const fmt = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;
    const referralUrl = typeof window !== "undefined" && referralCode
      ? `${window.location.origin}/create?ref=${referralCode}`
      : "";

    const handleCopyCode = () => {
      if (!referralCode) return;
      navigator.clipboard.writeText(referralCode);
      setCodeCopied(true);
      pushToast(t("dashboard.salesOverview.codeCopied"), "success");
      setTimeout(() => setCodeCopied(false), 2000);
    };
    const handleCopyLink = () => {
      if (!referralUrl) return;
      navigator.clipboard.writeText(referralUrl);
      setLinkCopied(true);
      pushToast(t("dashboard.salesOverview.linkCopied"), "success");
      setTimeout(() => setLinkCopied(false), 2000);
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* ── Hero header ─────────────────────────────────────────────── */}
        <section className="bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-amber-500/10 border border-emerald-500/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-emerald-500/15 flex items-center justify-center">
                <TrendingUp className="size-7 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  {t("dashboard.salesOverview.pageTitle")}
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {t("dashboard.salesOverview.pageDesc", undefined, { t1, months: String(months), t2 })}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link href="/dashboard/sales/commissions">
                <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted/40 transition">
                  <DollarSign className="size-3.5 text-emerald-500" />
                  {t("dashboard.salesOverview.linkCommissionsTitle")}
                </button>
              </Link>
              <Link href="/dashboard/sales">
                <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-4 py-2.5 text-xs font-semibold hover:bg-muted/40 transition">
                  <Share2 className="size-3.5 text-primary" />
                  {t("dashboard.salesOverview.linkReferralTitle")}
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── Summary cards ────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: t("dashboard.salesOverview.cardTotal"), value: fmt(grandTotal), desc: t("dashboard.salesOverview.cardTotalDesc"), icon: <Sparkles className="size-4 text-emerald-500" />, cls: "text-emerald-600 dark:text-emerald-400" },
            { label: t("dashboard.salesOverview.cardCommission"), value: fmt(commSummary.total_earned), desc: t("dashboard.salesOverview.cardCommissionDesc", undefined, { t1, t2 }), icon: <DollarSign className="size-4 text-emerald-500" />, cls: "text-foreground" },
            { label: t("dashboard.salesOverview.cardBonus"), value: fmt(bonusSummary.total_earned), desc: t("dashboard.salesOverview.cardBonusDesc", undefined, { onboarding: String(bonusSummary.onboarding_count), milestone: String(bonusSummary.milestone_count) }), icon: <Award className="size-4 text-amber-500" />, cls: "text-amber-600 dark:text-amber-400" },
            { label: t("dashboard.salesOverview.cardPending"), value: fmt(grandPending), desc: t("dashboard.salesOverview.cardPendingDesc"), icon: <Clock className="size-4 text-amber-500" />, cls: "text-amber-600 dark:text-amber-400" },
          ].map((card) => (
            <Card key={card.label} className="border-border/40 shadow-sm bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                  {card.label}
                  {card.icon}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-extrabold ${card.cls}`}>{card.value}</div>
                <p className="text-[11px] text-muted-foreground mt-1">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* ── Referral code + commission scheme ───────────────────────── */}
        <section className="grid gap-5 md:grid-cols-2">
          {/* Referral code */}
          <Card className="border-border/40 shadow-sm bg-card">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Share2 className="size-4 text-primary" />
                {t("dashboard.salesOverview.refCardTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                <span className="font-mono text-xl font-bold tracking-widest text-primary">
                  {referralCode || "—"}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg border border-border/60 bg-background px-3 py-1.5 hover:bg-muted transition cursor-pointer"
                >
                  {codeCopied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                  {codeCopied ? t("dashboard.salesOverview.copied") : t("dashboard.salesOverview.copyCode")}
                </button>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("dashboard.salesOverview.refLinkLabel")}
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                  <span className="flex-1 text-xs font-mono text-muted-foreground truncate">{referralUrl || "—"}</span>
                  <button
                    onClick={handleCopyLink}
                    className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold rounded-md border border-border/60 bg-background px-2.5 py-1 hover:bg-muted transition cursor-pointer"
                  >
                    <Copy className="size-3" />
                    {linkCopied ? t("dashboard.salesOverview.copied") : t("dashboard.salesOverview.copyLink")}
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

          {/* Commission scheme */}
          <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-sm">
            <CardHeader className="pb-3 border-b border-emerald-500/15">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <Zap className="size-4" />
                {t("dashboard.salesOverview.schemeTitle")}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5">
                  <div>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Tier 1</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.salesOverview.tier1Desc", undefined, { months: String(months) })}</p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{t1}%</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/30 px-4 py-2.5">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Tier 2</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.salesOverview.tier2Desc", undefined, { months: String(months) })}</p>
                  </div>
                  <span className="text-2xl font-extrabold text-muted-foreground">{t2}%</span>
                </div>
              </div>
              <div className="pt-1 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("dashboard.salesOverview.bonusSchemeTitle")}</p>
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
        </section>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="space-y-8 animate-in fade-in duration-700">
        <section className="bg-gradient-to-br from-primary/15 via-primary/5 to-blue-600/10 border border-primary/15 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-5">
              <div className="size-16 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 flex items-center justify-center">
                <LayoutDashboard className="size-8 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {t("dashboard.admin.platformOverview")}
                </h2>
                <p className="text-muted-foreground mt-1">
                  {stats
                    ? t("dashboard.admin.platformStats", undefined, { tenants: String(stats.total_tenants), users: String(stats.total_users), sites: String(stats.total_sites) })
                    : t("dashboard.admin.loadingMetrics")}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard/tenants">
                <Button className="h-11 rounded-xl px-5 font-bold shadow-lg shadow-primary/20">
                  <Building2 className="size-4 mr-2" />{t("dashboard.admin.allTenants")}
                </Button>
              </Link>
              <Link href="/dashboard/admin/plans">
                <Button variant="secondary" className="h-11 rounded-xl px-5 font-bold bg-background text-foreground hover:bg-background/80 shadow-sm border border-border/60">
                  <CreditCard className="size-4 mr-2" />{t("dashboard.admin.plans")}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label={t("dashboard.admin.totalTenants")}
            value={stats?.total_tenants ?? 0}
            icon={Building2}
            href="/dashboard/tenants"
            color="text-blue-500"
            sub={stats ? t("dashboard.admin.in7Days", undefined, { count: String(stats.new_tenants_7d) }) : undefined}
          />
          <StatCard
            label={t("dashboard.admin.totalUsers")}
            value={stats?.total_users ?? 0}
            icon={Users}
            href="/dashboard/users"
            color="text-emerald-500"
            sub={stats ? t("dashboard.admin.in7Days", undefined, { count: String(stats.new_users_7d) }) : undefined}
          />
          <StatCard
            label={t("dashboard.admin.totalSites")}
            value={stats?.total_sites ?? 0}
            icon={Globe}
            href="/dashboard/sites"
            color="text-primary"
          />
          <StatCard
            label={t("dashboard.admin.activePlans")}
            value={planCount}
            icon={CreditCard}
            href="/dashboard/admin/plans"
            color="text-amber-500"
          />
          <StatCard
            label={t("dashboard.admin.newUsers7d")}
            value={stats?.new_users_7d ?? 0}
            icon={UserPlus}
            href="/dashboard/users"
            color="text-rose-500"
          />
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Building2 className="size-4 text-primary" />
                {t("dashboard.admin.recentAccounts")}
              </h3>
              <Link href="/dashboard/tenants" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">
                {t("dashboard.admin.viewAll")} <ArrowUpRight className="size-3" />
              </Link>
            </div>
            {tenants.length === 0 ? (
              <p className="text-sm text-muted-foreground italic py-12 text-center">{t("dashboard.admin.noAccounts")}</p>
            ) : (
              <div className="space-y-2">
                {tenants.map((t) => (
                  <Link key={t.id} href={`/dashboard/tenants/${t.id}`} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-muted/30 transition-all duration-200 group">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-primary/15 to-blue-600/10 flex items-center justify-center text-primary font-bold text-sm">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full border border-border/40 px-2 py-0.5 text-[10px] font-medium capitalize">{t.plan}</span>
                          <span className="size-1 rounded-full bg-muted-foreground/30" />
                          <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{new Date(t.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="size-4 opacity-0 group-hover:opacity-100 transition-all duration-200" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground/70">
                <Activity className="size-3.5 text-primary" />
                {t("dashboard.admin.systemHealth")}
              </h3>
              <div className="space-y-2.5">
                {[{ name: t("dashboard.admin.svcDatabase"), status: health?.database || "unknown", icon: Database },
                  { name: t("dashboard.admin.svcCache"), status: health?.cache || "disabled", icon: Server },
                  { name: t("dashboard.admin.svcAiProvider"), status: health?.ai || "unknown", icon: Cpu },
                ].map((svc) => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/20">
                    <div className="flex items-center gap-3">
                      <svc.icon className={`size-4 ${svc.status === "ok" ? "text-green-500" : svc.status === "error" ? "text-red-500" : "text-yellow-500"}`} />
                      <span className="text-sm font-medium">{svc.name}</span>
                    </div>
                    <span className={`text-xs font-semibold ${svc.status === "ok" ? "text-green-600" : svc.status === "error" ? "text-red-500" : "text-yellow-500"}`}>
                      {svc.status === "ok" ? t("dashboard.admin.statusHealthy") : svc.status === "error" ? t("dashboard.admin.statusDown") : svc.status === "disabled" ? t("dashboard.admin.statusDisabled") : t("dashboard.admin.statusUnknown")}
                    </span>
                  </div>
                ))}
              </div>
              <Link href="/dashboard/admin/health" className="block mt-3 text-xs font-medium text-primary hover:underline">{t("dashboard.admin.viewDetailedStatus")}</Link>
            </div>

            <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
              <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 mb-4 uppercase tracking-wider text-muted-foreground/70">
                <Zap className="size-3.5 text-primary" />
                {t("dashboard.admin.quickActions")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/dashboard/tenants" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.allTenants")}</Link>
                <Link href="/dashboard/admin/plans" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.plans")}</Link>
                <Link href="/dashboard/admin/health" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.qxHealth")}</Link>
                <Link href="/dashboard/admin/announcements" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.qxAnnounce")}</Link>
                <Link href="/dashboard/users" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.qxUsers")}</Link>
                <Link href="/dashboard/logs" className="p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium text-center">{t("dashboard.admin.qxAuditLogs")}</Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
            <ShieldCheck className="size-4 text-primary" />
            {t("dashboard.admin.platformManagement")}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickLink href="/dashboard/tenants" label={t("dashboard.admin.allTenants")} icon={Building2} desc={t("dashboard.admin.qlTenantsDesc")} />
            <QuickLink href="/dashboard/admin/plans" label={t("dashboard.nav.plans")} icon={CreditCard} desc={t("dashboard.admin.qlPlansDesc")} />
            <QuickLink href="/dashboard/admin/health" label={t("dashboard.nav.health")} icon={Activity} desc={t("dashboard.admin.qlHealthDesc")} />
            <QuickLink href="/dashboard/admin/announcements" label={t("dashboard.nav.announcements")} icon={Megaphone} desc={t("dashboard.admin.qlAnnounceDesc")} />
          </div>
        </section>
      </div>
    );
  }

  // Regular user view
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="bg-gradient-to-r from-primary/20 to-blue-600/20 border border-primary/20 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 lg:gap-6">
          <div>
            <h2 className="text-3xl font-bold leading-[1.1] tracking-tighter text-balance bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent sm:text-4xl md:text-6xl lg:text-7xl">
              {t("dashboard.welcome", undefined, { name: profile ? `, ${profile.name.split(" ")[0]}` : "" })}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
              {t("dashboard.welcomeDesc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/sites/new">
              <Button className="h-12 rounded-xl px-6 font-bold shadow-lg shadow-primary/20">{t("dashboard.newWebsite")}</Button>
            </Link>
          </div>
        </div>
      </section>

      {activeTenant?.tenant.plan === "free" && (
        <section className="bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20 rounded-3xl p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-foreground">{t("dashboard.usingFreePlan", undefined, { plan: "Free" })}</p>
            <p className="text-xs text-muted-foreground">{t("dashboard.upgradeToProDesc")}</p>
          </div>
          <Link href="/dashboard/upgrade">
            <Button className="shrink-0 h-10 rounded-xl px-5 font-bold shadow-lg shadow-primary/20">{t("dashboard.upgradeToPro")}</Button>
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard label={t("dashboard.statWebsites")} value={metrics.totalSites} icon={Globe} href="/dashboard/sites" color="text-primary" sub={t("dashboard.sitesPublished", undefined, { count: String(metrics.publishedSites) })} />
        <StatCard label={t("dashboard.statLeads")} value={metrics.totalLeads} icon={Activity} href="/dashboard/leads" color="text-amber-500" sub={metrics.totalLeads > 0 ? t("dashboard.newProspects") : t("dashboard.setupLeadForm")} />
        <StatCard label={t("dashboard.statVisitors")} value={metrics.totalViews} icon={TrendingUp} href="/dashboard/analytics" color="text-emerald-500" sub={t("dashboard.thisWeek")} />
        <StatCard label={t("dashboard.statHealth")} value="100%" icon={ShieldCheck} href="/dashboard/settings" color="text-green-500" sub={t("dashboard.allSystemsNormal")} />
      </section>

      {currentPlan && (
        <section>
          <h3 className="text-lg font-bold tracking-tight mb-4 flex items-center gap-2">
            <Database className="size-4 text-primary" />
            {t("dashboard.usageMeter")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{t("dashboard.meterWebsites")}</span>
                <span className="text-sm font-bold">{metrics.totalSites} / {currentPlan.max_sites <= 0 ? "∞" : currentPlan.max_sites}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{
                    width: currentPlan.max_sites <= 0 ? "100%" : `${Math.min((metrics.totalSites / currentPlan.max_sites) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{t("dashboard.meterAiGenerate")}</span>
                <span className="text-sm font-bold">{tenantUsage?.usage.generate_count ?? 0} / {currentPlan.max_ai_generates <= 0 ? "∞" : currentPlan.max_ai_generates}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: currentPlan.max_ai_generates <= 0 ? "100%" : `${Math.min(((tenantUsage?.usage.generate_count ?? 0) / currentPlan.max_ai_generates) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{t("dashboard.meterSectionRegen")}</span>
                <span className="text-sm font-bold">{tenantUsage?.usage.section_regen_count ?? 0} / {currentPlan.max_section_regens <= 0 ? "∞" : currentPlan.max_section_regens}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-500"
                  style={{
                    width: currentPlan.max_section_regens <= 0 ? "100%" : `${Math.min(((tenantUsage?.usage.section_regen_count ?? 0) / currentPlan.max_section_regens) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-card rounded-3xl border border-border/60 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">{t("dashboard.meterDesignRegen")}</span>
                <span className="text-sm font-bold">{tenantUsage?.usage.design_regen_count ?? 0} / {currentPlan.max_design_regens <= 0 ? "∞" : currentPlan.max_design_regens}</span>
              </div>
              <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                  style={{
                    width: currentPlan.max_design_regens <= 0 ? "100%" : `${Math.min(((tenantUsage?.usage.design_regen_count ?? 0) / currentPlan.max_design_regens) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 tracking-tight">{t("dashboard.recentActivity")}</h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? recentActivity.map((act, i) => (
              <div key={i}>
                <p className="font-semibold text-foreground text-sm">{act.title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{act.time}</p>
              </div>
            )) : <p className="text-sm text-muted-foreground italic">{t("dashboard.noActivity")}</p>}
          </div>
        </div>
        <div className="bg-card rounded-3xl border border-border/60 p-6 shadow-sm">
          <h3 className="text-lg font-bold mb-4 tracking-tight">{t("dashboard.aiInsights")}</h3>
          <div className="space-y-3">
            {metrics.totalViews > 0
              ? <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">{t("dashboard.insightTraffic", undefined, { count: String(metrics.totalViews) })}</div>
              : <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">{t("dashboard.insightNoTraffic")}</div>}
            {metrics.totalLeads > 0 && <div className="bg-muted/40 border border-border/40 p-3 rounded-xl text-sm font-medium">{t("dashboard.insightLeads", undefined, { count: String(metrics.totalLeads) })}</div>}
            {metrics.totalSites === 0 && <div className="bg-primary/10 text-primary border border-primary/20 p-3 rounded-xl text-sm font-medium">{t("dashboard.insightCreateSite")}</div>}
          </div>
        </div>
      </section>
    </div>
  );
}
