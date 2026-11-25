// Semua varian section faq: komponen + metadata dropdown dalam satu tempat.
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

export const FAQ_VARIANTS = {
  accordion: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantFaqAccordion",         label: "Akordion",           descriptionKey: "variantFaqAccordionDesc",         description: "Expand/collapse per item, hemat ruang.",
  },
  simple: {
    component: dynamic(() => import("./simple")),
    labelKey: "variantFaqSimple",            label: "Sederhana",          descriptionKey: "variantFaqSimpleDesc",            description: "Semua Q&A tampil terbuka tanpa interaksi.",
  },
  columns: {
    component: dynamic(() => import("./columns")),
    labelKey: "variantFaqColumns",           label: "Kolom",              descriptionKey: "variantFaqColumnsDesc",           description: "2 kolom Q&A berdampingan.",
  },
  "sidebar-category": {
    component: dynamic(() => import("./sidebar-category")),
    labelKey: "variantFaqSidebarCategory",   label: "Kategori Sidebar",   descriptionKey: "variantFaqSidebarCategoryDesc",   description: "Filter Q&A per kategori (membutuhkan category).",
  },
  "two-column-grid": {
    component: dynamic(() => import("./two-column-grid")),
    labelKey: "variantFaqTwoColumnGrid",     label: "Grid 2 Kolom",       descriptionKey: "variantFaqTwoColumnGridDesc",     description: "Q&A dalam kartu grid 2 kolom, semua terbuka.",
  },
  "chat-bubble-style": {
    component: dynamic(() => import("./chat-bubble-style")),
    labelKey: "variantFaqChatBubble",        label: "Gaya Chat",          descriptionKey: "variantFaqChatBubbleDesc",        description: "Q&A seperti percakapan chat — pertanyaan di kanan, jawaban di kiri.",
  },
  searchable: {
    component: dynamic(() => import("./searchable")),
    labelKey: "variantFaqSearchable",        label: "Searchable FAQ",     descriptionKey: "variantFaqSearchableDesc",        description: "Pencarian real-time dengan akordion responsif.",
  },
} satisfies Record<string, VariantDef>;

export type FaqVariant = keyof typeof FAQ_VARIANTS;
