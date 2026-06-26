import React from "react";
import {
  TemplateDynamicWithCart,
  TemplateKuliner,
  TemplateJasa,
  TemplateProduk,
  TemplateElegant,
  TemplateNatural,
  TemplateColorful,
  TemplateMinimalist,
  TemplateBold,
  TemplateRetro,
  TemplateFuturistic,
  type TemplateProps,
} from "@/components/templates";

export function selectTemplate(businessType: string): string {
  const lower = businessType.toLowerCase();

  if (lower.includes("kafe") || lower.includes("cafe") || lower.includes("kopi") ||
    lower.includes("restoran") || lower.includes("warung") || lower.includes("bakery") ||
    lower.includes("catering") || lower.includes("kuliner")) return "TEMPLATE_KULINER01";
  if (lower.includes("jasa") || lower.includes("konsultan") || lower.includes("agensi") ||
    lower.includes("fotografer") || lower.includes("klinik") || lower.includes("dokter")) return "TEMPLATE_JASA02";
  if (lower.includes("produk") || lower.includes("toko") || lower.includes("retail") ||
    lower.includes("fashion") || lower.includes("elektronik") || lower.includes("umkm") ||
    lower.includes("online") || lower.includes("minuman") || lower.includes("bubble") ||
    lower.includes("boba")) return "TEMPLATE_PRODUK03";
  if (lower.includes("properti") || lower.includes("konstruksi") || lower.includes("hotel") ||
    lower.includes("travel") || lower.includes("pendidikan") || lower.includes("manufaktur")) return "TEMPLATE_JASA02";

  return "TEMPLATE_DYNAMIC";
}

export function getTemplateComponent(templateId: string): React.ComponentType<TemplateProps> {
  switch (templateId) {
    case "TEMPLATE_KULINER01": return TemplateKuliner;
    case "TEMPLATE_JASA02": return TemplateJasa;
    case "TEMPLATE_PRODUK03": return TemplateProduk;
    case "TEMPLATE_ELEGANT": return TemplateElegant;
    case "TEMPLATE_NATURAL": return TemplateNatural;
    case "TEMPLATE_COLORFUL": return TemplateColorful;
    case "TEMPLATE_MINIMALIST": return TemplateMinimalist;
    case "TEMPLATE_BOLD": return TemplateBold;
    case "TEMPLATE_RETRO": return TemplateRetro;
    case "TEMPLATE_FUTURISTIC": return TemplateFuturistic;
    default: return TemplateDynamicWithCart;
  }
}

