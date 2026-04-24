"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchSessions, revokeOtherSessions, revokeSession } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import type { Session, SectionState } from "@/lib/types";

export default function SessionsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [state, setState] = useState<SectionState>("idle");

  const loadSessions = useCallback(async () => {
    if (!token) return;
    setState("loading");
    try {
      const response = await fetchSessions(token);
      setSessions(response.data || []);
      setState("success");
    } catch (error) {
      setState("error");
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
          <SectionTitle eyebrow={state} title="Session Manager" action={<div className="flex gap-2"><Button variant="outline" onClick={() => void loadSessions()}>Refresh</Button><Button onClick={() => void handleRevokeOthers()}>Revoke All Others</Button></div>} />
        </CardHeader>
        <CardContent className="pt-6">
        {state === "loading" ? (
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
                      <Button variant="destructive" onClick={() => void handleRevoke(session.id)}>
                        Revoke
                      </Button>
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
