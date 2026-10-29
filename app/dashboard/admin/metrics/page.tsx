"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Activity, Loader2, Clock, RefreshCw, BarChart3, TrendingUp, AlertCircle, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, FilterX, Eye, X } from "lucide-react";
import { Card, CardContent, CardHeader, Button, CustomSelect } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";

interface TrendBucket {
  bucket: string;
  avg_ms: number;
  p95_ms: number;
  error_count: number;
  total_count: number;
}

interface SectionVariantTrace {
  variant: string;
  source: string;
  picked_by: string;
  candidates?: string[];
  scores?: Record<string, number>;
  confidence?: number;
  reason?: string;
}

interface GenerationLog {
  id: string;
  request_id: string;
  tenant_id: number | null;
  business_type: string;
  business_sub_type?: string | null;
  template_id: string;
  hero_style: string;
  generation_source: number;
  provider: string;
  status: string;
  duration_ms: number;
  stage_breakdown: Record<string, number> | null;
  section_sources: Record<string, string> | null;
  section_variants?: Record<string, SectionVariantTrace> | null;
  failure_reason: string | null;
  tokens_total: number;
  ai_requests_total: number;
  created_at: string;
}

const SOURCE_AI = 1;
const SOURCE_MOCK = 2;
const SOURCE_PARTIAL = 3;

function sourceMeta(source: number): { labelKey: "sourceAI" | "sourcePartial" | "sourceMock"; cls: string } {
  switch (source) {
    case SOURCE_AI:
      return { labelKey: "sourceAI", cls: "bg-emerald-500/10 text-emerald-600" };
    case SOURCE_PARTIAL:
      return { labelKey: "sourcePartial", cls: "bg-amber-500/10 text-amber-600" };
    case SOURCE_MOCK:
      return { labelKey: "sourceMock", cls: "bg-slate-500/10 text-slate-600" };
    default:
      return { labelKey: "sourceAI", cls: "bg-emerald-500/10 text-emerald-600" };
  }
}

function sourceMetaFromStr(source: string): { labelKey: "sourceAI" | "sourcePartial" | "sourceMock"; cls: string } {
  if (source === "mock_fallback") return { labelKey: "sourceMock", cls: "bg-slate-500/10 text-slate-600" };
  if (source === "partial_mock") return { labelKey: "sourcePartial", cls: "bg-amber-500/10 text-amber-600" };
  return { labelKey: "sourceAI", cls: "bg-emerald-500/10 text-emerald-600" };
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
  limit?: number;
}

