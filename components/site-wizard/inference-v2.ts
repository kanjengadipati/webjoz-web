export type InferenceRoute = "confirm" | "suggest" | "pick";

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
  needs_choice?: boolean;
  suggested_industry_id?: string;
};

/** Pre-inferred state from v1 classification (carried through skip/voice paths). */
export type PreInferred = {
  type?: string;
  subType?: string;
  archetype?: string;
  industryId?: string;
  industryCustom?: string;
  confidence?: string;
  /** True bila teks deskripsi berasal dari AI (jalur skip/voice), bukan diketik pengguna. */
  descriptionFromAI?: boolean;
};

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
    confidence: d?.confidence === "high" || d?.confidence === "medium" ? d?.confidence : "low",
  };
}

/** The single rule that turns v2 fields into an InferenceResult. Used by every
 * entry point (typed description, skip, voice) so they cannot diverge:
 * archetype + industry_id + "high" => resolved industry (skip the sub-type picker).
 * Anything else keeps the v1 result unchanged. */
export function routeInference(
  d?: {
    needs_choice?: boolean;
    industry_id?: string;
    suggested_industry_id?: string;
  } | null,
): InferenceRoute {
  if (!d) return "pick";
  if (!d.needs_choice && d.industry_id) return "confirm";
  if (d.suggested_industry_id) return "suggest";
  return "pick";
}

/** Merge v2 fields (archetype, industryId) from aiResult/preInferred into an
 * InferenceResult. Used by every description-submission entry point so the
 * merging logic stays in one place. */
export function classifyInference(
  result: import("./types").InferenceResult,
  preInferred: PreInferred | null | undefined,
  aiResult: { archetype?: string; industry_id?: string; confidence?: string } | null | undefined,
): import("./types").InferenceResult {
  const industryId = aiResult?.industry_id || preInferred?.industryId || undefined;
  const confidence = (aiResult?.confidence || preInferred?.confidence || result.confidence) as import("./types").InferenceConfidence;
  return {
    ...result,
    ...(industryId ? { industryId } : {}),
    confidence,
  };
}

/** Alias untuk kompatibilitas dengan kode lama. */
export function routeInferenceOld(
  conf: string,
  industryId: string | undefined,
  suggestedIndustryId: string | undefined,
): InferenceRoute {
  return routeInference({ needs_choice: conf !== "high", industry_id: industryId, suggested_industry_id: suggestedIndustryId });
}