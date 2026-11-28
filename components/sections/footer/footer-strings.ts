/**
 * footer-strings.ts
 *
 * Typed dictionary untuk placeholder statis pada seluruh varian footer.
 * Mengikuti pola benefits-strings.ts: compiler menolak bila salah satu
 * bahasa (ID/EN) kehilangan kunci.
 *
 * Pola penggunaan:
 *   import { footerStrings } from "./footer-strings";
 *   const L = footerStrings(language);
 *   <InlineText placeholder={L.taglinePlaceholder} ... />
 */

export interface FooterStaticStrings {
  taglinePlaceholder: string;
  addressPlaceholder: string;
  openingHoursPlaceholder: string;
}

const ID: FooterStaticStrings = {
  taglinePlaceholder: "Tambah tagline...",
  addressPlaceholder: "Tambah alamat bisnis...",
  openingHoursPlaceholder: "Tambah jam operasional...",
};

const EN: FooterStaticStrings = {
  taglinePlaceholder: "Add tagline...",
  addressPlaceholder: "Add address / location...",
  openingHoursPlaceholder: "Add opening hours...",
};

export function footerStrings(language?: string): FooterStaticStrings {
  return language === "en" ? EN : ID;
}
