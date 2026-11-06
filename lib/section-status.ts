// Status section untuk editor — logika murni (tanpa React) agar bisa dites dengan `node --test`.
// Status DITURUNKAN dari design_token + content, tidak disimpan, jadi benar juga untuk data lama.

export type SectionStatus = "visible" | "hidden-user" | "hidden-empty" | "not-in-plan";

/** Section opsional yang disembunyikan otomatis saat kosong (sama dengan getAutoHiddenSections). */
export const AUTO_HIDEABLE_SECTIONS = ["faq", "testimonials", "gallery", "works", "menu", "catalog", "blog", "skills"] as const;

/** Section yang disisipkan template walau tidak ada di section_order, selama punya konten. */
const INJECTED_WHEN_FILLED = ["menu", "catalog", "gallery", "works", "testimonials", "blog", "skills"];

export function isSectionEmpty(content: any, key: string): boolean {
  if (key === "menu" || key === "catalog") return !(content?.[key]?.categories?.length);
  if (key === "blog") return !(content?.[key]?.posts?.length);
  if (key === "pricing") return !(content?.[key]?.plans?.length);
  if (key === "skills") return !(content?.[key]?.groups?.length);
  return !(content?.[key]?.items?.length);
}

type DT = { layout?: { section_order?: string[]; hidden_sections?: string[] } } | null | undefined;

export function getSectionStatus(key: string, dt: DT, content: any): SectionStatus {
  const hidden = dt?.layout?.hidden_sections ?? [];
  if (hidden.includes(key)) {
    return (AUTO_HIDEABLE_SECTIONS as readonly string[]).includes(key) && isSectionEmpty(content, key)
      ? "hidden-empty"
      : "hidden-user";
  }
  const order = dt?.layout?.section_order;
  // Tanpa section_order, tiap template memakai urutan bawaannya: tidak bisa dipastikan, anggap dipakai.
  if (!Array.isArray(order)) return "visible";
  if (order.includes(key)) return "visible";
  if (INJECTED_WHEN_FILLED.includes(key) && !isSectionEmpty(content, key)) return "visible";
  return "not-in-plan";
}

/** Sisipkan `key` ke urutan: sebelum "cta" bila ada, kalau tidak sebelum "contact", kalau tidak di akhir. */
export function addToPlan(order: string[], key: string): string[] {
  if (order.includes(key)) return order.slice();
  const next = order.slice();
  const at = next.includes("cta") ? next.indexOf("cta") : next.includes("contact") ? next.indexOf("contact") : next.length;
  next.splice(at, 0, key);
  return next;
}
