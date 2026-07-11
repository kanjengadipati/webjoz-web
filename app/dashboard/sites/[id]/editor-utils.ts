import { 
  Layout, User, Award, HelpCircle, Mail, BookOpen, Globe, UtensilsCrossed, ShoppingBag, Star, Camera, MessageCircle
} from "lucide-react";
import { SparkleIcon } from "@/components/sparkle-icon";

export const stripRegeneratedMarkers = (value: any): any => {
  if (typeof value === "string") {
    return value.replace(/\s*\(Regenerated\)/gi, "").replace(/\s{2,}/g, " ").trim();
  }
  if (Array.isArray(value)) {
    return value.map(stripRegeneratedMarkers);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, stripRegeneratedMarkers(item)])
    );
  }
  return value;
};

export const BODY_SECTION_KEYS = ["hero", "about", "benefits", "testimonials", "menu", "catalog", "gallery", "cta", "faq", "contact"];
export const EDITOR_SECTION_KEYS = ["header", ...BODY_SECTION_KEYS, "footer", "seo", "floating"];

// Sections that are only shown in the sidebar when content actually has that key.
// "faq" is here because the AI recommendation logic may prune it for certain business types
// (e.g. coffee shops, restaurants). If the backend didn't generate faq, we don't show the tab.
export const OPTIONAL_SECTION_KEYS = ["menu", "catalog", "testimonials", "gallery", "faq"];

export const SECTION_META: Record<string, { label: string; icon: any }> = {
  header:       { label: "Header",       icon: Layout },
  hero:         { label: "Hero",         icon: Layout },
  about:        { label: "Tentang",      icon: User },
  benefits:     { label: "Keunggulan",   icon: Award },
  testimonials: { label: "Testimoni",    icon: Star },
  menu:         { label: "Menu",         icon: UtensilsCrossed },
  catalog:      { label: "Katalog",      icon: ShoppingBag },
  gallery:      { label: "Galeri",       icon: Camera },
  faq:          { label: "FAQ",          icon: HelpCircle },
  cta:          { label: "CTA",          icon: SparkleIcon },
  contact:      { label: "Kontak",       icon: Mail },
  footer:       { label: "Footer",       icon: BookOpen },
  seo:          { label: "SEO",          icon: Globe },
  floating:     { label: "Tombol Aksi",  icon: MessageCircle },
};

export const AI_SUGGESTIONS: Record<string, string[]> = {
  header:       ["Buat brand terasa lebih premium", "CTA nav lebih jelas untuk WhatsApp", "Ringkas nama brand agar mudah diingat"],
  hero:         ["Buat hero lebih emosional dan menggugah", "Tekankan masalah utama pelanggan", "Buat CTA lebih spesifik dan mendesak"],
  about:        ["Jadikan cerita bisnis lebih hangat", "Tambahkan detail konkret: tahun, lokasi, bahan", "Buat narasi lebih personal dan manusiawi"],
  benefits:     ["Ubah benefit menjadi hasil nyata", "Tambahkan angka/stat jika memungkinkan", "Buat tiap poin lebih singkat dan tajam"],
  testimonials: ["Buat kutipan lebih spesifik dan believable", "Tambahkan detail nyata di setiap testimoni", "Variasikan profil pemberi testimoni"],
  menu:         ["Buat nama menu lebih menggugah selera", "Tambahkan deskripsi yang membuat lapar", "Perbarui harga semua item menu"],
  catalog:      ["Buat nama produk lebih menarik", "Tambahkan badge Best Seller untuk produk terlaris", "Perbarui harga dan deskripsi produk"],
  faq:          ["Jawab keberatan sebelum membeli", "Buat jawaban lebih ramah dan meyakinkan", "Tambahkan info harga atau proses pemesanan"],
  cta:          ["Buat CTA lebih kuat untuk konversi", "Tulis headline yang menutup keraguan", "Tambahkan trust signal yang mengurangi friction"],
  contact:      ["Lengkapi kontak agar lebih terpercaya", "Buat instruksi kunjungan lebih jelas", "Tulis kontak dengan nada ramah"],
  gallery:      ["Tambahkan foto suasana dan interior", "Gunakan foto asli untuk membangun kepercayaan", "Pilih foto dengan pencahayaan yang baik"],
  footer:       ["Buat tagline footer lebih memorable", "Ringkas copyright dan tagline", "Samakan tone footer dengan brand"],
  seo:          ["Buat title SEO lebih menjual", "Masukkan kota dan layanan utama", "Buat meta description lebih klik-worthy", "Generate keywords SEO", "Saran OG type dan Twitter card"],
};

