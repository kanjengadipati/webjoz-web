#!/usr/bin/env node
// Gagal bila t("kunci") dipanggil TANPA parameter untuk kunci yang nilainya memuat {placeholder}.
// Tanpa parameter, UI menampilkan literal "{itemLabel}". Dikecualikan: pemanggilan yang diikuti .replace(...).
import ts from "typescript";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { translations } from "../lib/i18n/translations.ts";

const flat = (o, p = "", out = {}) => { for (const [k, v] of Object.entries(o)) { const key = p ? `${p}.${k}` : k; if (v && typeof v === "object" && !Array.isArray(v)) flat(v, key, out); else out[key] = v; } return out; };
const id = flat(translations.id), en = flat(translations.en);
const walk = (p, o = []) => { for (const n of readdirSync(p)) { if (n === "node_modules" || n === ".next") continue; const q = join(p, n); statSync(q).isDirectory() ? walk(q, o) : /\.tsx?$/.test(q) && o.push(q); } return o; };

// Dikecualikan: teks diteruskan sebagai label mentah ke komponen yang mengisi {n} sendiri (components/pricing-cards.tsx → fill()).
const SKIP_FILES = new Set(["app/LandingPageClient.tsx"]);
let bad = 0;
for (const file of ["app", "components", "lib", "hooks"].flatMap((d) => walk(d))) {
  if (file.endsWith("translations.ts") || SKIP_FILES.has(file)) continue;
  const src = readFileSync(file, "utf8");
  if (!/\bt\(/.test(src)) continue;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const visit = (n) => {
    if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && n.expression.text === "t" && n.arguments.length >= 1 && ts.isStringLiteralLike(n.arguments[0])) {
      const key = n.arguments[0].text;
      const ph = new Set([id[key], en[key]].filter((v) => typeof v === "string").flatMap((v) => v.match(/\{\w+\}/g) || []));
      const viaReplace = ts.isPropertyAccessExpression(n.parent) && n.parent.name.text === "replace";
      if (ph.size && !viaReplace) {
        const p3 = n.arguments[2];
        const given = p3 && ts.isObjectLiteralExpression(p3) ? new Set(p3.properties.map((x) => x.name?.getText() ?? x.getText())) : null;
        if (!(p3 && !given)) { // param berupa variabel (bukan literal objek) → tidak bisa dicek, lewati
          const missing = [...ph].map((x) => x.slice(1, -1)).filter((x) => !given || !given.has(x));
          if (missing.length) { bad++; console.log(`${file}:${sf.getLineAndCharacterOfPosition(n.getStart()).line + 1} ${key} — parameter hilang: ${missing.join(", ")}`); }
        }
      }
    }
    ts.forEachChild(n, visit);
  };
  visit(sf);
}
if (bad) { console.error(`i18n-params: ${bad} pemanggilan tanpa parameter`); process.exit(1); }
console.log("i18n-params OK");

