// Tipe dan helper bersama untuk `variants.ts` per section.
//
// Satu `variants.ts` per section menyatukan komponen + metadata dropdown.
// Menambah varian = 1 blok di file itu (+ file komponennya). Daftar opsi di
// variant-registry.ts dan union type di templates/types.ts diturunkan darinya.

import type { ComponentType } from "react";

export interface VariantOption {
  value: string;
  label: string;
  labelKey?: string;
  description?: string;
  descriptionKey?: string;
  group?: string; // optional grouping label for dropdown submenu (e.g. "Dasar", "Visual Foto")
  wireframeLayout?: string; // archetype wireframe identifier for automated previews
}

/** Satu varian: komponen + metadata. `label` boleh dikosongkan saat prototipe. */
export interface VariantDef<P = any> {
  component: ComponentType<P>;
  label?: string;
  labelKey?: string;
  description?: string;
  descriptionKey?: string;
  group?: string;
  wireframeLayout?: string;
}

/** "bento-accent" -> "Bento Accent". Fallback label untuk prototipe. */
export function titleFromVariantName(name: string): string {
  return name
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Ubah peta varian menjadi opsi dropdown (urutan kunci = urutan dropdown). */
export function variantOptions(defs: Record<string, VariantDef>): VariantOption[] {
  return Object.entries(defs).map(([value, d]) => ({
    value,
    label: d.label ?? titleFromVariantName(value),
    labelKey: d.labelKey,
    description: d.description,
    descriptionKey: d.descriptionKey,
    group: d.group,
    wireframeLayout: d.wireframeLayout,
  }));
}
