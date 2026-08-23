"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { useActiveTenant } from "@/lib/tenant-store";
import { request } from "@/lib/api/client";
import Link from "next/link";
import {
  BarChart3, Loader2, Globe, ArrowUpRight,
  MousePointerClick, TrendingUp, X, Sparkles
} from "lucide-react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, DatePicker } from "@/components/ui";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/toast-provider";
import { useI18n } from "@/lib/i18n/context";

interface PageViewStat {
  date: string;
  count: number;
}

interface PathStat {
  path: string;
  count: number;
}

interface ReferrerStat {
  referrer: string;
  count: number;
}

interface AnalyticsData {
  total_pageviews: number;
  total_pageviews_previous_period: number;
  unique_visitors: number;
  avg_session_seconds: number;
  total_leads: number;
  plan: string;
  pageviews_by_date: PageViewStat[];
  pageviews_by_path: PathStat[];
  pageviews_by_referrer: ReferrerStat[];
}

function formatDuration(seconds: number, locale: string): string {
  const secUnit = locale === "id" ? "d" : "s";
  if (!seconds || seconds <= 0) return `0${secUnit}`;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}${secUnit}` : `${s}${secUnit}`;
}

interface Site {
  id: number;
  name: string;
}

const PRESETS = [
  { labelKey: "dashboard.analytics.preset7", days: 7 },
  { labelKey: "dashboard.analytics.preset30", days: 30 },
  { labelKey: "dashboard.analytics.preset90", days: 90 },
];

const fmt = (d: Date) => d.toISOString().split("T")[0];

function periodComparison(current: number, previous: number): { pct: number; up: boolean } | null {
  if (previous <= 0) return null;
  const pct = Math.round(((current - previous) / previous) * 100);
  return { pct: Math.abs(pct), up: pct >= 0 };
}

export default function AnalyticsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const { t, locale } = useI18n();
  const { activeTenantId } = useActiveTenant();

  const [sites, setSites] = useState<Site[]>([]);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePoint, setActivePoint] = useState<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  const [selectedSiteId, setSelectedSiteId] = useState("all");
  const [fromStr, setFromStr] = useState(fmt(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [toStr, setToStr] = useState(fmt(new Date()));

  const [showUpsell, setShowUpsell] = useState(false);
  const [pendingRange, setPendingRange] = useState<{ from: string; to: string } | null>(null);

  const isFreePlan = data?.plan === "free";
  const maxDays = isFreePlan ? 7 : 90;
  const currentPreset = PRESETS.find(
    (p) => fromStr === fmt(new Date(Date.now() - p.days * 24 * 60 * 60 * 1000)) && toStr === fmt(new Date())
  );

  const fetchData = async () => {
    if (!token || !activeTenantId) return;
    try {
      setLoading(true);
      if (sites.length === 0) {
        const sitesRes = await request<Site[]>("/sites", {
          headers: { "X-Tenant-ID": activeTenantId.toString() }
        }, token);
        setSites(sitesRes.data || []);
      }

      let query = `/analytics?from=${fromStr}&to=${toStr}`;
      if (selectedSiteId && selectedSiteId !== "all") {
        query += `&site_id=${selectedSiteId}`;
      }

      const statsRes = await request<AnalyticsData>(query, {
        headers: { "X-Tenant-ID": activeTenantId.toString() }
      }, token);
      setData(statsRes.data);
    } catch (err: any) {
      pushToast(err.message || t("dashboard.analytics.loadFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTenantId) {
      fetchData();
    }
  }, [activeTenantId, selectedSiteId, fromStr, toStr]);

  const handlePreset = (days: number) => {
    const from = fmt(new Date(Date.now() - days * 24 * 60 * 60 * 1000));
    const to = fmt(new Date());
    if (days > maxDays) {
      setPendingRange({ from, to });
      setShowUpsell(true);
      return;
    }
    setFromStr(from);
    setToStr(to);
  };

  const handleManualDate = (type: "from" | "to", value: string) => {
    const nextFrom = type === "from" ? value : fromStr;
    const nextTo = type === "to" ? value : toStr;
    if (new Date(nextFrom).getTime() > new Date(nextTo).getTime()) {
      pushToast(t("dashboard.analytics.invalidDateRange"), "error");
      return;
    }
    const diffMs = new Date(nextTo).getTime() - new Date(nextFrom).getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays > maxDays) {
      setPendingRange({ from: nextFrom, to: nextTo });
      setShowUpsell(true);
      return;
    }
    if (type === "from") setFromStr(value);
    else setToStr(value);
  };

  const continuousChartData = React.useMemo(() => {
    if (!data?.pageviews_by_date) return [];
    const statMap = new Map<string, number>();
    for (const item of data.pageviews_by_date) {
      statMap.set(item.date, item.count);
    }
    const result: PageViewStat[] = [];
    const start = new Date(fromStr);
    const end = new Date(toStr);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
      return data.pageviews_by_date;
    }
    const curr = new Date(start);
    let iter = 0;
    while (curr <= end && iter < 366) {
      const dStr = fmt(curr);
      result.push({
        date: dStr,
        count: statMap.get(dStr) || 0,
      });
      curr.setDate(curr.getDate() + 1);
      iter++;
    }
    return result;
  }, [data?.pageviews_by_date, fromStr, toStr]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center h-80 gap-3">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
        <p className="text-xs text-muted-foreground">{t("dashboard.analytics.loading")}</p>
      </div>
    );
  }

  const renderLineChart = (chartData: PageViewStat[]) => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
          {t("dashboard.analytics.noChartData")}
        </div>
      );
    }

    const maxCount = Math.max(...chartData.map(d => d.count), 10);
    const height = 220;
    const width = 720;
    const paddingLeft = 44;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 36;

    const graphHeight = height - paddingTop - paddingBottom;
    const graphWidth = width - paddingLeft - paddingRight;

    const points = chartData.map((d, idx) => {
      const x = paddingLeft + (idx / (chartData.length - 1 || 1)) * graphWidth;
      const y = paddingTop + graphHeight - (d.count / maxCount) * graphHeight;
      return { x, y, label: d.date, value: d.count };
    });

    const pathD = points.reduce((acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), "");
    const areaD = points.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${paddingTop + graphHeight} L ${points[0].x} ${paddingTop + graphHeight} Z` : "";

    return (
      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible" preserveAspectRatio="none" role="img" aria-label={t("dashboard.analytics.chartAria")}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--primary)', stopOpacity: 0.22 }} />
              <stop offset="100%" style={{ stopColor: 'var(--primary)', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          <line x1={paddingLeft} y1={paddingTop} x2={width - paddingRight} y2={paddingTop} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="4" />
          <line x1={paddingLeft} y1={paddingTop + graphHeight / 2} x2={width - paddingRight} y2={paddingTop + graphHeight / 2} className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="1" strokeDasharray="4" />
          <line x1={paddingLeft} y1={paddingTop + graphHeight} x2={width - paddingRight} y2={paddingTop + graphHeight} className="stroke-slate-300 dark:stroke-slate-700" strokeWidth="1" />

          <text x={paddingLeft - 12} y={paddingTop + 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">{maxCount}</text>
          <text x={paddingLeft - 12} y={paddingTop + graphHeight / 2 + 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">{Math.round(maxCount / 2)}</text>
          <text x={paddingLeft - 12} y={paddingTop + graphHeight + 4} textAnchor="end" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono">0</text>

          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {pathD && (
            <path
              ref={(el) => { pathRef.current = el; }}
              d={pathD}
              fill="none"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              stroke="var(--primary)"
            />
          )}

          {points.map((p, idx) => {
            const isActive = activePoint === idx;
            const tooltipId = `pv-tooltip-${idx}`;
            return (
              <g key={idx} className="group/point">
                {/* Mobile touch hit area */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={20}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => setActivePoint((cur) => (cur === idx ? null : idx))}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isActive ? 6 : 5}
                  fill="var(--primary)"
                  stroke="#fff"
                  strokeWidth="1.5"
                  className="transition-all pointer-events-none sm:pointer-events-auto"
                  tabIndex={0}
                  role="button"
                  aria-describedby={tooltipId}
                  onFocus={() => setActivePoint(idx)}
                  onBlur={() => setActivePoint((cur) => (cur === idx ? null : cur))}
                  onMouseEnter={() => setActivePoint(idx)}
                  onMouseLeave={() => setActivePoint((cur) => (cur === idx ? null : cur))}
                  onClick={() => setActivePoint((cur) => (cur === idx ? null : idx))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePoint((cur) => (cur === idx ? null : idx));
                    } else if (e.key === "ArrowRight") {
                      setActivePoint((cur) => (cur === null ? 0 : Math.min(points.length - 1, cur + 1)));
                    } else if (e.key === "ArrowLeft") {
                      setActivePoint((cur) => (cur === null ? 0 : Math.max(0, cur - 1)));
                    }
                  }}
                />

                <g
                  id={tooltipId}
                  className={`pointer-events-none transition-opacity duration-150 ${isActive ? "opacity-100" : "opacity-0"}`}
                >
                  {isActive && (
                    <circle cx={p.x} cy={p.y} r={12} fill="none" stroke="var(--primary-foreground)" strokeWidth={2} opacity={0.18} />
                  )}
                  <rect x={p.x - 36} y={p.y - 44} width="72" height="28" rx="6" fill="#0b1220" opacity={0.96} />
                  <text x={p.x} y={p.y - 26} textAnchor="middle" className="fill-white text-[11px] font-bold font-sans">{p.value} PVs</text>
                </g>
              </g>
            );
          })}

          {points.filter((_, i) => i % Math.max(Math.round(points.length / 5), 1) === 0 || i === points.length - 1).map((p, idx) => {
            let shortDate = p.label;
            try { shortDate = new Date(p.label).toLocaleDateString(locale === "id" ? "id-ID" : "en-US", { day: "numeric", month: "short" }); } catch {}
            return (
              <text key={idx} x={p.x} y={paddingTop + graphHeight + 20} textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono font-medium">{shortDate}</text>
            );
          })}
        </svg>
      </div>
    );
  };

  const comp = data ? periodComparison(data.total_pageviews, data.total_pageviews_previous_period) : null;

  return (
    <div className="space-y-6">
      <div aria-live="polite" className="sr-only">
        {activePoint !== null ? t("dashboard.analytics.srActivePoint", undefined, { date: continuousChartData[activePoint]?.date || '', count: String(continuousChartData[activePoint]?.count || 0) }) : ''}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Globe className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 border rounded-xl text-sm outline-none focus:border-primary bg-card"
            aria-label={t("dashboard.analytics.selectSite")}
          >
            <option value="all">{t("dashboard.leads.allWebsites")}</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {PRESETS.map((p) => {
            const isActive = currentPreset?.days === p.days;
            return (
              <button
                key={p.days}
                onClick={() => handlePreset(p.days)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {t(p.labelKey)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <DatePicker value={fromStr} onChange={(v) => handleManualDate("from", v)} />
          <span className="text-sm font-semibold text-slate-400">{t("dashboard.analytics.to")}</span>
          <DatePicker value={toStr} onChange={(v) => handleManualDate("to", v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("dashboard.analytics.statPageviews")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">{data?.total_pageviews || 0}</div>
            {comp ? (
              <div className={`text-[10px] font-bold flex items-center gap-1 ${comp.up ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                <TrendingUp className={`w-3.5 h-3.5 ${comp.up ? "" : "rotate-180"}`} />
                {comp.up ? t("dashboard.analytics.up") : t("dashboard.analytics.down")} {comp.pct}% {t("dashboard.analytics.fromPrevPeriod")}
              </div>
            ) : (
              <div className="text-[10px] text-slate-400">{t("dashboard.analytics.prevPeriodComp")}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("dashboard.analytics.statUniqueVisitors")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">{data?.unique_visitors ?? 0}</div>
            <div className="text-[10px] text-slate-400">{t("dashboard.analytics.visitorsEstimate")}</div>
          </CardContent>
        </Card>

        <Card className="border-border/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t("dashboard.analytics.statAvgDuration")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-3xl font-black text-foreground">{formatDuration(data?.avg_session_seconds ?? 0, locale)}</div>
            <div className="text-[10px] text-slate-400">{t("dashboard.analytics.durationNote")}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <Card className="border-border/40 shadow-sm relative">
          {loading && (
            <div className="absolute inset-0 z-10 bg-background/60 flex items-center justify-center rounded-xl">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
          <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                {t("dashboard.analytics.dailyVisitsTitle")}
              </CardTitle>
              <CardDescription className="text-xs">{t("dashboard.analytics.dailyVisitsDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            {renderLineChart(continuousChartData)}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="p-4 bg-muted/40 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <MousePointerClick className="w-4 h-4 text-primary" />
                {t("dashboard.analytics.leadsIn")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-1">
              <div className="text-3xl font-black text-foreground">{data?.total_leads ?? 0}</div>
              <div className="text-[10px] text-slate-400">
                {t("dashboard.analytics.leadsFromForms")}
                {data?.total_pageviews ? t("dashboard.analytics.conversion", undefined, { pct: ((data.total_leads / data.total_pageviews) * 100).toFixed(1) }) : ""}
              </div>
              <Link href="/dashboard/leads" className="text-xs text-primary font-semibold hover:underline inline-block mt-2">
                {t("dashboard.analytics.viewAllLeads")} →
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm">
            <CardHeader className="p-4 bg-muted/40 border-b border-border/40">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ArrowUpRight className="w-4 h-4 text-primary" />
                {t("dashboard.analytics.trafficSources")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {data?.pageviews_by_referrer && data.pageviews_by_referrer.length > 0 ? (
                <div className="space-y-3">
                  {(() => {
                    const maxCount = Math.max(...data.pageviews_by_referrer.map(r => r.count), 1);
                    return data.pageviews_by_referrer.map((r, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-foreground">{r.referrer}</span>
                          <span className="font-bold">{r.count} PVs</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted/40 overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(r.count / maxCount) * 100}%` }}
                          />
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-6">{t("dashboard.analytics.noReferrerData")}</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog
        open={showUpsell}
        onOpenChange={setShowUpsell}
        title={t("dashboard.analytics.upsellTitle")}
        footer={
          <>
            <Button variant="outline" onClick={() => setShowUpsell(false)}>
              {t("dashboard.analytics.later")}
            </Button>
            <Button onClick={() => {
              window.open("/dashboard/upgrade", "_blank");
              setShowUpsell(false);
            }}>
              <Sparkles className="w-4 h-4" />
              {t("dashboard.analytics.upgradeToPro")}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
              <X className="w-3 h-3 text-white" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-300">{t("dashboard.analytics.free7Days")}</p>
              <p className="text-amber-700 dark:text-amber-400 mt-1">
                {t("dashboard.analytics.free7DaysDesc")}
                {pendingRange && (
                  <> {t("dashboard.analytics.selectedRange", undefined, { from: pendingRange.from, to: pendingRange.to })}</>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
            <div className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-blue-800 dark:text-blue-300">{t("dashboard.analytics.proUpgrade")}</p>
              <p className="text-blue-700 dark:text-blue-400 mt-1">
                {t("dashboard.analytics.proUpgradeDesc")}
              </p>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
