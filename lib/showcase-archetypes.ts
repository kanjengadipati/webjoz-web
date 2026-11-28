/**
 * showcase-archetypes.ts — presentation metadata for the 10 v2 archetypes used
 * by the landing mockup and the "Inspirasi Website" modal.
 *
 * Source of truth for the archetype *list* is the API
 * (GET /public/showcase-sites → archetypes, mirrors api/internal/taxonomy).
 * This file only adds emoji + short chip labels and the keyword fallback used
 * for sites whose business_archetype is still empty (generated before v2).
 */

export const ARCHETYPE_ORDER = [
  "food_venue",
  "retail_catalog",
  "booking_service",
  "portfolio_individual",
  "professional_firm",
  "corporate_org",
  "lodging",
  "institution_org",
  "destination",
  "software_product",
] as const;

export type ArchetypeId = (typeof ARCHETYPE_ORDER)[number];

interface ChipMeta {
  emoji: string;
  id: string;
  en: string;
}

const CHIP_META: Record<string, ChipMeta> = {
  food_venue: { emoji: "🍜", id: "Makanan & Minuman", en: "Food & Drink" },
  retail_catalog: { emoji: "🛍", id: "Toko & Jualan", en: "Shop & Retail" },
  booking_service: { emoji: "🔧", id: "Jasa & Booking", en: "Services & Booking" },
  portfolio_individual: { emoji: "🎨", id: "Portofolio Pribadi", en: "Personal Portfolio" },
  professional_firm: { emoji: "💼", id: "Jasa Profesional & Agensi", en: "Professional Firm & Agency" },
  corporate_org: { emoji: "🏢", id: "Perusahaan", en: "Company" },
  lodging: { emoji: "🏨", id: "Penginapan", en: "Lodging" },
  institution_org: { emoji: "🎓", id: "Institusi & Organisasi", en: "Institution & Organisation" },
  destination: { emoji: "🏝", id: "Destinasi & Atraksi", en: "Destination & Attraction" },
  software_product: { emoji: "💻", id: "Produk Software", en: "Software Product" },
};

export function archetypeEmoji(id: string): string {
  return CHIP_META[id]?.emoji ?? "🌐";
}

/** Short label, e.g. "🍜 Kuliner". Unknown ids fall back to the raw id. */
export function archetypeChipLabel(id: string, isIndonesian: boolean): string {
  const m = CHIP_META[id];
  if (!m) return id;
  return `${m.emoji} ${isIndonesian ? m.id : m.en}`;
}

/** Plain label without emoji (tabs). Prefers the API label when supplied. */
export function archetypeLabel(
  id: string,
  isIndonesian: boolean,
  fromApi?: { label_id: string; label_en: string },
): string {
  if (fromApi) return isIndonesian ? fromApi.label_id : fromApi.label_en;
  const m = CHIP_META[id];
  return m ? (isIndonesian ? m.id : m.en) : id;
}

/**
 * The mockup's skeleton still has three visual layouts (0 kuliner, 1 jasa,
 * 2 produk). Map every archetype onto the closest one.
 */
export function archetypeToCategoryIndex(id: string): 0 | 1 | 2 {
  if (id === "food_venue") return 0;
  if (id === "retail_catalog") return 2;
  return 1;
}

/**
 * Chip window for the chat mockup: `size` consecutive archetypes that always
 * include `selected` (the real list has 10, the bubble only fits a few).
 * @deprecated Use MOCKUP_CHIP_GROUPS + archetypeToMockupGroup instead.
 */
export function archetypeChipWindow(selected: string, size = 4): string[] {
  const order = ARCHETYPE_ORDER as readonly string[];
  const idx = order.indexOf(selected);
  if (idx === -1) return order.slice(0, size) as string[];
  const start = Math.max(0, Math.min(idx - 1, order.length - size));
  return order.slice(start, start + size) as string[];
}

/* ═══════════════════════════════════════════════════════════════════════════
 * ARCHETYPE GROUP SYSTEM
 * 10 archetypes → 4 parent groups (for thumbnails, dropdown, mockup chips).
 * ═══════════════════════════════════════════════════════════════════════════ */

export interface ArchetypeGroup {
  key: string;
  emoji: string;
  /** ID label shown in Indonesian UI */
  labelId: string;
  /** EN label */
  labelEn: string;
  /** Short label for narrow chips */
  shortId: string;
  shortEn: string;
  /** Archetype IDs that belong to this group */
  archetypes: string[];
}

