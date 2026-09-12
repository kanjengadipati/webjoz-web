"use client";

import { useCallback, useState } from "react";

export const MOCKUP_SHOWCASE_SITES_KEY = "webjoz_mockup_showcase_sites";

export const MOCKUP_SHOWCASE_API_BASE =
  process.env.NEXT_PUBLIC_MOCKUP_SITES_API_BASE ?? "https://api.webjoz.com";

export interface MockupShowcaseSite {
  url: string;
  businessName: string;
}

export const DEFAULT_MOCKUP_SHOWCASE_SITES: MockupShowcaseSite[] = [
  { url: "https://pleco-dev.webjoz.com/", businessName: "Pleco Dev" },
  { url: "https://kopijozzjogja.webjoz.com/", businessName: "Kopi Jozz Jogja" },
];

function toSite(input: unknown): MockupShowcaseSite | null {
  if (typeof input === "string") {
    const url = input.trim();
    return url ? { url, businessName: "" } : null;
  }
  if (input && typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const url = typeof obj.url === "string" ? obj.url.trim() : "";
    const businessName = typeof obj.businessName === "string" ? obj.businessName.trim() : "";
    return url ? { url, businessName } : null;
  }
  return null;
}

function normalizeSites(input: unknown): MockupShowcaseSite[] | null {
  if (!Array.isArray(input)) return null;
  const sites = input.map(toSite).filter((s): s is MockupShowcaseSite => s !== null);
  return sites.length > 0 ? sites : [];
}

export function readMockupShowcaseSites(): MockupShowcaseSite[] {
  if (typeof window === "undefined") return DEFAULT_MOCKUP_SHOWCASE_SITES;
  try {
    const raw = window.localStorage.getItem(MOCKUP_SHOWCASE_SITES_KEY);
    if (!raw) return DEFAULT_MOCKUP_SHOWCASE_SITES;
    const parsed = normalizeSites(JSON.parse(raw));
    return parsed === null ? DEFAULT_MOCKUP_SHOWCASE_SITES : parsed;
  } catch {
    return DEFAULT_MOCKUP_SHOWCASE_SITES;
  }
}

export function writeMockupShowcaseSites(sites: MockupShowcaseSite[]): MockupShowcaseSite[] {
  const clean = normalizeSites(sites);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(MOCKUP_SHOWCASE_SITES_KEY, JSON.stringify(clean ?? []));
    } catch {
      /* localStorage unavailable (private mode) */
    }
  }
  if (clean === null || clean.length === 0) return [];
  return clean;
}

export function siteHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function useMockupShowcaseSites() {
  const [sites, setSites] = useState<MockupShowcaseSite[]>(() => readMockupShowcaseSites());

  const save = useCallback((next: MockupShowcaseSite[]) => {
    setSites(writeMockupShowcaseSites(next));
  }, []);

  return { sites, save };
}