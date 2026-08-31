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

export const BUSINESS_TEMPLATE_POOLS: Record<string, string[]> = {
  kuliner:  ["TEMPLATE_KULINER01", "TEMPLATE_COLORFUL", "TEMPLATE_NATURAL", "TEMPLATE_ELEGANT", "TEMPLATE_RETRO", "TEMPLATE_BOLD"],
  jasa:     ["TEMPLATE_JASA02", "TEMPLATE_MINIMALIST", "TEMPLATE_DYNAMIC", "TEMPLATE_ELEGANT", "TEMPLATE_BOLD"],
  produk:   ["TEMPLATE_PRODUK03", "TEMPLATE_COLORFUL", "TEMPLATE_DYNAMIC", "TEMPLATE_NATURAL", "TEMPLATE_MINIMALIST"],
  properti: ["TEMPLATE_JASA02", "TEMPLATE_ELEGANT", "TEMPLATE_MINIMALIST", "TEMPLATE_NATURAL"],
  retro:    ["TEMPLATE_RETRO", "TEMPLATE_BOLD", "TEMPLATE_NATURAL"],
  futuristic: ["TEMPLATE_FUTURISTIC", "TEMPLATE_DYNAMIC", "TEMPLATE_MINIMALIST", "TEMPLATE_BOLD"],
};

// selectTemplate is only called as a last-resort fallback in handleGoToEditor
// when the user navigates to the editor without having run a generation (no previewData).
// In the normal flow the backend always provides template_id via the SSE done event,
// so returning TEMPLATE_DYNAMIC here is safe and keeps this path simple.
export function selectTemplate(_businessType: string): string {
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
    case "mood": return 55;
    case "done": return 100;
    default: return 100;
  }
}

export function getStageNumber(chatStage: string): number {
  switch (chatStage) {
    case "name": return 1;
    case "description": return 2;
    case "type": return 3;
    case "mood": return 4;
    case "done": return 4;
    default: return 1;
  }
}

export const MOOD_TEMPLATE_POOLS: Record<string, string[]> = {
  "elegan":      ["TEMPLATE_ELEGANT", "TEMPLATE_MINIMALIST", "TEMPLATE_NATURAL", "TEMPLATE_DYNAMIC"],
  "natural":     ["TEMPLATE_NATURAL", "TEMPLATE_KULINER01", "TEMPLATE_COLORFUL", "TEMPLATE_ELEGANT"],
  "fun":         ["TEMPLATE_COLORFUL", "TEMPLATE_KULINER01", "TEMPLATE_PRODUK03", "TEMPLATE_BOLD", "TEMPLATE_DYNAMIC"],
  "bold":        ["TEMPLATE_BOLD", "TEMPLATE_FUTURISTIC", "TEMPLATE_JASA02", "TEMPLATE_DYNAMIC"],
  "modern":      ["TEMPLATE_MINIMALIST", "TEMPLATE_ELEGANT", "TEMPLATE_FUTURISTIC", "TEMPLATE_DYNAMIC"],
  "profesional": ["TEMPLATE_JASA02", "TEMPLATE_PRODUK03", "TEMPLATE_MINIMALIST", "TEMPLATE_ELEGANT"],
  "retro":       ["TEMPLATE_RETRO", "TEMPLATE_BOLD", "TEMPLATE_NATURAL"],
  "futuristic":  ["TEMPLATE_FUTURISTIC", "TEMPLATE_MINIMALIST", "TEMPLATE_BOLD", "TEMPLATE_DYNAMIC"],
};

function filterPoolByBusiness(pool: string[], businessLower: string): string[] {
  const kulinerTypes = ["kafe", "cafe", "kopi", "restoran", "warung", "bakery", "catering", "kuliner"];
  const jasaTypes = ["jasa", "konsultan", "agensi", "fotografer", "klinik", "dokter"];
  const produkTypes = ["produk", "toko", "retail", "fashion", "umkm", "online", "baju", "sepatu", "hijab"];
  const techTypes = ["tech", "teknologi", "saas", "software", "ai", "digital", "startup", "robot"];
  const creativeTypes = ["kreatif", "art", "seni", "musik", "film", "studio", "vintage", "retro"];

  let preferred = "";
  if (kulinerTypes.some((kw) => businessLower.includes(kw))) {
    preferred = "TEMPLATE_KULINER01";
  } else if (jasaTypes.some((kw) => businessLower.includes(kw))) {
    preferred = "TEMPLATE_JASA02";
  } else if (produkTypes.some((kw) => businessLower.includes(kw))) {
    preferred = "TEMPLATE_PRODUK03";
  } else if (techTypes.some((kw) => businessLower.includes(kw))) {
    preferred = "TEMPLATE_FUTURISTIC";
  } else if (creativeTypes.some((kw) => businessLower.includes(kw))) {
    preferred = "TEMPLATE_RETRO";
  }

  if (!preferred) {
    return pool;
  }

  const reordered: string[] = [];
  for (const t of pool) {
    if (t === preferred) {
      reordered.unshift(t);
    } else {
      reordered.push(t);
    }
  }
  return reordered;
}

// Maps mood slugs to pool keys — avoids substring collisions (e.g. "modern & minimalis"
// matching "modern" instead of "profesional").
const MOOD_SLUG_TO_POOL_KEY: Record<string, string> = {
  "clean-modern": "profesional",
  "dark-premium": "elegan",
  "bold-vibrant": "fun",
  "bold-dark":    "bold",
  "warm-earthy":  "natural",
  "retro":        "retro",
  "futuristic":   "futuristic",
};

function normalizeMoodSlug(mood: string): string {
  const map: Record<string, string> = {
    "modern & minimalis": "clean-modern",
    "modern minimalis":   "clean-modern",
    "modern & bersih":    "clean-modern",
    "modern bersih":      "clean-modern",
    "minimalis":          "clean-modern",
    "profesional":        "clean-modern",
    "bersih & modern":    "clean-modern",
    "natural & hangat":   "warm-earthy",
    "natural hangat":     "warm-earthy",
    "hangat & alami":     "warm-earthy",
    "hangat alami":       "warm-earthy",
    "elegan & mewah":     "dark-premium",
    "elegan mewah":       "dark-premium",
    "fun & colorful":     "bold-vibrant",
    "fun colorful":       "bold-vibrant",
    "ceria & berwarna":   "bold-vibrant",
    "ceria berwarna":     "bold-vibrant",
    "bold & tegas":       "bold-dark",
    "bold tegas":         "bold-dark",
    "tegas & berenergi":  "bold-dark",
    "tegas berenergi":    "bold-dark",
    "retro & vintage":    "retro",
    "retro vintage":      "retro",
    "klasik & retro":     "retro",
    "klasik retro":       "retro",
    "futuristic & tech":  "futuristic",
    "futuristic tech":    "futuristic",
    "futuristik & modern": "futuristic",
    "futuristik modern":  "futuristic",
  };
  return map[mood.toLowerCase().trim()] || mood;
}

