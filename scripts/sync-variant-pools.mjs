// Salin snapshot pool varian dari repo API ke web.
//
//   npm run sync:variants            # salin, tampilkan perubahan, lalu jalankan check:variants
//   npm run sync:variants -- --check # tidak menulis; exit 1 bila snapshot web berbeda dari API
//
// Sumber : <repo API>/internal/variantpools/testdata/section_variants.json
// Tujuan : components/sections/variant-pools.snapshot.json
//
// Lokasi repo API dicari berurutan: $WEBJOZ_API_DIR, ../webjoz-api, ../webjoz-api-master.
// Bila pool di API baru diubah, perbarui dulu sumbernya:
//   go test ./internal/variantpools -run TestSectionVariantsSnapshot -update-variant-snapshot
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const webRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dest = resolve(webRoot, "components/sections/variant-pools.snapshot.json");
const REL = "internal/variantpools/testdata/section_variants.json";
const checkOnly = process.argv.includes("--check");

const candidates = [process.env.WEBJOZ_API_DIR, resolve(webRoot, "../api"), resolve(webRoot, "../webjoz-api"), resolve(webRoot, "../webjoz-api-master")].filter(Boolean);
const apiDir = candidates.find((d) => existsSync(resolve(d, REL)));
if (!apiDir) {
  console.error("Repo API tidak ditemukan. Dicari di:\n  " + candidates.join("\n  ") + `\nSet WEBJOZ_API_DIR ke folder repo API (harus berisi ${REL}).`);
  process.exit(2);
}
const srcPath = resolve(apiDir, REL);

const parse = (path, label) => {
  try {
    const j = JSON.parse(readFileSync(path, "utf8"));
    if (!j || typeof j !== "object" || Array.isArray(j) || !Object.values(j).every((v) => Array.isArray(v)))
      throw new Error("bentuk harus { section: [varian, ...] }");
    return j;
  } catch (e) {
    console.error(`${label} (${path}) tidak valid: ${e.message}`);
    process.exit(2);
  }
};
const next = parse(srcPath, "Sumber");
const prev = existsSync(dest) ? parse(dest, "Snapshot web") : {};

const lines = [];
for (const s of new Set([...Object.keys(prev), ...Object.keys(next)])) {
  const a = new Set(prev[s] ?? []), b = new Set(next[s] ?? []);
  if (!(s in next)) { lines.push(`- section ${s} dihapus`); continue; }
  if (!(s in prev)) { lines.push(`+ section ${s} baru (${[...b].length} varian)`); continue; }
  for (const v of b) if (!a.has(v)) lines.push(`+ ${s}: ${v}`);
  for (const v of a) if (!b.has(v)) lines.push(`- ${s}: ${v}`);
}
const srcText = readFileSync(srcPath, "utf8");
const same = existsSync(dest) && readFileSync(dest, "utf8") === srcText;

if (checkOnly) {
  if (same) { console.log("snapshot web sama dengan API"); process.exit(0); }
  console.error("snapshot web berbeda dari API. Jalankan: npm run sync:variants\n" + (lines.join("\n") || "(hanya beda format/urutan)"));
  process.exit(1);
}

if (same) console.log(`sudah sinkron (${srcPath})`);
else {
  writeFileSync(dest, srcText);
  console.log(`disalin dari ${srcPath}\n` + (lines.join("\n") || "(hanya beda format/urutan)"));
}
const r = spawnSync(process.execPath, [resolve(webRoot, "scripts/check-variant-parity.mjs")], { stdio: "inherit" });
process.exit(r.status ?? 1);
