"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Activity, Loader2, Database, Server, Cpu, Wifi, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, Button } from "@/components/ui";

interface SystemHealth {
  database: string;
  cache: string;
  ai: string;
  version: string;
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

const serviceMeta: Record<string, { icon: typeof Database; label: string; desc: string }> = {
  database: { icon: Database, label: "Database", desc: "Koneksi PostgreSQL" },
  cache: { icon: Server, label: "Cache", desc: "Redis connection" },
  ai: { icon: Cpu, label: "AI Provider", desc: "Gemini API status" },
  version: { icon: Wifi, label: "API Version", desc: "Versi aplikasi" },
};

function statusColor(status: string, isVersion: boolean) {
  if (isVersion) return "text-muted-foreground";
  if (status === "ok") return "text-green-500";
  if (status === "error") return "text-red-500";
  return "text-yellow-500";
}

function statusBg(status: string, isVersion: boolean) {
  if (isVersion) return "bg-muted/30";
  if (status === "ok") return "bg-green-500/10";
  if (status === "error") return "bg-red-500/10";
  return "bg-yellow-500/10";
}

function statusBorder(status: string, isVersion: boolean) {
  if (isVersion) return "border-border/40";
  if (status === "ok") return "border-green-500/25";
  if (status === "error") return "border-red-500/25";
  return "border-yellow-500/25";
}

function statusLabel(status: string, isVersion: boolean) {
  if (isVersion) return status;
  if (status === "ok") return "Healthy";
  if (status === "error") return "Unhealthy";
  return "Unknown";
}

function StatusDot({ status, isVersion }: { status: string; isVersion: boolean }) {
  if (isVersion) return null;
  return (
    <span className="relative flex h-2 w-2 mt-0.5">
      {status === "ok" && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />
      )}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${
        status === "ok" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-yellow-500"
      }`} />
    </span>
  );
}

export default function AdminHealthPage() {
  const token = useAuthToken();
  const { role } = usePermissions();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const isAdmin = role === "superadmin" || role === "admin";

  const fetchHealth = useCallback(async (silent = false) => {
    if (!token || !isAdmin) return;
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      setError("");
      const res = await request<SystemHealth>("/health/system", {}, token);
      setHealth(res.data);
      setLastChecked(new Date());
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data health");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token, isAdmin]);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Activity className="size-12 opacity-40" />
        <p className="text-sm">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const services = health ? Object.entries(serviceMeta).map(([key, meta]) => {
    const status = health[key as keyof SystemHealth] || "unknown";
    const isVersion = key === "version";
    return { key, ...meta, status, isVersion };
  }) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
            <Activity className="size-5 text-primary" />
            System Health
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor platform service status and health.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchHealth(true)}
          disabled={refreshing}
          className="gap-2 shrink-0"
        >
          <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
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
              <p className="text-sm font-semibold text-destructive">Gagal memuat data</p>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchHealth()}>
              Coba Lagi
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Service cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((svc) => (
              <Card
                key={svc.key}
                className={`border shadow-sm transition-all duration-200 hover:shadow-md ${statusBorder(svc.status, svc.isVersion)}`}
              >
                <CardContent className="p-6 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{svc.label}</p>
                        <StatusDot status={svc.status} isVersion={svc.isVersion} />
                      </div>
                      <p className={`text-lg font-bold tracking-tight ${statusColor(svc.status, svc.isVersion)}`}>
                        {statusLabel(svc.status, svc.isVersion)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{svc.desc}</p>
                    </div>
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${statusBg(svc.status, svc.isVersion)} ${statusColor(svc.status, svc.isVersion)}`}>
                      <svc.icon className="size-4.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer: last checked */}
          <div className="flex items-center justify-between border-t border-border/30 pt-4">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              {lastChecked ? (
                <>Terakhir diperiksa pukul <span className="font-semibold text-foreground/70">{formatTime(lastChecked)}</span></>
              ) : (
                "Belum pernah diperiksa"
              )}
            </div>
            {!error && health && (
              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <span className={`inline-block size-1.5 rounded-full ${health.database === "ok" && health.cache === "ok" ? "bg-green-500" : "bg-yellow-500"}`} />
                {health.database === "ok" && health.cache === "ok" ? "Semua sistem aktif" : "Beberapa sistem bermasalah"}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
