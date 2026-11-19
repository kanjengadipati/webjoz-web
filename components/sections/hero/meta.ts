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

export interface HeroVariantFeatures {
  eyebrow?: boolean;         // default: true
  badge?: boolean;           // default: true
  secondaryCta?: boolean;    // default: true
  stats?: boolean;           // default: false
  multiImages?: boolean;     // default: minImages > 1
  openingHours?: boolean;    // default: false
  dashboardWidget?: boolean; // default: false
}

export interface HeroVariantMeta {
  value: string;
  label: string;
  labelKey: HeroLabelKey;
  group: string;
  description: string;
  imageNeed: "none" | "optional" | "required";
  /** Minimum number of images for the variant to render meaningfully. 0 = none required. */
  minImages: number;
  features?: HeroVariantFeatures;
  wireframeLayout?: string;
}

export const HERO_VARIANTS = [
  { value: "centered", label: "Tengah (Centered)", labelKey: "heroCentered", group: "Dasar", description: "Headline dan tombol aksi rata tengah dengan latar bersih dan proporsional.", imageNeed: "optional", minImages: 0, wireframeLayout: "centered", features: { openingHours: true } },
  { value: "split", label: "Split Screen", labelKey: "heroSplit", group: "Dasar", description: "Teks headline dan tombol di kiri, media visual/gambar besar di kanan.", imageNeed: "optional", minImages: 0, wireframeLayout: "split", features: { openingHours: true } },
  { value: "full-bleed", label: "Full Bleed", labelKey: "heroFullBleed", group: "Visual Foto", description: "Latar gambar/media penuh layar dengan teks overlay elegan di atasnya.", imageNeed: "required", minImages: 1, wireframeLayout: "full-bleed", features: { openingHours: true } },
  { value: "image-carousel", label: "Carousel Gambar", labelKey: "heroImageCarousel", group: "Visual Foto", description: "Slideshow gambar latar bergilir otomatis dengan kontrol navigasi dan transisi halus.", imageNeed: "required", minImages: 2, wireframeLayout: "carousel", features: { multiImages: true, openingHours: true } },
  { value: "carousel-split", label: "Carousel Split Card", labelKey: "heroCarouselSplit", group: "Visual Foto", description: "Dua kolom: teks stabil di kiri, kartu slider foto berbingkai dengan preview mengintip di kanan.", imageNeed: "required", minImages: 2, wireframeLayout: "carousel", features: { multiImages: true, openingHours: true } },
  { value: "carousel-filmstrip", label: "Carousel Filmstrip", labelKey: "heroCarouselFilmstrip", group: "Visual Foto", description: "Headline terpusat di atas dengan deretan kartu galeri horizontal berjalan kontinu (marquee).", imageNeed: "required", minImages: 3, wireframeLayout: "carousel", features: { multiImages: true } },
  { value: "minimal", label: "Minimalis", labelKey: "heroMinimalist", group: "Dasar", description: "Tipografi bersih tanpa distraksi elemen berlebih, fokus pada pesan utama.", imageNeed: "optional", minImages: 0, wireframeLayout: "centered", features: { openingHours: true } },
  { value: "minimalist-elegant", label: "Minimalis Elegan", labelKey: "heroMinimalistElegant", group: "Editorial", description: "Tipografi kontras tinggi bergaya editorial majalah dengan aksen halus.", imageNeed: "optional", minImages: 0, wireframeLayout: "centered" },
  { value: "tech-saas", label: "Tech SaaS", labelKey: "heroTechSaaS", group: "Modern & Tekno", description: "Headline modern, badge rilis aplikasi, dan mockup produk/UI interaktif.", imageNeed: "none", minImages: 0, wireframeLayout: "layers", features: { dashboardWidget: true } },
  { value: "neo-brutalist", label: "Neo-Brutalis", labelKey: "heroNeoBrutalist", group: "Modern & Tekno", description: "Border tegas hitam pekat, bayangan tajam kontras, dan elemen grafis mencolok.", imageNeed: "optional", minImages: 0, wireframeLayout: "split" },
  { value: "bento-grid", label: "Bento Grid", labelKey: "heroBentoGrid", group: "Modern & Tekno", description: "Komposisi kotak modular asimetris menampilkan beragam fitur dan keunggulan.", imageNeed: "optional", minImages: 0, wireframeLayout: "bento", features: { stats: true } },
  { value: "split-editorial", label: "Editorial Split", labelKey: "heroSplitEditorial", group: "Editorial", description: "Tata letak ala majalah desain kontemporer dengan tipografi ekspresif.", imageNeed: "optional", minImages: 0, wireframeLayout: "editorial", features: { stats: true } },
  { value: "natural-organic", label: "Natural Organik", labelKey: "heroNaturalOrganic", group: "Editorial", description: "Bentuk kurva lembut, palet natural, dan nuansa hangat bersahabat.", imageNeed: "optional", minImages: 0, wireframeLayout: "split", features: { openingHours: true } },
  { value: "personal-billboard", label: "Billboard Personal", labelKey: "heroPersonalBillboard", group: "Portofolio & Personal", description: "Foto profil besar dengan kartu highlight pencapaian dan spesialisasi.", imageNeed: "required", minImages: 1, wireframeLayout: "split", features: { stats: true } },
  { value: "profile-cutout", label: "Profil Cutout", labelKey: "heroProfileCutout", group: "Portofolio & Personal", description: "Foto figur/orang cutout dengan bio card perkenalan dan nama besar; ideal untuk portofolio personal & kreator.", imageNeed: "required", minImages: 1, wireframeLayout: "split" },
  { value: "portrait-showcase", label: "Showcase Potret", labelKey: "heroPortraitShowcase", group: "Portofolio & Personal", description: "Potret vertikal elegan dengan ringkasan peran profesional dan kontak cepat.", imageNeed: "required", minImages: 1, wireframeLayout: "split", features: { stats: true } },
  { value: "work-preview-strip", label: "Strip Karya Unggulan", labelKey: "heroWorkPreviewStrip", group: "Portofolio & Personal", description: "Headline ringkas dengan deretan cuplikan thumbnail proyek langsung di hero.", imageNeed: "optional", minImages: 0, wireframeLayout: "split", features: { stats: true } },
  { value: "chronology-badge", label: "Badge Kronologi", labelKey: "heroChronologyBadge", group: "Portofolio & Personal", description: "Hero dengan penanda milestone tahunan atau rekam jejak karier.", imageNeed: "optional", minImages: 0, wireframeLayout: "split", features: { stats: true } },
  { value: "floating-card", label: "Kartu Melayang", labelKey: "heroFloatingCard", group: "Visual Foto", description: "Foto besar dengan kartu teks melayang menimpa foto; rapi dan meyakinkan.", imageNeed: "required", minImages: 1, wireframeLayout: "full-bleed" },
  { value: "arch-portrait", label: "Bingkai Lengkung", labelKey: "heroArchPortrait", group: "Editorial", description: "Foto berbingkai lengkung dengan stempel badge; kesan hangat dan elegan.", imageNeed: "required", minImages: 1, wireframeLayout: "split" },
  { value: "collage-mosaic", label: "Kolase Mosaik", labelKey: "heroCollageMosaic", group: "Visual Foto", description: "Tiga foto asimetris di samping headline; cocok untuk bisnis visual.", imageNeed: "required", minImages: 3, wireframeLayout: "mosaic", features: { multiImages: true } },
  { value: "proof-bar", label: "Bukti Angka", labelKey: "heroProofBar", group: "Dasar", description: "Headline tegas dengan baris angka pencapaian dan jam buka.", imageNeed: "none", minImages: 0, wireframeLayout: "split", features: { stats: true, openingHours: true } },
  { value: "video-bg", label: "Video Latar", labelKey: "heroVideoBg", group: "Visual Foto", description: "Video latar berulang otomatis dengan foto poster sebagai cadangan; sinematik dan hidup.", imageNeed: "required", minImages: 1, wireframeLayout: "full-bleed", features: { openingHours: true } },
  { value: "booking-form", label: "Formulir Pesanan", labelKey: "heroBookingForm", group: "Konversi & Kontak", description: "Hero dua kolom dengan formulir pemesanan langsung; fokus pada konversi cepat.", imageNeed: "none", minImages: 0, wireframeLayout: "split", features: { openingHours: true } },
  { value: "location-map", label: "Peta Lokasi", labelKey: "heroLocationMap", group: "Konversi & Kontak", description: "Hero dua kolom dengan peta lokasi langsung dari data kontak; cocok untuk bisnis lokal.", imageNeed: "none", minImages: 0, wireframeLayout: "split" },
  { value: "product-showcase", label: "Showcase Produk", labelKey: "heroProductShowcase", group: "Visual Foto", description: "Foto produk full-bleed dengan headline editorial besar dan badge stamp dekoratif; ideal untuk toko, brand produk, dan e-commerce.", imageNeed: "required", minImages: 1, wireframeLayout: "full-bleed" },
  { value: "cinematic", label: "Sinematik", labelKey: "heroCinematic", group: "Visual Foto", description: "Background gelap dengan headline center serif besar dan foto-foto floating tersebar; cocok untuk fotografer, videografer, dan creative studio.", imageNeed: "required", minImages: 3, wireframeLayout: "mosaic", features: { multiImages: true } },
  { value: "editorial-asymmetric", label: "Editorial Asimetris", labelKey: "heroEditorialAsymmetric", group: "Editorial", description: "Tata letak asimetris dengan headline besar di kiri dan kartu visual keluar dari grid; cocok untuk agensi, konsultan, dan bisnis profesional.", imageNeed: "optional", minImages: 0, wireframeLayout: "editorial" },
  { value: "floating-layers", label: "Lapisan Melayang (3D)", labelKey: "heroFloatingLayers", group: "Modern & Tekno", description: "Elemen visual bertumpuk dalam perspektif dinamis: kartu dashboard, produk, dan metrik interaktif; cocok untuk software, SaaS, dan teknologi.", imageNeed: "optional", minImages: 0, wireframeLayout: "layers" },
  { value: "cinematic-immersive", label: "Sinematik Imersif", labelKey: "heroCinematicImmersive", group: "Visual Foto", description: "Layar penuh sinematik berbingkai dengan headline bawah dan kartu aksi elegan; cocok untuk hotel, travel, restoran, dan hospitality.", imageNeed: "required", minImages: 1, wireframeLayout: "full-bleed" },
  { value: "visual-mosaic", label: "Mosaik Visual", labelKey: "heroVisualMosaic", group: "Visual Foto", description: "Split 50:50 dengan tipografi editorial bersih di kiri dan mosaik foto multi-rasio asimetris di kanan; cocok untuk fotografi, interior, properti, dan portofolio.", imageNeed: "required", minImages: 3, wireframeLayout: "mosaic", features: { multiImages: true } },
  { value: "bento-hero", label: "Bento Hero Kontemporer", labelKey: "heroBentoHero", group: "Modern & Tekno", description: "Headline terpusat di atas dengan panel bento grid modular di bawah (foto, statistik, misi, dan tim); cocok untuk SaaS, startup, dan company profile.", imageNeed: "optional", minImages: 0, wireframeLayout: "bento", features: { stats: true, multiImages: true } },
] as const satisfies readonly HeroVariantMeta[];

