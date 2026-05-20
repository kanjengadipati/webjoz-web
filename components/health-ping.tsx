"use client";

import { useEffect } from "react";
import { request } from "@/lib/api/client";
import { HEALTH_CHECK_ENABLED } from "@/lib/config";

export function HealthPing() {
  useEffect(() => {
    if (!HEALTH_CHECK_ENABLED) {
      return;
    }
    request("/health", { method: "GET" }).catch((err) => {
      console.warn("Health check failed:", err);
    });
  }, []);
  
  return null;
}
