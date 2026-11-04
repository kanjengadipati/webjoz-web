/**
 * taxonomy-v2.ts — v2 taxonomy helpers (Tahap 4).
 *
 * Maps between v1 (business_type / business_sub_type) and v2
 * (archetype / industry_id) representations. Used by:
 *   - wizard-persistence (resume key v2)
 *   - processBusinessDescription response backfill
 *   - generate payload enrichment
 *
 * The mapping table mirrors adaptor_compat.go on the API side.
 * Keep both files in sync when adding new industries.
 */

import type { ProcessBusinessDescriptionResult } from "@/lib/api/ai";

// ── mapping tables ──────────────────────────────────────────────────────────

/** v1 sub-type → [archetype, industry_id] */
const SUB_TYPE_TO_V2: Record<string, [string, string]> = {
  // Kuliner
  "Restoran & Warung Makan":             ["food_venue", "food.restaurant"],
  "Kuliner Tradisional & Nusantara":     ["food_venue", "food.traditional"],
  "Kafe":                                ["food_venue", "food.cafe"],
  "Bakery & Pastry":                     ["food_venue", "food.bakery"],
  "Catering":                            ["food_venue", "food.catering"],
  "Minuman & Bubble Tea":                ["food_venue", "food.beverage"],
  "Makanan Rumahan & Frozen Food":       ["food_venue", "food.home_kitchen"],
  "Frozen Food Homemade":               ["food_venue", "food.home_kitchen"],
  "Kuliner Kaki Lima & Angkringan":      ["food_venue", "food.street_stall"],
  "Jajanan Pasar & Kuliner Tradisional": ["food_venue", "food.market_snacks"],
  "Herbal & Jamu":                       ["food_venue", "food.herbal"],
  // Toko
  "Fashion & Pakaian":                   ["retail_catalog", "shop.fashion"],
  "Elektronik":                          ["retail_catalog", "shop.electronics"],
  "Kecantikan & Kosmetik":              ["retail_catalog", "shop.beauty"],
  "Produk Lokal Handmade":              ["retail_catalog", "shop.handmade"],
  "Minimarket & Sembako":               ["retail_catalog", "shop.grocery"],
  "Perabot & Furnitur":                 ["retail_catalog", "shop.furniture"],
  "Otomotif & Sparepart":               ["retail_catalog", "shop.auto_parts"],
  "Pertanian & Peternakan":             ["retail_catalog", "shop.agri"],
  "Material & Bahan Bangunan":          ["retail_catalog", "shop.building_materials"],
  // Layanan & Reservasi
  "Rental Mobil & Kendaraan":           ["booking_service", "service.vehicle_rental"],
  "Travel & Wisata":                    ["booking_service", "service.travel_agent"],
  "Hotel & Penginapan":                 ["lodging", "stay.hotel"],
  "Makeup Artist (MUA)":                ["booking_service", "service.mua"],
  "Salon & Kecantikan":                 ["booking_service", "service.salon"],
  "Barbershop":                         ["booking_service", "service.barbershop"],
  "Klinik & Kesehatan":                 ["booking_service", "health.clinic"],
  "Gym & Olahraga":                     ["booking_service", "service.fitness"],
  "Event & Wedding Organizer":          ["booking_service", "service.event_wedding"],
  "Bengkel Motor":                      ["booking_service", "service.motorcycle_repair"],
  "Bengkel Mobil & Otomotif":           ["booking_service", "service.car_repair"],
  "Laundry":                            ["booking_service", "service.laundry"],
  "Jasa Rumah & Kebersihan":            ["booking_service", "service.home_services"],
  "Pendidikan & Kursus":                ["booking_service", "service.course"],
  "Biro Jasa & Perizinan":             ["booking_service", "service.permits_agency"],
  "Koperasi & Simpan Pinjam":          ["corporate_org", "corp.cooperative"],
  // Portofolio
  "Fotografer":                         ["portfolio_individual", "creator.photographer"],
  "Videografer":                        ["portfolio_individual", "creator.videographer"],
  "Desainer":                           ["portfolio_individual", "creator.designer"],
  "Ilustrator & Seniman":              ["portfolio_individual", "creator.illustrator"],
  "Konten Kreator":                     ["portfolio_individual", "creator.content_creator"],
  "Developer & IT":                     ["portfolio_individual", "creator.developer"],
  "Penulis & Copywriter":              ["portfolio_individual", "creator.writer"],
  "Arsitek & Desainer Interior":       ["portfolio_individual", "creator.architect_interior"],
  "Musisi & Entertainer":              ["portfolio_individual", "creator.musician"],
  // Kreatif & Profesional
  "Digital & Marketing Agency":        ["professional_firm", "pro.digital_agency"],
  "SEO & Digital Specialist":          ["professional_firm", "pro.seo"],
  "Konsultan":                         ["professional_firm", "pro.consultant"],
  "Tutor & Life Coach":                ["professional_firm", "pro.coach_tutor"],
  "Public Speaker & Trainer":          ["professional_firm", "pro.speaker_trainer"],
  "Notaris & PPAT":                    ["professional_firm", "pro.notary"],
  // Company Profile
  "Properti & Real Estate":            ["corporate_org", "corp.property_developer"],
  "Konstruksi & Kontraktor":           ["corporate_org", "corp.construction"],
  "Manufaktur & Pabrik":               ["corporate_org", "corp.manufacturing"],
  "Logistik & Ekspedisi":              ["corporate_org", "corp.logistics"],
  "Yayasan & Organisasi Nonprofit":    ["institution_org", "inst.foundation_charity"],
  "Institusi Pendidikan & Pesantren":  ["institution_org", "inst.school"],
};

