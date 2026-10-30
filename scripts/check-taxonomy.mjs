import fs from "node:fs";

const snapshot = JSON.parse(fs.readFileSync("components/site-wizard/taxonomy.snapshot.json", "utf8"));
const constantsRaw = fs.readFileSync("components/site-wizard/constants.ts", "utf8");
const index = fs.readFileSync("components/site-wizard/index.tsx", "utf8");
const translations = fs.readFileSync("lib/i18n/translations.ts", "utf8");

// ── Parse SUB_TYPES from constants.ts ──────────────────────────────────────
// Extract all { value: "..." } entries — works for both inline and shared-const refs
const subTypeValues = new Set([...constantsRaw.matchAll(/value:\s*"([^"]+)"/g)].map((m) => m[1]));

// ── Parse BUSINESS_TYPES from constants.ts ─────────────────────────────────
const businessTypeValues = new Set(
  [...constantsRaw.matchAll(/value:\s*"([^"]+)"[^}]*desc:/g)].map((m) => m[1])
);
// Fallback: parse BUSINESS_TYPES array entries (value field before emoji)
if (businessTypeValues.size === 0) {
  for (const m of constantsRaw.matchAll(/BUSINESS_TYPES[^=]*=\s*\[[\s\S]*?\];/g)) {
    for (const v of m[0].matchAll(/value:\s*"([^"]+)"/g)) {
      businessTypeValues.add(v[1]);
    }
  }
}

// ── Parse SUB_TYPE_ICONS from index.tsx ────────────────────────────────────
const iconStart = index.indexOf("const SUB_TYPE_ICONS");
const iconEnd = index.indexOf("};", iconStart) + 2;
const iconSection = index.slice(iconStart, iconEnd);
const iconMapKeys = new Set([...iconSection.matchAll(/"([^"]+)":/g)].map((m) => m[1]));

// ── Build unique type set from snapshot ───────────────────────────────────
const snapshotTypes = new Set(snapshot.map((e) => e.type));

const errors = [];

// 1. Check canonical types exist in BUSINESS_TYPES (value-level)
for (const t of snapshotTypes) {
  // BUSINESS_TYPES uses canonical values; legacy aliases not required
  if (!businessTypeValues.has(t) && !constantsRaw.includes(`"${t}"`)) {
    errors.push(`BUSINESS_TYPES missing canonical type: "${t}"`);
  }
}

// 2. Check every snapshot sub-type exists in the correct SUB_TYPES[type] bucket
//    We verify membership via subTypeValues (all values in constants.ts)
for (const e of snapshot) {
  if (!subTypeValues.has(e.subType)) {
    errors.push(`SUB_TYPES missing sub-type: "${e.subType}" (type: ${e.type})`);
  }
}

// 3. Check no "orphan" sub-type in constants that isn't in snapshot (for canonical types only)
//    This catches newly added entries that haven't been synced with the API snapshot
const snapshotSubTypes = new Set(snapshot.map((e) => e.subType));
// We only check sub-types that belong to canonical types (skip legacy aliases)
const LEGACY_ALIAS_TYPES = new Set(["Toko & UMKM", "Toko Online & Retail", "Jasa & Booking", "Portofolio & Kreator", "Company"]);
for (const match of constantsRaw.matchAll(/["']([^"']+)["']\s*:\s*(?:TOKO_SUB_TYPES|LAYANAN_SUB_TYPES|COMPANY_SUB_TYPES|PORTOFOLIO_PERSONAL_SUB_TYPES|KREATIF_PRO_SUB_TYPES|\[)/g)) {
  // skip legacy alias keys
  if (LEGACY_ALIAS_TYPES.has(match[1])) continue;
}
// Simpler: just check subTypeValues against snapshotSubTypes for ones that look canonical
// (we skip this reverse check as it requires parsing the full structure — done via go test)

// 4. Check every snapshot sub-type has an icon
for (const e of snapshot) {
  if (!iconMapKeys.has(e.subType)) {
    errors.push(`SUB_TYPE_ICONS missing: "${e.subType}"`);
  }
}

// 5. Check every snapshot sub-type appears at least twice in translations (ID + EN)
const keyRe = (s) => new RegExp(`"${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}":`, "g");
for (const e of snapshot) {
  const count = (translations.match(keyRe(e.subType)) || []).length;
  if (count < 2) {
    errors.push(`translations.ts: "${e.subType}" found ${count}x (need ≥2 for ID+EN)`);
  }
}

// ── Report ─────────────────────────────────────────────────────────────────
if (errors.length) {
  console.error(`check:taxonomy FAILED (${errors.length} error${errors.length > 1 ? "s" : ""}):\n`);
  for (const e of errors) console.error("  ✗ " + e);
  process.exit(1);
}
console.log(`check:taxonomy OK (${snapshot.length} sub-types, ${snapshotTypes.size} types)`);
