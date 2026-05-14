"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchSessions, revokeOtherSessions, revokeSession } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import { Can } from "@/components/can";
import { cn } from "@/lib/utils";
import { SectionState } from "@/lib/types";
import type { Session } from "@/lib/types";

export default function SessionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>(SectionState.IDLE);

  const loadSessions = useCallback(async () => {
    if (!token) return;
    setState(SectionState.LOADING);
    try {
      const response = await fetchSessions(token);
      setSessions(response.data);
      setState(SectionState.SUCCESS);
    } catch (error) {
      setState(SectionState.ERROR);
      pushToast(error instanceof Error ? error.message : "Failed to load sessions", "error");
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
      pushToast("Session revoked.", "success");
    } catch (error) {
      setSessions(previous);
      pushToast(error instanceof Error ? error.message : "Failed to revoke session", "error");
    }
  }

  async function handleRevokeOthers() {
    if (!token) return;
    const previous = sessions;
    setSessions((current) => current.filter((session) => session.is_current));
    try {
      await revokeOtherSessions(token);
      pushToast("Other sessions revoked.", "success");
    } catch (error) {
      setSessions(previous);
      pushToast(error instanceof Error ? error.message : "Failed to revoke other sessions", "error");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={state}
            title="Session Manager"
            action={
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="rounded-full px-4 h-9" onClick={() => void loadSessions()} disabled={state === SectionState.LOADING} aria-label="Refresh sessions">
                  <svg className={cn("mr-2 size-3.5", state === SectionState.LOADING && "motion-safe:animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" /><path d="M3 21v-5h5" /></svg>
                  Refresh
                </Button>
                <Can permission="session.delete">
                  <Button variant="secondary" size="sm" className="rounded-full px-4 h-9 font-bold" onClick={() => void handleRevokeOthers()} disabled={sessions.filter(s => !s.is_current).length === 0}>
                    <svg className="mr-2 size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6" /><path d="M2 12h7" /><path d="M2 12V6" /><path d="M2 12v6" /></svg>
                    Revoke All Others
                  </Button>
                </Can>
              </div>
            }
          />
        </CardHeader>
        <CardContent className="pt-6">
        {state === SectionState.LOADING ? (
          <div className="grid gap-3">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState text="No active sessions found." />
        ) : (
          <div className="grid gap-3">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-3xl border border-border/70 bg-muted/35 px-5 py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-lg font-semibold">{session.device_id || "Unknown device"}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{session.user_agent || "Unknown user agent"}</div>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>IP: {session.ip_address || "-"}</span>
                      <span>Last active: {new Date(session.updated_at).toLocaleString()}</span>
                      <span>Expires: {new Date(session.expired_at).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={session.is_current ? "current" : "active"} />
                    {!session.is_current ? (
                      <Can permission="session.delete">
                        <Button variant="destructive" onClick={() => void handleRevoke(session.id)}>
                          Revoke
                        </Button>
                      </Can>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
