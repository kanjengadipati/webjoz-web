// Hero variant catalog — SINGLE SOURCE OF TRUTH (web side).
// Pure data (no component imports) so it is safe to import from the registry,
// types and admin screens.
//
// Adding a hero variant:
//   1. Add an entry here (value, label, labelKey, group, description).
//   2. Register the component in `./index.tsx` — the `Record<HeroStyle, …>` there
//      makes `tsc` fail until you do.
//   3. Add the `labelKey` to lib/i18n/translations.ts (type + ID + EN).
//   4. Add a preview in app/dashboard/sites/[id]/components/SectionVariantVisualPicker.tsx.
//   5. API side: internal/ai/hero_catalog.go (HeroStyles + mood pools).
// Derived automatically: `HeroStyle` union (templates/types.ts), registry
// dropdown options and `HERO_STYLE_OPTIONS` (variant-registry.ts).

import type { Translations } from "@/lib/i18n/translations";

// Only hero label keys that live under dashboard.sitesEditor and start with "hero".
type HeroLabelKey = Extract<keyof Translations["dashboard"]["sitesEditor"], `hero${string}`>;

export interface HeroVariantMeta {
  value: string;
  label: string;
  labelKey: HeroLabelKey;
  group: string;
  description: string;
  imageNeed: "none" | "optional" | "required";
}

