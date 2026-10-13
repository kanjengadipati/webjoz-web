"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Cpu, Loader2, CheckCircle2, XCircle, Clock, RefreshCw, KeyRound, Server, Zap, Gauge } from "lucide-react";
import { Card, CardContent, Button } from "webjoz-ui";
import { useI18n } from "@/lib/i18n/context";

interface AiProviderStatus {
  tier: string;
  purpose?: string;
  kind: string;
  provider: string;
  base_url: string;
  model: string;
  api_key_configured: boolean;
  requires_key: boolean;
  status: "ok" | "error" | "not_configured" | "skipped";
  http_status?: number;
  latency_ms?: number;
  error?: string;
}

interface AiStatusReport {
  enabled: boolean;
  primary_provider: string;
  primary_model: string;
  primary_base_url: string;
  tpm_quota: number;
  providers: AiProviderStatus[];
  generated_at: string;
}

interface TokenModelSum {
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  requests: number;
  generate_count: number;
}

interface RateLimitInfo {
  source?: string;
  window?: string;
  limit_requests?: number;
  remaining_requests?: number;
  reset_requests?: string;
  limit_tokens?: number;
  remaining_tokens?: number;
  reset_tokens?: string;
  quota_metric?: string;
  quota_id?: string;
  quota_value?: string;
  retry_after_seconds?: number;
  captured_at?: string;
}

interface TokenSlotSum {
  slot: string;
  provider: string;
  base_url: string;
  model: string;
  key_hint: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  requests: number;
  generate_count: number;
  rate_limit?: RateLimitInfo | null;
}

interface TokenTotals {
  tokens_total: number;
  ai_requests_total: number;
  generate_count: number;
}

interface TokenCapacity {
  tpm_quota: number;
  avg_tokens_per_web: number;
  webs_per_minute: number;
  webs_per_hour: number;
  webs_per_day_approx: number;
  note: string;
}

interface TokenUsageResponse {
  totals: TokenTotals;
  by_model: TokenModelSum[] | null;
  by_slot: TokenSlotSum[] | null;
  capacity?: TokenCapacity;
}

function formatNumber(value?: number) {
  return (value ?? 0).toLocaleString("id-ID");
}

// slotKeyOf menormalkan (provider, base_url, model) agar kartu provider dapat
// dicocokkan dengan agregat per-slot dari backend. Base URL di-trim slash akhir
// dan provider di-lowercase; model dibiarkan apa adanya (case-sensitive).
function slotKeyOf(provider: string, baseUrl: string, model: string) {
  return `${(provider || "").toLowerCase()}|${(baseUrl || "").replace(/\/+$/, "")}|${model || ""}`;
}