export function formatText(text: string, isUser: boolean) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className={`font-bold ${isUser ? "text-white" : "text-slate-950"}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

export function capitalizeWords(val: string): string {
  return val
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
    .join(" ");
}

export function normalizeWhatsapp(val: string): string {
  const digits = val.replace(/\D/g, "");
  return digits.startsWith("0") ? "62" + digits.slice(1) : digits;
}

export function generateSubdomain(name: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9-]/g, "") +
    "-" +
    Math.floor(Math.random() * 9000 + 1000)
  );
}

export function generateSlug(name: string): string {
  return (
    name.toLowerCase().replace(/[^a-z0-9-]/g, "") +
    "-" +
    Math.floor(Math.random() * 1000)
  );
}

export function calculateProgress(chatStage: string): number {
  switch (chatStage) {
    case "name": return 15;
    case "type": return 40;
    case "done": return 100;
    default: return 100;
  }
}

export function getStageNumber(chatStage: string): number {
  switch (chatStage) {
    case "name": return 1;
    case "type": return 2;
    case "done": return 2;
    default: return 1;
  }
}

export const MOOD_TEMPLATE_POOLS: Record<string, string[]> = {
  "elegan":      ["TEMPLATE_ELEGANT", "TEMPLATE_MINIMALIST", "TEMPLATE_DYNAMIC"],
  "natural":     ["TEMPLATE_NATURAL", "TEMPLATE_DYNAMIC", "TEMPLATE_KULINER01"],
  "fun":         ["TEMPLATE_COLORFUL", "TEMPLATE_DYNAMIC", "TEMPLATE_PRODUK03", "TEMPLATE_KULINER01"],
  "bold":        ["TEMPLATE_BOLD", "TEMPLATE_DYNAMIC", "TEMPLATE_JASA02"],
  "modern":      ["TEMPLATE_MINIMALIST", "TEMPLATE_DYNAMIC"],
  "profesional": ["TEMPLATE_JASA02", "TEMPLATE_MINIMALIST", "TEMPLATE_DYNAMIC"],
  "retro":       ["TEMPLATE_RETRO", "TEMPLATE_DYNAMIC", "TEMPLATE_BOLD"],
  "futuristic":  ["TEMPLATE_FUTURISTIC", "TEMPLATE_DYNAMIC", "TEMPLATE_MINIMALIST"],
};

export function getTemplatePool(mood: string): string[] {
  const lm = mood.toLowerCase();
  for (const [key, pool] of Object.entries(MOOD_TEMPLATE_POOLS)) {
    if (lm.includes(key)) return pool;
  }
  return ["TEMPLATE_DYNAMIC"];
}

// Pick random variant from array
export function pickVariant<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Heuristic to detect likely gibberish / keyboard-mashing names.
export function isLikelyGibberish(input: string): boolean {
  const s = (input || "").toLowerCase().trim();
  if (!s) return false;

  // Layered, easy-to-understand rules:
  // 1) Immediate rejects: contains common keyboard-mash tokens or has no letters.
  // 2) If input is multi-word and reasonably short, accept (very likely a real name).
  // 3) For single-word inputs, apply stricter checks: vowel ratio, distinct-letter ratio,
  //    and long consonant runs. These are conservative signals of nonsense.
  // 4) Fallback scoring for other repeated patterns (repeated char, repeated bigrams).

  const words = s.split(/\s+/).filter(Boolean);

  // 1) Immediate rejects
  const mashPatterns = ["asdf", "qwer", "qwerty", "zxcv", "zzxx", "kjhg", "sfas", "sfasf", "asdfg"];
  for (const p of mashPatterns) if (s.includes(p)) return true;

  const letters = s.replace(/[^a-z]/g, "");
  if (letters.length === 0) return true; // e.g. "12345"

  // 2) Multi-word short names are probably fine: accept early
  if (words.length > 1 && letters.length >= 2) return false;

  const vowelCount = (letters.match(/[aeiou]/g) || []).length;
  const vowelRatio = vowelCount / Math.max(1, letters.length);
  const distinctLetters = new Set(letters.split(""));
  const distinctRatio = distinctLetters.size / Math.max(1, letters.length);

  // 3) Strong single-word heuristics
  if (words.length === 1 && letters.length >= 7) {
    // too few vowels for the length
    if (vowelRatio < 0.38) return true;
    // too few distinct letters (repetitive)
    if (distinctRatio < 0.48) return true;
    // long consonant runs are suspicious
    if (/[bcdfghjklmnpqrstvwxyz]{4,}/.test(letters)) return true;
  }

  // 4) Moderate signals aggregated
  let score = 0;
  if (vowelRatio <= 0.28) score += 1;
  if (/(.)\1\1/.test(s)) score += 1; // repeated char 3x+
  if (letters.length >= 6 && distinctRatio <= 0.45) score += 1;

  if (letters.length >= 4) {
    const bigrams: Record<string, number> = {};
    for (let i = 0; i < letters.length - 1; i++) {
      const b = letters.slice(i, i + 2);
      bigrams[b] = (bigrams[b] || 0) + 1;
      if (bigrams[b] >= 2) {
        score += 1;
        break;
      }
    }
  }

  return score >= 2;
}

// Suggest business type/subtype from name keywords. Uses NAME_TYPE_HINTS from constants.
import { NAME_TYPE_HINTS } from "./constants";

export function suggestTypeFromName(name: string): { type?: string; subType?: string } | null {
  const s = (name || "").toLowerCase();
  if (!s) return null;
  for (const key of Object.keys(NAME_TYPE_HINTS)) {
    if (s.includes(key)) return NAME_TYPE_HINTS[key];
  }
  return null;
}
