// Semua varian section benefits: komponen + metadata dropdown dalam satu tempat.
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
import type { BenefitVariantProps } from "./index";

export const BENEFITS_VARIANTS = {
  grid: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantBenefitsGrid",              label: "Grid",                          descriptionKey: "variantBenefitsGridDesc",              description: "Kartu ikon tersusun grid rapi.",
  },
  "featured-grid": {
    component: dynamic(() => import("./featured-grid")),
    labelKey: "variantBenefitsFeaturedGrid",      label: "Grid Highlight",                descriptionKey: "variantBenefitsFeaturedGridDesc",      description: "Kartu pertama berukuran besar sebagai sorotan utama, sisanya dalam grid rapi.",
  },
  "icon-row": {
    component: dynamic(() => import("./icon-row")),
    labelKey: "variantBenefitsIconRow",           label: "Baris Ikon Horizontal",         descriptionKey: "variantBenefitsIconRowDesc",           description: "Ikon lingkaran besar terpusat berjajar horizontal dengan garis pemisah.",
  },
  "stat-grid": {
    component: dynamic(() => import("./stat-grid")),
    labelKey: "variantBenefitsStatGrid",          label: "Grid Statistik",                descriptionKey: "variantBenefitsStatGridDesc",          description: "Grid dengan angka/statistik di tiap item.",
  },
  checklist: {
    component: dynamic(() => import("./checklist")),
    labelKey: "variantBenefitsChecklist",         label: "Checklist",                     descriptionKey: "variantBenefitsChecklistDesc",         description: "List centang vertikal, sederhana dan langsung.",
  },
  "comparison-table": {
    component: dynamic(() => import("./comparison-table")),
    labelKey: "variantBenefitsComparisonTable",   label: "Tabel Perbandingan",             descriptionKey: "variantBenefitsComparisonTableDesc",   description: "Perbandingan A vs B dalam tabel (membutuhkan comparison).",
  },
  "bento-grid": {
    component: dynamic(() => import("./bento-grid")),
    labelKey: "variantBenefitsBentoGrid",         label: "Bento Grid",                    descriptionKey: "variantBenefitsBentoGridDesc",         description: "Grid asimetris ala bento box — kartu berukuran bervariasi, visual dinamis.",
  },
  "trust-bar": {
    component: dynamic(() => import("./trust-bar")),
    labelKey: "variantBenefitsTrustBar",          label: "Trust Bar (Toko Online & Retail)", group: "E-Commerce", descriptionKey: "variantBenefitsTrustBarDesc", description: "Strip horizontal penjamin kepercayaan belanja.",
  },
  "how-it-works": {
    component: dynamic(() => import("./how-it-works")),
    labelKey: "variantBenefitsHowItWorks",        label: "Cara Kerja / How It Works",     descriptionKey: "variantBenefitsHowItWorksDesc",        description: "Langkah proses berurutan dengan angka bertahap.",
  },
} satisfies Record<string, VariantDef<BenefitVariantProps>>;

export type BenefitsVariant = keyof typeof BENEFITS_VARIANTS;
