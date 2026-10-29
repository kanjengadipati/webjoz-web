import fs from "node:fs";

const snapshot = JSON.parse(fs.readFileSync("components/site-wizard/taxonomy.snapshot.json", "utf8"));
const constants = fs.readFileSync("components/site-wizard/constants.ts", "utf8");
const index = fs.readFileSync("components/site-wizard/index.tsx", "utf8");
const translations = fs.readFileSync("lib/i18n/translations.ts", "utf8");

const subTypeValues = new Set([...constants.matchAll(/value:\s*"([^"]+)"/g)].map((m) => m[1]));
const iconKeys = new Set([...index.matchAll(/"([^"]+)":\s*\w+,?\s*(?:\/\/.*)?/g)].map((m) => m[1]));
// icon map section only: collect keys between SUB_TYPE_ICONS and the next closing brace at column 0
const iconSection = index.slice(index.indexOf("const SUB_TYPE_ICONS"), index.indexOf("};", index.indexOf("const SUB_TYPE_ICONS")) + 2);
const iconMapKeys = new Set([...iconSection.matchAll(/"([^"]+)":/g)].map((m) => m[1]));

const missingInConstants = [];
const missingInIcons = [];
const missingInTranslations = [];
for (const e of snapshot) {
  const st = e.subType;
  if (!subTypeValues.has(st)) missingInConstants.push(st);
  if (!iconMapKeys.has(st)) missingInIcons.push(st);
  if (!translations.includes(st)) missingInTranslations.push(st);
}

let failed = false;
if (missingInConstants.length) {
  failed = true;
  console.error("Missing in SUB_TYPES (constants.ts):");
  for (const s of missingInConstants) console.error("  - " + s);
}
if (missingInIcons.length) {
  failed = true;
  console.error("Missing in SUB_TYPE_ICONS (index.tsx):");
  for (const s of missingInIcons) console.error("  - " + s);
}
if (missingInTranslations.length) {
  failed = true;
  console.error("Missing in translations.ts:");
  for (const s of missingInTranslations) console.error("  - " + s);
}
if (failed) process.exit(1);
console.log(`check:taxonomy OK (${snapshot.length} subtypes)`);