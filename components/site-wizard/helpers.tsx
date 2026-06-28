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
  if (lower.includes("retro") || lower.includes("vintage") || lower.includes("klasik")) return "TEMPLATE_RETRO";
  if (lower.includes("futuristik") || lower.includes("tech") || lower.includes("teknologi") ||
    lower.includes("cyber") || lower.includes("modern")) return "TEMPLATE_FUTURISTIC";

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
        <strong key={i} className={`font-bold ${isUser ? "text-white" : "text-slate-100"}`}>
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
    case "name": return 10;
    case "description": return 25;
    case "type": return 40;
    case "done": return 100;
    default: return 100;
  }
}

export function getStageNumber(chatStage: string): number {
  switch (chatStage) {
    case "name": return 1;
    case "description": return 2;
    case "type": return 3;
    case "done": return 3;
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
import type { InferenceResult } from "./types";

export function suggestTypeFromName(name: string): { type?: string; subType?: string } | null {
  const s = (name || "").toLowerCase();
  if (!s) return null;
  for (const key of Object.keys(NAME_TYPE_HINTS)) {
    if (s.includes(key)) return NAME_TYPE_HINTS[key];
  }
  return null;
}

interface DescHintEntry {
  type: string;
  subType?: string;
  keywords: string[];
  weight: number;
}

const DESC_HINTS: DescHintEntry[] = [
  { type: "Kuliner", subType: "Kafe", keywords: ["kopi", "coffee", "kafe", "cafe", "ngopi", "roasting", "espresso", "latte", "cappuccino", "brew", "kedai kopi"], weight: 2 },
  { type: "Kuliner", subType: "Restoran", keywords: ["restoran", "makan siang", "makan malam", "prasmanan", "fine dining", "menu", "chef", "masakan", "nasi", "lauk", "makanan"], weight: 2 },
  { type: "Kuliner", subType: "Bakery & Pastry", keywords: ["roti", "bakery", "kue", "pastry", "cake", "baking", "kue kering", "donat"], weight: 2 },
  { type: "Kuliner", subType: "Catering", keywords: ["catering", "prasmanan", "nasi kotak", "nasi box", "katering"], weight: 2 },
  { type: "Kuliner", subType: "Warung Makan", keywords: ["warung", "warteg", "nasi padang", "soto", "bakso", "mie ayam", "sate"], weight: 2 },
  { type: "Kuliner", subType: "Minuman & Bubble Tea", keywords: ["minuman", "bubble", "boba", "es teh", "es", "jus", "smoothie", "shaken", "thai tea", "milk tea"], weight: 2 },
  { type: "Jasa", subType: "Salon & Kecantikan", keywords: ["salon", "kecantikan", "beauty", "hair", "makeup", "rias", "spa", "manicure", "pedicure", "skincare", "perawatan"], weight: 2 },
  { type: "Jasa", subType: "Barbershop", keywords: ["barber", "pangkas rambut", "cukur", "potong rambut", "fade", "beard", "grooming"], weight: 2 },
  { type: "Jasa", subType: "Laundry", keywords: ["laundry", "cuci", "setrika", "dry clean", "laundry kiloan", "binatu"], weight: 2 },
  { type: "Jasa", subType: "Otomotif & Bengkel", keywords: ["bengkel", "otomotif", "mobil", "motor", "servis", "tambal ban", "cuci motor", "cuci mobil", "spooring", "balance"], weight: 2 },
  { type: "Jasa", subType: "Klinik & Kesehatan", keywords: ["klinik", "dokter", "kesehatan", "medis", "rumah sakit", "puskesmas", "bidan", "perawat", "poli"], weight: 2 },
  { type: "Jasa", subType: "Konsultan", keywords: ["konsultan", "konsultasi", "advisor", "pembinaan", "pelatihan", "training", "coaching", "mentor"], weight: 2 },
  { type: "Jasa", subType: "Fotografer", keywords: ["fotografer", "photography", "photo", "foto", "videografi", "wedding", "prewedding", "shoot"], weight: 2 },
  { type: "Jasa", subType: "Agensi", keywords: ["agensi", "agency", "iklan", "marketing", "branding", "digital", "media sosial", "content writer", "kreatif"], weight: 2 },
  { type: "Toko & UMKM", subType: "Fashion & Pakaian", keywords: ["fashion", "pakaian", "baju", "sepatu", "tembaga", "batik", "distro", "konveksi", "jahit", "kain", "busana"], weight: 2 },
  { type: "Toko & UMKM", subType: "Elektronik", keywords: ["elektronik", "gadget", "handphone", "hp", "laptop", "komputer", "aksesoris", "pulsa", "listrik", "lampu"], weight: 2 },
  { type: "Toko & UMKM", subType: "Produk Lokal Handmade", keywords: ["handmade", "kerajinan", "souvenir", "oleh-oleh", "kriya", "tenun", "anyam", "lokal", "produk lokal", "umkm lokal"], weight: 2 },
  { type: "Toko & UMKM", subType: "Toko Online", keywords: ["online", "shop", "e-commerce", "jual beli", "reseller", "dropship", "marketplace", "olshop"], weight: 2 },
  { type: "Toko & UMKM", subType: "Minimarket", keywords: ["minimarket", "sembako", "kelontong", "toko kelontong", "bahan pokok", "sembilan bahan"], weight: 2 },
  { type: "Toko & UMKM", subType: "Perabot & Furnitur", keywords: ["furnitur", "perabot", "meja", "kursi", "lemari", "kasur", "interior", "dekorasi"], weight: 2 },
  { type: "Company", subType: "Properti & Real Estate", keywords: ["properti", "real estate", "rumah", "apartemen", "tanah", "perumahan", "agent properti", "jual rumah"], weight: 2 },
  { type: "Company", subType: "Konstruksi", keywords: ["konstruksi", "kontraktor", "bangunan", "pembangunan", "arsitek", "desain interior", "renovasi"], weight: 2 },
  { type: "Company", subType: "Pendidikan & Kursus", keywords: ["pendidikan", "sekolah", "kursus", "bimbingan belajar", "bimbel", "les", "privat", "pelatihan", "akademi"], weight: 2 },
  { type: "Company", subType: "Travel & Wisata", keywords: ["travel", "wisata", "liburan", "tour", "paket wisata", "tiket", "pariwisata", "jalan-jalan"], weight: 2 },
  { type: "Company", subType: "Hotel & Penginapan", keywords: ["hotel", "penginapan", "villa", "guest house", "homestay", "resort", "lodge", "pondok wisata"], weight: 2 },
  { type: "Company", subType: "Manufaktur", keywords: ["manufaktur", "pabrik", "produksi", "industri", "fabrikasi", "perakitan", "pengolahan"], weight: 2 },
];

// Broader type-only keywords (lower weight)
const DESC_TYPE_HINTS: { type: string; keywords: string[]; weight: number }[] = [
  { type: "Kuliner", keywords: ["makan", "minum", "jual makanan", "bisnis kuliner", "usaha makanan", "makanan ringan"], weight: 1 },
  { type: "Jasa", keywords: ["jasa", "layanan", "service", "bantuan", "profesional", "bidang jasa"], weight: 1 },
  { type: "Toko & UMKM", keywords: ["jual", "dagang", "toko", "ritel", "eceran", "usaha kecil", "bisnis rumahan"], weight: 1 },
  { type: "Company", keywords: ["perusahaan", "corporation", "pt", "cv", "bisnis besar", "korporasi"], weight: 1 },
];

export function inferTypeFromDescription(desc: string): InferenceResult {
  const s = (desc || "").toLowerCase().trim();
  if (!s || s.split(/\s+/).length < 3) {
    // Empty or too short to infer confidently
    return { confidence: "low" };
  }

  const typeScores: Record<string, { totalWeight: number; matchedSubTypes: Set<string> }> = {};
  let bestSubType: { type: string; subType: string; weight: number } | null = null;

  for (const hint of DESC_HINTS) {
    if (hint.keywords.some(k => s.includes(k))) {
      if (!typeScores[hint.type]) typeScores[hint.type] = { totalWeight: 0, matchedSubTypes: new Set() };
      typeScores[hint.type].totalWeight += hint.weight;
      if (hint.subType) typeScores[hint.type].matchedSubTypes.add(hint.subType);
      if (!bestSubType || hint.weight > bestSubType.weight) {
        bestSubType = { type: hint.type, subType: hint.subType!, weight: hint.weight };
      }
    }
  }

  // Broader type-only keywords (lower weight)
  for (const hint of DESC_TYPE_HINTS) {
    if (hint.keywords.some(k => s.includes(k))) {
      if (!typeScores[hint.type]) typeScores[hint.type] = { totalWeight: 0, matchedSubTypes: new Set() };
      typeScores[hint.type].totalWeight += hint.weight;
    }
  }

  const sortedTypes = Object.entries(typeScores).sort((a, b) => b[1].totalWeight - a[1].totalWeight);

  if (sortedTypes.length === 0) {
    return { confidence: "low" };
  }

  const topType = sortedTypes[0][0];
  const topScore = sortedTypes[0][1];
  const nextScore = sortedTypes[1]?.[1].totalWeight ?? 0;

  // Confidence determination
  const hasStrongSubType = bestSubType !== null && bestSubType.type === topType && topScore.totalWeight >= 3;
  const hasTypeClarity = topScore.totalWeight >= 2;
  const hasConflictingTypes = sortedTypes.length > 1 && (topScore.totalWeight - nextScore) <= 1;

  if (hasStrongSubType && !hasConflictingTypes) {
    return {
      type: topType,
      subType: bestSubType!.subType,
      confidence: "high",
    };
  }

  if (hasTypeClarity) {
    return {
      type: topType,
      confidence: "medium",
    };
  }

  return { confidence: "low" };
}
