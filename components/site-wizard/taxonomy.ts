import { BUSINESS_TYPES, SUB_TYPES } from "./constants";

export type Classification = { type: string; subType: string };

// Legacy business_type values → canonical type.
// Mirror of api/internal/modules/aisite/taxonomy.go legacyTypeAliases — keep in sync.
const LEGACY_TYPE_ALIASES: Record<string, string> = {
  "Jasa": "Layanan & Reservasi",
  "Jasa & Booking": "Layanan & Reservasi",
  "Toko & UMKM": "Toko",
  "Toko Online & Retail": "Toko",
  "Company": "Company Profile",
  "Portofolio & Kreator": "Kreatif & Profesional",
};

const CANONICAL_TYPES = BUSINESS_TYPES.map((t) => t.value);

/**
 * Normalisasi business_type legacy → kanonis (case-insensitive, trim).
 * Input tak dikenal dikembalikan apa adanya (pemanggil memutuskan via validate).
 */
export function normalizeLegacyType(businessType: string): string {
  const bt = (businessType || "").trim();
  if (!bt) return "";
  const lower = bt.toLowerCase();
  for (const value of CANONICAL_TYPES) {
    if (value.toLowerCase() === lower) return value;
  }
  for (const [alias, canonical] of Object.entries(LEGACY_TYPE_ALIASES)) {
    if (alias.toLowerCase() === lower) return canonical;
  }
  return bt;
}

/**
 * Guard klasifikasi hasil AI / local dictionary / prefill / resume.
 * Mengembalikan pasangan { type, subType } kanonis, atau null bila tidak valid.
 * subType boleh kosong hanya bila input subType kosong (type-only valid).
 * Mirrors api Go ValidateTaxonomy / splitTaxonomyLookup.
 */
export function validateClassification(
  businessType?: string,
  businessSubType?: string
): Classification | null {
  const rawType = (businessType || "").trim();
  const rawSub = (businessSubType || "").trim();
  if (!rawType && !rawSub) return null;

  // Legacy ambigu: resolve via keanggotaan sub-type, seperti backend.
  if (rawType.toLowerCase() === "portofolio & kreator" && rawSub) {
    const hit = (SUB_TYPES["Portofolio"] || []).find(
      (s) => s.value.toLowerCase() === rawSub.toLowerCase()
    );
    if (hit) return { type: "Portofolio", subType: hit.value };
  }

  const normType = normalizeLegacyType(rawType);
  if (!normType) return null;
  const canonicalType = CANONICAL_TYPES.find((v) => v.toLowerCase() === normType.toLowerCase());
  if (!canonicalType) return null;
  if (!rawSub) return { type: canonicalType, subType: "" };

  const subs = SUB_TYPES[canonicalType] || [];
  const subHit = subs.find((s) => s.value.toLowerCase() === rawSub.toLowerCase());
  if (!subHit) return null;
  return { type: canonicalType, subType: subHit.value };
}

/**
 * Guard untuk prefill/resume/generate: pasangan kanonis bila valid;
 * fallback type-only bila hanya sub-nya yang tidak valid;
 * businessType tak dikenal dibiarkan apa adanya (backend fallback),
 * sub-nya selalu di-drop bila tidak kanonis.
 */
export function sanitizeClassificationPair(
  businessType?: string,
  businessSubType?: string
): { businessType: string; businessSubType: string } {
  const pair =
    validateClassification(businessType, businessSubType) ??
    validateClassification(businessType, "");
  return {
    businessType: pair?.type ?? (businessType || "").trim(),
    businessSubType: pair?.subType ?? "",
  };
}
