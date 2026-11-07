export type Entity = "individual" | "organization" | null;
export type EntitySource = "user" | "inferred" | null;

export interface EntityState {
  value: Entity;
  source: EntitySource;
}

export interface IndustryLite {
  id: string;
  archetype?: string;
  rank?: number;
}

export interface GroupLite<I extends IndustryLite = IndustryLite> {
  id: string;
  industries: I[];
}

const ORG_ARCHETYPES = new Set(["professional_firm", "corporate_org", "institution_org"]);

export function entityFromArchetype(archetype?: string | null): Entity {
  if (archetype === "portfolio_individual") return "individual";
  if (archetype && ORG_ARCHETYPES.has(archetype)) return "organization";
  return null;
}

/**
 * Entitas hasil klasifikasi/pilihan industri hanya menimpa nilai yang
 * diturunkan otomatis. Pilihan eksplisit pengguna (source "user") tidak
 * pernah ditimpa. Archetype tak dikenal tidak mengubah apa pun.
 */
export function nextEntityFromArchetype(state: EntityState, archetype?: string | null): EntityState {
  if (state.source === "user") return state;
  const inferred = entityFromArchetype(archetype);
  if (!inferred) return state;
  return { value: inferred, source: "inferred" };
}

/** Pilihan eksplisit pengguna; mengetuk nilai yang sama lagi = batal (null). */
export function toggleUserEntity(state: EntityState, picked: "individual" | "organization"): EntityState {
  if (state.source === "user" && state.value === picked) return { value: null, source: null };
  return { value: picked, source: "user" };
}

const isIndividual = (i: IndustryLite) => i.archetype === "portfolio_individual";

/** Bidang yang punya setidaknya satu industri untuk entitas itu (diturunkan dari katalog, bukan daftar manual). */
export function groupsForEntity<G extends GroupLite>(groups: G[], entity: Entity): G[] {
  if (!entity) return groups;
  return groups.filter((g) =>
    g.industries.some((i) => (entity === "individual" ? isIndividual(i) : !isIndividual(i))),
  );
}

export interface IndustryChoice<I extends IndustryLite> {
  items: I[];
  /** true bila tidak ada industri untuk entitas itu dan daftar penuh dikembalikan. */
  fallback: boolean;
}

export function industriesForEntity<I extends IndustryLite>(group: GroupLite<I>, entity: Entity): IndustryChoice<I> {
  const sortRank = (a: I, b: I) => (a.rank ?? 99) - (b.rank ?? 99);
  if (!entity) return { items: [...group.industries].sort(sortRank), fallback: false };
  const matched = group.industries.filter((i) => (entity === "individual" ? isIndividual(i) : !isIndividual(i)));
  if (matched.length === 0) return { items: [...group.industries].sort(sortRank), fallback: true };
  return { items: matched.sort(sortRank), fallback: false };
}

export interface SubTypeChipItem {
  value: string;
  label: string;
  emoji?: string;
  kind?: "v1" | "v2";
  archetype?: string;
}

export function buildSubTypeChips(args: {
  groups?: GroupLite[] | null;
  bidangId: string | null;
  entity: Entity;
  archetypeIndustries?: IndustryLite[];
  hintId?: string;
  lang: "id" | "en";
}): { items: SubTypeChipItem[]; fallback: boolean } {
  const { groups, bidangId, entity, archetypeIndustries, hintId, lang } = args;

  const toChip = (i: IndustryLite): SubTypeChipItem => {
    const anyI = i as any;
    const label = (lang === "en" ? (anyI.label_en || anyI.label) : (anyI.label_id || anyI.label)) || i.id;
    return {
      value: i.id,
      label,
      emoji: anyI.emoji ?? "🏷️",
      kind: "v2",
      archetype: i.archetype,
    };
  };

  const prioritizeHint = (list: SubTypeChipItem[]): SubTypeChipItem[] => {
    if (!hintId) return list;
    return [
      ...list.filter((s) => s.value === hintId),
      ...list.filter((s) => s.value !== hintId),
    ];
  };

  if (bidangId && groups) {
    const grp = groups.find((g) => g.id === bidangId);
    if (grp) {
      const choice = industriesForEntity(grp, entity);
      const items = prioritizeHint(choice.items.map(toChip));
      return { items, fallback: choice.fallback };
    }
  }

  if (archetypeIndustries && archetypeIndustries.length > 0) {
    const sortRank = (a: IndustryLite, b: IndustryLite) => (a.rank ?? 99) - (b.rank ?? 99);
    if (!entity) {
      const sorted = [...archetypeIndustries].sort(sortRank);
      return { items: prioritizeHint(sorted.map(toChip)), fallback: false };
    }
    const matched = archetypeIndustries.filter((i) => (entity === "individual" ? isIndividual(i) : !isIndividual(i)));
    if (matched.length === 0) {
      const sorted = [...archetypeIndustries].sort(sortRank);
      return { items: prioritizeHint(sorted.map(toChip)), fallback: true };
    }
    const sorted = [...matched].sort(sortRank);
    return { items: prioritizeHint(sorted.map(toChip)), fallback: false };
  }

  return { items: [], fallback: false };
}


