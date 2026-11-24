#!/usr/bin/env node
// Guard localization untuk varian section.
//
// Standar Localization:
// 1. Registry Keys: Setiap labelKey & descriptionKey yang didaftarkan di
//    variant-registry.ts atau <section>/variants.ts WAJIB terdefinisi di
//    lib/i18n/translations.ts (pada kamus id maupun en).
// 2. Component Strings: Teks UI pada komponen varian (placeholder, aria-label, title, alt)
//    TIDAK boleh hardcoded satu bahasa, dan untuk varian baru TIDAK boleh inline `isEN ? ... : ...`.
//    Harus menggunakan typed dictionary terstandarisasi (contoh: heroStrings / benefitsStrings).
//
// Pembaruan baseline legacy:
//   node scripts/check-section-localization.mjs --update-baseline

import { readdirSync, readFileSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sectionsDir = join(root, "components", "sections");
const baselinePath = join(root, "scripts", "localization-baseline.json");

const skipFiles = new Set([
  "index.tsx", "types.ts", "variants.ts", "meta.ts", "shared.tsx",
  "primitives.tsx", "hero-strings.ts", "benefits-strings.ts", "inline-social-editor.tsx",
  "inline-map-picker.tsx", "leaflet-map.tsx", "lead-form.tsx",
  "PhotoCredit.tsx", "PhotoCreditList.tsx", "section-header.tsx",
  "social-platforms.tsx", "use-catalog-filter.ts", "wizard-regen-context.tsx",
  "editor-chrome-context.tsx", "inline-add.tsx", "variant-meta.ts", "variant-registry.ts"
]);

// Nilai teknis yang bukan teks bahasa alami
const TECHNICAL_VALUE = /^(https?:|mailto:|var\(--|\{|\.\.\.|[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$)/i;

const ATTR_RE = /\b(placeholder|aria-label|title|alt)\s*=\s*"([^"]+)"/g;
const INLINE_ISEN_RE = /\b(placeholder|aria-label|title|alt)\s*=\s*\{isEN\s*\?\s*"([^"]+)"\s*:\s*"([^"]+)"\}/g;

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

// -------------------------------------------------------------
// CHECK 1: Translation Keys in variant-registry.ts <-> translations.ts
// -------------------------------------------------------------
async function checkRegistryTranslationKeys() {
  const errors = [];
  const { translations } = await import("../lib/i18n/translations.ts");
  const idEditor = translations?.id?.dashboard?.sitesEditor || {};
  const enEditor = translations?.en?.dashboard?.sitesEditor || {};

  const registryFiles = [
    "components/sections/variant-registry.ts",
    "components/sections/hero/meta.ts",
    "components/sections/about/variants.ts",
    "components/sections/benefits/variants.ts",
    "components/sections/testimonials/variants.ts",
    "components/sections/cta/variants.ts",
    "components/sections/faq/variants.ts",
    "components/sections/stats/variants.ts",
    "components/sections/skills/variants.ts",
    "components/sections/partners/variants.ts",
    "components/sections/pricing/variants.ts",
    "components/sections/menu/variants.ts",
    "components/sections/catalog/variants.ts",
    "components/sections/contact/variants.ts",
    "components/sections/header/variants.ts",
    "components/sections/footer/variants.ts",
  ];

  const labelKeys = new Set();
  const descKeys = new Set();

  for (const relPath of registryFiles) {
    const fullPath = join(root, relPath);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, "utf8");
    for (const m of content.matchAll(/labelKey:\s*"([^"]+)"/g)) labelKeys.add(m[1]);
    for (const m of content.matchAll(/descriptionKey:\s*"([^"]+)"/g)) descKeys.add(m[1]);
  }

  for (const key of [...labelKeys, ...descKeys]) {
    if (!(key in idEditor)) {
      errors.push(`Translation key "${key}" hilang di translations.id.dashboard.sitesEditor`);
    }
    if (!(key in enEditor)) {
      errors.push(`Translation key "${key}" hilang di translations.en.dashboard.sitesEditor`);
    }
  }

  return { errors, totalKeysChecked: labelKeys.size + descKeys.size };
}

// -------------------------------------------------------------
// CHECK 2: Hardcoded Text Attributes in Section Variants
// -------------------------------------------------------------
function collectComponentViolations() {
  const violations = [];
  for (const file of walk(sectionsDir)) {
    const rel = relative(root, file);
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, idx) => {
      if (line.trim().startsWith("//")) return;
      let m;
      ATTR_RE.lastIndex = 0;
      while ((m = ATTR_RE.exec(line)) !== null) {
        const attr = m[1];
        const value = m[2].trim();
        if (!value || TECHNICAL_VALUE.test(value)) continue;
        if (!/[A-Za-zÀ-ÿ]/.test(value)) continue;
        violations.push({
          file: rel,
          line: idx + 1,
          attr,
          value,
          fingerprint: `${rel}|${attr}|bare|${value}`,
        });
      }
      INLINE_ISEN_RE.lastIndex = 0;
      while ((m = INLINE_ISEN_RE.exec(line)) !== null) {
        const attr = m[1];
        const enVal = m[2].trim();
        const idVal = m[3].trim();
        // Standar baru: inline isEN untuk placeholder UI tidak diizinkan di varian baru (harus typed dictionary).
        violations.push({
          file: rel,
          line: idx + 1,
          attr,
          value: `${enVal} / ${idVal}`,
          fingerprint: `${rel}|${attr}|inline|${enVal}||${idVal}`,
        });
      }
    });
  }
  return violations;
}

