"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, CardContent, CardHeader, EmptyState, Input, Label, SectionTitle, SkeletonBlock, StatusBadge } from "@/components/ui";
import { useToast } from "@/components/toast-provider";
import { fetchAuditLogs } from "@/lib/api";
import { useAuthToken } from "@/lib/auth-store";
import type { AuditLog, SectionState } from "@/lib/types";

export default function LogsPage() {
  const token = useAuthToken();
  const { pushToast } = useToast();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [state, setState] = useState<SectionState>("idle");
  const [filters, setFilters] = useState({ action: "", resource: "auth", status: "", search: "", dateFrom: "", dateTo: "" });

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: "1", limit: "20" });
    if (filters.action) params.set("action", filters.action);
    if (filters.resource) params.set("resource", filters.resource);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    if (filters.dateFrom) params.set("date_from", new Date(filters.dateFrom).toISOString());
    if (filters.dateTo) params.set("date_to", new Date(filters.dateTo).toISOString());
    return params;
  }, [filters]);

  const loadLogs = useCallback(async (showToast = false) => {
    if (!token) return;
    setState("loading");
    try {
      const response = await fetchAuditLogs(token, query);
      setLogs(response.data || []);
      setState("success");
      if (showToast) pushToast("Audit feed refreshed.", "success");
    } catch (error) {
      setState("error");
      pushToast(error instanceof Error ? error.message : "Failed to load logs", "error");
    }
  }, [pushToast, query, token]);

  useEffect(() => {
    if (!token) return;
    const timeout = window.setTimeout(() => {
      void loadLogs();
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [loadLogs, token]);

  useEffect(() => {
    if (!token || !autoRefresh) return;
    const id = window.setInterval(() => {
      void loadLogs();
    }, 15000);
    return () => window.clearInterval(id);
  }, [autoRefresh, loadLogs, token]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle
            eyebrow={state}
            title="Real-time Audit Log Feed"
            action={
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setAutoRefresh((value) => !value)}>
                  {autoRefresh ? "Auto-refresh On" : "Auto-refresh Off"}
                </Button>
                <Button onClick={() => void loadLogs(true)}>
                  Refresh Now
                </Button>
              </div>
            }
          />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <FilterInput label="Action" value={filters.action} onChange={(value) => setFilters((current) => ({ ...current, action: value }))} placeholder="login" />
          <FilterInput label="Resource" value={filters.resource} onChange={(value) => setFilters((current) => ({ ...current, resource: value }))} placeholder="auth" />
          <FilterInput label="Status" value={filters.status} onChange={(value) => setFilters((current) => ({ ...current, status: value }))} placeholder="failed" />
          <FilterInput label="IP / Search" value={filters.search} onChange={(value) => setFilters((current) => ({ ...current, search: value }))} placeholder="203.0.113.10" />
          <FilterInput label="Date From" type="datetime-local" value={filters.dateFrom} onChange={(value) => setFilters((current) => ({ ...current, dateFrom: value }))} />
          <FilterInput label="Date To" type="datetime-local" value={filters.dateTo} onChange={(value) => setFilters((current) => ({ ...current, dateTo: value }))} />
        </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b border-border/60">
          <SectionTitle eyebrow={String(logs.length)} title="Event Table" />
        </CardHeader>
        <CardContent className="pt-6">
        {state === "loading" ? (
          <div className="grid gap-3">
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-20" />
          </div>
        ) : logs.length === 0 ? (
          <EmptyState text="No audit logs matched the current filters." />
        ) : (
          <div className="grid gap-3">
            {logs.map((log, index) => {
              const rowKey = getLogKey(log, index);
              const isOpen = expandedKey === rowKey;
              return (
                <div key={rowKey} className="rounded-3xl border border-border/70 bg-muted/35">
                  <button
                    type="button"
                    onClick={() => setExpandedKey(isOpen ? null : rowKey)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <div>
                      <div className="font-medium">{log.action} on {log.resource}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{log.description || "No description"}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-muted-foreground">{log.created_at ? new Date(log.created_at).toLocaleString() : "-"}</div>
                      <StatusBadge status={log.status} />
                    </div>
                  </button>
                  {isOpen ? (
                    <div className="grid gap-3 border-t border-border/70 px-5 py-4 text-sm text-muted-foreground md:grid-cols-3">
                      <DetailItem label="IP Address" value={log.ip_address || "-"} />
                      <DetailItem label="Actor User ID" value={String(log.actor_user_id ?? "-")} />
                      <DetailItem label="User Agent" value={log.user_agent || "-"} />
                    </div>
                  ) : null}
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

function getLogKey(log: AuditLog, index: number) {
  if (typeof log.id === "number" && Number.isFinite(log.id)) {
    return `log-${log.id}`;
  }

  return [
    "log",
    log.created_at || "unknown-time",
    log.action || "unknown-action",
    log.resource || "unknown-resource",
    log.actor_user_id ?? "unknown-actor",
    index,
  ].join(":");
}

function FilterInput({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className="mt-2 break-words text-sm text-foreground">{value}</div>
    </div>
  );
}
