// Single source of truth for all section variant options.
// Every consumer (editor dropdown, design-assets admin UI, etc.) imports from here.

import { HERO_VARIANTS } from "./hero/meta";
import { ABOUT_VARIANTS } from "./about/variants";
import { BENEFITS_VARIANTS } from "./benefits/variants";
import { TESTIMONIALS_VARIANTS } from "./testimonials/variants";
import { CTA_VARIANTS } from "./cta/variants";
import { FAQ_VARIANTS } from "./faq/variants";
import { STATS_VARIANTS } from "./stats/variants";
import { SKILLS_VARIANTS } from "./skills/variants";
import { PARTNERS_VARIANTS } from "./partners/variants";
import { PRICING_VARIANTS } from "./pricing/variants";
import { MENU_VARIANTS } from "./menu/variants";
import { CATALOG_VARIANTS } from "./catalog/variants";
import { CONTACT_VARIANTS } from "./contact/variants";
import { HEADER_VARIANTS } from "./header/variants";
import { FOOTER_VARIANTS } from "./footer/variants";
import { variantOptions, type VariantOption } from "./variant-meta";

export type { VariantOption } from "./variant-meta";

export const SECTION_VARIANT_OPTIONS: Record<string, VariantOption[]> = {
  hero: HERO_VARIANTS.map((v) => ({ ...v })),
  "hero-effect": [
    { value: "modern-grid",      labelKey: "variantHeroEffectModernGrid",    label: "Grid Modern",          group: "Efek Visual", descriptionKey: "variantHeroEffectModernGridDesc",    description: "Grid modular halus pada latar hero untuk kesan modern dan terstruktur." },
    { value: "glassmorphism",    labelKey: "variantHeroEffectGlass",         label: "Kaca (Glassmorphism)", group: "Efek Visual", descriptionKey: "variantHeroEffectGlassDesc",         description: "Panel transparan dengan blur kaca dan tepi halus berkilau." },
    { value: "neobrutalism",     labelKey: "variantHeroEffectNeoBrut",       label: "Neo-Brutalis",         group: "Efek Visual", descriptionKey: "variantHeroEffectNeoBrutDesc",       description: "Garis tebal, bayangan tajam, dan blok warna berani khas brutalisme." },
    { value: "scanlines",        labelKey: "variantHeroEffectScanlines",     label: "Garis Scan",           group: "Efek Visual", descriptionKey: "variantHeroEffectScanlinesDesc",     description: "Tekstur garis horizontal tipis ala layar retro CRT / terminal." },
    { value: "starfield",        labelKey: "variantHeroEffectStarfield",     label: "Luar Angkasa",         group: "Efek Visual", descriptionKey: "variantHeroEffectStarfieldDesc",     description: "Titik bintang berkelap-kelip di latar gelap yang dramatis." },
    { value: "retro-paper",      labelKey: "variantHeroEffectRetroPaper",    label: "Kertas Retro",         group: "Efek Visual", descriptionKey: "variantHeroEffectRetroPaperDesc",    description: "Tekstur kertas usang dan butiran hangat bergaya vintage." },
  ],
  about: variantOptions(ABOUT_VARIANTS),
  benefits: variantOptions(BENEFITS_VARIANTS),
  testimonials: variantOptions(TESTIMONIALS_VARIANTS),
  cta: variantOptions(CTA_VARIANTS),
  faq: variantOptions(FAQ_VARIANTS),
  gallery: [
    { value: "grid",                 labelKey: "variantGalleryGrid",               label: "Grid",                   descriptionKey: "variantGalleryGridDesc",               description: "Foto dalam kotak seragam tersusun rapi." },
    { value: "masonry",              labelKey: "variantGalleryMasonry",            label: "Masonry",                descriptionKey: "variantGalleryMasonryDesc",            description: "Tinggi foto bervariasi seperti Pinterest." },
    { value: "carousel",             labelKey: "variantGalleryCarousel",           label: "Carousel",               descriptionKey: "variantGalleryCarouselDesc",           description: "Foto slide bergilir otomatis." },
    { value: "lightbox-story",       labelKey: "variantGalleryLightboxStory",      label: "Story Lightbox",         descriptionKey: "variantGalleryLightboxStoryDesc",      description: "Grid foto yang membuka fullscreen dengan narasi besar dan navigasi cerita." },
    { value: "before-after-slider",  labelKey: "variantGalleryBeforeAfter",        label: "Before & After Slider",  descriptionKey: "variantGalleryBeforeAfterDesc",        description: "Komparasi gambar sebelum/sesudah dengan slider drag." },
    { value: "video-grid",           labelKey: "variantVideoGrid",                 label: "Grid Video",             descriptionKey: "variantGalleryVideoGridDesc",          description: "Grid seragam dengan poster dan tombol putar untuk item video." },
  ],
  works: [
    { value: "grid",               labelKey: "variantWorksGrid",             label: "Grid",             descriptionKey: "variantWorksGridDesc",             description: "Kartu proyek seragam dalam grid rapi." },
    { value: "masonry",            labelKey: "variantWorksMasonry",          label: "Masonry",          descriptionKey: "variantWorksMasonryDesc",          description: "Tinggi kartu bervariasi seperti Pinterest." },
    { value: "featured-grid",      labelKey: "variantWorksFeaturedGrid",     label: "Grid Unggulan",    descriptionKey: "variantWorksFeaturedGridDesc",     description: "Proyek pertama besar sebagai sorotan, sisanya grid rapi." },
    { value: "showcase-featured",  labelKey: "variantWorksShowcaseFeatured", label: "Showcase Unggulan",descriptionKey: "variantWorksShowcaseFeaturedDesc", description: "Proyek utama horizontal besar, sisanya grid 2 kolom." },
  ],
  stats: variantOptions(STATS_VARIANTS),
  skills: variantOptions(SKILLS_VARIANTS),
  partners: variantOptions(PARTNERS_VARIANTS),
  pricing: variantOptions(PRICING_VARIANTS),
  menu: variantOptions(MENU_VARIANTS),
  catalog: variantOptions(CATALOG_VARIANTS),
  contact: variantOptions(CONTACT_VARIANTS),
  header: variantOptions(HEADER_VARIANTS),
  footer: variantOptions(FOOTER_VARIANTS),
  blog: [
    { value: "grid",      labelKey: "variantBlogGrid",     label: "Grid",     descriptionKey: "variantBlogGridDesc",     description: "Kartu dalam 3 kolom rapi." },
    { value: "list",      labelKey: "variantBlogList",     label: "List",     descriptionKey: "variantBlogListDesc",     description: "Horizontal dengan gambar di kiri, teks di kanan." },
    { value: "featured",  labelKey: "variantBlogFeatured", label: "Unggulan", descriptionKey: "variantBlogFeaturedDesc", description: "Satu postingan besar hero + grid kecil di bawah." },
    { value: "minimal",   labelKey: "variantBlogMinimal",  label: "Minimal",  descriptionKey: "variantBlogMinimalDesc",  description: "Daftar judul dan tanggal tanpa gambar." },
  ],
  preloader: [
    { value: "none",               labelKey: "variantPreloaderNone",              label: "Tanpa Preloader",              descriptionKey: "variantPreloaderNoneDesc",              description: "Halaman langsung tampil seketika tanpa jeda loading." },
    { value: "top-bar",            labelKey: "variantPreloaderTopBar",            label: "Garis Atas (Top Progress)",    group: "Minimalis", descriptionKey: "variantPreloaderTopBarDesc",            description: "Garis tipis di bibir atas layar tanpa menutupi konten (ala Linear / YouTube)." },
    { value: "minimal-fade",       labelKey: "variantPreloaderMinimalFade",       label: "Fade Tipografi",               group: "Minimalis", descriptionKey: "variantPreloaderMinimalFadeDesc",       description: "Nama brand tipografis halus di tengah layar tanpa ornamen tambahan." },
    { value: "minimal-spinner",    labelKey: "variantPreloaderMinimalSpinner",    label: "Monoline Ring",                group: "Minimalis", descriptionKey: "variantPreloaderMinimalSpinnerDesc",    description: "Cincin putar satu garis super tipis dan bersih di tengah layar." },
    { value: "minimal-counter",    labelKey: "variantPreloaderMinimalCounter",    label: "Counter Angka",                group: "Minimalis", descriptionKey: "variantPreloaderMinimalCounterDesc",    description: "Persentase angka monospace minimalis yang menghitung cepat." },
    { value: "pulse-logo",         labelKey: "variantPreloaderPulseLogo",         label: "Logo Berdenyut (Pulse)",       group: "Branding",  descriptionKey: "variantPreloaderPulseLogoDesc",         description: "Logo brand berdenyut halus di tengah layar." },
    { value: "orbit-ring",         labelKey: "variantPreloaderOrbitRing",         label: "Cincin Orbit",                 group: "Modern",    descriptionKey: "variantPreloaderOrbitRingDesc",         description: "Cincin berputar mengelilingi inisial logo brand." },
    { value: "progress-line",      labelKey: "variantPreloaderProgressLine",      label: "Bar Progres Ramping",          group: "Modern",    descriptionKey: "variantPreloaderProgressLineDesc",      description: "Logo dengan bar progres horizontal di bawahnya." },
    { value: "shimmer-reveal",     labelKey: "variantPreloaderShimmerReveal",     label: "Shimmer Kilau",                group: "Editorial", descriptionKey: "variantPreloaderShimmerRevealDesc",     description: "Efek kilau gradien cahaya menyapu teks brand." },
    { value: "stagger-dots",       labelKey: "variantPreloaderStaggerDots",       label: "Titik Gelombang",              group: "Minimalis", descriptionKey: "variantPreloaderStaggerDotsDesc",       description: "Tiga titik bergelombang halus di bawah brand." },
  ],
};

