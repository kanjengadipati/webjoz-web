// Semua varian section header: komponen + metadata dropdown dalam satu tempat.
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
import type { HeaderVariantProps } from "./types";

export const HEADER_VARIANTS = {
  "left-logo-inline-nav": {
    component: dynamic(() => import("./left-logo-inline-nav")),
    labelKey: "variantHeaderLeftLogoInlineNav",  label: "Logo Kiri + Nav Inline",          descriptionKey: "variantHeaderLeftLogoInlineNavDesc",  description: "Logo di kiri, navigasi sejajar di kanan, CTA tombol.",
  },
  "centered-logo": {
    component: dynamic(() => import("./centered-logo")),
    labelKey: "variantHeaderCenteredLogo",       label: "Logo Tengah",                     descriptionKey: "variantHeaderCenteredLogoDesc",       description: "Logo di tengah, navigasi di bawahnya, CTA tombol.",
  },
  "transparent-overlay": {
    component: dynamic(() => import("./transparent-overlay")),
    labelKey: "variantHeaderTransparentOverlay", label: "Transparan (Hero Overlay)",        descriptionKey: "variantHeaderTransparentOverlayDesc", description: "Menimpa hero (teks putih), mengecil dan menjadi kaca buram setelah scroll.",
  },
  "logo-with-cta-button": {
    component: dynamic(() => import("./logo-with-cta-button")),
    labelKey: "variantHeaderLogoWithCtaButton", label: "Logo + CTA Tombol",               descriptionKey: "variantHeaderLogoWithCtaButtonDesc",  description: "Logo kiri, nav tengah, tombol CTA warna solid di kanan.",
  },
  "stacked-logo-tagline": {
    component: dynamic(() => import("./stacked-logo-tagline")),
    labelKey: "variantHeaderStackedLogoTagline",label: "Logo + Tagline Tumpuk",            descriptionKey: "variantHeaderStackedLogoTaglineDesc", description: "Logo dan tagline vertikal di tengah, nav tipis di bawah.",
  },
  "floating-capsule": {
    component: dynamic(() => import("./floating-capsule")),
    labelKey: "variantHeaderFloatingCapsule",   label: "Kapsul Melayang",                 wireframeLayout: "navbar-capsule", descriptionKey: "variantHeaderFloatingCapsuleDesc",  description: "Navbar terbungkus dalam kapsul pill melayang dengan bayangan lembut; kesan premium dan modern. Cocok untuk SaaS, agensi, dan startup.", group: "Premium",
  },
  "split-utility": {
    component: dynamic(() => import("./split-utility")),
    labelKey: "variantHeaderSplitUtility",      label: "Split Utilitas (2 Baris)",        wireframeLayout: "navbar-split-utility", descriptionKey: "variantHeaderSplitUtilityDesc",    description: "Top bar tipis berisi info kontak (lokasi, email) di atas nav bar utama yang sticky; terlihat profesional. Cocok untuk bisnis lokal, klinik, dan properti.", group: "Profesional",
  },
  "brand-block-nav": {
    component: dynamic(() => import("./brand-block-nav")),
    labelKey: "variantHeaderBrandBlockNav",     label: "Blok Brand + Rail Navigasi",      wireframeLayout: "navbar-brand-block", descriptionKey: "variantHeaderBrandBlockNavDesc",    description: "Blok warna solid di kiri untuk logo/brand, rail navigasi bersih di kanan; identitas brand sangat kuat. Cocok untuk agensi, firma, dan korporat.", group: "Profesional",
  },
} satisfies Record<string, VariantDef<HeaderVariantProps>>;

export type HeaderVariant = keyof typeof HEADER_VARIANTS;
