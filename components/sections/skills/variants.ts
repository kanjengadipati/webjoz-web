// Semua varian section skills: komponen + metadata dropdown dalam satu tempat.
//
// MENAMBAH VARIAN: buat file komponennya, lalu tambah satu blok di bawah.
// Tidak perlu mengedit index.tsx, variant-registry.ts, atau templates/types.ts.
// (Backend: tambahkan nama varian ke pool mood di variantpools/sections.go.)
//
// Format entri sengaja ketat (kunci di indentasi 2 spasi, komponen di-import
// lewat `import("./...")` atau import default) karena
// scripts/check-variant-parity.mjs membacanya sebagai teks.

import dynamic from "next/dynamic";
import type { VariantDef } from "../variant-meta";
import type { SkillsVariantProps } from "./shared";

export const SKILLS_VARIANTS = {
  chips: {
    component: dynamic(() => import("./chips"), { ssr: true }),
    labelKey: "variantSkillsChips",        label: "Badge Cloud",       descriptionKey: "variantSkillsChipsDesc",        description: "Kumpulan badge keahlian per kategori, ringkas dan padat.",
  },
  "grouped-list": {
    component: dynamic(() => import("./grouped-list"), { ssr: true }),
    labelKey: "variantSkillsGroupedList", label: "List Terkelompok",  descriptionKey: "variantSkillsGroupedListDesc",  description: "Kolom keahlian per grup dengan nama skill dan tingkat kemahiran.",
  },
  meter: {
    component: dynamic(() => import("./meter"), { ssr: true }),
    labelKey: "variantSkillsMeter",        label: "Bar Kemahiran",     descriptionKey: "variantSkillsMeterDesc",        description: "Bar progress per keahlian dengan tingkat beginner/intermediate/expert.",
  },
} satisfies Record<string, VariantDef<SkillsVariantProps>>;

export type SkillsVariant = keyof typeof SKILLS_VARIANTS;
