"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, SkeletonBlock } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import { useI18n } from "@/lib/i18n/context";
import { UsageMeter, type UsageData, type UsageLimits } from "@/components/dashboard/usage-meter";
import type { PlanItem } from "@/components/pricing-cards";
import {
  ArrowUpRight,
  Calendar,
  Clock,
  CreditCard,
  Sparkles,
  Zap,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface UsageResponse {
  usage: {
    generate_count: number;
    section_regen_count: number;
    design_regen_count: number;
  };
  max_ai_generates: number;
  max_section_regens: number;
  max_design_regens: number;
  max_sites: number;
}

export default function UsagePage() {
  const { t, locale } = useI18n();
  const { pushToast } = useToast();
  const token = useAuthToken();
  const { activeTenant } = useActiveTenant();
  const activeTenantId = activeTenant?.tenant?.id;

  const [usageData, setUsageData] = useState<UsageResponse | null>(null);
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [siteCount, setSiteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !activeTenantId) return;

    let active = true;
    setLoading(true);

    const fetchAll = async () => {
      try {
        const [usageRes, plansRes, sitesRes] = await Promise.allSettled([
          request<UsageResponse>(`/tenants/${activeTenantId}/usage`, {
            headers: { "X-Tenant-ID": String(activeTenantId) },
          }, token),
          request<PlanItem[]>("/plans/active", {}, token),
          request<any[]>("/sites", {
            headers: { "X-Tenant-ID": String(activeTenantId) },
          }, token),
        ]);

        if (!active) return;

        if (usageRes.status === "fulfilled") setUsageData(usageRes.value.data);
        if (plansRes.status === "fulfilled") setPlans(plansRes.value.data);
        if (sitesRes.status === "fulfilled") {
          const sites = sitesRes.value.data;
          setSiteCount(Array.isArray(sites) ? sites.length : 0);
        }
      } catch {
        if (active) pushToast(t("dashboard.usage.loadFailed"), "error");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAll();
    return () => { active = false; };
  }, [token, activeTenantId, t, pushToast]);

  const currentPlanSlug = activeTenant?.tenant?.plan || "free";
  const currentPlan = useMemo(
    () => plans.find((p) => p.slug === currentPlanSlug) || null,
    [plans, currentPlanSlug],
  );

  const usage: UsageData = useMemo(() => ({
    sites: siteCount,
    generates: usageData?.usage.generate_count ?? 0,
    sectionRegens: usageData?.usage.section_regen_count ?? 0,
    designRegens: usageData?.usage.design_regen_count ?? 0,
  }), [usageData, siteCount]);

  const limits: UsageLimits = useMemo(() => ({
    maxSites: currentPlan?.max_sites ?? 1,
    maxGenerates: currentPlan?.max_ai_generates ?? 0,
    maxSectionRegens: currentPlan?.max_section_regens ?? 0,
    maxDesignRegens: currentPlan?.max_design_regens ?? 0,
  }), [currentPlan]);

  const overLimit = useMemo(() => {
    if (!currentPlan) return [];
    const items: { label: string; used: number; max: number }[] = [];
    if (currentPlan.max_sites > 0 && siteCount >= currentPlan.max_sites) {
      items.push({ label: t("dashboard.meterWebsites"), used: siteCount, max: currentPlan.max_sites });
    }
    if (currentPlan.max_ai_generates > 0 && usage.generates >= currentPlan.max_ai_generates) {
      items.push({ label: t("dashboard.meterAiGenerate"), used: usage.generates, max: currentPlan.max_ai_generates });
    }
    if (currentPlan.max_section_regens > 0 && usage.sectionRegens >= currentPlan.max_section_regens) {
      items.push({ label: t("dashboard.meterSectionRegen"), used: usage.sectionRegens, max: currentPlan.max_section_regens });
    }
    if (currentPlan.max_design_regens > 0 && usage.designRegens >= currentPlan.max_design_regens) {
      items.push({ label: t("dashboard.meterDesignRegen"), used: usage.designRegens, max: currentPlan.max_design_regens });
    }
    return items;
  }, [currentPlan, siteCount, usage, t]);

  const monthSuffix = locale === "id" ? "/bln" : "/mo";

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonBlock className="h-8 w-48" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
        <SkeletonBlock className="h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Plan Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold tracking-tight">{t("dashboard.usage.currentPlan")}</h2>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              <CreditCard className="size-3" />
              {currentPlan?.name || "Free"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{t("dashboard.usage.planDescription")}</p>
        </div>
        {currentPlanSlug === "free" && (
          <Link href="/dashboard/upgrade">
            <Button size="sm" className="gap-1.5">
              <ArrowUpRight className="size-3.5" />
              {t("dashboard.upgradeToPro")}
            </Button>
          </Link>
        )}
      </div>

      {/* Over-limit Warning */}
      {overLimit.length > 0 && currentPlanSlug !== "free" && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                {t("dashboard.usage.limitWarning")}
              </p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                {overLimit.map((item) => (
                  <li key={item.label}>
                    {item.label}: {item.used} / {item.max} — {t("dashboard.usage.limitReachedDesc")}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage Meters */}
      <UsageMeter usage={usage} limits={limits} siteCount={siteCount} />

      {/* Plan Details Table */}
      {currentPlan && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              {t("dashboard.usage.planLimits")}
            </h3>
            <div className="divide-y divide-border/40">
              <LimitRow
                label={t("dashboard.meterWebsites")}
                used={siteCount}
                max={currentPlan.max_sites}
                t={t}
              />
              <LimitRow
                label={t("dashboard.meterAiGenerate")}
                used={usage.generates}
                max={currentPlan.max_ai_generates}
                t={t}
              />
              <LimitRow
                label={t("dashboard.meterSectionRegen")}
                used={usage.sectionRegens}
                max={currentPlan.max_section_regens}
                t={t}
              />
              <LimitRow
                label={t("dashboard.meterDesignRegen")}
                used={usage.designRegens}
                max={currentPlan.max_design_regens}
                t={t}
              />
              <LimitRow
                label={t("dashboard.usage.teamMembers")}
                used={0}
                max={currentPlan.max_members}
                t={t}
              />
              <LimitRow
                label={t("dashboard.usage.customDomains")}
                used={0}
                max={currentPlan.max_custom_domain}
                t={t}
              />
            </div>

            {/* Billing Period */}
            <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{t("dashboard.usage.resetMonthly")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                <span>{t("dashboard.usage.currentPeriod", undefined, { month: new Date().toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { month: "long", year: "numeric" }) })}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Plans Comparison */}
      {plans.length > 1 && (
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              {t("dashboard.usage.allPlans")}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="text-left py-2 text-xs font-semibold text-muted-foreground">{t("dashboard.usage.feature")}</th>
                    {plans.map((plan) => (
                      <th
                        key={plan.slug}
                        className={`text-center py-2 text-xs font-semibold ${plan.slug === currentPlanSlug ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          {plan.name}
                          {plan.slug === currentPlanSlug && (
                            <CheckCircle2 className="size-3 text-primary" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  <PlanCompareRow
                    label={t("dashboard.meterWebsites")}
                    values={plans.map((p) => p.max_sites)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <PlanCompareRow
                    label={t("dashboard.meterAiGenerate") + monthSuffix}
                    values={plans.map((p) => p.max_ai_generates)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <PlanCompareRow
                    label={t("dashboard.meterSectionRegen") + monthSuffix}
                    values={plans.map((p) => p.max_section_regens)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <PlanCompareRow
                    label={t("dashboard.meterDesignRegen") + monthSuffix}
                    values={plans.map((p) => p.max_design_regens)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <PlanCompareRow
                    label={t("dashboard.usage.teamMembers")}
                    values={plans.map((p) => p.max_members)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <PlanCompareRow
                    label={t("dashboard.usage.customDomains")}
                    values={plans.map((p) => p.max_custom_domain)}
                    currentSlug={currentPlanSlug}
                    planSlugs={plans.map((p) => p.slug)}
                  />
                  <tr className="border-t border-border/40">
                    <td className="py-3 text-xs font-semibold text-muted-foreground">{t("dashboard.usage.price")}</td>
                    {plans.map((plan) => (
                      <td
                        key={plan.slug}
                        className={`text-center py-3 text-xs font-bold ${plan.slug === currentPlanSlug ? "text-primary" : ""}`}
                      >
                        {plan.price_monthly === 0
                          ? t("dashboard.usage.free")
                          : `Rp ${(plan.price_monthly / 1000).toFixed(0)}rb${monthSuffix}`}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {currentPlanSlug === "free" && (
              <div className="mt-4 text-center">
                <Link href="/dashboard/upgrade">
                  <Button size="sm" className="gap-1.5">
                    <ArrowUpRight className="size-3.5" />
                    {t("dashboard.upgradeToPro")}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function LimitRow({
  label,
  used,
  max,
  t,
}: {
  label: string;
  used: number;
  max: number;
  t: (key: string, fallback?: string, params?: Record<string, string>) => string;
}) {
  const isUnlimited = max <= 0;
  const isAtLimit = !isUnlimited && used >= max;
  const pct = isUnlimited ? 100 : Math.min((used / max) * 100, 100);

  return (
    <div className="py-3 flex items-center gap-4">
      <span className="text-sm text-muted-foreground min-w-[140px]">{label}</span>
      <div className="flex-1">
        <div className="h-1.5 rounded-full bg-muted/30 overflow-hidden max-w-xs">
          <div
            className={`h-full rounded-full transition-all duration-500 ${isAtLimit ? "bg-destructive" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className={`text-sm font-semibold tabular-nums min-w-[80px] text-right ${isAtLimit ? "text-destructive" : ""}`}>
        {isUnlimited ? "∞" : `${used} / ${max}`}
      </span>
    </div>
  );
}

function PlanCompareRow({
  label,
  values,
  currentSlug,
  planSlugs,
}: {
  label: string;
  values: number[];
  currentSlug: string;
  planSlugs: string[];
}) {
  return (
    <tr>
      <td className="py-2.5 text-xs text-muted-foreground">{label}</td>
      {values.map((val, i) => (
        <td
          key={planSlugs[i]}
          className={`text-center py-2.5 text-xs font-semibold tabular-nums ${planSlugs[i] === currentSlug ? "text-primary" : ""}`}
        >
          {val <= 0 ? "∞" : val}
        </td>
      ))}
    </tr>
  );
}
