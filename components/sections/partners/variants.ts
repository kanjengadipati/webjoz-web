// Semua varian section partners: komponen + metadata dropdown dalam satu tempat.
//
// MENAMBAH VARIAN: buat file komponennya, lalu tambah satu blok di bawah.
// Tidak perlu mengedit index.tsx, variant-registry.ts, atau templates/types.ts.
// (Backend: tambahkan nama varian ke pool mood di variantpools/sections.go.)
//
// Format entri sengaja ketat (kunci di indentasi 2 spasi, komponen di-import
// lewat `import("./...")` atau import default) karena
// scripts/check-variant-parity.mjs membacanya sebagai teks.

import type { VariantDef } from "../variant-meta";
import type { PartnersVariantProps } from "./index";
import PartnersLogoWall from "./logo-wall";
import PartnersMarquee from "./marquee";
import PartnersPillGrid from "./pill-grid";
import PartnersFeaturedCollabGrid from "./featured-collab-grid";

export const PARTNERS_VARIANTS = {
  "logo-wall": {
    component: PartnersLogoWall,
    labelKey: "variantPartnersLogoWall",           label: "Grid Logo / Brand",        descriptionKey: "variantPartnersLogoWallDesc",           description: "Grid logo/brand mitra dengan efek grayscale dan hover berwarna.",
  },
  marquee: {
    component: PartnersMarquee,
    labelKey: "variantPartnersMarquee",            label: "Ticker Berjalan",          descriptionKey: "variantPartnersMarqueeDesc",            description: "Banner logo/nama brand berjalan otomatis tanpa henti (infinite loop).",
  },
  "pill-grid": {
    component: PartnersPillGrid,
    labelKey: "variantPartnersPillGrid",           label: "Grid Pill Interaktif",     descriptionKey: "variantPartnersPillGridDesc",           description: "Koleksi badge/pill brand modern dengan inisial dan tag kategori.",
  },
  "featured-collab-grid": {
    component: PartnersFeaturedCollabGrid,
    labelKey: "variantPartnersFeaturedCollabGrid", label: "Kolaborasi Unggulan",       descriptionKey: "variantPartnersFeaturedCollabGridDesc", description: "Grid mitra/klien dengan kartu sorotan kolaborasi utama dan ringkasan peran.",
  },
} satisfies Record<string, VariantDef<PartnersVariantProps>>;

export type PartnersVariant = keyof typeof PARTNERS_VARIANTS;