export function getTemplatePool(businessType: string, mood: string): string[] {
  const lower = businessType.toLowerCase();

  // 1. Try slug-based pool lookup (most reliable, avoids substring collisions)
  const slug = normalizeMoodSlug(mood);
  const poolKey = MOOD_SLUG_TO_POOL_KEY[slug];
  if (poolKey) {
    const pool = MOOD_TEMPLATE_POOLS[poolKey];
    if (pool) {
      return filterPoolByBusiness(pool, lower);
    }
  }

  // 2. Fallback: substring match (for backward compatibility with any edge cases)
  const lm = mood.toLowerCase();
  for (const [key, pool] of Object.entries(MOOD_TEMPLATE_POOLS)) {
    if (lm.includes(key)) {
      return filterPoolByBusiness(pool, lower);
    }
  }

  // 2. Business type pool (mood neutral / profesional)
  if (lower.includes("kafe") || lower.includes("cafe") || lower.includes("kopi") ||
    lower.includes("restoran") || lower.includes("warung") || lower.includes("bakery") ||
    lower.includes("catering") || lower.includes("kuliner")) {
    return BUSINESS_TEMPLATE_POOLS.kuliner;
  }
  if (lower.includes("jasa") || lower.includes("konsultan") || lower.includes("agensi") ||
    lower.includes("fotografer") || lower.includes("klinik") || lower.includes("dokter")) {
    return BUSINESS_TEMPLATE_POOLS.jasa;
  }
  if (lower.includes("produk") || lower.includes("toko") || lower.includes("retail") ||
    lower.includes("fashion") || lower.includes("elektronik") || lower.includes("umkm") ||
    lower.includes("online") || lower.includes("minuman") || lower.includes("bubble") ||
    lower.includes("boba")) {
    return BUSINESS_TEMPLATE_POOLS.produk;
  }
  if (lower.includes("properti") || lower.includes("konstruksi") || lower.includes("hotel") ||
    lower.includes("travel") || lower.includes("pendidikan") || lower.includes("manufaktur")) {
    return BUSINESS_TEMPLATE_POOLS.properti;
  }
  if (lower.includes("retro") || lower.includes("vintage") || lower.includes("klasik")) {
    return BUSINESS_TEMPLATE_POOLS.retro;
  }
  if (lower.includes("futuristik") || lower.includes("tech") || lower.includes("teknologi") ||
    lower.includes("cyber") || lower.includes("modern")) {
    return BUSINESS_TEMPLATE_POOLS.futuristic;
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

// Escape regex special chars, then match as whole word (word boundary)
function matchesKeyword(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

// Suggest business type/subtype from name keywords. Uses NAME_TYPE_HINTS from constants.
import { NAME_TYPE_HINTS } from "./constants";
import type { InferenceResult } from "./types";

export function suggestTypeFromName(name: string): { type?: string; subType?: string } | null {
  const s = (name || "").toLowerCase();
  if (!s) return null;
  for (const key of Object.keys(NAME_TYPE_HINTS)) {
    if (matchesKeyword(s, key)) return NAME_TYPE_HINTS[key];
  }
  return null;
}

/**
 * [STEP 1: AUTO-GENERATE DESCRIPTION FROM DESCRIPTIVE NAME]
 * Auto-generates a rich, contextual business description from a descriptive business name
 * when the user skips or provides an empty description.
 *
 * Example:
 * - "Kafe Kopi Kenangan Jogja" -> "Menyajikan aneka sajian kopi spesial pilihan..."
 * - "Bengkel Mobil Sentosa"    -> "Melayani jasa perawatan berkala, servis mesin..."
 */
export function generateDescriptionFromBusinessName(
  businessName: string,
  hint?: { type?: string; subType?: string } | null,
  locale: string = "id"
): string {
  const name = businessName.trim();
  if (!name) return locale === "en" ? "High quality products and services." : "Produk dan layanan berkualitas terpercaya.";

  const subType = hint?.subType;
  const isEn = locale === "en";

  if (isEn) {
    switch (subType) {
      case "Kafe":
        return `Serving specialty coffee, delicious treats, and a cozy atmosphere at ${name}.`;
      case "Restoran & Warung Makan":
        return `Offering authentic, high-quality dishes and exceptional dining experiences at ${name}.`;
      case "Bakery & Pastry":
        return `Freshly baked artisanal breads, cakes, and pastries crafted daily at ${name}.`;
      case "Catering":
        return `Professional catering services for events, weddings, and special occasions by ${name}.`;
      case "Minuman & Bubble Tea":
        return `Refreshing drinks, specialty teas, and delicious beverages crafted by ${name}.`;
      case "Otomotif & Bengkel":
        return `Professional automotive repair, periodic maintenance, and vehicle services by ${name}.`;
      case "Rental Mobil & Kendaraan":
        return `Reliable vehicle rental and transport solutions with well-maintained fleet at ${name}.`;
      case "Hotel & Penginapan":
        return `Comfortable accommodations with modern amenities and scenic hospitality at ${name}.`;
      case "Travel & Wisata":
        return `Curated tour packages, travel planning, and unforgettable holiday experiences with ${name}.`;
      case "Klinik & Kesehatan":
        return `Trusted medical care, health consultations, and professional clinical services by ${name}.`;
      case "Salon & Kecantikan":
        return `Premium hair, skin, and beauty treatments tailored for your style at ${name}.`;
      case "Barbershop":
        return `Modern haircuts, precision styling, and gentleman grooming services at ${name}.`;
      case "Gym & Olahraga":
        return `Complete fitness facilities, workout equipment, and personal coaching at ${name}.`;
      case "Konten Kreator":
        return `Creating engaging digital content, entertaining videos, and impactful brand collaborations by ${name}.`;
      case "Fotografer":
        return `Capturing timeless moments with professional photography services by ${name}.`;
      case "Videografer":
        return `Cinematic video production, event coverage, and creative storytelling by ${name}.`;
      case "Desainer":
        return `Creative graphic design, branding, and visual identity solutions by ${name}.`;
      case "Developer & IT":
        return `Modern digital solutions, website creation, and software development by ${name}.`;
      case "Digital & Marketing Agency":
        return `Strategic digital marketing, social media campaigns, and brand growth solutions by ${name}.`;
      case "Laundry":
        return `Fast, clean, and fragrant laundry care with premium garment washing at ${name}.`;
      case "Jasa Rumah & Kebersihan":
        return `Professional home cleaning, repair, and property maintenance services by ${name}.`;
      default:
        return `Providing premium quality products and trusted professional services at ${name}.`;
    }
  }

  // Bahasa Indonesia
  switch (subType) {
    case "Kafe":
      return `Menyajikan aneka sajian kopi spesial pilihan, camilan lezat, dan tempat nongkrong nyaman bersama ${name}.`;
    case "Restoran & Warung Makan":
      return `Menyajikan aneka hidangan lezat dan berkualitas dengan cita rasa autentik khas ${name}.`;
    case "Bakery & Pastry":
      return `Memproduksi aneka roti, kue, dan pastry lezat segar setiap hari bersama ${name}.`;
    case "Catering":
      return `Melayani jasa katering prasmanan, nasi kotak, dan paket acara berkualitas bersama ${name}.`;
    case "Minuman & Bubble Tea":
      return `Menyajikan aneka minuman segar kekinian dengan aneka pilihan rasa favorit di ${name}.`;
    case "Otomotif & Bengkel":
      return `Melayani jasa perawatan berkala, servis mesin, dan perbaikan kendaraan terpercaya di ${name}.`;
    case "Rental Mobil & Kendaraan":
      return `Jasa rental dan sewa kendaraan terpercaya dengan armada bersih, nyaman, dan harga terjangkau di ${name}.`;
    case "Hotel & Penginapan":
      return `Penginapan nyaman dengan fasilitas lengkap, pelayanan ramah, dan lokasi strategis di ${name}.`;
    case "Travel & Wisata":
      return `Penyedia paket wisata menarik, open trip, dan perjalanan liburan seru terpercaya bersama ${name}.`;
    case "Klinik & Kesehatan":
      return `Layanan kesehatan terpercaya dengan tenaga medis profesional dan fasilitas modern di ${name}.`;
    case "Salon & Kecantikan":
      return `Layanan perawatan rambut, wajah, dan kecantikan profesional untuk penampilan terbaik Anda di ${name}.`;
    case "Barbershop":
      return `Potong rambut pria kekinian, grooming, dan styling profesional dengan suasana nyaman di ${name}.`;
    case "Gym & Olahraga":
      return `Pusat kebugaran lengkap dengan peralatan modern dan bimbingan instruktur profesional di ${name}.`;
    case "Konten Kreator":
      return `Membuat konten digital kreatif, video edukasi & hiburan, serta kolaborasi promosi brand bersama ${name}.`;
    case "Fotografer":
      return `Jasa fotografi profesional untuk mengabadikan momen berharga, wedding, wisuda, dan produk bersama ${name}.`;
    case "Videografer":
      return `Produksi video sinematik, liputan acara, dan konten visual kreatif profesional bersama ${name}.`;
    case "Desainer":
      return `Layanan desain grafis, pembuatan logo, dan identitas visual kreatif untuk brand Anda di ${name}.`;
    case "Developer & IT":
      return `Solusi teknologi digital, pembuatan website, dan pengembangan aplikasi profesional bersama ${name}.`;
    case "Digital & Marketing Agency":
      return `Layanan digital marketing, optimasi media sosial, dan strategi promosi bisnis terpercaya bersama ${name}.`;
    case "Laundry":
      return `Jasa laundry cepat, bersih, wangi, dan higienis dengan perawatan pakaian terbaik di ${name}.`;
    case "Jasa Rumah & Kebersihan":
      return `Layanan kebersihan rumah, kantor, dan perawatan fasilitas profesional terpercaya bersama ${name}.`;
    default:
      return `Menyediakan produk dan layanan berkualitas tinggi yang terpercaya untuk pelanggan setia ${name}.`;
  }
}

/**
 * [STEP 3: DYNAMIC PLACEHOLDER BASED ON DETECTED BUSINESS TYPE]
 * Returns a contextual chat input placeholder based on the inferred business type.
 */
export function getDynamicDescriptionPlaceholder(
  hint?: { type?: string; subType?: string } | null,
  locale: string = "id"
): string {
  const isEn = locale === "en";
  const subType = hint?.subType;

  if (isEn) {
    switch (subType) {
      case "Kafe":
        return "Example: Specialty pour-over coffee, iced latte, pastries, cozy seating (Press Enter to skip)";
      case "Restoran & Warung Makan":
        return "Example: Authentic family recipes, grilled dishes, dine-in & takeaway (Press Enter to skip)";
      case "Otomotif & Bengkel":
        return "Example: Periodic engine tune-up, oil change, 24-hour emergency service (Press Enter to skip)";
      case "Rental Mobil & Kendaraan":
        return "Example: Self-drive or with chauffeur, daily & monthly car rental (Press Enter to skip)";
      case "Fotografer":
        return "Example: Wedding & pre-wedding photo sessions, graduation, studio portraits (Press Enter to skip)";
      case "Klinik & Kesehatan":
        return "Example: General dental check-up, teeth scaling, aesthetic orthodontic care (Press Enter to skip)";
      case "Laundry":
        return "Example: Kiloan wash, 3-hour express service, free pickup and delivery (Press Enter to skip)";
      default:
        return "Tell us briefly about your business (Press Enter to skip)...";
    }
  }

  switch (subType) {
    case "Kafe":
      return "Contoh: Jual aneka kopi manual brew, espresso, tempat nongkrong asik (Tekan Enter untuk lewati)";
    case "Restoran & Warung Makan":
      return "Contoh: Menu masakan khas Nusantara, paket hemat makan siang, melayani delivery (Tekan Enter untuk lewati)";
    case "Otomotif & Bengkel":
      return "Contoh: Melayani servis rutin, ganti oli, tune up mesin, dan panggilan darurat (Tekan Enter untuk lewati)";
    case "Rental Mobil & Kendaraan":
      return "Contoh: Sewa mobil lepas kunci atau dengan sopir, harian/bulanan murah (Tekan Enter untuk lewati)";
    case "Fotografer":
      return "Contoh: Jasa foto pernikahan, prewedding, wisuda, dan foto katalog produk (Tekan Enter untuk lewati)";
    case "Klinik & Kesehatan":
      return "Contoh: Melayani pemeriksaan gigi umum, scaling, behel, dan perawatan estetik (Tekan Enter untuk lewati)";
    case "Laundry":
      return "Contoh: Cuci komplit kiloan, express 3 jam, dan gratis antar jemput (Tekan Enter untuk lewati)";
    default:
      return "Contoh: Jual kopi spesial di Jogja, melayani pesanan partai besar (Tekan Enter untuk lewati)";
  }
}

interface DescHintEntry {
  type: string;
  subType?: string;
  keywords: string[];
  weight: number;
}

const DESC_HINTS: DescHintEntry[] = [
  // ── KULINER / FOOD & BEVERAGE ──
  {
    type: "Kuliner",
    subType: "Kafe",
    keywords: [
      // ID
      "kopi", "kafe", "ngopi", "kedai kopi", "kopi susu",
      // EN
      "coffee", "cafe", "coffeeshop", "roastery", "roasting", "espresso", "latte", "cappuccino", "cold brew", "brew", "manual brew",
      "coffee shop", "coffee house", "coffee bar", "coffee stand",
    ],
    weight: 3,
  },
  {
    type: "Kuliner",
    subType: "Restoran & Warung Makan",
    keywords: [
      // ID
      "restoran", "resto", "warung", "warung makan", "rumah makan", "warteg", "nasi padang", "soto", "bakso", "mie ayam", "sate",
      "ayam goreng", "ayam bakar", "ayam geprek", "seafood bakar", "pecel", "seblak", "martabak", "gorengan", "angkringan",
      "kedai makan", "masakan", "nasi", "lauk", "makanan", "makanan khas", "olahan makanan", "kulineran", "f&b", "dapur",
      // EN
      "restaurant", "eatery", "diner", "bistro", "food stall", "food court", "fast food", "street food", "meal", "dining",
      "fine dining", "chef", "menu", "steak house", "steakhouse", "pizza", "burger", "dimsum", "ramen", "sushi", "noodles",
    ],
    weight: 3,
  },
  {
    type: "Kuliner",
    subType: "Bakery & Pastry",
    keywords: [
      // ID
      "roti", "bakery", "kue", "pastry", "kue kering", "donat", "brownies", "tart", "bolu", "toko roti", "roti bakar", "puding",
      // EN
      "cake", "baking", "cookies", "croissant", "dessert", "bread", "pastries", "cupcake", "muffin", "doughnut", "confectionery",
    ],
    weight: 3,
  },
  {
    type: "Kuliner",
    subType: "Catering",
    keywords: [
      // ID
      "catering", "katering", "prasmanan", "nasi kotak", "nasi box", "tumpeng", "aqiqah", "snack box",
      "catering harian", "catering diet", "catering wedding", "pesanan makanan", "nasi bungkus",
      // EN
      "catering service", "meal prep", "meal delivery", "food delivery", "box meal", "buffet service", "event catering",
    ],
    weight: 3,
  },
  {
    type: "Kuliner",
    subType: "Minuman & Bubble Tea",
    keywords: [
      // ID
      "minuman", "bubble", "boba", "es teh", "jus", "minuman kekinian", "kedai es", "minuman segar", "kedai teh",
      // EN
      "juice", "smoothie", "thai tea", "milk tea", "bubble tea", "boba tea", "gelato", "ice cream", "shaken", "beverage",
      "drinks", "lemonade", "tea shop", "juice bar", "smoothie bar",
    ],
    weight: 3,
  },
  {
    type: "Kuliner",
    subType: "Makanan Rumahan & Frozen Food",
    keywords: [
      // ID
      "makanan rumahan", "masakan rumah", "dapur rumahan", "lauk pauk", "sambal kemasan", "cloud kitchen",
      "ghost kitchen", "cemilan", "snack kiloan", "jastip makanan", "catering rumahan", "meal prep",
      // EN
      "home cooked", "homemade food", "packaged meals", "ready to eat", "meal packs",
    ],
    weight: 4,
  },
  {
    type: "Kuliner",
    subType: "Frozen Food Homemade",
    keywords: [
      // ID
      "frozen food", "makanan beku", "nugget homemade", "dimsum beku", "siomay beku", "bakso beku", "risol beku", "empanada beku", "frozen",
      // EN
      "frozen food", "frozen meals", "frozen snacks",
    ],
    weight: 4,
  },
  {
    type: "Kuliner",
    subType: "Kuliner Kaki Lima & Angkringan",
    keywords: [
      // ID
      "angkringan", "kaki lima", "street food", "nasi kucing", "wedangan", "sate taichan", "taichan", "seblak", "lesehan", "gerobak", "street food jogja",
      // EN
      "street food", "food stall", "night market food",
    ],
    weight: 4,
  },
  {
    type: "Kuliner",
    subType: "Jajanan Pasar & Kuliner Tradisional",
    keywords: [
      // ID
      "jajanan pasar", "kuliner tradisional", "kue basah", "jenang", "lupis", "getuk", "lemper", "cenil", "klepon", "snack box kue", "kue tradisional", "pasaran",
      // EN
      "traditional snacks", "traditional delicacies", "market snacks",
    ],
    weight: 4,
  },
  {
    type: "Kuliner",
    subType: "Herbal & Jamu",
    keywords: [
      // ID
      "jamu", "herbal", "madu", "madu murni", "suplemen herbal", "minuman herbal", "jamu tradisional", "empon-empon",
      "kunyit asam", "beras kencur", "propolis", "habbatussauda", "rempah",
      // EN
      "herbal", "herbs", "honey", "raw honey", "natural supplements", "herbal drinks", "traditional herbal",
    ],
    weight: 4,
  },

  // ── TOKO & UMKM / RETAIL & SMALL BUSINESS ──
  {
    type: "Toko",
    subType: "Fashion & Pakaian",
    keywords: [
      // ID
      "pakaian", "baju", "sepatu", "sandal", "batik", "distro", "konveksi", "jahit", "kain", "busana", "gamis", "hijab",
      "jilbab", "kerudung", "mukena", "kaos", "kemeja", "celana", "jaket", "hoodie", "tas", "dompet", "aksesoris fashion",
      "busana muslim", "butik", "penjahit", "sablon", "bordir", "sepatu kulit", "jam tangan",
      // EN
      "fashion", "clothing", "apparel", "shoe", "shoes", "sneakers", "outfit", "t-shirt", "tshirt", "tailor", "boutique",
      "wardrobe", "garment", "accessories", "wearable", "streetwear",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Elektronik",
    keywords: [
      // ID
      "elektronik", "handphone", "hp", "laptop", "komputer", "aksesoris hp", "pulsa", "lampu", "cctv", "printer",
      "speaker", "kamera", "sparepart hp", "case hp", "toko hp", "toko komputer", "pc gaming",
      // EN
      "gadget", "electronics", "phone", "mobile", "computer", "audio", "camera", "tech accessories", "gaming", "tablet",
      "earphones", "headphones", "charger", "powerbank",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Kecantikan & Kosmetik",
    keywords: [
      // ID
      "kosmetik", "skincare", "parfum", "makeup", "toko kosmetik", "toko skincare", "perawatan wajah", "lipstik",
      "body lotion", "sunscreen", "serum wajah", "parfum refill", "wewangian", "toko kecantikan",
      // EN
      "cosmetics", "skincare store", "perfume", "fragrance", "beauty products", "makeup store", "beauty shop",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Produk Lokal Handmade",
    keywords: [
      // ID
      "kerajinan", "souvenir", "oleh-oleh", "kriya", "tenun", "anyam", "produk lokal", "kerajinan tangan",
      "gerabah", "rotan", "kulit handmade", "cendera mata", "batik tulis", "ukiran",
      // EN
      "handmade", "craft", "artisan", "local craft", "handicraft", "pottery", "weaving", "handcrafted",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Toko Online",
    keywords: [
      // ID
      "toko online", "olshop", "jual beli", "reseller", "dropship", "grosir online", "jualan online", "katalog produk",
      // EN
      "online shop", "online store", "e-commerce", "ecommerce", "shop", "marketplace", "dropshipping", "wholesale online",
      "sell online", "product catalog", "webstore",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Minimarket & Sembako",
    keywords: [
      // ID
      "minimarket", "sembako", "kelontong", "toko kelontong", "bahan pokok", "toko sembako", "warung sembako", "kebutuhan harian",
      "beras", "minyak goreng", "gula", "toko kelontong modern",
      // EN
      "grocery", "grocery store", "convenience store", "supermarket", "general store", "daily needs",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Perabot & Furnitur",
    keywords: [
      // ID
      "furnitur", "perabot", "meja", "kursi", "lemari", "kasur", "dekorasi", "mebel", "sofa", "tempat tidur", "rak", "gorden", "sprei", "karpet", "kayu jati",
      // EN
      "furniture", "interior", "home decor", "home furnishing", "kitchen set", "mattress", "couch", "shelf", "curtain", "carpet",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Otomotif & Sparepart",
    keywords: [
      // ID
      "toko ban", "sparepart", "sukucadang", "sparepart motor", "sparepart mobil", "variasi motor", "aksesoris mobil",
      "oli motor", "oli mobil", "aki motor", "aki mobil", "helm", "velg", "knalpot", "audio mobil",
      // EN
      "auto parts", "spare parts", "car accessories", "motorcycle parts", "tires", "car battery", "engine oil",
    ],
    weight: 3,
  },
  {
    type: "Toko",
    subType: "Pertanian & Peternakan",
    keywords: [
      // ID
      "pakan ternak", "bibit tanaman", "pupuk", "bibit ikan", "toko tani", "pertanian", "peternakan", "unggas", "ayam potong",
      "ikan hias", "aquarium", "pakan burung", "alat pertanian", "hidroponik", "hasil tani", "agribisnis umkm",
      // EN
      "agriculture supply", "farming store", "animal feed", "seeds", "fertilizer", "poultry supply", "farm shop",
    ],
    weight: 3,
  },

  // ── LAYANAN & RESERVASI / SERVICE & BOOKING ──
  {
    type: "Layanan & Reservasi",
    subType: "Rental Mobil & Kendaraan",
    keywords: [
      // ID
      "rental mobil", "sewa mobil", "rental motor", "sewa motor", "rental kendaraan", "sewa bus", "elf pariwisata",
      "antar jemput bandara", "drop bandara", "sewa supir", "driver lepas kunci", "sewa truk", "car rental indonesia",
      // EN
      "car rental", "vehicle rental", "motorcycle rental", "bike rental", "car hire", "airport transfer", "van rental",
    ],
    weight: 4,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Travel & Wisata",
    keywords: [
      // ID
      "wisata", "liburan", "paket wisata", "tiket", "pariwisata", "jalan-jalan", "opentrip", "umroh", "haji", "tour travel",
      "biro perjalanan", "guide wisata", "destinasi wisata", "trip pulau",
      // EN
      "travel", "tour", "tourism", "holiday", "vacation", "trip", "adventure", "travel agency", "tour guide",
      "backpacker", "pilgrimage",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Hotel & Penginapan",
    keywords: [
      // ID
      "penginapan", "villa", "pondok wisata", "glamping", "losmen", "kost", "homestay", "resort",
      // EN
      "hotel", "guest house", "guesthouse", "homestay", "resort", "lodge", "hostel", "inn", "bed and breakfast",
      "accommodation", "stay", "room rental",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Salon & Kecantikan",
    keywords: [
      // ID
      "salon", "kecantikan", "rias", "spa", "manicure", "pedicure", "perawatan wajah", "facial", "creambath",
      "nail art", "eyelash", "mua", "rias pengantin", "pijat", "massage", "refleksi",
      // EN
      "beauty", "beauty salon", "hair salon", "makeup", "massage", "reflexology", "nail salon", "waxing", "threading",
      "aesthetic clinic", "beauty treatment", "lash extension", "brow",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Barbershop",
    keywords: [
      // ID
      "barber", "barbershop", "pangkas rambut", "cukur", "potong rambut", "cukur rambut",
      // EN
      "haircut", "hair cut", "fade", "beard", "grooming", "men grooming", "men haircut",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Laundry",
    keywords: [
      // ID
      "laundry", "cuci", "setrika", "laundry kiloan", "binatu", "cuci sepatu", "cuci karpet", "cuci helm", "cuci sofa", "dry clean",
      // EN
      "dry clean", "dry cleaning", "washing service", "laundry service", "ironing",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Otomotif & Bengkel",
    keywords: [
      // ID
      "bengkel", "servis mobil", "servis motor", "tambal ban", "cuci motor", "cuci mobil", "spooring", "ganti oli",
      "salon mobil", "body repair", "cat mobil", "tune up", "servis ac mobil", "bengkel resmi",
      // EN
      "car wash", "auto repair", "car repair", "auto shop", "mechanic", "detailing", "car service", "oil change",
      "tire repair", "automotive repair", "vehicle service", "motorcycle repair",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Klinik & Kesehatan",
    keywords: [
      // ID
      "klinik", "dokter", "kesehatan", "medis", "rumah sakit", "puskesmas", "bidan", "perawat", "poli", "dokter gigi",
      "apotek", "fisioterapi", "akupunktur", "terapi", "laboratorium", "optik", "psikolog", "konseling",
      // EN
      "clinic", "doctor", "health", "medical", "hospital", "dental", "dentist", "pharmacy", "physiotherapy", "acupuncture",
      "therapy", "psychologist", "counseling", "optician", "healthcare",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Gym & Olahraga",
    keywords: [
      // ID
      "gym", "fitness", "fitness center", "studio yoga", "pilates", "senam", "zumba", "lapangan futsal",
      "lapangan badminton", "kolam renang", "martial arts", "muay thai", "boxing", "personal trainer",
      // EN
      "gym", "fitness", "workout", "yoga studio", "pilates", "sports center", "futsal court", "badminton court", "swimming pool",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Event & Wedding Organizer",
    keywords: [
      // ID
      "wedding organizer", "event organizer", "acara", "resepsi", "sewa tenda", "dekorasi pernikahan", "sound system", "mc pernikahan", "paket nikah",
      // EN
      "event planner", "event planning", "party planner", "wedding planner", "wedding", "event", "party",
      "decoration", "tent rental", "venue", "entertainment organizer",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Jasa Rumah & Kebersihan",
    keywords: [
      // ID
      "cleaning service", "cuci ac", "servis ac", "sedot wc", "jasa bersih", "bersih rumah", "pest control", "anti rayap",
      "tukang ledeng", "tukang listrik", "renovasi rumah kecil", "jasa taman",
      // EN
      "cleaning service", "home cleaning", "ac repair", "plumbing", "electrician", "pest control", "handyman", "gardening service",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Pendidikan & Kursus",
    keywords: [
      // ID
      "kursus", "bimbingan belajar", "bimbel", "les", "privat", "les privat", "kursus bahasa", "kursus mengemudi",
      "kursus musik", "kursus renang", "kursus coding", "daycare", "paud", "pelatihan kerja",
      // EN
      "course", "tutoring", "tutor", "learning center", "training center", "music lesson", "language course", "driving school",
    ],
    weight: 3,
  },
  {
    type: "Layanan & Reservasi",
    subType: "Biro Jasa & Perizinan",
    keywords: [
      // ID
      "biro jasa", "pbg", "persetujuan bangunan gedung", "imb", "simbg", "izin bangunan", "izin mendirikan bangunan",
      "jasa pengurusan", "pengurusan pbg", "pengurusan izin", "izin usaha", "perizinan", "perijinan", "legalitas usaha",
      "stnk", "bpkb", "samsat", "perpanjangan stnk", "paspor", "nib", "oss", "sertifikat tanah", "urus izin", "urus surat", "balik nama",
      // EN
      "permits", "licensing", "permit agency", "building permit", "document service", "license consultant",
    ],
    weight: 5,
  },

  // ── KREATIF & PROFESIONAL ──
  {
    type: "Kreatif & Profesional",
    subType: "Konsultan",
    keywords: [
      // ID
      "konsultan", "konsultasi", "pembinaan", "pelatihan", "pajak", "akuntansi", "keuangan", "bisnis konsultan", "audit", "konsultan it", "konsultan hukum", "penasehat bisnis",
      // EN
      "consultant", "consulting", "advisor", "advisory", "coaching", "mentor", "mentoring", "training", "legal", "accounting",
      "finance", "tax", "business consulting", "management consulting", "it consulting",
    ],
    weight: 4,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Notaris & PPAT",
    keywords: [
      // ID
      "notaris", "ppat", "pejabat pembuat akta tanah", "akta notaris", "akta tanah", "akta jual beli", "ajb", "hibah tanah",
      "hak tanggungan", "kantor notaris", "kantor ppat", "kantor hukum", "advokat", "pengacara", "legalitas hukum", "perjanjian legal", "legalisasi",
      // EN
      "notary", "land deeds", "law firm", "attorney", "lawyer", "legal counsel", "deed",
    ],
    weight: 5,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Konten Kreator",
    keywords: [
      // ID
      "konten kreator", "kreator konten", "creator", "content creator", "influencer",
      "youtuber", "tiktoker", "streamer", "vlogger", "selebgram", "endorsement", "endorse",
      "ugc", "ugc creator", "reels", "shorts", "affiliate", "kolaborasi brand",
      // EN
      "content creator", "influencer", "youtuber", "tiktoker", "streamer", "vlogger",
      "ugc creator", "digital creator", "social media creator",
    ],
    weight: 5,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Fotografer",
    keywords: [
      // ID
      "fotografer", "foto", "studio foto", "prewedding", "foto produk", "foto wisuda", "foto maternity",
      // EN
      "photography", "photo", "photographer", "photo studio", "wedding photography", "product photography",
      "portrait", "shoot", "photoshoot", "camera",
    ],
    weight: 4,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Videografer",
    keywords: [
      // ID
      "videografer", "videografi", "sinematik", "video klip", "dokumentasi video", "company video",
      // EN
      "videographer", "video", "cinematic", "videography", "video production", "film", "filming",
      "drone", "video shooting", "short film", "commercial video",
    ],
    weight: 4,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Desainer",
    keywords: [
      // ID — hanya visual/graphic designer, bukan web developer
      "desainer", "desain grafis", "ui/ux", "ui ux", "illustrator", "ilustrasi",
      "logo maker", "desain logo", "3d artist", "animator", "freelance desainer",
      "desainer grafis", "motion graphic", "visual artist", "branding identity",
      "tipografi", "poster", "infografis", "packaging design",
      // EN
      "designer", "graphic design", "logo design", "ui design", "ux design",
      "visual design", "brand identity", "illustration", "motion design",
      "3d design", "animation", "typography", "print design", "digital art",
    ],
    weight: 4,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Developer & IT",
    keywords: [
      // ID — web/app developer, software house, IT services
      "pembuatan website", "jasa pembuatan website", "jasa website", "jasa web",
      "developer", "pengembang", "programmer", "software house", "software",
      "aplikasi", "jasa it", "jasa aplikasi", "coding", "pemrograman",
      "jasa coding", "web development", "mobile app", "fullstack", "backend", "frontend",
      "teknologi informasi", "sistem informasi", "it solution", "it consultant",
      // EN
      "website", "web", "web developer", "web development", "web design",
      "landing page", "software", "app development", "mobile app", "developer",
      "coding", "programming", "it services", "tech", "technology",
      "saas", "platform", "api", "database", "cloud", "devops",
    ],
    weight: 5,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Digital & Marketing Agency",
    keywords: [
      // ID
      "agensi", "iklan", "branding", "media sosial", "sosmed", "content writer", "kreatif", "jasa digital",
      // EN
      "agency", "marketing", "digital marketing", "social media", "social media agency", "content creator",
      "influencer", "seo", "ads", "advertising", "brand strategy", "growth hacking", "email marketing",
    ],
    weight: 4,
  },
  {
    type: "Kreatif & Profesional",
    subType: "Musisi & Entertainer",
    keywords: [
      // ID
      "musisi", "band", "penyanyi", "dj", "mc panggung", "entertainment", "akustik", "wedding band",
      "grup musik", "komposer", "rekaman", "studio musik", "stand up comedy",
      // EN
      "musician", "band", "singer", "dj", "host", "entertainer", "live music", "acoustic", "music production",
    ],
    weight: 4,
  },

  // ── COMPANY PROFILE / CORPORATE & INSTITUTION ──
  {
    type: "Company Profile",
    subType: "Properti & Real Estate",
    keywords: [
      // ID
      "properti", "rumah", "apartemen", "tanah", "perumahan", "agent properti", "jual rumah", "sewa rumah",
      "kontrakan", "kavling", "ruko", "villa properti", "developer properti",
      // EN
      "real estate", "property", "housing", "apartment", "house", "land", "rent", "lease", "realty", "condo", "commercial property",
    ],
    weight: 3,
  },
  {
    type: "Company Profile",
    subType: "Konstruksi & Kontraktor",
    keywords: [
      // ID
      "konstruksi", "kontraktor", "bangunan", "pembangunan", "arsitek", "desain interior", "renovasi", "bangun rumah",
      "baja ringan", "las", "kanopi", "tukang bangunan", "arsitektur", "general contractor",
      // EN
      "construction", "contractor", "building", "architecture", "interior design", "renovation", "civil", "structural",
    ],
    weight: 3,
  },
  {
    type: "Company Profile",
    subType: "Manufaktur & Pabrik",
    keywords: [
      // ID
      "manufaktur", "pabrik", "produksi", "industri", "fabrikasi", "perakitan", "pengolahan", "distributor", "supplier",
      "produsen", "percetakan", "cetak", "packaging", "kemasan industri",
      // EN
      "manufacturing", "factory", "production", "industrial", "fabrication", "assembly", "printing",
    ],
    weight: 3,
  },
  {
    type: "Company Profile",
    subType: "Logistik & Ekspedisi",
    keywords: [
      // ID
      "logistik", "ekspedisi", "cargo", "kargo", "pengiriman barang", "gudang", "pergudangan", "sewa truk",
      "kontainer", "freight forwarding", "distribusi barang", "supply chain",
      // EN
      "logistics", "cargo", "freight", "warehousing", "shipping", "distribution", "supply chain",
    ],
    weight: 3,
  },
  {
    type: "Company Profile",
    subType: "Yayasan & Organisasi Nonprofit",
    keywords: [
      // ID
      "yayasan", "organisasi", "donasi", "amal", "panti", "sosial", "komunitas", "lembaga", "lsm", "ormas", "lembaga zakat",
      // EN
      "nonprofit", "non-profit", "ngo", "foundation", "charity", "donation", "community", "association", "organization",
    ],
    weight: 3,
  },
  {
    type: "Company Profile",
    subType: "Institusi Pendidikan & Pesantren",
    keywords: [
      // ID
      "sekolah", "pesantren", "pondok pesantren", "universitas", "kampus", "institusi pendidikan", "yayasan pendidikan",
      "madrasah", "smk", "sma", "smp", "sd", "akademi",
      // EN
      "school", "university", "college", "boarding school", "educational institution", "academy", "campus",
    ],
    weight: 3,
  },
];

// Broader type-only keywords (weight 2 for general category signals)
const DESC_TYPE_HINTS: { type: string; keywords: string[]; weight: number }[] = [
  {
    type: "Kuliner",
    keywords: [
      // ID
      "kuliner", "makanan", "minuman", "makan", "minum", "jual makanan", "bisnis kuliner", "makanan ringan", "kulineran", "f&b", "resto", "kafe", "warung",
      // EN
      "food", "food business", "drink", "beverage", "eat", "foodie", "chef", "kitchen", "restaurant business",
    ],
    weight: 2,
  },
  {
    type: "Toko",
    keywords: [
      // ID
      "toko", "umkm", "jual", "dagang", "ritel", "eceran", "usaha kecil", "bisnis rumahan", "olshop", "jualan", "barang", "produk",
      // EN
      "store", "retail", "shop", "sell", "selling", "trade", "goods", "product", "small business", "home business",
    ],
    weight: 2,
  },
  {
    type: "Layanan & Reservasi",
    keywords: [
      // ID
      "layanan", "booking", "reservasi", "salon", "barber", "laundry", "bengkel", "klinik", "servis fisik", "pangkas", "rental", "sewa", "jasa",
      // EN
      "service", "appointment", "booking service", "repair", "cleaning", "grooming service", "rental",
    ],
    weight: 2,
  },
  {
    type: "Kreatif & Profesional",
    keywords: [
      // ID
      "portofolio", "kreator", "karya", "desain", "freelance", "kreatif", "fotografi", "videografi", "konsultan",
      "pembuatan website", "bikin website", "web", "software", "programmer", "it", "digital", "agensi",
      // EN
      "portfolio", "showcase", "creator", "creative", "agency", "professional services", "consulting", "freelancer",
    ],
    weight: 2,
  },
  {
    type: "Company Profile",
    keywords: [
      // ID
      "company profile", "perusahaan", "pt", "cv", "korporasi", "bisnis besar", "holding", "institusi", "lembaga", "yayasan", "kontraktor", "pabrik",
      // EN
      "company profile", "company", "corporation", "corporate", "enterprise", "institution", "firm", "business",
    ],
    weight: 2,
  },
];

export function inferTypeFromDescription(desc: string): InferenceResult {
  const s = (desc || "").toLowerCase().trim();
  if (!s || s.length < 3) {
    // Empty or too short to infer confidently
    return { confidence: "low" };
  }

  const typeScores: Record<string, { totalWeight: number; matchedSubTypes: Set<string> }> = {};

  for (const hint of DESC_HINTS) {
    if (hint.keywords.some(k => matchesKeyword(s, k))) {
      if (!typeScores[hint.type]) typeScores[hint.type] = { totalWeight: 0, matchedSubTypes: new Set() };
      typeScores[hint.type].totalWeight += hint.weight;
      if (hint.subType) typeScores[hint.type].matchedSubTypes.add(hint.subType);
    }
  }

  // Broader type-only keywords (lower weight)
  for (const hint of DESC_TYPE_HINTS) {
    if (hint.keywords.some(k => matchesKeyword(s, k))) {
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

  // After determining topType, find the best subType *within that type*:
  const bestSubTypeForTopType = DESC_HINTS
    .filter(h => h.type === topType && h.subType && h.keywords.some(k => matchesKeyword(s, k)))
    .sort((a, b) => b.weight - a.weight)[0];

  // Confidence determination
  const hasStrongSubType = bestSubTypeForTopType !== undefined && topScore.totalWeight >= 3;
  const hasTypeClarity = topScore.totalWeight >= 2;
  const hasConflictingTypes = sortedTypes.length > 1 && (topScore.totalWeight - nextScore) <= 1;

  if (hasStrongSubType && !hasConflictingTypes) {
    return {
      type: topType,
      subType: bestSubTypeForTopType.subType,
      confidence: "high",
    };
  }

  if (hasTypeClarity) {
    return {
      type: topType,
      subType: bestSubTypeForTopType?.subType,
      confidence: "medium",
    };
  }

  return { confidence: "low" };
}

// Indonesian city keywords for extracting location from free-text descriptions
const KNOWN_LOCATIONS = [
  "jogja", "yogyakarta", "jakarta", "jabodetabek", "bandung", "surabaya",
  "semarang", "medan", "makassar", "bali", "denpasar", "malang", "solo",
  "depok", "tangerang", "bekasi", "bogor", "palembang", "balikpapan",
  "pekanbaru", "batam", "manado", "padang", "aceh", "lampung",
  "banjarmasin", "pontianak", "jambi", "bengkulu", "kupang", "ambon",
  "samarinda", "mataram", "kendari", "palu", "gorontalo", "serang",
  "sukabumi", "tasikmalaya", "cirebon", "kediri", "madiun", "surakarta",
  "banyuwangi", "jember", "bondowoso", "probolinggo", "pasuruan",
  "majalengka", "subang", "karawang", "purwakarta", "indramayu",
  "cilacap", "banyumas", "purbalingga", "banjarnegara", "kebumen",
  "purworejo", "wonosobo", "magelang", "temanggung", "klaten",
  "sleman", "bantul", "gunung kidul", "kulon progo",
];

export function extractLocationFromDescription(description: string): string | null {
  const lower = (description || "").toLowerCase();
  for (const loc of KNOWN_LOCATIONS) {
    // Match only as a whole word (surrounded by non-letters)
    const re = new RegExp(`(?<![a-z])${loc.replace(/\s+/g, "\\s+")}(?![a-z])`);
    if (re.test(lower)) {
      return capitalizeWords(loc);
    }
  }
  return null;
}

const INSIGHT_POOL_ID: Record<string, string[]> = {
  Kuliner: [
    "Website dengan foto makanan berkualitas tinggi meningkatkan konversi 3x lebih besar.",
    "Menu digital interaktif membuat pelanggan 40% lebih mungkin memesan.",
    "Testimoni kuliner yang otentik meningkatkan kepercayaan pelanggan baru.",
    "Integrasi WhatsApp order memudahkan pelanggan pesan langsung.",
    "Tampilan mobile-friendly penting karena 70% pengguna kuliner dari smartphone.",
  ],
  Toko: [
    "Website dengan katalog produk rapi meningkatkan rata-rata belanja 2x lipat.",
    "Toko online dengan navigasi jelas punya bounce rate 25% lebih rendah.",
    "Foto produk profesional membuat tingkat klik naik hingga 50%.",
    "Deskripsi produk yang detail mengurangi pertanyaan berulang dari pembeli.",
    "Integrasi WhatsApp memudahkan pelanggan menanyakan stok barang.",
  ],
  "Toko & UMKM": [
    "Website dengan katalog produk rapi meningkatkan rata-rata belanja 2x lipat.",
    "Toko online dengan navigasi jelas punya bounce rate 25% lebih rendah.",
    "Foto produk profesional membuat tingkat klik naik hingga 50%.",
    "Deskripsi produk yang detail mengurangi pertanyaan berulang dari pembeli.",
    "Integrasi WhatsApp memudahkan pelanggan menanyakan stok barang.",
  ],
  "Layanan & Reservasi": [
    "Form booking & kontak yang simpel bikin calon pelanggan lebih cepat reservasi.",
    "Daftar layanan & harga yang jelas meningkatkan konversi pemesanan 2x lipat.",
    "Testimoni pelanggan nyata membuat calon klien lebih yakin untuk booking.",
    "Integrasi WhatsApp booking memudahkan pelanggan reservasi langsung.",
    "Tampilan mobile-friendly sangat penting karena mayoritas pelanggan booking lewat HP.",
  ],
  "Jasa & Booking": [
    "Form booking & kontak yang simpel bikin calon pelanggan lebih cepat reservasi.",
    "Daftar layanan & harga yang jelas meningkatkan konversi pemesanan 2x lipat.",
    "Testimoni pelanggan nyata membuat calon klien lebih yakin untuk booking.",
    "Integrasi WhatsApp booking memudahkan pelanggan reservasi langsung.",
    "Tampilan mobile-friendly sangat penting karena mayoritas pelanggan booking lewat HP.",
  ],
  "Kreatif & Profesional": [
    "Website dengan galeri portofolio berkualitas tinggi meningkatkan kepercayaan calon klien 3x.",
    "Studi kasus nyata lebih meyakinkan daripada sekadar daftar pengalaman kerja.",
    "Tampilan portofolio yang bersih dan rapi membuat karya Anda terlihat jauh lebih premium.",
    "Testimoni klien sebelumnya membuat calon klien baru mantap merekrut Anda.",
    "Call-to-action kontak yang jelas mempercepat calon klien menghubungi Anda untuk proyek baru.",
  ],
  "Portofolio & Kreator": [
    "Website dengan galeri portofolio berkualitas tinggi meningkatkan kepercayaan calon klien 3x.",
    "Studi kasus nyata lebih meyakinkan daripada sekadar daftar pengalaman kerja.",
    "Tampilan portofolio yang bersih dan rapi membuat karya Anda terlihat jauh lebih premium.",
    "Testimoni klien sebelumnya membuat calon klien baru mantap merekrut Anda.",
    "Call-to-action kontak yang jelas mempercepat calon klien menghubungi Anda untuk proyek baru.",
  ],
  "Company Profile": [
    "Website profesional mempercepat kepercayaan klien dan mitra bisnis.",
    "Profil perusahaan yang lengkap meningkatkan kredibilitas di mata calon klien.",
    "Halaman layanan yang terstruktur membantu klien memahami nilai bisnis Anda.",
    "Testimoni dan portofolio nyata memperkuat posisi bisnis di industri Anda.",
    "Website yang responsif membuat bisnis Anda terlihat profesional di semua perangkat.",
  ],
  Company: [
    "Website profesional mempercepat kepercayaan klien dan mitra bisnis.",
    "Profil perusahaan yang lengkap meningkatkan kredibilitas di mata calon klien.",
    "Halaman layanan yang terstruktur membantu klien memahami nilai bisnis Anda.",
    "Testimoni dan portofolio nyata memperkuat posisi bisnis di industri Anda.",
    "Website yang responsif membuat bisnis Anda terlihat profesional di semua perangkat.",
  ],
  Jasa: [
    "Website dengan portofolio & testimoni nyata meningkatkan kepercayaan calon klien.",
    "Harga transparan di website meningkatkan konversi klien jasa 2x lipat.",
    "Form kontak yang simpel bikin calon klien lebih mudah menghubungi Anda.",
    "Studi kasus konkret lebih meyakinkan daripada sekadar daftar layanan.",
    "Call-to-action yang jelas membuat calon klien lebih berani mengambil langkah.",
  ],
};

const INSIGHT_POOL_EN: Record<string, string[]> = {
  Kuliner: [
    "Websites with high-quality food photography increase conversion rates up to 3x.",
    "Interactive digital menus make visitors 40% more likely to place an order.",
    "Authentic customer reviews significantly boost trust for new diners.",
    "WhatsApp order integration allows customers to order directly and seamlessly.",
    "Mobile-friendly design is essential since over 70% of food searches happen on smartphones.",
  ],
  Toko: [
    "Websites with well-organized product catalogs double the average order value.",
    "Online stores with clear navigation experience 25% lower bounce rates.",
    "Professional product photos increase click-through rates by up to 50%.",
    "Detailed product descriptions drastically reduce repetitive customer inquiries.",
    "WhatsApp chat integration lets buyers check stock availability instantly.",
  ],
  "Toko & UMKM": [
    "Websites with well-organized product catalogs double the average order value.",
    "Online stores with clear navigation experience 25% lower bounce rates.",
    "Professional product photos increase click-through rates by up to 50%.",
    "Detailed product descriptions drastically reduce repetitive customer inquiries.",
    "WhatsApp chat integration lets buyers check stock availability instantly.",
  ],
  "Layanan & Reservasi": [
    "Simple booking and contact forms help prospective clients reserve faster.",
    "Transparent service lists and pricing double appointment conversions.",
    "Real client testimonials give prospective customers confidence to book.",
    "WhatsApp booking integration makes scheduling quick and effortless.",
    "Mobile-friendly layouts are crucial as most reservations are made on mobile devices.",
  ],
  "Jasa & Booking": [
    "Simple booking and contact forms help prospective clients reserve faster.",
    "Transparent service lists and pricing double appointment conversions.",
    "Real client testimonials give prospective customers confidence to book.",
    "WhatsApp booking integration makes scheduling quick and effortless.",
    "Mobile-friendly layouts are crucial as most reservations are made on mobile devices.",
  ],
  "Kreatif & Profesional": [
    "High-quality portfolio galleries boost prospective client trust up to 3x.",
    "Real case studies are far more convincing than a plain list of past work experience.",
    "A clean, polished portfolio layout makes your creative work look premium.",
    "Previous client testimonials help new clients feel confident hiring you.",
    "Clear contact call-to-actions make it easy for clients to reach out for new projects.",
  ],
  "Portofolio & Kreator": [
    "High-quality portfolio galleries boost prospective client trust up to 3x.",
    "Real case studies are far more convincing than a plain list of past work experience.",
    "A clean, polished portfolio layout makes your creative work look premium.",
    "Previous client testimonials help new clients feel confident hiring you.",
    "Clear contact call-to-actions make it easy for clients to reach out for new projects.",
  ],
  "Company Profile": [
    "A professional website accelerates trust with clients and business partners.",
    "A comprehensive company profile establishes strong credibility in the market.",
    "Structured service pages help prospective clients understand your core value.",
    "Real testimonials and project showcases strengthen your industry standing.",
    "A responsive design ensures your corporate brand looks great on any device.",
  ],
  Company: [
    "A professional website accelerates trust with clients and business partners.",
    "A comprehensive company profile establishes strong credibility in the market.",
    "Structured service pages help prospective clients understand your core value.",
    "Real testimonials and project showcases strengthen your industry standing.",
    "A responsive design ensures your corporate brand looks great on any device.",
  ],
  Jasa: [
    "Real client testimonials and case studies build immediate credibility.",
    "Transparent service pricing on your site doubles inquiry conversion rates.",
    "Simple inquiry forms make it effortless for prospective clients to reach you.",
    "Concrete case studies are far more persuasive than a generic list of services.",
    "Strong, clear calls-to-action encourage visitors to take the next step.",
  ],
};

export function getInsight(businessType: string, lang: string = "id"): string {
  const isEn = lang === "en";
  const poolRecord = isEn ? INSIGHT_POOL_EN : INSIGHT_POOL_ID;
  const pool = poolRecord[businessType] || (isEn ? [
    "A professional website accelerates trust with clients and business partners.",
    "A comprehensive company profile establishes strong credibility in the market.",
    "Structured service pages help prospective clients understand your core value.",
    "Real testimonials and project showcases strengthen your industry standing.",
    "A responsive design ensures your business looks professional on all devices.",
  ] : [
    "Website profesional mempercepat kepercayaan klien dan mitra bisnis.",
    "Profil perusahaan yang lengkap meningkatkan kredibilitas di mata calon klien.",
    "Halaman layanan yang terstruktur membantu klien memahami nilai bisnis Anda.",
    "Testimoni dan portofolio nyata memperkuat posisi bisnis di industri Anda.",
    "Website yang responsif membuat bisnis Anda terlihat profesional di semua perangkat.",
  ]);
  return pool[Math.floor(Math.random() * pool.length)];
}
