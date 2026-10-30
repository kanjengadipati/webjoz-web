// @ts-check
// check-taxonomy.mjs — verifies API snapshot ↔ web constants are in sync.
// Run: node --experimental-strip-types scripts/check-taxonomy.mjs
// (Node 22+ with --experimental-strip-types, or Node ≥22.18 where it is default)
import fs from "node:fs";
import { BUSINESS_TYPES, SUB_TYPES } from "../components/site-wizard/constants.ts";

const snapshot = JSON.parse(fs.readFileSync("components/site-wizard/taxonomy.snapshot.json", "utf8"));
const index = fs.readFileSync("components/site-wizard/index.tsx", "utf8");
const translations = fs.readFileSync("lib/i18n/translations.ts", "utf8");

const errors = [];
const types = new Set(snapshot.map((e) => e.type));

// 1. Every canonical type in snapshot must exist as a BUSINESS_TYPES value.
for (const t of types) {
  if (!BUSINESS_TYPES.some((b) => b.value === t)) {
    errors.push(`BUSINESS_TYPES missing canonical type: "${t}"`);
  }
}

// 2. Every sub-type in snapshot must exist in SUB_TYPES[type].
for (const e of snapshot) {
  if (!(SUB_TYPES[e.type] ?? []).some((s) => s.value === e.subType)) {
    errors.push(`SUB_TYPES["${e.type}"] missing: "${e.subType}"`);
  }
}

// 3. No unknown sub-type in SUB_TYPES for canonical types (reverse check).
//    Legacy alias keys (Toko & UMKM, Jasa & Booking, etc.) are skipped.
const LEGACY_ALIAS_TYPES = new Set([
  "Toko & UMKM", "Toko Online & Retail",
  "Jasa & Booking",
  "Portofolio & Kreator",
  "Company",
]);
for (const t of types) {
  for (const s of SUB_TYPES[t] ?? []) {
    if (!snapshot.some((e) => e.type === t && e.subType === s.value)) {
      errors.push(`SUB_TYPES["${t}"] contains unknown sub-type: "${s.value}"`);
    }
  }
}

// 4. Every sub-type must have an icon in SUB_TYPE_ICONS.
const iconStart = index.indexOf("const SUB_TYPE_ICONS");
const iconSection = index.slice(iconStart, index.indexOf("};", iconStart) + 2);
for (const e of snapshot) {
  if (!iconSection.includes(`"${e.subType}":`)) {
    errors.push(`SUB_TYPE_ICONS missing: "${e.subType}"`);
  }
}

// 5. Every sub-type must appear ≥2× in translations.ts (ID + EN blocks).
const keyRe = (s) => new RegExp(`"${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\s*:`, "g");
for (const e of snapshot) {
  const n = (translations.match(keyRe(e.subType)) || []).length;
  if (n < 2) {
    errors.push(`translations.ts: "${e.subType}" found ${n}x (need ≥2: ID and EN)`);
  }
}

if (errors.length) {
  console.error(`check:taxonomy FAILED (${errors.length} error${errors.length > 1 ? "s" : ""}):\n`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`check:taxonomy OK (${snapshot.length} sub-types, ${types.size} types)`);
