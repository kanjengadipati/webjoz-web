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
  kuliner:  ["TEMPLATE_DYNAMIC", "TEMPLATE_KULINER01", "TEMPLATE_COLORFUL", "TEMPLATE_NATURAL", "TEMPLATE_ELEGANT", "TEMPLATE_RETRO", "TEMPLATE_BOLD"],
  jasa:     ["TEMPLATE_DYNAMIC", "TEMPLATE_JASA02", "TEMPLATE_MINIMALIST", "TEMPLATE_ELEGANT", "TEMPLATE_BOLD"],
  produk:   ["TEMPLATE_DYNAMIC", "TEMPLATE_PRODUK03", "TEMPLATE_COLORFUL", "TEMPLATE_NATURAL", "TEMPLATE_MINIMALIST"],
  properti: ["TEMPLATE_DYNAMIC", "TEMPLATE_JASA02", "TEMPLATE_ELEGANT", "TEMPLATE_MINIMALIST", "TEMPLATE_NATURAL"],
  retro:    ["TEMPLATE_DYNAMIC", "TEMPLATE_RETRO", "TEMPLATE_BOLD", "TEMPLATE_NATURAL"],
  futuristic: ["TEMPLATE_DYNAMIC", "TEMPLATE_FUTURISTIC", "TEMPLATE_MINIMALIST", "TEMPLATE_BOLD"],
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
  "elegan":      ["TEMPLATE_DYNAMIC", "TEMPLATE_ELEGANT", "TEMPLATE_MINIMALIST", "TEMPLATE_NATURAL"],
  "natural":     ["TEMPLATE_DYNAMIC", "TEMPLATE_NATURAL", "TEMPLATE_KULINER01", "TEMPLATE_COLORFUL", "TEMPLATE_ELEGANT"],
  "fun":         ["TEMPLATE_DYNAMIC", "TEMPLATE_COLORFUL", "TEMPLATE_KULINER01", "TEMPLATE_PRODUK03", "TEMPLATE_BOLD"],
  "bold":        ["TEMPLATE_DYNAMIC", "TEMPLATE_BOLD", "TEMPLATE_FUTURISTIC", "TEMPLATE_JASA02"],
  "modern":      ["TEMPLATE_DYNAMIC", "TEMPLATE_MINIMALIST", "TEMPLATE_ELEGANT", "TEMPLATE_FUTURISTIC"],
  "profesional": ["TEMPLATE_DYNAMIC", "TEMPLATE_JASA02", "TEMPLATE_PRODUK03", "TEMPLATE_MINIMALIST", "TEMPLATE_ELEGANT"],
  "retro":       ["TEMPLATE_DYNAMIC", "TEMPLATE_RETRO", "TEMPLATE_BOLD", "TEMPLATE_NATURAL"],
  "futuristic":  ["TEMPLATE_DYNAMIC", "TEMPLATE_FUTURISTIC", "TEMPLATE_MINIMALIST", "TEMPLATE_BOLD"],
};

function filterPoolByBusiness(pool: string[], businessLower: string): string[] {
  const kulinerTypes = ["kafe", "cafe", "kopi", "restoran", "warung", "bakery", "catering", "kuliner"];
  const jasaTypes = ["jasa", "konsultan", "agensi", "fotografer", "klinik", "dokter"];
  const produkTypes = ["produk", "toko", "retail", "fashion", "umkm", "online", "baju", "sepatu", "hijab"];
  const techTypes = ["tech", "teknologi", "saas", "software", "ai", "digital", "startup", "robot", "developer", "programmer", "engineer", "coding", "web dev", "fullstack", "backend", "frontend"];
  const creativeTypes = ["kreatif", "art", "seni", "musik", "film", "studio", "vintage", "retro", "portofolio", "portfolio", "desainer", "designer", "ilustrator", "seniman", "penulis", "copywriter", "arsitek"];

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
    lower.includes("fotografer") || lower.includes("klinik") || lower.includes("dokter") ||
    lower.includes("portofolio") || lower.includes("portfolio") || lower.includes("developer") ||
    lower.includes("engineer") || lower.includes("desain") || lower.includes("kreator")) {
    return BUSINESS_TEMPLATE_POOLS.jasa;
  }
  if (lower.includes("produk") || lower.includes("toko") || lower.includes("retail") ||
    lower.includes("fashion") || lower.includes("elektronik") || lower.includes("umkm") ||
    lower.includes("online") || lower.includes("minuman") || lower.includes("bubble") ||
    lower.includes("boba")) {
    return BUSINESS_TEMPLATE_POOLS.produk;
  }
  if (lower.includes("properti") || lower.includes("konstruksi") || lower.includes("hotel") ||
    lower.includes("homestay") || lower.includes("penginapan") || lower.includes("villa") ||
    lower.includes("resort") || lower.includes("guest") || lower.includes("travel") ||
    lower.includes("pendidikan") || lower.includes("manufaktur")) {
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
  hint?: { type?: string; subType?: string; refinedText?: string } | null,
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
      case "Kuliner Tradisional & Nusantara":
        return `Serving authentic traditional Indonesian heritage recipes with rich flavors and time-tested quality at ${name}.`;
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
      case "Fashion & Pakaian":
        return /batik|tenun|kebaya/i.test(name)
          ? `Offering authentic Indonesian batik and traditional wear with elegant motifs, comfortable fabrics, and timeless heritage at ${name}.`
          : `Offering a stylish collection of modern apparel, comfortable everyday wear, and quality fashion at ${name}.`;
      case "Produk Lokal Handmade":
        return `Showcasing authentic handcrafted local goods, souvenirs, and artisanal creations at ${name}.`;
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
    case "Kuliner Tradisional & Nusantara":
      return `Menyajikan hidangan tradisional nusantara autentik dengan bumbu rempah pilihan dan resep warisan leluhur di ${name}.`;
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
    case "Fashion & Pakaian":
      return /batik|tenun|kebaya/i.test(name)
        ? `Menyediakan aneka koleksi batik dan busana tradisional berkualitas dengan motif elegan, bahan nyaman, dan sentuhan tradisi terbaik di ${name}.`
        : `Menyediakan aneka koleksi pakaian dan busana berkualitas dengan desain terkini, bahan nyaman, dan harga terbaik di ${name}.`;
    case "Produk Lokal Handmade":
      return `Menyediakan aneka produk kerajinan tangan dan souvenir lokal berkualitas tinggi dengan sentuhan seni autentik di ${name}.`;
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
      case "Kuliner Tradisional & Nusantara":
        return "Example: Traditional heritage dishes, authentic local spices, dine-in & takeaway (Press Enter to skip)";
      case "Fashion & Pakaian":
        return "Example: Authentic batik shirts, modern dresses, premium casual wear, retail & wholesale (Press Enter to skip)";
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
    case "Kuliner Tradisional & Nusantara":
      return "Contoh: Kuliner khas daerah resep warisan, bumbu rempah autentik, melayani pesanan besek/catering (Tekan Enter untuk lewati)";
    case "Fashion & Pakaian":
      return "Contoh: Jual aneka batik tulis, kemeja batik pria, dress batik wanita, motif khas (Tekan Enter untuk lewati)";
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
