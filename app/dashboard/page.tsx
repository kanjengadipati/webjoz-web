"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, MetricCard, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchAuditLogs, fetchProfile, fetchSessions } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { SectionState } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { AuditLog, Profile, Session } from "@/lib/types";

const DASHBOARD_CONFIG = {
  INITIAL_PAGE: 1,
  ITEMS_PER_PAGE: 24,
  RESOURCE_TYPE: "auth",
  TREND_WINDOW_BUCKETS: 7,
} as const;

export default function DashboardOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const refresh = useCallback(async (showToast = true) => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const query = new URLSearchParams({
        page: String(DASHBOARD_CONFIG.INITIAL_PAGE),
        limit: String(DASHBOARD_CONFIG.ITEMS_PER_PAGE),
        resource: DASHBOARD_CONFIG.RESOURCE_TYPE,
      });
      const [profileResponse, logsResponse, sessionsResponse] = await Promise.all([
        fetchProfile(token),
        fetchAuditLogs(token, query),
        fetchSessions(token),
      ]);
      setProfile(profileResponse.data);
      setLogs(logsResponse.data);
      setSessions(sessionsResponse.data);
      setState(SectionState.SUCCESS);
      setLastSyncedAt(new Date());
      if (showToast) {
        pushToast("Dashboard metrics refreshed.", "success");
      }
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : "Failed to load dashboard", "error");
    }
  }, [pushToast, token]);

  useEffect(() => {
    if (!token || state !== SectionState.IDLE) return;
    const timeout = window.setTimeout(() => {
      refresh(false).catch((error) => {
        setState(SectionState.ERROR);
        pushToast(error instanceof Error ? error.message : "Failed to load dashboard", "error");
      });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [pushToast, refresh, state, token]);

  const metrics = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = logs.filter((log) => (log.created_at || "").startsWith(today));
    const failed = logs.filter((log) => log.status?.toLowerCase() === "failed");
    const uniqueIPs = new Set(logs.map((log) => log.ip_address).filter(Boolean));
    return {
      todayAttempts: todayLogs.length,
      failedLogins: failed.length,
      activeSessions: sessions.length,
      uniqueIPs: uniqueIPs.size,
    };
  }, [logs, sessions.length]);

  const barData = useMemo(() => {
    const buckets = new Map<string, number>();
    logs.forEach((log) => {
      const key = (log.created_at || "").slice(5, 10) || "unknown";
      buckets.set(key, (buckets.get(key) || 0) + 1);
    });
    return Array.from(buckets.entries()).slice(-DASHBOARD_CONFIG.TREND_WINDOW_BUCKETS);
  }, [logs]);

  const showMetricSkeletons = state === SectionState.IDLE || state === SectionState.LOADING;
  const hasLoadedActivity = logs.length > 0 || sessions.length > 0;

  const syncLabel = lastSyncedAt
    ? `Last synced ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : token
      ? state === SectionState.LOADING
        ? "Syncing data..."
        : "Waiting for first sync"
      : "Connect API to sync";

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tighter lg:text-4xl">Dashboard</h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground/80 leading-relaxed">
            Live overview of auth activity and sessions.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-border/50 bg-background/50 px-4 py-2 text-xs font-medium text-muted-foreground/80">
            {syncLabel}
          </div>
            <Button
            variant="secondary"
            size="sm"
            className="rounded-full h-9 px-5 font-bold transition-all duration-300 active:scale-95"
            onClick={() => void refresh(true)}
            disabled={state === SectionState.LOADING || !token}
            aria-label="Sync dashboard data"
            aria-busy={state === SectionState.LOADING}
          >
            <svg className={cn("mr-2 size-3.5", state === SectionState.LOADING && "animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
            {state === SectionState.LOADING ? "Syncing..." : "Sync Dashboard"}
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        {showMetricSkeletons ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <MetricCard label="Login attempts today" value={String(metrics.todayAttempts)} helper="Waiting for activity" tone="info" signal={metrics.todayAttempts > 0 ? "Live" : "Quiet"} />
            <MetricCard label="Failed logins" value={String(metrics.failedLogins)} helper="Watch for repeated failures" tone={metrics.failedLogins > 0 ? "danger" : "good"} signal={metrics.failedLogins > 0 ? "Review" : "Clear"} />
            <MetricCard label="Active sessions" value={String(metrics.activeSessions)} helper="Current signed-in devices" tone={metrics.activeSessions > 0 ? "good" : "warning"} signal={metrics.activeSessions > 0 ? "Online" : "Idle"} />
            <MetricCard label="Unique source IPs" value={String(metrics.uniqueIPs)} helper="Distinct IPs in recent logs" tone="neutral" signal={metrics.uniqueIPs > 0 ? "Mapped" : "Waiting"} />
          </>
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
          <CardHeader className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <SectionTitle eyebrow={state === SectionState.LOADING ? "Syncing" : undefined} title="Failed Login Trend" />
          </CardHeader>
          <CardContent className="pt-8">
            {state === SectionState.LOADING ? (
              <GhostChart loading />
            ) : barData.length === 0 ? (
              <div className="space-y-6">
                <GhostChart />
                <EmptyState
                  className="min-h-0 border-none bg-transparent px-2 py-0"
                  title={hasLoadedActivity ? "No trend yet" : "Waiting for activity"}
                  text={hasLoadedActivity ? "Recent auth events have not formed a visible trend window yet." : "The chart will wake up as soon as login events start flowing in."}
                  action={(
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full px-4"
                      onClick={() => void refresh()}
                      disabled={!token}
                      aria-label="Refresh dashboard trend data"
                    >
                      {token ? "Refresh data" : "Connect API"}
                    </Button>
                  )}
                />
              </div>
            ) : (
              <div className="space-y-6">
                <div
                  className="grid h-64 items-end gap-4"
                  style={{ gridTemplateColumns: `repeat(${Math.max(barData.length, 1)}, minmax(0, 1fr))` }}
                >
                  {barData.map(([label, value], index) => (
                    <div key={`${label}-${index}`} className="group/bar flex flex-col items-center gap-3">
                      <div className="text-[10px] font-bold text-muted-foreground/60 opacity-0 group-hover/bar:opacity-100 transition-opacity translate-y-2 group-hover/bar:translate-y-0 duration-300">{value}</div>
                      <div
                        className={cn(
                          "w-full rounded-t-xl bg-gradient-to-t from-primary/80 via-primary to-sky-400 transition-all duration-500",
                          "shadow-[0_4px_12px_rgba(var(--primary),0.1)] group-hover/bar:shadow-[0_12px_40px_rgba(var(--primary),0.4)] group-hover/bar:scale-x-105",
                          barData.length === 1 ? "mx-auto max-w-28" : "",
                          index === barData.length - 1 ? "ring-2 ring-primary/30 ring-offset-4 ring-offset-background" : "",
                        )}
                        style={{
                          height: `${Math.max(
                            12,
                            (value / Math.max(...barData.map(([, count]) => count), 1)) * 220,
                          )}px`,
                        }}
                      />
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium leading-relaxed text-muted-foreground/60 italic border-t border-border/40 pt-4">
                  Visualizing auth spikes over the last 7 activity buckets for rapid incident triage.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute bottom-0 left-0 size-48 bg-primary/5 blur-[80px] -z-10" />
          <CardHeader className="border-b border-border/40">
            <SectionTitle eyebrow={profile ? "Verified" : undefined} title="Active Operator" />
          </CardHeader>
          <CardContent className="pt-6">
            {profile ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-6 border border-primary/10 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xs font-semibold text-primary/80">Profile summary</div>
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="text-3xl font-bold tracking-tighter">{profile.name}</div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground/80">{profile.email}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniMetric label="Role Authority" value={profile.role || "-"} />
                  <MiniMetric label="Trust Status" value={profile.is_verified ? "Verified" : "Unverified"} />
                </div>

                <div className="space-y-4">
                  <div className="text-xs font-semibold text-muted-foreground/80">Recent security events</div>
                  <div className="space-y-2">
                    {logs.slice(0, 3).map((log, index) => (
                      <div
                        key={log.id ?? `${log.action}-${index}`}
                        className="group/log rounded-2xl border border-border/40 bg-background/40 hover:bg-background/60 px-4 py-3 transition-all duration-300 hover:border-primary/30"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-bold tracking-tight group-hover/log:text-primary transition-colors">{log.action}</div>
                          <StatusBadge status={log.status} />
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground font-medium">{log.resource} &bull; {log.description || "No metadata"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <ProfileGhost />
                <EmptyState
                  className="min-h-0 border-none bg-transparent px-2 py-0"
                  title="Operator profile waiting"
                  text="Once profile and auth activity sync, this panel will show the current operator and recent security events."
                  action={(
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full px-4"
                      onClick={() => void refresh(true)}
                      disabled={!token}
                      aria-label="Refresh operator profile data"
                    >
                      {token ? "Refresh data" : "Connect API"}
                    </Button>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-background/50 px-4 py-4 transition-all hover:bg-background/80 hover:border-primary/20 shadow-sm">
      <div className="mb-2 text-[11px] font-medium text-muted-foreground/70">{label}</div>
      <div className="text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <Card className="relative overflow-hidden border-border/40 shadow-sm">
      <CardHeader className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <SkeletonBlock className="h-3 w-28 rounded-full" />
          <div className="size-2 rounded-full bg-muted-foreground/20" />
        </div>
        <SkeletonBlock className="h-12 w-24 rounded-2xl" />
        <div className="space-y-2">
          <SkeletonBlock className="h-3 w-full rounded-full" />
          <SkeletonBlock className="h-3 w-24 rounded-full" />
        </div>
      </CardHeader>
    </Card>
  );
}

function GhostChart({ loading = false }: { loading?: boolean }) {
  return (
    <div className="rounded-3xl border border-dashed border-border/70 bg-muted/15 p-6">
      <div className="grid h-64 items-end gap-4" style={{ gridTemplateColumns: "repeat(7, minmax(0, 1fr))" }}>
        {[28, 44, 34, 58, 42, 64, 36].map((height, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "w-full rounded-t-xl bg-gradient-to-t from-muted/40 via-muted/25 to-transparent",
                loading && "animate-pulse",
              )}
              style={{ height: `${height}%` }}
            />
            <div className="h-2 w-8 rounded-full bg-muted/50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileGhost() {
  return (
    <div className="space-y-5 rounded-3xl border border-dashed border-border/70 bg-muted/15 p-6">
      <div className="rounded-3xl border border-border/40 bg-background/50 p-6">
        <SkeletonBlock className="h-3 w-24 rounded-full" />
        <SkeletonBlock className="mt-4 h-9 w-40 rounded-2xl" />
        <SkeletonBlock className="mt-3 h-4 w-56 rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <SkeletonBlock className="h-20 rounded-2xl" />
        <SkeletonBlock className="h-20 rounded-2xl" />
      </div>
      <div className="space-y-3">
        <SkeletonBlock className="h-4 w-32 rounded-full" />
        <SkeletonBlock className="h-16 rounded-2xl" />
        <SkeletonBlock className="h-16 rounded-2xl" />
      </div>
    </div>
  );
}
