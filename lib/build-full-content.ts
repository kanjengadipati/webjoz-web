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

const LUCIDE_ICON_PATHS: Record<string, string> = {
  plane: `<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>`,
  beddouble: `<path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4"/><path d="M12 4v6"/><path d="M2 18h20"/>`,
  cupsoda: `<path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.5a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/><path d="m12 8 1-6h2"/>`,
  coffee: `<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Zm0 0h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1"/><path d="M6 2v2"/>`,
  utensilscrossed: `<path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8Z"/><path d="M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7"/><path d="m2.1 21.8 6.4-6.3"/><path d="m19 5-7 7"/>`,
  utensils: `<path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/><path d="M15 2v18"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>`,
  building2: `<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,
  scissors: `<circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><path d="M20 4 8.12 15.88"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/>`,
  wrench: `<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,
  shirt: `<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>`,
  heartpulse: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>`,
  shoppingbag: `<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>`,
  dumbbell: `<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>`,
  laptop: `<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>`,
  camera: `<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>`,
  sparkles: `<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>`,
  store: `<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>`,
  shield: `<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>`,
  heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>`,
  globe: `<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>`,
};

function resolveDefaultIconForBusiness(businessType?: string, brandName?: string): string {
  const combined = ((businessType || "") + " " + (brandName || "")).toLowerCase();
  if (combined.includes("travel") || combined.includes("tour") || combined.includes("wisata") || combined.includes("tiket") || combined.includes("haji") || combined.includes("umroh") || combined.includes("flight")) return "plane";
  if (combined.includes("hotel") || combined.includes("penginapan") || combined.includes("homestay") || combined.includes("resort") || combined.includes("villa")) return "beddouble";
  if (combined.includes("teh") || combined.includes("tea") || combined.includes("minuman") || combined.includes("boba") || combined.includes("juice")) return "cupsoda";
  if (combined.includes("kopi") || combined.includes("coffee") || combined.includes("kafe") || combined.includes("cafe")) return "coffee";
  if (combined.includes("kuliner") || combined.includes("restoran") || combined.includes("makanan") || combined.includes("warung") || combined.includes("catering") || combined.includes("resto") || combined.includes("food")) return "utensilscrossed";
  if (combined.includes("properti") || combined.includes("investor") || combined.includes("real estate") || combined.includes("tanah") || combined.includes("developer")) return "building2";
  if (combined.includes("barber") || combined.includes("salon") || combined.includes("pangkas")) return "scissors";
  if (combined.includes("bengkel") || combined.includes("otomotif") || combined.includes("motor") || combined.includes("mobil")) return "wrench";
  if (combined.includes("fashion") || combined.includes("baju") || combined.includes("pakaian") || combined.includes("clothing") || combined.includes("apparel")) return "shirt";
  if (combined.includes("klinik") || combined.includes("dokter") || combined.includes("kesehatan") || combined.includes("health") || combined.includes("medis")) return "heartpulse";
  if (combined.includes("toko") || combined.includes("retail") || combined.includes("shop") || combined.includes("store")) return "shoppingbag";
  if (combined.includes("gym") || combined.includes("fitness") || combined.includes("olahraga")) return "dumbbell";
  if (combined.includes("tech") || combined.includes("software") || combined.includes("digital") || combined.includes("sistem") || combined.includes("komputer")) return "laptop";
  if (combined.includes("foto") || combined.includes("photo") || combined.includes("studio") || combined.includes("kamera")) return "camera";
  return "sparkles";
}

