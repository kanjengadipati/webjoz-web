/**
 * archetype-meta.ts — single frontend source for archetype metadata.
 *
 * The API (GET /ai/public/taxonomy/v2) returns `legacy_type`, `context_type`
 * and `entity` on every archetype. useTaxonomyV2 pushes that list here via
 * setArchetypeMeta(). All archetype → v1-type / → entity lookups in the wizard
 * go through the exported helpers, so adding a new archetype needs no frontend
 * change.
 *
 * FALLBACK mirrors api/internal/taxonomy/archetypes.go. It is used only on the
 * first render (before the taxonomy request resolves) and when the v2 endpoint
 * is unavailable. It deliberately has no imports so Node's TS stripper can
 * load it directly in the script tests.
 */

export interface ArchetypeMetaInput {
  id: string;
  legacy_type?: string;
  context_type?: string;
  entity?: string;
}

export interface ArchetypeMeta {
  legacyType: string;
  contextType: string;
  entity: "" | "individual" | "organization";
}

type EntityValue = "individual" | "organization" | null;

// Definition order matches taxonomy.Archetypes: it decides the canonical
// archetype for the many-to-one "Company Profile" legacy label.
const FALLBACK: Record<string, ArchetypeMeta> = {
  food_venue:           { legacyType: "Kuliner",             contextType: "Kuliner",             entity: "" },
  retail_catalog:       { legacyType: "Toko",                contextType: "Toko",                entity: "" },
  booking_service:      { legacyType: "Layanan & Reservasi", contextType: "Layanan & Reservasi", entity: "" },
  portfolio_individual: { legacyType: "Portofolio",          contextType: "Portofolio",          entity: "individual" },
  professional_firm:    { legacyType: "Kreatif & Profesional", contextType: "Kreatif & Profesional", entity: "organization" },
  corporate_org:        { legacyType: "Company Profile",     contextType: "Company Profile",     entity: "organization" },
  lodging:              { legacyType: "Company Profile",     contextType: "Lodging",             entity: "" },
  institution_org:      { legacyType: "Company Profile",     contextType: "Institution",         entity: "organization" },
  destination:          { legacyType: "Company Profile",     contextType: "Destination",         entity: "" },
  software_product:     { legacyType: "Company Profile",     contextType: "Software Product",    entity: "" },
};

let byID: Record<string, ArchetypeMeta> = FALLBACK;
let reverseByContext: Record<string, string> = {};
let reverseByLegacy: Record<string, string> = {};

function buildReverse(list: ArchetypeMetaInput[], meta: Record<string, ArchetypeMeta>) {
  const ctx: Record<string, string> = {};
  const legacy: Record<string, string> = {};
  for (const entry of list) {
    const m = meta[entry.id];
    if (!m) continue;
    // ContextType is 1:1 and wins over the many-to-one LegacyType. First entry
    // in list order is canonical (matches taxonomy.ArchetypeForLegacyType).
    if (m.contextType && !(m.contextType in ctx)) ctx[m.contextType] = entry.id;
    if (m.legacyType && !(m.legacyType in legacy)) legacy[m.legacyType] = entry.id;
  }
  reverseByContext = ctx;
  reverseByLegacy = legacy;
}

buildReverse(
  Object.entries(FALLBACK).map(([id, m]) => ({
    id,
    legacy_type: m.legacyType,
    context_type: m.contextType,
    entity: m.entity,
  })),
  FALLBACK,
);

/** Called by useTaxonomyV2 whenever the archetype list (re)loads. */
export function setArchetypeMeta(list?: ArchetypeMetaInput[] | null): void {
  if (!Array.isArray(list) || list.length === 0) {
    byID = FALLBACK;
    buildReverse(
      Object.entries(FALLBACK).map(([id, m]) => ({
        id,
        legacy_type: m.legacyType,
        context_type: m.contextType,
        entity: m.entity,
      })),
      FALLBACK,
    );
    return;
  }

  const next: Record<string, ArchetypeMeta> = { ...FALLBACK };
  for (const entry of list) {
    if (!entry || !entry.id) continue;
    const fallback = FALLBACK[entry.id];
    next[entry.id] = {
      legacyType: entry.legacy_type || fallback?.legacyType || "",
      contextType: entry.context_type || fallback?.contextType || "",
      entity: (entry.entity as ArchetypeMeta["entity"]) || fallback?.entity || "",
    };
  }
  byID = next;
  buildReverse(list, next);
}

/** Metadata for an archetype ID. Unknown IDs return an empty record. */
export function archetypeMeta(id?: string | null): ArchetypeMeta {
  if (!id) return { legacyType: "", contextType: "", entity: "" };
  return byID[id] ?? { legacyType: "", contextType: "", entity: "" };
}

/** archetype → nearest v1 business type (backward compat). */
export function archetypeToLegacyType(arch?: string | null): string {
  return archetypeMeta(arch).legacyType;
}

/** v1 business type / context label → canonical archetype. */
export function archetypeForLegacyType(label?: string | null): string {
  if (!label) return "";
  return reverseByContext[label] || reverseByLegacy[label] || "";
}

/** archetype → entity, or null when there is no signal. */
export function entityOfArchetype(arch?: string | null): EntityValue {
  const entity = archetypeMeta(arch).entity;
  return entity === "individual" || entity === "organization" ? entity : null;
}

/** True for archetypes whose sites belong to one individual. */
export function isIndividualArchetype(arch?: string | null): boolean {
  return archetypeMeta(arch).entity === "individual";
}

/**
 * Default archetype when only an entity is known (pre-classification fallback).
 * This is a wizard policy, not archetype metadata, so a new archetype never
 * changes it.
 */
export function fallbackArchetypeForEntity(entity: EntityValue): string {
  return entity === "individual" ? "portfolio_individual" : "booking_service";
}

/** Default v1 type matching fallbackArchetypeForEntity. */
export function fallbackTypeForEntity(entity: EntityValue): string {
  return entity === "individual" ? "Portofolio" : "Layanan & Reservasi";
}
