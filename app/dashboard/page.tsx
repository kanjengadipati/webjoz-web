"use client";

import { useCallback, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, MetricCard, SectionTitle, SkeletonBlock, StatusBadge, SubtleStat } from "@/components/ui";
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Security Overview</div>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Operational snapshot</h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            A more productized overview for quick demos, triage, and backend health storytelling.
          </p>
        </div>
        <Button onClick={() => void refresh()}>
          Refresh Metrics
        </Button>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Login Attempts Today" value={String(metrics.todayAttempts)} helper="Auth activity recorded today" />
        <MetricCard label="Failed Logins" value={String(metrics.failedLogins)} helper="Useful for brute-force spotting" />
        <MetricCard label="Active Sessions" value={String(metrics.activeSessions)} helper="Current refresh-token-backed sessions" />
        <MetricCard label="Top IP Footprint" value={String(metrics.uniqueIPs)} helper="Distinct IPs in recent auth logs" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="border-b border-border/60">
            <SectionTitle eyebrow={state} title="Failed Login Trend" />
          </CardHeader>
          <CardContent className="pt-6">
            {state === "loading" ? (
              <SkeletonBlock className="h-72" />
            ) : barData.length === 0 ? (
              <EmptyState text="Refresh metrics to populate the trend chart." />
            ) : (
              <div className="space-y-4">
                <div
                  className="grid h-64 items-end gap-3"
                  style={{ gridTemplateColumns: `repeat(${Math.max(barData.length, 1)}, minmax(0, 1fr))` }}
                >
                  {barData.map(([label, value], index) => (
                    <div key={`${label}-${index}`} className="flex flex-col items-center gap-3">
                      <div className="text-xs font-medium text-muted-foreground">{value}</div>
                      <div
                        className={cn(
                          "w-full rounded-t-2xl bg-gradient-to-t from-primary via-sky-500 to-cyan-300 shadow-[0_10px_30px_-20px_rgba(59,130,246,0.9)]",
                          barData.length === 1 ? "mx-auto max-w-28" : "",
                          index === barData.length - 1 ? "ring-2 ring-primary/25 ring-offset-2 ring-offset-background" : "",
                        )}
                        style={{
                          height: `${Math.max(
                            24,
                            (value / Math.max(...barData.map(([, count]) => count), 1)) * 210,
                          )}px`,
                        }}
                      />
                      <div className="text-xs text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  This quick chart is derived directly from recent audit log timestamps to make auth spikes visible in one screenshot.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border/60">
            <SectionTitle eyebrow={profile ? "profile loaded" : state} title="Current Operator" />
          </CardHeader>
          <CardContent className="pt-6">
            {profile ? (
              <div className="space-y-4">
                <div className="rounded-3xl bg-gradient-to-br from-primary/12 via-background to-background p-5">
                  <div className="text-sm text-muted-foreground">Signed in as</div>
                  <div className="mt-2 text-2xl font-semibold">{profile.name}</div>
                  <div className="mt-2 text-sm text-muted-foreground">{profile.email}</div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <MiniMetric label="Role" value={profile.role || "-"} />
                  <MiniMetric label="Verified" value={String(profile.is_verified ?? false)} />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <SubtleStat label="Active Sessions" value={String(metrics.activeSessions)} helper="Refresh-token backed devices currently open." />
                  <SubtleStat label="Distinct IPs" value={String(metrics.uniqueIPs)} helper="Useful for spotting distributed auth activity." />
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">Recent Events</div>
                  {logs.slice(0, 3).map((log, index) => (
                    <div key={log.id ?? `${log.action}-${log.created_at ?? "unknown"}-${index}`} className="rounded-2xl border border-border bg-muted/35 px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-medium">{log.action} on {log.resource}</div>
                        <StatusBadge status={log.status} />
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">{log.description || "No description"}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState text="Load metrics to see the authenticated operator profile and recent events." />
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-muted/35 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className="mt-2 text-base font-medium">{value}</div>
    </div>
  );
}
