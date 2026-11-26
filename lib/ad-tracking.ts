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
  | "site_saved";

export interface AdEventParams {
  business_type?: string;
  business_sub_type?: string;
  mood?: string;
  template_id?: string;
  language?: string;
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

/**
 * Dispatch a conversion funnel event to configured pixels (Meta, GA4, TikTok).
 */
export function trackAdEvent(event: AdFunnelEvent, params: AdEventParams = {}): void {
  if (!isTrackableWebjozContext()) return;

  const attribution = getStoredAttribution();
  const payload = cleanParams({
    ...params,
    utm_source: attribution?.utm_source,
    utm_medium: attribution?.utm_medium,
    utm_campaign: attribution?.utm_campaign,
    utm_content: attribution?.utm_content,
  });

  // 1. Meta Pixel (fbq)
  if (typeof window.fbq === "function") {
    try {
      switch (event) {
        case "view_create":
          window.fbq("track", "ViewContent", {
            content_name: "AI Website Wizard",
            content_category: params.business_type || "general",
            ...payload,
          });
          break;
        case "wizard_start":
          window.fbq("track", "InitiateCheckout", {
            content_name: "Wizard Generation Started",
            ...payload,
          });
          break;
        case "site_generated":
          window.fbq("track", "Lead", {
            content_name: "AI Website Preview Generated",
            ...payload,
          });
          break;
        case "save_clicked":
          window.fbq("trackCustom", "SaveSiteIntent", payload);
          break;
        case "site_saved":
          window.fbq("track", "CompleteRegistration", {
            content_name: "Website Created & Saved",
            ...payload,
          });
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
          : event === "site_generated"
          ? "generate_lead"
          : event === "site_saved"
          ? "sign_up"
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
          ? "InitiateCheckout"
          : event === "site_generated"
          ? "SubmitForm"
          : event === "save_clicked"
          ? "ClickButton"
          : "CompleteRegistration";
      window.ttq.track(ttEventName, payload);
    } catch {
      /* ignore ttq runtime errors */
    }
  }
}
