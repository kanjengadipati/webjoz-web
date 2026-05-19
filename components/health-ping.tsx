"use client";

import { useEffect } from "react";
import { request } from "@/lib/api/client";

export function HealthPing() {
  useEffect(() => {
    request("/health", { method: "GET" }).catch((err) => {
      console.warn("Health check failed:", err);
    });
  }, []);
  
  return null;
}
