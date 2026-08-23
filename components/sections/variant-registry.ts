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
    { value: "timeline", label: "Timeline", description: "Kronologi perjalanan bisnis (membutuhkan milestones)." },
    { value: "team-grid", label: "Grid Tim", description: "Grid anggota tim (membutuhkan team_members)." },
  ],
  benefits: [
    { value: "grid", label: "Grid", description: "Kartu ikon tersusun grid rapi." },
    { value: "featured-grid", label: "Grid Highlight", description: "Kartu pertama berukuran besar sebagai sorotan utama, sisanya dalam grid rapi." },
    { value: "icon-row", label: "Baris Ikon Horizontal", description: "Ikon lingkaran besar terpusat berjajar horizontal dengan garis pemisah." },
    { value: "stat-grid", label: "Grid Statistik", description: "Grid dengan angka/statistik di tiap item." },
    { value: "checklist", label: "Checklist", description: "List centang vertikal, sederhana dan langsung." },
    { value: "comparison-table", label: "Tabel Perbandingan", description: "Perbandingan A vs B dalam tabel (membutuhkan comparison)." },
  ],
  testimonials: [
    { value: "carousel", label: "Carousel", description: "Slide otomatis, satu testimoni per tampilan." },
    { value: "compact", label: "Ringkas", description: "Avatar kecil + kutipan singkat dalam satu baris." },
    { value: "grid", label: "Grid", description: "Semua testimoni tampil sekaligus dalam grid." },
    { value: "logo-wall", label: "Logo Klien", description: "Logo perusahaan klien (membutuhkan logo_url)." },
    { value: "featured-spotlight", label: "Sorotan", description: "Satu testimoni utama ditonjolkan." },
    { value: "google-reviews", label: "Google Reviews", description: "Kartu gaya Google: foto profil, bintang, badge Google." },
  ],
  cta: [
    { value: "banner", label: "Banner", description: "Strip warna penuh lebar, teks + tombol." },
    { value: "card", label: "Kartu", description: "Kotak terpusat dengan shadow dan border." },
    { value: "centered", label: "Tengah", description: "Teks dan tombol rata tengah tanpa background." },
    { value: "split-image", label: "Split + Gambar", description: "Teks di kiri, gambar di kanan (membutuhkan image_url)." },
  ],
  faq: [
    { value: "accordion", label: "Akordion", description: "Expand/collapse per item, hemat ruang." },
    { value: "simple", label: "Sederhana", description: "Semua Q&A tampil terbuka tanpa interaksi." },
    { value: "columns", label: "Kolom", description: "2 kolom Q&A berdampingan." },
    { value: "sidebar-category", label: "Kategori Sidebar", description: "Filter Q&A per kategori (membutuhkan category)." },
    { value: "two-column-grid", label: "Grid 2 Kolom", description: "Q&A dalam kartu grid 2 kolom, semua terbuka." },
    { value: "chat-bubble-style", label: "Gaya Chat", description: "Q&A seperti percakapan chat — pertanyaan di kanan, jawaban di kiri." },
  ],
  gallery: [
    { value: "grid", label: "Grid", description: "Foto dalam kotak seragam tersusun rapi." },
    { value: "masonry", label: "Masonry", description: "Tinggi foto bervariasi seperti Pinterest." },
    { value: "carousel", label: "Carousel", description: "Foto slide bergilir otomatis." },
    { value: "lightbox-story", label: "Story Lightbox", description: "Grid foto yang membuka fullscreen dengan narasi besar dan navigasi cerita." },
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
    { value: "classic-split", label: "Klasik Split", description: "Form pesan di kiri, info kontak & peta di kanan." },
    { value: "whatsapp-direct", label: "WhatsApp Instan", description: "Fokus tombol aksi WhatsApp cepat + preview pesan & badge online." },
    { value: "bento-grid", label: "Bento Grid", description: "Kartu modular tersusun rapi gaya bento box modern." },
    { value: "overlay-map", label: "Overlay Peta", description: "Peta interaktif penuh dengan kartu kontak melayang." },
    { value: "dark-split", label: "Dark Split", description: "Tema gelap premium kontras tinggi dengan aksen bercahaya." },
    { value: "minimal-centered", label: "Minimal Tengah", description: "Kartu kontak ringkas terpusat tanpa peta." },
  ],
  header: [
    { value: "left-logo-inline-nav", label: "Logo Kiri + Nav Inline", description: "Logo di kiri, navigasi sejajar di kanan, CTA tombol." },
    { value: "centered-logo", label: "Logo Tengah", description: "Logo di tengah, navigasi di bawahnya, CTA tombol." },
    { value: "transparent-overlay", label: "Transparan (Hero Overlay)", description: "Transparan di atas hero, solid setelah scroll." },
    { value: "logo-with-cta-button", label: "Logo + CTA Tombol", description: "Logo kiri, nav tengah, tombol CTA warna solid di kanan." },
    { value: "stacked-logo-tagline", label: "Logo + Tagline Tumpuk", description: "Logo dan tagline vertikal di tengah, nav tipis di bawah." },
  ],
  footer: [
    { value: "minimal-band", label: "Band Minimal", description: "Brand + tagline + copyright dalam satu baris gelap bersih." },
    { value: "columns-with-nav", label: "Kolom + Navigasi Cepat", description: "Multi-kolom dengan tautan navigasi landing page & tombol Kembali ke Atas." },
    { value: "columns-with-social", label: "Kolom + Media Sosial", description: "Multi-kolom dengan tautan akun media sosial bisnis." },
    { value: "dark-contrast-band", label: "Band Gelap Kontras", description: "Footer gelap solid dengan aksen warna primary, kontras kuat." },
  ],
  blog: [
    { value: "grid", label: "Grid", description: "Kartu dalam 3 kolom rapi." },
    { value: "list", label: "List", description: "Horizontal dengan gambar di kiri, teks di kanan." },
    { value: "featured", label: "Unggulan", description: "Satu postingan besar hero + grid kecil di bawah." },
    { value: "minimal", label: "Minimal", description: "Daftar judul dan tanggal tanpa gambar." },
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