/** 4 parent groups — single source of truth for grouping everywhere. */
export const ARCHETYPE_GROUPS: ArchetypeGroup[] = [
  {
    key: "kuliner_toko",
    emoji: "🍜",
    labelId: "Kuliner & Toko",
    labelEn: "Food & Shop",
    shortId: "Kuliner & Toko",
    shortEn: "Food & Shop",
    archetypes: ["food_venue", "retail_catalog"],
  },
  {
    key: "jasa_reservasi",
    emoji: "🔧",
    labelId: "Jasa & Reservasi",
    labelEn: "Services & Booking",
    shortId: "Jasa & Reservasi",
    shortEn: "Services",
    archetypes: ["booking_service", "lodging", "destination"],
  },
  {
    key: "kreatif_pro",
    emoji: "🎨",
    labelId: "Kreatif & Pro",
    labelEn: "Creative & Pro",
    shortId: "Kreatif & Pro",
    shortEn: "Creative & Pro",
    archetypes: ["portfolio_individual", "professional_firm", "software_product"],
  },
  {
    key: "bisnis_institusi",
    emoji: "🏢",
    labelId: "Bisnis & Institusi",
    labelEn: "Business & Institution",
    shortId: "Bisnis & Institusi",
    shortEn: "Business",
    archetypes: ["corporate_org", "institution_org"],
  },
];

/** Map archetype id → parent group */
const _ARCHETYPE_TO_GROUP: Record<string, ArchetypeGroup> = {};
for (const g of ARCHETYPE_GROUPS) {
  for (const id of g.archetypes) _ARCHETYPE_TO_GROUP[id] = g;
}

/** Returns the parent group for an archetype id. Falls back to "jasa_reservasi" group. */
export function archetypeGroup(id: string): ArchetypeGroup {
  return _ARCHETYPE_TO_GROUP[id] ?? ARCHETYPE_GROUPS[1];
}

/** Group label string — used as the `group` prop in CustomSelect options. */
export function archetypeGroupLabel(id: string, isIndonesian: boolean): string {
  const g = archetypeGroup(id);
  return isIndonesian ? g.labelId : g.labelEn;
}

/**
 * 4 group-chip objects for the interactive mockup chat bubble, derived directly
 * from ARCHETYPE_GROUPS so chip labels and grouping stay in sync everywhere.
 */
export const MOCKUP_CHIP_GROUPS: Array<{
  key: string;
  emoji: string;
  labelId: string;
  labelEn: string;
  archetypes: string[];
}> = ARCHETYPE_GROUPS.map((g) => ({
  key: g.key,
  emoji: g.emoji,
  labelId: g.shortId,
  labelEn: g.shortEn,
  archetypes: g.archetypes,
}));

/** Returns the MOCKUP_CHIP_GROUPS key that the given archetype belongs to. */
export function archetypeToMockupGroup(id: string): string {
  return archetypeGroup(id).key;
}

/** Keyword fallback for sites that have no stored archetype. */
export function inferArchetypeFromText(text: string): ArchetypeId {
  const t = text.toLowerCase();
  const has = (re: RegExp) => re.test(t);

  if (has(/\b(saas|software|aplikasi|app|platform|startup|fintech|api)\b/)) return "software_product";
  if (has(/\b(hotel|penginapan|villa|homestay|guest\s*house|guesthouse|resort|hostel|glamping|kost)\b/)) return "lodging";
  if (has(/\b(wisata|destinasi|objek\s*wisata|taman|pantai|wahana|candi|museum|waterpark|kebun\s*binatang)\b/)) return "destination";
  if (
    has(
      /\b(restoran|warung|makan|kuliner|kafe|cafe|coffee|kopi|bakery|pastry|catering|boba|bubble\s*tea|minuman|beverage|drink|frozen\s*food|jamu|angkringan|kaki\s*lima|jajanan|dapur|kitchen|food|snack|cake|roti|wedang|es\s*krim|gelato|pizza|burger|sushi|mie|nasi|ayam|seafood|sate|martabak|gorengan)\b/,
    )
  )
    return "food_venue";
  if (
    has(
      /\b(toko|shop|store|produk|product|fashion|pakaian|baju|clothing|hijab|distro|sepatu|elektronik|gadget|handmade|minimarket|sembako|perabot|furnitur|furniture|olshop|kosmetik|skincare|parfum|aksesori|souvenir|batik|tenun|kerajinan|craft|merch|boutique|retail)\b/,
    )
  )
    return "retail_catalog";
  if (has(/\b(yayasan|sekolah|pesantren|universitas|institut|akademi|masjid|gereja|komunitas|organisasi|koperasi)\b/)) return "institution_org";
  if (has(/\b(portfolio|portofolio|fotografer|photographer|videografer|desainer|designer|ilustrator|developer|dev|freelance|arsitek|penulis|engineer)\b/)) return "portfolio_individual";
  if (has(/\b(agency|agensi|konsultan|consulting|consultant|hukum|law|legal|notaris|akuntan|coach|speaker|studio)\b/)) return "professional_firm";
  if (has(/\b(cv|pt|perusahaan|company|konstruksi|kontraktor|manufaktur|logistik|properti|developer\s*properti|industri)\b/)) return "corporate_org";
  return "booking_service";
}
