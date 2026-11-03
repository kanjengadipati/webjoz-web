// Single source of truth for all section variant options.
// Every consumer (editor dropdown, design-assets admin UI, etc.) imports from here.

import { HERO_VARIANTS } from "./hero/meta";

export interface VariantOption {
  value: string;
  label: string;
  labelKey?: string;
  description?: string;
  descriptionKey?: string;
  group?: string; // optional grouping label for dropdown submenu (e.g. "Dasar", "Visual Foto")
}

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
  about: [
    { value: "classic",      labelKey: "variantAboutClassic",      label: "Klasik",         descriptionKey: "variantAboutClassicDesc",      description: "Teks di kiri, konten bersih tanpa gambar besar." },
    { value: "split-image",  labelKey: "variantAboutSplitImage",   label: "Split + Gambar", descriptionKey: "variantAboutSplitImageDesc",   description: "Teks di kiri, gambar besar di kanan." },
    { value: "stat-heavy",   labelKey: "variantAboutStatHeavy",    label: "Statistik",      descriptionKey: "variantAboutStatHeavyDesc",    description: "Tampilkan angka highlight dan statistik bisnis." },
    { value: "timeline",     labelKey: "variantAboutTimeline",     label: "Timeline",       descriptionKey: "variantAboutTimelineDesc",     description: "Kronologi perjalanan bisnis (membutuhkan milestones)." },
    { value: "team-grid",    labelKey: "variantAboutTeamGrid",     label: "Grid Tim",       descriptionKey: "variantAboutTeamGridDesc",     description: "Grid anggota tim (membutuhkan team_members)." },
  ],
  benefits: [
    { value: "grid",               labelKey: "variantBenefitsGrid",              label: "Grid",                          descriptionKey: "variantBenefitsGridDesc",              description: "Kartu ikon tersusun grid rapi." },
    { value: "featured-grid",      labelKey: "variantBenefitsFeaturedGrid",      label: "Grid Highlight",                descriptionKey: "variantBenefitsFeaturedGridDesc",      description: "Kartu pertama berukuran besar sebagai sorotan utama, sisanya dalam grid rapi." },
    { value: "icon-row",           labelKey: "variantBenefitsIconRow",           label: "Baris Ikon Horizontal",         descriptionKey: "variantBenefitsIconRowDesc",           description: "Ikon lingkaran besar terpusat berjajar horizontal dengan garis pemisah." },
    { value: "stat-grid",          labelKey: "variantBenefitsStatGrid",          label: "Grid Statistik",                descriptionKey: "variantBenefitsStatGridDesc",          description: "Grid dengan angka/statistik di tiap item." },
    { value: "checklist",          labelKey: "variantBenefitsChecklist",         label: "Checklist",                     descriptionKey: "variantBenefitsChecklistDesc",         description: "List centang vertikal, sederhana dan langsung." },
    { value: "comparison-table",   labelKey: "variantBenefitsComparisonTable",   label: "Tabel Perbandingan",             descriptionKey: "variantBenefitsComparisonTableDesc",   description: "Perbandingan A vs B dalam tabel (membutuhkan comparison)." },
    { value: "bento-grid",         labelKey: "variantBenefitsBentoGrid",         label: "Bento Grid",                    descriptionKey: "variantBenefitsBentoGridDesc",         description: "Grid asimetris ala bento box — kartu berukuran bervariasi, visual dinamis." },
    { value: "trust-bar",          labelKey: "variantBenefitsTrustBar",          label: "Trust Bar (Toko Online & Retail)", group: "E-Commerce", descriptionKey: "variantBenefitsTrustBarDesc", description: "Strip horizontal penjamin kepercayaan belanja." },
    { value: "how-it-works",       labelKey: "variantBenefitsHowItWorks",        label: "Cara Kerja / How It Works",     descriptionKey: "variantBenefitsHowItWorksDesc",        description: "Langkah proses berurutan dengan angka bertahap." },
  ],
  testimonials: [
    { value: "carousel",           labelKey: "variantTestimonialsCarousel",          label: "Carousel",           descriptionKey: "variantTestimonialsCarouselDesc",          description: "Slide otomatis, satu testimoni per tampilan." },
    { value: "compact",            labelKey: "variantTestimonialsCompact",           label: "Ringkas",            descriptionKey: "variantTestimonialsCompactDesc",           description: "Avatar kecil + kutipan singkat dalam satu baris." },
    { value: "grid",               labelKey: "variantTestimonialsGrid",              label: "Grid",               descriptionKey: "variantTestimonialsGridDesc",              description: "Semua testimoni tampil sekaligus dalam grid." },
    { value: "logo-wall",          labelKey: "variantTestimonialsLogoWall",          label: "Logo Klien",         descriptionKey: "variantTestimonialsLogoWallDesc",          description: "Logo perusahaan klien (membutuhkan logo_url)." },
    { value: "featured-spotlight", labelKey: "variantTestimonialsFeaturedSpotlight", label: "Sorotan",            descriptionKey: "variantTestimonialsFeaturedSpotlightDesc", description: "Satu testimoni utama ditonjolkan." },
    { value: "google-reviews",     labelKey: "variantTestimonialsGoogleReviews",     label: "Google Reviews",     descriptionKey: "variantTestimonialsGoogleReviewsDesc",     description: "Kartu gaya Google: foto profil, bintang, badge Google." },
    { value: "video-wall",         labelKey: "variantVideoWall",                     label: "Dinding Video / UGC",descriptionKey: "variantTestimonialsVideoWallDesc",          description: "Grid testimoni bergaya UGC dengan thumbnail video dan pemutar ringan." },
  ],
  cta: [
    { value: "banner",           labelKey: "variantCtaBanner",          label: "Banner",               descriptionKey: "variantCtaBannerDesc",          description: "Strip warna penuh lebar, teks + tombol." },
    { value: "card",             labelKey: "variantCtaCard",            label: "Kartu",                descriptionKey: "variantCtaCardDesc",            description: "Kotak terpusat dengan shadow dan border." },
    { value: "centered",         labelKey: "variantCtaCentered",        label: "Tengah",               descriptionKey: "variantCtaCenteredDesc",        description: "Teks dan tombol rata tengah tanpa background." },
    { value: "split-image",      labelKey: "variantCtaSplitImage",      label: "Split + Gambar",       descriptionKey: "variantCtaSplitImageDesc",      description: "Teks di kiri, gambar di kanan (membutuhkan image_url)." },
    { value: "inline-lead-form", labelKey: "variantCtaInlineLeadForm",  label: "Form Inquiry Inline",  descriptionKey: "variantCtaInlineLeadFormDesc",  description: "Teks di kiri, form nama/email/telepon di kanan untuk tangkap lead." },
  ],
  faq: [
    { value: "accordion",          labelKey: "variantFaqAccordion",         label: "Akordion",           descriptionKey: "variantFaqAccordionDesc",         description: "Expand/collapse per item, hemat ruang." },
    { value: "simple",             labelKey: "variantFaqSimple",            label: "Sederhana",          descriptionKey: "variantFaqSimpleDesc",            description: "Semua Q&A tampil terbuka tanpa interaksi." },
    { value: "columns",            labelKey: "variantFaqColumns",           label: "Kolom",              descriptionKey: "variantFaqColumnsDesc",           description: "2 kolom Q&A berdampingan." },
    { value: "sidebar-category",   labelKey: "variantFaqSidebarCategory",   label: "Kategori Sidebar",   descriptionKey: "variantFaqSidebarCategoryDesc",   description: "Filter Q&A per kategori (membutuhkan category)." },
    { value: "two-column-grid",    labelKey: "variantFaqTwoColumnGrid",     label: "Grid 2 Kolom",       descriptionKey: "variantFaqTwoColumnGridDesc",     description: "Q&A dalam kartu grid 2 kolom, semua terbuka." },
    { value: "chat-bubble-style",  labelKey: "variantFaqChatBubble",        label: "Gaya Chat",          descriptionKey: "variantFaqChatBubbleDesc",        description: "Q&A seperti percakapan chat — pertanyaan di kanan, jawaban di kiri." },
  ],
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
  stats: [
    { value: "counter-row",            labelKey: "variantStatsCounterRow",          label: "Baris Metrik",         descriptionKey: "variantStatsCounterRowDesc",          description: "Baris metrik horizontal dengan pembatas rapi dan angka besar." },
    { value: "card-grid",              labelKey: "variantStatsCardGrid",            label: "Grid Kartu",           descriptionKey: "variantStatsCardGridDesc",            description: "Kartu statistik melayang dengan ikon dan efek glow aksen." },
    { value: "minimal-split",          labelKey: "variantStatsMinimalSplit",        label: "Split Minimalis",      descriptionKey: "variantStatsMinimalSplitDesc",        description: "Judul narasi di sisi kiri, matriks 2x2 angka di sisi kanan." },
    { value: "big-number-spotlight",   labelKey: "variantStatsBigNumberSpotlight",  label: "Sorotan Angka Besar",  descriptionKey: "variantStatsBigNumberSpotlightDesc",  description: "Satu metrik utama berukuran raksasa dengan sorotan aksen dan sub-metrik pendukung." },
  ],
  partners: [
    { value: "logo-wall",             labelKey: "variantPartnersLogoWall",           label: "Grid Logo / Brand",        descriptionKey: "variantPartnersLogoWallDesc",           description: "Grid logo/brand mitra dengan efek grayscale dan hover berwarna." },
    { value: "marquee",               labelKey: "variantPartnersMarquee",            label: "Ticker Berjalan",          descriptionKey: "variantPartnersMarqueeDesc",            description: "Banner logo/nama brand berjalan otomatis tanpa henti (infinite loop)." },
    { value: "pill-grid",             labelKey: "variantPartnersPillGrid",           label: "Grid Pill Interaktif",     descriptionKey: "variantPartnersPillGridDesc",           description: "Koleksi badge/pill brand modern dengan inisial dan tag kategori." },
    { value: "featured-collab-grid",  labelKey: "variantPartnersFeaturedCollabGrid", label: "Kolaborasi Unggulan",       descriptionKey: "variantPartnersFeaturedCollabGridDesc", description: "Grid mitra/klien dengan kartu sorotan kolaborasi utama dan ringkasan peran." },
  ],
  pricing: [
    { value: "cards",                labelKey: "variantPricingCards",               label: "Kartu Paket",            descriptionKey: "variantPricingCardsDesc",               description: "Kartu 3 tier klasik dengan penanda paket terpopuler dan tombol aksi." },
    { value: "horizontal-rows",      labelKey: "variantPricingHorizontalRows",      label: "Baris Horizontal",       descriptionKey: "variantPricingHorizontalRowsDesc",      description: "Daftar paket horizontal dengan fitur di kiri dan harga/tombol di kanan." },
    { value: "comparison-table",     labelKey: "variantPricingComparisonTable",     label: "Tabel Perbandingan",     descriptionKey: "variantPricingComparisonTableDesc",     description: "Tabel perbandingan fitur lengkap antar paket layanan." },
    { value: "single-tier-highlight",labelKey: "variantPricingSingleTierHighlight", label: "Satu Paket Sorotan",     descriptionKey: "variantPricingSingleTierHighlightDesc", description: "Satu kartu besar menonjol — cocok bisnis dengan satu penawaran utama/membership." },
  ],
  menu: [
    { value: "grid",                       labelKey: "variantMenuGrid",                    label: "Grid",                group: "Dasar",       descriptionKey: "variantMenuGridDesc",                    description: "Kartu produk dalam grid dengan foto." },
    { value: "compact",                    labelKey: "variantMenuCompact",                 label: "Ringkas",             group: "Dasar",       descriptionKey: "variantMenuCompactDesc",                 description: "List kompak nama + harga tanpa foto besar." },
    { value: "cards",                      labelKey: "variantMenuCards",                   label: "Kartu",               group: "Dasar",       descriptionKey: "variantMenuCardsDesc",                   description: "Kartu besar dengan foto dan deskripsi." },
    { value: "text-list",                  labelKey: "variantMenuTextList",                label: "Teks List",           group: "List",        descriptionKey: "variantMenuTextListDesc",                description: "Daftar teks minimalis, tanpa gambar." },
    { value: "compact-list",               labelKey: "variantMenuCompactList",             label: "List Ringkas",        group: "List",        descriptionKey: "variantMenuCompactListDesc",             description: "Baris kompak dengan thumbnail kecil." },
    { value: "tabs-by-category",           labelKey: "variantMenuTabsByCategory",          label: "Tab Kategori",        group: "Kategori",    descriptionKey: "variantMenuTabsByCategoryDesc",          description: "Tab per kategori menu di atas." },
    { value: "accordion-by-category",      labelKey: "variantMenuAccordionByCategory",     label: "Akordion Kategori",   group: "Kategori",    descriptionKey: "variantMenuAccordionByCategoryDesc",     description: "Tiap kategori bisa di-expand." },
    { value: "bento-photo-grid",           labelKey: "variantMenuBentoPhotoGrid",          label: "Bento Foto Grid",     group: "Visual Foto", descriptionKey: "variantMenuBentoPhotoGridDesc",          description: "Grid bento gaya foto besar, kaya visual." },
    { value: "visual-showcase-hero",       labelKey: "variantMenuVisualShowcaseHero",      label: "Hero Visual",         group: "Visual Foto", descriptionKey: "variantMenuVisualShowcaseHeroDesc",      description: "Hero besar dengan katalog visual di bawahnya." },
    { value: "sidebar-scrollspy-photo",    labelKey: "variantMenuSidebarScrollspyPhoto",   label: "Sidebar Scrollspy",   group: "Visual Foto", descriptionKey: "variantMenuSidebarScrollspyPhotoDesc",   description: "Navigasi kategori sticky + konten foto di sisi kanan." },
    { value: "horizontal-swipe-carousel",  labelKey: "variantMenuCarousel",                label: "Carousel Horizontal", group: "Visual Foto", descriptionKey: "variantMenuCarouselDesc",                description: "Kartu menu besar yang bisa di-swipe horizontal per kategori." },
    { value: "masonry-flow",               labelKey: "variantMenuMasonry",                 label: "Aliran Masonry",      group: "Visual Foto", descriptionKey: "variantMenuMasonryDesc",                 description: "Layout Pinterest dengan tinggi kartu menu bervariasi." },
  ],
  catalog: [
    { value: "grid",                       labelKey: "variantCatalogGrid",                    label: "Grid",                 group: "Dasar",       descriptionKey: "variantCatalogGridDesc",                    description: "Kartu produk standar dalam grid." },
    { value: "compact",                    labelKey: "variantCatalogCompact",                 label: "Ringkas",              group: "Dasar",       descriptionKey: "variantCatalogCompactDesc",                 description: "List kompak nama + harga." },
    { value: "cards",                      labelKey: "variantCatalogCards",                   label: "Kartu",                group: "Dasar",       descriptionKey: "variantCatalogCardsDesc",                   description: "Kartu besar dengan foto dan badge." },
    { value: "grid-dense",                 labelKey: "variantCatalogGridDense",               label: "Grid Padat",           group: "Padat",       descriptionKey: "variantCatalogGridDenseDesc",               description: "Grid lebih rapat, lebih banyak produk per baris." },
    { value: "showcase-featured",          labelKey: "variantCatalogShowcaseFeatured",        label: "Showcase Unggulan",    group: "Padat",       descriptionKey: "variantCatalogShowcaseFeaturedDesc",        description: "Produk berbadge ditampilkan lebih besar." },
    { value: "tabs-by-category",           labelKey: "variantCatalogTabsByCategory",          label: "Tab Kategori",         group: "Kategori",    descriptionKey: "variantCatalogTabsByCategoryDesc",          description: "Tab per kategori produk." },
    { value: "editorial-grid",             labelKey: "variantCatalogEditorialGrid",           label: "Grid Editorial",       group: "Visual Foto", descriptionKey: "variantCatalogEditorialGridDesc",           description: "Grid asimetris gaya majalah, ukuran kartu bervariasi." },
    { value: "masonry-flow",               labelKey: "variantCatalogMasonryFlow",             label: "Aliran Masonry",       group: "Visual Foto", descriptionKey: "variantCatalogMasonryFlowDesc",             description: "Layout Pinterest dengan tinggi kartu bervariasi." },
    { value: "instagram-square-grid",      labelKey: "variantCatalogInstagramGrid",           label: "Grid Instagram",       group: "Visual Foto", descriptionKey: "variantCatalogInstagramGridDesc",           description: "Kotak seragam seperti galeri Instagram." },
    { value: "split-hero-catalog",         labelKey: "variantCatalogSplitHero",               label: "Split Hero",           group: "Visual Foto", descriptionKey: "variantCatalogSplitHeroDesc",               description: "Split screen: hero besar kiri, list scroll kanan." },
    { value: "neo-brutalist-matrix",       labelKey: "variantCatalogNeoBrutalist",            label: "Matrix Brutalis",      group: "Visual Foto", descriptionKey: "variantCatalogNeoBrutalistDesc",            description: "Grid brutal dengan border tebal dan posisi miring." },
    { value: "horizontal-swipe-carousel",  labelKey: "variantCatalogHorizontalCarousel",      label: "Carousel Horizontal",  group: "Visual Foto", descriptionKey: "variantCatalogHorizontalCarouselDesc",      description: "Card besar yang bisa di-swipe horizontal." },
    { value: "product-table",              labelKey: "variantProductTable",                   label: "Tabel Spesifikasi",    group: "Tabel",       descriptionKey: "variantCatalogProductTableDesc",            description: "Tabel produk/spec-sheet dengan kolom harga, stok, dan aksi." },
    { value: "spotlight",                  labelKey: "variantSpotlight",                      label: "Sorotan Produk",       group: "Visual Foto", descriptionKey: "variantCatalogSpotlightDesc",               description: "Satu produk utama full-bleed dengan produk lain dalam grid." },
  ],
  contact: [
    { value: "classic-split",      labelKey: "variantContactClassicSplit",     label: "Klasik Split",        descriptionKey: "variantContactClassicSplitDesc",     description: "Form pesan di kiri, info kontak & peta di kanan." },
    { value: "whatsapp-direct",    labelKey: "variantContactWhatsAppDirect",   label: "WhatsApp Instan",     descriptionKey: "variantContactWhatsAppDirectDesc",   description: "Fokus tombol aksi WhatsApp cepat + preview pesan & badge online." },
    { value: "bento-grid",         labelKey: "variantContactBentoGrid",        label: "Bento Grid",          descriptionKey: "variantContactBentoGridDesc",        description: "Kartu modular tersusun rapi gaya bento box modern." },
    { value: "overlay-map",        labelKey: "variantContactOverlayMap",       label: "Overlay Peta",        descriptionKey: "variantContactOverlayMapDesc",       description: "Peta interaktif penuh dengan kartu kontak melayang." },
    { value: "dark-split",         labelKey: "variantContactDarkSplit",        label: "Dark Split",          descriptionKey: "variantContactDarkSplitDesc",        description: "Tema gelap premium kontras tinggi dengan aksen bercahaya." },
    { value: "minimal-centered",   labelKey: "variantContactMinimalCentered",  label: "Minimal Tengah",      descriptionKey: "variantContactMinimalCenteredDesc",  description: "Kartu kontak ringkas terpusat tanpa peta." },
  ],
  header: [
    { value: "left-logo-inline-nav",   labelKey: "variantHeaderLeftLogoInlineNav",  label: "Logo Kiri + Nav Inline",          descriptionKey: "variantHeaderLeftLogoInlineNavDesc",  description: "Logo di kiri, navigasi sejajar di kanan, CTA tombol." },
    { value: "centered-logo",          labelKey: "variantHeaderCenteredLogo",       label: "Logo Tengah",                     descriptionKey: "variantHeaderCenteredLogoDesc",       description: "Logo di tengah, navigasi di bawahnya, CTA tombol." },
    { value: "transparent-overlay",    labelKey: "variantHeaderTransparentOverlay", label: "Transparan (Hero Overlay)",        descriptionKey: "variantHeaderTransparentOverlayDesc", description: "Menimpa hero (teks putih), mengecil dan menjadi kaca buram setelah scroll." },
    { value: "logo-with-cta-button",   labelKey: "variantHeaderLogoWithCtaButton", label: "Logo + CTA Tombol",               descriptionKey: "variantHeaderLogoWithCtaButtonDesc",  description: "Logo kiri, nav tengah, tombol CTA warna solid di kanan." },
    { value: "stacked-logo-tagline",   labelKey: "variantHeaderStackedLogoTagline",label: "Logo + Tagline Tumpuk",            descriptionKey: "variantHeaderStackedLogoTaglineDesc", description: "Logo dan tagline vertikal di tengah, nav tipis di bawah." },
  ],
  footer: [
    { value: "minimal-band",         labelKey: "variantFooterMinimalBand",        label: "Band Minimal",           descriptionKey: "variantFooterMinimalBandDesc",        description: "Brand + tagline + copyright dalam satu baris gelap bersih." },
    { value: "columns-with-nav",     labelKey: "variantFooterColumnsWithNav",     label: "Kolom + Navigasi Cepat", descriptionKey: "variantFooterColumnsWithNavDesc",     description: "Multi-kolom dengan tautan navigasi landing page & tombol Kembali ke Atas." },
    { value: "columns-with-social",  labelKey: "variantFooterColumnsWithSocial",  label: "Kolom + Media Sosial",   descriptionKey: "variantFooterColumnsWithSocialDesc",  description: "Multi-kolom dengan tautan akun media sosial bisnis." },
    { value: "dark-contrast-band",   labelKey: "variantFooterDarkContrastBand",   label: "Band Gelap Kontras",     descriptionKey: "variantFooterDarkContrastBandDesc",   description: "Footer gelap solid dengan aksen warna primary, kontras kuat." },
    { value: "location-and-hours",   labelKey: "variantFooterLocationAndHours",   label: "Lokasi & Jam",           descriptionKey: "variantFooterLocationAndHoursDesc",   description: "Brand + alamat peta + jam operasional dalam grid bersih." },
  ],
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
