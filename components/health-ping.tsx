"use client";

import { useEffect, useState } from "react";
import { request } from "@/lib/api/client";
import { HEALTH_CHECK_ENABLED } from "@/lib/config";

type HealthState = "checking" | "online" | "offline" | "disabled";

type HealthPingProps = {
  className?: string;
};

export function HealthPing({ className = "" }: HealthPingProps) {
  const [state, setState] = useState<HealthState>(
    HEALTH_CHECK_ENABLED ? "checking" : "disabled",
  );

  useEffect(() => {
    if (!HEALTH_CHECK_ENABLED) {
      return;
    }

    let cancelled = false;

    async function checkHealth() {
      try {
        await request("/health", { method: "GET" });
        if (!cancelled) setState("online");
      } catch (err) {
        console.warn("Health check failed:", err);
        if (!cancelled) setState("offline");
      }
    }

    void checkHealth();

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "disabled") {
    return null;
  }

  const isOnline = state === "online";
  const isOffline = state === "offline";
  const label = isOnline
    ? "API online"
    : isOffline
      ? "API unavailable"
      : "Checking API";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        isOnline
          ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-500"
          : isOffline
            ? "border-amber-500/25 bg-amber-500/10 text-amber-500"
            : "border-border bg-card/70 text-muted-foreground"
      } ${className}`}
      title={isOffline ? "Backend API health check failed" : "Backend API health status"}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          isOnline
            ? "bg-emerald-500"
            : isOffline
              ? "bg-amber-500"
              : "animate-pulse bg-muted-foreground"
        }`}
      />
      {label}
    </div>
  );
}
