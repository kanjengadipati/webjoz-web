// Single source of truth for all section variant options.
// Every consumer (editor dropdown, design-assets admin UI, etc.) imports from here.

export interface VariantOption {
  value: string;
  label: string;
  description?: string;
  group?: string; // optional grouping label for dropdown submenu (e.g. "Dasar", "Visual Foto")
}

export const SECTION_VARIANT_OPTIONS: Record<string, VariantOption[]> = {
  about: [
    { value: "classic", label: "Klasik", description: "Teks di kiri, konten bersih tanpa gambar besar." },
    { value: "split-image", label: "Split + Gambar", description: "Teks di kiri, gambar besar di kanan." },
    { value: "stat-heavy", label: "Statistik", description: "Tampilkan angka highlight dan statistik bisnis." },
  ],
  benefits: [
    { value: "grid", label: "Grid", description: "Kartu ikon tersusun grid rapi." },
    { value: "stat-grid", label: "Grid Statistik", description: "Grid dengan angka/statistik di tiap item." },
    { value: "checklist", label: "Checklist", description: "List centang vertikal, sederhana dan langsung." },
  ],
  testimonials: [
    { value: "carousel", label: "Carousel", description: "Slide otomatis, satu testimoni per tampilan." },
    { value: "compact", label: "Ringkas", description: "Avatar kecil + kutipan singkat dalam satu baris." },
    { value: "grid", label: "Grid", description: "Semua testimoni tampil sekaligus dalam grid." },
  ],
  cta: [
    { value: "banner", label: "Banner", description: "Strip warna penuh lebar, teks + tombol." },
    { value: "card", label: "Kartu", description: "Kotak terpusat dengan shadow dan border." },
    { value: "centered", label: "Tengah", description: "Teks dan tombol rata tengah tanpa background." },
  ],
  faq: [
    { value: "accordion", label: "Akordion", description: "Expand/collapse per item, hemat ruang." },
    { value: "simple", label: "Sederhana", description: "Semua Q&A tampil terbuka tanpa interaksi." },
    { value: "columns", label: "Kolom", description: "2 kolom Q&A berdampingan." },
  ],
  gallery: [
    { value: "grid", label: "Grid", description: "Foto dalam kotak seragam tersusun rapi." },
    { value: "masonry", label: "Masonry", description: "Tinggi foto bervariasi seperti Pinterest." },
    { value: "carousel", label: "Carousel", description: "Foto slide bergilir otomatis." },
  ],
  menu: [
    { value: "grid", label: "Grid", group: "Dasar", description: "Kartu produk dalam grid dengan foto." },
    { value: "compact", label: "Ringkas", group: "Dasar", description: "List kompak nama + harga tanpa foto besar." },
    { value: "cards", label: "Kartu", group: "Dasar", description: "Kartu besar dengan foto dan deskripsi." },
    { value: "text-list", label: "Teks List", group: "List", description: "Daftar teks minimalis, tanpa gambar." },
    { value: "compact-list", label: "List Ringkas", group: "List", description: "Baris kompak dengan thumbnail kecil." },
    { value: "tabs-by-category", label: "Tab Kategori", group: "Kategori", description: "Tab per kategori menu di atas." },
    { value: "accordion-by-category", label: "Akordion Kategori", group: "Kategori", description: "Tiap kategori bisa di-expand." },
    { value: "bento-photo-grid", label: "Bento Foto Grid", group: "Visual Foto", description: "Grid bento gaya foto besar, kaya visual." },
    { value: "visual-showcase-hero", label: "Hero Visual", group: "Visual Foto", description: "Hero besar dengan katalog visual di bawahnya." },
    { value: "sidebar-scrollspy-photo", label: "Sidebar Scrollspy", group: "Visual Foto", description: "Navigasi kategori sticky + konten foto di sisi kanan." },
  ],
  catalog: [
    { value: "grid", label: "Grid", group: "Dasar", description: "Kartu produk standar dalam grid." },
    { value: "compact", label: "Ringkas", group: "Dasar", description: "List kompak nama + harga." },
    { value: "cards", label: "Kartu", group: "Dasar", description: "Kartu besar dengan foto dan badge." },
    { value: "grid-dense", label: "Grid Padat", group: "Padat", description: "Grid lebih rapat, lebih banyak produk per baris." },
    { value: "showcase-featured", label: "Showcase Unggulan", group: "Padat", description: "Produk berbadge ditampilkan lebih besar." },
    { value: "tabs-by-category", label: "Tab Kategori", group: "Kategori", description: "Tab per kategori produk." },
    { value: "editorial-grid", label: "Grid Editorial", group: "Visual Foto", description: "Grid asimetris gaya majalah, ukuran kartu bervariasi." },
    { value: "masonry-flow", label: "Aliran Masonry", group: "Visual Foto", description: "Layout Pinterest dengan tinggi kartu bervariasi." },
    { value: "instagram-square-grid", label: "Grid Instagram", group: "Visual Foto", description: "Kotak seragam seperti galeri Instagram." },
    { value: "split-hero-catalog", label: "Split Hero", group: "Visual Foto", description: "Split screen: hero besar kiri, list scroll kanan." },
    { value: "neo-brutalist-matrix", label: "Matrix Brutalis", group: "Visual Foto", description: "Grid brutal dengan border tebal dan posisi miring." },
    { value: "horizontal-swipe-carousel", label: "Carousel Horizontal", group: "Visual Foto", description: "Card besar yang bisa di-swipe horizontal." },
  ],
  contact: [
    { value: "classic-split", label: "Klasik Split", description: "Form kiri, info kontak kanan." },
    { value: "minimal-centered", label: "Minimal Tengah", description: "Kontak terpusat tanpa peta." },
    { value: "overlay-map", label: "Overlay Peta", description: "Peta penuh dengan info overlay di atas." },
    { value: "bento-grid", label: "Bento Grid", description: "Kartu info tersusun bento." },
    { value: "dark-split", label: "Dark Split", description: "Split gelap premium, form + kontak." },
  ],
  header: [
    { value: "left-logo-inline-nav", label: "Logo Kiri + Nav Inline", description: "Logo di kiri, navigasi sejajar di kanan, CTA tombol." },
    { value: "centered-logo", label: "Logo Tengah", description: "Logo di tengah, navigasi di bawahnya, CTA tombol." },
    { value: "transparent-overlay", label: "Transparan (Hero Overlay)", description: "Transparan di atas hero, solid setelah scroll." },
  ],
  footer: [
    { value: "minimal-band", label: "Band Minimal", description: "Brand + tagline + copyright dalam satu baris gelap." },
    { value: "columns-with-social", label: "Kolom + Sosial Media", description: "Multi-kolom dengan link media sosial." },
    { value: "newsletter-cta", label: "Newsletter CTA", description: "Ajakan hubungi kami + copyright." },
  ],
};

export function getVariantLabel(section: string, value: string): string {
  return SECTION_VARIANT_OPTIONS[section]?.find((v) => v.value === value)?.label ?? value;
}

export function getVariantDescription(section: string, value: string): string {
  return SECTION_VARIANT_OPTIONS[section]?.find((v) => v.value === value)?.description ?? "";
}

export function getVariantValues(section: string): string[] {
  return SECTION_VARIANT_OPTIONS[section]?.map((v) => v.value) ?? [];
}
