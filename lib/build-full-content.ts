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

export function buildFullContent(
  data: { content: Record<string, any>; [key: string]: any },
  businessName: string,
  businessType: string,
  description: string,
  whatsapp: string,
  matraValue?: string
) {
  const c = preserveUserBrand(data.content as Record<string, any>, businessName);
  const logoUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName)}&background=random&color=fff&size=256&format=png`;

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
    },
    footer: {
      ...c.footer,
      brand_name: businessName,
      tagline: c.footer?.tagline || description,
      copyright_text: c.footer?.copyright_text || `© ${new Date().getFullYear()} ${businessName}. All rights reserved.`,
    },
    ...(c.menu ? { menu: c.menu } : {}),
    ...(c.catalog ? { catalog: c.catalog } : {}),
    seo: {
      ...c.seo,
      title: c.seo?.title || businessName,
      description: c.seo?.description || description,
      favicon_url: c.seo?.favicon_url || logoUrl,
      og_image_url: c.seo?.og_image_url || "",
    },
  };
}