export const getOrderedSections = (designToken: any, content?: any, hiddenByAdmin: string[] = []) => {
  const adminHidden = new Set(hiddenByAdmin);
  const tokenOrder = Array.isArray(designToken?.layout?.section_order)
    ? designToken.layout.section_order.filter((key: string) => BODY_SECTION_KEYS.includes(key) && !adminHidden.has(key))
    : [];
  // Include optional sections (menu/catalog) only when content actually has them
  // and they are not hidden by the superadmin
  const availableBodyKeys = BODY_SECTION_KEYS.filter((key) => {
    if (adminHidden.has(key)) return false;
    if (OPTIONAL_SECTION_KEYS.includes(key)) {
      return content ? !!content[key] : tokenOrder.includes(key);
    }
    return true;
  });
  const bodyOrder = [...tokenOrder, ...availableBodyKeys.filter((key) => !tokenOrder.includes(key))];
  return ["header", ...bodyOrder, "footer", "seo", "floating"].filter((key) => !adminHidden.has(key));
};

export const cloneData = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

export const isPlaceholderValue = (value: any, key = "") => {
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  if (["cta_url", "button_url"].includes(key) && !/^https?:\/\/|^#|^mailto:|^tel:|^whatsapp:/i.test(value.trim())) return true;
  return [
    "placeholder",
    "lorem",
    "loremflickr.com",
    "picsum.photos",
    "contoh",
    "cth.",
    "email@domain.com",
    "you@mail.com",
    "08xx",
    "08123456789",
    "alamat",
    "https://...",
  ].some((needle) => normalized.includes(needle));
};

export const collectQualityIssues = (content: any) => {
  const fields: Array<{ path: string; label: string; value: any; required?: boolean }> = [
    { path: "header.brand_name", label: "Nama brand", value: content?.header?.brand_name, required: true },
    { path: "header.nav_cta_text", label: "CTA navigasi", value: content?.header?.nav_cta_text, required: true },
    { path: "hero.headline", label: "Headline hero", value: content?.hero?.headline, required: true },
    { path: "hero.subheadline", label: "Subheadline hero", value: content?.hero?.subheadline, required: true },
    { path: "hero.cta_text", label: "Teks CTA hero", value: content?.hero?.cta_text, required: true },
    { path: "hero.cta_url", label: "URL CTA hero", value: content?.hero?.cta_url, required: true },
    { path: "about.title", label: "Judul tentang", value: content?.about?.title, required: true },
    { path: "about.body", label: "Deskripsi tentang", value: content?.about?.body, required: true },
    { path: "benefits.title", label: "Judul benefit", value: content?.benefits?.title, required: true },
    { path: "cta.headline", label: "Headline CTA", value: content?.cta?.headline, required: true },
    { path: "cta.button_text", label: "Teks tombol CTA", value: content?.cta?.button_text, required: true },
    { path: "cta.button_url", label: "URL tombol CTA", value: content?.cta?.button_url, required: true },
    { path: "contact.title", label: "Judul kontak", value: content?.contact?.title, required: true },
    { path: "contact.phone", label: "Nomor WhatsApp", value: content?.contact?.phone },
    // address and email are optional — never flag them
    { path: "seo.title", label: "SEO title", value: content?.seo?.title },
    { path: "seo.description", label: "SEO description", value: content?.seo?.description },
  ];

  (content?.benefits?.items || []).forEach((item: any, idx: number) => {
    fields.push({ path: `benefits.items.${idx}.title`, label: `Benefit #${idx + 1}`, value: item?.title, required: true });
    fields.push({ path: `benefits.items.${idx}.description`, label: `Deskripsi benefit #${idx + 1}`, value: item?.description, required: true });
  });
  (content?.faq?.items || []).forEach((item: any, idx: number) => {
    fields.push({ path: `faq.items.${idx}.question`, label: `Pertanyaan FAQ #${idx + 1}`, value: item?.question, required: true });
    fields.push({ path: `faq.items.${idx}.answer`, label: `Jawaban FAQ #${idx + 1}`, value: item?.answer, required: true });
  });

  // Only flag required fields OR non-empty optional fields that contain placeholder text
  const issues = fields.filter((field) => {
    if (!field.required && (!field.value || field.value === "")) return false;
    if (!field.required && typeof field.value !== "string") return false;
    const parts = field.path.split(".");
    return isPlaceholderValue(field.value, parts[parts.length - 1]);
  });
  const score = fields.length ? Math.max(0, Math.round(((fields.length - issues.length) / fields.length) * 100)) : 100;
  return { score, issues };
};

/** Returns issues that belong to a specific section (e.g. "hero", "about"). */
export const getSectionQualityIssues = (content: any, section: string) => {
  const { issues } = collectQualityIssues(content);
  return issues.filter((issue) => issue.path.startsWith(section + "."));
};

/** Returns quality score (0-100) for a specific section only. */
export const getSectionScore = (content: any, section: string): number => {
  const sectionIssues = getSectionQualityIssues(content, section);
  const sectionFields = collectQualityIssues(content).issues.filter(() => true);

  // Count how many fields belong to this section
  const allFields: Array<{ path: string }> = [
    { path: "header.brand_name" }, { path: "header.nav_cta_text" },
    { path: "hero.headline" }, { path: "hero.subheadline" }, { path: "hero.cta_text" }, { path: "hero.cta_url" },
    { path: "about.title" }, { path: "about.body" },
    { path: "benefits.title" },
    { path: "cta.headline" }, { path: "cta.button_text" }, { path: "cta.button_url" },
    { path: "contact.title" }, { path: "contact.phone" },
    { path: "seo.title" }, { path: "seo.description" },
  ];

  // Add dynamic fields
  (content?.benefits?.items || []).forEach((_: any, idx: number) => {
    allFields.push({ path: `benefits.items.${idx}.title` });
    allFields.push({ path: `benefits.items.${idx}.description` });
  });
  (content?.faq?.items || []).forEach((_: any, idx: number) => {
    allFields.push({ path: `faq.items.${idx}.question` });
    allFields.push({ path: `faq.items.${idx}.answer` });
  });

  const relevantFields = allFields.filter((f) => f.path.startsWith(section + "."));
  const relevantIssuePaths = new Set(sectionIssues.map((i) => i.path));
  const bad = relevantFields.filter((f) => relevantIssuePaths.has(f.path)).length;
  const total = relevantFields.length;
  return total ? Math.max(0, Math.round(((total - bad) / total) * 100)) : 100;
};

export const summarizeDiff = (before: any, after: any) => {
  const rows: Array<{ label: string; before: string; after: string }> = [];
  const walk = (oldVal: any, newVal: any, path: string[] = []) => {
    if (rows.length >= 8) return;
    if (typeof oldVal === "string" || typeof newVal === "string") {
      if ((oldVal || "") !== (newVal || "")) {
        rows.push({ label: path.join(" > "), before: oldVal || "", after: newVal || "" });
      }
      return;
    }
    if (Array.isArray(oldVal) || Array.isArray(newVal)) {
      const max = Math.max(oldVal?.length || 0, newVal?.length || 0);
      for (let i = 0; i < max; i += 1) walk(oldVal?.[i], newVal?.[i], [...path, `#${i + 1}`]);
      return;
    }
    if (oldVal && newVal && typeof oldVal === "object" && typeof newVal === "object") {
      const keys = Array.from(new Set([...Object.keys(oldVal), ...Object.keys(newVal)]));
      keys.forEach((key) => walk(oldVal[key], newVal[key], [...path, key]));
    }
  };
  walk(before, after);
  return rows;
};

export const isDesignTokenEqual = (a: any, b: any) => {
  if (!a || !b) return false;
  return (
    a.mood === b.mood &&
    a.palette?.primary === b.palette?.primary &&
    a.palette?.accent === b.palette?.accent &&
    a.palette?.background === b.palette?.background &&
    a.palette?.surface === b.palette?.surface &&
    a.palette?.text === b.palette?.text &&
    a.typography?.heading_font === b.typography?.heading_font &&
    a.typography?.body_font === b.typography?.body_font &&
    JSON.stringify(a.layout?.section_order) === JSON.stringify(b.layout?.section_order)
  );
};

/**
 * Returns section keys that should be automatically hidden on first editor
 * load because their content arrays are empty (no items / no categories).
 *
 * Only adds keys that are not already present in existingHidden so we don't
 * overwrite deliberate user choices. The user can reveal any hidden section
 * by clicking the eye icon in the section sidebar.
 *
 * NOTE: We intentionally do NOT auto-hide based on section_order alone.
 * If a user explicitly reveals a section and adds content, it must survive
 * reloads even if the AI's section_order doesn't list it.
 * The section_order is already enforced by:
 *   - Template sectionOrder computation (starts from AI's recommendation)
 *   - filterEmptySections() which hides empty sections on the live site
 */
export const getAutoHiddenSections = (
  content: any,
  existingHidden: string[] = [],
): string[] => {
  const result: string[] = [];

  const OPTIONAL = ["faq", "testimonials", "gallery", "menu", "catalog"] as const;

  const isEmpty = (key: string): boolean => {
    if (key === "menu" || key === "catalog") return !(content?.[key]?.categories?.length);
    return !(content?.[key]?.items?.length);
  };

  for (const key of OPTIONAL) {
    if (existingHidden.includes(key)) continue; // already there, skip
    if (isEmpty(key)) result.push(key);
  }

  return result;
};

