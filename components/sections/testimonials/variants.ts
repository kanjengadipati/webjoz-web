// Semua varian section testimonials: komponen + metadata dropdown dalam satu tempat.
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
import type { TestimonialVariantProps } from "./index";

export const TESTIMONIALS_VARIANTS = {
  carousel: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantTestimonialsCarousel",          label: "Carousel",           descriptionKey: "variantTestimonialsCarouselDesc",          description: "Slide otomatis, satu testimoni per tampilan.",
  },
  compact: {
    component: dynamic(() => import("./compact")),
    labelKey: "variantTestimonialsCompact",           label: "Ringkas",            descriptionKey: "variantTestimonialsCompactDesc",           description: "Avatar kecil + kutipan singkat dalam satu baris.",
  },
  grid: {
    component: dynamic(() => import("./grid")),
    labelKey: "variantTestimonialsGrid",              label: "Grid",               descriptionKey: "variantTestimonialsGridDesc",              description: "Semua testimoni tampil sekaligus dalam grid.",
  },
  "logo-wall": {
    component: dynamic(() => import("./logo-wall")),
    labelKey: "variantTestimonialsLogoWall",          label: "Logo Klien",         descriptionKey: "variantTestimonialsLogoWallDesc",          description: "Logo perusahaan klien (membutuhkan logo_url).",
  },
  "featured-spotlight": {
    component: dynamic(() => import("./featured-spotlight")),
    labelKey: "variantTestimonialsFeaturedSpotlight", label: "Sorotan",            descriptionKey: "variantTestimonialsFeaturedSpotlightDesc", description: "Satu testimoni utama ditonjolkan.",
  },
  "google-reviews": {
    component: dynamic(() => import("./google-reviews")),
    labelKey: "variantTestimonialsGoogleReviews",     label: "Google Reviews",     descriptionKey: "variantTestimonialsGoogleReviewsDesc",     description: "Kartu gaya Google: foto profil, bintang, badge Google.",
  },
  "video-wall": {
    component: dynamic(() => import("./video-wall")),
    labelKey: "variantVideoWall",                     label: "Dinding Video / UGC",descriptionKey: "variantTestimonialsVideoWallDesc",          description: "Grid testimoni bergaya UGC dengan thumbnail video dan pemutar ringan.",
  },
} satisfies Record<string, VariantDef<TestimonialVariantProps>>;

export type TestimonialsVariant = keyof typeof TESTIMONIALS_VARIANTS;
