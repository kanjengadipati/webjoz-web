// Semua varian section catalog: komponen + metadata dropdown dalam satu tempat.
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
import type { CatalogVariantProps } from "./index";

export const CATALOG_VARIANTS = {
  grid: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantCatalogGrid",                    label: "Grid",                 group: "Dasar",       descriptionKey: "variantCatalogGridDesc",                    description: "Kartu produk standar dalam grid.",
  },
  compact: {
    component: dynamic(() => import("./compact")),
    labelKey: "variantCatalogCompact",                 label: "Ringkas",              group: "Dasar",       descriptionKey: "variantCatalogCompactDesc",                 description: "List kompak nama + harga.",
  },
  cards: {
    component: dynamic(() => import("./cards")),
    labelKey: "variantCatalogCards",                   label: "Kartu",                group: "Dasar",       descriptionKey: "variantCatalogCardsDesc",                   description: "Kartu besar dengan foto dan badge.",
  },
  "grid-dense": {
    component: dynamic(() => import("./grid-dense")),
    labelKey: "variantCatalogGridDense",               label: "Grid Padat",           group: "Padat",       descriptionKey: "variantCatalogGridDenseDesc",               description: "Grid lebih rapat, lebih banyak produk per baris.",
  },
  "showcase-featured": {
    component: dynamic(() => import("./showcase-featured")),
    labelKey: "variantCatalogShowcaseFeatured",        label: "Showcase Unggulan",    group: "Padat",       descriptionKey: "variantCatalogShowcaseFeaturedDesc",        description: "Produk berbadge ditampilkan lebih besar.",
  },
  "tabs-by-category": {
    component: dynamic(() => import("./tabs-by-category")),
    labelKey: "variantCatalogTabsByCategory",          label: "Tab Kategori",         group: "Kategori",    descriptionKey: "variantCatalogTabsByCategoryDesc",          description: "Tab per kategori produk.",
  },
  "editorial-grid": {
    component: dynamic(() => import("./editorial-grid")),
    labelKey: "variantCatalogEditorialGrid",           label: "Grid Editorial",       group: "Visual Foto", descriptionKey: "variantCatalogEditorialGridDesc",           description: "Grid asimetris gaya majalah, ukuran kartu bervariasi.",
  },
  "masonry-flow": {
    component: dynamic(() => import("./masonry-flow")),
    labelKey: "variantCatalogMasonryFlow",             label: "Aliran Masonry",       group: "Visual Foto", descriptionKey: "variantCatalogMasonryFlowDesc",             description: "Layout Pinterest dengan tinggi kartu bervariasi.",
  },
  "instagram-square-grid": {
    component: dynamic(() => import("./instagram-square-grid")),
    labelKey: "variantCatalogInstagramGrid",           label: "Grid Instagram",       group: "Visual Foto", descriptionKey: "variantCatalogInstagramGridDesc",           description: "Kotak seragam seperti galeri Instagram.",
  },
  "split-hero-catalog": {
    component: dynamic(() => import("./split-hero-catalog")),
    labelKey: "variantCatalogSplitHero",               label: "Split Hero",           group: "Visual Foto", descriptionKey: "variantCatalogSplitHeroDesc",               description: "Split screen: hero besar kiri, list scroll kanan.",
  },
  "neo-brutalist-matrix": {
    component: dynamic(() => import("./neo-brutalist-matrix")),
    labelKey: "variantCatalogNeoBrutalist",            label: "Matrix Brutalis",      group: "Visual Foto", descriptionKey: "variantCatalogNeoBrutalistDesc",            description: "Grid brutal dengan border tebal dan posisi miring.",
  },
  "horizontal-swipe-carousel": {
    component: dynamic(() => import("./horizontal-swipe-carousel")),
    labelKey: "variantCatalogHorizontalCarousel",      label: "Carousel Horizontal",  group: "Visual Foto", descriptionKey: "variantCatalogHorizontalCarouselDesc",      description: "Card besar yang bisa di-swipe horizontal.",
  },
  "product-table": {
    component: dynamic(() => import("./product-table")),
    labelKey: "variantProductTable",                   label: "Tabel Spesifikasi",    group: "Tabel",       descriptionKey: "variantCatalogProductTableDesc",            description: "Tabel produk/spec-sheet dengan kolom harga, stok, dan aksi.",
  },
  spotlight: {
    component: dynamic(() => import("./spotlight")),
    labelKey: "variantSpotlight",                      label: "Sorotan Produk",       group: "Visual Foto", descriptionKey: "variantCatalogSpotlightDesc",               description: "Satu produk utama full-bleed dengan produk lain dalam grid.",
  },
} satisfies Record<string, VariantDef<CatalogVariantProps>>;

export type CatalogVariant = keyof typeof CATALOG_VARIANTS;
