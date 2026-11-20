// Semua varian section stats: komponen + metadata dropdown dalam satu tempat.
//
// MENAMBAH VARIAN: buat file komponennya, lalu tambah satu blok di bawah.
// Tidak perlu mengedit index.tsx, variant-registry.ts, atau templates/types.ts.
// (Backend: tambahkan nama varian ke pool mood di variantpools/sections.go.)
//
// Format entri sengaja ketat (kunci di indentasi 2 spasi, komponen di-import
// lewat `import("./...")` atau import default) karena
// scripts/check-variant-parity.mjs membacanya sebagai teks.

import type { VariantDef } from "../variant-meta";
import type { StatsVariantProps } from "./index";
import StatsCounterRow from "./counter-row";
import StatsCardGrid from "./card-grid";
import StatsMinimalSplit from "./minimal-split";
import StatsBigNumberSpotlight from "./big-number-spotlight";

export const STATS_VARIANTS = {
  "counter-row": {
    component: StatsCounterRow,
    labelKey: "variantStatsCounterRow",          label: "Baris Metrik",         descriptionKey: "variantStatsCounterRowDesc",          description: "Baris metrik horizontal dengan pembatas rapi dan angka besar.",
  },
  "card-grid": {
    component: StatsCardGrid,
    labelKey: "variantStatsCardGrid",            label: "Grid Kartu",           descriptionKey: "variantStatsCardGridDesc",            description: "Kartu statistik melayang dengan ikon dan efek glow aksen.",
  },
  "minimal-split": {
    component: StatsMinimalSplit,
    labelKey: "variantStatsMinimalSplit",        label: "Split Minimalis",      descriptionKey: "variantStatsMinimalSplitDesc",        description: "Judul narasi di sisi kiri, matriks 2x2 angka di sisi kanan.",
  },
  "big-number-spotlight": {
    component: StatsBigNumberSpotlight,
    labelKey: "variantStatsBigNumberSpotlight",  label: "Sorotan Angka Besar",  descriptionKey: "variantStatsBigNumberSpotlightDesc",  description: "Satu metrik utama berukuran raksasa dengan sorotan aksen dan sub-metrik pendukung.",
  },
} satisfies Record<string, VariantDef<StatsVariantProps>>;

export type StatsVariant = keyof typeof STATS_VARIANTS;
