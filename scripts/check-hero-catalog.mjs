import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const meta = read("components/sections/hero/meta.ts");
const picker = read("app/dashboard/sites/[id]/components/SectionVariantVisualPicker.tsx");

/** Snapshot berformat [{name, imageNeed, minImages}] (format lama string array tidak didukung). */
const snapshotRaw = JSON.parse(read("components/sections/hero/hero-styles.snapshot.json"));
const snapshot = snapshotRaw.map((e) => e.name);

// Registrasi komponen di index.tsx dijaga oleh tsc (Record<HeroStyle, ...>), jadi tidak dicek di sini.
const values = [...meta.matchAll(/\{\s*value:\s*"([^"]+)"/g)].map((m) => m[1]);
const errors = [];

if (values.length === 0) errors.push("meta.ts: tidak ada varian terbaca (format berubah?)");
for (const v of values) {
  if (!picker.includes(`"${v}"`))
    errors.push(`SectionVariantVisualPicker.tsx: tidak ada preview untuk "${v}"`);
}

// Bandingkan himpunan dengan snapshot (tanpa peduli urutan)
const valSet = new Set(values);
const snapSet = new Set(snapshot);
for (const v of valSet) {
  if (!snapSet.has(v))
    errors.push(`hero-styles.snapshot.json: varian "${v}" ada di meta.ts tapi tidak di snapshot — jalankan: go test ./internal/ai -run TestHeroStylesSnapshot -update-hero-snapshot, lalu salin ke web/components/sections/hero/hero-styles.snapshot.json`);
}
for (const v of snapSet) {
  if (!valSet.has(v))
    errors.push(`meta.ts: varian "${v}" ada di snapshot tapi tidak di meta.ts — tambahkan atau update snapshot`);
}

// Validasi imageNeed: web snapshot harus cocok dengan nilai meta.ts
const metaImageNeed = {};
for (const m of meta.matchAll(/\{\s*value:\s*"([^"]+)"[^}]*imageNeed:\s*"([^"]+)"/g)) {
  metaImageNeed[m[1]] = m[2];
}
// Validasi minImages: web snapshot harus cocok dengan meta.ts
// Regex ini membaca setiap baris object literal hero variant { value: "...", ..., minImages: N }
const metaMinImages = {};
for (const m of meta.matchAll(/\{\s*value:\s*"([^"]+)"[^}]*minImages:\s*(\d+)[^}]*\}/gs)) {
  metaMinImages[m[1]] = Number(m[2]);
}

for (const entry of snapshotRaw) {
  const metaNeed = metaImageNeed[entry.name];
  if (metaNeed !== undefined && metaNeed !== entry.imageNeed) {
    errors.push(`imageNeed mismatch for "${entry.name}": meta.ts="${metaNeed}", snapshot="${entry.imageNeed}"`);
  }
  const metaMin = metaMinImages[entry.name];
  if (metaMin !== undefined && metaMin !== entry.minImages) {
    errors.push(`minImages mismatch for "${entry.name}": meta.ts=${metaMin}, snapshot=${entry.minImages}`);
  }
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(`hero catalog OK (${values.length} varian)`);