export function getVariantLabel(section: string, value: string, t?: any): string {
  const opt = SECTION_VARIANT_OPTIONS[section]?.find((v) => v.value === value);
  if (!opt) return value;
  if (t && opt.labelKey) {
    const translated = t(`dashboard.sitesEditor.${opt.labelKey}`);
    if (translated && !translated.startsWith("dashboard.")) {
      return translated.replace(/^Hero:\s*/i, "");
    }
  }
  return opt.label;
}

const VARIANT_GROUP_LABELS: Record<string, { id: string; en: string }> = {
  "Branding": { id: "Branding", en: "Branding" },
  "Dasar": { id: "Dasar", en: "Basic" },
  "E-Commerce": { id: "E-Commerce", en: "E-Commerce" },
  "Editorial": { id: "Editorial", en: "Editorial" },
  "Efek Visual": { id: "Efek Visual", en: "Visual Effects" },
  "Kategori": { id: "Kategori", en: "Category" },
  "Konversi & Kontak": { id: "Konversi & Kontak", en: "Conversion & Contact" },
  "List": { id: "Daftar", en: "List" },
  "Minimalis": { id: "Minimalis", en: "Minimalist" },
  "Modern & Tekno": { id: "Modern & Tekno", en: "Modern & Tech" },
  "Modern": { id: "Modern", en: "Modern" },
  "Padat": { id: "Padat", en: "Dense" },
  "Portofolio & Personal": { id: "Portofolio & Personal", en: "Portfolio & Personal" },
  "Tabel": { id: "Tabel", en: "Table" },
  "Visual Foto": { id: "Visual Foto", en: "Photo Visual" },
};

