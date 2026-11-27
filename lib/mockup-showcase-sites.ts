"use client";

import { useCallback, useState, useEffect, useMemo } from "react";

export const MOCKUP_SHOWCASE_SITES_KEY = "webjoz_mockup_showcase_sites";

export const MOCKUP_SHOWCASE_API_BASE =
  process.env.NEXT_PUBLIC_MOCKUP_SITES_API_BASE ?? "https://api.webjoz.com";

export interface MockupShowcaseSite {
  url: string;
  businessName: string;
}

export const DEFAULT_MOCKUP_SHOWCASE_SITES: MockupShowcaseSite[] = [
  {
    url: "https://pleco-dev.webjoz.com/",
    businessName: "Pleco Dev",
  },
  {
    url: "https://kopijozzjogja.webjoz.com/",
    businessName: "Kopi Jozz Jogja",
  },
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

export function resolveSiteCategory(
  site: MockupShowcaseSite,
  data?: RealSiteData | null
): number {
  // Infer category from real API content + business name
  const content = data?.content as any;
  const textParts = [
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
  ];
  const text = textParts.join(" ").toLowerCase();

  // --- Category 0: Kuliner (archetype: food_venue) ---
  // Covers: restoran, warung, kafe, bakery, pastry, catering, boba/bubble tea,
  //         minuman, frozen food, herbal/jamu, kaki lima, angkringan, jajanan pasar
  const kulinerPattern =
    /\b(restoran|warung|makan|kuliner|kafe|cafe|coffee|kopi|bakery|pastry|catering|boba|bubble\s*tea|minuman|beverage|drink|frozen\s*food|herbal|jamu|angkringan|kaki\s*lima|jajanan|dapur|kitchen|food|snack|cake|roti|teh|tea|wedang|es\s*krim|gelato|pizza|burger|sushi|mie|nasi|ayam|seafood|ikan|sate|martabak|gorengan)\b/.test(text);
  if (kulinerPattern) return 0;

  // --- Category 2: Produk & Toko (archetype: retail_catalog) ---
  // Covers: fashion, elektronik, gadget, kosmetik, handmade, minimarket, sembako,
  //         perabot, furnitur, otomotif/sparepart, pertanian, material bangunan
  const produkPattern =
    /\b(toko|shop|store|produk|product|fashion|pakaian|baju|clothing|hijab|distro|sepatu|tas|elektronik|gadget|handmade|minimarket|sembako|perabot|furnitur|furniture|otomotif|sparepart|pertanian|peternakan|material|bangunan|retail|boutique|olshop|kosmetik|kecantikan|skincare|parfum|aksesori|souvenir|batik|tenun|kerajinan|craft|merchandise|merch|mart|warung\s*sembako|toko\s*online)\b/.test(text);
  if (produkPattern) return 2;

  // Category 1: Jasa & Portofolio (default — covers all remaining archetypes):
  // booking_service: salon, spa, bengkel, klinik, travel, laundry, event/wedding,
  //                  pendidikan/kursus, rental, barbershop, gym, biro jasa
  // portfolio_individual: fotografer, videografer, desainer, ilustrator, developer, penulis, arsitek
  // professional_firm: agency, SEO, konsultan, coach, speaker, notaris
  // corporate_org: properti, konstruksi, manufaktur, logistik, koperasi
  // institution_org: yayasan, institusi pendidikan, pesantren
  // lodging: hotel, penginapan, villa, homestay
  // destination: destinasi wisata, tempat wisata
  // software_product: aplikasi, software, SaaS, platform, teknologi
  return 1;
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
