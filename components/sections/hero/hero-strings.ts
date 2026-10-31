/**
 * hero-strings.ts
 *
 * String UI statis yang dirender langsung di varian hero (bukan konten yang
 * dapat diedit user, bukan aria-label, bukan placeholder editor).
 *
 * Pola penggunaan:
 *   import { heroStrings } from "./hero-strings";
 *   const s = heroStrings(language);
 *   <span>{s.availableForWork}</span>
 *
 * Untuk string yang sudah ada inline sebagai fallback InlineText (mis.
 * `defaultCta`), biarkan di file masing-masing — itu benar secara desain
 * karena nilainya bisa dioverride oleh konten AI.
 */

export interface HeroStaticStrings {
  /** Label availability pill di portrait-showcase, personal-billboard, chronology-badge */
  availableForWork: string;
  /** Judul baris milestone di chronology-badge */
  trackRecord: string;
  /** Label atas grid karya di work-preview-strip */
  featuredWork: string;
  /** Tombol arah ke lokasi di location-map */
  getDirections: string;
  /** Label chip lokasi di location-map */
  ourLocation: string;
  /** Stiker dekoratif "NEW" di neo-brutalist */
  newBadge: string;
}

const ID: HeroStaticStrings = {
  availableForWork: "Tersedia untuk kerja",
  trackRecord: "Jejak karier",
  featuredWork: "Karya Unggulan",
  getDirections: "Rute ke lokasi",
  ourLocation: "Lokasi kami",
  newBadge: "BARU",
};

const EN: HeroStaticStrings = {
  availableForWork: "Available for work",
  trackRecord: "Track record",
  featuredWork: "Featured Work",
  getDirections: "Get directions",
  ourLocation: "Our location",
  newBadge: "NEW",
};

export function heroStrings(language?: string): HeroStaticStrings {
  return language === "en" ? EN : ID;
}
