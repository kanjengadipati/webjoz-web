"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Can } from "@/components/can";
import { Button, Card, CardContent, CardHeader, EmptyState, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { clearAuthSession, useAuthToken } from "@/lib/auth-store";
import { fetchSessions, logoutAllSessions, revokeOtherSessions, revokeSession, revokeTrustedDevice } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SectionState } from "@/lib/types";
import type { Session } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function deviceLabel(session: Session) {
  if (session.device_name) return session.device_name;
  const ua = session.user_agent || "";
  const browser = ua.includes("Chrome") ? "Chrome" : ua.includes("Safari") ? "Safari" : ua.includes("Firefox") ? "Firefox" : "Browser";
  const platform = ua.includes("Mac") ? "Mac" : ua.includes("iPhone") ? "iPhone" : ua.includes("Android") ? "Android" : ua.includes("Windows") ? "Windows" : "";
  return platform ? `${browser} • ${platform}` : session.device_id || "Unknown device";
}

function shortID(value?: string) {
  if (!value) return "-";
  if (value.length <= 16) return value;
  return `${value.slice(0, 10)}...${value.slice(-6)}`;
}

function deviceKind(session: Session) {
  const ua = session.user_agent || "";
  if (/iPhone|Android|Mobile/i.test(ua)) return "mobile";
  if (/iPad|Tablet/i.test(ua)) return "tablet";
  return "desktop";
}

function DeviceIcon({ kind }: { kind: string }) {
  if (kind === "mobile") {
    return (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18h2" />
      </svg>
    );
  }
  if (kind === "tablet") {
    return (
      <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M11 17h2" />
      </svg>
    );
  }
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>
  );
}

export default function SessionsPage() {
  const router = useRouter();
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  const metrics = useMemo(() => ({
    total: sessions.length,
    trusted: sessions.filter((session) => session.is_trusted).length,
    current: sessions.filter((session) => session.is_current).length,
  }), [sessions]);

  const loadSessions = useCallback(async () => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const response = await fetchSessions(token);
      setSessions(response.data);
      setState(SectionState.SUCCESS);
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : "Failed to load devices", "error");
    }
  }, [pushToast, token]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadSessions();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadSessions, token]);

  async function handleRevoke(id: number) {
    if (!token) return;
    const previous = sessions;
    setSessions((current) => current.filter((session) => session.id !== id));
    try {
      await revokeSession(token, id);
      pushToast("Device signed out.", "success");
    } catch (error) {
      setSessions(previous);
      pushToast(error instanceof Error ? error.message : "Failed to sign out device", "error");
    }
  }

  async function handleRemoveTrust(id: string) {
    if (!token) return;
    const previous = sessions;
    setSessions((current) => current.map((session) => (
      session.trusted_device_id === id
        ? { ...session, is_trusted: false, trusted_device_id: undefined, trusted_at: undefined, last_trusted_at: undefined }
        : session
    )));
    try {
      await revokeTrustedDevice(token, id);
      pushToast("Trusted device removed.", "success");
    } catch (error) {
      setSessions(previous);
      pushToast(error instanceof Error ? error.message : "Failed to remove trusted device", "error");
    }
  }

  async function handleRevokeOthers() {
    if (!token) return;
    const previous = sessions;
    setSessions((current) => current.filter((session) => session.is_current));
    try {
      await revokeOtherSessions(token);
      pushToast("Other devices signed out.", "success");
    } catch (error) {
      setSessions(previous);
      pushToast(error instanceof Error ? error.message : "Failed to sign out other devices", "error");
    }
  }

  async function handleLogoutAll() {
    if (!token) return;
    try {
      await logoutAllSessions(token);
      pushToast("All devices signed out.", "success");
    } catch (error) {
      pushToast(error instanceof Error ? error.message : "Failed to sign out all devices", "error");
      return;
    }
    clearAuthSession();
    router.push("/login");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={state}
            title="Device & Session Management"
            action={
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" size="sm" className="h-9 rounded-full px-4" onClick={() => void loadSessions()} disabled={state === SectionState.LOADING} aria-label="Refresh devices">
                  <svg className={cn("mr-2 size-3.5", state === SectionState.LOADING && "motion-safe:animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                  Refresh
                </Button>
                <Can permission="session.delete">
                  <Button variant="secondary" size="sm" className="h-9 rounded-full px-4 font-bold" onClick={() => void handleRevokeOthers()} disabled={sessions.filter((session) => !session.is_current).length === 0}>
                    Sign out others
                  </Button>
                  <Button variant="destructive" size="sm" className="h-9 rounded-full px-4 font-bold" onClick={() => void handleLogoutAll()} disabled={sessions.length === 0}>
                    Sign out all
                  </Button>
                </Can>
              </div>
            }
          />
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="text-xs font-medium text-muted-foreground">Active sessions</div>
              <div className="mt-1 text-2xl font-bold">{metrics.total}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="text-xs font-medium text-muted-foreground">Trusted devices</div>
              <div className="mt-1 text-2xl font-bold">{metrics.trusted}</div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/25 p-4">
              <div className="text-xs font-medium text-muted-foreground">This session</div>
              <div className="mt-1 text-2xl font-bold">{metrics.current}</div>
            </div>
          </div>

          {state === SectionState.LOADING ? (
            <div className="grid gap-3">
              <SkeletonBlock className="h-24" />
              <SkeletonBlock className="h-24" />
            </div>
          ) : sessions.length === 0 ? (
            <EmptyState title="No sessions yet" text="No active sessions or trusted devices are currently associated with this account." />
          ) : (
            <div className="grid gap-3">
              {sessions.map((session) => {
                const kind = deviceKind(session);
                const status = session.is_current ? "currently signed in" : session.is_trusted ? "trusted device" : "unknown device";
                const trustedDeviceID = session.trusted_device_id;
                return (
                  <div key={session.id} className="rounded-2xl border border-border/70 bg-muted/30 px-5 py-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/60 bg-background/70 text-primary">
                          <DeviceIcon kind={kind} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <div className="truncate text-base font-semibold">{deviceLabel(session)}</div>
                            <StatusBadge status={status} />
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-medium text-muted-foreground">
                              Session #{session.id}
                            </span>
                            <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-medium text-muted-foreground">
                              Device {shortID(session.device_id)}
                            </span>
                            {trustedDeviceID ? (
                              <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-1 font-medium text-muted-foreground">
                                Trust {shortID(trustedDeviceID)}
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{session.user_agent || "Unknown user agent"}</div>
                          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>IP: {session.ip_address || "-"}</span>
                            <span>Last used: {formatDate(session.updated_at)}</span>
                            {session.last_trusted_at ? <span>Trusted use: {formatDate(session.last_trusted_at)}</span> : null}
                            <span>Expires: {formatDate(session.expired_at)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        {session.is_trusted && trustedDeviceID ? (
                          <Button variant="outline" size="sm" className="h-8 rounded-lg px-3 text-xs font-semibold" onClick={() => void handleRemoveTrust(trustedDeviceID)}>
                            Remove trust
                          </Button>
                        ) : null}
                        {!session.is_current ? (
                          <Button variant="destructive" size="sm" className="h-8 rounded-lg px-3 text-xs font-semibold" onClick={() => void handleRevoke(session.id)}>
                            Revoke session
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
