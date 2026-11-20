// Semua varian section footer: komponen + metadata dropdown dalam satu tempat.
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
import type { FooterVariantProps } from "./types";

export const FOOTER_VARIANTS = {
  "minimal-band": {
    component: dynamic(() => import("./minimal-band")),
    labelKey: "variantFooterMinimalBand",        label: "Band Minimal",           descriptionKey: "variantFooterMinimalBandDesc",        description: "Brand + tagline + copyright dalam satu baris gelap bersih.",
  },
  "columns-with-nav": {
    component: dynamic(() => import("./columns-with-nav")),
    labelKey: "variantFooterColumnsWithNav",     label: "Kolom + Navigasi Cepat", descriptionKey: "variantFooterColumnsWithNavDesc",     description: "Multi-kolom dengan tautan navigasi landing page & tombol Kembali ke Atas.",
  },
  "columns-with-social": {
    component: dynamic(() => import("./columns-with-social")),
    labelKey: "variantFooterColumnsWithSocial",  label: "Kolom + Media Sosial",   descriptionKey: "variantFooterColumnsWithSocialDesc",  description: "Multi-kolom dengan tautan akun media sosial bisnis.",
  },
  "dark-contrast-band": {
    component: dynamic(() => import("./dark-contrast-band")),
    labelKey: "variantFooterDarkContrastBand",   label: "Band Gelap Kontras",     descriptionKey: "variantFooterDarkContrastBandDesc",   description: "Footer gelap solid dengan aksen warna primary, kontras kuat.",
  },
  "location-and-hours": {
    component: dynamic(() => import("./location-and-hours")),
    labelKey: "variantFooterLocationAndHours",   label: "Lokasi & Jam",           descriptionKey: "variantFooterLocationAndHoursDesc",   description: "Brand + alamat peta + jam operasional dalam grid bersih.",
  },
  "multi-column-newsletter": {
    component: dynamic(() => import("./multi-column-newsletter")),
    labelKey: "variantFooterMultiColumnNewsletter", label: "Multi-Kolom + Newsletter", wireframeLayout: "footer-columns", descriptionKey: "variantFooterMultiColumnNewsletterDesc", description: "Multi-kolom lengkap dengan form langganan newsletter, tautan navigasi, dan media sosial.", group: "Profesional",
  },
  "brand-gradient-cta": {
    component: dynamic(() => import("./brand-gradient-cta")),
    labelKey: "variantFooterBrandGradientCta",   label: "Banner Gradien (Bold)",  wireframeLayout: "footer-contrast", descriptionKey: "variantFooterBrandGradientCtaDesc",   description: "Footer warna gradien brand dengan slogan inspiratif dan tombol CTA penutup halaman.", group: "Modern",
  },
  "social-pill-cta": {
    component: dynamic(() => import("./social-pill-cta")),
    labelKey: "variantFooterSocialPillCta",      label: "Pill Sosmed + CTA",      wireframeLayout: "footer-social", descriptionKey: "variantFooterSocialPillCtaDesc",      description: "Layout horizontal seimbang dengan brand di kiri, pill media sosial di tengah, dan tombol CTA di kanan.", group: "Modern",
  },
} satisfies Record<string, VariantDef<FooterVariantProps>>;

export type FooterVariant = keyof typeof FOOTER_VARIANTS;
