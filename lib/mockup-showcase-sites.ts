"use client";

import { useState, useEffect, useMemo } from "react";
import { inferArchetypeFromText } from "@/lib/showcase-archetypes";

export const MOCKUP_SHOWCASE_API_BASE =
  process.env.NEXT_PUBLIC_MOCKUP_SITES_API_BASE ?? "https://api.webjoz.com";

/**
 * One curated showcase entry. The list is managed by admin/superadmin in
 * /dashboard/admin/showcase-sites and served by GET /public/showcase-sites —
 * only published sites owned by an admin/superadmin ever appear here.
 */
export interface MockupShowcaseSite {
  url: string;
  businessName: string;
  /** effective archetype from the API ("" = unknown → keyword inference) */
  archetype: string;
  siteId?: string;
}

export interface ShowcaseArchetype {
  id: string;
  label_id: string;
  label_en: string;
}

interface ShowcasePayload {
  sites: MockupShowcaseSite[];
  archetypes: ShowcaseArchetype[];
}

const EMPTY_PAYLOAD: ShowcasePayload = { sites: [], archetypes: [] };

let _payload: ShowcasePayload | null = null;
let _inflight: Promise<ShowcasePayload> | null = null;

function toSite(input: unknown): MockupShowcaseSite | null {
  const o = (input ?? {}) as Record<string, unknown>;
  const url = typeof o.url === "string" ? o.url.trim() : "";
  if (!url) return null;
  return {
    url,
    businessName: typeof o.business_name === "string" ? o.business_name.trim() : "",
    archetype: typeof o.archetype === "string" ? o.archetype.trim() : "",
    siteId: typeof o.site_id === "string" ? o.site_id : undefined,
  };
}

export async function fetchMockupShowcaseSites(force = false): Promise<ShowcasePayload> {
  if (!force && _payload) return _payload;
  if (!force && _inflight) return _inflight;
  _inflight = (async () => {
    try {
      const res = await fetch(`${MOCKUP_SHOWCASE_API_BASE}/public/showcase-sites`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const items: unknown[] = Array.isArray(json?.data?.items) ? json.data.items : [];
      const archetypes: ShowcaseArchetype[] = Array.isArray(json?.data?.archetypes) ? json.data.archetypes : [];
      _payload = {
        sites: items.map(toSite).filter((x): x is MockupShowcaseSite => x !== null),
        archetypes,
      };
    } catch {
      // Keep whatever we had; an empty list just means "no showcase yet".
      _payload = _payload ?? EMPTY_PAYLOAD;
    } finally {
      _inflight = null;
    }
    return _payload!;
  })();
  return _inflight;
}

export function siteHost(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  }
}

export function useMockupShowcaseSites() {
  const [payload, setPayload] = useState<ShowcasePayload>(_payload ?? EMPTY_PAYLOAD);
  const [loading, setLoading] = useState(_payload === null);

  useEffect(() => {
    let active = true;
    fetchMockupShowcaseSites().then((p) => {
      if (!active) return;
      setPayload(p);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { sites: payload.sites, archetypes: payload.archetypes, loading };
}

export interface RealSiteData {
  content: any;
  design_token: any;
  templateId: string;
}

const _siteDataCache = new Map<string, RealSiteData | null>();

export async function fetchRealSiteData(host: string): Promise<RealSiteData | null> {
  if (!host) return null;
  const cleanHost = siteHost(host);
  const cached = _siteDataCache.get(cleanHost);
  if (cached !== undefined) return cached;
  try {
    const url = `${MOCKUP_SHOWCASE_API_BASE}/public/sites?host=${encodeURIComponent(cleanHost)}`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const d = json?.data;
    const entry: RealSiteData | null =
      d?.content && d?.design_token && d?.template_id
        ? { content: d.content, design_token: d.design_token, templateId: d.template_id }
        : null;
    _siteDataCache.set(cleanHost, entry);
    return entry;
  } catch {
    _siteDataCache.set(cleanHost, null);
    return null;
  }
}

export function useRealSiteData(host: string | null): RealSiteData | null {
  const cleanHost = host ? siteHost(host) : null;
  const [data, setData] = useState<RealSiteData | null>(() =>
    cleanHost ? (_siteDataCache.has(cleanHost) ? (_siteDataCache.get(cleanHost) ?? null) : null) : null
  );

  useEffect(() => {
    if (!cleanHost) return;
    const cached = _siteDataCache.get(cleanHost);
    if (cached !== undefined) {
      queueMicrotask(() => setData(cached));
      return;
    }
    let active = true;
    fetchRealSiteData(cleanHost).then((entry) => {
      if (active) setData(entry);
    });
    return () => {
      active = false;
    };
  }, [cleanHost]);

  return data;
}

export function useAllRealSitesData(sites: MockupShowcaseSite[]): Record<string, RealSiteData | null> {
  const hosts = useMemo(
    () => sites.map((s) => siteHost(s.url)).filter(Boolean),
    [sites]
  );

  const [dataMap, setDataMap] = useState<Record<string, RealSiteData | null>>(() => {
    const initial: Record<string, RealSiteData | null> = {};
    for (const h of hosts) {
      if (_siteDataCache.has(h)) {
        initial[h] = _siteDataCache.get(h) ?? null;
      }
    }
    return initial;
  });

  useEffect(() => {
    let active = true;
    for (const h of hosts) {
      const cached = _siteDataCache.get(h);
      if (cached !== undefined) {
        setDataMap((prev) => (prev[h] === cached ? prev : { ...prev, [h]: cached }));
        continue;
      }
      fetchRealSiteData(h).then((entry) => {
        if (!active) return;
        setDataMap((prev) => ({ ...prev, [h]: entry }));
      });
    }
    return () => {
      active = false;
    };
  }, [hosts]);

  return dataMap;
}

export function resolveSiteArchetype(
  site: MockupShowcaseSite,
  data?: RealSiteData | null
): string {
  // 1. Admin override / the site's own v2 archetype (already merged by the API).
  if (site.archetype) return site.archetype;

  // 2. Legacy sites without an archetype: infer from real content + name.
  const content = data?.content as any;
  const text = [
    site.businessName || "",
    content?.header?.brand_name || "",
    content?.header?.tagline || "",
    content?.hero?.headline || "",
    content?.hero?.subheadline || "",
    content?.hero?.badge_text || "",
    content?.about?.headline || "",
    content?.about?.body || "",
    content?.seo?.title || "",
    content?.seo?.description || "",
    content?.footer?.brand_name || "",
  ].join(" ");
  return inferArchetypeFromText(text);
}

export function resolveSiteBusinessName(
  site: MockupShowcaseSite,
  data?: RealSiteData | null
): string {
  if (site.businessName && site.businessName.trim()) {
    return site.businessName.trim();
  }
  const fromContent = (data?.content as any)?.header?.brand_name || (data?.content as any)?.hero?.badge_text;
  if (typeof fromContent === "string" && fromContent.trim()) {
    return fromContent.trim();
  }
  const host = siteHost(site.url);
  if (host) {
    const subdomain = host.split(".")[0];
    if (subdomain && subdomain !== "www") {
      return subdomain
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
    }
  }
  return "Website";
}