export default function AdminMetricsPage() {
  const token = useAuthToken();
  const { role } = usePermissions();
  const { t } = useI18n();
  const [summary, setSummary] = useState<SummaryMetrics | null>(null);
  const [trendBuckets, setTrendBuckets] = useState<TrendBucket[]>([]);
  const [recentLogs, setRecentLogs] = useState<GenerationLog[]>([]);
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [providerFilter, setProviderFilter] = useState("all");
  const [activeRequests, setActiveRequests] = useState(0);
  const [variantsDialogOpen, setVariantsDialogOpen] = useState(false);
  const [sourcesDialogOpen, setSourcesDialogOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<GenerationLog | null>(null);
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

      const logsParams = new URLSearchParams({
        limit: String(logsLimit),
        page: String(logsPage),
        sort_by: "created_at",
        sort_desc: "true",
      });
      if (statusFilter !== "all") logsParams.set("status", statusFilter);
      if (sourceFilter !== "all") logsParams.set("source", sourceFilter);
      if (providerFilter !== "all") logsParams.set("provider", providerFilter);

      const [summaryRes, liveRes, trendRes, logsRes] = await Promise.all([
        request<SummaryMetrics>("/admin/metrics/ai-generation", {}, token),
        request<LiveResponse>("/ai/admin/metrics/ai-generation/live", {}, token),
        request<TrendResponse>("/ai/admin/metrics/ai-generation/trend?hours=24", {}, token),
        request<LogsResponse>(`/ai/admin/metrics/ai-generation/logs?${logsParams.toString()}`, {}, token),
      ]);

      setSummary(summaryRes.data);
      setActiveRequests(liveRes.data.active_requests ?? 0);
      setTrendBuckets(trendRes.data.buckets ?? []);
      setRecentLogs(logsRes.data.logs ?? []);
      setLogsTotal(logsRes.data.total ?? 0);
    } catch (err: any) {
      setError(err.message || t("dashboard.adminMetrics.loadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, isSuperAdmin, t, logsLimit, logsPage, statusFilter, sourceFilter, providerFilter]);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(() => fetchAll(true), 15000);
    return () => clearInterval(interval);
  }, [fetchAll]);

  useEffect(() => {
    setLogsPage(1);
  }, [statusFilter, sourceFilter, providerFilter]);

  const totalPages = Math.max(1, Math.ceil(logsTotal / logsLimit));
  const canPrev = logsPage > 1;
  const canNext = logsPage < totalPages;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setLogsPage(page);
  };

  const onLimitChange = (value: string) => {
    const nextLimit = Number(value);
    setLogsLimit(nextLimit);
    setLogsPage(1);
  };

  const resetFilters = () => {
    setStatusFilter("all");
    setSourceFilter("all");
    setProviderFilter("all");
    setLogsPage(1);
  };

  const hasActiveFilters = statusFilter !== "all" || sourceFilter !== "all" || providerFilter !== "all";

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
    <div className="space-y-6 w-full min-w-0 max-w-full">
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
          </div>

          <div className="grid gap-4 w-full min-w-0 max-w-full">
            <Card className="border-border/40 shadow-sm w-full min-w-0 max-w-full overflow-hidden">
              <CardHeader className="p-5 pb-0 flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">AI Generation Logs</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Riwayat generate AI per request dengan detail varian & sumber per section · {logsTotal} total
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">Per halaman</span>
                    <CustomSelect
                      value={String(logsLimit)}
                      onChange={onLimitChange}
                      options={[
                        { value: "10", label: "10" },
                        { value: "25", label: "25" },
                        { value: "50", label: "50" },
                        { value: "100", label: "100" },
                      ]}
                      size="sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5">
                    {[
                      { value: "all", label: "All" },
                      { value: "ok", label: "OK" },
                      { value: "error", label: "Error" },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        size="sm"
                        variant={statusFilter === opt.value ? "default" : "ghost"}
                        className="h-7 px-2.5 text-xs"
                        onClick={() => setStatusFilter(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                  <div className="flex items-center gap-0.5 rounded-lg border border-border/60 bg-muted/20 p-0.5">
                    {[
                      { value: "all", label: "All" },
                      { value: "1", label: "AI" },
                      { value: "3", label: "Partial" },
                      { value: "2", label: "Mock" },
                    ].map((opt) => (
                      <Button
                        key={opt.value}
                        size="sm"
                        variant={sourceFilter === opt.value ? "default" : "ghost"}
                        className="h-7 px-2.5 text-xs"
                        onClick={() => setSourceFilter(opt.value)}
                      >
                        {opt.label}
                      </Button>
                    ))}
                  </div>
                  <CustomSelect
                    value={providerFilter}
                    onChange={setProviderFilter}
                    options={[
                      { value: "all", label: "Provider: All" },
                      { value: "groq", label: "Groq" },
                      { value: "gemini", label: "Gemini" },
                      { value: "openrouter", label: "OpenRouter" },
                      { value: "openai", label: "OpenAI" },
                      { value: "mock", label: "Mock" },
                    ]}
                    size="sm"
                  />
                  {hasActiveFilters && (
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs" onClick={resetFilters}>
                      <FilterX className="size-3.5" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0 pt-4 w-full min-w-0 max-w-full overflow-hidden">
                {recentLogs.length === 0 ? (
                  <p className="text-xs text-muted-foreground px-5 pb-5 py-2">{t("dashboard.adminMetrics.noRequestsLogged")}</p>
                ) : (
                  <>
                    <div className="overflow-x-auto w-full max-w-full">
                      <table className="w-full text-sm min-w-[1250px]">
                        <thead>
                          <tr className="border-y border-border/60 bg-muted/30 whitespace-nowrap">
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5 whitespace-nowrap">Waktu</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Bisnis / Sub Bisnis</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Request ID</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Template</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Hero Varian</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Provider</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Sumber</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Status</th>
                            <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Durasi</th>
                            <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">AI Req / Token</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Section Variants</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2.5 whitespace-nowrap">Section Sources</th>
                            <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-5 py-2.5 whitespace-nowrap">Kegagalan</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentLogs.map((log, idx) => {
                            const src = sourceMeta(log.generation_source);
                            const created = new Date(log.created_at);
                            return (
                              <tr key={log.id || `log-${idx}`} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                                <td className="px-5 py-2.5 align-top whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium">{created.toLocaleDateString("id-ID")}</span>
                                    <span className="text-[10px] text-muted-foreground">{created.toLocaleTimeString("id-ID")}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 align-top max-w-[200px] min-w-[140px]">
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium truncate">{log.business_type || "-"}</span>
                                    <span className="text-[10px] text-muted-foreground truncate">{log.business_sub_type || "-"}</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className="text-[10px] text-muted-foreground font-mono">{log.request_id}</span>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className="text-xs truncate block max-w-[140px]">{log.template_id || "-"}</span>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className="text-xs truncate block max-w-[140px]">{log.hero_style || "-"}</span>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className="text-xs">{log.provider || "-"}</span>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded ${src.cls}`}>
                                    {t(`dashboard.adminMetrics.${src.labelKey}`)}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  <span className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded ${log.status === "ok" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"}`}>
                                    {log.status}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 align-top text-right whitespace-nowrap">
                                  <span className="text-xs font-mono">{log.duration_ms}ms</span>
                                </td>
                                <td className="px-3 py-2.5 align-top text-right whitespace-nowrap">
                                  <div className="flex flex-col text-[10px] text-muted-foreground">
                                    <span>{log.ai_requests_total} req</span>
                                    <span>{log.tokens_total} tok</span>
                                  </div>
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  {log.section_variants && Object.keys(log.section_variants).length > 0 ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 gap-1.5 text-xs"
                                      onClick={() => {
                                        setSelectedLog(log);
                                        setVariantsDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="size-3.5" />
                                      Lihat ({Object.keys(log.section_variants).length})
                                    </Button>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="px-3 py-2.5 align-top whitespace-nowrap">
                                  {log.section_sources && Object.keys(log.section_sources).length > 0 ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 gap-1.5 text-xs"
                                      onClick={() => {
                                        setSelectedLog(log);
                                        setSourcesDialogOpen(true);
                                      }}
                                    >
                                      <Eye className="size-3.5" />
                                      Lihat ({Object.keys(log.section_sources).length})
                                    </Button>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground">-</span>
                                  )}
                                </td>
                                <td className="px-5 py-2.5 align-top min-w-[240px] max-w-[380px]">
                                  {log.failure_reason ? (
                                    <p className="text-[10px] leading-snug text-red-500 dark:text-red-400 line-clamp-2" title={log.failure_reason}>
                                      {log.failure_reason}
                                    </p>
                                  ) : (
                                    <span className="text-[10px] text-muted-foreground">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between px-5 py-3 border-t border-border/60">
                      <p className="text-[11px] text-muted-foreground">
                        Menampilkan {(logsPage - 1) * logsLimit + 1} - {Math.min(logsPage * logsLimit, logsTotal)} dari {logsTotal} data
                      </p>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goToPage(1)} disabled={!canPrev}>
                          <ChevronsLeft className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goToPage(logsPage - 1)} disabled={!canPrev}>
                          <ChevronLeft className="size-3.5" />
                        </Button>
                        <span className="text-[11px] text-muted-foreground px-2">Hal {logsPage} / {totalPages}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goToPage(logsPage + 1)} disabled={!canNext}>
                          <ChevronRight className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => goToPage(totalPages)} disabled={!canNext}>
                          <ChevronsRight className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}

      {variantsDialogOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setVariantsDialogOpen(false); setSelectedLog(null); }} />
          <div className="relative w-[95vw] max-w-6xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Section Variants</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{selectedLog.request_id}</span>
                  <span>•</span>
                  <span>Bisnis: <span className="text-foreground">{selectedLog.business_type || "-"}</span></span>
                  <span>•</span>
                  <span>Sub Bisnis: <span className="text-foreground">{selectedLog.business_sub_type || "-"}</span></span>
                  <span>•</span>
                  <span>Hero Varian: <span className="text-foreground">{selectedLog.hero_style || "-"}</span></span>
                  <span>•</span>
                  <span>Template: <span className="text-foreground">{selectedLog.template_id || "-"}</span></span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setVariantsDialogOpen(false); setSelectedLog(null); }}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="max-h-[calc(90vh-80px)] overflow-auto">
              {selectedLog.section_variants && Object.keys(selectedLog.section_variants).length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b border-border/60">
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-6">Section</th>
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-4">Variant</th>
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-4">Source</th>
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-4">Picked by</th>
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-6">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedLog.section_variants)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([sec, v]) => (
                        <tr key={sec} className="border-b border-border/40 hover:bg-muted/20">
                          <td className="py-2.5 px-6 font-medium whitespace-nowrap">{sec}</td>
                          <td className="py-2.5 px-4 whitespace-nowrap">{v.variant}</td>
                          <td className="py-2.5 px-4 uppercase text-xs whitespace-nowrap">{v.source}</td>
                          <td className="py-2.5 px-4 text-xs whitespace-nowrap">{v.picked_by}</td>
                          <td className="py-2.5 px-6 text-xs text-muted-foreground">{v.reason || "-"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground p-6">Tidak ada data section_variants</p>
              )}
            </div>
          </div>
        </div>
      )}

      {sourcesDialogOpen && selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setSourcesDialogOpen(false); setSelectedLog(null); }} />
          <div className="relative w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-4">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">Section Sources</h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{selectedLog.request_id}</span>
                  <span>•</span>
                  <span>Bisnis: <span className="text-foreground">{selectedLog.business_type || "-"}</span></span>
                  <span>•</span>
                  <span>Sub Bisnis: <span className="text-foreground">{selectedLog.business_sub_type || "-"}</span></span>
                  <span>•</span>
                  <span>Hero Varian: <span className="text-foreground">{selectedLog.hero_style || "-"}</span></span>
                  <span>•</span>
                  <span>Template: <span className="text-foreground">{selectedLog.template_id || "-"}</span></span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setSourcesDialogOpen(false); setSelectedLog(null); }}>
                <X className="size-4" />
              </Button>
            </div>
            <div className="max-h-[calc(90vh-80px)] overflow-auto">
              {selectedLog.section_sources && Object.keys(selectedLog.section_sources).length > 0 ? (
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted/80 backdrop-blur">
                    <tr className="border-b border-border/60">
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-6">Section</th>
                      <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium py-2.5 px-6">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(selectedLog.section_sources)
                      .sort(([a], [b]) => a.localeCompare(b))
                      .map(([sec, ssrc]) => {
                        const meta = sourceMetaFromStr(ssrc);
                        return (
                          <tr key={sec} className="border-b border-border/40 hover:bg-muted/20">
                            <td className="py-2.5 px-6 font-medium whitespace-nowrap">{sec}</td>
                            <td className="py-2.5 px-6">
                              <span className={`inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded ${meta.cls}`}>
                                {t(`dashboard.adminMetrics.${meta.labelKey}`)}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-muted-foreground p-6">Tidak ada data section_sources</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
