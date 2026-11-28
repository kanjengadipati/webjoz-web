import { request } from "@/lib/api/client";
import type { EligibilityPayload } from "@/lib/variant-eligibility";

export interface EligibilityQuery {
  section: string;
  archetype?: string;
  industryId?: string;
  entity?: string;
}

/**
 * Public, unauthenticated, deterministic endpoint (cached for 1h by the API).
 * Returns null on any failure so the picker silently falls back to showing
 * every variant, exactly as before.
 */
export async function fetchVariantEligibility(q: EligibilityQuery): Promise<EligibilityPayload | null> {
  try {
    const params = new URLSearchParams({ section: q.section });
    if (q.archetype) params.set("archetype", q.archetype);
    if (q.industryId) params.set("industry_id", q.industryId);
    if (q.entity) params.set("entity", q.entity);
    const resp = await request<EligibilityPayload>(`/ai/public/variant-eligibility?${params.toString()}`);
    return resp.data ?? null;
  } catch {
    return null;
  }
}
