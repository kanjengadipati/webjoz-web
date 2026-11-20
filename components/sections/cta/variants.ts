// Semua varian section cta: komponen + metadata dropdown dalam satu tempat.
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
import type { CtaVariantProps } from "./index";

export const CTA_VARIANTS = {
  banner: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantCtaBanner",          label: "Banner",               descriptionKey: "variantCtaBannerDesc",          description: "Strip warna penuh lebar, teks + tombol.",
  },
  card: {
    component: dynamic(() => import("./card")),
    labelKey: "variantCtaCard",            label: "Kartu",                descriptionKey: "variantCtaCardDesc",            description: "Kotak terpusat dengan shadow dan border.",
  },
  centered: {
    component: dynamic(() => import("./centered")),
    labelKey: "variantCtaCentered",        label: "Tengah",               descriptionKey: "variantCtaCenteredDesc",        description: "Teks dan tombol rata tengah tanpa background.",
  },
  "split-image": {
    component: dynamic(() => import("./split-image")),
    labelKey: "variantCtaSplitImage",      label: "Split + Gambar",       descriptionKey: "variantCtaSplitImageDesc",      description: "Teks di kiri, gambar di kanan (membutuhkan image_url).",
  },
  "inline-lead-form": {
    component: dynamic(() => import("./inline-lead-form")),
    labelKey: "variantCtaInlineLeadForm",  label: "Form Inquiry Inline",  descriptionKey: "variantCtaInlineLeadFormDesc",  description: "Teks di kiri, form nama/email/telepon di kanan untuk tangkap lead.",
  },
} satisfies Record<string, VariantDef<CtaVariantProps>>;

export type CtaVariant = keyof typeof CTA_VARIANTS;