export function generateFaviconSVG(iconName?: string, brandName?: string, color?: string, businessType?: string): string {
  const bg = color || LOGO_COLORS[hashStr(brandName || "A") % LOGO_COLORS.length];
  let key = (iconName || "").toLowerCase().replace(/[-_]/g, "").trim();
  if (!key || !LUCIDE_ICON_PATHS[key]) {
    key = resolveDefaultIconForBusiness(businessType, brandName);
  }
  const path = LUCIDE_ICON_PATHS[key] || LUCIDE_ICON_PATHS["sparkles"];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256"><rect width="256" height="256" rx="52" fill="${bg}"/><g transform="translate(56, 56) scale(6)" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</g></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function generateLogoSVG(brandName: string, color?: string, businessType?: string, fontName?: string): string {
  return generateFaviconSVG("", brandName, color, businessType);
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
  data: { content: Record<string, any>;[key: string]: any },
  businessName: string,
  businessType: string,
  description: string,
  whatsapp: string,
) {
  const c = preserveUserBrand(data.content as Record<string, any>, businessName);
  const primaryColor = data.design_token?.palette?.primary || data.designToken?.palette?.primary;
  const userCustomLogo = data.logo_url || (c.header?.logo_url && !c.header.logo_url.includes("unsplash.com") ? c.header.logo_url : "") || "";

  const existingFavicon = (c.seo?.favicon_url && !c.seo.favicon_url.includes("unsplash.com")) ? c.seo.favicon_url : "";
  const isExplicitCustomFavicon = Boolean(existingFavicon && !existingFavicon.startsWith("data:image/svg+xml"));
  const resolvedFavicon = isExplicitCustomFavicon
    ? existingFavicon
    : (userCustomLogo || generateFaviconSVG(c.header?.icon, businessName, primaryColor, businessType));

  const waUrl = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : null;

  // All images come from the backend (populateImageUrls). Never override with random frontend picks.
  // IMPORTANT: spread ALL AI fields first (...c.section), then only override required fallbacks.
  // This ensures NO field is ever lost when AI returns extra fields (eyebrow, opening_hours, etc.)
  return {
    header: {
      ...c.header,                                                  // ← keep ALL fields from AI (icon, tagline, etc.)
      brand_name: businessName,
      nav_cta_text: c.header?.nav_cta_text || "Hubungi Kami",
      logo_url: userCustomLogo,
      icon: c.header?.icon || "Sparkles",
      tagline: c.header?.tagline || "",
    },
    hero: {
      ...c.hero,                                                    // ← keep ALL fields from AI (eyebrow, cta_secondary_text, opening_hours, etc.)
      headline: c.hero?.headline || businessName,
      subheadline: c.hero?.subheadline || description,
      cta_text: c.hero?.cta_text || c.hero?.cta_label || "Hubungi Kami",
      // Only override cta_url with WhatsApp link when the original target is a
      // contact-style destination. Section-scroll hashes (#catalog, #menu, etc.)
      // must be preserved so "Lihat Katalog" / "Lihat Menu" buttons work correctly.
      cta_url: (() => {
        let orig = (c.hero?.cta_url || "").trim();
        const text = (c.hero?.cta_text || c.hero?.cta_label || "").toLowerCase();
        const isShopping =
          text.includes("belanja") ||
          text.includes("katalog") ||
          text.includes("catalog") ||
          text.includes("catalogue") ||
          text.includes("shop") ||
          text.includes("store") ||
          text.includes("produk") ||
          text.includes("product") ||
          text.includes("koleksi") ||
          text.includes("collection") ||
          text.includes("buy") ||
          text.includes("order");
        const isMenu =
          text.includes("menu") ||
          text.includes("hidangan") ||
          text.includes("dish") ||
          text.includes("dining") ||
          text.includes("food");

        if (!orig || orig === "#contact" || orig === "#" || orig === "/") {
          if (isShopping && (c.catalog || !c.menu)) {
            orig = "#catalog";
          } else if (isMenu && (c.menu || !c.catalog)) {
            orig = "#menu";
          } else if (!orig) {
            orig = "#contact";
          }
        }

        const isSectionHash = orig.startsWith("#") && orig !== "#contact";
        return waUrl && !isSectionHash ? waUrl : orig;
      })(),
      image_url: c.hero?.image_url || "",
      badge_text: c.hero?.badge_text || "",
    },
    about: {
      ...c.about,
      title: c.about?.title || `Tentang ${businessName}`,
      // Fallback chain: AI body → user description → generic placeholder
      // Prevents blank paragraphs when AI returned empty string and user skipped description
      body: c.about?.body || description ||
        `${businessName} hadir untuk memberikan layanan terbaik bagi Anda. Kami berkomitmen menghadirkan pengalaman yang memuaskan dan terpercaya bagi setiap pelanggan.`,
      image_url: c.about?.image_url || "",
    },
    benefits: {
      ...c.benefits,
      title: c.benefits?.title || "Kenapa Pilih Kami?",
      // When AI returned [] (empty items), generate 3 generic benefit cards so the section
      // is never blank. Real AI content always replaces these on a new generation.
      items: (c.benefits?.items && c.benefits.items.length > 0)
        ? c.benefits.items
        : [
          { title: "Layanan Terpercaya", description: `${businessName} mengutamakan kepuasan pelanggan dalam setiap langkah pelayanan.`, icon: "shield" },
          { title: "Pengalaman Teruji", description: "Sudah melayani banyak pelanggan dengan hasil yang konsisten dan memuaskan.", icon: "star" },
          { title: "Mudah Dihubungi", description: "Tim kami siap membantu Anda kapan saja melalui berbagai saluran komunikasi.", icon: "message-circle" },
        ],
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
      tagline: c.footer?.tagline || description || `Layanan terbaik dari ${businessName} untuk Anda.`,
      copyright_text: c.footer?.copyright_text
        ? c.footer.copyright_text.replace(/\b20[12][0-9]\b/g, (y: string) => {
            const yr = parseInt(y, 10);
            return yr < new Date().getFullYear() ? String(new Date().getFullYear()) : y;
          })
        : `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
    ...(c.menu ? { menu: c.menu } : {}),
    ...(c.catalog ? { catalog: c.catalog } : {}),
    ...(c.gallery ? { gallery: c.gallery } : {}),
    ...(c.works ? { works: c.works } : {}),
    ...(c.stats ? { stats: c.stats } : {}),
    ...(c.skills ? { skills: c.skills } : {}),
    ...(c.pricing ? { pricing: c.pricing } : {}),
    ...(c.partners ? { partners: c.partners } : {}),
    ...(c.payments ? { payments: c.payments } : {}),
    seo: {
      ...c.seo,
      title: c.seo?.title || businessName,
      description: c.seo?.description || description,
      favicon_url: resolvedFavicon,
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
