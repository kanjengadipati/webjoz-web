/**
 * hero-strings.ts
 *
 * String UI statis yang dirender di varian hero: label tampilan, aria-label,
 * alt gambar, dan placeholder editor yang berulang di banyak varian.
 * Bukan konten yang diedit pengguna.
 *
 * Pola penggunaan:
 *   import { heroStrings } from "./hero-strings";
 *   const s = heroStrings(language);
 *   <span>{s.availableForWork}</span>
 *
 * Untuk string yang sudah ada inline sebagai fallback InlineText (mis.
 * `defaultCta`), biarkan di file masing-masing — itu benar secara desain
 * karena nilainya bisa dioverride oleh konten AI.
 */

export interface HeroStaticStrings {
  /** Label availability pill di portrait-showcase, personal-billboard, chronology-badge */
  availableForWork: string;
  /** Judul baris milestone di chronology-badge */
  trackRecord: string;
  /** Label atas grid karya di work-preview-strip */
  featuredWork: string;
  /** Tombol arah ke lokasi di location-map */
  getDirections: string;
  /** Label chip lokasi di location-map */
  ourLocation: string;
  /** Stiker dekoratif "NEW" di neo-brutalist */
  newBadge: string;

  // ── Placeholder editor & alt gambar yang berulang antar varian ──
  shortLabel: string;
  heroImageAlt: string;
  heroBackgroundAlt: string;
  addAddress: string;
  addPhoneWa: string;
  addEmail: string;
  addOpeningHours: string;
  setOpeningHours: string;
  openingHours: string;
  valuePlaceholder: string;
  statLabelPlaceholder: string;

  // ── booking-form ──
  bookingReceived: string;
  bookingThanks: string;
  fullName: string;
  fullNamePlaceholder: string;
  whatsappNumber: string;
  whatsappPlaceholder: string;
  emailPlaceholder: string;
  needLabel: string;
  needPlaceholder: string;
  sending: string;

  // ── Kontrol carousel (aria-label / title) di image-carousel ──
  slideCounter: (current: number, total: number) => string;
  goToSlide: (n: number) => string;
  prevSlide: string;
  nextSlide: string;
  resumeAutoplay: string;
  pauseAutoplay: string;
}

const ID: HeroStaticStrings = {
  availableForWork: "Penerimaan Mahasiswa Baru",
  trackRecord: "Profil kami",
  featuredWork: "Karya Unggulan",
  getDirections: "Rute ke lokasi",
  ourLocation: "Lokasi kami",
  newBadge: "BARU",
  shortLabel: "Label singkat",
  heroImageAlt: "Gambar hero",
  heroBackgroundAlt: "Latar hero",
  addAddress: "Tambah alamat...",
  addPhoneWa: "Tambah telepon / WA...",
  addEmail: "Tambah alamat email...",
  addOpeningHours: "Tambah jam buka...",
  setOpeningHours: "Atur jam operasional...",
  openingHours: "Jam buka",
  valuePlaceholder: "500+",
  statLabelPlaceholder: "Klien Puas",
  bookingReceived: "Pesanan diterima!",
  bookingThanks: "Terima kasih. Tim kami akan segera mengonfirmasi pesanan Anda.",
  fullName: "Nama Lengkap",
  fullNamePlaceholder: "cth. Budi Santoso",
  whatsappNumber: "Nomor WA",
  whatsappPlaceholder: "cth. 08123456789",
  emailPlaceholder: "budi@email.com",
  needLabel: "Kebutuhan Anda",
  needPlaceholder: "Tanggal, layanan, atau pertanyaan...",
  sending: "Mengirim...",
  slideCounter: (c, n) => `Slide ${c} dari ${n}`,
  goToSlide: (n) => `Menuju slide ${n}`,
  prevSlide: "Slide sebelumnya",
  nextSlide: "Slide berikutnya",
  resumeAutoplay: "Lanjutkan putar otomatis",
  pauseAutoplay: "Jeda putar otomatis",
};

const EN: HeroStaticStrings = {
  availableForWork: "Now Enrolling",
  trackRecord: "Our milestones",
  featuredWork: "Featured Work",
  getDirections: "Get directions",
  ourLocation: "Our location",
  newBadge: "NEW",
  shortLabel: "Short label",
  heroImageAlt: "Hero image",
  heroBackgroundAlt: "Hero background",
  addAddress: "Add address...",
  addPhoneWa: "Add phone or WhatsApp...",
  addEmail: "Add email address...",
  addOpeningHours: "Add opening hours...",
  setOpeningHours: "Set opening hours...",
  openingHours: "Opening hours",
  valuePlaceholder: "500+",
  statLabelPlaceholder: "Happy Clients",
  bookingReceived: "Booking received!",
  bookingThanks: "Thank you. Our team will confirm your booking shortly.",
  fullName: "Full Name",
  fullNamePlaceholder: "e.g. John Smith",
  whatsappNumber: "WhatsApp Number",
  whatsappPlaceholder: "+62 812...",
  emailPlaceholder: "john@email.com",
  needLabel: "What do you need?",
  needPlaceholder: "Preferred date, service, or question...",
  sending: "Sending...",
  slideCounter: (c, n) => `Slide ${c} of ${n}`,
  goToSlide: (n) => `Go to slide ${n}`,
  prevSlide: "Previous slide",
  nextSlide: "Next slide",
  resumeAutoplay: "Resume autoplay",
  pauseAutoplay: "Pause autoplay",
};

export function heroStrings(language?: string): HeroStaticStrings {
  return language === "en" ? EN : ID;
}
