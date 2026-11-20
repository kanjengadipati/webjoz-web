// Semua varian section contact: komponen + metadata dropdown dalam satu tempat.
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
import type { ContactVariantProps } from "./types";

export const CONTACT_VARIANTS = {
  "classic-split": {
    component: dynamic(() => import("./classic-split")),
    labelKey: "variantContactClassicSplit",     label: "Klasik Split",        descriptionKey: "variantContactClassicSplitDesc",     description: "Form pesan di kiri, info kontak & peta di kanan.",
  },
  "whatsapp-direct": {
    component: dynamic(() => import("./whatsapp-direct")),
    labelKey: "variantContactWhatsAppDirect",   label: "WhatsApp Instan",     descriptionKey: "variantContactWhatsAppDirectDesc",   description: "Fokus tombol aksi WhatsApp cepat + preview pesan & badge online.",
  },
  "bento-grid": {
    component: dynamic(() => import("./bento-grid")),
    labelKey: "variantContactBentoGrid",        label: "Bento Grid",          descriptionKey: "variantContactBentoGridDesc",        description: "Kartu modular tersusun rapi gaya bento box modern.",
  },
  "overlay-map": {
    component: dynamic(() => import("./overlay-map")),
    labelKey: "variantContactOverlayMap",       label: "Overlay Peta",        descriptionKey: "variantContactOverlayMapDesc",       description: "Peta interaktif penuh dengan kartu kontak melayang.",
  },
  "dark-split": {
    component: dynamic(() => import("./dark-split")),
    labelKey: "variantContactDarkSplit",        label: "Dark Split",          descriptionKey: "variantContactDarkSplitDesc",        description: "Tema gelap premium kontras tinggi dengan aksen bercahaya.",
  },
  "minimal-centered": {
    component: dynamic(() => import("./minimal-centered")),
    labelKey: "variantContactMinimalCentered",  label: "Minimal Tengah",      descriptionKey: "variantContactMinimalCenteredDesc",  description: "Kartu kontak ringkas terpusat tanpa peta.",
  },
} satisfies Record<string, VariantDef<ContactVariantProps>>;

export type ContactVariant = keyof typeof CONTACT_VARIANTS;
