import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const sectionsDir = new URL("../components/sections", import.meta.url).pathname;
const skipFiles = new Set([
  "index.tsx", "types.ts", "variants.ts", "meta.ts", "shared.tsx",
  "primitives.tsx", "hero-strings.ts", "inline-social-editor.tsx",
  "inline-map-picker.tsx", "leaflet-map.tsx", "lead-form.tsx",
  "PhotoCredit.tsx", "PhotoCreditList.tsx", "section-header.tsx",
  "social-platforms.tsx", "use-catalog-filter.ts", "wizard-regen-context.tsx",
  "editor-chrome-context.tsx", "inline-add.tsx"
]);

const sections = readdirSync(sectionsDir).filter((f) => {
  try {
    return statSync(join(sectionsDir, f)).isDirectory();
  } catch {
    return false;
  }
});

const errors = [];
let auditedFilesCount = 0;

for (const sec of sections) {
  const dir = join(sectionsDir, sec);
  const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !skipFiles.has(f));

  for (const file of files) {
    auditedFilesCount++;
    const filePath = join(dir, file);
    const content = readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    // Check 1: image guards missing isEditorMode
    lines.forEach((line, idx) => {
      if ((line.includes("<HeroImage") || line.includes("<InlineImage")) && !line.includes("//")) {
        const prev = lines.slice(Math.max(0, idx - 4), idx).join(" ");
        if (prev.includes("&&") && !prev.includes("isEditorMode")) {
          const m = prev.match(/([a-zA-Z0-9_?.()]+)\s*&&/);
          if (m && (m[1].includes("image") || m[1].includes("photo") || m[1].includes("img") || m[1].includes("bg"))) {
            errors.push(`${sec}/${file}:${idx + 1} Image guard "${m[1]}" missing "|| isEditorMode"`);
          }
        }
      }
    });

    // Check 2: InlineText guarded without isEditorMode
    lines.forEach((line, idx) => {
      if (line.includes("<InlineText") && !line.includes("//")) {
        const prev = lines.slice(Math.max(0, idx - 4), idx).join(" ");
        if (prev.includes("&&") && !prev.includes("isEditorMode")) {
          const m = prev.match(/([a-zA-Z0-9_?.()]+)\s*&&/);
          if (m && (m[1].includes("description") || m[1].includes("subtitle") || m[1].includes("eyebrow") || m[1].includes("badge") || m[1].includes("role") || m[1].includes("bio") || m[1].includes("tagline"))) {
            errors.push(`${sec}/${file}:${idx + 1} Text guard "${m[1]}" hides InlineText when empty; use "(${m[1]} || isEditorMode) &&"`);
          }
        }
      }
    });
  }
}

if (errors.length) {
  console.error("❌ check:editability failed with errors:");
  errors.forEach((err) => console.error("  - " + err));
  process.exit(1);
}

console.log(`editability OK (${auditedFilesCount} section variants verified)`);
