// Semua varian section menu: komponen + metadata dropdown dalam satu tempat.
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
import type { MenuVariantProps } from "./index";

export const MENU_VARIANTS = {
  grid: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantMenuGrid",                    label: "Grid",                group: "Dasar",       descriptionKey: "variantMenuGridDesc",                    description: "Kartu produk dalam grid dengan foto.",
  },
  compact: {
    component: dynamic(() => import("./compact")),
    labelKey: "variantMenuCompact",                 label: "Ringkas",             group: "Dasar",       descriptionKey: "variantMenuCompactDesc",                 description: "List kompak nama + harga tanpa foto besar.",
  },
  cards: {
    component: dynamic(() => import("./cards")),
    labelKey: "variantMenuCards",                   label: "Kartu",               group: "Dasar",       descriptionKey: "variantMenuCardsDesc",                   description: "Kartu besar dengan foto dan deskripsi.",
  },
  "text-list": {
    component: dynamic(() => import("./text-list")),
    labelKey: "variantMenuTextList",                label: "Teks List",           group: "List",        descriptionKey: "variantMenuTextListDesc",                description: "Daftar teks minimalis, tanpa gambar.",
  },
  "compact-list": {
    component: dynamic(() => import("./compact-list")),
    labelKey: "variantMenuCompactList",             label: "List Ringkas",        group: "List",        descriptionKey: "variantMenuCompactListDesc",             description: "Baris kompak dengan thumbnail kecil.",
  },
  "tabs-by-category": {
    component: dynamic(() => import("./tabs-by-category")),
    labelKey: "variantMenuTabsByCategory",          label: "Tab Kategori",        group: "Kategori",    descriptionKey: "variantMenuTabsByCategoryDesc",          description: "Tab per kategori menu di atas.",
  },
  "accordion-by-category": {
    component: dynamic(() => import("./accordion-by-category")),
    labelKey: "variantMenuAccordionByCategory",     label: "Akordion Kategori",   group: "Kategori",    descriptionKey: "variantMenuAccordionByCategoryDesc",     description: "Tiap kategori bisa di-expand.",
  },
  "bento-photo-grid": {
    component: dynamic(() => import("./bento-photo-grid")),
    labelKey: "variantMenuBentoPhotoGrid",          label: "Bento Foto Grid",     group: "Visual Foto", descriptionKey: "variantMenuBentoPhotoGridDesc",          description: "Grid bento gaya foto besar, kaya visual.",
  },
  "visual-showcase-hero": {
    component: dynamic(() => import("./visual-showcase-hero")),
    labelKey: "variantMenuVisualShowcaseHero",      label: "Hero Visual",         group: "Visual Foto", descriptionKey: "variantMenuVisualShowcaseHeroDesc",      description: "Hero besar dengan katalog visual di bawahnya.",
  },
  "sidebar-scrollspy-photo": {
    component: dynamic(() => import("./sidebar-scrollspy-photo")),
    labelKey: "variantMenuSidebarScrollspyPhoto",   label: "Sidebar Scrollspy",   group: "Visual Foto", descriptionKey: "variantMenuSidebarScrollspyPhotoDesc",   description: "Navigasi kategori sticky + konten foto di sisi kanan.",
  },
  "horizontal-swipe-carousel": {
    component: dynamic(() => import("./horizontal-swipe-carousel")),
    labelKey: "variantMenuCarousel",                label: "Carousel Horizontal", group: "Visual Foto", descriptionKey: "variantMenuCarouselDesc",                description: "Kartu menu besar yang bisa di-swipe horizontal per kategori.",
  },
  "masonry-flow": {
    component: dynamic(() => import("./masonry-flow")),
    labelKey: "variantMenuMasonry",                 label: "Aliran Masonry",      group: "Visual Foto", descriptionKey: "variantMenuMasonryDesc",                 description: "Layout Pinterest dengan tinggi kartu menu bervariasi.",
  },
} satisfies Record<string, VariantDef<MenuVariantProps>>;

export type MenuVariant = keyof typeof MENU_VARIANTS;
