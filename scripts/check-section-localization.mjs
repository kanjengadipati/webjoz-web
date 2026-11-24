#!/usr/bin/env node
// Guard localization pada varian section.
//
// Aturan: teks UI yang tampil di varian (placeholder, aria-label, title, alt)
// TIDAK boleh hardcoded satu bahasa. Harus bilingual, mis.:
//   placeholder={isEN ? "Add tagline..." : "Tambah tagline..."}
// atau lewat helper sectionStrings(language).
//
// Script ini mendeteksi atribut string literal (bukan di dalam { ... }) yang
// berisi teks UI. Atribut seperti itu yang belum terdaftar di baseline akan
// membuat build gagal, sehingga varian baru tidak bisa lolos tanpa
// mempertimbangkan localization.
//
// Pembaruan baseline (HANYA untuk kode legacy) :
//   node scripts/check-section-localization.mjs --update-baseline

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sectionsDir = join(root, "components", "sections");
const baselinePath = join(root, "scripts", "localization-baseline.json");

const skipFiles = new Set([
  "index.tsx", "types.ts", "variants.ts", "meta.ts", "shared.tsx",
  "primitives.tsx", "hero-strings.ts", "inline-social-editor.tsx",
  "inline-map-picker.tsx", "leaflet-map.tsx", "lead-form.tsx",
  "PhotoCredit.tsx", "PhotoCreditList.tsx", "section-header.tsx",
  "social-platforms.tsx", "use-catalog-filter.ts", "wizard-regen-context.tsx",
  "editor-chrome-context.tsx", "inline-add.tsx",
]);

// Nilai yang bukan teks UI (email, url, css var, token teknis) dikecualikan.
const TECHNICAL_VALUE = /^(https?:|mailto:|var\(--|\{|\.\.\.|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$)/i;

const ATTR_RE = /\b(placeholder|aria-label|title|alt)\s*=\s*"([^"]+)"/g;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next") continue;
    const q = join(dir, name);
    const st = statSync(q);
    if (st.isDirectory()) walk(q, out);
    else if (q.endsWith(".tsx") && !skipFiles.has(name)) out.push(q);
  }
  return out;
}

function collect() {
  const violations = [];
  for (const file of walk(sectionsDir)) {
    const rel = relative(root, file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, idx) => {
      // Lewati komentar.
      if (line.trim().startsWith("//")) return;
      let m;
      ATTR_RE.lastIndex = 0;
      while ((m = ATTR_RE.exec(line)) !== null) {
        const attr = m[1];
        const value = m[2].trim();
        if (!value || TECHNICAL_VALUE.test(value)) continue;
        // Hanya teks yang berisi huruf (bukan angka/simbol murni).
        if (!/[A-Za-zÀ-ÿ]/.test(value)) continue;
        violations.push({ file: rel, attr, value, fingerprint: `${rel}|${attr}|${value}` });
      }
    });
  }
  return violations;
}

const updateBaseline = process.argv.includes("--update-baseline");
const violations = collect();

if (updateBaseline) {
  const fps = [...new Set(violations.map((v) => v.fingerprint))].sort();
  writeFileSync(baselinePath, JSON.stringify(fps, null, 2) + "\n");
  console.log(`localization baseline updated: ${fps.length} entri`);
  process.exit(0);
}

if (!existsSync(baselinePath)) {
  console.error("❌ localization baseline tidak ditemukan. Jalankan:");
  console.error("   node scripts/check-section-localization.mjs --update-baseline");
  process.exit(1);
}

const baseline = new Set(JSON.parse(readFileSync(baselinePath, "utf8")));
const unknown = violations.filter((v) => !baseline.has(v.fingerprint));

if (unknown.length) {
  console.error("❌ check:localization gagal — atribut teks hardcoded baru terdeteksi:");
  // Deduplikasi berdasarkan fingerprint untuk output ringkas.
  const seen = new Set();
  for (const v of unknown) {
    if (seen.has(v.fingerprint)) continue;
    seen.add(v.fingerprint);
    console.error(`  - ${v.file}  ${v.attr}="${v.value}"`);
  }
  console.error("");
  console.error("Perbaiki dengan menjadikannya bilingual, mis.:");
  console.error('  placeholder={isEN ? "Add tagline..." : "Tambah tagline..."}');
  console.error("Atau (hanya untuk kode legacy) perbarui baseline:");
  console.error("  node scripts/check-section-localization.mjs --update-baseline");
  process.exit(1);
}

console.log(`localization OK (${violations.length} atribut legacy terdaftar di baseline)`);