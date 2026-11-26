/**
 * Ad attribution (UTM & Click IDs) and conversion funnel tracking helper
 * for Meta Pixel (fbq), Google Analytics 4 / Google Ads (gtag), and TikTok Pixel (ttq).
 *
 * Safe to call anywhere: no-ops on SSR, inside preview iframes, or when
 * pixel scripts are not configured via environment variables.
 */

export const ATTRIBUTION_STORAGE_KEY = "webjoz_ad_attribution";

export interface AdAttribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  landing_path?: string;
  captured_at: number;
}

export type AdFunnelEvent =
  | "view_create"
  | "wizard_start"
  | "site_generated"
  | "save_clicked"
  | "registration"
  | "site_saved"
  | "purchase";

export interface AdEventParams {
  business_type?: string;
  business_sub_type?: string;
  mood?: string;
  template_id?: string;
  language?: string;
  order_id?: string;
  value?: number;
  currency?: string;
  plan_id?: number;
  payment_method?: string;
  /** "email" | "google" | "facebook" untuk event registration */
  method?: string;
  /**
   * ID dedup Meta. Jika kosong dibuat otomatis. Gunakan ID yang sama saat
   * mengirim event yang sama via Conversions API dari server.
   */
  event_id?: string;
  [key: string]: string | number | boolean | undefined;
}

const ATTRIBUTION_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
  "gclid",
  "ttclid",
] as const;

const TENANT_OR_PREVIEW_PREFIXES = ["/site", "/s/", "/preview", "/sp/"];

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    ttq?: {
      track: (event: string, data?: Record<string, unknown>) => void;
      page: () => void;
    };
  }
}

export function isTrackableWebjozContext(): boolean {
  if (typeof window === "undefined") return false;
  // Never fire Webjoz marketing pixels inside preview/dashboard iframes
  if (window.self !== window.top) return false;
  const path = window.location.pathname || "";
  if (TENANT_OR_PREVIEW_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }
  return true;
}

/**
 * Parse UTM and ad click IDs from a query string (e.g. window.location.search).
 * Returns null if no attribution parameters are present.
 */
export function parseAttributionFromSearch(
  search: string,
  landingPath?: string
): AdAttribution | null {
  if (!search) return null;
  const params = new URLSearchParams(search.startsWith("?") ? search : `?${search}`);
  const extracted: Partial<AdAttribution> = {};
  let hasAny = false;

  for (const key of ATTRIBUTION_KEYS) {
    const val = params.get(key)?.trim();
    if (val) {
      extracted[key] = val.slice(0, 200);
      hasAny = true;
    }
  }

  if (!hasAny) return null;

  return {
    ...extracted,
    ...(landingPath ? { landing_path: landingPath.slice(0, 200) } : {}),
    captured_at: Date.now(),
  };
}

/**
 * Capture UTM & click IDs from the current URL and persist them in localStorage.
 * Existing attribution is preserved if the current URL has no ad parameters.
 */
export function captureAttributionParams(
  search?: string,
  landingPath?: string
): AdAttribution | null {
  if (typeof window === "undefined") return null;

  const rawSearch = search ?? window.location.search;
  const rawPath = landingPath ?? window.location.pathname;
  const incoming = parseAttributionFromSearch(rawSearch, rawPath);

  if (!incoming) {
    return getStoredAttribution();
  }

  try {
    const existing = getStoredAttribution();
    const merged: AdAttribution = {
      ...(existing || {}),
      ...incoming,
    };
    window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return incoming;
  }
}

export function getStoredAttribution(): AdAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdAttribution;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function cleanParams(params: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") {
      out[k] = v;
    }
  }
  return out;
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

function generateEventId(event: string): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `${event}_${rand}`;
}

/**
 * Identitas browser untuk Meta Conversions API: cookie `_fbp`, `_fbc`
 * (dibangun dari `fbclid` jika cookie belum ada), plus atribusi UTM.
 * Kirim objek ini ke backend saat register/simpan site/bayar agar server
 * dapat mengirim event dengan match quality yang baik.
 */
export function getAdTrackingContext(): {
  fbp?: string;
  fbc?: string;
  attribution: AdAttribution | null;
} {
  const attribution = getStoredAttribution();
  const fbp = readCookie("_fbp");
  let fbc = readCookie("_fbc");
  if (!fbc && attribution?.fbclid) {
    fbc = `fb.1.${attribution.captured_at}.${attribution.fbclid}`;
  }
  return { ...(fbp ? { fbp } : {}), ...(fbc ? { fbc } : {}), attribution };
}

/**
 * Dispatch a conversion funnel event to configured pixels (Meta, GA4, TikTok).
 * Mengembalikan event_id yang dipakai (untuk dedup dengan CAPI) atau null
 * bila konteks tidak boleh dilacak.
 */
