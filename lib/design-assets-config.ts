/**
 * Design Assets Config Store
 *
 * Single source of truth for all customizable picker assets:
 *   - Typography Pairings
 *   - Color Patterns (palettes)
 *   - Industry Presets
 *   - Sections (visibility + required flags)
 *
 * Storage: API → GET/PUT /admin/platform-config/design-assets (superadmin only).
 * Falls back to localStorage under key "design_assets_config" when the API is
 * unavailable (unauthenticated editor reads, offline, etc.).
 *
 * Editor pickers call getEnabled* synchronously — they read from an in-memory
 * cache that is populated once on admin page mount via loadDesignAssetsConfig().
 * Built-in items can be hidden but not deleted.
 * Custom items (is_custom: true) can be both hidden and deleted.
 */

import { request } from "@/lib/api/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TypographyPairing {
  id: string;
  name: string;
  description: string;
  heading_font: string;
  body_font: string;
  heading_weight: string;
  heading_size_hero: string;
  heading_style?: string;
  heading_transform?: string;
  heading_tracking?: string;
  is_custom?: boolean;
}

export interface ColorPattern {
  id: string;
  name: string;
  description: string;
  palette: {
    primary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
  };
  theme_mode?: "light" | "dark";
  is_custom?: boolean;
}

export interface IndustryPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  pairing_id: string;
  pattern_id: string;
  is_custom?: boolean;
}

export interface DesignAssetsConfig {
  hidden_pairings: string[];
  hidden_patterns: string[];
  hidden_presets: string[];
  hidden_sections: string[];
  required_sections: string[];
  custom_pairings: TypographyPairing[];
  custom_patterns: ColorPattern[];
  custom_presets: IndustryPreset[];
}

// ─── Built-in data ────────────────────────────────────────────────────────────

export const TYPOGRAPHY_PAIRINGS: TypographyPairing[] = [
  { id: "neo-clean", name: "Neo Clean", description: "Jernih dan modern, cocok untuk semua jenis bisnis", heading_font: "Inter", body_font: "Inter", heading_weight: "700", heading_size_hero: "3rem" },
  { id: "jakarta-pro", name: "Jakarta Pro", description: "Elegan korporat, premium dan mudah dibaca", heading_font: "Plus Jakarta Sans", body_font: "DM Sans", heading_weight: "800", heading_size_hero: "3rem" },
  { id: "editorial-elegance", name: "Editorial Elegan", description: "Serif kontras tinggi, cocok untuk bisnis premium & butik", heading_font: "Playfair Display", body_font: "DM Sans", heading_weight: "600", heading_size_hero: "3.5rem", heading_style: "italic" },
  { id: "bold-display", name: "Bold Display", description: "Tegas dan berenergi, cocok untuk toko & produk", heading_font: "Montserrat", body_font: "Open Sans", heading_weight: "800", heading_size_hero: "3.5rem", heading_transform: "uppercase", heading_tracking: "-0.02em" },
  { id: "cinematic", name: "Sinematik", description: "Megah dan berkarakter, cocok untuk resto & event", heading_font: "Cinzel", body_font: "Lato", heading_weight: "700", heading_size_hero: "3rem", heading_transform: "uppercase", heading_tracking: "0.12em" },
  { id: "organic-warm", name: "Organik Hangat", description: "Alami dan ramah, cocok untuk kuliner & produk lokal", heading_font: "Lora", body_font: "Work Sans", heading_weight: "600", heading_size_hero: "3rem" },
  { id: "tech-forward", name: "Tech Modern", description: "Geometris digital, cocok untuk bisnis teknologi & jasa", heading_font: "Space Grotesk", body_font: "Inter", heading_weight: "700", heading_size_hero: "3rem", heading_tracking: "-0.03em" },
  { id: "friendly-round", name: "Ramah & Bulat", description: "Hangat dan mudah didekati, cocok untuk pendidikan & klinik", heading_font: "Poppins", body_font: "Lato", heading_weight: "700", heading_size_hero: "2.5rem" },
  { id: "luxury-serif", name: "Mewah Klasik", description: "Anggun tinggi, cocok untuk salon, hotel & jasa premium", heading_font: "Cormorant Garamond", body_font: "Work Sans", heading_weight: "600", heading_size_hero: "3.5rem", heading_style: "italic", heading_tracking: "0.04em" },
  { id: "urban-street", name: "Urban Street", description: "Padat dan bertenaga, cocok untuk streetwear & otomotif", heading_font: "Oswald", body_font: "Open Sans", heading_weight: "700", heading_size_hero: "3.5rem", heading_transform: "uppercase", heading_tracking: "0.02em" },
  { id: "fraunces-organic", name: "Fraunces Organic", description: "Serif hangat dan alami, cocok untuk produk organik & F&B", heading_font: "Fraunces", body_font: "DM Sans", heading_weight: "600", heading_size_hero: "3.5rem" },
  { id: "bricolage-playful", name: "Bricolage Playful", description: "Penuh karakter dan dinamis, cocok untuk brand kreatif & anak muda", heading_font: "Bricolage Grotesque", body_font: "DM Sans", heading_weight: "800", heading_size_hero: "3rem", heading_tracking: "-0.03em" },
  { id: "sora-industrial", name: "Sora Industrial", description: "Tegas kotak dengan struktur modern, cocok untuk tech & industri", heading_font: "Sora", body_font: "Inter", heading_weight: "800", heading_size_hero: "3rem", heading_tracking: "-0.03em" },
  { id: "urbanist-clean", name: "Urbanist Clean", description: "Geometris modern yang sangat sleek, cocok untuk startup & digital", heading_font: "Urbanist", body_font: "Urbanist", heading_weight: "700", heading_size_hero: "3rem", heading_tracking: "-0.03em" },
  { id: "schibsted-technical", name: "Schibsted Technical", description: "Grotesk Skandinavia dipasangkan dengan monospace teknis", heading_font: "Schibsted Grotesk", body_font: "JetBrains Mono", heading_weight: "700", heading_size_hero: "3rem", heading_tracking: "-0.03em" },
  { id: "cyber-developer", name: "Cyber Developer", description: "Monospace mentah dan terstruktur, cocok untuk developer & SaaS", heading_font: "JetBrains Mono", body_font: "JetBrains Mono", heading_weight: "600", heading_size_hero: "2.5rem", heading_tracking: "-0.03em" },
];

