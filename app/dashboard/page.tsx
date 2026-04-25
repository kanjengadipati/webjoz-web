"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, MetricCard, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchAuditLogs, fetchProfile, fetchSessions } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { cn } from "@/lib/utils";
import type { AuditLog, Profile, SectionState, Session } from "@/lib/types";

export default function DashboardOverviewPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>("idle");
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;
    setState("loading");
    try {
      const query = new URLSearchParams({ page: "1", limit: "24", resource: "auth" });
      const [profileResponse, logsResponse, sessionsResponse] = await Promise.all([
        fetchProfile(token),
        fetchAuditLogs(token, query),
        fetchSessions(token),
      ]);
      setProfile(profileResponse.data || null);
      setLogs(logsResponse.data || []);
      setSessions(sessionsResponse.data || []);
      setState("success");
      setLastSyncedAt(new Date());
      pushToast("Dashboard metrics refreshed.", "success");
    } catch (error) {
      setState("error");
      pushToast(error instanceof Error ? error.message : "Failed to load dashboard", "error");
    }
  }, [pushToast, token]);

  const metrics = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
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
    return Array.from(buckets.entries()).slice(-7);
  }, [logs]);

  const syncLabel = lastSyncedAt
    ? `Last synced ${lastSyncedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    : token
      ? "Not synced yet"
      : "Connect API to sync";

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full bg-primary animate-pulse" />
            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary/80">System Intelligence</div>
          </div>
          <h1 className="text-3xl font-bold tracking-tighter lg:text-4xl">Operational Snapshot</h1>
          <p className="max-w-2xl text-sm font-medium text-muted-foreground/80 leading-relaxed">
            Real-time security telemetry and operator activity tracking powered by your Go backend.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-border/50 bg-background/50 px-4 py-2 text-xs font-bold text-muted-foreground">
            {syncLabel}
          </div>
          <Button
            size="lg"
            className="rounded-full px-8 shadow-lg shadow-primary/20"
            onClick={() => void refresh()}
            disabled={state === "loading" || !token}
          >
            {state === "loading" ? "Refreshing..." : state === "error" ? "Retry Sync" : "Refresh Dashboard"}
          </Button>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <MetricCard label="Login Attempts Today" value={String(metrics.todayAttempts)} helper="Auth activity recorded today" tone="info" signal={metrics.todayAttempts > 0 ? "Live" : "Quiet"} />
        <MetricCard label="Failed Logins" value={String(metrics.failedLogins)} helper="Critical brute-force signal" tone={metrics.failedLogins > 0 ? "danger" : "good"} signal={metrics.failedLogins > 0 ? "Review" : "Clear"} />
        <MetricCard label="Active Sessions" value={String(metrics.activeSessions)} helper="Live refresh-token sessions" tone={metrics.activeSessions > 0 ? "good" : "warning"} signal={metrics.activeSessions > 0 ? "Online" : "None"} />
        <MetricCard label="Unique Source IPs" value={String(metrics.uniqueIPs)} helper="Distinct IPs seen in recent auth logs" tone="neutral" signal={metrics.uniqueIPs > 0 ? "Mapped" : "Empty"} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300 fill-mode-both">
        <Card className="relative overflow-hidden group">
          <div className="absolute top-0 right-0 size-64 bg-primary/5 blur-[100px] -z-10 group-hover:bg-primary/10 transition-colors duration-700" />
          <CardHeader className="border-b border-border/40 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
            <SectionTitle eyebrow={state === "loading" ? "synchronizing..." : "telemetry"} title="Failed Login Trend" />
          </CardHeader>
          <CardContent className="pt-8">
            {state === "loading" ? (
              <SkeletonBlock className="h-72" />
            ) : barData.length === 0 ? (
              <EmptyState
                title="Trend chart waiting"
                text="Sync audit metrics to populate the behavioral trend chart and expose failed-login spikes."
                action={(
                  <Button size="sm" variant="outline" className="rounded-full px-4" onClick={() => void refresh()} disabled={!token}>
                    {token ? "Sync Metrics" : "Connect API"}
                  </Button>
                )}
              />
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
            <SectionTitle eyebrow={profile ? "verified" : "operator"} title="Active Operator" />
          </CardHeader>
          <CardContent className="pt-6">
            {profile ? (
              <div className="space-y-6 animate-in fade-in duration-700">
                <div className="rounded-3xl bg-gradient-to-br from-primary/10 via-background to-background p-6 border border-primary/10 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Profile Summary</div>
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
                  <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/80 mb-2">Recent Security Events</div>
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
              <EmptyState
                title="Operator profile offline"
                text="Authenticate or refresh the dashboard to synchronize operator profile and audit recency."
                action={(
                  <Button size="sm" variant="outline" className="rounded-full px-4" onClick={() => void refresh()} disabled={!token}>
                    {token ? "Retry Sync" : "Connect API"}
                  </Button>
                )}
              />
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
      <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mb-2">{label}</div>
      <div className="text-lg font-bold tracking-tight">{value}</div>
    </div>
  );
}