// -------------------------------------------------------------
// MAIN EXECUTION
// -------------------------------------------------------------
async function run() {
  const updateBaseline = process.argv.includes("--update-baseline");
  const violations = collectComponentViolations();

  if (updateBaseline) {
    const fps = [...new Set(violations.map((v) => v.fingerprint))].sort();
    writeFileSync(baselinePath, JSON.stringify(fps, null, 2) + "\n");
    console.log(`✅ localization baseline updated: ${fps.length} legacy entries saved.`);
    process.exit(0);
  }

  // 1. Audit Registry Translation Keys
  const { errors: regErrors, totalKeysChecked } = await checkRegistryTranslationKeys();
  if (regErrors.length > 0) {
    console.error(`❌ check:localization gagal — ada ${regErrors.length} kunci terjemahan hilang di translations.ts:`);
    regErrors.forEach((e) => console.error(`  - ${e}`));
    process.exit(1);
  }

  // 2. Audit Component UI Strings against Baseline
  if (!existsSync(baselinePath)) {
    console.error("❌ localization baseline tidak ditemukan. Jalankan:");
    console.error("   node scripts/check-section-localization.mjs --update-baseline");
    process.exit(1);
  }

  const baseline = new Set(JSON.parse(readFileSync(baselinePath, "utf8")));
  const unknown = violations.filter((v) => !baseline.has(v.fingerprint));

  if (unknown.length > 0) {
    console.error("❌ check:localization gagal — string UI varian baru tidak memenuhi standar localization:");
    const seen = new Set();
    for (const v of unknown) {
      if (seen.has(v.fingerprint)) continue;
      seen.add(v.fingerprint);
      console.error(`  - ${v.file}:${v.line} ${v.attr}="${v.value}"`);
    }
    console.error("");
    console.error("Standar yang benar untuk varian baru:");
    console.error("  1. Gunakan typed dictionary per section (contoh: components/sections/benefits/benefits-strings.ts).");
    console.error("  2. Panggil: const L = sectionStrings(language);");
    console.error("  3. Gunakan: placeholder={L.itemTitlePlaceholder}");
    console.error("  DILARANG menggunakan string hardcoded bare satu bahasa maupun inline isEN ? ... : ... di varian baru.");
    process.exit(1);
  }

  console.log(`✅ localization OK: ${totalKeysChecked} registry keys verified & components comply with baseline (${violations.length} legacy items protected).`);
}

run().catch((err) => {
  console.error("Error running localization check:", err);
  process.exit(1);
});
