// Semua varian section pricing: komponen + metadata dropdown dalam satu tempat.
//
// MENAMBAH VARIAN: buat file komponennya, lalu tambah satu blok di bawah.
// Tidak perlu mengedit index.tsx, variant-registry.ts, atau templates/types.ts.
// (Backend: tambahkan nama varian ke pool mood di variantpools/sections.go.)
//
// Format entri sengaja ketat (kunci di indentasi 2 spasi, komponen di-import
// lewat `import("./...")` atau import default) karena
// scripts/check-variant-parity.mjs membacanya sebagai teks.

import type { VariantDef } from "../variant-meta";
import type { PricingVariantProps } from "./index";
import PricingCards from "./cards";
import PricingHorizontalRows from "./horizontal-rows";
import PricingComparisonTable from "./comparison-table";
import PricingSingleTierHighlight from "./single-tier-highlight";

export const PRICING_VARIANTS = {
  cards: {
    component: PricingCards,
    labelKey: "variantPricingCards",               label: "Kartu Paket",            descriptionKey: "variantPricingCardsDesc",               description: "Kartu 3 tier klasik dengan penanda paket terpopuler dan tombol aksi.",
  },
  "horizontal-rows": {
    component: PricingHorizontalRows,
    labelKey: "variantPricingHorizontalRows",      label: "Baris Horizontal",       descriptionKey: "variantPricingHorizontalRowsDesc",      description: "Daftar paket horizontal dengan fitur di kiri dan harga/tombol di kanan.",
  },
  "comparison-table": {
    component: PricingComparisonTable,
    labelKey: "variantPricingComparisonTable",     label: "Tabel Perbandingan",     descriptionKey: "variantPricingComparisonTableDesc",     description: "Tabel perbandingan fitur lengkap antar paket layanan.",
  },
  "single-tier-highlight": {
    component: PricingSingleTierHighlight,
    labelKey: "variantPricingSingleTierHighlight", label: "Satu Paket Sorotan",     descriptionKey: "variantPricingSingleTierHighlightDesc", description: "Satu kartu besar menonjol — cocok bisnis dengan satu penawaran utama/membership.",
  },
} satisfies Record<string, VariantDef<PricingVariantProps>>;

export type PricingVariant = keyof typeof PRICING_VARIANTS;
