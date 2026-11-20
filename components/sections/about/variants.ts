// Semua varian section About: komponen + metadata dropdown dalam satu tempat.
//
// MENAMBAH VARIAN: buat file komponennya, lalu tambah satu blok di bawah.
// Tidak perlu mengedit index.tsx, variant-registry.ts, atau templates/types.ts.
// (Backend: tambahkan nama varian ke pool mood di variantpools/sections.go.)
//
// Format entri sengaja ketat (kunci di indentasi 2 spasi, `import("./...")`
// satu baris) karena scripts/check-variant-parity.mjs membacanya sebagai teks.

import dynamic from "next/dynamic";
import type { VariantDef } from "../variant-meta";
import type { AboutVariantProps } from "./classic";

export const ABOUT_VARIANTS = {
  classic: {
    component: dynamic(() => import("./classic")),
    labelKey: "variantAboutClassic", label: "Klasik",
    descriptionKey: "variantAboutClassicDesc", description: "Teks di kiri, konten bersih tanpa gambar besar.",
  },
  "split-image": {
    component: dynamic(() => import("./split-image")),
    labelKey: "variantAboutSplitImage", label: "Split + Gambar",
    descriptionKey: "variantAboutSplitImageDesc", description: "Teks di kiri, gambar besar di kanan.",
  },
  "stat-heavy": {
    component: dynamic(() => import("./stat-heavy")),
    labelKey: "variantAboutStatHeavy", label: "Statistik",
    descriptionKey: "variantAboutStatHeavyDesc", description: "Tampilkan angka highlight dan statistik bisnis.",
  },
  timeline: {
    component: dynamic(() => import("./timeline")),
    labelKey: "variantAboutTimeline", label: "Timeline",
    descriptionKey: "variantAboutTimelineDesc", description: "Kronologi perjalanan bisnis (membutuhkan milestones).",
  },
  "team-grid": {
    component: dynamic(() => import("./team-grid")),
    labelKey: "variantAboutTeamGrid", label: "Grid Tim",
    descriptionKey: "variantAboutTeamGridDesc", description: "Grid anggota tim (membutuhkan team_members).",
  },
  "bento-grid": {
    component: dynamic(() => import("./bento-grid")),
    labelKey: "variantAboutBentoGrid", label: "Bento Grid",
    descriptionKey: "variantAboutBentoGridDesc", description: "Grid asimetris interaktif memadukan teks, foto, statistik, dan kartu fitur.",
  },
  "founder-spotlight": {
    component: dynamic(() => import("./founder-spotlight")),
    labelKey: "variantAboutFounderSpotlight", label: "Sorotan Founder",
    descriptionKey: "variantAboutFounderSpotlightDesc", description: "Profil personal founder/pemilik dengan kutipan visi, foto potret, dan tanda tangan.",
  },
  "editorial-magazine": {
    component: dynamic(() => import("./editorial-magazine")),
    labelKey: "variantAboutEditorialMagazine", label: "Majalah Editorial",
    descriptionKey: "variantAboutEditorialMagazineDesc", description: "Tata letak narasi elegan dengan watermark angka besar dan potongan foto artistik.",
  },
  "brand-manifesto": {
    component: dynamic(() => import("./brand-manifesto")),
    labelKey: "variantAboutBrandManifesto", label: "Manifesto Brand",
    descriptionKey: "variantAboutBrandManifestoDesc", description: "Fokus tipografi tegas tanpa foto, menonjolkan pesan dan komitmen brand.",
  },
  "milestone-showcase": {
    component: dynamic(() => import("./milestone-showcase")),
    labelKey: "variantAboutMilestoneShowcase", label: "Pencapaian Milestone",
    descriptionKey: "variantAboutMilestoneShowcaseDesc", description: "Garis horizontal pencapaian bisnis berurutan dengan ikon dan tahun.",
  },
} satisfies Record<string, VariantDef<AboutVariantProps>>;

export type AboutVariant = keyof typeof ABOUT_VARIANTS;