export function getVariantGroupLabel(group: string | undefined, locale?: string): string {
  if (!group) return "";
  const isEn = locale?.toLowerCase() === "en";
  const mapped = VARIANT_GROUP_LABELS[group];
  if (!mapped) return group;
  return isEn ? mapped.en : mapped.id;
}

export function getVariantDescription(section: string, value: string, t?: any): string {
  const opt = SECTION_VARIANT_OPTIONS[section]?.find((v) => v.value === value);
  if (!opt) return "";
  if (t && opt.descriptionKey) {
    const translated = t(`dashboard.sitesEditor.${opt.descriptionKey}`);
    if (translated && !translated.startsWith("dashboard.")) return translated;
  }
  return opt.description ?? "";
}

export function getVariantValues(section: string): string[] {
  return SECTION_VARIANT_OPTIONS[section]?.map((v) => v.value) ?? [];
}

// Single source of truth for the hero_style choices exposed in the editor.
// labelKey maps to a `dashboard.sitesEditor.*` i18n key so labels are localized.
export const HERO_STYLE_OPTIONS: Array<{ value: string; labelKey: string }> = HERO_VARIANTS.map(({ value, labelKey }) => ({ value, labelKey }));

/**
 * Returns the archetype wireframe identifier for a given section variant.
 * If the variant explicitly declares wireframeLayout, it is returned.
 * Otherwise, the layout is intelligently inferred from section and variant name keywords.
 * This guarantees zero double-work: any newly added variant automatically gets an accurate wireframe.
 */