/** industry_id → [v1_type, v1_sub_type] */
const INDUSTRY_ID_TO_V1: Record<string, [string, string]> = Object.fromEntries(
  Object.entries(SUB_TYPE_TO_V2).map(([sub, [arch, id]]) => [
    id,
    [archetypeToLegacyType(arch), sub] as [string, string],
  ])
);

/** archetype → canonical v1 type */
function archetypeToLegacyType(archetype: string): string {
  switch (archetype) {
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

// ── public helpers ──────────────────────────────────────────────────────────

/** Returns [archetype, industry_id] for a known v1 sub-type, or null. */
export function subTypeToV2(subType: string): [string, string] | null {
  return SUB_TYPE_TO_V2[subType] ?? null;
}

/** Returns [v1_type, v1_sub_type] for a known industry_id, or null. */
export function industryIdToV1(industryId: string): [string, string] | null {
  return INDUSTRY_ID_TO_V1[industryId] ?? null;
}

/**
 * Backfills missing v2 fields (archetype, industry_id) on a classify result
 * and missing v1 fields (type, sub_type) when only v2 is present.
 * Mutates in-place and returns the same object.
 */
export function backfillClassifyResultV2(
  result: ProcessBusinessDescriptionResult
): ProcessBusinessDescriptionResult {
  const hasV2 = !!result.archetype;
  const hasV1 = !!result.type;

  if (!hasV2 && hasV1) {
    // Fill v2 from v1
    if (result.sub_type) {
      const v2 = SUB_TYPE_TO_V2[result.sub_type];
      if (v2) {
        result.archetype = v2[0];
        result.industry_id = v2[1];
      }
    }
    if (!result.archetype) {
      const arch = legacyTypeToArchetype(result.type ?? "");
      if (arch) result.archetype = arch;
    }
  }

  if (hasV2 && !hasV1 && result.industry_id) {
    // Fill v1 from v2
    const v1 = INDUSTRY_ID_TO_V1[result.industry_id];
    if (v1) {
      result.type = v1[0];
      result.sub_type = v1[1];
    } else if (result.archetype) {
      result.type = archetypeToLegacyType(result.archetype);
    }
  }

  return result;
}

function legacyTypeToArchetype(legacyType: string): string {
  switch (legacyType) {
    case "Kuliner":               return "food_venue";
    case "Toko":                  return "retail_catalog";
    case "Layanan & Reservasi":   return "booking_service";
    case "Portofolio":            return "portfolio_individual";
    case "Kreatif & Profesional": return "professional_firm";
    case "Company Profile":       return "corporate_org";
    default:                      return "";
  }
}

/**
 * Enriches a generate payload with v2 fields derived from v1 fields,
 * enabling the BE adaptor to log both representations.
 */
export function enrichGeneratePayloadV2(payload: {
  business_type?: string;
  business_sub_type?: string;
  archetype?: string;
  industry_id?: string;
  industry_custom?: string;
}): { archetype?: string; industry_id?: string; industry_custom?: string } {
  if (payload.archetype || payload.industry_id) {
    return {
      archetype: payload.archetype,
      industry_id: payload.industry_id,
      industry_custom: payload.industry_custom,
    };
  }
  if (payload.business_sub_type) {
    const v2 = SUB_TYPE_TO_V2[payload.business_sub_type];
    if (v2) {
      return { archetype: v2[0], industry_id: v2[1] };
    }
  }
  if (payload.business_type) {
    const arch = legacyTypeToArchetype(payload.business_type);
    if (arch) return { archetype: arch };
  }
  return {};
}
