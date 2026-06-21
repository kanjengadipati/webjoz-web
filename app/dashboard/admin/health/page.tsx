"use client";

import React, { useState, useEffect } from "react";
import { useAuthToken } from "@/lib/auth-store";
import { request } from "@/lib/api/client";
import { usePermissions } from "@/hooks/use-permissions";
import { Activity, Loader2, Database, Server, Cpu, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

interface SystemHealth {
  database: string;
  cache: string;
  ai: string;
  version: string;
}

export default function AdminHealthPage() {
  const token = useAuthToken();
  const { role } = usePermissions();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = role === "superadmin" || role === "admin";

  useEffect(() => {
    if (!token || !isAdmin) return;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await request<SystemHealth>("/health/system", {}, token);
        setHealth(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch health data");
      } finally {
        setLoading(false);
      }
    })();
  }, [token, isAdmin]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-80 text-muted-foreground gap-4">
        <Activity className="size-12 opacity-40" />
        <p className="text-sm">Anda tidak memiliki akses ke halaman ini.</p>
      </div>
    );
  }

  const services = health ? [
    { name: "Database", status: health.database, icon: Database },
    { name: "Cache (Redis)", status: health.cache, icon: Server },
    { name: "AI Provider", status: health.ai, icon: Cpu },
    { name: "API Version", status: health.version, icon: Wifi, isVersion: true },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-3">
          <Activity className="size-5 text-primary" />
          System Health
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor platform service status and health.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card className="border-border/40 shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc) => (
            <Card key={svc.name} className={`border-border/40 shadow-sm ${
              svc.isVersion ? "" : svc.status === "ok" ? "border-green-500/30" : svc.status === "error" ? "border-red-500/30" : "border-yellow-500/30"
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">{svc.name}</p>
                    <p className={`text-lg font-bold tracking-tight ${
                      svc.isVersion ? "" : svc.status === "ok" ? "text-green-600" : svc.status === "error" ? "text-red-500" : "text-yellow-500"
                    }`}>
                      {svc.isVersion ? svc.status : svc.status === "ok" ? "Healthy" : svc.status === "error" ? "Unhealthy" : "Unknown"}
                    </p>
                  </div>
                  <svc.icon className={`size-7 opacity-60 ${
                    svc.isVersion ? "text-muted-foreground" : svc.status === "ok" ? "text-green-500" : svc.status === "error" ? "text-red-500" : "text-yellow-500"
                  }`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
