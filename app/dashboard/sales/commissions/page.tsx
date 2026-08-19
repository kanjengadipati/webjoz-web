"use client";

import { useEffect, useState } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { usePermissions } from "@/hooks/use-permissions";
import { fetchMyCommissions, Commission, CommissionSummary, getCommissionConfig, CommissionConfig } from "@/lib/api/commissions";
import { fetchMyBonuses, SalesBonus, BonusSummary } from "@/lib/api/bonuses";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import {
  DollarSign,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Award,
  Sparkles,
  Gift,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";

export default function MyCommissionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { hasPermission, role, loading: permLoading } = usePermissions();

  const [activeTab, setActiveTab] = useState<"commissions" | "bonuses">("commissions");

  // Config state
  const [config, setConfig] = useState<CommissionConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);

  // Commissions state
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary>({ total_earned: 0, total_pending: 0, total_voided: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Bonuses state
  const [bonuses, setBonuses] = useState<SalesBonus[]>([]);
  const [bonusSummary, setBonusSummary] = useState<BonusSummary>({
    total_earned: 0,
    total_pending: 0,
    total_voided: 0,
    total_paid: 0,
    onboarding_count: 0,
    milestone_count: 0,
  });
  const [bonusPage, setBonusPage] = useState(1);
  const [bonusTotal, setBonusTotal] = useState(0);

  const limit = 10;
  const canReadOwn = hasPermission("commission:read_own") || role === "superadmin" || role === "admin" || role === "sales";

  const loadCommissions = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      const [res, configRes] = await Promise.all([
        fetchMyCommissions(token, params),
        getCommissionConfig(token),
      ]);
      setCommissions(res.data?.commissions || []);
      setSummary(res.data?.summary || { total_earned: 0, total_pending: 0, total_voided: 0 });
      setTotal((res.meta?.total as number) || 0);
      setConfig(configRes.data);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.salesCommissions.loadFailed"), "error");
    } finally {
      setLoading(false);
      setConfigLoading(false);
    }
  };

  const loadBonuses = async () => {
    if (!token) return;
    try {
      const params = new URLSearchParams({
        page: bonusPage.toString(),
        limit: limit.toString(),
      });
      const res = await fetchMyBonuses(token, params);
      setBonuses(res.data?.bonuses || []);
      setBonusSummary(
        res.data?.summary || {
          total_earned: 0,
          total_pending: 0,
          total_voided: 0,
          total_paid: 0,
          onboarding_count: 0,
          milestone_count: 0,
        }
      );
      setBonusTotal((res.meta?.total as number) || 0);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (token && canReadOwn) {
      loadCommissions();
      loadBonuses();
    }
  }, [token, page, bonusPage, canReadOwn]);

  if (permLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        <p className="text-sm text-muted-foreground">{t("dashboard.salesCommissions.loading")}</p>
      </div>
    );
  }

  if (!canReadOwn) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-4 text-center">
        <ShieldAlert className="size-12 text-destructive/60" />
        <h2 className="text-xl font-bold">{t("dashboard.salesCommissions.accessDeniedTitle")}</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          {t("dashboard.salesCommissions.accessDeniedDesc")}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / limit) || 1;
  const totalBonusPages = Math.ceil(bonusTotal / limit) || 1;
  const grandTotalEarned = summary.total_earned + bonusSummary.total_earned;

  const t1 = config ? config.tier1_rate_percent.toFixed(0) : "20";
  const t2 = config ? config.tier2_rate_percent.toFixed(0) : "10";
  const months = config?.tier_threshold_months ?? 12;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              {t("dashboard.salesCommissions.cardTotal")}
              <Sparkles className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              Rp {grandTotalEarned.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("dashboard.salesCommissions.cardTotalDesc")}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              {t("dashboard.salesCommissions.cardCommission")}
              <DollarSign className="size-4 text-emerald-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              Rp {summary.total_earned.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("dashboard.salesCommissions.cardCommissionDesc", undefined, { t1, t2 })}</p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              {t("dashboard.salesCommissions.cardBonus")}
              <Award className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              Rp {bonusSummary.total_earned.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {t("dashboard.salesCommissions.cardBonusDesc", undefined, { onboarding: String(bonusSummary.onboarding_count), milestone: String(bonusSummary.milestone_count) })}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              {t("dashboard.salesCommissions.cardPending")}
              <Clock className="size-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              Rp {(summary.total_pending + bonusSummary.total_pending).toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">{t("dashboard.salesCommissions.cardPendingDesc")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/40 gap-2">
        <button
          onClick={() => setActiveTab("commissions")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "commissions"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <DollarSign className="size-4" />
          {t("dashboard.salesCommissions.tabCommissions", undefined, { count: String(total) })}
        </button>
        <button
          onClick={() => setActiveTab("bonuses")}
          className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "bonuses"
              ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="size-4" />
          {t("dashboard.salesCommissions.tabBonuses", undefined, { count: String(bonusTotal) })}
        </button>
      </div>

      {/* Tab Content: Commissions */}
      {activeTab === "commissions" && (
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-0">
            {commissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <DollarSign className="size-10 opacity-30" />
                <p className="text-sm">{t("dashboard.salesCommissions.noCommissionsTitle")}</p>
                <p className="text-xs opacity-75">{t("dashboard.salesCommissions.noCommissionsDesc")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">{t("dashboard.salesCommissions.thDate")}</th>
                      <th className="px-6 py-4">{t("dashboard.salesCommissions.thOrderId")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.salesCommissions.thTenantId")}</th>
                      <th className="px-6 py-4 text-right">{t("dashboard.salesCommissions.thGross")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.salesCommissions.thRate")}</th>
                      <th className="px-6 py-4 text-right">{t("dashboard.salesCommissions.thCommission")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.salesCommissions.thStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissions.map((c) => (
                      <tr key={c.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                          {new Date(c.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold">
                          {c.order_id}
                        </td>
                        <td className="px-6 py-4 text-center text-xs text-muted-foreground">
                          #{c.tenant_id}
                        </td>
                        <td className="px-6 py-4 text-right font-medium">
                          Rp {c.gross_amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center text-xs">
                          <span className="inline-flex flex-col items-center leading-tight">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">{t("dashboard.salesCommissions.tierLabel", undefined, { tier: String(c.tier) })}</span>
                            <span className="text-[11px] text-muted-foreground">{(c.rate * 100).toFixed(0)}%</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          Rp {c.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                            c.status === "pending"
                              ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                              : "border-destructive/30 text-destructive bg-destructive/10"
                          }`}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.salesCommissions.pageOf", undefined, { page: String(page), total: String(totalPages) })}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    {t("dashboard.salesCommissions.previous")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="gap-1"
                  >
                    {t("dashboard.salesCommissions.next")}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab Content: Bonuses */}
      {activeTab === "bonuses" && (
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-0">
            {bonuses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-2">
                <Award className="size-10 opacity-30" />
                <p className="text-sm">{t("dashboard.salesCommissions.noBonusesTitle")}</p>
                <p className="text-xs opacity-75">{t("dashboard.salesCommissions.noBonusesDesc")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/20 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      <th className="px-6 py-4">{t("dashboard.salesCommissions.thDate")}</th>
                      <th className="px-6 py-4">{t("dashboard.salesCommissions.thBonusType")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.salesCommissions.thDetail")}</th>
                      <th className="px-6 py-4 text-right">{t("dashboard.salesCommissions.thAmount")}</th>
                      <th className="px-6 py-4 text-center">{t("dashboard.salesCommissions.thStatus")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bonuses.map((b) => (
                      <tr key={b.id} className="border-b border-border/10 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">
                          {new Date(b.created_at).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {b.type === "onboarding" ? (
                              <Gift className="size-4 text-emerald-500" />
                            ) : (
                              <Target className="size-4 text-amber-500" />
                            )}
                            <span className="font-semibold capitalize">{t("dashboard.salesCommissions.bonusTypeLabel", undefined, { type: b.type })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center text-xs font-mono text-muted-foreground">
                          {b.type === "onboarding"
                            ? t("dashboard.salesCommissions.bonusTenant", undefined, { id: String(b.tenant_id) })
                            : t("dashboard.salesCommissions.bonusPeriod", undefined, { period: b.period || "", tier: String(b.tier) })}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-amber-600 dark:text-amber-400">
                          Rp {b.amount.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                            b.status === "pending"
                              ? "border-amber-500/30 text-amber-600 bg-amber-500/10"
                              : b.status === "paid"
                              ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                              : "border-destructive/30 text-destructive bg-destructive/10"
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {totalBonusPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/20">
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.salesCommissions.pageOf", undefined, { page: String(bonusPage), total: String(totalBonusPages) })}
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={bonusPage <= 1}
                    onClick={() => setBonusPage((p) => p - 1)}
                    className="gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    {t("dashboard.salesCommissions.previous")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={bonusPage >= totalBonusPages}
                    onClick={() => setBonusPage((p) => p + 1)}
                    className="gap-1"
                  >
                    {t("dashboard.salesCommissions.next")}
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