export const COLOR_PATTERNS: ColorPattern[] = [
  { id: "profesional", name: "Profesional", description: "Biru elegan, cocok untuk jasa & korporat", palette: { primary: "#4F46E5", accent: "#7C3AED", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A" }, theme_mode: "light" },
  { id: "hangat", name: "Hangat", description: "Cokelat hangat, cocok untuk kuliner & UMKM", palette: { primary: "#78350F", accent: "#B45309", background: "#FAF7F2", surface: "#FFFFFF", text: "#2C2620" }, theme_mode: "light" },
  { id: "malam", name: "Malam Gelap", description: "Gelap elegan dengan aksen emas", palette: { primary: "#C9A84C", accent: "#A07830", background: "#0D0D0B", surface: "#1A1A17", text: "#F5F0E8" }, theme_mode: "dark" },
  { id: "segar", name: "Segar Alami", description: "Hijau alami, cocok untuk gaya hidup & organik", palette: { primary: "#2D6A4F", accent: "#40916C", background: "#F0FDF4", surface: "#FFFFFF", text: "#1B2E20" }, theme_mode: "light" },
  { id: "laut", name: "Laut Tenang", description: "Biru laut yang menenangkan", palette: { primary: "#0369A1", accent: "#0284C7", background: "#F0F9FF", surface: "#FFFFFF", text: "#0C4A6E" }, theme_mode: "light" },
  { id: "modern-gelap", name: "Modern Gelap", description: "Gelap modern dengan aksen ungu neon", palette: { primary: "#8B5CF6", accent: "#6D28D9", background: "#0B0E17", surface: "#161B2B", text: "#E2E8F0" }, theme_mode: "dark" },
  { id: "mentari", name: "Mentari Pagi", description: "Oranye cerah ceria untuk F&B & kreatif", palette: { primary: "#EA580C", accent: "#F97316", background: "#FFF7ED", surface: "#FFFFFF", text: "#2D1B0E" }, theme_mode: "light" },
  { id: "mawar", name: "Mawar Merah", description: "Merah berani untuk fashion & event", palette: { primary: "#BE123C", accent: "#E11D48", background: "#FFF1F2", surface: "#FFFFFF", text: "#1F0A0C" }, theme_mode: "light" },
  { id: "tenang-abu", name: "Abu Tenang", description: "Monokrom minimalis, profesional", palette: { primary: "#475569", accent: "#64748B", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A" }, theme_mode: "light" },
  { id: "lembayung", name: "Lembayung", description: "Lembut kreatif untuk beauty & lifestyle", palette: { primary: "#7E22CE", accent: "#A855F7", background: "#FAF5FF", surface: "#FFFFFF", text: "#2E1065" }, theme_mode: "light" },
];

export const INDUSTRY_PRESETS: IndustryPreset[] = [
  { id: "resto", name: "Restoran", description: "Hangat alami untuk restoran, bakery & catering", icon: "🍜", pairing_id: "organic-warm", pattern_id: "hangat" },
  { id: "kafe", name: "Kafe Modern", description: "Serif hangat untuk kafe, coffee shop & minuman", icon: "☕", pairing_id: "fraunces-organic", pattern_id: "mentari" },
  { id: "fashion", name: "Fashion", description: "Berani dan stylish untuk fashion & apparel", icon: "👗", pairing_id: "bold-display", pattern_id: "mawar" },
  { id: "toko-online", name: "Toko Online", description: "Modern dan bersih untuk toko online & elektronik", icon: "📱", pairing_id: "tech-forward", pattern_id: "laut" },
  { id: "jasa", name: "Jasa Profesional", description: "Korporat elegan untuk konsultan & fotografer", icon: "💼", pairing_id: "neo-clean", pattern_id: "profesional" },
  { id: "salon", name: "Salon & Kecantikan", description: "Anggun kreatif untuk salon, barbershop & beauty", icon: "💄", pairing_id: "luxury-serif", pattern_id: "lembayung" },
  { id: "otomotif", name: "Otomotif", description: "Gelap bertenaga untuk bengkel & otomotif", icon: "🔧", pairing_id: "urban-street", pattern_id: "modern-gelap" },
  { id: "klinik", name: "Klinik", description: "Bersih dan ramah untuk klinik & kesehatan", icon: "🏥", pairing_id: "friendly-round", pattern_id: "segar" },
  { id: "properti", name: "Properti", description: "Industrial solid untuk properti & konstruksi", icon: "🏢", pairing_id: "sora-industrial", pattern_id: "tenang-abu" },
  { id: "pendidikan", name: "Pendidikan", description: "Elegan modern untuk kursus & pendidikan", icon: "📚", pairing_id: "jakarta-pro", pattern_id: "laut" },
];

export const REQUIRED_SECTIONS_DEFAULT = ["hero", "contact"];

// ─── In-memory cache ─────────────────────────────────────────────────────────
// Populated via loadDesignAssetsConfig() on admin page mount.
// Editor pickers read synchronously from this cache — no async needed.

const DEFAULT_CONFIG: DesignAssetsConfig = {
  hidden_pairings: [],
  hidden_patterns: [],
  hidden_presets: [],
  hidden_sections: [],
  required_sections: REQUIRED_SECTIONS_DEFAULT,
  custom_pairings: [],
  custom_patterns: [],
  custom_presets: [],
};

let _cache: DesignAssetsConfig = { ...DEFAULT_CONFIG };
let _cacheLoaded = false;

function isClient(): boolean {
  return typeof window !== "undefined";
}

// ── localStorage fallback key (used when API is unavailable) ─────────────────
const LS_KEY = "design_assets_config";

function loadFromLocalStorage(): DesignAssetsConfig {
  if (!isClient()) return { ...DEFAULT_CONFIG };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { ...DEFAULT_CONFIG };
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveToLocalStorage(cfg: DesignAssetsConfig): void {
  if (!isClient()) return;
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  } catch {}
}

// ─── API helpers ──────────────────────────────────────────────────────────────

const API_PATH = "/admin/platform-config/design-assets";

interface ApiDesignAssetsResponse {
  config: DesignAssetsConfig;
  updated_by?: number;
  updated_at?: string;
}

/**
 * Fetch config from the API. Falls back to localStorage on error.
 * Call this once on admin page mount — it populates the in-memory cache.
 */
export async function loadDesignAssetsConfig(token?: string | null): Promise<DesignAssetsConfig> {
  if (token) {
    try {
      const res = await request<ApiDesignAssetsResponse>(API_PATH, {}, token);
      const cfg: DesignAssetsConfig = { ...DEFAULT_CONFIG, ...res.data.config };
      _cache = cfg;
      _cacheLoaded = true;
      // Mirror to localStorage as fallback for unauthenticated reads (editor pickers)
      saveToLocalStorage(cfg);
      return cfg;
    } catch {
      // Fall through to localStorage
    }
  }
  const lsCfg = loadFromLocalStorage();
  _cache = lsCfg;
  _cacheLoaded = true;
  return lsCfg;
}

/**
 * Save config to the API (superadmin only). Also updates localStorage mirror.
 */
export async function saveDesignAssetsConfig(
  cfg: DesignAssetsConfig,
  token: string,
): Promise<DesignAssetsConfig> {
  const res = await request<ApiDesignAssetsResponse>(
    API_PATH,
    { method: "PUT", body: JSON.stringify(cfg) },
    token,
  );
  const saved: DesignAssetsConfig = { ...DEFAULT_CONFIG, ...res.data.config };
  _cache = saved;
  saveToLocalStorage(saved);
  return saved;
}

/**
 * Reset config to defaults via the API.
 */
export async function resetDesignAssetsConfig(token: string): Promise<DesignAssetsConfig> {
  const res = await request<ApiDesignAssetsResponse>(
    API_PATH,
    { method: "DELETE" },
    token,
  );
  const reset: DesignAssetsConfig = { ...DEFAULT_CONFIG, ...res.data.config };
  _cache = reset;
  saveToLocalStorage(reset);
  return reset;
}

/**
 * Synchronously update the in-memory cache and localStorage mirror.
 * Used by the admin page after each toggle — no API call here, the caller
 * is responsible for calling saveDesignAssetsConfig() to persist.
 */
export function updateCache(cfg: DesignAssetsConfig): void {
  _cache = cfg;
  saveToLocalStorage(cfg);
}

/**
 * Read the current in-memory cache synchronously.
 * If not yet populated, reads from localStorage.
 */
export function loadConfig(): DesignAssetsConfig {
  if (_cacheLoaded) return _cache;
  const lsCfg = loadFromLocalStorage();
  _cache = lsCfg;
  return lsCfg;
}

/** @deprecated Use loadDesignAssetsConfig() instead. kept for backward compat. */
export function saveConfig(cfg: DesignAssetsConfig): void {
  _cache = cfg;
  saveToLocalStorage(cfg);
}

/** @deprecated Use resetDesignAssetsConfig() instead. */
export function resetConfig(): void {
  _cache = { ...DEFAULT_CONFIG };
  if (isClient()) localStorage.removeItem(LS_KEY);
}

// ─── Helpers — used by editor pickers (synchronous) ──────────────────────────

export function getEnabledTypographyPairings(): TypographyPairing[] {
  const cfg = loadConfig();
  const hidden = new Set(cfg.hidden_pairings);
  const builtins = TYPOGRAPHY_PAIRINGS.filter((p) => !hidden.has(p.id));
  const customs = (cfg.custom_pairings || []).filter((p) => !hidden.has(p.id));
  return [...builtins, ...customs];
}

export function getEnabledColorPatterns(): ColorPattern[] {
  const cfg = loadConfig();
  const hidden = new Set(cfg.hidden_patterns);
  const builtins = COLOR_PATTERNS.filter((p) => !hidden.has(p.id));
  const customs = (cfg.custom_patterns || []).filter((p) => !hidden.has(p.id));
  return [...builtins, ...customs];
}

export function getEnabledIndustryPresets(): IndustryPreset[] {
  const cfg = loadConfig();
  const hidden = new Set(cfg.hidden_presets);
  const builtins = INDUSTRY_PRESETS.filter((p) => !hidden.has(p.id));
  const customs = (cfg.custom_presets || []).filter((p) => !hidden.has(p.id));
  return [...builtins, ...customs];
}

export function getHiddenSections(): string[] {
  return loadConfig().hidden_sections;
}

export function getRequiredSections(): string[] {
  return loadConfig().required_sections;
}
