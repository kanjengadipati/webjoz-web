import { request } from "@/lib/api/client";

export interface ShowcaseArchetypeOption {
  id: string;
  label_id: string;
  label_en: string;
}

export interface ShowcaseSiteItem {
  /** sqids hash_id of the site */
  site_id: string;
  business_name: string;
  site_name: string;
  subdomain: string;
  url: string;
  host: string;
  template_id: string;
  /** effective archetype: admin override → site's own → "" */
  archetype: string;
  archetype_label?: string;
  /** admin's explicit choice; "" = automatic */
  archetype_override: string;
  /** archetype stored on the website itself */
  own_archetype: string;
  group?: string;
}

export interface ShowcaseCandidate extends ShowcaseSiteItem {
  owner_name?: string;
  owner_role?: string;
  selected: boolean;
}

export interface ShowcaseSaveItem {
  site_id: string;
  business_name: string;
  /** "" = use the site's own archetype */
  archetype: string;
}

export const ADMIN_SHOWCASE_PATH = "/admin/showcase-sites";

export function fetchAdminShowcase(token: string) {
  return request<{ items: ShowcaseSiteItem[]; archetypes: ShowcaseArchetypeOption[] }>(
    ADMIN_SHOWCASE_PATH,
    {},
    token,
  );
}

export function fetchShowcaseCandidates(token: string, search = "") {
  const qs = search.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return request<ShowcaseCandidate[]>(`${ADMIN_SHOWCASE_PATH}/candidates${qs}`, {}, token);
}

export function saveAdminShowcase(token: string, items: ShowcaseSaveItem[]) {
  return request<{ items: ShowcaseSiteItem[] }>(
    ADMIN_SHOWCASE_PATH,
    { method: "PUT", body: JSON.stringify({ items }) },
    token,
  );
}