export type HeroStyle = (typeof HERO_VARIANTS)[number]["value"];

export function getHeroMeta(style: HeroStyle | string | null | undefined): HeroVariantMeta | undefined {
  if (!style) return undefined;
  return HERO_VARIANTS.find((v) => v.value === style);
}

export function heroShowsImage(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return true;
  const meta = getHeroMeta(style);
  if (!meta) return true;
  return meta.imageNeed !== "none";
}

export function heroSupportsEyebrow(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return true;
  const meta = getHeroMeta(style);
  if (!meta) return true;
  return meta.features?.eyebrow ?? true;
}

export function heroSupportsBadge(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return true;
  const meta = getHeroMeta(style);
  if (!meta) return true;
  return meta.features?.badge ?? true;
}

export function heroSupportsSecondaryCta(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return true;
  const meta = getHeroMeta(style);
  if (!meta) return true;
  return meta.features?.secondaryCta ?? true;
}

export function heroSupportsStats(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return false;
  const meta = getHeroMeta(style);
  return meta?.features?.stats ?? false;
}

export function heroSupportsMultiImages(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return false;
  const meta = getHeroMeta(style);
  if (!meta) return false;
  return meta.minImages > 1 || (meta.features?.multiImages ?? false);
}

export function heroSupportsOpeningHours(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return false;
  const meta = getHeroMeta(style);
  return meta?.features?.openingHours ?? false;
}

export function heroSupportsDashboardWidget(style: HeroStyle | string | null | undefined): boolean {
  if (!style) return false;
  const meta = getHeroMeta(style);
  return meta?.features?.dashboardWidget ?? false;
}

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

/**
 * Returns the minimum number of images required for a hero variant to render
 * meaningfully. Mirrors api/internal/ai/hero_catalog.go HeroStyleSpec.MinImages.
 */
export function getHeroMinImages(style: HeroStyle | string | null | undefined): number {
  const meta = HERO_VARIANTS.find((v) => v.value === style);
  return meta?.minImages ?? 0;
}
