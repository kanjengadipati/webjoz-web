import type { InferenceConfidence, InferenceResult } from "./types";

/** Map archetype ID to the nearest v1 legacy type for backward compat. */
export function archetypeToLegacyType(arch: string): string {
  switch (arch) {
    case "food_venue":           return "Kuliner";
    case "retail_catalog":       return "Toko";
    case "booking_service":      return "Layanan & Reservasi";
    case "portfolio_individual": return "Portofolio";
    case "professional_firm":    return "Kreatif & Profesional";
    case "corporate_org":
    case "lodging":
    case "institution_org":
    case "destination":
    case "software_product":     return "Company Profile";
    default:                     return "";
  }
}

/** v2 fields of a classify / refine response (snake_case, as the API returns them). */
export type ClassifyV2Fields = {
  archetype?: string;
  industry_id?: string;
  industry_custom?: string;
  confidence?: string;
};

/**
 * A classification already obtained by the caller (skip path, voice path) and
 * handed to processDescriptionSubmission so it does not classify twice.
 * It MUST carry the v2 fields too; dropping them forces the v1-only routing.
 */
export type PreInferred = {
  type?: string;
  subType?: string;
  archetype?: string;
  industryId?: string;
  industryCustom?: string;
  confidence?: InferenceConfidence;
};

export function toConfidence(c?: string): InferenceConfidence {
  return c === "high" || c === "medium" ? c : "low";
}

/** Build a PreInferred from the v1-validated pair plus the API's v2 fields. */
export function preInferredFromClassify(
  base: { type?: string; subType?: string },
  d?: ClassifyV2Fields | null,
): PreInferred {
  return {
    type: base.type,
    subType: base.subType,
    archetype: d?.archetype || undefined,
    industryId: d?.industry_id || undefined,
    industryCustom: d?.industry_custom || undefined,
    confidence: toConfidence(d?.confidence),
  };
}

/**
 * The single rule that turns v2 fields into an InferenceResult. Used by every
 * entry point (typed description, skip, voice) so they cannot diverge:
 * archetype + industry_id + "high" => resolved industry (skip the sub-type picker).
 * Anything else keeps the v1 result unchanged.
 */
export function applyV2Inference(
  base: InferenceResult,
  v2?: { archetype?: string; industryId?: string; confidence?: string } | null,
): InferenceResult {
  if (v2?.archetype && v2.industryId && v2.confidence === "high") {
    return {
      ...base,
      type: base.type || archetypeToLegacyType(v2.archetype),
      subType: base.subType || "",
      confidence: "high",
      industryId: v2.industryId,
      industryLabel: v2.industryId,
    };
  }
  return base;
}
