"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Activity, Loader2, Clock, RefreshCw, BarChart3, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, Button } from "@/components/ui";
import { useI18n } from "@/lib/i18n/context";

interface TrendBucket {
  bucket: string;
  avg_ms: number;
  p95_ms: number;
  error_count: number;
  total_count: number;
}

interface GenerationLog {
  id: string;
  request_id: string;
  tenant_id: number | null;
  business_type: string;
  provider: string;
  status: string;
  duration_ms: number;
  stage_breakdown: Record<string, number> | null;
  created_at: string;
}

interface SummaryMetrics {
  avg_duration_ms: number;
  active_requests: number;
  requests_last_24h: number;
}

interface LiveResponse {
  active_requests: number;
}

interface TrendResponse {
  buckets: TrendBucket[];
}

interface LogsResponse {
  logs: GenerationLog[];
  total: number;
  page: number;
}

export default function AdminMetricsPage() {
  const token = useAuthToken();
  const { role } = usePermissions();
  const { t } = useI18n();
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [trendBuckets, setTrendBuckets] = useState<TrendBucket[]>([]);
  const [recentLogs, setRecentLogs] = useState<GenerationLog[]>([]);
  const [activeRequests, setActiveRequests] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const isSuperAdmin = role === "superadmin";

  const fetchAll = useCallback(async (silent = false) => {
    if (!token || !isSuperAdmin) return;
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");

      const [summaryRes, liveRes, trendRes, logsRes] = await Promise.all([
        request<SummaryMetrics>("/admin/metrics/ai-generation", {}, token),
        request<LiveResponse>("/ai/admin/metrics/ai-generation/live", {}, token),
        request<TrendResponse>("/ai/admin/metrics/ai-generation/trend?hours=24", {}, token),
        request<LogsResponse>("/ai/admin/metrics/ai-generation/logs?limit=10&sort_by=created_at&sort_desc=true", {}, token),
      ]);

      setSummary(summaryRes.data);
      setActiveRequests(liveRes.data.active_requests ?? 0);
      setTrendBuckets(trendRes.data.buckets ?? []);
      setRecentLogs(logsRes.data.logs ?? []);
    } catch (err: any) {
      setError(err.message || t("dashboard.adminMetrics.loadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, isSuperAdmin, t]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  const latestTrend = trendBuckets.length > 0 ? trendBuckets[trendBuckets.length - 1] : null;
  const totalRequests = trendBuckets.reduce((sum, b) => sum + b.total_count, 0);
  const totalErrors = trendBuckets.reduce((sum, b) => sum + b.error_count, 0);
  const errorRate = totalRequests > 0 ? ((totalErrors / totalRequests) * 100) : 0;

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Activity className="size-12 opacity-40" />
        <p className="text-sm">{t("dashboard.adminMetrics.noAccess")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <BarChart3 className="size-5 text-primary" />
            {t("dashboard.adminMetrics.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("dashboard.adminMetrics.subtitle")}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchAll(true)}
          disabled={refreshing}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {t("dashboard.adminMetrics.refresh")}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/40 shadow-sm overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="space-y-2.5 animate-pulse">
                  <div className="h-3 w-20 rounded bg-muted" />
                  <div className="h-6 w-16 rounded bg-muted" />
                  <div className="h-2.5 w-28 rounded bg-muted/60" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card className="border-destructive/30 shadow-sm">
          <CardContent className="p-6 pt-6 flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <Loader2 className="size-4 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-destructive">{t("dashboard.adminMetrics.loadFailedTitle")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchAll()}>
              {t("dashboard.adminMetrics.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : summary ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminMetrics.avgDuration")}</p>
                    <p className="text-2xl font-bold tracking-tight">{Math.round(summary.avg_duration_ms)}ms</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.avgDurationDesc")}</p>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Clock className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminMetrics.p95")}</p>
                    <p className="text-2xl font-bold tracking-tight">{latestTrend ? Math.round(latestTrend.p95_ms) : 0}ms</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.p95Desc")}</p>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                    <TrendingUp className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminMetrics.errorRate")}</p>
                    <p className={`text-2xl font-bold tracking-tight ${errorRate > 10 ? "text-red-500" : errorRate > 5 ? "text-yellow-500" : ""}`}>
                      {errorRate.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.errorsOfRequests", undefined, { errors: String(totalErrors), requests: String(totalRequests) })}</p>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <AlertCircle className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-5 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminMetrics.activeRequests")}</p>
                    <p className="text-2xl font-bold tracking-tight">{activeRequests}</p>
                    <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.activeRequestsDesc")}</p>
                  </div>
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                    <BarChart3 className="size-4.5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="p-5 pb-0">
                <h3 className="text-sm font-semibold">{t("dashboard.adminMetrics.trendTitle")}</h3>
                <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.trendDesc")}</p>
              </CardHeader>
              <CardContent className="p-5 pt-4">
                {trendBuckets.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">{t("dashboard.adminMetrics.noTrendData")}</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {trendBuckets.map((b, idx) => {
                      const errPct = b.total_count > 0 ? (b.error_count / b.total_count) * 100 : 0;
                      return (
                        <div key={b.bucket || `trend-${idx}`} className="flex items-center gap-3 py-1">
                          <span className="text-[11px] font-mono w-28 shrink-0 text-muted-foreground truncate">{b.bucket}</span>
                          <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary/70"
                              style={{ width: `${Math.min((b.avg_ms / Math.max(...trendBuckets.map(x => x.avg_ms))) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-14 text-right">{Math.round(b.avg_ms)}ms</span>
                          {errPct > 0 && (
                            <span className="text-[10px] text-red-500 w-10 text-right">{errPct.toFixed(0)}%</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/40 shadow-sm">
              <CardHeader className="p-5 pb-0">
                <h3 className="text-sm font-semibold">{t("dashboard.adminMetrics.recentRequests")}</h3>
                <p className="text-[11px] text-muted-foreground">{t("dashboard.adminMetrics.recentRequestsDesc")}</p>
              </CardHeader>
              <CardContent className="p-5 pt-4">
                {recentLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">{t("dashboard.adminMetrics.noRequestsLogged")}</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {recentLogs.map((log, idx) => (
                      <div key={log.id || `log-${idx}`} className="flex items-center justify-between gap-2 py-1">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium truncate">{log.business_type || log.request_id}</p>
                          <p className="text-[10px] text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-semibold">{log.duration_ms}ms</span>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                            log.status === "ok" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                          }`}>
                            {log.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  );
}