export const HERO_VARIANTS = [
  { value: "centered", label: "Tengah (Centered)", labelKey: "heroCentered", group: "Dasar", description: "Headline dan tombol aksi rata tengah dengan latar bersih dan proporsional." , imageNeed: "optional" },
  { value: "split", label: "Split Screen", labelKey: "heroSplit", group: "Dasar", description: "Teks headline dan tombol di kiri, media visual/gambar besar di kanan." , imageNeed: "optional" },
  { value: "full-bleed", label: "Full Bleed", labelKey: "heroFullBleed", group: "Visual Foto", description: "Latar gambar/media penuh layar dengan teks overlay elegan di atasnya." , imageNeed: "required" },
  { value: "image-carousel", label: "Carousel Gambar", labelKey: "heroImageCarousel", group: "Visual Foto", description: "Slideshow gambar latar bergilir otomatis dengan kontrol navigasi dan transisi halus." , imageNeed: "required" },
  { value: "carousel-split", label: "Carousel Split Card", labelKey: "heroCarouselSplit", group: "Visual Foto", description: "Dua kolom: teks stabil di kiri, kartu slider foto berbingkai dengan preview mengintip di kanan." , imageNeed: "required" },
  { value: "carousel-filmstrip", label: "Carousel Filmstrip", labelKey: "heroCarouselFilmstrip", group: "Visual Foto", description: "Headline terpusat di atas dengan deretan kartu galeri horizontal berjalan kontinu (marquee)." , imageNeed: "required" },
  { value: "minimal", label: "Minimalis", labelKey: "heroMinimalist", group: "Dasar", description: "Tipografi bersih tanpa distraksi elemen berlebih, fokus pada pesan utama." , imageNeed: "optional" },
  { value: "minimalist-elegant", label: "Minimalis Elegan", labelKey: "heroMinimalistElegant", group: "Editorial", description: "Tipografi kontras tinggi bergaya editorial majalah dengan aksen halus." , imageNeed: "optional" },
  { value: "tech-saas", label: "Tech SaaS", labelKey: "heroTechSaaS", group: "Modern & Tekno", description: "Headline modern, badge rilis aplikasi, dan mockup produk/UI interaktif." , imageNeed: "none" },
  { value: "neo-brutalist", label: "Neo-Brutalis", labelKey: "heroNeoBrutalist", group: "Modern & Tekno", description: "Border tegas hitam pekat, bayangan tajam kontras, dan elemen grafis mencolok." , imageNeed: "optional" },
  { value: "bento-grid", label: "Bento Grid", labelKey: "heroBentoGrid", group: "Modern & Tekno", description: "Komposisi kotak modular asimetris menampilkan beragam fitur dan keunggulan." , imageNeed: "optional" },
  { value: "split-editorial", label: "Editorial Split", labelKey: "heroSplitEditorial", group: "Editorial", description: "Tata letak ala majalah desain kontemporer dengan tipografi ekspresif." , imageNeed: "optional" },
  { value: "natural-organic", label: "Natural Organik", labelKey: "heroNaturalOrganic", group: "Editorial", description: "Bentuk kurva lembut, palet natural, dan nuansa hangat bersahabat." , imageNeed: "optional" },
  { value: "personal-billboard", label: "Billboard Personal", labelKey: "heroPersonalBillboard", group: "Portofolio & Personal", description: "Foto profil besar dengan kartu highlight pencapaian dan spesialisasi." , imageNeed: "required" },
  { value: "portrait-showcase", label: "Showcase Potret", labelKey: "heroPortraitShowcase", group: "Portofolio & Personal", description: "Potret vertikal elegan dengan ringkasan peran profesional dan kontak cepat." , imageNeed: "required" },
  { value: "work-preview-strip", label: "Strip Karya Unggulan", labelKey: "heroWorkPreviewStrip", group: "Portofolio & Personal", description: "Headline ringkas dengan deretan cuplikan thumbnail proyek langsung di hero." , imageNeed: "optional" },
  { value: "chronology-badge", label: "Badge Kronologi", labelKey: "heroChronologyBadge", group: "Portofolio & Personal", description: "Hero dengan penanda milestone tahunan atau rekam jejak karier." , imageNeed: "optional" },
  { value: "floating-card", label: "Kartu Melayang", labelKey: "heroFloatingCard", group: "Visual Foto", description: "Foto besar dengan kartu teks melayang menimpa foto; rapi dan meyakinkan." , imageNeed: "required" },
  { value: "arch-portrait", label: "Bingkai Lengkung", labelKey: "heroArchPortrait", group: "Editorial", description: "Foto berbingkai lengkung dengan stempel badge; kesan hangat dan elegan." , imageNeed: "required" },
  { value: "collage-mosaic", label: "Kolase Mosaik", labelKey: "heroCollageMosaic", group: "Visual Foto", description: "Tiga foto asimetris di samping headline; cocok untuk bisnis visual." , imageNeed: "required" },
  { value: "proof-bar", label: "Bukti Angka", labelKey: "heroProofBar", group: "Dasar", description: "Headline tegas dengan baris angka pencapaian dan jam buka." , imageNeed: "none" },
  { value: "video-bg", label: "Video Latar", labelKey: "heroVideoBg", group: "Visual Foto", description: "Video latar berulang otomatis dengan foto poster sebagai cadangan; sinematik dan hidup." , imageNeed: "required" },
  { value: "booking-form", label: "Formulir Pesanan", labelKey: "heroBookingForm", group: "Konversi & Kontak", description: "Hero dua kolom dengan formulir pemesanan langsung; fokus pada konversi cepat." , imageNeed: "none" },
  { value: "location-map", label: "Peta Lokasi", labelKey: "heroLocationMap", group: "Konversi & Kontak", description: "Hero dua kolom dengan peta lokasi langsung dari data kontak; cocok untuk bisnis lokal." , imageNeed: "none" },
] as const satisfies readonly HeroVariantMeta[];

export type HeroStyle = (typeof HERO_VARIANTS)[number]["value"];

/**
 * getHeroStyle returns the active hero_style from a design token,
 * reading hero_style as authoritative and falling back to section_variants.hero.
 * Use this everywhere instead of reading the fields directly so renderer and
 * picker can never diverge.
 */
export function getHeroStyle(designToken: { layout?: { hero_style?: string; section_variants?: { hero?: string } } } | null | undefined): HeroStyle | undefined {
  const val = designToken?.layout?.hero_style || designToken?.layout?.section_variants?.hero;
  return val as HeroStyle | undefined;
}

export function getHeroImageNeed(style: HeroStyle | string | null | undefined): "none" | "optional" | "required" {
  const meta = HERO_VARIANTS.find((v) => v.value === style);
  return (meta?.imageNeed as "none" | "optional" | "required") ?? "optional";
}