export function getVariantWireframeLayout(section: string, value: string): string {
  const opt = SECTION_VARIANT_OPTIONS[section]?.find((v) => v.value === value);
  if (opt?.wireframeLayout) return opt.wireframeLayout;

  const v = (value || "").toLowerCase();
  switch (section) {
    case "hero":
      if (v.includes("bento")) return "bento";
      if (v.includes("layer")) return "layers";
      if (v.includes("mosaic") || v.includes("collage")) return "mosaic";
      if (v.includes("editorial")) return "editorial";
      if (v.includes("split")) return "split";
      if (v.includes("carousel") || v.includes("filmstrip")) return "carousel";
      if (v.includes("cinematic") || v.includes("full-bleed") || v.includes("video") || v.includes("immersive")) return "full-bleed";
      if (v.includes("badge") || v.includes("chronology")) return "badge";
      if (v.includes("minimal")) return "minimal";
      return "split";

    case "header":
      if (v.includes("capsule") || v.includes("pill") || v.includes("floating")) return "navbar-capsule";
      if (v.includes("split") || v.includes("utility")) return "navbar-split-utility";
      if (v.includes("brand-block") || v.includes("rail")) return "navbar-brand-block";
      if (v.includes("center")) return "navbar-center";
      if (v.includes("transparent") || v.includes("overlay")) return "navbar-overlay";
      if (v.includes("stacked") || v.includes("tagline")) return "navbar-stacked";
      if (v.includes("cta") || v.includes("button")) return "navbar-cta";
      return "navbar-inline";

    case "footer":
      if (v.includes("social")) return "footer-social";
      if (v.includes("nav") || v.includes("column")) return "footer-columns";
      if (v.includes("location") || v.includes("hour")) return "footer-hours";
      if (v.includes("dark") || v.includes("contrast")) return "footer-contrast";
      return "footer-band";

    case "faq":
      if (v.includes("search")) return "searchable";
      if (v.includes("accordion")) return "accordion";
      if (v.includes("chat") || v.includes("bubble")) return "chat-bubble";
      if (v.includes("column") || v.includes("grid")) return "columns";
      if (v.includes("sidebar") || v.includes("category")) return "sidebar";
      return "simple-list";

    case "benefits":
      if (v.includes("carousel") || v.includes("slide")) return "carousel";
      if (v.includes("bento")) return "bento";
      if (v.includes("icon") || v.includes("row")) return "icon-row";
      if (v.includes("stat")) return "stat-grid";
      if (v.includes("checklist")) return "checklist";
      if (v.includes("table") || v.includes("comparison")) return "comparison";
      if (v.includes("trust")) return "trust-bar";
      if (v.includes("how") || v.includes("work") || v.includes("step")) return "steps";
      if (v.includes("featured")) return "featured-grid";
      return "grid";

    case "testimonials":
      if (v.includes("carousel")) return "carousel";
      if (v.includes("compact")) return "compact";
      if (v.includes("logo")) return "logo-wall";
      if (v.includes("spotlight")) return "spotlight";
      if (v.includes("review") || v.includes("google")) return "reviews";
      if (v.includes("video")) return "video-wall";
      return "grid";

    case "cta":
      if (v.includes("banner")) return "banner";
      if (v.includes("card")) return "card";
      if (v.includes("split") || v.includes("image")) return "split";
      if (v.includes("form") || v.includes("lead")) return "lead-form";
      return "centered";

    case "contact":
      if (v.includes("whatsapp")) return "whatsapp";
      if (v.includes("bento")) return "bento";
      if (v.includes("map") || v.includes("overlay")) return "map";
      if (v.includes("dark")) return "dark-split";
      if (v.includes("minimal") || v.includes("center")) return "centered";
      return "split-form";

    case "stats":
      if (v.includes("counter") || v.includes("row")) return "counter-row";
      if (v.includes("card")) return "card-grid";
      if (v.includes("split")) return "split";
      if (v.includes("big") || v.includes("spotlight")) return "big-number";
      return "counter-row";

    case "pricing":
      if (v.includes("row") || v.includes("horizontal")) return "horizontal-rows";
      if (v.includes("table") || v.includes("comparison")) return "comparison-table";
      if (v.includes("single") || v.includes("highlight")) return "single-card";
      return "cards-3";

    case "gallery":
    case "works":
      if (v.includes("masonry")) return "masonry";
      if (v.includes("carousel")) return "carousel";
      if (v.includes("featured") || v.includes("showcase")) return "featured";
      if (v.includes("before") || v.includes("slider")) return "before-after";
      if (v.includes("video")) return "video-grid";
      return "grid";

    case "menu":
    case "catalog":
      if (v.includes("compact")) return "compact-list";
      if (v.includes("cards")) return "cards";
      if (v.includes("tab")) return "tabs";
      if (v.includes("bento")) return "bento";
      if (v.includes("hero") || v.includes("showcase")) return "showcase-hero";
      if (v.includes("masonry")) return "masonry";
      if (v.includes("table")) return "table";
      if (v.includes("scrollspy") || v.includes("sidebar")) return "sidebar-scrollspy";
      return "grid";

    case "preloader":
      if (v.includes("none")) return "none";
      if (v.includes("top")) return "top-bar";
      if (v.includes("fade")) return "fade";
      if (v.includes("spinner")) return "spinner";
      if (v.includes("counter")) return "counter";
      if (v.includes("pulse")) return "pulse";
      if (v.includes("orbit")) return "orbit";
      if (v.includes("progress")) return "progress";
      if (v.includes("shimmer")) return "shimmer";
      if (v.includes("dot")) return "dots";
      return "spinner";

    default:
      return "grid";
  }
}
