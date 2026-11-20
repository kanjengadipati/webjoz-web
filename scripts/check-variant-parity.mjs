// Paritas varian section: variant-registry.ts (web) <-> pool mood di API.
//
// Sumber API: components/sections/variant-pools.snapshot.json, hasil
//   go test ./internal/variantpools -run TestSectionVariantsSnapshot -update-variant-snapshot
// (file testdata/section_variants.json di repo API; salin ke path di atas).
//
// Aturan:
//  1. Varian yang ada di pool API tapi tidak ada di registry web = ERROR (server bisa
//     memilih varian yang tidak bisa dirender/dipilih di editor).
//  2. Varian di registry web yang tidak ada di pool API manapun = ERROR kecuali
//     terdaftar di MANUAL_ONLY (sengaja hanya untuk pilihan manual di editor).
// Hero dicek terpisah oleh check-hero-catalog.mjs.
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const registry = read("components/sections/variant-registry.ts");
const pools = JSON.parse(read("components/sections/variant-pools.snapshot.json"));

/** section -> varian yang sengaja tidak ada di pool server (hanya pilihan manual). */
const MANUAL_ONLY = {
  // Tersedia di editor dan dikenal prompt AI, tapi tidak ada di pool mood server.
  catalog: ["compact", "cards"],
  menu: ["compact"],
};

/** Nama section di pool API -> nama key di SECTION_VARIANT_OPTIONS. */
const REGISTRY_KEY = { blog_index: "blog" };

// Baca SECTION_VARIANT_OPTIONS: blok "  <section>: [" ... "  ]," berisi baris { value: "..." }.
const web = {};
let current = null;
for (const line of registry.split("\n")) {
  const open = line.match(/^ {2}([A-Za-z_]+): \[/);
  if (open) { current = open[1]; web[current] = []; continue; }
  if (/^ {2}\],?\s*$/.test(line)) { current = null; continue; }
  const v = current && line.match(/^\s*\{\s*value:\s*"([^"]+)"/);
  if (v) web[current].push(v[1]);
}

const errors = [];
if (Object.keys(web).length < 5) errors.push("variant-registry.ts: format berubah? hanya " + Object.keys(web).length + " section terbaca");

for (const [section, apiVariants] of Object.entries(pools)) {
  const webVariants = web[REGISTRY_KEY[section] ?? section];
  if (!webVariants) { errors.push(`${section}: ada di pool API tapi tidak ada di SECTION_VARIANT_OPTIONS`); continue; }
  const webSet = new Set(webVariants);
  const apiSet = new Set(apiVariants);
  for (const v of apiVariants)
    if (!webSet.has(v)) errors.push(`${section}: "${v}" ada di pool API tapi tidak di variant-registry.ts`);
  const manual = new Set(MANUAL_ONLY[section] ?? []);
  for (const v of webVariants)
    if (!apiSet.has(v) && !manual.has(v))
      errors.push(`${section}: "${v}" ada di registry web tapi tidak di pool mood API mana pun (tambahkan ke pool atau ke MANUAL_ONLY)`);
  for (const v of manual)
    if (apiSet.has(v)) errors.push(`${section}: "${v}" ada di MANUAL_ONLY tapi sudah ada di pool API — hapus dari MANUAL_ONLY`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`variant parity OK (${Object.keys(pools).length} section)`);