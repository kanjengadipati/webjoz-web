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

/** Baca `<section>/variants.ts`: kunci varian + pastikan file komponennya ada. */
function readVariantsFile(constName) {
  const imp = registry.match(new RegExp(`import \\{[^}]*\\b${constName}\\b[^}]*\\} from "\\./([^"]+)"`));
  if (!imp) { errors.push(`${constName}: tidak ada import di variant-registry.ts`); return []; }
  const src = read(`components/sections/${imp[1]}.ts`).split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n");
  const dir = imp[1].replace(/\/[^/]+$/, "");
  const keys = [];
  for (const m of src.matchAll(/^ {2}"?([A-Za-z0-9_-]+)"?: \{\s*$/gm)) keys.push(m[1]);
  const targets = [
    ...[...src.matchAll(/import\("\.\/([^"]+)"\)/g)].map((m) => m[1]),
    ...[...src.matchAll(/^import \w+ from "\.\/([^"]+)";/gm)].map((m) => m[1]).filter((t) => t !== "index" && t !== "shared" && t !== "types"),
  ];
  if (keys.length === 0) errors.push(`${imp[1]}.ts: format berubah? tidak ada varian terbaca`);
  if (keys.length !== targets.length)
    errors.push(`${imp[1]}.ts: ${keys.length} varian tapi ${targets.length} import komponen`);
  for (const t of targets) {
    try { read(`components/sections/${dir}/${t}.tsx`); } catch { errors.push(`${imp[1]}.ts: file komponen ${dir}/${t}.tsx tidak ditemukan`); }
  }
  return keys;
}

const errors = [];
// Baca SECTION_VARIANT_OPTIONS: blok "  <section>: [" ... "  ]," berisi baris { value: "..." }.
const web = {};
let current = null;
for (const line of registry.split("\n")) {
  const open = line.match(/^ {2}([A-Za-z_]+): \[/);
  if (open) { current = open[1]; web[current] = []; continue; }
  // Section yang memakai variants.ts: `  about: variantOptions(ABOUT_VARIANTS),`
  const fromFile = line.match(/^ {2}([A-Za-z_]+): variantOptions\((\w+)\),/);
  if (fromFile) { web[fromFile[1]] = readVariantsFile(fromFile[2]); continue; }
  if (/^ {2}\],?\s*$/.test(line)) { current = null; continue; }
  const v = current && line.match(/^\s*\{\s*value:\s*"([^"]+)"/);
  if (v) web[current].push(v[1]);
}
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