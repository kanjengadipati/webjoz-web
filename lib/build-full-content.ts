// FILE: lib/build-full-content.ts
//
// Mengisi gap pada konten hasil AI dengan nilai fallback yang wajib benar
// (nama brand, nomor WA → wa.me link, dst.) supaya section TIDAK PERNAH
// kosong — baik saat dipakai untuk preview di wizard, MAUPUN saat
// benar-benar disimpan ke server.
//
// PENTING: dulu fungsi ini hanya dipakai untuk preview (rendering di memori),
// sementara proses SAVE (handleGoToEditor di site-wizard.tsx, dan auto-save
// setelah login di app/create/page.tsx) menyimpan `previewData.content` /
// `pending.previewContent` MENTAH — hasil AI asli tanpa fallback ini.
// Akibatnya kalau AI mengembalikan field kosong (mis. provider "mock", atau
// AI gagal mengisi sebagian field), preview di wizard tetap kelihatan utuh
// (karena dipoles fallback ini), tapi site yang tersimpan di server jadi
// bolong — persis kasus "14 field perlu dicek" di Editor.
//
// Fix: import fungsi ini di KEDUA tempat (wizard save + auto-save login),
// dan jalankan sebelum body PUT /sites/:id/content dikirim, supaya yang
// disimpan = yang dilihat user di preview.

export function preserveUserBrand(content: Record<string, any>, businessName: string): Record<string, any> {
  return {
    ...content,
    header: {
      ...(content.header || {}),
      brand_name: businessName,
    },
    footer: {
      ...(content.footer || {}),
      brand_name: businessName,
    },
    seo: {
      ...(content.seo || {}),
      title: content.seo?.title || businessName,
    },
  };
}

const LOGO_COLORS = [
  "#4F46E5", "#7C3AED", "#2563EB", "#0891B2",
  "#059669", "#65A30D", "#D97706", "#DC2626",
  "#DB2777", "#9333EA", "#0EA5E5", "#14B8A6",
];

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const LOGO_FONTS: Record<string, string> = {
  kuliner: `system-ui,-apple-system,sans-serif`,
  jasa: `Georgia,"Times New Roman",serif`,
  produk: `"SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif`,
};

function generateLogoSVG(brandName: string, color?: string, businessType?: string, fontName?: string): string {
  const words = (brandName || "A").trim().split(/\s+/).slice(0, 3);
  const initials = words.map(w => w[0].toUpperCase()).join("");
  const bg = color || LOGO_COLORS[hashStr(brandName) % LOGO_COLORS.length];
  const fontSize = initials.length > 2 ? 80 : initials.length > 1 ? 100 : 120;
  const font = fontName ? fontName.replace(/['"]/g, "") : (LOGO_FONTS[businessType || ""] || `system-ui,-apple-system,sans-serif`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="52" fill="${bg}"/><text x="128" y="164" font-family="${font}" font-size="${fontSize}" font-weight="700" fill="#fff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function autoTileStyle(token?: Record<string, any>): string {
  const mood = (token?.mood || "").toLowerCase();
  const bg = token?.palette?.background || "";
  const isDark = bg.startsWith("#") && parseInt(bg.slice(1), 16) < 0x444444;
  if (isDark || mood.includes("dark") || mood.includes("premium") || mood.includes("bold")) return "dark";
  if (mood.includes("natural") || mood.includes("warm") || mood.includes("earthy") || mood.includes("fresh")) return "light";
  return "default";
}

export function buildFullContent(
  data: { content: Record<string, any>; [key: string]: any },
  businessName: string,
  businessType: string,
  description: string,
  whatsapp: string,
  matraValue?: string
) {
  const c = preserveUserBrand(data.content as Record<string, any>, businessName);
  const primaryColor = data.design_token?.palette?.primary || data.designToken?.palette?.primary;
  const headingFont = data.design_token?.typography?.heading_font || data.designToken?.typography?.heading_font;
  const logoUrl = generateLogoSVG(businessName, primaryColor, businessType, headingFont);

  const waUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;

  // All images come from the backend (populateImageUrls). Never override with random frontend picks.
  // IMPORTANT: spread ALL AI fields first (...c.section), then only override required fallbacks.
  // This ensures NO field is ever lost when AI returns extra fields (eyebrow, opening_hours, etc.)
  return {
    header: {
      ...c.header,                                                  // ← keep ALL fields from AI (icon, tagline, etc.)
      brand_name: businessName,
      nav_cta_text: c.header?.nav_cta_text || "Hubungi Kami",
      logo_url: c.header?.logo_url || logoUrl,
      tagline: c.header?.tagline || "",
    },
    hero: {
      ...c.hero,                                                    // ← keep ALL fields from AI (eyebrow, cta_secondary_text, opening_hours, etc.)
      headline: c.hero?.headline || businessName,
      matra: c.hero?.matra || matraValue || "",
      subheadline: c.hero?.subheadline || description,
      cta_text: c.hero?.cta_text || c.hero?.cta_label || "Hubungi Kami",
      cta_url: waUrl ?? (c.hero?.cta_url || "#contact"),           // ← preserve AI value if WA not provided
      image_url: c.hero?.image_url || "",
      badge_text: c.hero?.badge_text || "",
    },
    about: {
      ...c.about,
      title: c.about?.title || `Tentang ${businessName}`,
      body: c.about?.body || description,
      image_url: c.about?.image_url || "",
    },
    benefits: {
      ...c.benefits,
      title: c.benefits?.title || "Kenapa Pilih Kami?",
      items: c.benefits?.items ?? [],
    },
    testimonials: {
      ...c.testimonials,
      items: c.testimonials?.items ?? [],
    },
    faq: {
      ...c.faq,
      title: c.faq?.title || "Pertanyaan Umum",
      items: c.faq?.items ?? [],
    },
    cta: {
      ...c.cta,
      headline: c.cta?.headline || `Siap Memulai dengan ${businessName}?`,
      button_text: c.cta?.button_text || "Hubungi Sekarang",
      button_url: waUrl ?? (c.cta?.button_url || "#contact"),      // ← preserve AI value if WA not provided
    },
    contact: {
      ...c.contact,
      title: c.contact?.title || "Hubungi Kami",
      address: c.contact?.address || "",
      phone: c.contact?.phone || whatsapp || "",
      email: c.contact?.email || "",
      align: c.contact?.align || "center",
      map_tile_style: c.contact?.map_tile_style || autoTileStyle(data.design_token || data.designToken),
    },
    footer: {
      ...c.footer,
      brand_name: businessName,
      tagline: c.footer?.tagline || description,
      copyright_text: c.footer?.copyright_text || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
    ...(c.menu ? { menu: c.menu } : {}),
    ...(c.catalog ? { catalog: c.catalog } : {}),
    ...(c.gallery ? { gallery: c.gallery } : {}),
    seo: {
      ...c.seo,
      title: c.seo?.title || businessName,
      description: c.seo?.description || description,
      favicon_url: c.seo?.favicon_url || logoUrl,
      og_image_url: c.seo?.og_image_url || "",
      keywords: c.seo?.keywords ?? [],
      og_type: c.seo?.og_type || "website",
      og_locale: c.seo?.og_locale || "id_ID",
      og_site_name: c.seo?.og_site_name || businessName,
      twitter_card: c.seo?.twitter_card || "summary_large_image",
      robots: c.seo?.robots || "index, follow",
      canonical_path: c.seo?.canonical_path || "/",
    },
  };
}