function todayUsagePath() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  return `/ai/admin/metrics/ai-generation/token-usage?date_from=${encodeURIComponent(start.toISOString())}&date_to=${encodeURIComponent(end.toISOString())}`;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const statusTone: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  ok: { text: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/25", dot: "bg-green-500" },
  error: { text: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/25", dot: "bg-red-500" },
  not_configured: { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/25", dot: "bg-amber-500" },
  skipped: { text: "text-muted-foreground", bg: "bg-muted/30", border: "border-border/40", dot: "bg-muted-foreground/40" },
};

const statusLabelKey: Record<string, string> = {
  ok: "dashboard.adminAiStatus.statusOk",
  error: "dashboard.adminAiStatus.statusError",
  not_configured: "dashboard.adminAiStatus.statusNotConfigured",
  skipped: "dashboard.adminAiStatus.statusSkipped",
};

export default function AdminAiStatusPage() {
  const token = useAuthToken();
  const { role } = usePermissions();
  const { t } = useI18n();
  const [report, setReport] = useState<AiStatusReport | null>(null);
  const [usage, setUsage] = useState<TokenUsageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const isSuperAdmin = role === "superadmin";

  const fetchStatus = useCallback(async (silent = false) => {
    if (!token || !isSuperAdmin) return;
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      const [statusRes, usageRes] = await Promise.all([
        request<AiStatusReport>("/admin/ai/status", {}, token),
        request<TokenUsageResponse>(todayUsagePath(), {}, token).catch(() => null),
      ]);
      setReport(statusRes.data);
      setUsage(usageRes?.data ?? null);
      setLastChecked(new Date());
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || t("dashboard.adminAiStatus.loadFailed"));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, isSuperAdmin, t]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(() => fetchStatus(true), 15000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const usageByModel = useMemo(() => {
    const map = new Map<string, TokenModelSum>();
    for (const u of usage?.by_model ?? []) map.set(u.model, u);
    return map;
  }, [usage]);

  // Agregat per slot provider/key dari backend, di-key dengan
  // (provider|base_url|model) supaya bisa dicocokkan ke kartu provider.
  const usageBySlot = useMemo(() => {
    const map = new Map<string, TokenSlotSum>();
    for (const s of usage?.by_slot ?? []) {
      map.set(slotKeyOf(s.provider, s.base_url, s.model), s);
    }
    return map;
  }, [usage]);

  const maxModelTokens = useMemo(() => {
    const slotMax = Math.max(0, ...(usage?.by_slot ?? []).map((u) => u.total_tokens));
    if (slotMax > 0) return slotMax;
    return Math.max(1, ...(usage?.by_model ?? []).map((u) => u.total_tokens));
  }, [usage]);

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Cpu className="size-12 opacity-40" />
        <p className="text-sm">{t("dashboard.adminAiStatus.noAccess")}</p>
      </div>
    );
  }

  const allOk = report ? report.providers.length > 0 && report.providers.every((p) => p.status === "ok") : false;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Cpu className="size-5 text-primary" />
            {t("dashboard.adminAiStatus.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("dashboard.adminAiStatus.subtitle")}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchStatus(true)}
          disabled={refreshing}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          {t("dashboard.adminAiStatus.refresh")}
        </Button>
      </div>

      {/* Loading skeleton */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-border/40 shadow-sm overflow-hidden">
              <CardContent className="p-6 pt-6">
                <div className="flex items-center justify-between animate-pulse">
                  <div className="space-y-2.5 flex-1">
                    <div className="h-3 w-20 rounded bg-muted" />
                    <div className="h-5 w-16 rounded bg-muted" />
                    <div className="h-2.5 w-28 rounded bg-muted/60" />
                  </div>
                  <div className="size-8 rounded-lg bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        /* Error state */
        <Card className="border-destructive/30 shadow-sm">
          <CardContent className="p-6 pt-6 flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
              <Loader2 className="size-4 text-red-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-destructive">{t("dashboard.adminAiStatus.loadFailedTitle")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchStatus()}>
              {t("dashboard.adminAiStatus.retry")}
            </Button>
          </CardContent>
        </Card>
      ) : report ? (
        <>
          {/* Summary metric cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-6 pt-6 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.labelEnabled")}</p>
                <p className={`text-lg font-bold tracking-tight ${report.enabled ? "text-green-500" : "text-red-500"}`}>
                  {report.enabled ? t("dashboard.adminAiStatus.valueYes") : t("dashboard.adminAiStatus.valueNo")}
                </p>
                {!report.enabled && <p className="text-[11px] text-muted-foreground">{t("dashboard.adminAiStatus.aiDisabled")}</p>}
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-6 pt-6 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.labelProvider")}</p>
                <p className="text-lg font-bold tracking-tight truncate">{report.primary_provider || "—"}</p>
                <p className="text-[11px] text-muted-foreground truncate">{report.primary_base_url || "—"}</p>
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-6 pt-6 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.labelModel")}</p>
                <p className="text-lg font-bold tracking-tight truncate">{report.primary_model || "—"}</p>
              </CardContent>
            </Card>
            <Card className="border-border/40 shadow-sm">
              <CardContent className="p-6 pt-6 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.labelTpmQuota")}</p>
                <p className="text-lg font-bold tracking-tight">{report.tpm_quota ? report.tpm_quota.toLocaleString("id-ID") : "—"}</p>
                <p className="text-[11px] text-muted-foreground">{t("dashboard.adminAiStatus.tpmPerMinute")}</p>
              </CardContent>
            </Card>
          </div>

          {/* Provider list */}
          <div>
            <h2 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              <Server className="size-4 text-muted-foreground" />
              {t("dashboard.adminAiStatus.labelProviders")}
              <span className="text-xs font-medium text-muted-foreground">({report.providers.length})</span>
            </h2>
            {report.providers.length === 0 ? (
              <Card className="border-border/40 shadow-sm">
                <CardContent className="p-6 pt-6 text-sm text-muted-foreground">{t("dashboard.adminAiStatus.noProviders")}</CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {report.providers.map((p, i) => {
                  const tone = statusTone[p.status] ?? statusTone.skipped;
                  const slot = usageBySlot.get(slotKeyOf(p.provider, p.base_url, p.model));
                  const used = slot ?? (p.model ? usageByModel.get(p.model) : undefined);
                  const pct = used ? Math.round((used.total_tokens / maxModelTokens) * 100) : 0;
                  const rl = slot?.rate_limit ?? null;
                  const rlLimit = rl
                    ? rl.limit_tokens != null
                      ? `${formatNumber(rl.limit_tokens)} ${t("dashboard.adminAiStatus.colTokens")}`
                      : rl.limit_requests != null
                        ? `${formatNumber(rl.limit_requests)} ${t("dashboard.adminAiStatus.colRequests")}`
                        : rl.quota_value
                          ? rl.quota_value
                          : null
                    : null;
                  const rlRemaining = rl
                    ? rl.remaining_tokens != null
                      ? `${formatNumber(rl.remaining_tokens)} ${t("dashboard.adminAiStatus.colTokens")}`
                      : rl.remaining_requests != null
                        ? `${formatNumber(rl.remaining_requests)} ${t("dashboard.adminAiStatus.colRequests")}`
                        : null
                    : null;
                  const rlWindow =
                    rl?.window === "day"
                      ? t("dashboard.adminAiStatus.ratePerDay")
                      : rl?.window === "minute"
                        ? t("dashboard.adminAiStatus.ratePerMinute")
                        : "";
                  return (
                    <Card key={`${p.tier}-${i}`} className={`border shadow-sm ${tone.border}`}>
                      <CardContent className="p-5 pt-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`relative flex h-2 w-2 ${tone.dot}`} />
                              <p className="text-sm font-bold text-foreground truncate">{p.provider || "—"}</p>
                              <span className="px-1.5 py-0.5 rounded-md bg-background border border-border/50 text-[9.5px] font-semibold tracking-wider text-foreground/70">
                                {p.tier}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md bg-muted/60 border border-border/40 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {p.kind}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-semibold uppercase tracking-wider ${tone.text} ${tone.bg}`}>
                                {t(statusLabelKey[p.status] ?? "dashboard.adminAiStatus.statusSkipped")}
                              </span>
                            </div>
                            {p.model && <p className="text-[11px] font-mono text-muted-foreground truncate">{p.model}</p>}
                            {p.base_url && <p className="text-[10.5px] text-muted-foreground/70 font-mono truncate">{p.base_url}</p>}
                          </div>
                          <div className="shrink-0 flex items-center gap-1 text-[11px] font-medium">
                            {p.requires_key ? (
                              <span className={`inline-flex items-center gap-1 ${p.api_key_configured ? "text-green-500" : "text-amber-500"}`}>
                                <KeyRound className="size-3.5" />
                                {p.api_key_configured ? t("dashboard.adminAiStatus.keyConfigured") : t("dashboard.adminAiStatus.keyMissing")}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-muted-foreground">
                                <Zap className="size-3.5" />
                                {t("dashboard.adminAiStatus.noKeyRequired")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
                          <div className="flex items-center gap-3">
                            {p.status === "ok" ? (
                              <span className="inline-flex items-center gap-1 text-green-500">
                                <CheckCircle2 className="size-3.5" />
                                {p.latency_ms != null ? `${p.latency_ms} ms` : "ok"}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-red-500">
                                <XCircle className="size-3.5" />
                                {p.error || "—"}
                              </span>
                            )}
                          </div>
                          {p.http_status ? <span className="font-mono text-muted-foreground/70">HTTP {p.http_status}</span> : null}
                        </div>

                        {usage && (
                          <div className="mt-2.5 pt-2.5 border-t border-border/40">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                {t("dashboard.adminAiStatus.usageProviderLabel")}
                              </span>
                              {used ? (
                                <span className="text-[11px] text-muted-foreground tabular-nums">
                                  <b className="text-foreground">{formatNumber(used.total_tokens)}</b> {t("dashboard.adminAiStatus.colTokens")} ·{" "}
                                  <b className="text-foreground">{formatNumber(used.requests)}</b> {t("dashboard.adminAiStatus.colRequests")}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">{t("dashboard.adminAiStatus.notUsedToday")}</span>
                              )}
                            </div>
                            <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                              <div className="h-full rounded-full bg-primary/70" style={{ width: `${pct}%` }} />
                            </div>
                            {rl && (
                              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-muted-foreground">
                                <Gauge className="size-3 shrink-0" />
                                {rlLimit ? (
                                  <span>
                                    {t("dashboard.adminAiStatus.rateLimitLabel")}:{" "}
                                    <b className="text-foreground/80">{rlLimit}</b>
                                    {rlWindow ? <span className="text-muted-foreground/70"> {rlWindow}</span> : null}
                                  </span>
                                ) : (
                                  <span>{t("dashboard.adminAiStatus.rateLimitLabel")}: {t("dashboard.adminAiStatus.rateLimitUnknown")}</span>
                                )}
                                {rlRemaining && (
                                  <span>
                                    · {t("dashboard.adminAiStatus.rateLimitRemaining")}:{" "}
                                    <b className="text-foreground/80">{rlRemaining}</b>
                                  </span>
                                )}
                                {rl.source === "error_429" && (
                                  <span className="rounded bg-amber-500/15 px-1 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                                    429
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

            {usage && (
              <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-4">
                  <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-4 pt-4 space-y-0.5">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.usageTotalTokens")}</p>
                      <p className="text-base font-bold tabular-nums">{formatNumber(usage.totals.tokens_total)}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-4 pt-4 space-y-0.5">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.usageTotalRequests")}</p>
                      <p className="text-base font-bold tabular-nums">{formatNumber(usage.totals.ai_requests_total)}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-4 pt-4 space-y-0.5">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.usageTotalGenerates")}</p>
                      <p className="text-base font-bold tabular-nums">{formatNumber(usage.totals.generate_count)}</p>
                    </CardContent>
                  </Card>
                  <Card className="border-border/40 shadow-sm">
                    <CardContent className="p-4 pt-4 space-y-0.5">
                      <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{t("dashboard.adminAiStatus.usageAvgPerGenerate")}</p>
                      <p className="text-base font-bold tabular-nums">
                        {usage.totals.generate_count > 0 ? formatNumber(Math.round(usage.totals.tokens_total / usage.totals.generate_count)) : "—"}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {usage.capacity && (
                  <Card className="border-border/40 shadow-sm mt-3">
                    <CardContent className="p-5 pt-5">
                      <p className="text-xs font-semibold text-foreground mb-2">{t("dashboard.adminAiStatus.capacityTitle")}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                        <span>{t("dashboard.adminAiStatus.capacityTpm")}: <b className="text-foreground">{formatNumber(usage.capacity.tpm_quota)}</b></span>
                        <span>{t("dashboard.adminAiStatus.capacityAvgTokens")}: <b className="text-foreground">{formatNumber(Math.round(usage.capacity.avg_tokens_per_web))}</b></span>
                        <span>{t("dashboard.adminAiStatus.capacityWebsMin")}: <b className="text-foreground">{usage.capacity.webs_per_minute.toFixed(2)}</b></span>
                        <span>{t("dashboard.adminAiStatus.capacityWebsHour")}: <b className="text-foreground">{usage.capacity.webs_per_hour.toFixed(1)}</b></span>
                        <span>{t("dashboard.adminAiStatus.capacityWebsDay")}: <b className="text-foreground">{usage.capacity.webs_per_day_approx.toFixed(0)}</b></span>
                      </div>
                      {usage.capacity.note && <p className="text-[11px] text-muted-foreground/80 mt-2">{usage.capacity.note}</p>}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

          {/* Footer: last checked + summary */}
          <div className="flex items-center justify-between border-t border-border/30 pt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {lastChecked ? (
                <>{t("dashboard.adminAiStatus.lastCheckedAt")} <span className="font-semibold text-foreground/70">{formatTime(lastChecked)}</span></>
              ) : (
                t("dashboard.adminAiStatus.neverChecked")
              )}
            </div>
            {report.providers.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className={`inline-block size-1.5 rounded-full ${allOk ? "bg-green-500" : "bg-yellow-500"}`} />
                {allOk ? t("dashboard.adminAiStatus.allProvidersOk") : t("dashboard.adminAiStatus.someIssues")}
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}