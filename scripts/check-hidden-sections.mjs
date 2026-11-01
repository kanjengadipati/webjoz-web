// Memastikan semua template: (1) di mode editor tetap merender section tersembunyi (agar bisa ditampilkan lagi),
// (2) tidak memasukkannya ke urutan nav header.
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = "components/templates";
const SKIP = new Set([
  "editor.tsx",
  "shared.tsx",
  "blog-section.tsx",
  "section-reorder.tsx",
  "section-visibility.tsx",
  "helpers.ts",
  "types.ts",
  "index.ts",
]);
const errors = [];

for (const f of readdirSync(dir).filter((x) => x.endsWith(".tsx") && !SKIP.has(x))) {
  const src = readFileSync(join(dir, f), "utf8");
  if (!src.includes("hidden_sections")) continue; // bukan template penuh

  // Dua pola filter yang valid: variabel k atau key atau sec.type
  const bodyOkK = /\.filter\(\(?\w+\)?\s*=>\s*isEditorMode\s*\|\|\s*!\(dt\?\.layout\?\.hidden_sections \?\? \[\]\)\.includes\(/.test(src);
  const navOk = /sectionOrder=\{withoutHidden\(renderedSectionOrder, dt\)\}/.test(src);

  if (!bodyOkK) errors.push(`${f}: filter hidden_sections belum memakai "isEditorMode ||"`);
  if (!navOk) errors.push(`${f}: HeaderSection belum memakai sectionOrder={withoutHidden(renderedSectionOrder, dt)}`);
}

if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("hidden-sections OK");
