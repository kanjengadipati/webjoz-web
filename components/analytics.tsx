"use client";

import { Analytics } from "@vercel/analytics/react";

export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        // Abaikan pageview jika halaman dimuat di dalam iframe
        // (misalnya thumbnail kartu di dashboard atau iframe preview di wizard)
        if (typeof window !== "undefined" && window.self !== window.top) {
          return null;
        }
        return event;
      }}
    />
  );
}