export function trackAdEvent(event: AdFunnelEvent, params: AdEventParams = {}): string | null {
  if (!isTrackableWebjozContext()) return null;

  const eventId = params.event_id
    ? String(params.event_id)
    : params.order_id
      ? String(params.order_id)
      : generateEventId(event);
  // event_id dipakai sebagai opsi dedup Meta, bukan sebagai parameter event
  const { event_id: _omit, ...rest } = params;
  void _omit;
  params = rest;
  const metaOpts = { eventID: eventId };

  const attribution = getStoredAttribution();
  const payload = cleanParams({
    ...params,
    utm_source: attribution?.utm_source,
    utm_medium: attribution?.utm_medium,
    utm_campaign: attribution?.utm_campaign,
    utm_content: attribution?.utm_content,
  });

  // 1. Meta Pixel (fbq) — semua event membawa eventID agar bisa di-dedup dengan CAPI
  if (typeof window.fbq === "function") {
    try {
      switch (event) {
        case "view_create":
          window.fbq(
            "track",
            "ViewContent",
            {
              content_name: "AI Website Wizard",
              content_category: params.business_type || "general",
              ...payload,
            },
            metaOpts
          );
          break;
        case "wizard_start":
          // Bukan checkout: pakai custom event agar funnel e-commerce tidak tercemar
          window.fbq("trackCustom", "WizardStart", payload, metaOpts);
          break;
        case "site_generated":
          window.fbq("trackCustom", "PreviewGenerated", payload, metaOpts);
          break;
        case "save_clicked":
          window.fbq("trackCustom", "SaveSiteIntent", payload, metaOpts);
          break;
        case "registration":
          window.fbq(
            "track",
            "CompleteRegistration",
            { content_name: "Webjoz Account Created", status: true, ...payload },
            metaOpts
          );
          break;
        case "site_saved":
          // User sudah login dan menyimpan website = lead berkualitas
          window.fbq(
            "track",
            "Lead",
            { content_name: "Website Created & Saved", ...payload },
            metaOpts
          );
          break;
        case "purchase":
          window.fbq(
            "track",
            "Purchase",
            {
              content_name: "Plan Upgrade",
              currency: params.currency || "IDR",
              ...payload,
            },
            metaOpts
          );
          break;
      }
    } catch {
      /* ignore pixel runtime errors */
    }
  }

  // 2. Google Analytics 4 / Google Ads (gtag)
  if (typeof window.gtag === "function") {
    try {
      const gaEventName =
        event === "wizard_start"
          ? "begin_wizard"
          : event === "site_saved"
          ? "generate_lead"
          : event === "registration"
          ? "sign_up"
          : event === "purchase"
          ? "purchase"
          : event;
      window.gtag("event", gaEventName, payload);
    } catch {
      /* ignore gtag runtime errors */
    }
  }

  // 3. TikTok Pixel (ttq)
  if (window.ttq && typeof window.ttq.track === "function") {
    try {
      const ttEventName =
        event === "view_create"
          ? "ViewContent"
          : event === "wizard_start"
          ? "ClickButton"
          : event === "site_saved"
          ? "SubmitForm"
          : event === "save_clicked" || event === "site_generated"
          ? "ClickButton"
          : event === "purchase"
          ? "CompletePayment"
          : "CompleteRegistration";
      window.ttq.track(ttEventName, payload);
    } catch {
      /* ignore ttq runtime errors */
    }
  }

  return eventId;
}

/** Buat event_id baru (dipakai bersama oleh Pixel di browser dan CAPI di server). */
export function createAdEventId(event: AdFunnelEvent): string {
  return generateEventId(event);
}

/** Payload atribusi yang dikirim ke backend bersama register / social login. */
export interface AttributionPayload {
  event_id: string;
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  gclid?: string;
  ttclid?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landing_path?: string;
  source_url?: string;
}

/**
 * Bangun payload atribusi untuk backend (first-touch disimpan server-side,
 * dan dipakai untuk event Meta Conversions API dengan event_id yang sama).
 */
export function buildAttributionPayload(eventId: string): AttributionPayload {
  const { fbp, fbc, attribution } = getAdTrackingContext();
  const payload: AttributionPayload = {
    event_id: eventId,
    fbp,
    fbc,
    fbclid: attribution?.fbclid,
    gclid: attribution?.gclid,
    ttclid: attribution?.ttclid,
    utm_source: attribution?.utm_source,
    utm_medium: attribution?.utm_medium,
    utm_campaign: attribution?.utm_campaign,
    utm_content: attribution?.utm_content,
    utm_term: attribution?.utm_term,
    landing_path: attribution?.landing_path,
    source_url: typeof window !== "undefined" ? window.location.href.slice(0, 500) : undefined,
  };
  return cleanParams(payload as unknown as Record<string, unknown>) as unknown as AttributionPayload;
}
